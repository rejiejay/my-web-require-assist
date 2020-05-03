/**
 * 含义: 手机电脑设备判断
 * 注意: 如果存在值, 则表示移动端
 */
const deviceDiffer = () => {
    const ua = window.navigator.userAgent
    const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod']

    return agents.find(agent => 0 < ua.indexOf(agent));
}

export default deviceDiffer