/**
 * url作用: 用于过滤路由, 例如 /todo/index.html
 */
const configs = [{
    route: '/index.html',
    entry: './views',
    output: './build'
}, {
    route: '/windows/index.html',
    entry: './views/windows',
    output: './build/windows'
}]

export default configs