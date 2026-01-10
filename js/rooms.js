/**
 * Rooms.js - Gestión de habitaciones
 */

const Rooms = {
    /**
     * Obtiene todas las habitaciones
     */
    async getAllRooms() {
        return await DB.getRooms();
    },

    /**
     * Obtiene habitación por ID
     */
    async getRoom(id) {
        return await DB.getRoom(id);
    },

    /**
     * Actualiza estado de una habitación
     */
    async updateRoomStatus(roomId, status) {
        const room = await DB.getRoom(roomId);
        if (room) {
            room.status = status;
            await DB.saveRoom(room);
            return room;
        }
        return null;
    },

    /**
     * Libera una habitación (checkout de huésped)
     */
    async releaseRoom(roomId) {
        const room = await DB.getRoom(roomId);
        if (room) {
            room.status = 'disponible';
            room.currentGuest = null;
            room.checkOutDate = null;
            await DB.saveRoom(room);
            return room;
        }
        return null;
    }
};