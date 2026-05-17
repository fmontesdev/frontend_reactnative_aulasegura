import { CreateTagData, CreateTagResponse, DeleteTagResponse, PaginatedTags, TagsFilters, Tag, UpdateTagData } from '../types/Tag';
import apiService from './apiService';

const SUPPORTED_TAG_FILTER_KEYS = new Set(['type', 'tipo', 'user', 'usuario', 'email', 'active', 'estado']);

function normalizeFilterKey(key: string) {
  return key
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function isSupportedTagFilter(filter: string) {
  const trimmed = filter.trim();
  const separatorIndex = trimmed.indexOf(':');

  if (separatorIndex === -1) return Boolean(trimmed);

  const key = normalizeFilterKey(trimmed.slice(0, separatorIndex));

  return SUPPORTED_TAG_FILTER_KEYS.has(key);
}

export const tagService = {
  async getAllTags(filters?: TagsFilters): Promise<PaginatedTags> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const supportedFilters = filters?.filters?.filter(isSupportedTagFilter) || [];

    if (supportedFilters.length > 0) {
      params.append('filters', supportedFilters.join(','));
    }

    const queryString = params.toString();
    const url = queryString ? `/tags?${queryString}` : '/tags';

    return apiService.get<PaginatedTags>(url);
  },

  async createTag(data: CreateTagData): Promise<CreateTagResponse> {
    return apiService.post<CreateTagResponse>('/tags/admin', data);
  },

  async updateTag(tagId: string | number, data: UpdateTagData): Promise<Tag> {
    return apiService.patch<Tag>(`/tags/${tagId}`, data);
  },

  async deleteTag(tagId: string | number): Promise<DeleteTagResponse> {
    return apiService.delete<DeleteTagResponse>(`/tags/${tagId}`);
  },
};
