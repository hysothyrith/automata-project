/**
 * Takes a `subject` whose type is either `T` or `T[]`. If type of `subject` is
 * `T`, then return a one element arary containing the `subject`, else return
 * the array of `subject`s directly.
 */
export const coalesce = <T>(subject: T | T[]): T[] =>
  Array.isArray(subject) ? subject : [subject];
