# hash-speller

This is a package that performs spell checking on a given chunk of text in the provided language.

## Why would I use this particular package?

Well, because it uses hash tables as its core data structure, which means once loading everything in, the speed of looking up any word would be nearly constant, `O(1)`.

## Installation

```bash
yarn add hash-speller
```

## Usage

```typescript
import { Checker } from "hash-speller";

const checker = new Checker("<language>", "text you want to check");
const stats = checker.check(true /* if you want the stats to be printed out */);
```
