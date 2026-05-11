import { Pagination } from './Pagination';

export interface Reader {
  readerId: number;
  readerCode: string;
  roomId: number | null;
  roomCode?: string;
  roomName?: string;
  isActive: boolean;
}

export interface PaginatedReaders {
  data: Reader[];
  meta: Pagination;
}

export interface ReadersFilters {
  page?: number;
  limit?: number;
  filters?: string[];
}

export interface CreateReaderData {
  readerCode: string;
  roomId: number;
}

export interface UpdateReaderData {
  readerCode?: string;
  roomId?: number | null;
}

export interface ReaderResponse {
  message: string;
}
