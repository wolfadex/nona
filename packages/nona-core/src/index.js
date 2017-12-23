import { guid, error, warn, cloneDeep } from './utils';

function isFunction(f) {
  return typeof f === 'function';
}

export default class Game {
  assemblages = {} // { [assemblageId]: { label: '', description: '', components: Set{<componentId>} } }
  assemblageEntities = {} // { [assemblageId]: <entityId>] }
  entityAssemblages = {} // { [entityId]: <assemblageId>] }
  components = {} // { [componentId]: { name: '', 'description: '', state: {} } }
  entities = {} // { [entityId]: '' <label> }
  entityComponents = {} // { [entityId]:  { [<componentId>]: <componentDataId> } }
  componentEntities = {} // { [componentId]: Set{<entityId>} }
  componentData = {} // { [componentDataId]: {} }

  gameRunning = false

  constructor({
    renderer,
    init,
    update,
    components = [],
    assemblages = [],
  }) {
    !isFunction(renderer) && error(`'renderer' should be a function`);
    !isFunction(update) && warn(`'update' should be a function, or nothing will change`);

    this.renderer = renderer;
    this.init = init;
    this.update = update;

    components.forEach((component) => {
      this.createComponent(component);
    });
    assemblages.forEach((assemblage) => {
      this.addAssemblage(assemblage);
    });
  }

  loadGame = ({
    assemblages = {},
    assemblageEntities = {},
    entityAssemblages = {},
    components = {},
    entities = {},
    entityComponents = {},
    componentEntities = {},
    componentData = {},
  }) => {
    this.assemblages = assemblages;
    this.assemblageEntities = assemblageEntities;
    this.components = components;
    this.entities = entities;
    this.entityComponents = entityComponents;
    this.componentEntities = componentEntities;
    this.componentData = componentData;
  }

  saveGame = () => {
    return {
      assemblages: this.assemblages,
      assemblageEntities: this.assemblageEntities,
      entityAssemblages: this.entityAssemblages,
      components: this.components,
      entities: this.entities,
      entityComponents: this.entityComponents,
      componentEntities: this.componentEntities,
      componentData: this.componentData,
    };
  }

  startGame = () => {
    this.gameRunning = true;

    if (isFunction(this.init)) {
      this.init({
        assemblages: this.assemblages,
        assemblageEntities: this.assemblageEntities,
        entityAssemblages: this.entityAssemblages,
        components: this.components,
        entities: this.entities,
        entityComponents: this.entityComponents,
        componentEntities: this.componentEntities,
        componentData: this.componentData,
      });
    }

    requestAnimationFrame(this.gameLoop);
  }

  stopGame = () => {
    this.gameRunning = false;
  }

  gameLoop = (timestamp) => {
    if (this.previousTimestamp == null) {
      this.previousTimestamp = timestamp;
    }

    const deltaTime = timestamp - this.previousTimestamp;

    this.previousTimestamp = timestamp;

    this.update({
      assemblages: this.assemblages,
      assemblageEntities: this.assemblageEntities,
      entityAssemblages: this.entityAssemblages,
      components: this.components,
      entities: this.entities,
      entityComponents: this.entityComponents,
      componentEntities: this.componentEntities,
      componentData: this.componentData,
      deltaTime,
      elapsedTime: timestamp,
    });
    this.renderer({
      assemblages: this.assemblages,
      assemblageEntities: this.assemblageEntities,
      entityAssemblages: this.entityAssemblages,
      components: this.components,
      entities: this.entities,
      entityComponents: this.entityComponents,
      componentEntities: this.componentEntities,
      componentData: this.componentData,
    });

    if (this.gameRunning) {
      requestAnimationFrame(this.gameLoop);
    }
  }

  addAssemblage = ({
    components = new Set(),
    label,
    description
  }) => {
    const newAssemblageID = guid();

    this.assemblages[newAssemblageID] = {
      components,
      label,
      description,
    };

    return newAssemblageID;
  }

  addEntity = (label, assemblageId) => {
    const newEntityId = guid();

    this.entities[newEntityId] = label;
    this.entityComponents[newEntityId] = {};

    if (assemblageId) {
      if (this.assemblages[assemblageId] == null) {
        error(`Cannot find assemblage '${assemblageId}'`);
      }

      this.assemblageEntities[assemblageId] = newEntityId;
      this.entityAssemblages[newEntityId] = assemblageId;

      for (let component of this.assemblages[assemblageId].components) {
        this.addComponentToEntity(component, newEntityId);
      }
    }

    return newEntityId;
  }

  createComponent = (data) => {
    if (data.name == null) {
      error('A component requires a \'name\'');
    }

    if (this.components[data.name] != null) {
      warn(`The component '${data.name}' already exists, you are replacing it`);
    }

    this.components[data.name] = data;
    this.componentEntities[data.name] = new Set();
  }

  addComponentToEntity = (componentName, entityId) => {
    const component = this.components[componentName];

    if (component == null) {
      error(`Component '${component}' doesn't exist in 'components'`);
    }

    this.componentEntities[componentName].add(entityId);

    const newComponentTableId = guid();

    this.entityComponents[entityId][componentName] = newComponentTableId;
    this.componentData[newComponentTableId] = cloneDeep(component.state);
  }

  removeComponentFromEntity = (componentName, entityId) => {
    try {
      this.componentEntities[componentName].delete(entityId);

      const {
        [componentName]: componentRemoving,
        ...otherComponents
      } = this.entityComponents[entityId];

      this.entityComponents[entityId] = otherComponents;
      delete this.componentData[componentRemoving];
    } catch (e) {
      error(`Failed to remove component '${componentName}' from entity '${entityId} (${this.entities[entityId]})'`);
    }
  }

  deleteComponent = (componentName) => {
    if (this.components[componentName] == null) {
      error(`Component '${componentName}' doesn't exist`);
    }

    delete this.components[componentName];

    const entitiesWithComponent = this.componentEntities[componentName];

    for (let entity of entitiesWithComponent) {
      const componentDataId = this.entityComponents[entity][componentName];

      delete this.entityComponents[entity][componentName];
      delete this.componentData[componentDataId];
    }

    Object.keys(this.assemblages).forEach((assemblage) => {
      if (this.assemblages[assemblage].components.has(componentName)) {
        this.assemblages[assemblage].components.delete(componentName);
      }
    });
  }

  deleteEntity = (entityId) => {
    if (this.entities[entityId] == null) {
      error(`Entity '${entityId}' doesn't exist`);
    }

    delete this.entities[entityId];

    const assemblageId = this.entityAssemblages[entityId];

    delete this.assemblageEntities[assemblageId];
    delete this.entityAssemblages[entityId];

    Object.keys(this.entityComponents[entityId]).forEach((component) => {
      const componentDataId = this.entityComponents[entityId][component];

      delete this.componentData[componentDataId];
    });

    delete this.entityComponents[entityId];
  }

  getAssemblageByLabel = (label) => {
    const assemblage = Object.keys(this.assemblages).find((assem) => {
      return label === this.assemblages[assem].label;
    });

    if (assemblage == null) {
      warn(`Cannot find assemblage '${label}'`)
      return null;
    }

    return assemblage;
  }
}
