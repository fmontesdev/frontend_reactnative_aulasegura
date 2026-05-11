import { CreateRoomData, PaginatedRooms, Room, RoomResponse, RoomsFilters, UpdateRoomData } from '../types/Room';
import apiService from './apiService';

export const roomService = {
  async getAllRooms(filters?: RoomsFilters): Promise<PaginatedRooms> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    if (filters?.filters && filters.filters.length > 0) {
      params.append('filters', filters.filters.join(','));
    }

    const queryString = params.toString();
    const url = queryString ? `/rooms?${queryString}` : '/rooms';

    return apiService.get<PaginatedRooms>(url);
  },

  async getRoomById(roomId: number): Promise<Room> {
    return apiService.get<Room>(`/rooms/${roomId}`);
  },

  async createRoom(data: CreateRoomData): Promise<Room> {
    return apiService.post<Room>('/rooms', data);
  },

  async updateRoom(roomId: number, data: UpdateRoomData): Promise<Room> {
    return apiService.patch<Room>(`/rooms/update/${roomId}`, data);
  },

  async deleteRoom(roomId: number): Promise<RoomResponse> {
    return apiService.delete<RoomResponse>(`/rooms/${roomId}`);
  },
};
