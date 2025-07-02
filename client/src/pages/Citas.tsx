import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, Clock, Plus, Eye, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

const appointmentSchema = z.object({
  patientId: z.number().min(1, "Seleccione un paciente"),
  appointmentDate: z.string().min(1, "Fecha de cita requerida"),
  appointmentTime: z.string().min(1, "Hora de cita requerida"),
  reason: z.string().min(1, "Motivo de la cita requerido"),
  notes: z.string().optional(),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

export default function Citas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const form = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: 0,
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      notes: "",
    },
  });

  // En una implementación real, esto vendría de la base de datos
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      // Por ahora retornamos datos de ejemplo hasta que se implemente la API
      return [];
    },
    retry: false,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentForm) => {
      const appointmentData = {
        ...data,
        status: "programada",
        createdAt: new Date().toISOString(),
      };
      // Por ahora solo mostraremos que se "guardó"
      console.log("Cita programada:", appointmentData);
      return appointmentData;
    },
    onSuccess: () => {
      toast({
        title: "Cita programada",
        description: "La cita se ha programado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/today-appointments"] });
      setShowAppointmentModal(false);
      form.reset();
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
        description: "No se pudo programar la cita",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AppointmentForm) => {
    createAppointmentMutation.mutate(data);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Datos de ejemplo para mostrar la funcionalidad
  const exampleAppointments = [
    {
      id: 1,
      patientId: 1,
      patientName: "María García",
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: "09:00",
      reason: "Control rutinario",
      status: "programada",
      notes: "Paciente con antecedentes de hipertensión"
    },
    {
      id: 2,
      patientId: 2,
      patientName: "Juan Pérez",
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: "10:30",
      reason: "Consulta de seguimiento",
      status: "programada",
      notes: ""
    }
  ];

  return (
    <div className="min-h-screen bg-medical-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-medical-dark">Gestión de Citas</h1>
            <p className="text-medical-gray mt-1">Programación y seguimiento de citas médicas</p>
          </div>
          <Button 
            onClick={() => setShowAppointmentModal(true)}
            className="mt-4 md:mt-0 bg-medical-blue hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cita
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-gray h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar citas por paciente o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-medical-dark">Citas Programadas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : exampleAppointments.length > 0 ? (
              <div className="space-y-4">
                {exampleAppointments.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-medical-blue text-white flex items-center justify-center font-semibold">
                        <Calendar className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-medical-dark">
                        {appointment.patientName}
                      </p>
                      <p className="text-sm text-medical-gray">
                        Motivo: {appointment.reason}
                      </p>
                      <p className="text-sm text-medical-gray">
                        Fecha: {formatDate(appointment.appointmentDate)} - {formatTime(appointment.appointmentTime)}
                      </p>
                      {appointment.notes && (
                        <p className="text-xs text-medical-gray">
                          Notas: {appointment.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={appointment.status === "programada" ? "default" : "secondary"}>
                        {appointment.status === "programada" ? "Programada" : "Completada"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-medical-gray mx-auto mb-4" />
                <p className="text-medical-gray">No hay citas programadas</p>
                <Button 
                  onClick={() => setShowAppointmentModal(true)}
                  className="mt-4 bg-medical-blue hover:bg-blue-700 text-white"
                >
                  Programar Primera Cita
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Appointment Modal */}
      {showAppointmentModal && (
        <Dialog open onOpenChange={setShowAppointmentModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-medical-dark">
                Programar Nueva Cita
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID del Paciente</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ingrese el ID del paciente"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de la Cita</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="appointmentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora de la Cita</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo de la Cita</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Describa el motivo de la cita..."
                          {...field}
                        />
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
                          rows={2}
                          placeholder="Notas adicionales..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAppointmentModal(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-medical-blue hover:bg-blue-700 text-white"
                    disabled={createAppointmentMutation.isPending}
                  >
                    {createAppointmentMutation.isPending ? "Programando..." : "Programar Cita"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}