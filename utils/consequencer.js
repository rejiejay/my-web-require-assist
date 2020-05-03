const consequencer = {
    success: (data, message) => ({
        result: 1,
        data: data || null,
        message: message || 'success'
    }),
    error: (message, result, data) => ({
        result: result || 0,
        data: data || null,
        message: message
    })
}

export default consequencer