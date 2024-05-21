import React, { useEffect, useLayoutEffect } from "react";
import { aoiNotiValidation } from "../../Helper/validation";
import { AoiNotiFormData } from "../models/submit-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NotificationList from "../common/NotificationList";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    aoiActions,
    clearAoiNameSelForEdit,
    clearAoiNotiData,
    getAoiNotiData,
    setAoiNameSelForEdit,
    setAoiNotiData,
    toggleSettDrawer,
    updateAoiName,
    updateAoiNotiData,
} from "../store/actions/aoi-actions";
import { toast } from "react-toastify";

const SettingsSidebar = () => {
    const {
        aoi: {
            toggleSettingDrawer,
            aoiNameSelForEdit: { aoi_name, aoi_id },
            savedAoiData,
            max_allowed_aoi,
            aoiNotiData,
            aoiNotiDataLoading,
        },
        auth: {
            user: { access_token },
        },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const { register, watch, setValue, handleSubmit } =
        useForm<AoiNotiFormData>({
            resolver: yupResolver(aoiNotiValidation),
        });
    const handleBlurChange = (
        e: React.FocusEvent<HTMLInputElement, Element>
    ) => {
        const { value } = e.target;
        if (!value) {
            (document.getElementById("aoi_name") as HTMLInputElement).value =
                aoi_name;
            return;
        }

        dispatch(updateAoiName(access_token, { aoi_id, aoi_name: value })).then(
            (res) => {
                const { status, msg } = res;
                if (status === 200) {
                    toast.success(msg);

                    dispatch(
                        aoiActions.fetchAoiList({
                            data: savedAoiData.map((item) =>
                                Object.assign(
                                    { ...item },
                                    {
                                        ...(item.id === aoi_id && {
                                            aoi_name: value,
                                        }),
                                    }
                                )
                            ),
                            max_allowed_aoi,
                        })
                    );
                    dispatch(setAoiNameSelForEdit({ aoi_id, aoi_name: value }));
                } else {
                    toast.error(msg);
                }
            }
        );
    };

    const setFormValue = () => {
        setValue(
            "notification_settings",
            aoiNotiData.map((item) => ({
                none: !item.is_email && !item.is_in_app ? true : false,
                is_email: item.is_email,
                is_in_app: item.is_in_app,
            }))
        );
    };

    const onCancelBtnClick = () => {
        setFormValue();
    };

    const onSubmit = (data: AoiNotiFormData) => {
        let tempData = aoiNotiData.map((item, index) => ({
            ...item,
            is_email: data.notification_settings[index].is_email,
            is_in_app: data.notification_settings[index].is_in_app,
        }));
        if (JSON.stringify(tempData) === JSON.stringify(aoiNotiData)) {
            toast.info("No changes detected.");
            return;
        }
        dispatch(
            updateAoiNotiData(
                access_token,
                { notification_settings: tempData },
                aoi_id
            )
        ).then((res) => {
            const { status, msg } = res;
            if (status === 200) {
                toast.success(msg);
                dispatch(setAoiNotiData(tempData));
            } else {
                toast.error(msg);
            }
        });
    };

    useLayoutEffect(() => {
        if (aoiNotiDataLoading && aoi_id)
            dispatch(getAoiNotiData(access_token, aoi_id));
        // eslint-disable-next-line
    }, [aoiNotiDataLoading, aoi_id]);

    useEffect(() => {
        if (aoiNotiData.length > 0) {
            setFormValue();
        }
        // eslint-disable-next-line
    }, [aoiNotiData]);

    return (
        <>
            <div
                className={
                    toggleSettingDrawer
                        ? "settingsSidebarCon show"
                        : "settingsSidebarCon"
                }
            >
                <div className="header">
                    Settings{" "}
                    <span
                        onClick={() => {
                            dispatch(clearAoiNotiData());
                            dispatch(clearAoiNameSelForEdit());
                            dispatch(toggleSettDrawer());
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </span>
                </div>
                <div className="settingform scrollSection">
                    <div className="generalsettings">
                        <div className="aoiname">
                            <h3>AOI Name</h3>
                            <label>Edit your aoi name</label>
                        </div>
                        <div className="row form-row aoi-county">
                            <div className="col-md-">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter AOI name"
                                        defaultValue={aoi_name}
                                        className="form-control"
                                        name="aoi_name"
                                        id="aoi_name"
                                        onBlur={handleBlurChange}
                                    />
                                </div>
                            </div>
                        </div>
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
                                notificationOptions={aoiNotiData.map(
                                    (item) => ({
                                        name: item.notification_type_label,
                                    })
                                )}
                                watch={watch}
                                setValue={setValue}
                                register={register}
                                nameKey="notification_settings"
                            />
                            <div className="button-action">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {aoiNotiData.filter(
                                        (item) =>
                                            !item.is_email && !item.is_in_app
                                    ).length === aoiNotiData.length
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

                            {/* <div className="noti-top">
                                <h3>Metrics</h3>
                                <p>
                                    Select the top 4 data points to display on
                                    your AOI
                                </p>
                            </div>
                            <div className="row form-row">
                                <label>Data 1</label>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <div className="selectInputdropDown">
                                            <select>
                                                <option value="Wells">
                                                    Wells
                                                </option>
                                                <option value="Wells">
                                                    Wells
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <div className="selectInputdropDown">
                                            <select>
                                                <option value="Wells">
                                                    Total
                                                </option>
                                                <option value="Wells">
                                                    Total
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row form-row">
                                <label>Data 2</label>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <div className="selectInputdropDown">
                                            <select>
                                                <option value="Wells">
                                                    Operators
                                                </option>
                                                <option value="Wells">
                                                    Operators
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <div className="selectInputdropDown">
                                            <select>
                                                <option value="Wells">
                                                    New
                                                </option>
                                                <option value="Wells">
                                                    Wells
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row form-row">
                                <label>Data 3</label>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <div className="selectInputdropDown">
                                            <select>
                                                <option value="Wells">
                                                    Permits
                                                </option>
                                                <option value="Wells">
                                                    Wells
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <div className="selectInputdropDown">
                                            <select>
                                                <option value="Wells">
                                                    Total
                                                </option>
                                                <option value="Wells">
                                                    Wells
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsSidebar;
