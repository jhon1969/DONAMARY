/**
 * App.js - Aplicación principal de Residencias Doña Mary
 * Gestiona router, estado global, y funciones compartidas
 */

const App = {
    state: {
        currentSection: 'disponibilidad',
        currentUser: null,
        selectedRoom: null,
        filterDates: {
            checkIn: null,
            checkOut: null
        }
    },

    /**
     * Inicializa la aplicación
     */
    async init() {
        try {
            // Inicializar IndexedDB
            await DB.init();
            console.log('✓ IndexedDB inicializado');

            // Cargar datos iniciales (habitaciones)
            await this.initializeRooms();
            console.log('✓ Habitaciones inicializadas');

            // Renderizar interfaz
            this.setupEventListeners();
            this.renderAvailability();
            this.startClock();

            console.log('✓ Aplicación iniciada correctamente');
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
            this.showToast('Error al inicializar la aplicación', 'error');
        }
    },

    /**
     * Inicia el reloj con hora y fecha en tiempo real
     */
    startClock() {
        const updateClock = () => {
            const now = new Date();
            
            // Hora (HH:MM:SS)
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const timeString = `${hours}:${minutes}:${seconds}`;
            
            // Fecha (DD/MM/YYYY)
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const dateString = `${day}/${month}/${year}`;
            
            // Actualizar elementos en el DOM
            const clockEl = document.getElementById('clock');
            const dateEl = document.getElementById('date');
            
            if (clockEl) clockEl.textContent = timeString;
            if (dateEl) dateEl.textContent = dateString;
        };
        
        // Actualizar inmediatamente
        updateClock();
        
        // Actualizar cada segundo
        setInterval(updateClock, 1000);
    },

    /**
     * Inicializa 21 habitaciones en la base de datos
     */
    async initializeRooms() {
        const existingRooms = await DB.getRooms();
        
        // Si ya existen habitaciones, no reinicializar
        if (existingRooms && existingRooms.length > 0) {
            return;
        }

        // Configuración real de las 21 habitaciones por piso
        const roomsConfig = [
            // PRIMER PISO (1-7)
            { number: 1, piso: 1, type: 'doble', capacity: 2, price: 700000 },
            { number: 2, piso: 1, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 3, piso: 1, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 4, piso: 1, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 5, piso: 1, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 6, piso: 1, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 7, piso: 1, type: 'sencilla', capacity: 1, price: 500000 },
            
            // SEGUNDO PISO (8-14)
            { number: 8, piso: 2, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 9, piso: 2, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 10, piso: 2, type: 'doble', capacity: 2, price: 700000 },
            { number: 11, piso: 2, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 12, piso: 2, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 13, piso: 2, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 14, piso: 2, type: 'sencilla', capacity: 1, price: 500000 },
            
            // TERCER PISO (15-21)
            { number: 15, piso: 3, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 16, piso: 3, type: 'doble', capacity: 2, price: 700000 },
            { number: 17, piso: 3, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 18, piso: 3, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 19, piso: 3, type: 'doble', capacity: 2, price: 700000 },
            { number: 20, piso: 3, type: 'sencilla', capacity: 1, price: 500000 },
            { number: 21, piso: 3, type: 'sencilla', capacity: 1, price: 500000 }
        ];

        // Crear objetos de habitaciones
        const rooms = roomsConfig.map(config => ({
            id: `room_${config.number}`,
            number: config.number,
            piso: config.piso,
            type: config.type,
            status: 'disponible',
            capacity: config.capacity,
            features: ['WiFi', 'Baño', 'AC'],
            currentGuest: null,
            checkOutDate: null,
            pricePerNight: config.price
        }));

        await DB.saveRooms(rooms);
    },

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Filtrar por fecha
        const checkInInput = document.getElementById('checkInDate');
        const checkOutInput = document.getElementById('checkOutDate');

        if (checkInInput) {
            checkInInput.addEventListener('change', () => {
                this.state.filterDates.checkIn = checkInInput.value;
            });
        }

        if (checkOutInput) {
            checkOutInput.addEventListener('change', () => {
                this.state.filterDates.checkOut = checkOutInput.value;
            });
        }
    },

    /**
     * Filtra habitaciones por fecha
     */
    async filterRoomsByDate() {
        const { checkIn, checkOut } = this.state.filterDates;

        if (!checkIn || !checkOut) {
            this.showToast('Por favor selecciona fecha de entrada y salida', 'warning');
            return;
        }

        if (new Date(checkIn) >= new Date(checkOut)) {
            this.showToast('La fecha de salida debe ser posterior a la de entrada', 'warning');
            return;
        }

        this.renderAvailability();
    },

    /**
     * Renderiza la disponibilidad de habitaciones
     */
    async renderAvailability() {
        const container = document.getElementById('roomsContainer');
        let rooms = await DB.getRooms();

        if (!rooms || rooms.length === 0) {
            container.innerHTML = '<p>No hay habitaciones registradas</p>';
            return;
        }

        // Ordenar habitaciones por número
        rooms = rooms.sort((a, b) => a.number - b.number);

        container.innerHTML = rooms.map(room => `
            <div class="card room-card">
                <div class="card-header">
                    <div class="card-title">Habitación ${String(room.number).padStart(2, '0')}</div>
                    <span class="card-badge badge-${room.status}">${room.status.toUpperCase()}</span>
                </div>
                <div class="room-info">
                    <div class="room-info-item">
                        <span>Tipo:</span>
                        <strong>${this.capitalize(room.type)}</strong>
                    </div>
                    <div class="room-info-item">
                        <span>Capacidad:</span>
                        <strong>${room.capacity} ${room.capacity === 1 ? 'persona' : 'personas'}</strong>
                    </div>
                    <div class="room-info-item">
                        <span>Precio/Noche:</span>
                        <strong>$${room.pricePerNight.toLocaleString()}</strong>
                    </div>
                    <div class="room-info-item">
                        <span>Características:</span>
                        <strong>${room.features.join(', ')}</strong>
                    </div>
                </div>
                <div class="room-actions">
                    ${room.status === 'disponible' ? 
                        `<button class="btn btn-primary" onclick="App.selectRoom('${room.id}')">Seleccionar</button>` :
                        `<button class="btn" style="background-color: #BDC3C7; cursor: not-allowed;" disabled>No Disponible</button>`
                    }
                </div>
            </div>
        `).join('');
    },

    /**
     * Selecciona una habitación e inicia registro
     */
    selectRoom(roomId) {
        this.state.selectedRoom = roomId;
        this.showSection('registro');
        Guests.renderRegistrationForm();
    },

    /**
     * Cambia la sección visible
     */
    showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('section.section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Mostrar sección seleccionada
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            section.style.display = 'block';
        }

        // Actualizar tab-bar si existe
        document.querySelectorAll('nav.tab-bar a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`nav.tab-bar a[onclick*="'${sectionId}'"]`)?.classList.add('active');

        this.state.currentSection = sectionId;

        // Ejecutar inicializadores de sección si es necesario
        if (sectionId === 'admin') {
            Admin.renderDashboard();
        } else if (sectionId === 'reportes') {
            Reports.renderReportForm();
        }
    },

    /**
     * Muestra notificación toast
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    /**
     * Capitaliza una cadena
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Exporta datos para sincronización con Make
     */
    async exportData() {
        try {
            const data = await DB.exportAllData();
            const json = JSON.stringify(data, null, 2);
            
            // Crear descarga
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `residencias-datos-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);

            this.showToast('✓ Datos exportados correctamente', 'success');
            return data;
        } catch (error) {
            console.error('Error al exportar datos:', error);
            this.showToast('Error al exportar datos', 'error');
        }
    },

    /**
     * Importa datos desde JSON
     */
    async importData(jsonFile) {
        try {
            if (!(jsonFile instanceof File)) {
                this.showToast('Por favor selecciona un archivo JSON válido', 'warning');
                return;
            }

            const text = await jsonFile.text();
            const data = JSON.parse(text);

            await DB.importData(data);
            this.showToast('✓ Datos importados correctamente', 'success');
            
            // Recargar interfaz
            this.renderAvailability();
        } catch (error) {
            console.error('Error al importar datos:', error);
            this.showToast('Error al importar datos', 'error');
        }
    },

    /**
     * Sincroniza datos automáticamente (preparado para Make)
     */
    async syncWithMake() {
        try {
            this.showToast('Sincronizando con Make...', 'info');
            
            const data = await DB.exportAllData();
            
            // Aquí irá la integración real con Make
            // Por ahora solo exportamos y guardamos en localStorage
            localStorage.setItem('lastSync', new Date().toISOString());
            localStorage.setItem('syncData', JSON.stringify(data));

            this.showToast(`✓ Sincronización completa - ${data.rooms?.length || 0} habitaciones, ${data.guests?.length || 0} huéspedes, ${data.reports?.length || 0} reportes`, 'success');
        } catch (error) {
            console.error('Error al sincronizar:', error);
            this.showToast('Error en la sincronización', 'error');
        }
    },

    /**
     * Muestra modal de contraseña para acceder al admin
     */
    showAdminPassword() {
        const password = prompt('🔐 Contraseña Admin (4 dígitos):', '');
        
        if (password === null) {
            return; // Usuario canceló
        }
        
        if (password === '1234') {
            this.showSection('admin');
        } else {
            this.showToast('❌ Contraseña incorrecta', 'error');
        }
    }
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});