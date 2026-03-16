import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  image: string;
  seats: number;
  checkedLuggage: number;
  cabinBags: number;
  description: string;
  pricePerKm: number;
}

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  price: number;
  duration: string;
  distance: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  label: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export interface QuoteFormData {
  fullName: string;
  mobileNo: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  passengers: number;
  returnTrip: boolean;
  additionalStops: string[];
}

export const quoteFormSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  mobileNo: z.string().min(8, "Please enter a valid phone number"),
  pickupLocation: z.string().min(1, "Please select pickup location"),
  dropoffLocation: z.string().min(1, "Please select dropoff location"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  passengers: z.number().min(1).max(14),
  returnTrip: z.boolean(),
  additionalStops: z.array(z.string()),
});

export interface SignupFormData {
  full_name: string;
  email: string;
  mobile_no: string;
  password: string;
}

export const signupFormSchema = z.object({
  full_name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  mobile_no: z.string().min(8, "Please enter a valid mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
