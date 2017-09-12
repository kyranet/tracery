# Tracery

[![Build Status](https://travis-ci.org/kyranet/tracery.svg?branch=master)](https://travis-ci.org/kyranet/tracery)
[![npm](https://img.shields.io/npm/v/tracery-es8.svg?maxAge=3600)](https://www.npmjs.com/package/tracery-es8)
[![npm](https://img.shields.io/npm/dt/tracery-es8.svg?maxAge=3600)](https://www.npmjs.com/package/tracery-es8)

Tracery: A story-grammar generation library for javascript

This package uses what is known as [Syntactic Sugar](https://en.wikipedia.org/wiki/Syntactic_sugar): ES6's [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes). They improve code readability and additionally, this package is designed for V8 5.9+ (which uses the new [Compiler Pipeline](https://en.wikipedia.org/wiki/Compiler), with [TurboFan](https://github.com/v8/v8/wiki/TurboFan) and [Ignition](https://github.com/v8/v8/wiki/Interpreter)). This is also a NPM library designed for Node.js, and requires minimum **Node.js 8.x**.

## Installation

This is hosted at npm, so it can be installed like so:

```bash
$ npm install tracery-es8 --production
npm installation...
```

## Example usage

```javascript
const tracery = require('tracery-es8');

const grammar = tracery.createGrammar({
    animal: ['panda', 'fox', 'capybara', 'iguana'],
    emotion: ['sad', 'happy', 'angry', 'jealous'],
    origin: ['I am #emotion.a# #animal#.']
});

grammar.addModifiers(tracery.baseEngModifiers);

console.log(grammar.flatten('#origin#'));
```

Sample output:

```plaintext
I am a happy iguana.
I am an angry fox.
I am a sad capybara.
```
