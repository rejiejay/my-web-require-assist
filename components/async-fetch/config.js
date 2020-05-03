import CONST from './const.js';

const initAnthDeniedCode = () => Object.keys(CONST.RESULT_CODE).map(item => CONST.RESULT_CODE[item].value)

const config = {
    origin: process.env === 'development' ? 'http://localhost:1932/' : '/task-server/',
    deniedCodes: initAnthDeniedCode()
}

export default config
