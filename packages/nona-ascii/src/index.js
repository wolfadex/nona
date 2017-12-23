const DEFAULT_COLOR = 'rgb(150, 150, 150)';
const DEFAULT_BACKGROUND_COLOR = 'rgb(0, 0, 0)';

const gameBoardElement = document.createElement('div');

gameBoardElement.setAttribute('tabindex', '0');

const inputState = {};

function handleKeyDown(e) {
  e.preventDefault();
  inputState[e.keyCode] = 'down';
}
function handleKeyUp(e) {
  e.preventDefault();
  inputState[e.keyCode] = 'up';
}
function handleKeyPress(e) {
  e.preventDefault();
  inputState[e.keyCode] = 'press';
}

gameBoardElement.addEventListener('keydown', handleKeyDown);
gameBoardElement.addEventListener('keyup', handleKeyUp);
// gameBoardElement.addEventListener('keypress', handleKeyPress);

export function keyIsUp(key) {
  return inputState[key] === 'up';
}

export function keyIsDown(key) {
  return inputState[key] === 'down';
}

export function renderer({
  attachPoint,
  width,
  height,
  color = DEFAULT_COLOR,
  backgroundColor = DEFAULT_BACKGROUND_COLOR,
}) {
  const gameBoard = new Array(width * height);

  gameBoard.fill('.');
  attachPoint.appendChild(gameBoardElement);
  gameBoardElement.setAttribute('style', `color:${color};background-color:${backgroundColor};font-family:monospace;text-align:center;`);
  gameBoardElement.focus();

  return function({
    assemblages = {},
    assemblageEntities = {},
    entityAssemblages = {},
    components = {},
    entities = {},
    entityComponents = {},
    componentEntities = {},
    componentData = {},
  }) {
    const entitiesWithTransform = componentEntities['Transform'] || new Set();
    const entitiesWithRenderer = componentEntities['Renderer'] || new Set();
    let longerList;
    let shorterList;

    if (entitiesWithTransform.size > entitiesWithRenderer.size) {
      longerList = entitiesWithTransform;
      shorterList = entitiesWithRenderer;
    } else {
      longerList = entitiesWithRenderer;
      shorterList = entitiesWithTransform;
    }

    gameBoard.fill('.');

    for (let entity of longerList) {
      if (shorterList.has(entity)) {
        const {
          Transform,
          Renderer,
        } = entityComponents[entity];
        const transformData = componentData[Transform];
        const renderData = componentData[Renderer];

        gameBoard[Math.floor(transformData.x) + Math.floor(transformData.y) * width] = renderData.char;
      }
    }

    let renderText = '';

    gameBoard.forEach((char, i) => {
      renderText += char;

      if ((i + 1) % width === 0) {
        renderText += '\n';
      }
    });

    gameBoardElement.textContent = renderText;
  };
}

export const components = [
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
];

export const assemblages = [
  {
    label: 'GameObject',
    description: `An assemblage for positioning and rendering an entity.
Coponents: ['Transform', 'Renderer']`,
    components: new Set([
      'Transform',
      'Renderer',
    ]),
  },
];
