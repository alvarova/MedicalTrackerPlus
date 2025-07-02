import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, User, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  identificationNumber: string;
  medicalRecordNumber: string;
  dateOfBirth: string;
  gender: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

interface PatientSearchProps {
  onPatientSelect: (patient: Patient) => void;
  onNewPatient?: () => void;
  placeholder?: string;
  showNewPatientButton?: boolean;
}

export default function PatientSearch({ 
  onPatientSelect, 
  onNewPatient, 
  placeholder = "Buscar por nombre o cédula...",
  showNewPatientButton = false 
}: PatientSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { data: patients, isLoading } = useQuery({
    queryKey: ["/api/patients", { search: searchTerm }],
    enabled: searchTerm.length >= 2,
  });

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient);
    setSearchTerm(`${patient.firstName} ${patient.lastName} - ${patient.identificationNumber}`);
    setShowResults(false);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          />
        </div>
        {showNewPatientButton && onNewPatient && (
          <Button
            type="button"
            onClick={onNewPatient}
            className="bg-medical-green hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Paciente
          </Button>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Buscando pacientes...
              </div>
            ) : patients && patients.length > 0 ? (
              <div className="space-y-1">
                {patients.map((patient: Patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-medical-blue text-white flex items-center justify-center font-semibold text-sm">
                        {patient.firstName?.[0]}{patient.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-medical-dark">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Cédula: {patient.identificationNumber} | Historia: {patient.medicalRecordNumber}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {calculateAge(patient.dateOfBirth)} años • {patient.gender}
                          </span>
                          <Badge variant={patient.isActive ? "default" : "secondary"} className="text-xs">
                            {patient.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 mb-2">No se encontraron pacientes</p>
                {onNewPatient && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={onNewPatient}
                    className="bg-medical-blue hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nuevo Paciente
                  </Button>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}