// https://stackoverflow.com/a/2117523
export function guid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export function error(message) {
  throw new Error(`Snowflake Error: ${message}`);
}

export function warn(message) {
  console.warn(`Snowflate Warning: ${message}`)
}

export function cloneDeep(obj) {
  if (obj == null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (Array.isArray(obj)) {
    return [
      ...obj.map(cloneDeep),
    ];
  }

  let clonedObj = new obj.constructor();

  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      clonedObj[prop] = cloneDeep(obj[prop]);
    }
  }

  return clonedObj;
}
