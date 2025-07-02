import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Stethoscope, Eye, Calendar } from "lucide-react";
import ConsultationModal from "@/components/ConsultationModal";

export default function Consultas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  const { data: consultations, isLoading } = useQuery({
    queryKey: ["/api/consultations", searchTerm],
    retry: false,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES");
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-medical-dark">Gestión de Consultas</h1>
            <p className="text-medical-gray mt-1">Registro y seguimiento de consultas médicas</p>
          </div>
          <Button 
            onClick={() => setShowConsultationModal(true)}
            className="mt-4 md:mt-0 bg-medical-green hover:bg-green-700 text-white"
          >
            <Stethoscope className="mr-2 h-4 w-4" />
            Nueva Consulta
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-gray h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar consultas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Consultations List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-medical-dark">Lista de Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
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
            ) : consultations?.length > 0 ? (
              <div className="space-y-4">
                {consultations.map((consultation: any) => (
                  <div
                    key={consultation.id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-medical-green text-white flex items-center justify-center font-semibold">
                        <Stethoscope className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-medical-dark">
                        {consultation.chiefComplaint}
                      </p>
                      <p className="text-sm text-medical-gray">
                        Paciente ID: {consultation.patientId}
                      </p>
                      <p className="text-sm text-medical-gray">
                        Diagnóstico: {consultation.diagnosis}
                      </p>
                      <p className="text-xs text-medical-gray">
                        Fecha: {formatDateTime(consultation.consultationDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="default">
                        Completada
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
                <Stethoscope className="h-12 w-12 text-medical-gray mx-auto mb-4" />
                <p className="text-medical-gray">No se encontraron consultas</p>
                <Button 
                  onClick={() => setShowConsultationModal(true)}
                  className="mt-4 bg-medical-green hover:bg-green-700 text-white"
                >
                  Registrar Primera Consulta
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showConsultationModal && (
        <ConsultationModal
          onClose={() => setShowConsultationModal(false)}
        />
      )}
    </div>
  );
}