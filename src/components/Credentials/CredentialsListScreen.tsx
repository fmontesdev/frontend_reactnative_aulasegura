import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Avatar, Button, IconButton, Text } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { useFilters } from '../../contexts/FilterContext';
import { usePaginationParams } from '../../hooks/usePaginationParams';
import { useCreateTag, useDeleteTag, useTags, useUpdateTag } from '../../hooks/queries/useTags';
import { useUsers } from '../../hooks/queries/useUsers';
import { DataTable, ColumnConfig } from '../DataTable';
import { ConfirmDialog } from '../ConfirmDialog';
import { ErrorState } from '../ErrorState';
import { StyledChip } from '../StyledChip';
import { StyledSnackbar } from '../StyledSnackbar';
import { TooltipWrapper } from '../TooltipWrapper';
import apiService from '../../services/apiService';
import { addOpacity } from '../../utils/colorUtils';
import { isApiError } from '../../errors/ApiError';
import { MobileTagFormData, PhysicalTagFormData, RegenerateTagFormData } from '../../schemas/tag.schema';
import { CreateTagResponse, Tag, TagType } from '../../types/Tag';
import { User } from '../../types/User';
import { CreateCredentialDialog, RegenerateCredentialDialog } from './CredentialDialogs';

function getTagId(tag: Tag) {
  return tag.tagId;
}

function getUserName(tag: Tag) {
  if (!tag.user) return tag.userId ? `Usuario ${tag.userId}` : 'Usuario desconocido';
  return `${tag.user.name} ${tag.user.lastname}`.trim();
}

function getInitials(tag: Tag) {
  const user = tag.user;
  if (!user) return 'U';
  return `${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase() || 'U';
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-ES');
}

function getCredentialColumns(typeLabel: string): ColumnConfig<Tag>[] {
  return [
    { key: 'user', label: 'Usuario', flex: 1.8, sortKey: (tag) => getUserName(tag) },
    { key: 'type', label: 'Tipo', flex: 0.9, sortKey: () => typeLabel },
    { key: 'issuedAt', label: 'Emitida', flex: 0.8, sortKey: (tag) => tag.issuedAt || tag.createdAt || '' },
    { key: 'isActive', label: 'Estado', flex: 0.8, sortKey: (tag) => tag.isActive ? 1 : 0 },
    { key: 'actions', label: 'Acciones', flex: 0.7, sortable: false },
  ];
}

interface CredentialsListScreenProps {
  type: TagType;
}

export function CredentialsListScreen({ type }: CredentialsListScreenProps) {
  const theme = useAppTheme();
  const { filters } = useFilters();
  const technicalFilter = type === 'rfid' ? 'tipo:rfid' : 'tipo:nfc_mobile';
  const queryFilters = useMemo(() => [...filters, technicalFilter], [filters, technicalFilter]);
  const { page: currentPage, limit: currentLimit, setPage, setLimit } = usePaginationParams({ filters });
  const [createVisible, setCreateVisible] = useState(false);
  const [regenerateVisible, setRegenerateVisible] = useState(false);
  const [tagToRegenerate, setTagToRegenerate] = useState<Tag | null>(null);
  const [deactivateVisible, setDeactivateVisible] = useState(false);
  const [tagToDeactivate, setTagToDeactivate] = useState<Tag | null>(null);
  const [mobileCredential, setMobileCredential] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState<'success' | 'error'>('success');

  const { data: tagsResponse, isLoading, isFetching, error, refetch } = useTags({
    page: currentPage,
    limit: currentLimit,
    filters: queryFilters,
  });
  const { data: usersResponse, isLoading: usersLoading } = useUsers({ limit: 100, filters: ['estado:activo'] });
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const isPhysical = type === 'rfid';
  const typeLabel = isPhysical ? 'NFC física' : 'NFC móvil';
  const tags = tagsResponse?.data || [];
  const pagination = tagsResponse?.meta;
  const columns = getCredentialColumns(typeLabel);

  const userOptions = (usersResponse?.data || []).map((user: User) => ({
    label: `${user.name} ${user.lastname} · ${user.email}`,
    value: user.userId,
  }));

  const showMessage = (message: string, variant: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarVariant(variant);
    setSnackbarVisible(true);
  };

  const handleCreate = async (data: PhysicalTagFormData | MobileTagFormData) => {
    try {
      const payload = isPhysical
        ? { userId: data.userId, type, rawUid: (data as PhysicalTagFormData).rawUid }
        : { userId: data.userId, type };
      const result: CreateTagResponse = await createTag.mutateAsync(payload);
      setCreateVisible(false);
      if (!isPhysical && result.mobileCredential) {
        setMobileCredential(result.mobileCredential);
      }
      showMessage(`${typeLabel} creada correctamente`, 'success');
    } catch (e: unknown) {
      showMessage(isApiError(e) ? e.message : `Error al crear ${typeLabel}`, 'error');
    }
  };

  const handleRegenerate = async (data: RegenerateTagFormData) => {
    if (!tagToRegenerate) return;
    try {
      await updateTag.mutateAsync({ tagId: getTagId(tagToRegenerate), data });
      setRegenerateVisible(false);
      setTagToRegenerate(null);
      showMessage('NFC física regenerada correctamente', 'success');
    } catch (e: unknown) {
      showMessage(isApiError(e) ? e.message : 'Error al regenerar la NFC física', 'error');
    }
  };

  const handleDeactivate = async () => {
    if (!tagToDeactivate) return;
    try {
      await deleteTag.mutateAsync(getTagId(tagToDeactivate));
      setDeactivateVisible(false);
      setTagToDeactivate(null);
      showMessage(`${typeLabel} desactivada correctamente`, 'success');
    } catch (e: unknown) {
      showMessage(isApiError(e) ? e.message : `Error al desactivar ${typeLabel}`, 'error');
    }
  };

  const copyMobileCredential = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(mobileCredential);
      showMessage('Credencial copiada al portapapeles', 'success');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurface }}>
          Cargando credenciales...
        </Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar credenciales" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
            {isPhysical ? 'Credenciales NFC físicas' : 'Credenciales NFC móviles'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
            {isPhysical ? 'Tarjetas y llaves NFC asociadas a usuarios' : 'Credenciales móviles generadas para usuarios'}
          </Text>
        </View>
        <Button icon="plus" mode="contained" onPress={() => setCreateVisible(true)} style={{ backgroundColor: theme.colors.success }}>
          Crear {typeLabel}
        </Button>
      </View>

      {mobileCredential ? (
        <View style={[styles.onceCard, { borderColor: theme.colors.warning, backgroundColor: addOpacity(theme.colors.warning, 0.08) }]}>
          <View style={styles.onceText}>
            <Text variant="titleSmall" style={{ color: theme.colors.warning }}>Esta credencial solo se muestra una vez</Text>
            <Text selectable variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{mobileCredential}</Text>
          </View>
          <Button mode="outlined" onPress={copyMobileCredential}>Copiar</Button>
          <IconButton icon="close" onPress={() => setMobileCredential('')} />
        </View>
      ) : null}

      <DataTable
        data={tags}
        columns={columns}
        keyExtractor={(tag) => String(getTagId(tag))}
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        limitOptions={[5, 10, 20, 50]}
        isLoading={isFetching}
        onRefresh={refetch}
        emptyMessage={`No hay credenciales ${typeLabel.toLowerCase()} disponibles`}
        defaultSortKey="issuedAt"
        defaultSortOrder="desc"
        renderRow={(tag) => (
          <>
            <View style={styles.cellUser}>
              {tag.user?.avatar ? (
                <Avatar.Image size={32} source={{ uri: apiService.getImageUrl(tag.user.avatar) }} />
              ) : (
                <Avatar.Text size={32} label={getInitials(tag)} color={theme.colors.onPrimary} style={{ backgroundColor: theme.colors.tertiary }} />
              )}
              <View style={styles.userText}>
                <Text variant="bodyMedium" style={{ fontWeight: '600' }} numberOfLines={1}>{getUserName(tag)}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.grey }} numberOfLines={1}>{tag.user?.email || '-'}</Text>
              </View>
            </View>

            <View style={styles.cellType}>
              <View style={styles.chipWrapper}><StyledChip color={isPhysical ? theme.colors.tertiary : theme.colors.warning}>{typeLabel}</StyledChip></View>
            </View>

            <View style={styles.cellIssued}>
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>{formatDate(tag.issuedAt || tag.createdAt)}</Text>
            </View>

            <View style={styles.cellStatus}>
              <View style={styles.chipWrapper}><StyledChip color={tag.isActive ? theme.colors.success : theme.colors.grey}>{tag.isActive ? 'Activo' : 'Inactivo'}</StyledChip></View>
            </View>

            <View style={styles.cellActions}>
              {isPhysical ? (
                <TooltipWrapper title="Regenerar">
                  <IconButton
                    icon="refresh"
                    size={20}
                    iconColor={theme.colors.secondary}
                    onPress={() => { setTagToRegenerate(tag); setRegenerateVisible(true); }}
                    style={[styles.actionButton, { borderColor: addOpacity(theme.colors.secondary, 0.3) }]}
                  />
                </TooltipWrapper>
              ) : null}
              <TooltipWrapper title="Desactivar">
                <IconButton
                  icon="toggle-switch-off"
                  size={20}
                  iconColor={theme.colors.error}
                  onPress={() => { setTagToDeactivate(tag); setDeactivateVisible(true); }}
                  style={[styles.actionButton, { borderColor: addOpacity(theme.colors.error, 0.3) }]}
                />
              </TooltipWrapper>
            </View>
          </>
        )}
      />

      <CreateCredentialDialog
        visible={createVisible}
        type={type}
        userOptions={userOptions}
        usersLoading={usersLoading}
        isLoading={createTag.isPending}
        onDismiss={() => setCreateVisible(false)}
        onSubmit={handleCreate}
      />

      <RegenerateCredentialDialog
        visible={regenerateVisible}
        credentialLabel={tagToRegenerate ? getUserName(tagToRegenerate) : ''}
        isLoading={updateTag.isPending}
        onDismiss={() => { setRegenerateVisible(false); setTagToRegenerate(null); }}
        onSubmit={handleRegenerate}
      />

      <ConfirmDialog
        visible={deactivateVisible}
        onDismiss={() => { setDeactivateVisible(false); setTagToDeactivate(null); }}
        onConfirm={handleDeactivate}
        title="Confirmar desactivación"
        message="¿Estás seguro de que deseas desactivar la credencial"
        highlightedText={tagToDeactivate ? getUserName(tagToDeactivate) : ''}
        confirmText="Desactivar"
        cancelText="Cancelar"
        isLoading={deleteTag.isPending}
        variant="danger"
      />

      <StyledSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        variant={snackbarVariant}
        action={{ label: 'Cerrar', onPress: () => setSnackbarVisible(false) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 24, paddingHorizontal: 2, paddingBottom: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 22, gap: 16 },
  onceCard: { borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  onceText: { flex: 1, gap: 4 },
  cellUser: { flex: 1.8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  userText: { flex: 1 },
  cellType: { flex: 0.9, justifyContent: 'center' },
  cellIssued: { flex: 0.8, justifyContent: 'center' },
  cellStatus: { flex: 0.8, justifyContent: 'center' },
  cellActions: { flex: 0.7, flexDirection: 'row', alignItems: 'center' },
  chipWrapper: { alignSelf: 'flex-start' },
  actionButton: { marginVertical: -2, marginLeft: -2, borderWidth: 1, borderRadius: 20 },
});
