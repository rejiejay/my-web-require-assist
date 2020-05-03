import {
    requestHandle
} from './request-handle.js'

/**
 * 含义: 请求的堆栈
 * 作用: 保持请求顺序执行, 防止出现并发
 */
const requestCacheStack = []

/**
 * 含义: 是否正在处理请求堆栈
 * 作用: 保持请求顺序执行, 防止出现并发
 */
let isAsyncHandle = false

const requestByMethod = (method, parameter) => new Promise((resolve, reject) => {
    requestCacheStack.push({
        method,
        parameter,
        resolve,
        reject
    })
    asyncRequestHandle()
})

/**
 * 含义: 执行并且处理请求的堆栈
 * 作用: 保持请求顺序执行, 防止出现并发
 * 策略: 函数每次调用判断是否有正在执行的方法, 如何存在正在执行的方法, 那么此次调用即可作废
 * 策略: 每次await后都判断堆栈是否完成, 如果未完成则循环调用自身
 */
const asyncRequestHandle = async () => {
    if (isAsyncHandle) return console.log('注意出现并发请求;')
    if (requestCacheStack.length === 0) return /** 含义: 处理完成所有请求 */

    /** 含义: 开始处理请求 */
    const {
        method,
        parameter,
        resolve,
        reject
    } = requestCacheStack[0]
    isAsyncHandle = true
    await requestHandle({
        method,
        parameter,
        resolve,
        reject
    })

    /** 含义: 表明处理完成 */
    isAsyncHandle = false
    requestCacheStack.shift()

    if (requestCacheStack.length > 0) {
        /** 含义: 判断是否需要继续处理 */
        asyncRequestHandle()
    }
}

const fetch = {
    get: ({
        url,
        query,
        hiddenError,
        notHandleResult
    }) => requestByMethod('get', {
        url,
        query,
        hiddenError,
        notHandleResult
    }),
    post: ({
        url,
        body,
        hiddenError,
        notHandleResult
    }) => requestByMethod('post', {
        url,
        body,
        hiddenError,
        notHandleResult
    })
}

export default fetch