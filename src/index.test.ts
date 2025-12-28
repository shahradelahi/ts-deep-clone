import { describe, expect, it } from 'vitest';

import { deepClone } from '.';

describe('deepClone', () => {
  it('should deeply clone a plain object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
  });

  it('should deeply clone an array', () => {
    const arr = [1, { a: 2 }, [3, 4]];
    const cloned = deepClone(arr);

    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[1]).not.toBe(arr[1]);
    expect(cloned[2]).not.toBe(arr[2]);
  });

  it('should deeply clone objects and arrays nested together', () => {
    const original = {
      a: 1,
      b: { c: 2, d: [3, { e: 4 }] },
      f: [{ g: 5 }],
    };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
    expect(cloned.b.d).not.toBe(original.b.d);
    expect(cloned.b.d[1]).not.toBe(original.b.d[1]);
    expect(cloned.f).not.toBe(original.f);
    expect(cloned.f[0]).not.toBe(original.f[0]);
  });

  it('should handle primitives correctly', () => {
    expect(deepClone(123)).toBe(123);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
    const sym = Symbol('test');
    expect(deepClone(sym)).toBe(sym);
    const bigInt = BigInt(9007199254740991);
    expect(deepClone(bigInt)).toBe(bigInt);
  });

  it('should deeply clone Date objects', () => {
    const date = new Date();
    const obj = { d: date };
    const cloned = deepClone(obj);

    expect(cloned.d).toEqual(date);
    expect(cloned.d).not.toBe(date);
    expect(cloned.d instanceof Date).toBe(true);
  });

  it('should deeply clone RegExp objects', () => {
    const regex = /abc/g;
    const obj = { r: regex };
    const cloned = deepClone(obj);

    expect(cloned.r).toEqual(regex);
    expect(cloned.r).not.toBe(regex);
    expect(cloned.r instanceof RegExp).toBe(true);
  });

  it('should handle circular references', () => {
    const obj: any = {};
    obj.a = obj;

    const cloned = deepClone(obj);

    expect(cloned).not.toBe(obj);
    expect(cloned.a).toBe(cloned);
    expect(cloned.a).not.toBe(obj.a);
  });

  it('should handle circular references in nested structures', () => {
    const obj: any = {};
    const nested: any = { self: obj };
    obj.a = nested;

    const cloned = deepClone(obj);

    expect(cloned).not.toBe(obj);
    expect(cloned.a).not.toBe(obj.a);
    expect(cloned.a.self).toBe(cloned);
  });

  it('should not clone functions, Maps, Sets, or custom class instances', () => {
    class CustomClass {
      value = 1;
    }
    const customInstance = new CustomClass();
    const func = () => {};
    const map = new Map();
    const set = new Set();

    const original = { func, map, set, customInstance };
    const cloned = deepClone(original);

    expect(cloned.func).toBe(func);
    expect(cloned.map).toBe(map);
    expect(cloned.set).toBe(set);
    expect(cloned.customInstance).toBe(customInstance);
  });

  it('should respect maxDepth option for objects', () => {
    const obj = { a: { b: { c: 1 } } };

    const cloned0 = deepClone(obj, { maxDepth: 0 });
    expect(cloned0).toEqual(obj);
    expect(cloned0).not.toBe(obj);
    expect(cloned0.a).toBe(obj.a); // Not deep cloned beyond root

    const cloned1 = deepClone(obj, { maxDepth: 1 });
    expect(cloned1).toEqual(obj);
    expect(cloned1).not.toBe(obj);
    expect(cloned1.a).not.toBe(obj.a);
    expect(cloned1.a.b).toBe(obj.a.b); // Not deep cloned beyond one level

    const cloned2 = deepClone(obj, { maxDepth: 2 });
    expect(cloned2).toEqual(obj);
    expect(cloned2).not.toBe(obj);
    expect(cloned2.a).not.toBe(obj.a);
    expect(cloned2.a.b).not.toBe(obj.a.b);
    expect(cloned2.a.b.c).toBe(obj.a.b.c);
  });

  it('should respect maxDepth option for arrays', () => {
    const arr: any[] = [1, [2, [3, 4]]];

    const cloned0 = deepClone(arr, { maxDepth: 0 });
    expect(cloned0).toEqual(arr);
    expect(cloned0).not.toBe(arr);
    expect(cloned0[1]).toBe(arr[1]); // Not deep cloned beyond root

    const cloned1 = deepClone(arr, { maxDepth: 1 });
    expect(cloned1).toEqual(arr);
    expect(cloned1).not.toBe(arr);
    expect(cloned1[1]).not.toBe(arr[1]);
    expect(cloned1[1][1]).toBe(arr[1][1]); // Not deep cloned beyond one level

    const cloned2 = deepClone(arr, { maxDepth: 2 });
    expect(cloned2).toEqual(arr);
    expect(cloned2).not.toBe(arr);
    expect(cloned2[1]).not.toBe(arr[1]);
    expect(cloned2[1][1]).not.toBe(arr[1][1]);
  });

  it('should handle objects with symbol keys', () => {
    const sym = Symbol('test');
    const obj = { a: 1, [sym]: { b: 2 } };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned[sym]).not.toBe(obj[sym]);
  });

  it('should handle objects with non-enumerable properties (should not clone them)', () => {
    const obj = {
      a: 1,
      b: { c: 2 },
    };
    Object.defineProperty(obj, 'nonEnumerable', {
      value: { d: 3 },
      enumerable: false,
      writable: true,
      configurable: true,
    });
    const cloned = deepClone(obj);

    expect(cloned).toEqual({ a: 1, b: { c: 2 } });
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
    expect(Object.prototype.hasOwnProperty.call(cloned, 'nonEnumerable')).toBe(false);
  });

  it('should return objects with non-plain object prototypes by reference', () => {
    const proto = { inherited: 1 };
    const obj = Object.create(proto);
    obj.a = { b: 2 };

    const cloned = deepClone(obj);

    expect(cloned).toBe(obj); // Expect to be the same instance
    expect(Object.getPrototypeOf(cloned)).toBe(proto);
    expect(cloned.a).toBe(obj.a); // Nested object is not deep cloned because the root is not a plain object
  });

  it('should return an empty object for non-object inputs at depth 0 with maxDepth:0', () => {
    expect(deepClone(null, { maxDepth: 0 })).toBe(null);
    expect(deepClone(undefined, { maxDepth: 0 })).toBe(undefined);
    expect(deepClone(123, { maxDepth: 0 })).toBe(123);
    expect(deepClone('abc', { maxDepth: 0 })).toBe('abc');
  });

  it('should clone an empty object', () => {
    const obj = {};
    const cloned = deepClone(obj);
    expect(cloned).toEqual({});
    expect(cloned).not.toBe(obj);
  });

  it('should clone an empty array', () => {
    const arr: any[] = [];
    const cloned = deepClone(arr);
    expect(cloned).toEqual([]);
    expect(cloned).not.toBe(arr);
  });
});
