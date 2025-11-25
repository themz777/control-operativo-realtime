/* Registro de Control Operativo – tiempo real
 * Express + Socket.IO
 * Aviso: para uso en red local (intranet). Si se expone a Internet, agregar HTTPS, auth y hardening.
 */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const config = require('../app.config.js');

const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, config.socketIOOptions);

const PORT = config.port;
const DATA_DIR = config.dataDir;
const DATA_FILE = config.dataFile;

// Logger simple
const logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
  debug: (msg) => config.nodeEnv === 'development' && console.log(`[DEBUG] ${new Date().toISOString()} - ${msg}`)
};

// Helpers de persistencia (JSON plano)
function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      logger.info(`Directorio de datos creado: ${DATA_DIR}`);
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
      logger.info(`Archivo records.json creado`);
    }
  } catch (e) {
    logger.error(`Error al asegurar archivo de datos: ${e.message}`);
  }
}

function readAll() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    logger.error(`Error leyendo records.json: ${e.message}`);
    return [];
  }
}

function writeAll(arr) {
  try {
    // Escribe de forma atómica
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(arr, null, 2), 'utf-8');
    fs.renameSync(tmp, DATA_FILE);
    logger.debug(`Registros guardados. Total: ${arr.length}`);
  } catch (e) {
    logger.error(`Error al guardar records.json: ${e.message}`);
    throw e;
  }
}

function uuid() {
  // Node 18+ soporta crypto.randomUUID
  if (require('crypto').randomUUID) return require('crypto').randomUUID();
  // fallback simple
  return 'id-' + Math.random().toString(36).slice(2) + '-' + Date.now();
}

/** Normaliza y valida un registro entrante. */
function buildRecord(body) {
  const required = ['empresa', 'trayecto', 'evento', 'horaReal'];
  for (const r of required) {
    if (!body[r] || String(body[r]).trim()==='') {
      throw new Error('Campo requerido faltante: ' + r);
    }
  }
  const horaProgramada = body.horaProgramada || null;
  const horaReal = body.horaReal;
  let puntualidadMin = null;
  try {
    if (horaProgramada && horaReal) {
      const dtP = new Date(horaProgramada);
      const dtR = new Date(horaReal);
      puntualidadMin = Math.round((dtR - dtP)/60000);
    }
  } catch {}

  return {
    id: body.id || uuid(),
    ts: body.ts || Date.now(),
    empresa: String(body.empresa || ''),
    chapa: String(body.chapa || ''),
    numeroCoche: String(body.numeroCoche || ''),
    tipoServicio: String(body.tipoServicio || ''),
    trayecto: String(body.trayecto || ''),
    evento: String(body.evento || ''),
    horaProgramada,
    horaReal,
    plataforma: String(body.plataforma || ''),
    observaciones: String(body.observaciones || ''),
    conductor: String(body.conductor || ''),
    copiloto: String(body.copiloto || ''),
    firma: String(body.firma || ''),
    inspector: String(body.inspector || ''),
    pasajeros: body.pasajeros!=null && body.pasajeros!=='' ? Number(body.pasajeros) : null,
    boletos: body.boletos!=null && body.boletos!=='' ? Number(body.boletos) : null,
    precio: body.precio!=null && body.precio!=='' ? Number(body.precio) : null,
    km: body.km!=null && body.km!=='' ? Number(body.km) : null,
    combustible: String(body.combustible || ''),
    puntualidadMin
  };
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Static: frontends
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC_DIR));

// Ruta raíz - redirige a admin.html
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'admin.html'));
});

// API: hora actual del servidor (para sincronización)
app.get('/api/server-time', (req, res) => {
  res.json({ timestamp: Date.now(), iso: new Date().toISOString() });
});

// API: listar con filtros básicos
app.get('/api/records', (req, res) => {
  const { from, to, evento, empresa, trayecto, limit } = req.query;
  const max = Math.min(Number(limit || 5000), 20000);

  let all = readAll();
  // Filtros
  if (from) {
    const d = new Date(from);
    all = all.filter(r => new Date(r.horaReal) >= d);
  }
  if (to) {
    const d = new Date(to);
    all = all.filter(r => new Date(r.horaReal) <= d);
  }
  if (evento) {
    all = all.filter(r => r.evento === evento);
  }
  if (empresa) {
    const q = String(empresa).toLowerCase();
    all = all.filter(r => String(r.empresa || '').toLowerCase().includes(q));
  }
  if (trayecto) {
    const q = String(trayecto).toLowerCase();
    all = all.filter(r => String(r.trayecto || '').toLowerCase().includes(q));
  }

  // Orden descendente por horaReal
  all.sort((a,b) => new Date(b.horaReal) - new Date(a.horaReal));
  res.json(all.slice(0, max));
});

// API: crear registro
app.post('/api/records', (req, res) => {
  try {
    const rec = buildRecord(req.body || {});
    const all = readAll();
    all.push(rec);
    writeAll(all);
    logger.info(`Registro creado: ${rec.id} (${rec.empresa})`);
    io.emit('record:new', rec); // broadcast en tiempo real
    res.status(201).json(rec);
  } catch (e) {
    logger.warn(`Error al crear registro: ${e.message}`);
    res.status(400).json({ error: e.message || 'Bad Request' });
  }
});

// API: eliminar registro
app.delete('/api/records/:id', (req, res) => {
  const id = req.params.id;
  const all = readAll();
  const next = all.filter(r => r.id !== id);
  if (next.length === all.length) {
    logger.warn(`Intento de eliminar registro inexistente: ${id}`);
    return res.status(404).json({ error: 'No existe' });
  }
  writeAll(next);
  logger.info(`Registro eliminado: ${id}`);
  io.emit('record:deleted', { id });
  res.json({ ok: true });
});

// API: import masivo (sobrescribe)
app.post('/api/import', (req, res) => {
  const arr = Array.isArray(req.body) ? req.body : null;
  if (!arr) return res.status(400).json({ error: 'Se espera un arreglo JSON' });
  // Normalizar cada elemento
  const out = [];
  try {
    for (const it of arr) out.push(buildRecord(it));
  } catch (e) {
    logger.warn(`Error en import: ${e.message}`);
    return res.status(400).json({ error: 'Error en un item: ' + e.message });
  }
  writeAll(out);
  logger.info(`Import completado: ${out.length} registros`);
  io.emit('records:reset', out);
  res.json({ ok: true, count: out.length });
});

app.get('/healthz', (_, res) => res.json({ ok: true, ts: Date.now() }));

io.on('connection', (socket) => {
  logger.debug(`Cliente conectado: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.debug(`Cliente desconectado: ${socket.id}`);
  });
  
  socket.on('error', (err) => {
    logger.error(`Socket error (${socket.id}): ${err}`);
  });
  
  // El cliente puede pedir un ping/pong o stats aquí si quiere
  socket.on('ping', () => socket.emit('pong', Date.now()));
});

http.listen(PORT, () => {
  ensureDataFile();
  logger.info(`=`.repeat(60));
  logger.info(`🚀 SERVIDOR INICIADO`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Puerto: ${PORT}`);
  logger.info(`URL: http://localhost:${PORT}`);
  logger.info(`Admin:   http://localhost:${PORT}/admin.html`);
  logger.info(`Pantalla: http://localhost:${PORT}/display.html`);
  logger.info(`Data: ${DATA_FILE}`);
  logger.info(`=`.repeat(60));
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
