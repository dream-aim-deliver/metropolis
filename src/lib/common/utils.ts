import { randomBytes } from 'crypto'

/**
 * Generates a unique name by appending a random hex string to the given name.
 * Works even if executed in parallel.
 */
export function genUniqName(name: string) {
  return `${name}-${randomBytes(16).toString('hex')}`
}
