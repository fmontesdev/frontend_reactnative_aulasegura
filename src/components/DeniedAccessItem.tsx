import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { AccessLog } from '../types/AccessLog';
import { StyledChip } from './StyledChip';
import apiService from '../services/apiService';

interface DeniedAccessItemProps {
  accessLog: AccessLog;
  isLast?: boolean;
}

function formatAccessTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Hora desconocida';
  }

  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(name: string, lastname: string) {
  const firstInitial = name.trim().charAt(0);
  const lastInitial = lastname.trim().charAt(0);
  return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
}

// Item de acceso denegado para widgets del dashboard
export function DeniedAccessItem({ accessLog, isLast = false }: DeniedAccessItemProps) {
  const theme = useAppTheme();
  const userName = `${accessLog.user.name} ${accessLog.user.lastname}`;
  const roomName = `Aula ${accessLog.room.roomCode}`;
  const avatar = accessLog.user.avatar;
  const accessTime = formatAccessTime(accessLog.createdAt);

  const methodConfig = {
    rfid: { color: theme.colors.tertiary, label: 'NFC física' },
    nfc: { color: theme.colors.warning, label: 'NFC móvil' },
    qr: { color: theme.colors.primary, label: 'QR' },
  }[accessLog.accessMethod];

  return (
    <View style={[styles.container, isLast && styles.lastContainer]}>
      <View style={styles.userColumn}>
        {avatar ? (
          <Avatar.Image size={36} source={{ uri: apiService.getImageUrl(avatar) }} />
        ) : (
          <Avatar.Text
            size={36}
            label={getInitials(accessLog.user.name, accessLog.user.lastname)}
            color={theme.colors.onPrimary}
            style={{ backgroundColor: theme.colors.error }}
          />
        )}

        <View style={styles.userTextContainer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }} numberOfLines={1}>
            {userName}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.grey }}>
            {roomName}
          </Text>
        </View>
      </View>

      <View style={styles.methodColumn}>
        <StyledChip color={methodConfig.color}>{methodConfig.label}</StyledChip>
        <Text variant="bodySmall" style={{ color: theme.colors.grey }}>
          {accessTime}
        </Text>
      </View>

      <View style={styles.statusColumn}>
        <StyledChip color={theme.colors.error} icon="alert-circle">
          Denegado
        </StyledChip>
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
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  lastContainer: {
    borderBottomWidth: 0,
  },
  userColumn: {
    flex: 1.4,
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 12,
    flex: 1,
    gap: 2,
  },
  methodColumn: {
    minWidth: 104,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusColumn: {
    minWidth: 112,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
