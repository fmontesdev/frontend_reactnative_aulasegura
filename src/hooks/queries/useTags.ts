import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../../services/tagService';
import { CreateTagData, TagsFilters, UpdateTagData } from '../../types/Tag';

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...tagKeys.lists(), filters] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (tagId: string | number) => [...tagKeys.details(), tagId] as const,
};

export function useTags(filters?: TagsFilters) {
  return useQuery({
    queryKey: tagKeys.list(filters),
    queryFn: () => tagService.getAllTags(filters),
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagData) => tagService.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tagId, data }: { tagId: string | number; data: UpdateTagData }) => tagService.updateTag(tagId, data),
    onSuccess: (updatedTag, variables) => {
      queryClient.setQueryData(tagKeys.detail(variables.tagId), updatedTag);
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: string | number) => tagService.deleteTag(tagId),
    onSuccess: (_, deletedTagId) => {
      queryClient.removeQueries({ queryKey: tagKeys.detail(deletedTagId) });
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}
