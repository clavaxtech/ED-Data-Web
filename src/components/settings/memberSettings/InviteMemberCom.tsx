import React from "react";
import {
    InviteMemberFormData,
    InviteMemberSubmitData,
} from "../../models/submit-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { inviteMemberSettingValidationSchema } from "../../../Helper/validation";
import { InviteMemberComProps } from "../../models/page-props";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { inviteMembers } from "../../store/actions/members-setting-actions";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import InputComponent from "../../common/InputComponent";
import RadioInputComponent from "../../common/RadioInputComponent";

const InviteMemberCom = ({
    inviteMemberCancelBtnClick,
    allowed_sub_user,
}: InviteMemberComProps) => {
    const {
        auth: {
            isAuthenticated,
            userTokenLoading,
            user: {
                access_token,
                company_data: { company_id },
            },
        },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<InviteMemberFormData>({
        defaultValues: {
            invite_as: "2",
        },
        resolver: yupResolver(inviteMemberSettingValidationSchema),
    });
    const inviteUserOnSubmit = (data: InviteMemberFormData) => {
        let transformData: InviteMemberSubmitData = {
            ...data,
            company: company_id as number,
        };
        if (isAuthenticated && !userTokenLoading) {
            dispatch(inviteMembers(access_token, transformData)).then(
                (result) => {
                    const { msg, status } = result || {};
                    if (status === 200) {
                        toast.success(msg);
                        reset();
                        inviteMemberCancelBtnClick();
                    } else {
                        toast.error(msg);
                    }
                }
            );
        }
    };
    return (
        <form onSubmit={handleSubmit(inviteUserOnSubmit)}>
            <div className="invite-new-member">
                <h3>Invite new member</h3>
                <p className="mb-4">
                    {`If you require more than ${Number(
                        allowed_sub_user
                    )} sub-users, please contact Energy Domain sales at : `}
                    <Link
                        to={`mailto:sales@energydomain.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        sales@energydomain.com
                    </Link>{" "}
                </p>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <InputComponent
                                label="First Name"
                                name="first_name"
                                register={register}
                                errorMsg={errors.first_name?.message}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <InputComponent
                                label="Last Name"
                                name="last_name"
                                register={register}
                                errorMsg={errors.last_name?.message}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <InputComponent
                                label="Email"
                                name="email"
                                register={register}
                                errorMsg={errors.email?.message}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Role</label>
                            <div className="role">
                                <div className="form-check">
                                    <RadioInputComponent
                                        value={"1"}
                                        name={"invite_as"}
                                        register={register}
                                    />
                                </div>
                                <h2>Admin</h2>
                                <p>
                                    Full account access, including billing, plan
                                    information, and member management.
                                </p>
                            </div>
                            <div className="role">
                                <div className="form-check">
                                    <RadioInputComponent
                                        value={"2"}
                                        name={"invite_as"}
                                        register={register}
                                    />
                                </div>
                                <h2>Member</h2>
                                <p>
                                    Full access to Energy Domain Data. No access
                                    to billing, plan information, or team
                                    management.
                                </p>
                            </div>
                            <span className={`error`}>
                                {errors.invite_as?.message}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                            inviteMemberCancelBtnClick();
                        }}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Invite Member
                    </button>
                </div>
            </div>
        </form>
    );
};

export default InviteMemberCom;
