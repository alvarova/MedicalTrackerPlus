import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, FileText } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-medical-blue mr-3" />
            <h1 className="text-4xl font-bold text-medical-dark">MedSystem</h1>
          </div>
          <p className="text-xl text-medical-gray mb-8">
            Sistema integral de registros médicos electrónicos para consultorios médicos
          </p>
          <Button 
            onClick={handleLogin}
            className="bg-medical-blue hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Ingresar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-medical-blue mx-auto mb-4" />
              <CardTitle className="text-medical-dark">Gestión de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-medical-gray">
                Registro completo y organizado de información de pacientes
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="h-12 w-12 text-medical-green mx-auto mb-4" />
              <CardTitle className="text-medical-dark">Historiales Médicos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-medical-gray">
                Documentación clínica estructurada y accesible
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-medical-dark">Acceso Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-medical-gray">
                Control de acceso basado en roles y seguridad de datos
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-medical-dark">Atención Integral</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-medical-gray">
                Seguimiento completo del proceso de atención médica
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-medical-dark mb-8">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-medical-dark mb-4">
                📋 Entrada de Información Clínica
              </h3>
              <ul className="text-medical-gray space-y-2">
                <li>• Formulario de registro de pacientes</li>
                <li>• Carga de historial médico</li>
                <li>• Registro de consultas y progreso</li>
                <li>• Adjuntar documentos clínicos</li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-medical-dark mb-4">
                📊 Panel de Análisis y Visualización
              </h3>
              <ul className="text-medical-gray space-y-2">
                <li>• Línea de tiempo clínica</li>
                <li>• Dashboard de paciente</li>
                <li>• Estadísticas por profesional</li>
                <li>• Búsqueda inteligente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
