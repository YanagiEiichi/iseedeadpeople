# iseedeadpeople

Register a hidden cheat gesture to enable/disable a custom flag in cookie.

## Usage

### IIFE

A config string formatted `${flag}:${gesture}` must be set in the URL hash.

For example,

```html
<script src="./dist/index.iife.js#ISEEDEADPEOPLE:UUDDLRLR"></script>
```

In this case,

The `UUDDLRLR` is a gesture descriptor, `U`, `D`, `L`, `R` correspond to UP, DOWN, LEFT, RIGHT.

The `myflag` is a cookie name.

If a user makes the gesture, the value of the cookie named `myflag` will be set to "true",
and if the gesture is made one more time, that cookie will be removed.

### As a package

```typescript
import { setup } from 'iseedeadpeople';

// Setup a pair of gesture and handler.
setup(['U', 'R', 'D', 'L'], () => {
  // This handler function will be called after a user makes the gesture.
  // You can do anything here.
  alert('You made a gesture `URDL`');
});
```
