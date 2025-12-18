export interface FrappeClientConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
}

export interface FrappeDocument<T = Record<string, unknown>> {
  name: string;
  data?: T;
}

export interface FrappeFieldMap {
  [key: string]: string;
}

export const frappeDoctypes = {
  customer: {
    name: "Transport Customer",
    fields: {
      externalId: "external_id",
      fullName: "full_name",
      email: "email",
      phone: "phone_number",
    },
  },
  booking: {
    name: "Transport Booking",
    fields: {
      bookingReference: "booking_reference",
      customer: "customer",
      pickupLocation: "pickup_location",
      dropoffLocation: "dropoff_location",
      serviceDate: "service_date",
      passengers: "passenger_count",
      status: "status",
      currency: "currency",
      amount: "fare_amount",
      paymentIntent: "payment_intent_id",
    },
  },
  payment: {
    name: "Transport Payment",
    fields: {
      booking: "booking",
      amount: "amount",
      currency: "currency",
      processor: "processor",
      processorPaymentIntent: "processor_payment_intent",
      status: "status",
      paidAt: "paid_at",
    },
  },
} as const;

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function toHeaderIdempotencyKey(idempotencyKey?: string): Record<string, string> {
  return idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {};
}

export class FrappeClient {
  private readonly baseUrl: string;
  private readonly httpClient: typeof fetch;

  constructor(config: FrappeClientConfig, httpClient: typeof fetch = fetch) {
    this.baseUrl = normalizeBaseUrl(config.baseUrl);
    this.httpClient = httpClient;
    this.config = config;
  }

  private readonly config: FrappeClientConfig;

  private buildHeaders(idempotencyKey?: string): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `token ${this.config.apiKey}:${this.config.apiSecret}`,
      ...toHeaderIdempotencyKey(idempotencyKey),
    };
  }

  async upsertDocument<TResponse = FrappeDocument>(
    doctype: string,
    name: string,
    payload: Record<string, unknown>,
    idempotencyKey?: string,
  ): Promise<TResponse> {
    const url = `${this.baseUrl}/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`;
    const response = await this.httpClient(url, {
      method: "PUT",
      headers: this.buildHeaders(idempotencyKey),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await response
        .text()
        .catch(() => `Frappe responded with status ${response.status}`);
      throw new Error(message || `Frappe responded with status ${response.status}`);
    }

    const json = (await response.json().catch(() => ({}))) as {
      data?: TResponse;
    };
    return (json.data as TResponse) ?? (json as unknown as TResponse);
  }
}

export function getFrappeConfigFromEnv(): FrappeClientConfig | null {
  const baseUrl = process.env.FRAPPE_BASE_URL;
  const apiKey = process.env.FRAPPE_API_KEY;
  const apiSecret = process.env.FRAPPE_API_SECRET;

  if (!baseUrl || !apiKey || !apiSecret) {
    return null;
  }

  return {
    baseUrl,
    apiKey,
    apiSecret,
  };
}

export function sanitizeFrappeName(input: string): string {
  const sanitized = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);

  return sanitized || "record";
}