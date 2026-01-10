# Residencias Doña Mary - Sistema Completo de Gestión

Una aplicación web moderna, responsiva y completa para gestionar residencias con enfoque en disponibilidad de habitaciones, registro de huéspedes, evaluación emocional IA, manual de convivencia interactivo, panel administrativo y reportes de daños.

## 🎯 Características Principales

### Para Clientes (Páginas Públicas)
- **📍 Página de Disponibilidad**: Visualiza 21 habitaciones con filtro por fechas de entrada/salida
- **📝 Registro Completo**: Captura de:
  - Información personal (nombre, email, teléfono, DNI, dirección)
  - 3 fotos de documentos (cédula frente/reverso + carné estudiante)
  - Cuestionario de 2 preguntas para evaluación emocional IA
- **📖 Manual de Convivencia Interactivo**: Documento scrolleable con aceptación obligatoria
- **📤 Reportes de Daños/Sugerencias**: Formulario para reportar problemas con prioridades

### Para Administradores
- **⚙️ Panel Admin**: 
  - Dashboard con estadísticas (habitaciones ocupadas/disponibles)
  - Listado de huéspedes activos con evaluación emocional
  - Gestión de check-in/check-out
  - Visualización de reportes abiertos
- **🔄 Sincronización con Make**: Botón de exportación/importación de datos (preparado para integración futura)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3 Moderno, JavaScript Vanilla (ES6+)
- **Base de Datos**: IndexedDB (almacenamiento local del navegador)
- **Almacenamiento de Fotos**: Base64 en IndexedDB
- **Evaluación IA**: Lógica local basada en respuestas del cuestionario
- **Diseño**: Mobile-First, Responsive (móvil/tablet/desktop)

## 📁 Estructura de Carpetas

```
src/
├── index.html              # Página principal (disponibilidad)
├── css/
│   ├── styles.css         # Estilos modernos (turquesa/gris)
│   └── responsive.css     # Media queries mobile-first
├── js/
│   ├── app.js            # Aplicación principal y router
│   ├── db.js             # Gestión de IndexedDB
│   ├── ia-evaluator.js   # Evaluador de perfil emocional
│   ├── guests.js         # Registro y gestión de huéspedes
│   ├── rooms.js          # Gestión de habitaciones
│   ├── admin.js          # Panel administrativo
│   └── reports.js        # Gestión de reportes
└── assets/
    └── fonts/            # Tipografías personalizadas
```

## 🎨 Paleta de Colores

- **Primario**: Turquesa (`#1ABC9C`)
- **Primario Oscuro**: Verde Azulado (`#16A085`)
- **Secundario**: Gris Oscuro (`#2C3E50`)
- **Luz**: Gris Claro (`#ECF0F1`)
- **Éxito**: Verde (`#27AE60`)
- **Peligro**: Rojo (`#E74C3C`)
- **Advertencia**: Naranja (`#F39C12`)

## 📱 Responsive Design

- **Mobile**: < 768px (Tab-bar inferior, 1 columna)
- **Tablet**: 768px - 1023px (2 columnas)
- **Desktop**: ≥ 1024px (3-4 columnas)
- **Extra Large**: ≥ 1440px (4+ columnas)

## 🚀 Cómo Usar

### Instalación

1. Descarga el proyecto
2. Navega a la carpeta `residencias-dona-mary`
3. Abre `src/index.html` en tu navegador (o usa un servidor local)

### Servidor Local (Opcional)

**Con Python:**
```bash
cd src
python -m http.server 8000
```

**Con Node.js:**
```bash
npm install -g http-server
cd src
http-server -p 8000
```

### Uso Cliente (Flujo de Registro)

1. **Disponibilidad**: Selecciona fechas y elige una habitación disponible
2. **Registro**: Completa tu información personal y captura tus documentos
3. **Cuestionario**: Responde 2 preguntas sobre tu perfil emocional
4. **Manual**: Lee y acepta el manual de convivencia
5. **Confirmación**: ¡Registro completado!

### Uso Admin

1. Accede a la sección **Admin** (ícono ⚙️ en tab-bar)
2. Visualiza estadísticas de ocupación
3. Gestiona huéspedes activos
4. Sincroniza datos con Make o exporta JSON

## 💾 Almacenamiento de Datos

### IndexedDB (Local)

La aplicación almacena 4 tipos de datos:

1. **Rooms** (Habitaciones)
   - ID, número, tipo, estado, capacidad, características, precio

2. **Guests** (Huéspedes)
   - Información personal, evaluación emocional, fechas, documentos

3. **Documents** (Fotos de Documentos)
   - Base64 de cédula y carné de estudiante

4. **Reports** (Reportes)
   - Tipo, prioridad, descripción, estado, ubicación

### Sincronización con Make

**Exportación JSON**:
```json
{
  "exportDate": "2025-12-10T...",
  "rooms": [...],
  "guests": [...],
  "reports": [...]
}
```

**Preparado para**: Integración con Make.com (webhook) y Google Drive/Excel

## 🤖 Evaluación Emocional IA

### Cuestionario
1. **Actitud hacia convivencia**: Escala 1-5 (Privacidad → Muy Sociable)
2. **Estado emocional actual**: Escala 1-5 (Muy Bajo → Muy Alto)

### Perfil Generado
- Nivel de convivencia esperado
- Perfil emocional del cliente
- Recomendaciones para el staff
- Resumen personalizado

### Datos Almacenados
```javascript
{
  coexistenceScore: 4,
  emotionalScore: 4,
  overallScore: 4,
  coexistenceProfile: { level, description, color },
  emotionalProfile: { level, description, color },
  recommendations: [],
  summary: "Texto descriptivo"
}
```

## 📝 Manual de Convivencia

**Secciones Incluidas**:
- Bienvenida y propósito
- Horarios (ingreso/egreso/silencio)
- Normas de convivencia
- Cuidado de habitaciones
- Políticas de visitantes
- Medidas de seguridad
- Servicios incluidos
- Incumplimientos y sanciones

✅ **Aceptación obligatoria** antes de completar registro

## 🔧 API/Métodos Principales

### App.js
```javascript
App.init()                    // Inicializa la aplicación
App.showSection(sectionId)   // Cambia de sección
App.renderAvailability()     // Renderiza disponibilidad
App.selectRoom(roomId)       // Selecciona habitación
App.syncWithMake()           // Sincroniza con Make
App.exportData()             // Exporta JSON
App.importData(jsonFile)     // Importa datos
```

### Guests.js
```javascript
Guests.renderRegistrationForm()      // Formulario de registro
Guests.validateAndSubmitForm()       // Valida datos
Guests.acceptManualAndComplete()     // Completa registro
```

### Admin.js
```javascript
Admin.renderDashboard()              // Panel admin
Admin.syncData()                     // Sincroniza datos
Admin.checkOutGuest(guestId)         // Da de alta huésped
```

## 🐛 Debugging

### Console del Navegador
```javascript
// Ver todas las habitaciones
await DB.getRooms()

// Ver todos los huéspedes
await DB.getGuests()

// Exportar datos
await DB.exportAllData()

// Limpiar BD completamente
await DB.clearAll()
```

## 📱 Mobile Optimization

- ✅ Touch-friendly buttons e inputs
- ✅ Zoom prevención en inputs
- ✅ Tab-bar navegación inferior
- ✅ Teclado virtual optimizado
- ✅ Cámara para captura de fotos
- ✅ Font-size 16px en inputs (previene auto-zoom iOS)

## 🔐 Seguridad

⚠️ **Nota**: Esta aplicación usa localStorage/IndexedDB local. Para producción:
- Implementar autenticación
- Usar backend seguro (Node.js/Python)
- Cifrar datos sensibles
- Validar en servidor

## 🚀 Próximas Mejoras

- [ ] Integración real con Make.com (webhooks)
- [ ] Sincronización con Google Sheets/Excel
- [ ] Autenticación usuario (login/password)
- [ ] Chat de soporte en vivo
- [ ] Notificaciones push
- [ ] Dark mode
- [ ] Multi-idioma
- [ ] Historial de ocupación
- [ ] Generación de reportes PDF

## 📞 Soporte

Para preguntas o sugerencias sobre el sistema, contactar al administrador.

---

**Residencias Doña Mary** © 2025 - Diseñado y Desarrollado con ❤️
│       └── fonts           # Fuentes personalizadas
├── package.json            # Configuración de npm
└── README.md               # Documentación del proyecto
```

## Instalación

1. Clona el repositorio en tu máquina local.
2. Navega a la carpeta del proyecto.
3. Ejecuta `npm install` para instalar las dependencias necesarias.

## Uso

- Abre `src/index.html` en tu navegador para acceder a la aplicación.
- Utiliza las funcionalidades para gestionar habitaciones y huéspedes.

## Funcionalidades

- Registro y gestión de huéspedes.
- Administración de habitaciones.
- Interfaz responsiva y amigable para dispositivos móviles.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.
