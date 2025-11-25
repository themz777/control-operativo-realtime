#!/usr/bin/env node
/**
 * Script de inicialización - Verifica que todo esté listo
 * Ejecución: node scripts/init.js
 */

const fs = require('fs');
const path = require('path');

const checks = [];

function check(name, fn) {
  checks.push({ name, fn });
}

function ok(msg) { console.log(`✅ ${msg}`); }
function warn(msg) { console.log(`⚠️  ${msg}`); }
function err(msg) { console.log(`❌ ${msg}`); process.exit(1); }

console.log('\n🚀 Iniciando verificación del proyecto...\n');

// 1. Verificar Node.js
check('Node.js version', () => {
  const ver = parseInt(process.version.split('.')[0].slice(1));
  if (ver >= 18) ok(`Node.js ${process.version}`);
  else err(`Se requiere Node.js 18+, tienes ${process.version}`);
});

// 2. Verificar package.json
check('package.json', () => {
  const pjsonPath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(pjsonPath)) ok('package.json encontrado');
  else err('package.json no encontrado');
});

// 3. Verificar node_modules
check('node_modules', () => {
  const nmPath = path.join(__dirname, '..', 'node_modules');
  if (fs.existsSync(nmPath)) ok('node_modules instalado');
  else warn('node_modules NO instalado. Ejecuta: npm install');
});

// 4. Verificar .env
check('.env', () => {
  const envPath = path.join(__dirname, '..', 'server', '.env');
  if (fs.existsSync(envPath)) ok('.env encontrado');
  else warn('.env NO encontrado. Creando default...');
});

// 5. Verificar data directory
check('Data directory', () => {
  const dataDir = path.join(__dirname, '..', 'server', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    ok(`Directorio data creado`);
  } else {
    ok(`Directorio data existe`);
  }
});

// 6. Verificar records.json
check('records.json', () => {
  const recordsPath = path.join(__dirname, '..', 'server', 'data', 'records.json');
  if (fs.existsSync(recordsPath)) {
    ok('records.json encontrado');
  } else {
    fs.writeFileSync(recordsPath, '[]', 'utf-8');
    ok('records.json creado (vacío)');
  }
});

// 7. Verificar archivos públicos
check('Archivos públicos', () => {
  const files = ['admin.html', 'display.html', 'styles.css'];
  const publicDir = path.join(__dirname, '..', 'public');
  let missing = [];
  for (const f of files) {
    if (!fs.existsSync(path.join(publicDir, f))) missing.push(f);
  }
  if (missing.length === 0) ok('Todos los archivos públicos presentes');
  else err(`Faltan archivos públicos: ${missing.join(', ')}`);
});

// 8. Verificar server.js
check('server.js', () => {
  const serverPath = path.join(__dirname, '..', 'server', 'server.js');
  if (fs.existsSync(serverPath)) ok('server.js encontrado');
  else err('server.js no encontrado');
});

// Ejecutar checks
let allOk = true;
for (const { name, fn } of checks) {
  try {
    fn();
  } catch (e) {
    err(`Error en ${name}: ${e.message}`);
  }
}

console.log('\n✨ Verificación completa!\n');
console.log('📍 Para iniciar el servidor, ejecuta:');
console.log('   npm start\n');
console.log('🌐 URLs:');
console.log('   Admin:     http://localhost:3000/admin.html');
console.log('   Pantalla:  http://localhost:3000/display.html\n');
