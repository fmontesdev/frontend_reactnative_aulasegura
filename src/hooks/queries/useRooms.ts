import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../../services/roomService';
import { CreateRoomData, RoomsFilters, UpdateRoomData } from '../../types/Room';
import { readerKeys } from './useReaders';

export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...roomKeys.lists(), filters] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (roomId: number) => [...roomKeys.details(), roomId] as const,
};

export function useRooms(filters?: RoomsFilters) {
  return useQuery({
    queryKey: roomKeys.list(filters),
    queryFn: () => roomService.getAllRooms(filters),
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });
}

export function useRoom(roomId?: number, enabled: boolean = true) {
  return useQuery({
    queryKey: roomKeys.detail(roomId!),
    queryFn: () => roomService.getRoomById(roomId!),
    enabled: !!roomId && enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoomData) => roomService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, data }: { roomId: number; data: UpdateRoomData }) => roomService.updateRoom(roomId, data),
    onSuccess: (updatedRoom) => {
      queryClient.setQueryData(roomKeys.detail(updatedRoom.roomId), updatedRoom);
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: number) => roomService.deleteRoom(roomId),
    onSuccess: (_, deletedRoomId) => {
      queryClient.removeQueries({ queryKey: roomKeys.detail(deletedRoomId) });
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
    },
  });
}
