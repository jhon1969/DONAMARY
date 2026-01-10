/**
 * IA-Evaluator.js - Evaluador de perfil emocional del huésped
 * Analiza respuestas del cuestionario para evaluar:
 * 1. Actitud hacia convivencia
 * 2. Estado emocional actual
 */

const IAEvaluator = {
    /**
     * Evalúa el perfil emocional basado en las respuestas del cuestionario
     * @param {Object} answers - Respuestas del cuestionario
     * @returns {Object} - Evaluación con score y recomendaciones
     */
    evaluateEmotionalProfile(answers) {
        const { coexistence, emotionalState } = answers;

        if (!coexistence || !emotionalState) {
            return null;
        }

        const profile = {
            timestamp: new Date().toISOString(),
            coexistenceScore: coexistence,
            emotionalScore: emotionalState,
            overallScore: Math.round((coexistence + emotionalState) / 2),
            coexistenceProfile: this.getCoexistenceProfile(coexistence),
            emotionalProfile: this.getEmotionalProfile(emotionalState),
            recommendations: [],
            summary: ''
        };

        profile.recommendations = this.generateRecommendations(profile);
        profile.summary = this.generateSummary(profile);

        return profile;
    },

    /**
     * Obtiene el perfil de actitud hacia convivencia
     */
    getCoexistenceProfile(score) {
        const profiles = {
            1: {
                level: 'Muy Baja',
                description: 'Posible preferencia por privacidad extrema o dificultades sociales',
                color: '#E74C3C'
            },
            2: {
                level: 'Baja',
                description: 'Prefiere espacios privados, interacción mínima',
                color: '#F39C12'
            },
            3: {
                level: 'Moderada',
                description: 'Balance entre privacidad e interacción social',
                color: '#F1C40F'
            },
            4: {
                level: 'Alta',
                description: 'Disfruta de interacción social, participativo',
                color: '#27AE60'
            },
            5: {
                level: 'Muy Alta',
                description: 'Muy sociable, busca integración comunitaria',
                color: '#1ABC9C'
            }
        };
        return profiles[score] || profiles[3];
    },

    /**
     * Obtiene el perfil del estado emocional
     */
    getEmotionalProfile(score) {
        const profiles = {
            1: {
                level: 'Muy Bajo',
                description: 'Estado emocional muy vulnerable o depresivo',
                color: '#8B0000'
            },
            2: {
                level: 'Bajo',
                description: 'Cierta ansiedad o malestar',
                color: '#DC143C'
            },
            3: {
                level: 'Neutral',
                description: 'Estado emocional estable y equilibrado',
                color: '#FFD700'
            },
            4: {
                level: 'Alto',
                description: 'Buen estado emocional y actitud positiva',
                color: '#90EE90'
            },
            5: {
                level: 'Muy Alto',
                description: 'Excelente estado emocional y energía positiva',
                color: '#00AA44'
            }
        };
        return profiles[score] || profiles[3];
    },

    /**
     * Genera recomendaciones basadas en el perfil
     */
    generateRecommendations(profile) {
        const recommendations = [];

        // Recomendaciones por actitud hacia convivencia
        if (profile.coexistenceScore === 1) {
            recommendations.push({
                type: 'info',
                message: 'Cliente prefiere máxima privacidad. Asignar habitación alejada de áreas comunes.'
            });
        } else if (profile.coexistenceScore === 2) {
            recommendations.push({
                type: 'info',
                message: 'Cliente prefiere privacidad. Considerar ubicación tranquila.'
            });
        } else if (profile.coexistenceScore >= 4) {
            recommendations.push({
                type: 'success',
                message: 'Cliente es sociable. Buena opción para habitaciones cercanas a áreas comunes.'
            });
        }

        // Recomendaciones por estado emocional
        if (profile.emotionalScore <= 2) {
            recommendations.push({
                type: 'warning',
                message: 'Cliente puede necesitar atención especial. Ofrecer servicios de apoyo disponibles.'
            });
        } else if (profile.emotionalScore >= 4) {
            recommendations.push({
                type: 'success',
                message: 'Cliente con actitud positiva. Ideal para ambiente acogedor.'
            });
        }

        // Recomendaciones combinadas
        if (profile.overallScore >= 8) {
            recommendations.push({
                type: 'info',
                message: '✓ Perfil favorable: Alta probabilidad de satisfacción con el hospedaje.'
            });
        } else if (profile.overallScore <= 4) {
            recommendations.push({
                type: 'warning',
                message: '⚠ Requiere seguimiento: Considerar check-in personalizado.'
            });
        }

        return recommendations;
    },

    /**
     * Genera un resumen del perfil
     */
    generateSummary(profile) {
        let summary = 'Resumen del Perfil: ';
        summary += `${profile.coexistenceProfile.description}. `;
        summary += `Estado emocional: ${profile.emotionalProfile.description}.`;
        return summary;
    },

    /**
     * Obtiene emoji basado en el score
     */
    getEmojiByScore(score, category = 'general') {
        const emojis = {
            1: '😔',
            2: '😕',
            3: '😐',
            4: '🙂',
            5: '😊'
        };
        return emojis[score] || '😐';
    },

    /**
     * Obtiene color basado en el score
     */
    getColorByScore(score) {
        const colors = {
            1: '#E74C3C',
            2: '#F39C12',
            3: '#F1C40F',
            4: '#27AE60',
            5: '#1ABC9C'
        };
        return colors[score] || '#95A5A6';
    },

    /**
     * Valida las respuestas del cuestionario
     */
    validateAnswers(answers) {
        if (!answers.coexistence || !answers.emotionalState) {
            return {
                valid: false,
                message: 'Por favor responde todas las preguntas.'
            };
        }

        if (answers.coexistence < 1 || answers.coexistence > 5) {
            return {
                valid: false,
                message: 'Respuesta inválida para la pregunta de convivencia.'
            };
        }

        if (answers.emotionalState < 1 || answers.emotionalState > 5) {
            return {
                valid: false,
                message: 'Respuesta inválida para la pregunta de estado emocional.'
            };
        }

        return { valid: true };
    }
};