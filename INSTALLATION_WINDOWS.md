# 📦 GUÍA DE INSTALACIÓN - Windows PowerShell

## ⚠️ Problema: PowerShell Execution Policy

Si recibiste este error:

```
No se puede cargar el archivo porque la ejecución de scripts está deshabilitada en este sistema
```

**Solución:** Abre PowerShell como Administrador y ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego responde `Y` (Sí) cuando pregunte.

---

## 🚀 Pasos de Instalación

### 1. Verificar Node.js instalado
```powershell
node --version
npm --version
```

Debe mostrar versiones (ej: v22.15.1 y 10.9.0).
Si no aparece, [descarga Node.js 18+](https://nodejs.org/).

### 2. Abrir terminal en la carpeta del proyecto
```powershell
cd "C:\Users\josem_6ac6g6r\Escritorio\Proyecto Alex\3.0\control-operativo-realtime"
```

### 3. Instalar dependencias
```powershell
npm install
```

Debe crear/actualizar carpeta `node_modules/` (toma ~30 seg).

### 4. Ejecutar script de verificación
```powershell
node scripts/init.js
```

Debe mostrar:
```
✅ Node.js v22.15.1
✅ package.json encontrado
✅ node_modules instalado
...
✨ Verificación completa!
```

### 5. Iniciar servidor
```powershell
npm start
```

Debe mostrar:
```
============================================================
🚀 SERVIDOR INICIADO
Environment: development
Puerto: 3000
URL: http://localhost:3000
Admin:   http://localhost:3000/admin.html
Pantalla: http://localhost:3000/display.html
============================================================
```

### 6. Abrir en navegador
- **Admin:** http://localhost:3000/admin.html
- **Pantalla:** http://localhost:3000/display.html

---

## 🎯 Verificación rápida

✅ **Admin cargó correctamente:** Formulario con campos visibles  
✅ **Pantalla pública cargó:** Tabla con 3 registros de ejemplo  
✅ **Crear registro funciona:** Rellenar y clickear "Guardar"  
✅ **Actualización en tiempo real:** Nuevo registro aparece en pantalla pública

---

## 🔧 Troubleshooting

### "npm: No se puede cargar..."
→ Ejecuta como Administrador y:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Puerto 3000 ya está en uso"
→ Editar `server\.env`:
```
PORT=3001
```
Luego `npm start` de nuevo.

### "Cannot find module 'express'"
→ Ejecutar: `npm install`

### "Error al leer records.json"
→ El archivo se recrea solo. Si persiste:
```powershell
echo "[]" > "server\data\records.json"
```

---

## 🌐 Acceso desde otra PC

Usa la IP local en vez de `localhost`:

**En tu PC:**
1. Abre PowerShell
2. Ejecuta: `ipconfig` 
3. Busca "IPv4 Address" (ej: 192.168.1.100)

**Desde otra PC:**
- Admin: `http://192.168.1.100:3000/admin.html`
- Pantalla: `http://192.168.1.100:3000/display.html`

---

## 🛑 Detener servidor

En la terminal donde corre, presiona: `Ctrl + C`

---

## 📝 Scripts útiles

```powershell
npm start       # Iniciar servidor
npm run dev     # Modo desarrollo con logs detallados
npm run init    # Verificar setup
npm run setup   # npm install + init (primera vez)
```

---

¡Listo! Tu aplicación está 100% funcional. 🎉
