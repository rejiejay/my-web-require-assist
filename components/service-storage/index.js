import fetch from './../async-fetch/fetch.js'
import toast from './../toast.js'
import jsonHandle from './../../utils/json-handle.js'
import consequencer from './../../utils/consequencer.js'

const serviceStorage = {
    getItem: ({
        key,
        hiddenError,
        isArray
    }) => new Promise((resolve, reject) => fetch.get({
        url: 'map/get',
        query: {
            key
        },
        hiddenError
    }).then(
        res => {
            const jsonString = res.data.value
            const verify = jsonHandle.verifyJSONString({
                jsonString,
                isArray
            })

            if (verify.isCorrect) {
                resolve(verify.data)
            } else {
                if (!hiddenError) {
                    toast.destroy()
                    toast.show(verify.msg)
                }
                reject(verify.msg)
            }
        },
        error => reject(error)
    )),

    setItem: ({
        key,
        value,
        hiddenError
    }) => new Promise((resolve, reject) => fetch.post({
        url: 'map/set',
        body: {
            key,
            value: JSON.stringify(value)
        },
        hiddenError
    }).then(
        res => resolve(consequencer.success()),
        error => reject(consequencer.error(error))
    )),

    clearItem: ({
        key,
        hiddenError
    }) => new Promise((resolve, reject) => fetch.get({
        url: 'map/clear',
        query: {
            key
        },
        hiddenError
    }).then(
        res => resolve(consequencer.success()),
        error => reject(consequencer.error(error))
    ))
}

export default serviceStorage