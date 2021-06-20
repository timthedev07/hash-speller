# hash-speller-js

This is a package that performs spell checking on a given chunk of text in the provided language. The python equivalent is [here](https://relentlessexploration.readthedocs.io/en/latest/spell-checker.html).

## Why would I use this particular package?

Well, because it uses hash tables as its core data structure, which mean once loading everything in, the speed of looking up any word would be nearly constant, `O(1)`.

## Installation

```bash
npm i hash-speller-js
```

## Usage

```javascript
import { Checker } from "spellerjs";

const checker = new Checker("<language>", "text you want to check");
checker.check(true /* if you want the stats to be printed out */);
```
