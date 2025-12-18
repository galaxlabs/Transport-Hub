import type { Express } from "express";
import { createServer, type Server } from "http";
import { contactFormSchema, quoteFormSchema } from "@shared/schema";
import { z } from "zod";
import {
  BookingSyncService,
  bookingRetryQueue,
  bookingSyncStore,
  paymentWebhookSchema,
} from "./booking-sync";
import { FrappeClient, getFrappeConfigFromEnv } from "./frappe";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const frappeConfig = getFrappeConfigFromEnv();
  const frappeClient = frappeConfig
    ? new FrappeClient(frappeConfig)
    : null;
  const bookingSyncService = new BookingSyncService({
    client: frappeClient,
    store: bookingSyncStore,
    retryQueue: bookingRetryQueue,
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = contactFormSchema.parse(req.body);
      console.log("[Contact Form]", data);
      res.json({ success: true, message: "Message received successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Server error" });
      }
    }
  });

  app.post("/api/quote", async (req, res) => {
    try {
      const data = quoteFormSchema.parse(req.body);
      console.log("[Quote Request]", data);
      res.json({ success: true, message: "Quote request received" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Server error" });
      }
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/webhooks/payment", async (req, res) => {
    const parsedPayload = paymentWebhookSchema.safeParse(req.body);

    if (!parsedPayload.success) {
      return res
        .status(400)
        .json({ success: false, errors: parsedPayload.error.issues });
    }

    const payload = parsedPayload.data;

    try {
      const result = await bookingSyncService.syncFromWebhook(payload);
      const statusCode = result.synced ? 200 : 202;

      return res.status(statusCode).json({
        success: true,
        synced: result.synced,
        queued: result.queued,
        record: result.record,
        errors: result.errors,
      });
    } catch (error) {
      console.error("Unexpected error processing webhook", error);
      return res.status(202).json({
        success: true,
        synced: false,
        queued: true,
        errors: ["An unexpected error occurred; retry scheduled"],
      });
    }
  });

  return httpServer;
}

// import type { Express } from "express";
// import { createServer, type Server } from "http";
// import { contactFormSchema, quoteFormSchema } from "@shared/schema";
// import { z } from "zod";

// export async function registerRoutes(
//   httpServer: Server,
//   app: Express
// ): Promise<Server> {
  
//   app.post("/api/contact", async (req, res) => {
//     try {
//       const data = contactFormSchema.parse(req.body);
//       console.log("[Contact Form]", data);
//       res.json({ success: true, message: "Message received successfully" });
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         res.status(400).json({ success: false, errors: error.errors });
//       } else {
//         res.status(500).json({ success: false, message: "Server error" });
//       }
//     }
//   });

//   app.post("/api/quote", async (req, res) => {
//     try {
//       const data = quoteFormSchema.parse(req.body);
//       console.log("[Quote Request]", data);
//       res.json({ success: true, message: "Quote request received" });
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         res.status(400).json({ success: false, errors: error.errors });
//       } else {
//         res.status(500).json({ success: false, message: "Server error" });
//       }
//     }
//   });

//   app.get("/api/health", (_req, res) => {
//     res.json({ status: "ok", timestamp: new Date().toISOString() });
//   });

//   return httpServer;
// }
