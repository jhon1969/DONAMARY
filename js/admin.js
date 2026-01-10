/**
 * Admin.js - Panel administrativo
 */

const Admin = {
    /**
     * Renderiza el dashboard administrativo
     */
    async renderDashboard() {
        const content = document.getElementById('adminContent');
        const rooms = await DB.getRooms();
        const guests = await DB.getGuests();
        const reports = await DB.getReports();

        let ocupadas = rooms.filter(r => r.status === 'ocupada').length;
        let disponibles = rooms.filter(r => r.status === 'disponible').length;
        let mantenimiento = rooms.filter(r => r.status === 'mantenimiento').length;

        content.innerHTML = `
            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 2rem;">
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #1ABC9C, #16A085); color: white;">
                    <h3 style="font-size: 2.5rem; margin: 0;">21</h3>
                    <p style="margin: 0;">Total Habitaciones</p>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #E74C3C, #C0392B); color: white;">
                    <h3 style="font-size: 2.5rem; margin: 0;">${ocupadas}</h3>
                    <p style="margin: 0;">Ocupadas</p>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #27AE60, #229954); color: white;">
                    <h3 style="font-size: 2.5rem; margin: 0;">${disponibles}</h3>
                    <p style="margin: 0;">Disponibles</p>
                </div>
                <div class="card" style="text-align: center; background: linear-gradient(135deg, #F39C12, #D68910); color: white;">
                    <h3 style="font-size: 2.5rem; margin: 0;">${guests.length}</h3>
                    <p style="margin: 0;">Huéspedes Registrados</p>
                </div>
            </div>

            <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="Admin.syncData()">📤 Sincronizar con Make</button>
                <button class="btn btn-secondary" onclick="Admin.exportData()">📥 Descargar Datos</button>
                <button class="btn btn-outline" onclick="Admin.importDataPrompt()">📦 Importar Datos</button>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3 class="section-subtitle">Huéspedes Activos</h3>
                <div class="card" style="max-height: 50vh; overflow-y: auto;">
                    ${guests.length === 0 ? '<p style="text-align: center; color: var(--medium-gray);">No hay huéspedes registrados</p>' : `
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                            <thead>
                                <tr style="background-color: var(--light-gray); border-bottom: 2px solid var(--primary);">
                                    <th style="padding: 1rem; text-align: left; font-weight: bold;">Nombre</th>
                                    <th style="padding: 1rem; text-align: left; font-weight: bold;">Hab/Piso</th>
                                    <th style="padding: 1rem; text-align: left; font-weight: bold;">📅 Fecha Ingreso</th>
                                    <th style="padding: 1rem; text-align: left; font-weight: bold;">Teléfono</th>
                                    <th style="padding: 1rem; text-align: center; font-weight: bold;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${guests.map(guest => {
                                    const checkInDate = new Date(guest.checkInDate);
                                    const fecha = checkInDate.toLocaleDateString('es-CO');
                                    const roomNum = guest.roomId.replace('room_', '');
                                    const piso = roomNum <= 7 ? '1' : roomNum <= 14 ? '2' : '3';
                                    
                                    return `
                                        <tr style="border-bottom: 1px solid var(--light-gray); hover: background-color: var(--light-gray);">
                                            <td style="padding: 1rem;"><strong style="color: var(--primary);">${guest.name}</strong></td>
                                            <td style="padding: 1rem;"><span style="background: var(--primary); color: white; padding: 0.3rem 0.8rem; border-radius: 4px; font-weight: bold;">Hab #${roomNum}</span><br><span style="color: var(--medium-gray); font-size: 0.85rem;">Piso ${piso}</span></td>
                                            <td style="padding: 1rem; color: #27AE60; font-weight: bold;">${fecha}</td>
                                            <td style="padding: 1rem;">${guest.phone}</td>
                                            <td style="padding: 1rem; text-align: center;">
                                                <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; margin-right: 0.3rem;" onclick="Admin.viewGuestDetails('${guest.id}')">Ver</button>
                                                <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Admin.checkOutGuest('${guest.id}')">Alta</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
            </div>

            <div>
                <h3 class="section-subtitle">Reportes de Daños (${reports.filter(r => r.status !== 'resuelto').length})</h3>
                <div class="card" style="max-height: 30vh; overflow-y: auto;">
                    ${reports.length === 0 ? '<p style="text-align: center; color: var(--medium-gray);">No hay reportes</p>' : `
                        ${reports.filter(r => r.status !== 'resuelto').map(report => `
                            <div style="padding: 1rem; border-bottom: 1px solid var(--light-gray);">
                                <div style="display: flex; justify-content: space-between;">
                                    <strong>${report.title}</strong>
                                    <span class="card-badge" style="background: ${report.priority === 'alta' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(243, 156, 18, 0.1)'}; color: ${report.priority === 'alta' ? '#E74C3C' : '#F39C12'};">${report.priority}</span>
                                </div>
                                <p style="margin: 0.5rem 0; color: var(--medium-gray);">${report.description}</p>
                                <button class="btn btn-success" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Admin.resolveReport('${report.id}')">Resolver</button>
                            </div>
                        `).join('')}
                    `}
                </div>
            </div>

            <input type="file" id="importFileInput" accept=".json" style="display: none;" onchange="Admin.handleImport(event)">
        `;
    },

    /**
     * Sincroniza datos con Make
     */
    async syncData() {
        App.showToast('📤 Sincronizando con Make...', 'info');
        const success = await Webhook.syncAll();
        
        if (success) {
            App.showToast('✓ Sincronización completada exitosamente', 'success');
        } else {
            App.showToast('⚠️ Hubo problemas en la sincronización', 'warning');
        }
    },

    /**
     * Exporta datos
     */
    async exportData() {
        await App.exportData();
    },

    /**
     * Abre diálogo de importar
     */
    importDataPrompt() {
        document.getElementById('importFileInput').click();
    },

    /**
     * Maneja la importación de datos
     */
    async handleImport(event) {
        const file = event.target.files[0];
        await App.importData(file);
        this.renderDashboard();
    },

    /**
     * Ve detalles de un huésped
     */
    async viewGuestDetails(guestId) {
        const guest = await DB.getGuest(guestId);
        if (!guest) return;

        const evaluation = guest.evaluation || {};
        const docs = await DB.getDocumentsByGuest(guestId);

        alert(`
INFORMACIÓN DEL HUÉSPED
━━━━━━━━━━━━━━━━━━━━━
Nombre: ${guest.name}
Email: ${guest.email}
Teléfono: ${guest.phone}
DNI: ${guest.dni}
Dirección: ${guest.address}

EVALUACIÓN EMOCIONAL
━━━━━━━━━━━━━━━━━━━━━
Actitud Convivencia: ${evaluation.coexistenceProfile?.level || 'N/A'}
Estado Emocional: ${evaluation.emotionalProfile?.level || 'N/A'}
Resumen: ${evaluation.summary || 'N/A'}

DOCUMENTOS: ${docs.length} archivos cargados
        `);
    },

    /**
     * Da de alta a un huésped
     */
    async checkOutGuest(guestId) {
        if (confirm('¿Deseas dar de alta a este huésped?')) {
            const guest = await DB.getGuest(guestId);
            if (guest && guest.roomId) {
                // Liberar habitación
                await Rooms.releaseRoom(guest.roomId);
                // Eliminar huésped
                await DB.deleteGuest(guestId);
                App.showToast('✓ Huésped dado de alta', 'success');
                Admin.renderDashboard();
            }
        }
    },

    /**
     * Resuelve un reporte
     */
    async resolveReport(reportId) {
        try {
            // Obtener el reporte de la base de datos
            const report = await DB.getReport(reportId);
            
            if (report) {
                // Cambiar estado a resuelto
                report.status = 'resuelto';
                report.resolvedDate = new Date().toISOString();
                
                // Guardar en la base de datos
                await DB.saveReport(report);
                
                App.showToast('✓ Reporte marcado como resuelto', 'success');
                
                // Refrescar el dashboard
                Admin.renderDashboard();
            }
        } catch (error) {
            console.error('Error al resolver reporte:', error);
            App.showToast('Error al resolver el reporte', 'error');
        }
    }
};