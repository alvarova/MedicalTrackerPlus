import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import PatientSearch from "./PatientSearch";

const consultationSchema = z.object({
  patientId: z.number().min(1, "Seleccione un paciente"),
  consultationDate: z.string().min(1, "Fecha de consulta requerida"),
  chiefComplaint: z.string().min(1, "Motivo de consulta requerido"),
  bloodPressure: z.string().optional(),
  heartRate: z.string().optional(),
  temperature: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  physicalExamination: z.string().optional(),
  diagnosis: z.string().min(1, "Diagnóstico requerido"),
  treatmentPlan: z.string().optional(),
  medications: z.string().optional(),
  nextAppointment: z.string().optional(),
  notes: z.string().optional(),
});

type ConsultationForm = z.infer<typeof consultationSchema>;

interface ConsultationModalProps {
  patientId?: number;
  onClose: () => void;
  onNewPatient?: () => void;
}

export default function ConsultationModal({ patientId, onClose, onNewPatient }: ConsultationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const form = useForm<ConsultationForm>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      patientId: patientId || 0,
      consultationDate: new Date().toISOString().split('T')[0] + 'T' + new Date().toTimeString().split(' ')[0].slice(0, 5),
      chiefComplaint: "",
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
      physicalExamination: "",
      diagnosis: "",
      treatmentPlan: "",
      medications: "",
      nextAppointment: "",
      notes: "",
    },
  });

  const createConsultationMutation = useMutation({
    mutationFn: async (data: ConsultationForm) => {
      const formattedData = {
        ...data,
        consultationDate: new Date(data.consultationDate).toISOString(),
        nextAppointment: data.nextAppointment ? data.nextAppointment : null,
      };
      await apiRequest("POST", "/api/consultations", formattedData);
    },
    onSuccess: () => {
      toast({
        title: "Consulta registrada",
        description: "La consulta se ha registrado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "No autorizado",
          description: "Iniciando sesión...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "No se pudo registrar la consulta",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConsultationForm) => {
    createConsultationMutation.mutate(data);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-medical-dark">
            Nueva Consulta Médica
          </DialogTitle>
          <DialogDescription>
            Complete los campos para registrar una nueva consulta médica
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!patientId && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Buscar Paciente
                  </label>
                  <PatientSearch
                    onPatientSelect={(patient) => {
                      setSelectedPatient(patient);
                      form.setValue("patientId", patient.id);
                    }}
                    onNewPatient={onNewPatient}
                    placeholder="Buscar por nombre o cédula..."
                    showNewPatientButton={true}
                  />
                </div>
                
                {selectedPatient && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-medical-blue text-white flex items-center justify-center font-semibold text-sm">
                        {selectedPatient.firstName?.[0]}{selectedPatient.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-medical-dark">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cédula: {selectedPatient.identificationNumber} | Historia: {selectedPatient.medicalRecordNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="consultationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha y Hora de Consulta</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="chiefComplaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de Consulta</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Describa el motivo principal de la consulta..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bloodPressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presión Arterial</FormLabel>
                    <FormControl>
                      <Input placeholder="ej: 120/80" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heartRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia Cardíaca</FormLabel>
                    <FormControl>
                      <Input placeholder="ej: 72 bpm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura</FormLabel>
                    <FormControl>
                      <Input placeholder="ej: 36.5°C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso</FormLabel>
                    <FormControl>
                      <Input placeholder="ej: 70 kg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="physicalExamination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exploración Física</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describa los hallazgos del examen físico..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnóstico</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Indique el diagnóstico principal y secundarios..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatmentPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan de Tratamiento</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describa el plan de tratamiento, medicamentos, recomendaciones..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextAppointment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próxima Cita</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Notas adicionales..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-medical-blue hover:bg-blue-700 text-white"
                disabled={createConsultationMutation.isPending}
              >
                {createConsultationMutation.isPending ? "Guardando..." : "Guardar Consulta"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
