const initHeaders = () => {
    const token = localStorage.getItem('rejiejay-task-assist-token')
    const headers = {
        "Content-Type": 'application/json; charset=utf-8'
    }

    token ? headers['task-assist-token'] = token : null

    return headers
}

export default initHeaders