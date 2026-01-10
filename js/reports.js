/**
 * Reports.js - Gestión de reportes de daños y sugerencias
 */

const Reports = {
    /**
     * Renderiza el formulario de reportes
     */
    renderReportForm() {
        const content = document.getElementById('reportesContent');

        content.innerHTML = `
            <div class="card">
                <form id="reportForm">
                    <h3 class="section-subtitle">Reportar un Problema o Sugerencia</h3>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="reportType">Tipo de Reporte *</label>
                            <select id="reportType" required>
                                <option value="">Selecciona una opción</option>
                                <option value="daño">Daño en Habitación</option>
                                <option value="daño_comun">Daño en Área Común</option>
                                <option value="higiene">Problema de Higiene</option>
                                <option value="servicio">Problema de Servicio</option>
                                <option value="ruido">Ruido/Convivencia</option>
                                <option value="sugerencia">Sugerencia o Mejora</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="reportPriority">Prioridad *</label>
                            <select id="reportPriority" required>
                                <option value="">Selecciona una opción</option>
                                <option value="baja">Baja</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta (Urgente)</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="reportTitle">Título del Reporte *</label>
                        <input type="text" id="reportTitle" placeholder="Descripción breve" required>
                    </div>

                    <div class="form-group">
                        <label for="reportDescription">Descripción Detallada *</label>
                        <textarea id="reportDescription" placeholder="Proporciona todos los detalles posibles..." required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="reportLocation">Ubicación (Habitación/Área) *</label>
                        <input type="text" id="reportLocation" placeholder="Ej: Habitación 5, Cocina Común" required>
                    </div>

                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button type="button" class="btn btn-outline" onclick="App.showSection('disponibilidad')">Volver</button>
                        <button type="submit" class="btn btn-primary" style="flex: 1;">Enviar Reporte</button>
                    </div>
                </form>

                <hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--light-gray);">

                <h3 class="section-subtitle">Mis Reportes Recientes</h3>
                <div id="myReportsList" style="max-height: 40vh; overflow-y: auto;"></div>
            </div>
        `;

        // Event listener para formulario
        document.getElementById('reportForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReport();
        });

        // Cargar reportes del usuario actual
        this.loadMyReports();
    },

    /**
     * Envía un nuevo reporte
     */
    async submitReport() {
        const type = document.getElementById('reportType').value;
        const priority = document.getElementById('reportPriority').value;
        const title = document.getElementById('reportTitle').value.trim();
        const description = document.getElementById('reportDescription').value.trim();
        const location = document.getElementById('reportLocation').value.trim();

        if (!type || !priority || !title || !description || !location) {
            App.showToast('Por favor completa todos los campos', 'warning');
            return;
        }

        const report = {
            id: 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: type,
            priority: priority,
            title: title,
            description: description,
            location: location,
            status: 'abierto',
            createdAt: new Date().toISOString(),
            createdBy: App.state.currentUser?.name || 'Anónimo'
        };

        try {
            await DB.saveReport(report);
            
            // Sincronizar con Make (en tiempo real)
            await Webhook.sendReport(report);
            
            App.showToast('✓ Reporte enviado correctamente', 'success');

            // Limpiar formulario
            document.getElementById('reportForm').reset();

            // Recargar reportes
            this.loadMyReports();
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            App.showToast('Error al enviar el reporte', 'error');
        }
    },

    /**
     * Carga los reportes del usuario
     */
    async loadMyReports() {
        try {
            const reports = await DB.getReports();
            const container = document.getElementById('myReportsList');

            if (!reports || reports.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--medium-gray);">No has hecho ningún reporte aún</p>';
                return;
            }

            container.innerHTML = reports.map(report => `
                <div style="background-color: var(--light-gray); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid ${this.getPriorityColor(report.priority)};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <strong>${report.title}</strong>
                        <span class="card-badge" style="background: ${report.status === 'resuelto' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(243, 156, 18, 0.1)'}; color: ${report.status === 'resuelto' ? '#27AE60' : '#F39C12'};">
                            ${report.status.toUpperCase()}
                        </span>
                    </div>
                    <p style="margin: 0.5rem 0; font-size: 0.9rem; color: var(--medium-gray);">${report.description}</p>
                    <div style="font-size: 0.85rem; color: var(--dark-gray);">
                        <strong>Ubicación:</strong> ${report.location} | 
                        <strong>Prioridad:</strong> ${report.priority.toUpperCase()} | 
                        <strong>Fecha:</strong> ${new Date(report.createdAt).toLocaleDateString('es-CO')}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error al cargar reportes:', error);
        }
    },

    /**
     * Obtiene color según prioridad
     */
    getPriorityColor(priority) {
        const colors = {
            'baja': '#95A5A6',
            'media': '#F39C12',
            'alta': '#E74C3C'
        };
        return colors[priority] || '#95A5A6';
    }
};