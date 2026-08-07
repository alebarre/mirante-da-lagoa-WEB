export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function filterByText<T>(items: T[], text: string, fields: (keyof T)[]): T[] {
  if (!text?.trim()) return items;
  const normalized = normalizeText(text);
  return items.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value !== null && value !== undefined && normalizeText(String(value)).includes(normalized);
    })
  );
}

export function filterByExactField<T>(items: T[], value: string | null | undefined, field: keyof T): T[] {
  if (!value) return items;
  return items.filter(item => String(item[field]).toLowerCase() === value.toLowerCase());
}
