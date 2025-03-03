const Notification = ({ message, error }) => {

    if (!message) {
        return (<></>)
    }

    const notificationStyle = {
        color: error ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 6,
        padding: 10,
        margin: 10
    }

    return (
        <div style={notificationStyle}>
            {message}
        </div>
    )
}
export default Notification

