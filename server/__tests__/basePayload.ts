import assert from "node:assert/strict";
import test from "node:test";
import { PaymentWebhookPayload, BookingSyncStore, BookingSyncService } from "../booking-sync";
import { FrappeClient } from "../frappe";

const basePayload: PaymentWebhookPayload = {
    payment_intent_id: "pi_test_123",
    payment_status: "succeeded",
    amount: 150,
    currency: "USD",
    processor: "stripe",
    paid_at: "2025-01-10T00:00:00Z",
    customer: {
        email: "traveler@example.com",
        full_name: "Traveler Example",
    },
    booking: {
        id: "booking_123",
        pickup_location: "Jeddah Airport",
        dropoff_location: "Makkah",
        service_date: "2025-02-01",
        passengers: 3,
    },
};
function createResponse(name: string, ok = true) {
    return {
        ok,
        status: ok ? 200 : 500,
        async json() {
            return { data: { name } };
        },
        async text() {
            return ok ? "" : "Server error";
        },
    } as const;
}
test("syncs customer, booking, and payment into Frappe with idempotency", async () => {
    const responses = [
        createResponse("cust-001"),
        createResponse("booking-001"),
        createResponse("payment-001"),
    ];

    const fetchMock = async () => responses.shift() ?? createResponse("fallback");

    const client = new FrappeClient(
        {
            baseUrl: "https://frappe.example.com",
            apiKey: "key",
            apiSecret: "secret",
        },
        fetchMock as unknown as typeof fetch
    );

    const store = new BookingSyncStore();
    const service = new BookingSyncService({
        client,
        store,
        retryQueue: { enqueue: () => { } },
    });

    const result = await service.syncFromWebhook(basePayload);

    assert.equal(result.synced, true);
    assert.equal(result.queued, false);

    const record = store.get(basePayload.payment_intent_id);
    assert.ok(record, "record is persisted");
    assert.equal(record?.status, "synced");
    assert.equal(record?.frappeCustomerName, "cust-001");
    assert.equal(record?.frappeBookingName, "booking-001");
    assert.equal(record?.frappePaymentName, "payment-001");
});
test("queues retry and preserves booking state when Frappe sync fails", async () => {
    let callCount = 0;
    const fetchMock = async () => {
        callCount += 1;
        return createResponse("error", false);
    };

    const client = new FrappeClient(
        {
            baseUrl: "https://frappe.example.com",
            apiKey: "key",
            apiSecret: "secret",
        },
        fetchMock as unknown as typeof fetch
    );

    const queuedTasks: Array<() => Promise<unknown>> = [];
    const store = new BookingSyncStore();
    const service = new BookingSyncService({
        client,
        store,
        retryQueue: {
            enqueue: (task) => {
                queuedTasks.push(task);
            },
        },
        maxRetries: 2,
    });

    const result = await service.syncFromWebhook(basePayload);

    assert.equal(callCount, 1);
    assert.equal(result.synced, false);
    assert.equal(result.queued, true);
    assert.ok(result.errors?.[0]);
    assert.equal(queuedTasks.length, 1, "retry task scheduled");

    const record = store.get(basePayload.payment_intent_id);
    assert.ok(record, "record is stored");
    assert.equal(record?.status, "sync_failed");
    assert.ok(record?.lastError);
});
