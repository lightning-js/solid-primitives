<p>
  <img src="https://assets.solidjs.com/banner?project=Library&type=solid-lightning" alt="SolidJS Lightning Primitives" />
</p>

# solid-lightning-primitives

Solid-Lightning-Primitives are a collection of primitives to get the most out of [Lightning Solid](https://lightningjs.io/).

## Quick Start

Clone starter template:

```sh
> npm i @lightningjs/solid-primitives
```

### Row and Column

Also included is a Row and Column component which handles key navigation between children by automatically calling setFocus on selected child.

```jsx
import { Column, Row } from '@lightningjs/solid-primitives';
<Row y={400} style={styles.Row} gap={12} justifyContent="flexStart">
  <Button autofocus>TV Shows</Button>
  <Button>Movies</Button>
  <Button>Sports</Button>
  <Button>News</Button>
</Row>;
```

### useFocusManager

`useFocusManager` adds key handling, focusPath tracking, and focus and blur events on components. You can do this once in your App component. It returns a signal, focusPath which is an array of elements that currently have focus. When `activeElement` changes, the focusPath will be recalculated. During which all elements in focus will have a `focus` state added and onFocus(currentFocusedElm, prevFocusedElm) event called. Elements losing focus will have `focus` state removed and onBlur(currentFocusedElm, prevFocusedElm) called.

```jsx
import { useFocusManager } from "@lightningjs/solid-primitives";

const App = () => {
  // Only need to do this once in Application, but you can call it anywhere
  // if you need to get the focusPath signal
  const focusPath = useFocusManager(keyMap);
  return ...
}
```

The calculated focusPath is used for handling key events. When a key is pressed, the `keyMap` looks for the keyName and corresponding value to call `on${key}` then `onKeyPress` on each element until one handles the event.

```jsx
import { useFocusManager } from '@lightningjs/solid-primitives';

useFocusManager({
  m: 'Menu',
  t: 'Text',
  b: 'Buttons',
});

<View
  onText={() => navigate('/text')}
  onButtons={() => navigate('/buttons')}
  onMenu={() => navigate('/')}
/>;
```

When keys m, t, b are pressed - onMenu, onText, onButtons will be called respectively.

### withPadding

`withPadding` is a [directive](https://www.solidjs.com/docs/latest/api#use___) to set padding when a child text node loads. It follows css by taking a single padding value or Array [top, bottom | left, right ] or [top | right, left | bottom ] or [top | right | bottom | left]

```jsx
import { View, Text, withPadding } from '@lightningjs/solid';

const Badge = (props) => {
  return (
    <node
      use:withPadding={[10, 15]}
      {...props}
      style={{
        color: '#00000099',
        borderRadius: 8,
        border: { width: 2, color: '#ffffff' },
      }}
    >
      <Text
        style={{
          fontSize: 20,
          lineHeight: 20,
        }}
      >
        {props.children}
      </Text>
    </node>
  );
};
<Badge>HD</Badge>;
```
