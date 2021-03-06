/**
 * url作用: 用于过滤路由, 例如 /todo/index.html
 */
const configs = [{
    route: '/index.html',
    entry: './views',
    output: './build'
}, {
    route: '/windows-detail/index.html',
    entry: './views/windows-detail',
    output: './build/windows-detail'
}, {
    route: '/redirect/index.html',
    entry: './views/redirect',
    output: './build/redirect'
}, {
    route: '/detail/index.html',
    entry: './views/detail',
    output: './build/detail'
}]

export default configs