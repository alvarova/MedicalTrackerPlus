import {
  users,
  patients,
  consultations,
  medicalHistory,
  medicalDocuments,
  type User,
  type UpsertUser,
  type Patient,
  type InsertPatient,
  type Consultation,
  type InsertConsultation,
  type MedicalHistory,
  type InsertMedicalHistory,
  type MedicalDocument,
  type InsertMedicalDocument,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or, and, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Patient operations
  getPatients(search?: string, limit?: number, offset?: number): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByMedicalRecord(medicalRecordNumber: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient>;
  
  // Consultation operations
  getConsultations(patientId?: number, limit?: number): Promise<Consultation[]>;
  getConsultation(id: number): Promise<Consultation | undefined>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: number, consultation: Partial<InsertConsultation>): Promise<Consultation>;
  
  // Medical history operations
  getMedicalHistory(patientId: number): Promise<MedicalHistory | undefined>;
  createMedicalHistory(history: InsertMedicalHistory): Promise<MedicalHistory>;
  updateMedicalHistory(patientId: number, history: Partial<InsertMedicalHistory>): Promise<MedicalHistory>;
  
  // Document operations
  getPatientDocuments(patientId: number): Promise<MedicalDocument[]>;
  createDocument(document: InsertMedicalDocument): Promise<MedicalDocument>;
  
  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalPatients: number;
    todayConsultations: number;
    pendingItems: number;
    totalRecords: number;
  }>;
  
  // Recent activity
  getRecentPatients(limit?: number): Promise<Patient[]>;
  getTodayAppointments(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Patient operations
  async getPatients(search?: string, limit = 50, offset = 0): Promise<Patient[]> {
    if (search) {
      return await db.select().from(patients).where(
        and(
          eq(patients.isActive, true),
          or(
            like(patients.firstName, `%${search}%`),
            like(patients.lastName, `%${search}%`),
            like(patients.identificationNumber, `%${search}%`),
            like(patients.medicalRecordNumber, `%${search}%`)
          )
        )
      ).limit(limit).offset(offset).orderBy(desc(patients.updatedAt));
    } else {
      return await db.select().from(patients)
        .where(eq(patients.isActive, true))
        .limit(limit).offset(offset).orderBy(desc(patients.updatedAt));
    }
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async getPatientByMedicalRecord(medicalRecordNumber: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.medicalRecordNumber, medicalRecordNumber));
    return patient;
  }

  async createPatient(patient: any): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }

  async updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient> {
    const [updatedPatient] = await db
      .update(patients)
      .set({ ...patient, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return updatedPatient;
  }

  // Consultation operations
  async getConsultations(patientId?: number, limit = 50): Promise<Consultation[]> {
    if (patientId) {
      return await db.select().from(consultations)
        .where(eq(consultations.patientId, patientId))
        .limit(limit).orderBy(desc(consultations.consultationDate));
    } else {
      return await db.select().from(consultations)
        .limit(limit).orderBy(desc(consultations.consultationDate));
    }
  }

  async getConsultation(id: number): Promise<Consultation | undefined> {
    const [consultation] = await db.select().from(consultations).where(eq(consultations.id, id));
    return consultation;
  }

  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const [newConsultation] = await db.insert(consultations).values(consultation).returning();
    return newConsultation;
  }

  async updateConsultation(id: number, consultation: Partial<InsertConsultation>): Promise<Consultation> {
    const [updatedConsultation] = await db
      .update(consultations)
      .set({ ...consultation, updatedAt: new Date() })
      .where(eq(consultations.id, id))
      .returning();
    return updatedConsultation;
  }

  // Medical history operations
  async getMedicalHistory(patientId: number): Promise<MedicalHistory | undefined> {
    const [history] = await db.select().from(medicalHistory).where(eq(medicalHistory.patientId, patientId));
    return history;
  }

  async createMedicalHistory(history: InsertMedicalHistory): Promise<MedicalHistory> {
    const [newHistory] = await db.insert(medicalHistory).values(history).returning();
    return newHistory;
  }

  async updateMedicalHistory(patientId: number, history: Partial<InsertMedicalHistory>): Promise<MedicalHistory> {
    const [updatedHistory] = await db
      .update(medicalHistory)
      .set({ ...history, updatedAt: new Date() })
      .where(eq(medicalHistory.patientId, patientId))
      .returning();
    return updatedHistory;
  }

  // Document operations
  async getPatientDocuments(patientId: number): Promise<MedicalDocument[]> {
    return await db.select().from(medicalDocuments)
      .where(eq(medicalDocuments.patientId, patientId))
      .orderBy(desc(medicalDocuments.createdAt));
  }

  async createDocument(document: InsertMedicalDocument): Promise<MedicalDocument> {
    const [newDocument] = await db.insert(medicalDocuments).values(document).returning();
    return newDocument;
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<{
    totalPatients: number;
    todayConsultations: number;
    pendingItems: number;
    totalRecords: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalPatientsResult] = await db
      .select({ count: count(patients.id) })
      .from(patients)
      .where(eq(patients.isActive, true));

    const [todayConsultationsResult] = await db
      .select({ count: count(consultations.id) })
      .from(consultations)
      .where(
        and(
          sql`${consultations.consultationDate} >= ${today}`,
          sql`${consultations.consultationDate} < ${tomorrow}`
        )
      );

    const [totalRecordsResult] = await db
      .select({ count: count(consultations.id) })
      .from(consultations);

    return {
      totalPatients: totalPatientsResult.count,
      todayConsultations: todayConsultationsResult.count,
      pendingItems: 0, // Placeholder - implement based on business logic
      totalRecords: totalRecordsResult.count,
    };
  }

  // Recent activity
  async getRecentPatients(limit = 10): Promise<Patient[]> {
    return await db.select().from(patients)
      .where(eq(patients.isActive, true))
      .orderBy(desc(patients.updatedAt))
      .limit(limit);
  }

  async getTodayAppointments(): Promise<any[]> {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db.select({
      id: consultations.id,
      patientName: sql`${patients.firstName} || ' ' || ${patients.lastName}`,
      consultationDate: consultations.consultationDate,
      chiefComplaint: consultations.chiefComplaint,
    })
    .from(consultations)
    .innerJoin(patients, eq(consultations.patientId, patients.id))
    .where(
      and(
        sql`${consultations.nextAppointment} >= ${today.toISOString().split('T')[0]}`,
        sql`${consultations.nextAppointment} < ${tomorrow.toISOString().split('T')[0]}`
      )
    )
    .orderBy(consultations.consultationDate);
  }
}

export const storage = new DatabaseStorage();
