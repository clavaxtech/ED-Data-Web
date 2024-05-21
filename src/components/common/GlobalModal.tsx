import Modal from "react-bootstrap/Modal";
import { modalProps } from "../models/page-props";

const GlobalModal = (props: modalProps) => {
    let {
        show,
        title,
        children,
        enableFooter,
        center,
        modalSize,
        footRender,
        contentClass,
        headerClass,
        bodyClass,
        footerClass,
        titleClass,
        onHide,
    } = props;

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                centered={center}
                size={modalSize}
                className={contentClass}
            >
                {title && (
                    <Modal.Header className={headerClass} closeButton>
                        <Modal.Title className={titleClass}>
                            {title}
                        </Modal.Title>
                    </Modal.Header>
                )}
                {children && (
                    <Modal.Body className={bodyClass}>{children}</Modal.Body>
                )}
                {enableFooter && (
                    <Modal.Footer className={footerClass}>
                        {footRender}
                    </Modal.Footer>
                )}
            </Modal>
        </>
    );
};

export default GlobalModal;
