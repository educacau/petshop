/* eslint-disable @typescript-eslint/no-var-requires */
const {readdirSync, readFileSync, writeFileSync, existsSync} = require('node:fs');
const {join, extname} = require('node:path');

const swaggerDir = join(__dirname, '..', 'swagger');
const basePath = join(swaggerDir, 'base.json');
const pathsDir = join(swaggerDir, 'paths');
const componentsDir = join(swaggerDir, 'components');
const outputPath = join(swaggerDir, 'openapi.json');

const mergeDeep = (target, source) => {
  if (!source) return target;
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue)
    ) {
      target[key] = mergeDeep(target[key] || {}, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }

  return target;
};

if (!existsSync(basePath)) {
  throw new Error(`Base Swagger document not found at ${basePath}.`);
}

const document = JSON.parse(readFileSync(basePath, 'utf-8'));

document.paths = document.paths || {};
document.components = document.components || {};

if (existsSync(componentsDir)) {
  const componentFiles = readdirSync(componentsDir).filter(file => extname(file) === '.json');
  for (const file of componentFiles) {
    const componentPath = join(componentsDir, file);
    const componentDefinitions = JSON.parse(readFileSync(componentPath, 'utf-8'));
    document.components = mergeDeep(document.components, componentDefinitions);
  }
}

if (existsSync(pathsDir)) {
  const pathFiles = readdirSync(pathsDir).filter(file => extname(file) === '.json');
  for (const file of pathFiles) {
    const pathFilePath = join(pathsDir, file);
    const pathDefinitions = JSON.parse(readFileSync(pathFilePath, 'utf-8'));
    document.paths = mergeDeep(document.paths, pathDefinitions);
  }
}

writeFileSync(outputPath, JSON.stringify(document, null, 2));
console.log(`Swagger file generated with ${Object.keys(document.paths).length} paths: ${outputPath}`);
