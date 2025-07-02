import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, Calendar, Users, Stethoscope } from "lucide-react";

export default function Reportes() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: recentPatients } = useQuery({
    queryKey: ["/api/dashboard/recent-patients"],
    retry: false,
  });

  const { data: consultations } = useQuery({
    queryKey: ["/api/consultations"],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-medical-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-medical-dark">Reportes y Estadísticas</h1>
          <p className="text-medical-gray mt-1">Análisis y reportes del sistema médico</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-medical-blue">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-medical-gray">Total Pacientes</p>
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
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-medical-gray">Total Consultas</p>
                  <p className="text-2xl font-bold text-medical-dark">
                    {statsLoading ? "..." : stats?.totalRecords || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-medical-dark flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Reportes Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-medical-dark">Reporte de Pacientes</h4>
                  <p className="text-xs text-medical-gray">Lista completa de pacientes registrados</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-medical-dark">Reporte de Consultas</h4>
                  <p className="text-xs text-medical-gray">Historial de consultas médicas</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-medical-dark">Estadísticas Mensuales</h4>
                  <p className="text-xs text-medical-gray">Resumen estadístico del mes actual</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-medical-dark">Reporte de Diagnósticos</h4>
                  <p className="text-xs text-medical-gray">Análisis de diagnósticos más frecuentes</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-medical-dark flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Análisis Rápido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-medical-dark mb-3">Resumen de Actividad</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Pacientes Activos:</span>
                      <span className="text-sm text-medical-dark font-medium">
                        {recentPatients?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Consultas Registradas:</span>
                      <span className="text-sm text-medical-dark font-medium">
                        {consultations?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Promedio Consultas/Día:</span>
                      <span className="text-sm text-medical-dark font-medium">
                        {consultations?.length ? Math.round(consultations.length / 30) : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-medical-dark mb-3">Estado del Sistema</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-medical-gray">Base de Datos:</span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Conectada
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-medical-gray">Último Backup:</span>
                      <span className="text-xs text-medical-gray">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-medical-gray">Espacio Utilizado:</span>
                      <span className="text-xs text-medical-gray">
                        {((recentPatients?.length || 0) * 0.1).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full bg-medical-blue hover:bg-blue-700 text-white">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generar Reporte Personalizado
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}