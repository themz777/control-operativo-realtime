````markdown
# Control Operativo – Tiempo Real (Express + Socket.IO)

Tablero público y administración **en tiempo real**, sin exportar JSON ni recargar manualmente.

## 🎯 Características

✅ **Tiempo Real** - WebSocket para actualizaciones instantáneas  
✅ **Admin Panel** - Crear y gestionar registros  
✅ **Pantalla Pública** - Mostrar horarios y precios  
✅ **Persistencia** - Datos guardados en JSON (fácil de migrar)  
✅ **Filtros Avanzados** - Por evento, empresa, destino  
✅ **Responsive** - Funciona en desktop, tablet, móvil  
✅ **Sin dependencias de BD** - Listo para usar sin config extra  

## 📋 Requisitos

- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **Red local (LAN)** - No exponer a Internet sin HTTPS y autenticación

## ⚡ Instalación Rápida (3 pasos)

### 1️⃣ Descargar/Clonar
```bash
git clone <tu-repo-aqui>
cd control-operativo-realtime
```

### 2️⃣ Instalar dependencias
```bash
npm install
# o si prefieres usar el script de setup:
npm run setup
```

### 3️⃣ Iniciar servidor
```bash
npm start
```

**Listo!** El servidor estará corriendo en `http://localhost:3000`

## 🌐 Acceso

Una vez iniciado el servidor, abre en tu navegador:

- **Panel Admin** → `http://localhost:3000/admin.html`
  - Crear registros de salida/ingreso
  - Ver registros recientes
  - Editar/eliminar registros

- **Pantalla Pública** → `http://localhost:3000/display.html`
  - Mostrar en pantalla grande
  - Filtros de evento, empresa, destino
  - Actualización automática cada 60 seg + tiempo real
  - Botón de pantalla completa

## 🏗️ Estructura del Proyecto

```
control-operativo-realtime/
├── server/
│   ├── server.js              # Servidor Express + Socket.IO
│   ├── .env                   # Variables de entorno (crear con npm run init)
│   ├── .env.example           # Plantilla de .env
│   └── data/
│       └── records.json       # Datos persistentes
├── public/
│   ├── admin.html             # Panel de administración
│   ├── display.html           # Pantalla pública
│   └── styles.css             # Estilos compartidos
├── scripts/
│   └── init.js                # Script de inicialización
├── app.config.js              # Configuración centralizada
├── package.json               # Dependencias
└── README.md                  # Este archivo
```

## 📊 Flujo de Funcionamiento

1. **Admin ingresa un registro** con formulario
2. **Servidor valida y guarda** en `records.json`
3. **Socket.IO emite evento** `record:new` a todos conectados
4. **Pantalla pública recibe** en tiempo real y actualiza tabla
5. **Refresco de respaldo** cada 60 segundos (si Socket.IO falla)

## 🔧 Configuración

Editar `server/.env`:

```bash
# Puerto del servidor
PORT=3000

# Ambiente (development o production)
NODE_ENV=development

# Nivel de logging (info, debug, warn, error)
LOG_LEVEL=info
```

Ver más opciones en `app.config.js`

## 📡 API REST (Integración)

### Listar registros con filtros
```bash
GET /api/records?from=2024-11-11&to=2024-11-12&evento=SALIDA&limit=100
```

**Respuesta:**
```json
[
  {
    "id": "uuid-1",
    "ts": 1699719600000,
    "empresa": "La Yuteña",
    "trayecto": "Asunción → Ciudad del Este",
    "evento": "SALIDA",
    "horaReal": "2024-11-11T08:05:00",
    "precio": 180000,
    ...
  }
]
```

### Crear registro
```bash
POST /api/records
Content-Type: application/json

{
  "empresa": "La Yuteña",
  "trayecto": "Asunción → CDE",
  "evento": "SALIDA",
  "horaReal": "2024-11-11T08:05:00",
  "horaProgramada": "2024-11-11T08:00:00",
  "precio": 180000
}
```

### Eliminar registro
```bash
DELETE /api/records/{id}
```

### Importar datos masivos
```bash
POST /api/import
Content-Type: application/json

[
  { "empresa": "NSA", "trayecto": "...", ... },
  { "empresa": "Crucero", "trayecto": "...", ... }
]
```

## 🎮 Scripts disponibles

```bash
npm start          # Iniciar servidor en modo producción
npm run dev        # Iniciar en modo desarrollo (con logs)
npm run init       # Verificar setup y crear archivos faltantes
npm run setup      # npm install + init (primera vez)
```

## 🔍 Troubleshooting

### "Puerto 3000 ya está en uso"
```bash
# Cambiar puerto en server/.env
PORT=3001
```

### "No puedo acceder desde otra PC"
- Usa la IP local en vez de localhost:
  ```
  http://192.168.X.X:3000/admin.html
  ```
- Verifica que el firewall permita puerto 3000

### "Los datos desaparecieron"
- Revisa `server/data/records.json`
- Si está vacío, puedes restaurar un backup o importar:
  ```bash
  curl -X POST http://localhost:3000/api/import \
    -H "Content-Type: application/json" \
    -d '[{"empresa":"NSA",...}]'
  ```

### "Socket.IO no conecta"
- Abre la consola del navegador (F12)
- Verifica que no haya errores CORS
- Intenta reconectar: reentra al sitio

## 🚀 Deploy

### Producción Local (Intranet)

1. Editar `.env`:
   ```
   NODE_ENV=production
   PORT=3000
   ```

2. Iniciar:
   ```bash
   npm start
   ```

3. (Opcional) Usar PM2 para mantener corriendo:
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name "control-operativo"
   pm2 save
   ```

### Internet (no recomendado sin seguridad)

⚠️ **CRÍTICO**: Si expones a Internet, agrega:

1. **HTTPS** - Let's Encrypt (certbot)
2. **Autenticación** - JWT o sesiones
3. **CORS restringido** - Solo dominios autorizados
4. **Rate limiting** - Prevenir abuso
5. **Database** - SQLite/PostgreSQL en vez de JSON
6. **Backups** - Automatizados diarios
7. **Logs** - Winston/Morgan para auditoría

Ver rama `security-hardened` para ejemplo.

## 📝 Campos del Registro

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| empresa | string | ✅ | Nombre empresa de transporte |
| trayecto | string | ✅ | Ruta (ej: "Asunción → CDE") |
| evento | enum | ✅ | SALIDA o INGRESO |
| horaReal | datetime | ✅ | Hora de ejecución |
| horaProgramada | datetime | ❌ | Hora planificada (para puntualidad) |
| chapa | string | ❌ | Número de chapa |
| numeroCoche | string | ❌ | Número/ID del coche |
| tipoServicio | string | ❌ | común, semi-cama, cama, etc |
| plataforma | number | ❌ | Número de plataforma |
| observaciones | string | ❌ | Notas libres |
| conductor | string | ❌ | Nombre del conductor |
| copiloto | string | ❌ | Nombre del copiloto |
| firma | string | ❌ | Iniciales/firma |
| inspector | string | ❌ | Nombre del inspector |
| pasajeros | number | ❌ | Cantidad de pasajeros |
| boletos | number | ❌ | Cantidad de boletos |
| precio | number | ❌ | Tarifa (en Gs.) |
| km | number | ❌ | Kilómetros |
| combustible | string | ❌ | Nivel (ej: "3/4", "50%") |

## 📊 Data sample

Se incluye `records.json` con 3 registros de ejemplo para testing.

Para limpiar y empezar de cero:
```bash
echo "[]" > server/data/records.json
```

## 🔐 Seguridad (para Intranet)

Actual:
- ✅ Validación básica de campos
- ✅ Persistencia atómica (sin corrupto)
- ✅ CORS abierto (ajustable en `app.config.js`)

No incluye (agregar si es Internet):
- ❌ Autenticación (login/contraseña)
- ❌ HTTPS
- ❌ Rate limiting
- ❌ SQL injection protection (usa JSON)
- ❌ CSRF tokens

## 💬 Socket.IO Events

Cliente → Servidor:
- `ping` - Health check

Servidor → Clientes:
- `record:new` - Nuevo registro creado
- `record:deleted` - Registro eliminado
- `records:reset` - Todos los registros reemplazados (import)
- `pong` - Respuesta a ping

## 🐛 Debugging

Habilitar logs detallados:
```bash
LOG_LEVEL=debug npm start
```

O en navegador, abre consola (F12) para ver:
- Eventos Socket.IO
- Requests/Responses
- Errores

## 📞 Soporte

Si tenes problemas:

1. **Lee el README** (este archivo) 📖
2. **Revisa los logs** del servidor (`npm start` muestra TODO)
3. **Abre la consola del navegador** (F12)
4. **Verifica firewall** en port 3000

## 📄 Licencia

MIT

---

**Última actualización:** 2024-11-11  
**Estado:** ✅ Producción-ready (Intranet)

---

### Checklist rápido antes de usar:

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] `npm install` ejecutado
- [ ] `npm start` inicia sin errores
- [ ] Acceso a `http://localhost:3000/admin.html`
- [ ] Acceso a `http://localhost:3000/display.html`
- [ ] Crear un registro de prueba
- [ ] Ver actualización en tiempo real en pantalla pública

¡Listo para usar! 🚀

````
