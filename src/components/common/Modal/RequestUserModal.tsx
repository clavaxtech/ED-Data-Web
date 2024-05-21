import React from "react";
import GlobalModal from "../GlobalModal";
import InputComponent from "../InputComponent";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { requestMoreSeatValidation } from "../../../Helper/validation";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { requestMoreSeat } from "../../store/actions/members-setting-actions";
import { ADMIN, ADMIN_CONSTANT, MEMBER_CONSTANT } from "../../../utils/helper";

type FormData = { seatNumber: string }

function RequestUserModal({ show, handleClose }: { show: boolean, handleClose: () => void, }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(requestMoreSeatValidation),
    });
    const dispatch = useAppDispatch();
    const {
        auth: {
            user: {
                access_token,
                first_name,
                last_name,
                signin_as,
                company_data: { billing_email }
            },
        },
    } = useAppSelector((state) => state);
    if (!show) {
        return <></>
    }
    const onHide = () => {
        reset()
        handleClose()
    }
    const onSubmit = (data: FormData) => {
        let msg = `User: ${first_name} ${last_name}\nEmail: ${billing_email}\nRequest Number of Seats: ${data.seatNumber} \nAccount Level: ${signin_as === ADMIN ? ADMIN_CONSTANT : MEMBER_CONSTANT}\nThis user has requested more seats. Please reach out to them promptly to discuss their needs and upgrade options.`
        dispatch(requestMoreSeat(access_token, `${msg}`)).then(res => {
            const { status } = res
            if (status === 200) {
                onHide()
            }
        })
        // onHide()
    }
    return (
        <>
            <GlobalModal
                contentClass="request-additional-modal"
                center={true}
                show={show}
                onHide={onHide}
            >
                <form
                    className="form-block"
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                    autoCapitalize="off"
                >
                    <div className="content-block">
                        <h2 className="heading-block">Request Additional Seats</h2>
                        <div className="text-block">
                            <p className="aoilist">
                                We're excited to help you expand your team's access! Please enter the number of additinal seaths you need below.
                            </p>
                        </div>

                        <div className="row">
                            <div className="col-md-8">
                                <div className="form-group">
                                    <label>Number of Additional Seats</label>
                                    <InputComponent
                                        name="seatNumber"
                                        placeholder="Enter number"
                                        type="number"
                                        register={register}
                                        errorMsg={errors.seatNumber?.message}
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="italicText">After you send your request, our team will contact you to finalize the details.</p>
                        <br />
                        <div className="actions">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={onHide}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary green-bg"
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                </form >
            </GlobalModal >
        </>
    );
}

export default RequestUserModal;
