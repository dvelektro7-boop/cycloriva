// WooCommerce CSV uses quoted, multiline fields and doubled quotes.
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(field); field = '';
    } else if (char === '\n' && !quoted) {
      row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = '';
    } else field += char;
  }
  if (quoted) throw new Error('CSV incomplet : guillemet non fermé.');
  if (field || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  const headers = rows.shift();
  if (!headers?.includes('ID') || !headers.includes('Images')) throw new Error('Export WooCommerce non reconnu.');
  return rows.filter(row => row.some(Boolean)).map((row, index) => {
    // Some WooCommerce rows omit the final empty metadata columns.
    if (row.length > headers.length) throw new Error(`Nombre de colonnes incorrect pour le produit ${index + 1}.`);
    return Object.fromEntries(headers.map((header, i) => [header, row[i] ?? '']));
  });
}

export function plainText(value = '') {
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', rsquo: '’', lsquo: '‘', ndash: '–', mdash: '—', eacute: 'é', egrave: 'è', agrave: 'à', ecirc: 'ê', ugrave: 'ù', ocirc: 'ô', ccedil: 'ç' };
  return value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/\\[rn]/g, '\n')
    .replace(/<br\s*\/?\s*>|<\/(?:p|div|li|h[1-6]|tr)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
      if (entity[0] !== '#') return entities[entity.toLowerCase()] ?? match;
      const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    })
    .replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function numberOrNull(value) {
  if (!value?.trim()) return null;
  const result = Number(value.replace(',', '.'));
  if (!Number.isFinite(result)) throw new Error(`Nombre invalide : ${value}`);
  return result;
}
