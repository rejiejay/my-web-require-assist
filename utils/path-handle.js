import path from 'path';

export const __dirname = path.resolve(path.dirname(''));

export const buildPath = myPath => path.join(__dirname, path.relative(__dirname, myPath));