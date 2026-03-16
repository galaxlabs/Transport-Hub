export interface PublicRouteOption {
  name: string;
  route_code: string;
  route_name: string;
  route_title: string;
  source: string;
  destination: string;
  distance_km: number;
  estimated_duration_minutes: number;
  price: number;
  currency: string;
  pricing_rule?: string;
  label: string;
}

export interface PublicBookingContext {
  base_company: string;
  routes: PublicRouteOption[];
  locations: string[];
}

export interface PublicBookingPayload {
  base_company?: string;
  route?: string;
  source: string;
  destination: string;
  passenger_name: string;
  email?: string;
  mobile_no: string;
  alternate_mobile?: string;
  seat_count: number;
  notes?: string;
  source_channel?: string;
}

export interface SignupPayload {
  full_name: string;
  email: string;
  mobile_no: string;
  password: string;
}

function getFrappeBase() {
  const configured = (import.meta.env.VITE_FRAPPE_URL as string | undefined)?.replace(/\/$/, "");
  if (configured) {
    return configured;
  }
  if (typeof window !== "undefined") {
    return window.location.origin.replace(/\/$/, "");
  }
  return "";
}

function makeUrl(method: string) {
  const base = getFrappeBase();
  return `${base}/api/method/${method}`;
}

async function frappeRequest<T>(method: string, payload?: unknown): Promise<T> {
  const response = await fetch(makeUrl(method), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const data = await response.json();
  if (!response.ok || data.exc) {
    throw new Error(data.message || data._server_messages || response.statusText);
  }
  return (data.message ?? data) as T;
}

export interface PublicMapsConfig {
  enabled: boolean;
  api_key?: string;
  country?: string;
}

export function getPublicBookingContext(base_company?: string) {
  return frappeRequest<PublicBookingContext>("tss.api.website.get_public_booking_context", { base_company });
}

export function getPublicMapsConfig() {
  return frappeRequest<PublicMapsConfig>("tss.api.website.get_public_maps_config");
}

export function createPublicTripBooking(payload: PublicBookingPayload) {
  return frappeRequest<{ name: string; booking_code: string; route: string; fare_amount: number }>(
    "tss.api.website.create_public_trip_booking",
    payload,
  );
}

export function signupCustomer(payload: SignupPayload) {
  return frappeRequest<{ user: string; customer?: string; created_customer: boolean; erpnext_available: boolean }>(
    "tss.api.website.signup_customer",
    payload,
  );
}
