import consequencer from './../../utils/consequencer.js';

import toast from './../toast.js';

import config from './config.js';
import initHeaders from './headers.js';
import queryToUrl from './url-handle.js';

import unAuthHandle from './auth-handle.js';

/** 
 * 含义: 堆栈请求的Promise
 * 注意: 因为解决了并发问题; 所以当前值一定是唯一的
 */
let asyncResolve = null
let asyncReject = null

/** 
 * 含义: 当前的Promise
 * 注意: 因为解决了并发问题; 所以当前值一定是唯一的
 */
let requestResolve = null
let requestReject = null

export let hiddenError = false
export let notHandleResult = false

export let requestUrl = false
export let requestConfig = false

export const requestHandle = ({
    method,
    parameter,
    resolve,
    reject
}) => {
    asyncResolve = resolve
    asyncReject = reject

    hiddenError = parameter.hiddenError ? true : false
    notHandleResult = parameter.notHandleResult ? true : false

    requestConfig = {
        method: method.toLocaleUpperCase(),
        headers: initHeaders()
    }
    requestUrl = `${config.origin}${parameter.url}`
    if (method === 'get') requestUrl += queryToUrl(parameter.query)
    if (method === 'post') requestConfig.body = JSON.stringify(parameter.body)

    toast.show()

    return new Promise((res, rej) => {
        requestResolve = res;
        requestReject = rej;

        window.fetch(requestUrl, requestConfig).then(
            response => response.json(),
            error => consequencer.error(error)
        ).then(
            response => responseHandle(response),
            error => errorHandle(error)
        )
    }).catch(error => {
        asyncReject(consequencer.error(error))
    });
}

export const responseHandle = response => {
    if (!response) return errorHandle(consequencer.error('数据格式不正确, 数据为空!'))
    if (config.deniedCodes.find(code => code === response.result)) return unAuthHandle(response);
    if (notHandleResult || response.result === 1) {
        /** 含义: 不自动处理错误 */
        succeedHandle(response)
    } else {
        errorHandle(response)
    }
}

export const succeedHandle = result => {
    toast.destroy()
    asyncResolve(result)
    requestResolve(result)
}

export const errorHandle = result => {
    toast.destroy()

    hiddenError ? '' : toast.show(result.message)

    asyncReject(result) /** 顺序: 优先返回请求数据, 再处理堆栈 */
    requestReject(result)
}