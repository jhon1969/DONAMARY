/**
 * Guests.js - Gestión de registro de huéspedes y captura de documentos
 */

const Guests = {
    formData: {
        name: '',
        email: '',
        phone: '',
        dni: '',
        address: '',
        notes: '',
        checkInDate: '',
        checkOutDate: '',
        documentPhotos: {
            dnifront: null,
            dniback: null,
            studentcard: null
        },
        questionnaire: {
            coexistence: null,
            emotionalState: null
        }
    },

    /**
     * Renderiza el formulario de registro
     */
    renderRegistrationForm() {
        const content = document.getElementById('registroContent');
        const room = App.state.selectedRoom;

        content.innerHTML = `
            <div class="card">
                <form id="guestForm">
                    <h3 class="section-subtitle">Información Personal</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="guestName">Nombre Completo *</label>
                            <input type="text" id="guestName" required>
                        </div>
                        <div class="form-group">
                            <label for="guestEmail">Correo Electrónico *</label>
                            <input type="email" id="guestEmail" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="guestPhone">Teléfono *</label>
                            <input type="tel" id="guestPhone" required>
                        </div>
                        <div class="form-group">
                            <label for="guestDNI">Cédula de Ciudadanía *</label>
                            <input type="text" id="guestDNI" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="guestAddress">Dirección</label>
                        <input type="text" id="guestAddress">
                    </div>

                    <div class="form-group">
                        <label for="guestNotes">Notas Adicionales</label>
                        <textarea id="guestNotes" placeholder="Información adicional..."></textarea>
                    </div>

                    <hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--light-gray);">

                    <h3 class="section-subtitle">Documentos de Identificación</h3>
                    <p style="color: var(--medium-gray); margin-bottom: 1rem;">Por favor carga las fotos de tus documentos</p>

                    <div class="form-group">
                        <label>Cédula de Ciudadanía - Frente *</label>
                        <div class="photo-upload" onclick="Guests.triggerPhotoUpload('dnifront')">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
                            <div>Toca para capturar o seleccionar foto</div>
                            <img id="preview_dnifront" class="photo-preview" style="display: none;">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Cédula de Ciudadanía - Reverso *</label>
                        <div class="photo-upload" onclick="Guests.triggerPhotoUpload('dniback')">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
                            <div>Toca para capturar o seleccionar foto</div>
                            <img id="preview_dniback" class="photo-preview" style="display: none;">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Carné de Estudiante *</label>
                        <div class="photo-upload" onclick="Guests.triggerPhotoUpload('studentcard')">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
                            <div>Toca para capturar o seleccionar foto</div>
                            <img id="preview_studentcard" class="photo-preview" style="display: none;">
                        </div>
                    </div>

                    <input type="file" id="photoInput" accept="image/*" style="display: none;" onchange="Guests.handlePhotoUpload(event)">

                    <hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--light-gray);">

                    <h3 class="section-subtitle">Cuestionario de Evaluación</h3>
                    <p style="color: var(--medium-gray); margin-bottom: 1rem;">Tus respuestas nos ayudan a mejorar tu experiencia</p>

                    <div class="question-container">
                        <div class="question-title">1. ¿Cuál es tu actitud hacia la convivencia comunitaria? *</div>
                        <div class="scale-options" id="coexistenceScale">
                            <label style="flex: 1;">
                                <input type="radio" name="coexistence" value="1"> 
                                <span class="scale-option" onclick="Guests.selectScale('coexistence', 1)">Prefiero privacidad</span>
                            </label>
                            <label style="flex: 1;">
                                <input type="radio" name="coexistence" value="2"> 
                                <span class="scale-option" onclick="Guests.selectScale('coexistence', 2)">Algo reservado</span>
                            </label>
                            <label style="flex: 1;">
                                <input type="radio" name="coexistence" value="3"> 
                                <span class="scale-option" onclick="Guests.selectScale('coexistence', 3)">Neutral</span>
                            </label>
                            <label style="flex: 1;">
                                <input type="radio" name="coexistence" value="4"> 
                                <span class="scale-option" onclick="Guests.selectScale('coexistence', 4)">Sociable</span>
                            </label>
                            <label style="flex: 1;">
                                <input type="radio" name="coexistence" value="5"> 
                                <span class="scale-option" onclick="Guests.selectScale('coexistence', 5)">Muy sociable</span>
                            </label>
                        </div>
                    </div>

                    <div class="question-container">
                        <div class="question-title">2. ¿Cuál es tu estado emocional actual? *</div>
                        <div class="scale-options" id="emotionalScale">
                            <label style="flex: 1;">
                                <input type="radio" name="emotionalState" value="1"> 
                                <span class="scale-option" onclick="Guests.selectScale('emotionalState', 1)">😔 Muy bajo</span>
                            </label>
                            <label style="flex: 1;">
                                <input type="radio" name="emotionalState" value="2"> 
                                <span class="scale-option" onclick="Guests.selectScale('emotionalState', 2)">😕 Bajo</span>
                            </label>
                            <label style="flex: 1;">
                                <input type="radio" name="emotionalState" value="3"> 
                                <span class="scale-option" onclick="Guests.selectScale('emotionalState', 3)">😐 Neutral</span>
                            </label>
                            <label style="flex: 1;">
                                <input type="radio" name="emotionalState" value="4"> 
                                <span class="scale-option" onclick="Guests.selectScale('emotionalState', 4)">🙂 Alto</span>
                            </label>
                            <label style="flex: 1;">
                                <input type="radio" name="emotionalState" value="5"> 
                                <span class="scale-option" onclick="Guests.selectScale('emotionalState', 5)">😊 Muy alto</span>
                            </label>
                        </div>
                    </div>

                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button type="button" class="btn btn-outline" onclick="App.showSection('disponibilidad')">Volver</button>
                        <button type="submit" class="btn btn-primary" style="flex: 1;">Continuar al Manual</button>
                    </div>
                </form>
            </div>
        `;

        // Event listener para envío del formulario
        document.getElementById('guestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateAndSubmitForm();
        });
    },

    /**
     * Maneja la captura de fotos
     */
    triggerPhotoUpload(type) {
        window.currentPhotoType = type;
        document.getElementById('photoInput').click();
    },

    /**
     * Procesa la foto seleccionada/capturada
     */
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const type = window.currentPhotoType;
            const base64 = e.target.result;
            
            this.formData.documentPhotos[type] = base64;
            
            // Mostrar preview
            const preview = document.getElementById(`preview_${type}`);
            if (preview) {
                preview.src = base64;
                preview.style.display = 'block';
            }

            App.showToast('✓ Foto capturada correctamente', 'success');
        };
        reader.readAsDataURL(file);
    },

    /**
     * Selecciona opción en escala
     */
    selectScale(question, value) {
        const container = question === 'coexistence' ? 
            document.getElementById('coexistenceScale') : 
            document.getElementById('emotionalScale');

        // Remover selección anterior
        container.querySelectorAll('.scale-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Marcar nueva selección
        event.target.classList.add('selected');
        
        this.formData.questionnaire[question] = parseInt(value);
        document.querySelector(`input[name="${question}"][value="${value}"]`).checked = true;
    },

    /**
     * Valida y envía el formulario
     */
    async validateAndSubmitForm() {
        // Validar campos obligatorios
        const name = document.getElementById('guestName').value.trim();
        const email = document.getElementById('guestEmail').value.trim();
        const phone = document.getElementById('guestPhone').value.trim();
        const dni = document.getElementById('guestDNI').value.trim();

        if (!name || !email || !phone || !dni) {
            App.showToast('Por favor completa todos los campos obligatorios', 'warning');
            return;
        }

        // Validar documentos
        if (!this.formData.documentPhotos.dnifront || 
            !this.formData.documentPhotos.dniback || 
            !this.formData.documentPhotos.studentcard) {
            App.showToast('Por favor carga todos los documentos requeridos', 'warning');
            return;
        }

        // Validar cuestionario
        if (!this.formData.questionnaire.coexistence || !this.formData.questionnaire.emotionalState) {
            App.showToast('Por favor responde todas las preguntas del cuestionario', 'warning');
            return;
        }

        // Guardar datos en formData
        this.formData.name = name;
        this.formData.email = email;
        this.formData.phone = phone;
        this.formData.dni = dni;
        this.formData.address = document.getElementById('guestAddress').value.trim();
        this.formData.notes = document.getElementById('guestNotes').value.trim();

        // Evaluar perfil emocional
        const evaluation = IAEvaluator.evaluateEmotionalProfile(this.formData.questionnaire);
        this.formData.evaluation = evaluation;

        // Mostrar manual
        this.renderManualPage();
        App.showSection('manual');
    },

    /**
     * Renderiza la página del manual de convivencia
     */
    renderManualPage() {
        const content = document.getElementById('manualContent');

        const manualContent = `
            <div class="card">
                <div style="max-height: 60vh; overflow-y: auto; margin-bottom: 2rem;">
                    <h3 class="section-subtitle">MANUAL DE VIDA EN COMUNIDAD</h3>
                    <h4 style="color: var(--primary); text-align: center; margin-bottom: 1.5rem;">VIVIENDA UNIVERSITARIA - DOÑA MARY</h4>
                    
                    <div style="line-height: 1.8; color: var(--secondary); font-size: 0.95rem;">
                        <p style="font-weight: bold; margin-bottom: 1rem;">
                            El presente manual rige a los residentes en la vivienda Universitaria - Doña Mary, ubicada en la Carrera 26 A No. 11 – 59, barrio Universidad de Bucaramanga. Su conocimiento y cumplimiento son <strong>obligatorios para todos los residentes</strong>.
                        </p>

                        <p style="color: var(--medium-gray); margin-bottom: 1.5rem;">
                            <strong>Nota:</strong> Los residentes exclusivamente tienen que ser estudiantes universitarios UIS certificados. Este manual forma parte integral del contrato de arrendamiento.
                        </p>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">CONDUCTA DE LOS RESIDENTES</h4>
                        <p>Se espera de los residentes un comportamiento acorde a los más altos estándares éticos de honestidad, respeto hacia los demás, responsabilidad, colaboración, solidaridad, cuidado y valores humanos que deben regir la vida en comunidad.</p>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">PROHIBICIONES</h4>
                        <ul style="margin-left: 1.5rem;">
                            <li>Incurrir en cualquier conducta que atente a los derechos de los demás residentes</li>
                            <li>Manifestarse en forma irrespetuosa o agresiva</li>
                            <li>Permitir personas no autorizadas en habitaciones o zonas comunes</li>
                            <li>Realizar actividades ilegales</li>
                            <li>Ingresar materiales peligrosos, armas, sustancias psicoactivas o tóxicos</li>
                            <li>Producir, consumir o distribuir tabaco, alcohol o sustancias psicoactivas</li>
                            <li>Hacer fiestas o producir ruido (música, voces) que perturbe la tranquilidad</li>
                            <li>Realizar acciones de acoso y/o abuso sexual</li>
                            <li>Salir de la habitación en ropa interior o semidesnudo</li>
                            <li>Discriminar a otros residentes por raza, sexo, orientación sexual, ideas políticas o religiosas</li>
                            <li>Tener mascotas de forma permanente o temporal</li>
                        </ul>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">SANCIONES</h4>
                        <ul style="margin-left: 1.5rem;">
                            <li>Amonestaciones verbales o escritas (correo electrónico)</li>
                            <li>Pago por daños a infraestructura, mobiliario y limpieza</li>
                            <li>Terminación del contrato y salida por faltas recurrentes o graves</li>
                        </ul>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">HORARIOS DE INGRESO Y SALIDA</h4>
                        <p>No existe límite de horario para ingreso o salida. Sin embargo, <strong>silencio desde las 21:00 horas</strong> tanto en interior como en el recinto exterior. Se recomienda mantener celulares en modo silencio.</p>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">PAGO DE ARRENDAMIENTO</h4>
                        <p>El pago se debe realizar en los <strong>primeros cinco días de cada mes</strong> en:<br>
                        <strong>Bancolombia - Cuenta: 3156915030 - A nombre de: María del Socorro Adarme</strong></p>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">HABITACIONES Y ENSERES</h4>
                        <p>Los residentes reciben la habitación, muebles y enseres con inventario y deben devolverlos en condiciones iniciales. Los daños intencionales serán cobrados según costo de reparación o reposición. La administración autoriza sistemas de vigilancia en zonas comunes.</p>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">SEGURIDAD</h4>
                        <ul style="margin-left: 1.5rem;">
                            <li>El residente es responsable de sus objetos personales</li>
                            <li>Objetos de valor deben mantenerse bajo llave</li>
                            <li>Hacer doble seguro en la puerta al ingresar/salir</li>
                            <li>En caso de sospecha de inseguridad: POLICÍA DEL CUADRANTE 3013460623</li>
                            <li>Las llaves son personales e intransferibles</li>
                            <li>Pérdida de llave: costo por cuenta del residente</li>
                        </ul>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">RECICLAJE Y MANEJO DE RESIDUOS</h4>
                        <ul style="margin-left: 1.5rem;">
                            <li>Usar correctamente los contenedores para reciclaje</li>
                            <li>Sacar residuos previo a días de recolección (Martes, Jueves, Sábado antes de 07:00)</li>
                            <li>No dejar envases en la zona húmeda (patio)</li>
                        </ul>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">USO DE COCINA</h4>
                        <ul style="margin-left: 1.5rem;">
                            <li>Uso por orden de llegada</li>
                            <li>Cada residente trae sus propios vasos, cubiertos, platos y ollas</li>
                            <li>Mantener identificados los objetos personales</li>
                        </ul>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">INGRESO DE VISITANTES</h4>
                        <ul style="margin-left: 1.5rem;">
                            <li><strong>Grupos de Estudio:</strong> 08:00-18:00, máximo 4 personas, 3 horas. NO en habitaciones</li>
                            <li><strong>Familiares por Enfermedad:</strong> Máximo 3 noches gratis. Adicional: $50.000 pesos</li>
                            <li><strong>Pareja:</strong> Sábado 14:00 a Domingo 18:00. Adicional: $40.000 por día extra</li>
                        </ul>

                        <h4 style="color: var(--primary); margin-top: 1.5rem;">LAVADO DE ROPA</h4>
                        <ul style="margin-left: 1.5rem;">
                            <li>Costo: $10.000 COP (monedas de $1.000)</li>
                            <li><strong>Martes:</strong> Piso 1 | <strong>Jueves:</strong> Piso 2 | <strong>Sábado:</strong> Piso 3</li>
                            <li>Horario: 08:00 - 18:00 horas</li>
                            <li>Prohibido lavar zapatos en lavadora</li>
                            <li>Dejar lavadora con tapa levantada después de usar</li>
                        </ul>

                        <p style="margin-top: 2rem; padding: 1rem; background-color: var(--light-gray); border-left: 4px solid var(--primary);">
                            <strong>✓ Al aceptar este manual, confirmas que has leído, entendido y aceptas todas las normas de vida en comunidad de la Vivienda Universitaria Doña Mary.</strong>
                        </p>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem;">
                    <button type="button" class="btn btn-outline" onclick="App.showSection('registro')">Volver</button>
                    <button type="button" class="btn btn-primary" style="flex: 1;" onclick="Guests.acceptManualAndComplete()">
                        ✓ Acepto el Manual
                    </button>
                </div>
            </div>
        `;

        content.innerHTML = manualContent;
    },

    /**
     * Acepta el manual y completa el registro
     */
    async acceptManualAndComplete() {
        try {
            // Crear objeto de huésped
            const guest = {
                id: 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: this.formData.name,
                email: this.formData.email,
                phone: this.formData.phone,
                dni: this.formData.dni,
                address: this.formData.address,
                notes: this.formData.notes,
                roomId: App.state.selectedRoom,
                checkInDate: new Date().toISOString(),
                manualAccepted: true,
                manualAcceptedDate: new Date().toISOString(),
                evaluation: this.formData.evaluation,
                createdAt: new Date().toISOString()
            };

            // Guardar huésped
            await DB.saveGuest(guest);

            // Sincronizar con Make (en tiempo real)
            await Webhook.sendGuest(guest);

            // Guardar documentos
            for (const [type, photo] of Object.entries(this.formData.documentPhotos)) {
                if (photo) {
                    const doc = {
                        id: 'doc_' + Date.now() + '_' + type,
                        guestId: guest.id,
                        type: type,
                        photo: photo,
                        uploadedAt: new Date().toISOString()
                    };
                    await DB.saveDocument(doc);
                }
            }

            // Actualizar estado de habitación
            const room = await DB.getRoom(App.state.selectedRoom);
            room.status = 'ocupada';
            room.currentGuest = guest.id;
            await DB.saveRoom(room);

            // Mostrar confirmación
            this.showConfirmationPage(guest);

        } catch (error) {
            console.error('Error al completar registro:', error);
            App.showToast('Error al completar el registro', 'error');
        }
    },

    /**
     * Muestra página de confirmación
     */
    showConfirmationPage(guest) {
        const content = document.getElementById('manualContent');

        content.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">✓</div>
                <h2 style="color: var(--primary); margin-bottom: 1rem;">¡Registro Completado!</h2>
                <p style="font-size: 1.1rem; margin-bottom: 2rem;">Bienvenido a Residencias Doña Mary</p>

                <div class="card" style="background-color: var(--light-gray); margin-bottom: 2rem;">
                    <p><strong>Número de Habitación:</strong> ${App.state.selectedRoom.replace('room_', '')}</p>
                    <p><strong>Huésped:</strong> ${guest.name}</p>
                    <p><strong>Email:</strong> ${guest.email}</p>
                    <p><strong>Teléfono:</strong> ${guest.phone}</p>
                    <p><strong>Fecha de Ingreso:</strong> ${new Date(guest.checkInDate).toLocaleDateString('es-CO')}</p>
                </div>

                <div style="background-color: rgba(26, 188, 156, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                    <p><strong>Tu Evaluación Emocional:</strong></p>
                    <p>${guest.evaluation.summary}</p>
                    <p style="font-size: 0.9rem; color: var(--medium-gray);">Esto nos ayudará a brindarte mejor atención.</p>
                </div>

                <button class="btn btn-primary btn-block" onclick="App.showSection('disponibilidad')">Volver al Inicio</button>
            </div>
        `;

        App.showSection('manual');
        App.showToast('✓ ¡Registro exitoso! Bienvenido', 'success');
    }
};