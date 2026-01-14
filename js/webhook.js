/**
 * Webhook.js - Integración con Make (antes Integromat)
 * Envía datos a Make para sincronización con Google Sheets
 */

const Webhook = {
    // Reemplazar con tu webhook URL de Make
    MAKE_WEBHOOK_URL: 'https://hook.us2.make.com/kpj8y9q5yssx923fmwimulo4ye2sbbvq',
    
    
    /**
     * Envía datos de un nuevo huésped a Make
     */
    async sendGuest(guestData) {
        try {
            const payload = {
                type: 'guest_registered',
                timestamp: new Date().toISOString(),
                data: {
                    id: guestData.id,
                    name: guestData.name,
                    email: guestData.email,
                    phone: guestData.phone,
                    dni: guestData.dni,
                    address: guestData.address,
                    roomId: guestData.roomId,
                    checkInDate: guestData.checkInDate,
                    checkOutDate: guestData.checkOutDate,
                    notes: guestData.notes,
                    evaluation: guestData.evaluation
                }
            };
            
            const response = await fetch(this.MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log('✓ Huésped sincronizado con Make');
                return true;
            } else {
                console.error('Error al sincronizar huésped:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error enviando huésped a Make:', error);
            return false;
        }
    },

    /**
     * Envía un reporte de daños a Make
     */
    async sendReport(reportData) {
        try {
            const payload = {
                type: 'report_created',
                timestamp: new Date().toISOString(),
                data: {
                    id: reportData.id,
                    type: reportData.type,
                    title: reportData.title,
                    description: reportData.description,
                    location: reportData.location,
                    priority: reportData.priority,
                    status: reportData.status,
                    createdDate: reportData.createdDate
                }
            };
            
            const response = await fetch(this.MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log('✓ Reporte sincronizado con Make');
                return true;
            } else {
                console.error('Error al sincronizar reporte:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error enviando reporte a Make:', error);
            return false;
        }
    },

    /**
     * Sincroniza todas las habitaciones
     */
    async syncAllRooms() {
        try {
            const rooms = await DB.getRooms();
            const payload = {
                type: 'rooms_sync',
                timestamp: new Date().toISOString(),
                data: rooms.map(room => ({
                    id: room.id,
                    number: String(room.number).padStart(2, '0'),
                    piso: room.piso,
                    type: room.type,
                    capacity: room.capacity,
                    price: room.price,
                    status: room.status
                }))
            };
            
            const response = await fetch(this.MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log('✓ Habitaciones sincronizadas con Make');
                return true;
            } else {
                console.error('Error al sincronizar habitaciones:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error sincronizando habitaciones:', error);
            return false;
        }
    },

    /**
     * Sincroniza todos los huéspedes
     */
    async syncAllGuests() {
        try {
            const guests = await DB.getGuests();
            const payload = {
                type: 'guests_sync',
                timestamp: new Date().toISOString(),
                data: guests.map(guest => ({
                    id: guest.id,
                    name: guest.name,
                    email: guest.email,
                    phone: guest.phone,
                    dni: guest.dni,
                    address: guest.address,
                    roomId: guest.roomId,
                    checkInDate: guest.checkInDate,
                    checkOutDate: guest.checkOutDate,
                    notes: guest.notes,
                    evaluation: guest.evaluation
                }))
            };
            
            const response = await fetch(this.MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log('✓ Huéspedes sincronizados con Make');
                return true;
            } else {
                console.error('Error al sincronizar huéspedes:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error sincronizando huéspedes:', error);
            return false;
        }
    },

    /**
     * Sincroniza todos los reportes
     */
    async syncAllReports() {
        try {
            const reports = await DB.getReports();
            const payload = {
                type: 'reports_sync',
                timestamp: new Date().toISOString(),
                data: reports.map(report => ({
                    id: report.id,
                    type: report.type,
                    title: report.title,
                    description: report.description,
                    location: report.location,
                    priority: report.priority,
                    status: report.status,
                    createdDate: report.createdDate
                }))
            };
            
            const response = await fetch(this.MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log('✓ Reportes sincronizados con Make');
                return true;
            } else {
                console.error('Error al sincronizar reportes:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error sincronizando reportes:', error);
            return false;
        }
    },

    /**
     * Sincroniza TODO (habitaciones, huéspedes, reportes)
     */
    async syncAll() {
        try {
            const results = await Promise.all([
                this.syncAllRooms(),
                this.syncAllGuests(),
                this.syncAllReports()
            ]);
            
            const allSuccess = results.every(r => r === true);
            return allSuccess;
        } catch (error) {
            console.error('Error en sincronización total:', error);
            return false;
        }
    }
};
