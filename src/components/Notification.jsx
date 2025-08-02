const Notification = ({ message, type }) => {
  if (message === null && type === null) {
    return null;
  }

  if (type === 'error') {
    return <div className="error">{message}</div>
  }
    return <div className="success">{message}</div>
};

export default Notification;
