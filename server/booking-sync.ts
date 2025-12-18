import { z } from "zod";
import {
  FrappeClient,
  frappeDoctypes,
  sanitizeFrappeName,
} from "./frappe";

export const paymentWebhookSchema = z.object({
  payment_intent_id: z.string().min(1),
  payment_status: z.enum(["succeeded", "failed"]),
  amount: z.number().positive(),
  currency: z.string().min(1),
  processor: z.string().min(1),
  paid_at: z.string().optional(),
  customer: z.object({
    id: z.string().optional(),
    email: z.string().email(),
    full_name: z.string().min(1),
    phone: z.string().optional(),
  }),
  booking: z.object({
    id: z.string().min(1),
    pickup_location: z.string().min(1),
    dropoff_location: z.string().min(1),
    service_date: z.string().min(1),
    passengers: z.number().min(1),
  }),
  metadata: z.record(z.string()).optional(),
});

export type PaymentWebhookPayload = z.infer<typeof paymentWebhookSchema>;

export type BookingSyncStatus =
  | "pending"
  | "paid"
  | "failed"
  | "syncing"
  | "synced"
  | "sync_failed";

export interface BookingSyncRecord {
  bookingId: string;
  paymentIntentId: string;
  status: BookingSyncStatus;
  amount: number;
  currency: string;
  frappeCustomerName?: string;
  frappeBookingName?: string;
  frappePaymentName?: string;
  attempts: number;
  lastError?: string;
  updatedAt: string;
}

export interface RetryQueue {
  enqueue(task: () => Promise<SyncResult>): void;
}

export class InMemoryRetryQueue implements RetryQueue {
  constructor(private readonly delayMs = 5000) {}

  enqueue(task: () => Promise<SyncResult>) {
    setTimeout(() => {
      task().catch((error) => {
        console.error("Retry task failed", error);
      });
    }, this.delayMs);
  }
}

export class BookingSyncStore {
  private readonly records = new Map<string, BookingSyncRecord>();

  get(paymentIntentId: string): BookingSyncRecord | undefined {
    return this.records.get(paymentIntentId);
  }

  upsertFromWebhook(
    payload: PaymentWebhookPayload,
    status: BookingSyncStatus,
  ): BookingSyncRecord {
    const existing = this.get(payload.payment_intent_id);
    const record: BookingSyncRecord = {
      bookingId: payload.booking.id,
      paymentIntentId: payload.payment_intent_id,
      status,
      amount: payload.amount,
      currency: payload.currency,
      attempts: existing?.attempts ?? 0,
      lastError: existing?.lastError,
      frappeBookingName: existing?.frappeBookingName,
      frappeCustomerName: existing?.frappeCustomerName,
      frappePaymentName: existing?.frappePaymentName,
      updatedAt: new Date().toISOString(),
    };

    this.records.set(payload.payment_intent_id, record);
    return record;
  }

  markSyncing(paymentIntentId: string): BookingSyncRecord | undefined {
    const record = this.get(paymentIntentId);
    if (!record) return undefined;

    const updated: BookingSyncRecord = {
      ...record,
      status: "syncing",
      attempts: record.attempts + 1,
      updatedAt: new Date().toISOString(),
    };
    this.records.set(paymentIntentId, updated);
    return updated;
  }

  markSynced(
    paymentIntentId: string,
    details: Pick<
      BookingSyncRecord,
      "frappeBookingName" | "frappeCustomerName" | "frappePaymentName"
    >,
  ): BookingSyncRecord | undefined {
    const record = this.get(paymentIntentId);
    if (!record) return undefined;

    const updated: BookingSyncRecord = {
      ...record,
      ...details,
      status: "synced",
      lastError: undefined,
      updatedAt: new Date().toISOString(),
    };
    this.records.set(paymentIntentId, updated);
    return updated;
  }

  markFailed(paymentIntentId: string, error?: string): BookingSyncRecord | undefined {
    const record = this.get(paymentIntentId);
    if (!record) return undefined;

    const updated: BookingSyncRecord = {
      ...record,
      status: "sync_failed",
      lastError: error,
      updatedAt: new Date().toISOString(),
    };
    this.records.set(paymentIntentId, updated);
    return updated;
  }
}

export interface BookingSyncServiceOptions {
  client: FrappeClient | null;
  store?: BookingSyncStore;
  retryQueue?: RetryQueue;
  maxRetries?: number;
}

export interface SyncResult {
  synced: boolean;
  queued: boolean;
  record: BookingSyncRecord;
  errors?: string[];
}

export class BookingSyncService {
  private readonly client: FrappeClient | null;
  private readonly store: BookingSyncStore;
  private readonly retryQueue: RetryQueue;
  private readonly maxRetries: number;

  constructor(options: BookingSyncServiceOptions) {
    this.client = options.client;
    this.store = options.store ?? new BookingSyncStore();
    this.retryQueue = options.retryQueue ?? new InMemoryRetryQueue();
    this.maxRetries = options.maxRetries ?? 3;
  }

  getStore() {
    return this.store;
  }

  async syncFromWebhook(
    payload: PaymentWebhookPayload,
    attempt = 1,
  ): Promise<SyncResult> {
    const initialStatus: BookingSyncStatus =
      payload.payment_status === "succeeded" ? "paid" : "failed";
    const record = this.store.upsertFromWebhook(payload, initialStatus);

    if (payload.payment_status !== "succeeded") {
      return { synced: false, queued: false, record };
    }

    this.store.markSyncing(payload.payment_intent_id);

    if (!this.client) {
      const failedRecord =
        this.store.markFailed(payload.payment_intent_id, "Frappe client not configured") ??
        record;
      return { synced: false, queued: false, record: failedRecord, errors: ["Frappe client not configured"] };
    }

    try {
      const customerName = await this.syncCustomer(payload);
      const bookingName = await this.syncBooking(payload, customerName);
      const paymentName = await this.syncPayment(payload, bookingName);

      const syncedRecord =
        this.store.markSynced(payload.payment_intent_id, {
          frappeBookingName: bookingName,
          frappeCustomerName: customerName,
          frappePaymentName: paymentName,
        }) ?? record;

      return { synced: true, queued: false, record: syncedRecord };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown Frappe sync error";
      const failedRecord =
        this.store.markFailed(payload.payment_intent_id, errorMessage) ?? record;

      if (attempt < this.maxRetries) {
        this.retryQueue.enqueue(() => this.syncFromWebhook(payload, attempt + 1));
        return { synced: false, queued: true, record: failedRecord, errors: [errorMessage] };
      }

      return { synced: false, queued: false, record: failedRecord, errors: [errorMessage] };
    }
  }

  private async syncCustomer(payload: PaymentWebhookPayload): Promise<string> {
    const { fields, name } = frappeDoctypes.customer;
    const customerName = sanitizeFrappeName(payload.customer.id ?? payload.customer.email);

    const body = {
      [fields.externalId]: payload.customer.id ?? payload.customer.email,
      [fields.fullName]: payload.customer.full_name,
      [fields.email]: payload.customer.email,
      [fields.phone]: payload.customer.phone,
    };

    const response = await this.client!.upsertDocument<{ name: string }>(
      name,
      customerName,
      body,
      payload.payment_intent_id,
    );

    return response.name ?? customerName;
  }

  private async syncBooking(
    payload: PaymentWebhookPayload,
    customerName: string,
  ): Promise<string> {
    const { fields, name } = frappeDoctypes.booking;
    const bookingName = sanitizeFrappeName(payload.booking.id);

    const body = {
      [fields.bookingReference]: payload.booking.id,
      [fields.customer]: customerName,
      [fields.pickupLocation]: payload.booking.pickup_location,
      [fields.dropoffLocation]: payload.booking.dropoff_location,
      [fields.serviceDate]: payload.booking.service_date,
      [fields.passengers]: payload.booking.passengers,
      [fields.status]: "Paid",
      [fields.currency]: payload.currency,
      [fields.amount]: payload.amount,
      [fields.paymentIntent]: payload.payment_intent_id,
    };

    const response = await this.client!.upsertDocument<{ name: string }>(
      name,
      bookingName,
      body,
      payload.payment_intent_id,
    );

    return response.name ?? bookingName;
  }

  private async syncPayment(
    payload: PaymentWebhookPayload,
    bookingName: string,
  ): Promise<string> {
    const { fields, name } = frappeDoctypes.payment;
    const paymentName = sanitizeFrappeName(payload.payment_intent_id);

    const body = {
      [fields.booking]: bookingName,
      [fields.amount]: payload.amount,
      [fields.currency]: payload.currency,
      [fields.processor]: payload.processor,
      [fields.processorPaymentIntent]: payload.payment_intent_id,
      [fields.status]: payload.payment_status,
      [fields.paidAt]: payload.paid_at ?? new Date().toISOString(),
    };

    const response = await this.client!.upsertDocument<{ name: string }>(
      name,
      paymentName,
      body,
      payload.payment_intent_id,
    );

    return response.name ?? paymentName;
  }
}

export const bookingSyncStore = new BookingSyncStore();
export const bookingRetryQueue = new InMemoryRetryQueue();