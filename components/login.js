import fetch from './async-fetch/fetch.js';
import toast from './toast.js';
import {
    inputPopUp,
    inputPopUpDestroy
} from './input-popup.js';

const showLogInput = (resolve, reject) => {
    const inputHandle = password => {
        fetch.get({
            url: 'user/login',
            query: {
                name: 'rejiejay',
                password: password
            }
        }).then(res => {
            const token = res.data

            localStorage.setItem('rejiejay-require-assist-token', token)
            localStorage.setItem('rejiejay-require-assist-password', password)
            inputPopUpDestroy()
            toast.show('登录成功！')
            resolve()
        }, error => reject(error))
    }

    const defaultValue = localStorage.getItem('rejiejay-require-assist-password')

    inputPopUp({
        title: '请输入登录密码?',
        inputHandle,
        mustInput: true,
        defaultValue
    })
}

const init = () => new Promise((resolve, reject) => {
    let token = localStorage.getItem('rejiejay-require-assist-token')
    let password = localStorage.getItem('rejiejay-require-assist-password')

    if (!token || !password) return showLogInput(resolve, reject)

    fetch.get({
        url: 'user/verify',
        query: {
            verify: token
        },
        hiddenError: true
    }).then(
        ({ data }) => {
            localStorage.setItem('rejiejay-require-assist-token', data)
            resolve()
        },
        error => showLogInput(resolve, reject)
    )
})

export default init