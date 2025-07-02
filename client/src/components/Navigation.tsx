import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Heart, Home, Users, Calendar, BarChart3, Bell, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/pacientes", label: "Pacientes", icon: Users },
    { path: "/consultas", label: "Consultas", icon: Calendar },
    { path: "/citas", label: "Citas", icon: Calendar },
    { path: "/reportes", label: "Reportes", icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-xl font-bold text-medical-blue flex items-center cursor-pointer">
                  <Heart className="h-6 w-6 mr-2" />
                  MedSystem
                </h1>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <span className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors cursor-pointer ${
                        isActive
                          ? "text-medical-blue bg-blue-50"
                          : "text-medical-gray hover:text-medical-dark"
                      }`}>
                        <Icon className="h-4 w-4 mr-1" />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-medical-gray hover:text-medical-dark">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-sm font-medium text-medical-gray hover:text-medical-dark">
                  <div className="h-8 w-8 rounded-full bg-medical-blue text-white flex items-center justify-center font-semibold">
                    {(user as any)?.firstName?.[0] || "U"}
                  </div>
                  <span>{(user as any)?.firstName} {(user as any)?.lastName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
