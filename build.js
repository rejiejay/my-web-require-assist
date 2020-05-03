import {
    getPackageJson
} from './utils/file-handle.js';
import configs from './app/configs.js';
import {
    html,
    css,
    javaScript
} from './app/render.js';
import lib from './app/lib.js';

const main = async () => {
    const version = getPackageJson().version
    console.log('正在打包', version)

    configs.forEach(async config => {
        const environment = '"production"'
        const jsInstance = await javaScript(config, environment);
        if (jsInstance.result !== 1) console.error(jsInstance.message);
        console.log(`正在打包javaScript:${config.route}`, jsInstance)

        const htmlInstance = await html(config, version);
        if (htmlInstance.result !== 1) console.error(htmlInstance.message);
        console.log(`正在打包html:${config.route}`, htmlInstance)

        const cssInstance = await css(config);
        if (cssInstance.result !== 1) console.error(cssInstance.message);
        console.log(`正在打包css:${config.route}`, cssInstance)
    })

    const libInstance = await lib.init();
    console.log(`正在打包lib:`, libInstance)
}

main()