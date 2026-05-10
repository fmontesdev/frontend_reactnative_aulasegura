import React from 'react';
import { View } from 'react-native';
import { SseConnectionStatus } from '../types/AccessLog';
import { useAppTheme } from '../theme';
import { StyledChip } from './StyledChip';

interface SseConnectionBadgeProps {
  status: SseConnectionStatus;
}

export function SseConnectionBadge({ status }: SseConnectionBadgeProps) {
  const theme = useAppTheme();

  const statusConfig: Record<SseConnectionStatus, { color: string; label: string }> = {
    open: { color: theme.colors.success, label: 'Conectado' },
    connecting: { color: theme.colors.warning, label: 'Conectando' },
    error: { color: theme.colors.error, label: 'Reconectando' },
    closed: { color: theme.colors.grey, label: 'Cerrado' },
  };
  const config = statusConfig[status];

  return (
    <View>
      <StyledChip color={config.color}>{config.label}</StyledChip>
    </View>
  );
}
