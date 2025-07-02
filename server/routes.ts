import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPatientSchema, insertConsultationSchema, insertMedicalHistorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Error al obtener estadísticas del dashboard" });
    }
  });

  app.get('/api/dashboard/recent-patients', isAuthenticated, async (req, res) => {
    try {
      const patients = await storage.getRecentPatients(10);
      res.json(patients);
    } catch (error) {
      console.error("Error fetching recent patients:", error);
      res.status(500).json({ message: "Error al obtener pacientes recientes" });
    }
  });

  app.get('/api/dashboard/today-appointments', isAuthenticated, async (req, res) => {
    try {
      const appointments = await storage.getTodayAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching today appointments:", error);
      res.status(500).json({ message: "Error al obtener citas de hoy" });
    }
  });

  // Patient routes
  app.get('/api/patients', isAuthenticated, async (req, res) => {
    try {
      const { search, limit = '50', offset = '0' } = req.query;
      const patients = await storage.getPatients(
        search as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Error al obtener pacientes" });
    }
  });

  app.get('/api/patients/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const patient = await storage.getPatient(id);
      if (!patient) {
        return res.status(404).json({ message: "Paciente no encontrado" });
      }
      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      res.status(500).json({ message: "Error al obtener paciente" });
    }
  });

  app.post('/api/patients', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      
      // Generate medical record number
      const timestamp = Date.now().toString().slice(-6);
      const medicalRecordNumber = `MED-${new Date().getFullYear()}-${timestamp}`;
      
      const patient = await storage.createPatient({
        ...validatedData,
        medicalRecordNumber,
      });
      
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      console.error("Error creating patient:", error);
      res.status(500).json({ message: "Error al crear paciente" });
    }
  });

  app.put('/api/patients/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPatientSchema.partial().parse(req.body);
      
      const patient = await storage.updatePatient(id, validatedData);
      res.json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      console.error("Error updating patient:", error);
      res.status(500).json({ message: "Error al actualizar paciente" });
    }
  });

  // Consultation routes
  app.get('/api/consultations', isAuthenticated, async (req, res) => {
    try {
      const { patientId, limit = '50' } = req.query;
      const consultations = await storage.getConsultations(
        patientId ? parseInt(patientId as string) : undefined,
        parseInt(limit as string)
      );
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      res.status(500).json({ message: "Error al obtener consultas" });
    }
  });

  app.get('/api/patients/:patientId/consultations', isAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const consultations = await storage.getConsultations(patientId);
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching patient consultations:", error);
      res.status(500).json({ message: "Error al obtener consultas del paciente" });
    }
  });

  app.post('/api/consultations', isAuthenticated, async (req: any, res) => {
    try {
      const doctorId = req.user.claims.sub;
      const validatedData = insertConsultationSchema.parse({
        ...req.body,
        doctorId,
      });
      
      const consultation = await storage.createConsultation(validatedData);
      res.status(201).json(consultation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      console.error("Error creating consultation:", error);
      res.status(500).json({ message: "Error al crear consulta" });
    }
  });

  // Medical history routes
  app.get('/api/patients/:patientId/medical-history', isAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const history = await storage.getMedicalHistory(patientId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching medical history:", error);
      res.status(500).json({ message: "Error al obtener historial médico" });
    }
  });

  app.post('/api/patients/:patientId/medical-history', isAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const validatedData = insertMedicalHistorySchema.parse({
        ...req.body,
        patientId,
      });
      
      const history = await storage.createMedicalHistory(validatedData);
      res.status(201).json(history);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      console.error("Error creating medical history:", error);
      res.status(500).json({ message: "Error al crear historial médico" });
    }
  });

  app.put('/api/patients/:patientId/medical-history', isAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const validatedData = insertMedicalHistorySchema.partial().parse(req.body);
      
      const history = await storage.updateMedicalHistory(patientId, validatedData);
      res.json(history);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      console.error("Error updating medical history:", error);
      res.status(500).json({ message: "Error al actualizar historial médico" });
    }
  });

  // Document routes
  app.get('/api/patients/:patientId/documents', isAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const documents = await storage.getPatientDocuments(patientId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching patient documents:", error);
      res.status(500).json({ message: "Error al obtener documentos del paciente" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
