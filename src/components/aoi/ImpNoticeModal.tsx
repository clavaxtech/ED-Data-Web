import React, { ReactNode } from "react";
import GlobalModal from "../common/GlobalModal";
import { useAppSelector } from "../hooks/redux-hooks";

function ImpNoticeModal({
    contentClass,
    content,
    footerContent,
    heading,
    handleClose,
}: {
    contentClass: string;
    content: ReactNode;
    footerContent: ReactNode;
    heading?: string;
    handleClose: () => void;
}) {
    const {
        modal: { impNoticeModal },
    } = useAppSelector((state) => state);
    return (
        <GlobalModal
            contentClass={contentClass}
            // contentClass="reupload-important-notice-modal"
            center={true}
            show={impNoticeModal}
            onHide={handleClose}
        >
            <div className="content-block">
                {heading && <h2 className="text-center">{heading}</h2>}
                <div className="text-block">{content}</div>

                <div className="actions">{footerContent}</div>
            </div>
        </GlobalModal>
    );
}

export default ImpNoticeModal;
