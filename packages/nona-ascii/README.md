## Nona ASCII
A renderer for `nona-core` that renders in a browser what looks like a terminal output.

#### Basic Usage
```Javascript
import Engine from 'nona-core';
import {
  renderer,
  components,
  assemblages,
  keyIsDown,
} from 'nona-ascii';

// Create a new Game instance
const engine = new Engine({
  renderer: renderer({
    attachPoint,
    width: 80,
    height: 30,
  }),
  update: ({
    // Entities and component data
  }) => {
    // Modify entity-component data here
    if (keyIsDown(39)) { // Arrow Right
      // Move carla right
    }
  },
  components,
  assemblages,
});

// Add components
engine.createComponent({
  name: 'Transform',
  description: 'Track entity position',
  state: {
    x: 0,
    y: 0,
  },
});

// Create an entity
const carla = engine.addEntity('Carla');
// Add a component to an entity
engine.addComponentToEntity('Transform', carla);
// Start your engine
engine.startGame();
```

#### API
Exports:

| Name | Type | Description |
| --- | --- | --- |
| renderer | Function | Takes arguments for rendering and returns a function to be passed to `nona-core`'s renderer. |
| components | Array | An array of core components used for drawing and more. |
| assemblages | Array | An array of core assemblages used for drawing and more. |
| keyIsDown | Function | Takes a keyCode and return a `boolean`. |
| keyIsUp | Function | Takes a keyCode and return a `boolean`. |

##### renderer({ attachPoint, [width], [height], [color], [backgroundColor] })
`attachPoint` is a DOM element to which everything will be drawn.

##### components
```javascript
[
  {
    name: 'Transform',
    description: `A component for storing the 2D position.
Default: state: { x: 0, y: 0 }
Types: state: { x: <integer>, y: <integer> }`,
    state: {
      x: 0,
      y: 0,
    },
  },
  {
    name: 'Renderer',
    description: `A component for renderer an ascii character.
Default: state: { char: '#' }
Types: state: { char: <char> }`,
    state: {
      char: '#',
    },
  },
]
```

##### assemblages
```javascript
[
  {
    label: 'GameObject',
    description: `An assemblage for positioning and rendering an entity.
Coponents: ['Transform', 'Renderer']`,
    components: new Set([
      'Transform',
      'Renderer',
    ]),
  },
]
```

##### keyIsDown(keyCode)
Takes an `integer` keyCode and returns a `boolean`.

##### keyIsUp(keyCode)
Takes an `integer` keyCode and returns a `boolean`.

Author: Wolfgang Schuster
