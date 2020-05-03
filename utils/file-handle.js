import fse from 'fs-extra';
import fs from 'fs';

import consequencer from './consequencer.js';
import {
    buildPath
} from './path-handle.js';

/**
 * 含义: 复制目录、子目录，及其中的文件
 */
export const copyDirectory = async (targetFolderPath, renderFolderPath) => await new Promise((resolve, reject) => {
    fse.copy(targetFolderPath, renderFolderPath, err => {
        if (err) return reject(err);
        resolve();
    })
}).then(
    () => consequencer.success(),
    error => consequencer.error(error)
)

export const getPackageJson = () => JSON.parse(fs.readFileSync(buildPath('./package.json')))