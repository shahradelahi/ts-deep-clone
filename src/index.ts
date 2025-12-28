import { isObject, isPlainObject } from '@se-oss/object';

import type { CloneDeepOptions } from './typings';

/**
 * Creates a deep clone of a value.
 *
 * This function is immutable, meaning it returns a new value and does not mutate the original.
 * It recursively clones plain objects, arrays, Dates, and RegExps.
 * Other object types (e.g., functions, custom class instances, `Map`, `Set`) are returned as is.
 * Circular references are handled to prevent infinite loops.
 *
 * @template T The type of the value to clone.
 * @param value The value to deep clone.
 * @param options Optional configuration for the deep clone operation.
 * @returns A new, deep-cloned value.
 */
export function deepClone<T>(value: T, options?: CloneDeepOptions): T {
  const maxDepth = options?.maxDepth ?? Infinity;
  const visited = new WeakMap<object, any>();

  const isArr = Array.isArray;
  const getSymbols = Object.getOwnPropertySymbols;
  const propIsEnum = Object.prototype.propertyIsEnumerable;

  function inner(v: any, depth: number): any {
    if (!isObject(v)) return v; // primitives, null, undefined

    // circular
    if (visited.has(v)) return visited.get(v);

    // maxDepth -> shallow clone to preserve immutability at this level
    if (depth >= maxDepth) {
      return isArr(v) ? (v as any).slice() : Object.assign({}, v);
    }

    // Dates & RegExps
    if (v instanceof Date) return new Date(v.getTime());
    if (v instanceof RegExp) return new RegExp(v.source, v.flags);

    // arrays (handle before plain-object check)
    if (isArr(v)) {
      const len = v.length;
      const out: any[] = new Array(len);
      visited.set(v, out);
      for (let i = 0; i < len; i++) out[i] = inner(v[i], depth + 1);
      return out;
    }

    // only clone plain objects; otherwise return original reference
    if (!isPlainObject(v)) return v;

    // plain object: fast cloning
    const out: Record<PropertyKey, any> = {};
    visited.set(v, out);

    // string keys (Object.keys returns only enumerable own string keys) — no extra check needed
    const keys = Object.keys(v) as string[];
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      out[k] = inner((v as Record<string, any>)[k], depth + 1);
    }

    // symbol keys: must check enumerability
    const syms = getSymbols(v);
    for (let i = 0; i < syms.length; i++) {
      const s = syms[i];
      if (propIsEnum.call(v, s)) out[s] = inner((v as Record<symbol, any>)[s], depth + 1);
    }

    return out;
  }

  return inner(value as any, 0) as T;
}

export { deepClone as default };
export type * from './typings';
