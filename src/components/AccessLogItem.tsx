import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { AccessLog, AccessStatus } from '../types/AccessLog';
import { useAppTheme } from '../theme';
import { StyledChip } from './StyledChip';
import apiService from '../services/apiService';
import { getAccessLogReasonLabel } from '../utils/accessLogReasonStatusUtils';

interface AccessLogItemProps {
  accessLog: AccessLog;
  isLast?: boolean;
}

type StatusIconName = 'check-circle' | 'alert-circle' | 'clock-alert' | 'logout';

function formatAccessTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Hora desconocida';
  }

  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getInitials(name: string, lastname: string) {
  const firstInitial = name.trim().charAt(0);
  const lastInitial = lastname.trim().charAt(0);
  return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
}

export function AccessLogItem({ accessLog, isLast = false }: AccessLogItemProps) {
  const theme = useAppTheme();

  const statusConfig: Record<AccessStatus, { color: string; chip: string; icon: StatusIconName }> = {
    allowed: { color: theme.colors.success, chip: 'Permitido', icon: 'check-circle' },
    denied: { color: theme.colors.error, chip: 'Denegado', icon: 'alert-circle' },
    timeout: { color: theme.colors.warning, chip: 'Caducado', icon: 'clock-alert' },
    exit: { color: theme.colors.grey, chip: 'Salida', icon: 'logout' },
  };
  const config = statusConfig[accessLog.accessStatus];
  const methodConfig: Record<string, { color: string; label: string }> = {
    rfid: { color: theme.colors.tertiary, label: 'NFC física' },
    nfc: { color: theme.colors.warning, label: 'NFC móvil' },
    qr: { color: theme.colors.primary, label: 'QR' },
  };
  const method = methodConfig[accessLog.accessMethod] ?? { color: theme.colors.grey, label: accessLog.accessMethod.toUpperCase() };
  const userName = `${accessLog.user?.name ?? ''} ${accessLog.user?.lastname ?? ''}`.trim() || 'Usuario desconocido';
  const userEmail = accessLog.user?.email || 'Email no disponible';
  const roomName = accessLog.room ? `Aula ${accessLog.room.roomCode}` : 'Espacio desconocido';
  const roomDetails = accessLog.room
    ? `${roomName} · Edificio ${accessLog.room.building} · Planta ${accessLog.room.floor}`
    : roomName;
  const reason = getAccessLogReasonLabel(accessLog.reasonStatus);
  const accessTime = formatAccessTime(accessLog.createdAt);
  const avatar = accessLog.user?.avatar;

  return (
    <View style={[styles.container, isLast && styles.lastContainer]}>
      <View style={styles.userColumn}>
        {avatar ? (
          <Avatar.Image size={42} source={{ uri: apiService.getImageUrl(avatar) }} />
        ) : (
          <Avatar.Text
            size={42}
            label={getInitials(accessLog.user?.name ?? '', accessLog.user?.lastname ?? '')}
            color={theme.colors.onPrimary}
            style={{ backgroundColor: config.color }}
          />
        )}
        <View style={styles.userTextContainer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            {userName}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.grey }}>
            {userEmail}
          </Text>
        </View>
      </View>

      <View style={styles.methodColumn}>
        <StyledChip color={method.color}>{method.label}</StyledChip>
        <Text variant="bodySmall" style={{ color: theme.colors.grey }}>
          {accessTime}
        </Text>
      </View>

      <View style={styles.roomColumn}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }} numberOfLines={1}>
          {roomDetails}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.grey }} numberOfLines={1}>
          {reason}
        </Text>
      </View>

      <View style={styles.readerColumn}>
        <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
          Lector {accessLog.readerId}
        </Text>
      </View>

      <View style={styles.statusColumn}>
        <StyledChip color={config.color} icon={config.icon}>{config.chip}</StyledChip>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  lastContainer: {
    borderBottomWidth: 0,
  },
  userColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.8,
    minWidth: 220,
  },
  userTextContainer: {
    marginLeft: 12,
    flex: 1,
    gap: 3,
  },
  methodColumn: {
    flex: 0.7,
    minWidth: 90,
    alignItems: 'flex-start',
    gap: 4,
  },
  roomColumn: {
    flex: 1.8,
    minWidth: 220,
    gap: 3,
  },
  readerColumn: {
    flex: 0.6,
    minWidth: 80,
  },
  statusColumn: {
    flex: 0.8,
    minWidth: 120,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
});
