import { CreateReaderData, PaginatedReaders, Reader, ReaderResponse, ReadersFilters, UpdateReaderData } from '../types/Reader';
import apiService from './apiService';

export const readerService = {
  async getAllReaders(filters?: ReadersFilters): Promise<PaginatedReaders> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    if (filters?.filters && filters.filters.length > 0) {
      params.append('filters', filters.filters.join(','));
    }

    const queryString = params.toString();
    const url = queryString ? `/readers?${queryString}` : '/readers';

    return apiService.get<PaginatedReaders>(url);
  },

  async getReaderById(readerId: number): Promise<Reader> {
    return apiService.get<Reader>(`/readers/${readerId}`);
  },

  async createReader(data: CreateReaderData): Promise<Reader> {
    return apiService.post<Reader>('/readers', data);
  },

  async updateReader(readerId: number, data: UpdateReaderData): Promise<Reader> {
    return apiService.patch<Reader>(`/readers/${readerId}`, data);
  },

  async deleteReader(readerId: number): Promise<ReaderResponse> {
    return apiService.delete<ReaderResponse>(`/readers/${readerId}`);
  },
};
