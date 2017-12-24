import Engine from 'nona-core';
import {
  renderer,
  components,
  assemblages,
  keyIsDown,
} from 'nona-ascii';

function exampleInit() {
  const attachPoint = document.createElement('div');

  document.body.appendChild(attachPoint);

  const WIDTH = 80;
  const HEIGHT = 30;
  const engine = new Engine({
    renderer: renderer({
      attachPoint,
      width: WIDTH,
      height: HEIGHT,
    }),
    update,
    components,
    assemblages,
  });

  engine.createComponent({
    name: 'Health',
    description: 'Simple integer counter for health',
    state: {
      health: 100,
    },
  });

  const gameObjectAssemblage = engine.getAssemblageByLabel('GameObject');
  const wizard = engine.addEntity('Wizard', gameObjectAssemblage);

  engine.addComponentToEntity('Health', wizard);

  function update({
    deltaTime,
    elapsedTime,
    assemblages = {},
    assemblageEntities = {},
    entityAssemblages = {},
    components = {},
    entities = {},
    entityComponents = {},
    componentEntities = {},
    componentData = {},
  }) {
    const transformDataId = entityComponents[wizard]['Transform'];
    let directionX = 0;
    let directionY = 0;

    if (keyIsDown(39)) {
      directionX = 1;
    } else if (keyIsDown(37)) {
      directionX = -1;
    }

    if (keyIsDown(38)) {
      directionY = -1;
    } else if (keyIsDown(40)) {
      directionY = 1;
    }

    const newX = Math.min(Math.max(componentData[transformDataId].x + 0.01 * deltaTime * directionX, 0), WIDTH - 1);
    const newY = Math.min(Math.max(componentData[transformDataId].y + 0.01 * deltaTime * directionY, 0), HEIGHT - 1);

    componentData[transformDataId].x = newX;
    componentData[transformDataId].y = newY;
  }

  engine.startGame();
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn && fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(exampleInit);
