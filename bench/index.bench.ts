import { deepClone } from '@se-oss/deep-clone';
// @ts-expect-error TS7016: Could not find a declaration file for module deep-clone.
import deepCloneLib from 'deep-clone';
import lodash from 'lodash';
import { bench, describe } from 'vitest';

const lodashCloneDeep = lodash.cloneDeep;

const data: any = {
  a: 1,
  b: 'string',
  c: true,
  d: null,
  e: {
    f: 2,
    g: [1, 2, 3],
    h: {
      i: 3,
      j: new Date(),
      k: /abc/g,
    },
  },
  l: [
    { m: 4, n: 5 },
    { o: 6, p: 7 },
  ],
};

data.self = data;
data.e.parent = data;
data.l[0].root = data;

describe('Deep Clone Benchmarks', () => {
  bench('@se-oss/deep-clone', () => {
    deepClone(data);
  });

  bench('lodash', () => {
    lodashCloneDeep(data);
  });

  bench('deep-clone', () => {
    deepCloneLib(data);
  });

  bench('structuredClone', () => {
    structuredClone(data);
  });
});
