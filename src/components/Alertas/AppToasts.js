import { Toast, ToastContainer } from 'react-bootstrap';

const AppToasts = ({
    toasts,
    position,
    removeToast
}) => {
    if (!position)
        position = 'bottom-end';

    return (
        <ToastContainer position={position}>
            {toasts
                ? toasts.map((toast, index) => (
                    <Toast
                        key={index}
                        bg={toast.color ?? "primary"}
                        autohide
                        delay={3000}
                        onClose={() => removeToast(index)}
                    >
                        {
                            toast && toast.title
                                ? (
                                    <Toast.Header>
                                        <svg
                                            className="rounded me-2"
                                            width="20"
                                            height="20"
                                            xmlns="http://www.w3.org/2000/svg"
                                            preserveAspectRatio="xMidYMid slice"
                                            focusable="false"
                                            role="img"
                                        >
                                            <rect
                                                width="100%"
                                                height="100%"
                                                fill={toast.color === 'danger' ? '#dc3545' : '#1b9e3e'}></rect>
                                        </svg>
                                        <div className="fw-bold me-auto">{toast.title}</div>
                                        {
                                            toast.smallText
                                                ? (<small>{toast.smallText}</small>)
                                                : null
                                        }
                                    </Toast.Header>
                                )
                                : null
                        }
                        <Toast.Body>{toast.message}</Toast.Body>
                    </Toast>
                ))
                : null}
        </ToastContainer>
    )
}

export default AppToasts;