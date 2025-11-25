# 🚌 Sistema de Control Operativo en Tiempo Real
## Especificación Técnica para Cotización

**Proyecto:** Terminal de Ómnibus Ciudad del Este  
**Versión:** 2.0 Professional Display  
**Fecha:** Noviembre 2025  
**Ambiente:** Local Network (Intranet)

---

## 📋 RESUMEN EJECUTIVO

Sistema web profesional de control operativo para terminal de ómnibus que permite:
- ✅ Registro en tiempo real de entradas/salidas de buses
- ✅ Pantalla pública de información actualizada instantáneamente
- ✅ Panel administrativo con autenticación
- ✅ Sincronización bidireccional en tiempo real (WebSocket)
- ✅ Persistencia de datos en JSON
- ✅ Interfaz profesional con diseño moderno

---

## 🏗️ ARQUITECTURA TÉCNICA

### Stack Tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| **Backend** | Node.js + Express | v22.15.1 / 4.19.2 |
| **Real-time** | Socket.IO | 4.7.5 |
| **Frontend** | HTML5 + CSS3 + Vanilla JS | ES6+ |
| **Persistencia** | JSON + File System | Nativo |
| **Servidor HTTP** | Express + http nativo | Integrado |
| **CORS** | Express CORS | Habilitado |

### Requisitos del Sistema

- **Node.js:** v18 o superior
- **Puerto:** 3000 (configurable)
- **Memoria:** ~80MB (bajo uso)
- **Almacenamiento:** Mínimo 100MB para registros
- **Red:** Local network (intranet)
- **Navegadores:** Chrome, Firefox, Edge (últimas versiones)

---

## 🎯 FUNCIONALIDADES PRINCIPALES

### 1. PANEL ADMINISTRATIVO (`admin.html`)

#### 1.1 Sistema de Autenticación
- ✅ Login modal con credenciales simples
- ✅ Credenciales por defecto: `admin` / `admin2025`
- ✅ Sesión basada en `sessionStorage`
- ✅ Token de sesión con duración de sesión del navegador
- ✅ Logout con limpieza de sesión
- ✅ Interfaz profesional con validación de campos

**Código de autenticación:**
```javascript
// Login validation
credenciales: admin/admin2025
Almacenamiento: sessionStorage.adminToken
Duración: Sesión del navegador (se limpia al cerrar)
```

#### 1.2 Formulario de Registro
Campos capturados para cada viaje:

**INFORMACIÓN DE EMPRESA**
- Empresa (Requerido) - Nombre de la transportista
- N° Interno / Chapa - Identificador interno
- N° de Coche - Identificador del vehículo
- Tipo de Servicio - Común, Semi-cama, Cama Total, Internacional

**INFORMACIÓN DE VIAJE**
- Origen / Destino (Requerido) - Ruta del viaje
- Evento (Requerido) - SALIDA o INGRESO
- Hora Programada - Horario planeado
- Hora Real (Requerido) - Hora de ejecución efectiva

**INFORMACIÓN OPERATIVA**
- Plataforma - Número de andén/plataforma
- Observaciones - Retrasos, trasbordos, incidencias
- Conductor - Nombre del conductor
- Copiloto - Nombre del copiloto
- Iniciales/Firma - Abreviatura del responsable
- Inspector - Nombre del supervisor

**DATOS CUANTITATIVOS**
- Pasajeros - Cantidad de pasajeros
- Boletos - Cantidad de boletos vendidos
- Precio - Tarifa en Guaraníes (Gs.)
- Kilometraje - KM recorridos
- Combustible - Nivel de combustible (3/4, 50%, etc)

#### 1.3 Validación del Formulario
- ✅ Validación de campos requeridos antes de envío
- ✅ Mensajes de error claros y contextualizados
- ✅ Bloqueo de envío si faltan datos obligatorios
- ✅ Reset/limpiar formulario con un botón
- ✅ Auto-focus en campo de empresa después de guardar

#### 1.4 Tabla de Registros Recientes
- ✅ Muestra últimos registros creados
- ✅ Columnas: Hora Real, Empresa, Ruta, Evento, Precio
- ✅ Botón de eliminar para cada registro
- ✅ Actualización en tiempo real vía WebSocket
- ✅ Confirmación antes de eliminar

#### 1.5 Alertas y Notificaciones
- ✅ Alertas de éxito (verde) - Registro guardado
- ✅ Alertas de error (rojo) - Validación/servidor
- ✅ Alertas informativas (azul) - Confirmaciones
- ✅ Animación de entrada suave
- ✅ Auto-cierre después de 4 segundos

---

### 2. PANTALLA PÚBLICA DE DISPLAY (`display.html`)

#### 2.1 Interfaz de Visualización
- ✅ Pantalla full-screen optimizada para monitores
- ✅ Tabla responsive con sticky header
- ✅ Diseño profesional con terminal branding
- ✅ Indicador de conexión en tiempo real

#### 2.2 Información Mostrada
**Columnas de la tabla:**
1. **Hora** - Programada con delta relativo (en 5 min, hace 3 min)
2. **Estado** - Badge dinámico con estado del viaje
3. **Empresa** - Nombre de la transportista
4. **Ruta** - Origen/Destino con tipo de evento
5. **Plataforma** - Número de andén (oculto en <1024px)
6. **Precio** - Tarifa en Gs con numerales tabulares

#### 2.3 Estados Dinámicos (Badge)
El sistema calcula automáticamente el estado de cada viaje:

```javascript
Estados implementados:
├─ "Programado" - No hay horario programado
├─ "⚠️ Próximo" - Falta 1-5 minutos para salida
├─ "Próxima" - Falta más de 5 minutos
├─ "+Xm" - Retraso de X minutos (amarillo)
├─ "−Xm" - Adelanto de X minutos (rojo)
├─ "A tiempo" - Dentro de ±3 minutos
├─ "✓ Salió" - Acaba de salir (<5 min)
└─ "✓ Salió hace Xm" - Pasó hace X minutos
```

#### 2.4 Filtros de Búsqueda
- ✅ Filtro por evento (SALIDA/INGRESO)
- ✅ Búsqueda por empresa (búsqueda parcial)
- ✅ Búsqueda por ruta (búsqueda parcial)
- ✅ Filtro "Próximas 6h" (últimos 15 min + próximas 6 horas)
- ✅ Botón de recarga manual
- ✅ Botón de pantalla completa

#### 2.5 Sincronización en Tiempo Real
- ✅ WebSocket bidireccional con Socket.IO
- ✅ Fallback a polling si WebSocket no disponible
- ✅ Refresh de estados cada 1 segundo
- ✅ Sincronización de hora servidor cada 30 segundos
- ✅ Auto-reconexión con backoff exponencial
- ✅ Indicador visual de conexión/desconexión

#### 2.6 Reloj en Vivo
- ✅ Reloj en tiempo real en esquina superior derecha
- ✅ Formato: DD/MM/YYYY HH:MM:SS
- ✅ Actualización cada 500ms
- ✅ Zona horaria: Paraguay (PY)

---

### 3. BACKEND API (`server.js`)

#### 3.1 Endpoints REST

**GET /api/records**
```
Descripción: Obtiene lista de registros con filtros
Parámetros query:
  - from: ISO date (filtra por fecha mínima)
  - to: ISO date (filtra por fecha máxima)
  - evento: "SALIDA" | "INGRESO"
  - empresa: string (búsqueda parcial)
  - trayecto: string (búsqueda parcial)
  - limit: número (máx 20000, default 5000)
Respuesta: Array de registros JSON
```

**POST /api/records**
```
Descripción: Crea un nuevo registro
Body requerido:
  {
    empresa: string (requerido),
    trayecto: string (requerido),
    evento: string (requerido),
    horaReal: ISO datetime (requerido),
    horaProgramada: ISO datetime (opcional),
    chapa: string,
    numeroCoche: string,
    tipoServicio: string,
    plataforma: string,
    observaciones: string,
    conductor: string,
    copiloto: string,
    firma: string,
    inspector: string,
    pasajeros: number,
    boletos: number,
    precio: number,
    km: number,
    combustible: string
  }
Respuesta: Objeto del registro creado con ID único
Broadcast: Emite evento 'record:new' a todos los clientes
```

**DELETE /api/records/:id**
```
Descripción: Elimina un registro por ID
Parámetro: id (UUID)
Respuesta: { ok: true }
Broadcast: Emite evento 'record:deleted' a todos los clientes
```

**POST /api/import**
```
Descripción: Import masivo (sobrescribe todos los registros)
Body: Array de registros
Respuesta: { ok: true, count: número }
Broadcast: Emite evento 'records:reset' a todos los clientes
```

**GET /api/server-time**
```
Descripción: Obtiene hora actual del servidor para sincronización
Respuesta: { timestamp: number (ms), iso: string (ISO 8601) }
Uso: El cliente calcula offset para sincronizar relojes
```

**GET /healthz**
```
Descripción: Health check del servidor
Respuesta: { ok: true, ts: timestamp }
```

#### 3.2 Funcionalidades del Backend

**Persistencia de Datos**
- ✅ Almacenamiento en `server/data/records.json`
- ✅ Escritura atómica con archivo temporal
- ✅ Validación y normalización de datos
- ✅ Generación automática de UUIDs
- ✅ Cálculo de puntualidad en minutos

**Socket.IO Events**
```
Eventos emitidos:
  - record:new: Nuevo registro creado
  - record:deleted: Registro eliminado
  - records:reset: Importación masiva completada
  - ping/pong: Heartbeat (opcional)

Eventos escuchados:
  - connect: Cliente conectado
  - disconnect: Cliente desconectado
  - error: Error en la conexión
```

**Logging**
- ✅ Logs estructurados con timestamp ISO
- ✅ Niveles: INFO, ERROR, WARN, DEBUG
- ✅ Debug mode activable en development
- ✅ Registro de conexiones/desconexiones
- ✅ Auditoría de operaciones

#### 3.3 Validación de Datos

```javascript
Campos requeridos para nuevo registro:
  - empresa (no vacío)
  - trayecto (no vacío)
  - evento (no vacío)
  - horaReal (no vacío)

Campos calculados automáticamente:
  - id: UUID único
  - ts: timestamp de creación
  - puntualidadMin: diferencia entre horaReal y horaProgramada
```

---

## 🎨 DISEÑO Y UX

### Paleta de Colores

```
Fondo: Gradiente azul oscuro (050a15 → 030508)
Acentos principales:
  - Teal (#1fe1d6) - Primario, indicador de tiempo real
  - Cyan (#00d9ff) - Secundario, reloj
  - Lime (#00ff88) - Énfasis, precios
Estados:
  - Verde (#10b981) - Éxito, a tiempo
  - Naranja (#f59e0b) - Advertencia, próximo
  - Rojo (#ef4444) - Peligro, retraso, logout
  - Azul (#3b82f6) - Info, botones primarios
```

### Tipografía

```
UI: Outfit (400-800 weights)
  - Headers: 800 weight, 20-28px
  - Botones: 700 weight, 12-14px
  - Texto: 400-500 weight, 13-16px

Datos numéricos: Space Mono (monoespaciada)
  - Horas: 18-24px, font-variant-numeric: tabular-nums
  - Precios: 16px, font-weight: 800
  - Garantiza alineación perfecta de columnas
```

### Efectos Visuales

```
Glassmorphism: backdrop-filter blur(12px) + saturate(150%)
Glows: 0 0 20px rgba(color, 0.3)
Sombras: 0 8px 24px rgba(0,0,0,0.7)
Transiciones: 0.2-0.3s cubic-bezier easing
Animaciones:
  - Pulse glow: 2s infinite (indicador de conexión)
  - Shimmer: 1.8s linear (skeleton loading)
  - Slide-in: 0.3s ease (alertas)
```

### Responsive Design

```
Breakpoints:
  - Desktop (>1024px): Todas las columnas visibles
  - Tablet (768-1024px): Oculta plataforma
  - Mobile (<768px): Layout de columna, stack vertical
  
Viewport: width-device-width, initial-scale=1
Fuente base: 16px con clamp() para escalado fluido
```

---

## 🔒 SEGURIDAD

### Consideraciones Actuales

- ✅ CORS habilitado (desarrollo local)
- ✅ JSON input validation en todas las rutas
- ✅ sessionStorage para autenticación (no persistente)
- ✅ Credenciales hardcoded (solo desarrollo)

### Recomendaciones para Producción

- ⚠️ Agregar HTTPS/SSL
- ⚠️ Implementar autenticación por base de datos
- ⚠️ Rate limiting en endpoints API
- ⚠️ Validación + sanitización de inputs
- ⚠️ CORS restringido a dominios conocidos
- ⚠️ Backup automático de datos

---

## 📊 CARACTERÍSTICAS DE DATOS

### Estructura del Registro

```json
{
  "id": "uuid",
  "ts": 1731337796000,
  "empresa": "NSA",
  "chapa": "P-123456",
  "numeroCoche": "ABC-1234",
  "tipoServicio": "Común",
  "trayecto": "Asunción → CDE",
  "evento": "SALIDA",
  "horaProgramada": "2025-11-11T15:30:00",
  "horaReal": "2025-11-11T15:35:00",
  "plataforma": "3",
  "observaciones": "Ligero retraso",
  "conductor": "Juan Pérez",
  "copiloto": "María García",
  "firma": "JP",
  "inspector": "Carlos López",
  "pasajeros": 45,
  "boletos": 47,
  "precio": 50000,
  "km": 325,
  "combustible": "3/4",
  "puntualidadMin": 5
}
```

### Cálculos Automáticos

- **puntualidadMin:** `Math.round((horaReal - horaProgramada) / 60000)`
- **Minutos hasta viaje:** `Math.round((horaProgramada - ahora) / 60000)`
- **Minutos desde viaje:** `Math.round((ahora - horaProgramada) / 60000)`

---

## 🚀 FLUJOS DE OPERACIÓN

### Flujo 1: Crear Registro
```
1. Usuario accede a admin.html
2. Se autentica (login)
3. Completa formulario de registro
4. Click en "Guardar Registro"
5. Frontend valida campos requeridos
6. POST /api/records con datos
7. Backend normaliza y valida
8. Guarda en records.json
9. Emite evento 'record:new' vía Socket.IO
10. Display actualiza tabla automáticamente
11. Admin recibe confirmación de éxito
```

### Flujo 2: Ver Pantalla de Tiempo Real
```
1. Monitor/dispositivo accede a display.html
2. Se carga con últimos 15 min + próximas 6h
3. Socket.IO conecta (WebSocket o polling)
4. Sincroniza hora con servidor
5. Cada segundo: recalcula estados
6. Cuando hay cambios: Backend emite evento
7. Display re-renderiza solo lo necesario
8. Usuario ve actualizaciones instantáneas
```

### Flujo 3: Eliminar Registro
```
1. Admin click en botón eliminar
2. Se pide confirmación
3. DELETE /api/records/:id
4. Backend elimina de JSON
5. Emite 'record:deleted'
6. Admin tabla se actualiza
7. Display tabla se actualiza
```

---

## 📱 DISPOSITIVOS SOPORTADOS

| Dispositivo | Uso Recomendado | Resolución |
|-----------|-----------------|-----------|
| Desktop | Panel Admin | 1920x1080+ |
| Monitor 4K | Display Público | 3840x2160 |
| Tablet | Admin móvil | 768x1024 |
| Smartphone | Consultas | 375x667 |
| Smart TV | Display | Cualquiera |

---

## ⚙️ CONFIGURACIÓN

### app.config.js
```javascript
module.exports = {
  port: 3000,
  nodeEnv: 'development',
  dataDir: './server/data',
  dataFile: './server/data/records.json',
  socketIOOptions: {
    transports: ['websocket', 'polling'],
    cors: { origin: '*' }
  }
};
```

### Variables de Entorno
- PORT (por defecto 3000)
- NODE_ENV (development/production)

---

## 📈 RENDIMIENTO

### Optimizaciones Implementadas

- ✅ Table-layout: fixed para renderizado más rápido
- ✅ Font-variant-numeric: tabular-nums (sin reflow)
- ✅ CSS custom properties para temas dinámicos
- ✅ ResizeObserver para header dinámico
- ✅ Socket.IO con polling fallback
- ✅ JSON plano vs base de datos (simpleza)
- ✅ Lazy rendering en tabla

### Límites de Escalabilidad

- Registros: hasta 20,000 por consulta (configurable)
- Clientes concurrentes: ~50-100 (Socket.IO estándar)
- Almacenamiento: JSON plano sin indexación
- Recomendación: Migrar a DB SQL/MongoDB si >100k registros

---

## 🔧 INSTALACIÓN Y DESPLIEGUE

### Requisitos Previos
```bash
- Node.js v18+
- npm o yarn
- Puerto 3000 disponible
```

### Instalación
```bash
npm install
```

### Iniciar Servidor
```bash
npm start
# o directamente
node server/server.js
```

### URLs de Acceso
- Panel Admin: http://localhost:3000/admin.html
- Pantalla Pública: http://localhost:3000/display.html
- API: http://localhost:3000/api/records

---

## 📚 DOCUMENTACIÓN DE APIS

### Ejemplo: Crear Registro
```bash
curl -X POST http://localhost:3000/api/records \
  -H "Content-Type: application/json" \
  -d '{
    "empresa": "NSA",
    "trayecto": "Asunción → CDE",
    "evento": "SALIDA",
    "horaReal": "2025-11-11T15:35:00"
  }'
```

### Ejemplo: Listar con Filtros
```bash
curl "http://localhost:3000/api/records?empresa=NSA&evento=SALIDA&limit=50"
```

### Ejemplo: Obtener Hora del Servidor
```bash
curl http://localhost:3000/api/server-time
# Respuesta: {"timestamp":1731337796000,"iso":"2025-11-11T15:36:36.000Z"}
```

---

## 🎓 CAPACITACIÓN REQUERIDA

### Para Administradores
- Cómo acceder al panel (admin/admin2025)
- Completar formulario de registro
- Entender los campos obligatorios
- Ver alertas de éxito/error
- Eliminar registros erróneos
- Logout al finalizar

### Para Operadores de Pantalla
- Encender monitor y acceder a display.html
- Usar filtros para buscar viajes
- Interpretar los badges de estado
- Mantalla completa para presentación
- Reconocimiento de cambios en tiempo real

---

## 🐛 TROUBLESHOOTING

### Problema: Display no actualiza
- ✓ Verificar conexión WebSocket en DevTools
- ✓ Recargar página con F5
- ✓ Verificar servidor está corriendo
- ✓ Revisar logs en consola

### Problema: Admin no guarda registros
- ✓ Verificar login está autenticado
- ✓ Completar todos los campos requeridos (*)
- ✓ Verificar fecha/hora en formato válido
- ✓ Revisar errores en consola

### Problema: Campos no alineados
- ✓ Limpiar cache: Ctrl+Shift+Supr
- ✓ Recargar forzado: Ctrl+F5
- ✓ Cerrar y abrir navegador

---

## 📝 NOTAS FINALES

Este sistema está optimizado para **uso en red local (intranet)**. Para exposición a Internet se requieren implementaciones adicionales de seguridad, autenticación robusta y protocolo HTTPS.

El código es **modular y extensible**, permitiendo fácil adición de nuevas funcionalidades como reportes, exportación a Excel, autenticación por LDAP, integración con base de datos, etc.

---

**Documento preparado para cotización técnica**  
**Terminal de Ómnibus Ciudad del Este**  
**v2.0 Professional Display - 2025**
