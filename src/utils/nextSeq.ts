/**
 * Returns the next sequence number based on the numeric suffix of existing IDs.
 * Unlike `list.length + 1`, this never reuses an ID after items are deleted.
 *
 * @param ids  existing IDs, e.g. ['CLM-301', 'CLM-302']
 * @param base minimum base so the first generated number is base + 1
 */
export function nextSeq(ids: Array<string | number>, base = 0): number {
  let max = base;
  for (const id of ids) {
    const match = String(id).match(/(\d+)\s*$/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > max) max = n;
    }
  }
  return max + 1;
}
