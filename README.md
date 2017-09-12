# Tracery

Tracery: A story-grammar generation library for javascript

This package uses what is known as [Syntactic Sugar](https://en.wikipedia.org/wiki/Syntactic_sugar): ES6's [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes). They improve code readability and additionally, this package is designed for V8 5.9+ (which uses the new [Compiler Pipeline](https://en.wikipedia.org/wiki/Compiler), with [TurboFan](https://github.com/v8/v8/wiki/TurboFan) and [Ignition](https://github.com/v8/v8/wiki/Interpreter)). This is also a NPM library designed for Node.js, and requires minimum **Node.js 6.x**.

## Installation

This is hosted at npm, so it can be installed like so:

```bash
$ npm install tracery-es8 --save
npm installation...
```

For Node.js 8.x folks, you may use:

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
