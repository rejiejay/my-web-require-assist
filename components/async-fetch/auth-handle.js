import consequencer from './../../utils/consequencer.js';

import {
    succeedHandle,
    errorHandle,
    notHandleResult,
    requestUrl,
    requestConfig
} from './request-handle.js';
import CONST from './const.js';
import {
    inputPopUp,
    inputPopUpDestroy
} from './../input-popup.js';
import toast from './../toast.js';
import initHeaders from './headers.js';
import config from './config.js';

/**
 * 含义: 未授权流程
 * 注意: 仅执行一次
 */
const unAuthHandle = ({
    result,
    data,
    message
}) => {
    console.log('登录未授权, 进入处理流程;', result);

    /** UI不存在token */
    if (result === CONST.RESULT_CODE.ACCESS_DENIED_UI.value) {
        return reEnterPassword()
    }

    /** 服务端不存在token */
    if (result === CONST.RESULT_CODE.ACCESS_DENIED_SERVER.value) {
        console.log('服务端不存在token')
        const password = localStorage.getItem('rejiejay-require-assist-password')
        if (password && password !== 'null') {
            return reAuthPassword()
        } else {
            return reEnterPassword()
        }
    }

    /** 服务端token已经过期 */
    if (result === CONST.RESULT_CODE.ACCESS_EXPIRED.value) {
        console.log('服务端token已经过期')
        return reAuthPassword()
    }

    /** token校验失败 */
    if (result === CONST.RESULT_CODE.ACCESS_VERIFY_FAILED.value) {
        const token = localStorage.getItem('rejiejay-require-assist-token')
        console.log(`token(${token})校验失败`)
        if (token && token !== 'null') {
            return reAuthPassword()
        } else {
            return reEnterPassword()
        }
    }

    /** 不存在此用户 */
    if (result === CONST.RESULT_CODE.ACCESS_USER_FAILED.value) {
        console.log('不存在此用户，授权流程执行完毕;')
        return errorHandle(consequencer.error('不存在此用户，授权流程执行完毕;'))
    }

    /** 授权数据库发生错误 */
    if (result === CONST.RESULT_CODE.ACCESS_HANDLE_FAILED.value) {
        console.log('授权数据库发生错误，授权流程执行完毕;')
        return errorHandle(consequencer.error('授权数据库发生错误，授权流程执行完毕;'))
    }
}

/**
 * 含义: 输入密码重新授权
 */
const reEnterPassword = async() => {
    console.log('本地缓存密码已经失效, 开始重新输入密码;');
    toast.destroy()

    const inputHandle = password => {
        window.fetch(`${config.origin}user/login?name=rejiejay&password=${password}`, {
            method: 'GET',
            headers: initHeaders()
        }).then(
            response => response.json(),
            error => ({
                result: 233,
                data: null,
                message: error
            })
        ).then(
            ({
                data
            }) => {
                console.log(`密码授权成功，获得新凭证${data}；执行进入原请求流程`);

                localStorage.setItem('rejiejay-require-assist-token', data)
                localStorage.setItem('rejiejay-require-assist-password', password)

                inputPopUpDestroy()
                reRequestHandle(data)
            },
            error => console.log('账号密码授权失败，请再次尝试输入密码；原因: ', error)
        ).catch(
            error => console.log('账号密码授权失败，请再次尝试输入密码；原因: ', error)
        )

    }

    const defaultValue = localStorage.getItem('rejiejay-require-assist-password')

    inputPopUp({
        title: '请输入登录密码?',
        inputHandle,
        mustInput: true,
        defaultValue
    })
}

/**
 * 含义: 根据密码重新登录
 */
const reAuthPassword = () => {
    console.log('根据本地密码开始再次授权流程;');

    const password = localStorage.getItem('rejiejay-require-assist-password')
    toast.destroy()
    window.fetch(`${config.origin}user/login?name=rejiejay&password=${password}`, {
        method: 'GET',
        headers: initHeaders()
    }).then(
        response => response.json(),
        error => ({
            result: 233,
            data: null,
            message: error
        })
    ).then(
        ({
            data
        }) => {
            console.log(`密码授权成功，获得新凭证${data}；执行进入原请求流程`);

            localStorage.setItem('rejiejay-require-assist-token', data)
            localStorage.setItem('rejiejay-require-assist-password', password)

            reRequestHandle(data)
        },
        error => {
            console.log(`此次账号密码授权失败${error}，授权流程执行完毕；`)
            errorHandle(consequencer.error(error))
        }
    ).catch(
        error => {
            console.log(`此次账号密码授权失败${error}，授权流程执行完毕；`)
            errorHandle(consequencer.error(error))
        }
    )
}

/**
 * 含义: 再次请求原请求
 */
const reRequestHandle = () => {
    console.log('执行开始原请求流程')
    toast.show()
    requestConfig.headers = initHeaders()
    window.fetch(requestUrl, requestConfig).then(
        response => response.json(),
        error => consequencer.error(error)
    ).then(
        response => {
            console.log(`原请求流程执行成功, 此次授权流程执行完毕!`)
            toast.destroy()

            if (notHandleResult || response.result === 1) {
                /** 含义: 不自动处理错误 */
                succeedHandle(response)
            } else {
                errorHandle(response)
            }
        },
        error => {
            console.log(`原请求流程执行完毕, 错误${error}，没救了、退出此次授权流程；`)
            toast.destroy()
            errorHandle(consequencer.error(error))
        }
    ).catch(
        error => {
            console.log(`原请求流程执行完毕, 错误${error}，没救了、退出此次授权流程；`)
            toast.destroy()
            errorHandle(consequencer.error(error))
        }
    )
}

export default unAuthHandle