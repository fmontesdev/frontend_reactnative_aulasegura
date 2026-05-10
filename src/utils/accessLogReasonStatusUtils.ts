const REASON_STATUS_LABELS: Record<string, string> = {
  'Valid permission found': 'Permiso válido',
  'No valid permission found': 'Sin permiso válido',
  'Tag not found': 'Credencial no encontrada',
  'Inactive tag': 'Credencial inactiva',
  'The NFC does not belong to the authenticated user': 'NFC de otro usuario',
  'Reader not found': 'Lector no encontrado',
  'Inactive reader': 'Lector inactivo',
  'Internal error while validating access': 'Error interno al validar',
};

export function getAccessLogReasonLabel(reasonStatus: string | null | undefined) {
  if (!reasonStatus) {
    return 'Motivo no disponible';
  }

  return REASON_STATUS_LABELS[reasonStatus] ?? reasonStatus;
}
