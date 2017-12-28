## Nona core
A component-entity-system engine. Can be used for games and more!

#### Basic Usage
`yarn add nona-core` or `npm install --save nona-core`
```Javascript
import Engine from 'nona-core';

// Create a new Game instance
const engine = new Engine({
  renderer: ({
    // Entities and component data
  }) => {
    // Do some rendering here
  },
  update: ({
    // Entities and component data
  }) => {
    // Modify entity-component data here
  },
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
##### new Engine()
Takes arguments as an object with keys:

| Key | Type | Default Value | Description |
| --- | --- | --- | --- |
| renderer | Function | null | A function that should be used to draw your entities |
| update | Function | null | Called before `renderer`. Do your logic to update entity data here. |
| init [optional] | Function | null | If provided, called once when the engine first starts |
| components [optional] | Array | [] | An array of component configs. Useful for loading in components from another project into yours. |
| assemblages [optional] | Array | [] | An array of assemblage configs. Useful for loading in assemblages from another project into yours. |

##### engine.startGame()
Starts the engine, calling `init()` and the starting the main update/render loop.

##### engine.stopGame()
Stops the main update/render loop.

##### engine.addEntity(label [, assemblage])
Takes a `string` label and an optional `string` assemblageId, and returns an entityId. If the assemblage exists, adds it to the newly created entity. Returns the id of the new entity.

##### engine.createComponent({ name, [description], [state] })
Takes a config object with a required `string` name (used for referencing this component), optional `string` description, and optional `object` state. State isn't required because you could use a component as a form of tagging related entities.

##### engine.addComponentToEntity(componentName, entityId)
Takes a `string` component name and `string` entity id and adds that component to the entity.

##### engine.removeComponentFromEntity(componentName, entityId)
Takes a `string` component name and `string` entity id and removes that component from the entity.

##### engine.deleteComponent(componentName)
Takes a `string` component name and deletes it form this instance of `engine`. It also removes it from all entities.

##### engine.deleteEntity(entityId)
Takes a `string` entity id and removes that entity from this instance of `engine`.

##### engine.addAssemblage({ components, label, [description] })
Takes a config `object` with keys `string` label, `Set{string}` components, and optionally a `string` description. Returns the id of the newly created assemblage. Each of the strings in `components` should be the name of a component that already exists in `engine`.

##### engine.getAssemblageByLabel(label)
Takes a `string` label and returns the id of the assemblage that matches.

##### renderer: (data) => {}
A function that receives:
```javascript
data === {
  assemblages = {}, // { [assemblageId]: { label: '', description: '', components: Set{<componentId>} } }
  assemblageEntities = {}, // { [assemblageId]: <entityId>] }
  entityAssemblages = {}, // { [entityId]: <assemblageId>] }
  components = {}, // { [componentId]: { name: '', 'description: '', state: {} } }
  entities = {}, // { [entityId]: '' <label> }
  entityComponents = {}, // { [entityId]:  { [<componentId>]: <componentDataId> } }
  componentEntities = {}, // { [componentId]: Set{<entityId>} }
  componentData = {}, // { [componentDataId]: {} }
}
```
as its argument. You should do all of your drawing here.

##### update: (data) => {}
A function that receives:
```javascript
data === {
  assemblages = {}, // { [assemblageId]: { label: '', description: '', components: Set{<componentId>} } }
  assemblageEntities = {}, // { [assemblageId]: <entityId>] }
  entityAssemblages = {}, // { [entityId]: <assemblageId>] }
  components = {}, // { [componentId]: { name: '', 'description: '', state: {} } }
  entities = {}, // { [entityId]: '' <label> }
  entityComponents = {}, // { [entityId]:  { [<componentId>]: <componentDataId> } }
  componentEntities = {}, // { [componentId]: Set{<entityId>} }
  componentData = {}, // { [componentDataId]: {} }
  deltaTime, // The amount of time in milliseconds since the last time `update` was called
  elapsedTime, // The amount of time in milliseconds since the `update` was first called
}
```

Author: Wolfgang Schuster
