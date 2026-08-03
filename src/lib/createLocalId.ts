/** Deterministic local IDs for mock CRUD (avoids impure Date.now/Math.random in render analysis). */
let seq = 0

export function createLocalId(prefix = 'local'): string {
  seq += 1
  return `${prefix}-${seq}`
}

/** Numeric variant for legacy mock tables that use number ids. */
export function createLocalNumericId(offset = 10_000): number {
  seq += 1
  return offset + seq
}
