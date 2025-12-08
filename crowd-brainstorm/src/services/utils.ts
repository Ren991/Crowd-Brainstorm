// utils: generar código legible: 2 bloques de 4 (A-Z0-9)
export const generateCode = (len = 7) => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sin I, O, 0,1
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // ejemplo: AB3K9P -> lo formateamos AB3K-9P (opcional)
  return out.slice(0,4) + '-' + out.slice(4);
}
