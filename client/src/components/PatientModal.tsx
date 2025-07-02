import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, History, Calendar, Paperclip, Stethoscope, Upload, Edit, FileText } from "lucide-react";

interface PatientModalProps {
  patient: any;
  onClose: () => void;
}

export default function PatientModal({ patient, onClose }: PatientModalProps) {
  const [activeTab, setActiveTab] = useState("info");

  const { data: consultations } = useQuery({
    queryKey: ["/api/patients", patient.id, "consultations"],
    retry: false,
  });

  const { data: medicalHistory } = useQuery({
    queryKey: ["/api/patients", patient.id, "medical-history"],
    retry: false,
  });

  const { data: documents } = useQuery({
    queryKey: ["/api/patients", patient.id, "documents"],
    retry: false,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-medical-blue text-white flex items-center justify-center font-semibold text-xl">
                {patient.firstName?.[0]}{patient.lastName?.[0]}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-medical-dark">
                  {patient.firstName} {patient.lastName}
                </DialogTitle>
                <DialogDescription className="text-medical-gray">
                  Cédula: {patient.identificationNumber} | Historia: {patient.medicalRecordNumber}
                </DialogDescription>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-medical-gray">
                    {calculateAge(patient.dateOfBirth)} años
                  </span>
                  <Badge variant={patient.isActive ? "default" : "secondary"}>
                    {patient.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Información Personal
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Historial Médico
              </TabsTrigger>
              <TabsTrigger value="consultations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Consultas
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Documentos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-medical-gray mb-3">Datos Personales</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Fecha de Nacimiento:</span>
                      <span className="text-sm text-medical-dark">{formatDate(patient.dateOfBirth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Género:</span>
                      <span className="text-sm text-medical-dark">{patient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Estado Civil:</span>
                      <span className="text-sm text-medical-dark">{patient.maritalStatus || "No especificado"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Tipo de Sangre:</span>
                      <span className="text-sm text-medical-dark">{patient.bloodType || "No especificado"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-medical-gray mb-3">Contacto</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Teléfono:</span>
                      <span className="text-sm text-medical-dark">{patient.phone || "No especificado"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Email:</span>
                      <span className="text-sm text-medical-dark">{patient.email || "No especificado"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Dirección:</span>
                      <span className="text-sm text-medical-dark">{patient.address || "No especificada"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-medical-gray">Seguro:</span>
                      <span className="text-sm text-medical-dark">{patient.insurance || "No especificado"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="space-y-4">
                {medicalHistory ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-medical-gray mb-3">Historial Médico</h4>
                    <div className="space-y-3">
                      {medicalHistory.allergies && (
                        <div>
                          <span className="text-sm font-medium text-medical-dark">Alergias:</span>
                          <p className="text-sm text-medical-gray mt-1">{medicalHistory.allergies}</p>
                        </div>
                      )}
                      {medicalHistory.medications && (
                        <div>
                          <span className="text-sm font-medium text-medical-dark">Medicamentos:</span>
                          <p className="text-sm text-medical-gray mt-1">{medicalHistory.medications}</p>
                        </div>
                      )}
                      {medicalHistory.surgicalHistory && (
                        <div>
                          <span className="text-sm font-medium text-medical-dark">Cirugías:</span>
                          <p className="text-sm text-medical-gray mt-1">{medicalHistory.surgicalHistory}</p>
                        </div>
                      )}
                      {medicalHistory.familyHistory && (
                        <div>
                          <span className="text-sm font-medium text-medical-dark">Antecedentes Familiares:</span>
                          <p className="text-sm text-medical-gray mt-1">{medicalHistory.familyHistory}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-medical-gray">No hay historial médico registrado</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="consultations" className="mt-6">
              <div className="space-y-4">
                {consultations?.length > 0 ? (
                  consultations.map((consultation: any) => (
                    <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-medical-dark">
                          {consultation.chiefComplaint}
                        </h5>
                        <span className="text-xs text-medical-gray">
                          {formatDate(consultation.consultationDate)}
                        </span>
                      </div>
                      <p className="text-sm text-medical-gray mb-2">
                        <strong>Diagnóstico:</strong> {consultation.diagnosis}
                      </p>
                      {consultation.treatmentPlan && (
                        <p className="text-sm text-medical-gray">
                          <strong>Plan de Tratamiento:</strong> {consultation.treatmentPlan}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-medical-gray">No hay consultas registradas</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <div className="space-y-4">
                {documents?.length > 0 ? (
                  documents.map((document: any) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-medical-blue" />
                        <div>
                          <p className="text-sm font-medium text-medical-dark">{document.originalName}</p>
                          <p className="text-xs text-medical-gray">
                            {document.description} • {formatDate(document.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Descargar
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-medical-gray">No hay documentos adjuntos</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button 
            className="bg-medical-blue hover:bg-blue-700 text-white"
          >
            <Stethoscope className="mr-2 h-4 w-4" />
            Nueva Consulta
          </Button>
          <Button 
            className="bg-medical-green hover:bg-green-700 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Subir Documento
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar Información
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
