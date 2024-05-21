import { useEffect, useState } from "react";
import CrsModal from "../aoi/CrsModal";
import GlobalModal from "../common/GlobalModal";
import { useAppSelector } from "../hooks/redux-hooks";
import { cartBasinProps } from "../models/page-props";
import {
    CartBasinOpenModalAfterAPiModal,
    CartBasinOpenModalAfterShapeFileModal,
} from "./CartBasinOpenModalAfterCsvShapefile";

const CartBasinModal = (props: cartBasinProps) => {
    const {
        handleCloseHandler,
        csvApiFileData,
        apiCheckBoxes,
        whichFileToOpen,
        openModalAFterUploadModal,
        file,
        // csvApiUnmatchedFileData,
        // csvApiMatchedFileData,
        csvApiFileName,
    } = props;
    const {
        modal: { crsModal },
    } = useAppSelector((state) => state);
    const [state, setState] = useState({
        file_name: "",
        aoi_name: "",
        filter_data: "",
    });
    const { file_name, aoi_name, filter_data } = state;

    const handleStateKey = (obj: { [x: string]: string }) => {
        setState((prev) => ({
            ...prev,
            ...obj,
        }));
    };

    useEffect(() => {
        filter_data &&
            handleCloseHandler(
                { openModalAFterUploadModal: false },
                filter_data
            );
        // eslint-disable-next-line
    }, [filter_data]);
    return (
        <>
            <GlobalModal
                contentClass={whichFileToOpen === 1 ? "shapefile" : "saveAsAoi"}
                show={openModalAFterUploadModal}
                center={true}
                onHide={() =>
                    handleCloseHandler({ openModalAFterUploadModal: false })
                }
            >
                {whichFileToOpen === 1 ? (
                    <CartBasinOpenModalAfterAPiModal
                        csvApiFileData={csvApiFileData}
                        // csvApiMatchedFileData={csvApiMatchedFileData}
                        apiCheckBoxes={apiCheckBoxes}
                        // csvApiUnmatchedFileData={csvApiUnmatchedFileData}
                        handleCloseHandler={handleCloseHandler}
                        csvApiFileName={csvApiFileName}
                    />
                ) : (
                    <CartBasinOpenModalAfterShapeFileModal
                        file={file}
                        handleCloseHandler={handleCloseHandler}
                        handleStateKey={handleStateKey}
                    />
                )}
            </GlobalModal>
            {/* crs modal */}
            {crsModal && (
                <CrsModal
                    file_name={file_name}
                    aoi_name={aoi_name}
                    handleStateKey={handleStateKey}
                />
            )}
        </>
    );
};

export default CartBasinModal;
