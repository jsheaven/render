<h1 align="center">@jsheaven/render</h1>

> Explains what it does

<h2 align="center">User Stories</h2>

1. As a developer, I want to use Render for X

2. As a developer, I don't want to do Y

<h2 align="center">Features</h2>

- ✅ Does X and Y
- ✅ Available as a simple API and simple to use CLI
- ✅ Just `136 byte` nano sized (ESM, gizpped)
- ✅ Tree-shakable and side-effect free
- ✅ Runs on Windows, Mac, Linux, CI tested
- ✅ First class TypeScript support
- ✅ 100% Unit Test coverage

<h2 align="center">Example usage (CLI)</h2>

`npx @jsheaven/render render --foo X`

> You need at least version 18 of [Node.js](https://www.nodejs.org) installed.

<h2 align="center">Example usage (API, as a library)</h2>

<h3 align="center">Setup</h3>

- yarn: `yarn add @jsheaven/render`
- npm: `npm install @jsheaven/render`

<h3 align="center">ESM</h3>

```ts
import { render } from '@jsheaven/render'

const result = await render({
  foo: 'X',
})
```

<h3 align="center">CommonJS</h3>

```ts
const { render } = require('@jsheaven/render')

// same API like ESM variant
```
