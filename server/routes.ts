import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { bookingFormSchema, contactFormSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:type", async (req, res) => {
    try {
      const { type } = req.params;
      if (!["jet", "yacht", "car"].includes(type)) {
        return res.status(400).json({ message: "Invalid service type" });
      }
      const services = await storage.getServicesByType(type);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/detail/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service details" });
    }
  });

  // Destinations routes
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getAllDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const destination = await storage.getDestination(id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destination details" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = bookingFormSchema.parse(req.body);
      
      // Create a booking record with the parsed data
      const booking = await storage.createBooking({
        serviceType: bookingData.serviceType,
        startDate: new Date(bookingData.startDate),
        endDate: new Date(bookingData.endDate),
        departureLocation: bookingData.departureLocation,
        destination: bookingData.destination,
        guests: bookingData.guests,
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        specialRequests: bookingData.specialRequests,
        estimatedPrice: bookingData.estimatedPrice,
      });
      
      res.status(201).json({ 
        message: "Booking request submitted successfully", 
        booking 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactFormSchema.parse(req.body);
      
      // Create a contact record with the parsed data
      const contact = await storage.createContact({
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
      });
      
      res.status(201).json({ 
        message: "Message sent successfully", 
        contact 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
