# @se-oss/deep-clone

[![CI](https://github.com/shahradelahi/ts-deep-clone/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/shahradelahi/ts-deep-clone/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@se-oss/deep-clone.svg)](https://www.npmjs.com/package/@se-oss/deep-clone)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](/LICENSE)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@se-oss/deep-clone)
[![Install Size](https://packagephobia.com/badge?p=@se-oss/deep-clone)](https://packagephobia.com/result?p=@se-oss/deep-clone)

_@se-oss/deep-clone_ is a utility for deeply cloning objects.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm install @se-oss/deep-clone
```

<details>
<summary>Install using your favorite package manager</summary>

**pnpm**

```bash
pnpm install @se-oss/deep-clone
```

**yarn**

```bash
yarn add @se-oss/deep-clone
```

</details>

## 📖 Usage

### Basic Usage

```typescript
import { deepClone } from '@se-oss/deep-clone';

const original = {
  a: 1,
  b: { c: 2, d: new Date() },
  e: [3, { f: 4 }],
  g: /pattern/g,
};

const cloned = deepClone(original);

console.log(cloned !== original); // true
console.log(cloned.b !== original.b); // true
console.log(cloned.b.d !== original.b.d); // true (Date cloned)
```

### Circular References

```typescript
const obj: any = {};
obj.a = obj;

const cloned = deepClone(obj);

console.log(cloned !== obj); // true
console.log(cloned.a === cloned); // true
```

### Depth Limiting

```typescript
const nested = { a: { b: { c: 1 } } };

// Shallow clone (depth 0)
const shallow = deepClone(nested, { maxDepth: 0 });
console.log(shallow.a === nested.a); // true

// Clone 1 level deep
const oneLevel = deepClone(nested, { maxDepth: 1 });
console.log(oneLevel.a === nested.a); // false
console.log(oneLevel.a.b === nested.a.b); // true
```

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/@se-oss/deep-clone).

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/ts-deep-clone).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/ts-deep-clone/graphs/contributors).
