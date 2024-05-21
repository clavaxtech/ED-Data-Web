import React, { useEffect, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { AoiGenTabNotiFormData } from "../models/submit-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { aoiGenTabNotiValidation } from "../../Helper/validation";
import NotificationList from "../common/NotificationList";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    getAoiNotiData,
    setAoiGenTabNotiData,
    updateAoiNotiData,
} from "../store/actions/aoi-actions";
import { toast } from "react-toastify";

function GenAoiSettTabContent() {
    const { register, watch, setValue, handleSubmit } =
        useForm<AoiGenTabNotiFormData>({
            resolver: yupResolver(aoiGenTabNotiValidation),
        });

    const dispatch = useAppDispatch();

    const {
        auth: {
            user: { access_token },
        },
        aoi: { aoi_tab_index, aoiGenTabNotiDataLoading, aoiGenTabNotiData },
    } = useAppSelector((state) => state);

    const setFormValue = () => {
        setValue(
            "notification",
            aoiGenTabNotiData.map((item) => ({
                none: !item.is_email && !item.is_in_app ? true : false,
                is_email: item.is_email,
                is_in_app: item.is_in_app,
            }))
        );
    };

    const onCancelBtnClick = () => {
        setFormValue();
    };

    const onSubmit = (data: AoiGenTabNotiFormData) => {
        let tempData = aoiGenTabNotiData.map((item, index) => ({
            ...item,
            is_email: data.notification[index].is_email,
            is_in_app: data.notification[index].is_in_app,
        }));
        if (JSON.stringify(tempData) === JSON.stringify(aoiGenTabNotiData)) {
            toast.info("No changes detected.");
            return;
        }
        dispatch(
            updateAoiNotiData(access_token, { notification_settings: tempData })
        ).then((res) => {
            const { status, msg } = res;
            if (status === 200) {
                toast.success(msg);
                dispatch(setAoiGenTabNotiData(tempData));
            } else {
                toast.error(msg);
            }
        });
    };

    useLayoutEffect(() => {
        if (aoi_tab_index === 2 && aoiGenTabNotiDataLoading) {
            dispatch(getAoiNotiData(access_token));
        }
        // eslint-disable-next-line
    }, [aoi_tab_index, aoiGenTabNotiDataLoading]);

    useEffect(() => {
        if (aoiGenTabNotiData.length > 0) {
            setFormValue();
        }
        // eslint-disable-next-line
    }, [aoiGenTabNotiData]);
    return (
        <div
            className={aoi_tab_index === 2 ? "tab-pane fade" : "d-none"}
            id="gs"
            role="tabpanel"
            aria-labelledby="gs-tab"
        >
            <div className="tabBlockContent">
                <div className="generalsettings">
                    <div className="noti-top">
                        <h3>Notifications</h3>
                        <p>
                            Select the default notification settings when
                            creating new AOIs
                        </p>
                    </div>
                    <form
                        className="form-block"
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete="off"
                        autoCapitalize="off"
                    >
                        <NotificationList
                            notificationOptions={aoiGenTabNotiData.map(
                                (item) => ({
                                    name: item.notification_type_label,
                                })
                            )}
                            watch={watch}
                            setValue={setValue}
                            register={register}
                            nameKey="notification"
                        />

                        <div className="button-action">
                            <button type="submit" className="btn btn-primary">
                                {aoiGenTabNotiData.filter(
                                    (item) => !item.is_email && !item.is_in_app
                                ).length === aoiGenTabNotiData.length
                                    ? "Save"
                                    : "Update"}
                            </button>
                            &nbsp; &nbsp;
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={onCancelBtnClick}
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="noti-top">
                            <h3>Sharing Settings</h3>
                            <p>Select the default settings for sharing AOIs</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default GenAoiSettTabContent;
