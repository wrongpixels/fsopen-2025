const notification = (message = '') =>
    ({
            type: 'SET_NOTIFICATION',
            payload: message
        }
    )
export const resetNotification = (dispatch) => {
    dispatch({ type: 'RESET_NOTIFICATION' })
}

let currentTimeOut = null

export const setNotification = (dispatch, message = '', time = 5) => {
    if (currentTimeOut) {
        clearTimeout(currentTimeOut)
    }
    dispatch(notification(message))
   currentTimeOut = setTimeout(() => resetNotification(dispatch), time*1000)
}

export const formatTitle = (message) => {
    if (message.length > 70)
    {
        message = `${message.substring(0,70)}...`
    }
    return `'${message}'`
}

