import Koa from 'koa';

import Static from 'koa-static';
import render from './app/index.js';

const app = new Koa();

render(app);

app.use(Static('build'));

app.use(ctx => ctx.body = 'Nothing is configured in this url');

app.listen(8080);