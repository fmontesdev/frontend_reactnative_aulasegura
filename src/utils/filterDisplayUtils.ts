function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function normalizeFilterValue(filter: string) {
  const trimmed = filter.trim();
  const [rawKey, ...rawValueParts] = trimmed.split(':');

  if (rawValueParts.length === 0) {
    return trimmed;
  }

  const key = normalizeText(rawKey);
  const value = normalizeText(rawValueParts.join(':'));

  if (key === 'tipo' || key === 'type') {
    if (value === 'nfc fisica' || value === 'nfc physical' || value === 'fisica') {
      return `${rawKey}:rfid`;
    }

    if (value === 'nfc movil' || value === 'nfc mobile' || value === 'movil') {
      return `${rawKey}:nfc`;
    }
  }

  return trimmed;
}

export function formatFilterLabel(filter: string) {
  const [rawKey, ...rawValueParts] = filter.split(':');

  if (rawValueParts.length === 0) {
    return filter;
  }

  const key = normalizeText(rawKey);
  const value = normalizeText(rawValueParts.join(':'));

  if ((key === 'tipo' || key === 'type') && value === 'rfid') {
    return `${rawKey}:NFC física`;
  }

  if ((key === 'tipo' || key === 'type') && value === 'nfc') {
    return `${rawKey}:NFC móvil`;
  }

  return filter;
}
