# iseedeadpeople · [![LICENSE](https://img.shields.io/npm/l/iseedeadpeople)](LICENSE.txt) [![NPM Version](https://img.shields.io/npm/v/iseedeadpeople)](https://www.npmjs.com/package/iseedeadpeople)

Register a hidden cheat gesture to enable/disable a custom flag in cookie.

## Background

For various reasons, debugging tools cannot be included directly in the production environment.
An unconventional means is required to support dynamic switching.

## Usage

### IIFE

A config string formatted `${flag}:${gesture}` must be set in the URL hash.

For example,

```html
<script src="https://cdn.jsdelivr.net/npm/iseedeadpeople/dist/index.iife.js#myflag:UUDDLRLR"></script>
```

In this case,

The `UUDDLRLR` is a gesture descriptor, `U`, `D`, `L`, `R` correspond to UP, DOWN, LEFT, RIGHT.

The `myflag` is a cookie name.

If a user makes the gesture, the value of the cookie named `myflag` will be set to "true",
and if the gesture is made one more time, that cookie will be removed.

### As a package

Include from NPM.

```shell
npm install iseedeadpeople --save
```

Setup gesture and handler in your project.

```typescript
import { setup } from 'iseedeadpeople';

// Setup a pair of gesture and handler.
setup(['U', 'R', 'D', 'L'], () => {
  // This handler function will be called after a user makes the gesture.
  // You can do anything here.
  alert('You made a gesture `URDL`');
});
```

## Examples

1. [Dynamic switching for PageSpy](https://yanagieiichi.github.io/iseedeadpeople/examples/pagespy.html)
2. [Dynamic switching for vConsole](https://yanagieiichi.github.io/iseedeadpeople/examples/vconsole.html)
