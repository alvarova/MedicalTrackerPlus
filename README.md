# MedSystem - Sistema de Registros Médicos Electrónicos

## Descripción del Sistema

MedSystem es una aplicación integral de registros médicos electrónicos (EMR) diseñada para consultorios médicos. Proporciona una solución completa para la gestión de pacientes, consultas médicas, historiales clínicos y documentación con una interfaz web moderna y una infraestructura backend robusta.

## Características Principales

- ✅ **Gestión de Pacientes**: Registro, búsqueda y administración completa de pacientes
- ✅ **Consultas Médicas**: Registro detallado de consultas con diagnósticos y tratamientos
- ✅ **Historiales Médicos**: Seguimiento completo del historial clínico de cada paciente
- ✅ **Gestión de Citas**: Programación y seguimiento de citas médicas
- ✅ **Búsqueda Inteligente**: Búsqueda de pacientes por nombre o número de cédula
- ✅ **Dashboard Médico**: Estadísticas y resumen de actividades diarias
- ✅ **Reportes**: Generación de reportes médicos y estadísticas
- ✅ **Autenticación Segura**: Sistema de autenticación integrado con Replit Auth

## Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** para desarrollo y construcción
- **Wouter** para enrutamiento
- **TanStack Query** para gestión de estado del servidor
- **shadcn/ui** componentes de interfaz basados en Radix UI
- **Tailwind CSS** para estilos

### Backend
- **Express.js** con TypeScript
- **PostgreSQL** con Drizzle ORM
- **Replit Auth** para autenticación
- **Express Sessions** para gestión de sesiones

## Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- Base de datos PostgreSQL
- Cuenta de Replit (para autenticación)

### Configuración del Entorno

1. **Variables de Entorno**:
   ```bash
   DATABASE_URL=postgresql://usuario:password@host:puerto/basedatos
   SESSION_SECRET=tu_clave_secreta_aqui
   ```

2. **Instalación de Dependencias**:
   ```bash
   npm install
   ```

3. **Configuración de Base de Datos**:
   ```bash
   # Sincronizar esquema con la base de datos
   npm run db:push
   ```

### Ejecutar el Sistema

```bash
# Modo desarrollo (frontend + backend)
npm run dev
```

El sistema estará disponible en `http://localhost:5000`

## Guía de Uso

### 1. Inicio de Sesión

1. Accede a la aplicación en tu navegador
2. El sistema te redirigirá automáticamente al flujo de autenticación de Replit
3. Completa la autenticación con tu cuenta de Replit
4. Serás redirigido al dashboard principal

### 2. Gestión de Pacientes

#### Registrar Nuevo Paciente

1. Ve a la sección **"Pacientes"** en el menú principal
2. Haz clic en **"Nuevo Paciente"**
3. Completa los datos requeridos:
   - Nombres y apellidos
   - Número de cédula
   - Fecha de nacimiento
   - Género
   - Teléfono y email (opcionales)
4. Haz clic en **"Registrar Paciente"**

#### Buscar Pacientes

1. En cualquier sección, utiliza el buscador inteligente
2. Escribe el nombre completo o número de cédula
3. Selecciona el paciente de los resultados mostrados

### 3. Registro de Consultas Médicas

#### Nueva Consulta

1. Ve a la sección **"Consultas"** 
2. Haz clic en **"Nueva Consulta"**
3. **Buscar Paciente**: 
   - Escribe nombre o cédula en el buscador
   - Selecciona el paciente de la lista
   - Si no existe, haz clic en **"Nuevo Paciente"** para registrarlo
4. **Completar Datos de la Consulta**:
   - Motivo de consulta
   - Diagnóstico
   - Tratamiento prescrito
   - Notas adicionales
5. Haz clic en **"Registrar Consulta"**

#### Ver Historial de Consultas

1. En la lista de consultas, haz clic en **"Ver"** junto a cualquier consulta
2. Revisa los detalles completos de la consulta registrada

### 4. Gestión de Citas

#### Programar Nueva Cita

1. Ve a la sección **"Citas"**
2. Haz clic en **"Nueva Cita"**
3. **Buscar Paciente**:
   - Utiliza el buscador por nombre o cédula
   - Selecciona el paciente o crea uno nuevo
4. **Completar Datos de la Cita**:
   - Fecha y hora de la cita
   - Motivo de la cita
   - Notas adicionales
5. Haz clic en **"Programar Cita"**

### 5. Dashboard y Reportes

#### Dashboard Principal

El dashboard muestra:
- **Total de pacientes** registrados
- **Consultas del día** actual
- **Pacientes recientes** registrados
- **Citas programadas** para hoy

#### Generar Reportes

1. Ve a la sección **"Reportes"**
2. Selecciona el tipo de reporte:
   - Estadísticas generales
   - Consultas por período
   - Pacientes por género/edad
3. Los reportes se generan automáticamente

## Flujos de Trabajo Recomendados

### Flujo Típico: Paciente Nuevo

1. **Paciente llega por primera vez**
2. Ir a **Consultas** → **Nueva Consulta**
3. En el buscador, escribir nombre o cédula
4. Como no existe, hacer clic en **"Nuevo Paciente"**
5. Registrar datos del paciente
6. El sistema regresa automáticamente a crear la consulta
7. Completar y registrar la consulta médica

### Flujo Típico: Paciente Existente

1. **Paciente con cita programada**
2. Ir a **Consultas** → **Nueva Consulta**
3. Buscar paciente por nombre o cédula
4. Seleccionar de la lista de resultados
5. Completar y registrar la consulta médica

### Programación de Citas

1. **Programar cita futura**
2. Ir a **Citas** → **Nueva Cita**
3. Buscar y seleccionar paciente
4. Establecer fecha, hora y motivo
5. Confirmar programación

## Gestión de Datos

### Búsqueda de Pacientes

El sistema permite buscar pacientes por:
- ✅ Nombre completo (parcial o completo)
- ✅ Apellidos
- ✅ Número de cédula
- ✅ Número de historia médica

### Respaldo de Datos

- Los datos se almacenan automáticamente en PostgreSQL
- Se recomienda realizar respaldos regulares de la base de datos
- Todos los registros incluyen timestamps de creación y actualización

## Solución de Problemas Comunes

### Error de Autenticación

**Problema**: No puedo iniciar sesión
**Solución**: 
1. Verifica tu conexión a internet
2. Asegúrate de tener una cuenta de Replit válida
3. Limpia la caché del navegador
4. Intenta en modo incógnito

### No se Cargan los Pacientes

**Problema**: La búsqueda de pacientes no funciona
**Solución**:
1. Verifica la conexión a la base de datos
2. Revisa que `DATABASE_URL` esté configurado correctamente
3. Ejecuta `npm run db:push` para sincronizar el esquema

### Error al Registrar Consulta

**Problema**: No se puede guardar una consulta
**Solución**:
1. Asegúrate de haber seleccionado un paciente válido
2. Completa todos los campos requeridos
3. Verifica tu sesión de usuario (re-autentícate si es necesario)

## Arquitectura del Sistema

### Estructura de Directorios

```
medicsystem/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── hooks/         # Hooks personalizados
│   │   └── lib/           # Utilidades
├── server/                # Backend Express
│   ├── routes.ts         # Rutas API
│   ├── storage.ts        # Capa de datos
│   └── index.ts          # Servidor principal
├── shared/               # Código compartido
│   └── schema.ts         # Esquemas de base de datos
└── README.md            # Este archivo
```

### API Endpoints

- `GET /api/patients` - Buscar pacientes
- `POST /api/patients` - Crear nuevo paciente
- `GET /api/consultations` - Obtener consultas
- `POST /api/consultations` - Crear nueva consulta
- `GET /api/dashboard/stats` - Estadísticas del dashboard

## Mantenimiento

### Actualizaciones del Sistema

1. Hacer respaldo de la base de datos
2. Actualizar dependencias: `npm update`
3. Ejecutar migraciones: `npm run db:push`
4. Reiniciar la aplicación

### Monitoreo

- Revisar logs del servidor regularmente
- Monitorear el espacio en disco de la base de datos
- Verificar el rendimiento de las consultas SQL

## Soporte y Contacto

Para soporte técnico o consultas sobre el sistema:

1. **Documentación**: Revisa este README y `replit.md`
2. **Logs**: Consulta los logs del servidor para errores específicos
3. **Base de Datos**: Usa las herramientas de PostgreSQL para diagnósticos

## Changelog

- **v1.0.0** (Julio 2025): Versión inicial con gestión completa de pacientes, consultas y citas
- **v1.1.0** (Julio 2025): Búsqueda mejorada de pacientes por nombre y cédula, flujo optimizado para pacientes nuevos

---

**MedSystem** - Sistema Integral de Registros Médicos Electrónicos  
Desarrollado con React, Express y PostgreSQL