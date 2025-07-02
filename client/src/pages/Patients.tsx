import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Eye } from "lucide-react";
import PatientModal from "@/components/PatientModal";
import PatientForm from "@/components/PatientForm";

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);

  const { data: patients, isLoading } = useQuery({
    queryKey: ["/api/patients", searchTerm],
    retry: false,
  });

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-medical-dark">Gestión de Pacientes</h1>
            <p className="text-medical-gray mt-1">Registro y seguimiento de pacientes</p>
          </div>
          <Button 
            onClick={() => setShowPatientForm(true)}
            className="mt-4 md:mt-0 bg-medical-blue hover:bg-blue-700 text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Paciente
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-medical-dark">Lista de Pacientes</CardTitle>
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
            ) : patients?.length > 0 ? (
              <div className="space-y-4">
                {patients.map((patient: any) => (
                  <div
                    key={patient.id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
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
                        Cédula: {patient.identificationNumber}
                      </p>
                      <p className="text-sm text-medical-gray">
                        Historia: {patient.medicalRecordNumber}
                      </p>
                      <p className="text-xs text-medical-gray">
                        Fecha de nacimiento: {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={patient.isActive ? "default" : "secondary"}>
                        {patient.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePatientClick(patient)}
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
                <p className="text-medical-gray">No se encontraron pacientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showPatientModal && selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          onClose={() => setShowPatientModal(false)}
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
