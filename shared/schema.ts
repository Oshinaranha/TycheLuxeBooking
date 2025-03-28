import { pgTable, text, serial, integer, boolean, date, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'jet', 'yacht', 'car'
  name: text("name").notNull(),
  description: text("description").notNull(),
  detailedDescription: text("detailed_description"),
  imageUrl: text("image_url").notNull(),
  galleryUrls: text("gallery_urls").array(),
  model3dUrl: text("model_3d_url"), // URL to 3D model for interactive display
  pricePerHour: integer("price_per_hour"),
  pricePerDay: integer("price_per_day"),
  capacity: integer("capacity"),
  features: text("features").array(),
  specifications: jsonb("specifications"), // Detailed technical specs
  availabilityCalendar: jsonb("availability_calendar"), // JSON for availability dates
  isFeatured: boolean("is_featured").default(false),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  detailedDescription: text("detailed_description"),
  imageUrl: text("image_url").notNull(),
  galleryUrls: text("gallery_urls").array(),
  panoramaUrl: text("panorama_url"), // 360° panorama view URL
  rating: integer("rating").notNull(),
  region: text("region").notNull(),
  coordinates: jsonb("coordinates"), // Lat/long for map integration
  attractions: text("attractions").array(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  serviceType: text("service_type").notNull(), // 'jet', 'yacht', 'car'
  serviceId: integer("service_id"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  departureLocation: text("departure_location").notNull(),
  destination: text("destination").notNull(),
  destinationId: integer("destination_id"),
  guests: integer("guests").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  specialRequests: text("special_requests"),
  additionalServices: jsonb("additional_services"), // Add-ons selected by user
  status: text("status").default("pending"), // pending, confirmed, completed, cancelled
  paymentStatus: text("payment_status").default("unpaid"), // unpaid, paid, refunded
  estimatedPrice: integer("estimated_price").notNull(),
  finalPrice: integer("final_price"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("unread"), // unread, read, replied
  assignedTo: integer("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  avatar: text("avatar").notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull(),
  serviceType: text("service_type"),
  serviceId: integer("service_id"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  profileImage: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const bookingFormSchema = z.object({
  serviceType: z.string().min(1, { message: "Service type is required" }),
  serviceId: z.number().optional(),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  departureLocation: z.string().min(1, { message: "Departure location is required" }),
  destination: z.string().min(1, { message: "Destination is required" }),
  destinationId: z.number().optional(),
  guests: z.number().min(1, { message: "At least one guest is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  specialRequests: z.string().optional(),
  additionalServices: z.record(z.any()).optional(),
  estimatedPrice: z.number(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  assignedTo: true,
});

export const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
