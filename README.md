<p>
  <img src="https://assets.solidjs.com/banner?project=Library&type=solid-lightning-primitives" alt="SolidJS Lightning Primitives" />
</p>

# solid-lightning-primitives

Solid-Lightning-Primitives are a collection of primitives to get the most out of [Lightning Solid](https://lightningjs.io/).

## To Install

```sh
> npm i @lightningjs/solid-primitives
```

## useFocusManager

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
  Menu: 'm',
  Text: 't',
  Buttons: 'b',
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
import { Text } from '@lightningjs/solid';
import { withPadding } from '@lightningjs/solid-primitives';

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

### createSpriteMap

`createSpriteMap` allows you to take a sprite and use different positions of the texture
for different icons. This loads a texture once and allows it to be reused for performance and memory savings.

```jsx
import { View } from '@lightningjs/solid';
import { createSpriteMap } from '@lightningjs/solid-primitives';
const icons = [
  { name: 'dolby', width: 39, height: 40, x: 0, y: 0 },
  { name: 'ellipse', width: 56, height: 56, x: 40, y: 0 },
  { name: 'ellipse1', width: 56, height: 56, x: 96, y: 0 },
];

export default function Icon(props) {
  const sprite = createSpriteMap('/assets/icons/spritesheet.png', icons);

  return (
    <View
      {...props}
      texture={sprite[props.name]}
      width={sprite[props.name].props.width}
      height={sprite[props.name].props.height}
      x={(56 - sprite[props.name].props.width) / 2}
      y={(56 - sprite[props.name].props.height) / 2}
    ></View>
  );
}
```

### createInfiniteItems

For Lightning apps it's really important to lazy load rows and items as much as possible.

```jsx
const [items, { setPage }] = createInfiniteItems(paginatedAPI);
setPage(1); // load the first page - default no pages are loaded.

const onSelectedChanged = (column, elm, index) => {
  if (index < 5) {
    return;
  } else {
    const page = Math.ceil((index - 4) / 10) + 1;
    column.setPage(page);
  }
};

<Column
  ref={column}
  {...props}
  onFocus={onFocus}
  onSelectedChanged={onSelectedChanged}
>
  <For each={props.items()}>{(item) => <Button>{item.title}</Button>}</For>
</Column>;
```
