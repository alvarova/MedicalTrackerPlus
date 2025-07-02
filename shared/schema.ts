import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  date,
  boolean
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("doctor"), // doctor, admin, staff
  specialization: varchar("specialization"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patients table
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  identificationNumber: varchar("identification_number").notNull().unique(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: varchar("gender").notNull(),
  bloodType: varchar("blood_type"),
  maritalStatus: varchar("marital_status"),
  phone: varchar("phone"),
  email: varchar("email"),
  address: text("address"),
  insurance: varchar("insurance"),
  emergencyContact: varchar("emergency_contact"),
  emergencyPhone: varchar("emergency_phone"),
  medicalRecordNumber: varchar("medical_record_number").notNull().unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical consultations table
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: varchar("doctor_id").references(() => users.id).notNull(),
  consultationDate: timestamp("consultation_date").notNull(),
  chiefComplaint: text("chief_complaint").notNull(),
  bloodPressure: varchar("blood_pressure"),
  heartRate: varchar("heart_rate"),
  temperature: varchar("temperature"),
  weight: varchar("weight"),
  height: varchar("height"),
  physicalExamination: text("physical_examination"),
  diagnosis: text("diagnosis").notNull(),
  treatmentPlan: text("treatment_plan"),
  medications: text("medications"),
  nextAppointment: date("next_appointment"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical history table
export const medicalHistory = pgTable("medical_history", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  allergies: text("allergies"),
  medications: text("medications"),
  surgicalHistory: text("surgical_history"),
  familyHistory: text("family_history"),
  socialHistory: text("social_history"),
  previousIllnesses: text("previous_illnesses"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical documents table
export const medicalDocuments = pgTable("medical_documents", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  consultationId: integer("consultation_id").references(() => consultations.id),
  fileName: varchar("file_name").notNull(),
  originalName: varchar("original_name").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const patientsRelations = relations(patients, ({ many, one }) => ({
  consultations: many(consultations),
  medicalHistory: one(medicalHistory),
  documents: many(medicalDocuments),
}));

export const consultationsRelations = relations(consultations, ({ one, many }) => ({
  patient: one(patients, {
    fields: [consultations.patientId],
    references: [patients.id],
  }),
  doctor: one(users, {
    fields: [consultations.doctorId],
    references: [users.id],
  }),
  documents: many(medicalDocuments),
}));

export const medicalHistoryRelations = relations(medicalHistory, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalHistory.patientId],
    references: [patients.id],
  }),
}));

export const medicalDocumentsRelations = relations(medicalDocuments, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalDocuments.patientId],
    references: [patients.id],
  }),
  consultation: one(consultations, {
    fields: [medicalDocuments.consultationId],
    references: [consultations.id],
  }),
  uploadedByUser: one(users, {
    fields: [medicalDocuments.uploadedBy],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  consultations: many(consultations),
  uploadedDocuments: many(medicalDocuments),
}));

// Insert schemas
export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  medicalRecordNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicalHistorySchema = createInsertSchema(medicalHistory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicalDocumentSchema = createInsertSchema(medicalDocuments).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertMedicalHistory = z.infer<typeof insertMedicalHistorySchema>;
export type MedicalHistory = typeof medicalHistory.$inferSelect;
export type InsertMedicalDocument = z.infer<typeof insertMedicalDocumentSchema>;
export type MedicalDocument = typeof medicalDocuments.$inferSelect;
