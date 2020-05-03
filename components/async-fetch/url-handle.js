const queryToUrl = query => {
    if (!query) return ''

    const keys = Object.keys(query)
    if (keys.length <= 0) return ''

    let url = '?'
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index]
        const value = query[key]
        url += `${key}=${value}`
        url += index !== (keys.length - 1) ? '&' : ''
    }

    return url
}

export default queryToUrl