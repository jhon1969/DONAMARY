/**
 * DB.js - Gestión de IndexedDB para Residencias Doña Mary
 * Almacena: habitaciones, huéspedes, documentos (fotos), reportes
 */

const DB = {
    dbName: 'ResidenciasDoñaMary',
    version: 1,
    db: null,

    /**
     * Inicializa la base de datos IndexedDB
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Object Store para habitaciones
                if (!db.objectStoreNames.contains('rooms')) {
                    const roomStore = db.createObjectStore('rooms', { keyPath: 'id' });
                    roomStore.createIndex('status', 'status', { unique: false });
                }

                // Object Store para huéspedes
                if (!db.objectStoreNames.contains('guests')) {
                    const guestStore = db.createObjectStore('guests', { keyPath: 'id' });
                    guestStore.createIndex('roomId', 'roomId', { unique: false });
                    guestStore.createIndex('email', 'email', { unique: true });
                }

                // Object Store para fotos de documentos
                if (!db.objectStoreNames.contains('documents')) {
                    const docStore = db.createObjectStore('documents', { keyPath: 'id' });
                    docStore.createIndex('guestId', 'guestId', { unique: false });
                }

                // Object Store para reportes
                if (!db.objectStoreNames.contains('reports')) {
                    const reportStore = db.createObjectStore('reports', { keyPath: 'id' });
                    reportStore.createIndex('roomId', 'roomId', { unique: false });
                    reportStore.createIndex('status', 'status', { unique: false });
                }
            };
        });
    },

    /**
     * Obtiene todas las habitaciones
     */
    async getRooms() {
        const tx = this.db.transaction('rooms', 'readonly');
        const store = tx.objectStore('rooms');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Obtiene una habitación por ID
     */
    async getRoom(id) {
        const tx = this.db.transaction('rooms', 'readonly');
        const store = tx.objectStore('rooms');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Guarda o actualiza una habitación
     */
    async saveRoom(room) {
        const tx = this.db.transaction('rooms', 'readwrite');
        const store = tx.objectStore('rooms');
        return new Promise((resolve, reject) => {
            const request = store.put(room);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Guarda múltiples habitaciones
     */
    async saveRooms(rooms) {
        const tx = this.db.transaction('rooms', 'readwrite');
        const store = tx.objectStore('rooms');
        rooms.forEach(room => store.put(room));
        return new Promise((resolve, reject) => {
            tx.onerror = () => reject(tx.error);
            tx.oncomplete = () => resolve();
        });
    },

    /**
     * Obtiene todos los huéspedes
     */
    async getGuests() {
        const tx = this.db.transaction('guests', 'readonly');
        const store = tx.objectStore('guests');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Obtiene un huésped por ID
     */
    async getGuest(id) {
        const tx = this.db.transaction('guests', 'readonly');
        const store = tx.objectStore('guests');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Obtiene huéspedes por habitación
     */
    async getGuestsByRoom(roomId) {
        const tx = this.db.transaction('guests', 'readonly');
        const store = tx.objectStore('guests');
        const index = store.index('roomId');
        return new Promise((resolve, reject) => {
            const request = index.getAll(roomId);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Guarda o actualiza un huésped
     */
    async saveGuest(guest) {
        guest.id = guest.id || 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const tx = this.db.transaction('guests', 'readwrite');
        const store = tx.objectStore('guests');
        return new Promise((resolve, reject) => {
            const request = store.put(guest);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Elimina un huésped
     */
    async deleteGuest(id) {
        const tx = this.db.transaction('guests', 'readwrite');
        const store = tx.objectStore('guests');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    },

    /**
     * Guarda documentos (fotos) de un huésped
     */
    async saveDocument(doc) {
        doc.id = doc.id || 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const tx = this.db.transaction('documents', 'readwrite');
        const store = tx.objectStore('documents');
        return new Promise((resolve, reject) => {
            const request = store.put(doc);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Obtiene documentos de un huésped
     */
    async getDocumentsByGuest(guestId) {
        const tx = this.db.transaction('documents', 'readonly');
        const store = tx.objectStore('documents');
        const index = store.index('guestId');
        return new Promise((resolve, reject) => {
            const request = index.getAll(guestId);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Guarda un reporte
     */
    async saveReport(report) {
        report.id = report.id || 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const tx = this.db.transaction('reports', 'readwrite');
        const store = tx.objectStore('reports');
        return new Promise((resolve, reject) => {
            const request = store.put(report);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Obtiene todos los reportes
     */
    async getReports() {
        const tx = this.db.transaction('reports', 'readonly');
        const store = tx.objectStore('reports');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Obtiene un reporte por ID
     */
    async getReport(id) {
        const tx = this.db.transaction('reports', 'readonly');
        const store = tx.objectStore('reports');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Obtiene reportes de una habitación
     */
    async getReportsByRoom(roomId) {
        const tx = this.db.transaction('reports', 'readonly');
        const store = tx.objectStore('reports');
        const index = store.index('roomId');
        return new Promise((resolve, reject) => {
            const request = index.getAll(roomId);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * Exporta todos los datos a JSON
     */
    async exportAllData() {
        const rooms = await this.getRooms();
        const guests = await this.getGuests();
        const reports = await this.getReports();
        
        return {
            exportDate: new Date().toISOString(),
            rooms,
            guests,
            reports
        };
    },

    /**
     * Importa datos desde JSON
     */
    async importData(data) {
        if (data.rooms) {
            await this.saveRooms(data.rooms);
        }
        if (data.guests) {
            for (const guest of data.guests) {
                await this.saveGuest(guest);
            }
        }
        if (data.reports) {
            for (const report of data.reports) {
                await this.saveReport(report);
            }
        }
    },

    /**
     * Limpia la base de datos completa
     */
    async clearAll() {
        const tx = this.db.transaction(['rooms', 'guests', 'documents', 'reports'], 'readwrite');
        tx.objectStore('rooms').clear();
        tx.objectStore('guests').clear();
        tx.objectStore('documents').clear();
        tx.objectStore('reports').clear();
        return new Promise((resolve, reject) => {
            tx.onerror = () => reject(tx.error);
            tx.oncomplete = () => resolve();
        });
    }
};