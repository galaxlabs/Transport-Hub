import type { Express } from "express";
import { createServer, type Server } from "http";
import { contactFormSchema, quoteFormSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  return httpServer;
}
