import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readerService } from '../../services/readerService';
import { CreateReaderData, ReadersFilters, UpdateReaderData } from '../../types/Reader';

export const readerKeys = {
  all: ['readers'] as const,
  lists: () => [...readerKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...readerKeys.lists(), filters] as const,
  details: () => [...readerKeys.all, 'detail'] as const,
  detail: (readerId: number) => [...readerKeys.details(), readerId] as const,
};

export function useReaders(filters?: ReadersFilters) {
  return useQuery({
    queryKey: readerKeys.list(filters),
    queryFn: () => readerService.getAllReaders(filters),
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });
}

export function useReader(readerId?: number, enabled: boolean = true) {
  return useQuery({
    queryKey: readerKeys.detail(readerId!),
    queryFn: () => readerService.getReaderById(readerId!),
    enabled: !!readerId && enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateReader() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReaderData) => readerService.createReader(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
      const { roomKeys } = await import('./useRooms');
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useUpdateReader() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ readerId, data }: { readerId: number; data: UpdateReaderData }) => readerService.updateReader(readerId, data),
    onSuccess: async (updatedReader) => {
      queryClient.setQueryData(readerKeys.detail(updatedReader.readerId), updatedReader);
      queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
      const { roomKeys } = await import('./useRooms');
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useDeleteReader() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (readerId: number) => readerService.deleteReader(readerId),
    onSuccess: async (_, deletedReaderId) => {
      queryClient.removeQueries({ queryKey: readerKeys.detail(deletedReaderId) });
      queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
      const { roomKeys } = await import('./useRooms');
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}
