// Script de prueba automática
// Abre este archivo en la consola del navegador (F12) para ejecutarlo

console.log('🧪 INICIANDO PRUEBAS AUTOMÁTICAS...\n');

const API = 'http://localhost:3000';
const testData = {
  empresa: 'PRUEBA AUTOMATICA',
  trayecto: 'Asunción → Test City',
  evento: 'SALIDA',
  horaReal: new Date().toISOString(),
  horaProgramada: new Date().toISOString(),
  chapa: 'TEST-001',
  numeroCoche: 'C-9999',
  tipoServicio: 'prueba',
  plataforma: '99',
  precio: 199999,
  conductor: 'Test Driver',
  copiloto: 'Test Copilot',
  pasajeros: 99,
  boletos: 99
};

async function test1_ListarRegistros() {
  console.log('📋 TEST 1: Listar registros...');
  try {
    const res = await fetch(API + '/api/records');
    const data = await res.json();
    console.log('✅ TEST 1 PASADO - Registros actuales:', data.length);
    console.log(data);
    return data;
  } catch (e) {
    console.error('❌ TEST 1 FALLÓ:', e);
    return null;
  }
}

async function test2_CrearRegistro() {
  console.log('\n📝 TEST 2: Crear registro...');
  try {
    const res = await fetch(API + '/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const rec = await res.json();
    console.log('✅ TEST 2 PASADO - Registro creado:');
    console.log(rec);
    return rec;
  } catch (e) {
    console.error('❌ TEST 2 FALLÓ:', e);
    return null;
  }
}

async function test3_VerificarEnDisplay() {
  console.log('\n📺 TEST 3: Verificar en Display...');
  try {
    // Esperar un poco para que Socket.IO procese el evento
    await new Promise(r => setTimeout(r, 1000));
    
    const res = await fetch(API + '/api/records');
    const records = await res.json();
    const testRecord = records.find(r => r.empresa === 'PRUEBA AUTOMATICA');
    
    if (testRecord) {
      console.log('✅ TEST 3 PASADO - Registro visible en Display:');
      console.log(testRecord);
      return true;
    } else {
      console.error('❌ TEST 3 FALLÓ - Registro no encontrado');
      return false;
    }
  } catch (e) {
    console.error('❌ TEST 3 FALLÓ:', e);
    return false;
  }
}

async function test4_EliminarRegistro(id) {
  console.log('\n🗑️  TEST 4: Eliminar registro...');
  try {
    const res = await fetch(API + '/api/records/' + id, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    console.log('✅ TEST 4 PASADO - Registro eliminado');
    return true;
  } catch (e) {
    console.error('❌ TEST 4 FALLÓ:', e);
    return false;
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  SUITE DE PRUEBAS AUTOMÁTICAS         ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const registrosActuales = await test1_ListarRegistros();
  const nuevoRegistro = await test2_CrearRegistro();
  
  if (nuevoRegistro) {
    const verificado = await test3_VerificarEnDisplay();
    
    if (verificado) {
      console.log('\n🎉 TODOS LOS TESTS PASARON!');
      console.log('\n📋 RESUMEN:');
      console.log('- Registros iniciales:', registrosActuales?.length || 0);
      console.log('- Nuevo registro ID:', nuevoRegistro.id);
      console.log('- Empresa:', nuevoRegistro.empresa);
      console.log('- Empresa:', nuevoRegistro.empresa);
      console.log('\n💡 Abre la Pantalla Pública en otra pestaña para ver el cambio en tiempo real!');
    }
  }
}

// Ejecutar
runAllTests();
