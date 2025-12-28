/**
 * Options for the `deepClone` function.
 */
export interface CloneDeepOptions {
  /**
   * The maximum depth to deeply clone. Defaults to `Infinity`.
   * A depth of 0 returns a shallow clone of the root object (if it's an object/array),
   * or the original primitive value.
   */
  maxDepth?: number;
}
