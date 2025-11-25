/**
 * Configuración centralizada de la aplicación
 * Carga desde .env y proporciona defaults
 */

const path = require('path');
const fs = require('fs');

module.exports = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  enableLogging: true,
  
  // Data persistence
  dataDir: path.join(__dirname, 'server', 'data'),
  dataFile: path.join(__dirname, 'server', 'data', 'records.json'),
  
  // Socket.IO
  socketIOOptions: {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'DELETE'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingInterval: 25000,
    pingTimeout: 60000,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  },
  
  // Validation
  validation: {
    maxRecordSize: 5000, // caracteres máximo por registro
    maxBatchSize: 20000, // máximo de registros a retornar
    requiredFields: ['empresa', 'trayecto', 'evento', 'horaReal']
  },
  
  // Auto-refresh
  autoRefreshIntervalMs: 60000, // 60 segundos
  
  // Security
  security: {
    enableRateLimiting: false, // TODO: implementar si es necesario
    enableCsrf: false, // local network, no crítico
    enableHttp2: false
  }
};
