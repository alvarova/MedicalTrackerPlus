import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Search, 
  UserPlus, 
  Stethoscope,
  Upload,
  BarChart3,
  Heart
} from "lucide-react";
import PatientModal from "@/components/PatientModal";
import ConsultationModal from "@/components/ConsultationModal";
import PatientForm from "@/components/PatientForm";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: recentPatients, isLoading: patientsLoading } = useQuery({
    queryKey: ["/api/dashboard/recent-patients"],
    retry: false,
  });

  const { data: todayAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/dashboard/today-appointments"],
    retry: false,
  });

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const handleNewPatient = () => {
    setShowPatientForm(true);
  };

  const handleNewConsultation = () => {
    setShowConsultationModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-medical-light flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 animate-pulse text-medical-blue mx-auto mb-4" />
          <p className="text-medical-gray">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-medical-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-medical-dark">Dashboard Médico</h1>
              <p className="text-medical-gray mt-1">Gestión integral de pacientes e historiales médicos</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button 
                onClick={handleNewPatient}
                className="bg-medical-blue hover:bg-blue-700 text-white"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Paciente
              </Button>
              <Button 
                onClick={handleNewConsultation}
                className="bg-medical-green hover:bg-green-700 text-white"
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                Nueva Consulta
              </Button>
            </div>
          </div>

          {/* Quick Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-medical-gray mb-2">
                    Búsqueda Rápida
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-gray h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Buscar por nombre, cédula o número de historia..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-medical-blue">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-medical-gray">Pacientes Totales</p>
                  <p className="text-2xl font-bold text-medical-dark">
                    {statsLoading ? "..." : stats?.totalPatients || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-medical-green">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-medical-gray">Consultas Hoy</p>
                  <p className="text-2xl font-bold text-medical-dark">
                    {statsLoading ? "..." : stats?.todayConsultations || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-medical-gray">Pendientes</p>
                  <p className="text-2xl font-bold text-medical-dark">
                    {statsLoading ? "..." : stats?.pendingItems || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-medical-gray">Historiales</p>
                  <p className="text-2xl font-bold text-medical-dark">
                    {statsLoading ? "..." : stats?.totalRecords || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Patients */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-medical-dark">Pacientes Recientes</CardTitle>
                  <Button variant="ghost" size="sm" className="text-medical-blue">
                    Ver todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {patientsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPatients?.map((patient: any) => (
                      <div
                        key={patient.id}
                        className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handlePatientClick(patient)}
                      >
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-medical-blue text-white flex items-center justify-center font-semibold">
                            {patient.firstName?.[0]}{patient.lastName?.[0]}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-medical-dark">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-sm text-medical-gray">
                            {patient.identificationNumber}
                          </p>
                          <p className="text-xs text-medical-gray">
                            Actualizado: {new Date(patient.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Badge variant={patient.isActive ? "default" : "secondary"}>
                            {patient.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-medical-dark">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={handleNewPatient}
                >
                  <div className="p-2 rounded-full bg-blue-100 text-medical-blue mr-3">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Registrar Paciente</p>
                    <p className="text-xs text-medical-gray">Nuevo registro completo</p>
                  </div>
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={handleNewConsultation}
                >
                  <div className="p-2 rounded-full bg-green-100 text-medical-green mr-3">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Consulta Express</p>
                    <p className="text-xs text-medical-gray">Registro rápido</p>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Subir Documentos</p>
                    <p className="text-xs text-medical-gray">Adjuntar archivos</p>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start">
                  <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Generar Reporte</p>
                    <p className="text-xs text-medical-gray">Estadísticas médicas</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-medical-dark">Citas de Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : todayAppointments?.length > 0 ? (
                  <div className="space-y-3">
                    {todayAppointments.map((appointment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-medical-dark">
                            {appointment.patientName}
                          </p>
                          <p className="text-xs text-medical-gray">
                            {new Date(appointment.consultationDate).toLocaleTimeString()} - {appointment.chiefComplaint}
                          </p>
                        </div>
                        <Badge variant="secondary">Programado</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-medical-gray text-center py-4">
                    No hay citas programadas para hoy
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPatientModal && selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          onClose={() => setShowPatientModal(false)}
        />
      )}

      {showConsultationModal && (
        <ConsultationModal
          onClose={() => setShowConsultationModal(false)}
        />
      )}

      {showPatientForm && (
        <PatientForm
          onClose={() => setShowPatientForm(false)}
        />
      )}
    </div>
  );
}
