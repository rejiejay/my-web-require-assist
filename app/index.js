import Router from 'koa-router';

import configs from './configs.js';
import {
    render
} from './render.js';
import lib from './lib.js';

const app = koa => {
    const router = Router()

    configs.forEach(config => router.get(config.route, async (ctx, next) => {

        const effect = await render(config);
        if (effect.result !== 1) return ctx.body = effect.message;

        return next();
    }))

    lib.init();

    koa.use(router.routes());
}

export default app