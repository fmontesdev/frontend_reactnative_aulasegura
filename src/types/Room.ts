import { Pagination } from './Pagination';
import { Reader } from './Reader';

export interface Room {
  roomId: number;
  roomCode: string;
  name: string;
  courseId: number | null;
  courseName: string | null;
  capacity: number;
  building: number;
  floor: number;
  readers: Reader[];
}

export interface PaginatedRooms {
  data: Room[];
  meta: Pagination;
}

export interface RoomsFilters {
  page?: number;
  limit?: number;
  filters?: string[];
}

export interface CreateRoomData {
  roomCode: string;
  name: string;
  courseId?: number;
  capacity: number;
  building: number;
  floor: number;
}

export interface UpdateRoomData {
  roomCode?: string;
  name?: string;
  courseId?: number | null;
  capacity?: number;
  building?: number;
  floor?: number;
}

export interface RoomResponse {
  message: string;
}
