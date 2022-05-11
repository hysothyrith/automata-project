/**
 * Checks whether two sets are equal.
 */
export const isEqual = <T>(a: Set<T>, b: Set<T>) => {
  if (a.size !== b.size) return false;
  for (const element of a) {
    if (!b.has(element)) return false;
  }

  return true;
};
