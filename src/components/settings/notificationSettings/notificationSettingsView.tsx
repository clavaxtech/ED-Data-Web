import { useEffect, useLayoutEffect } from "react";
import withSideNav from "../../HOC/withSideNav";
import { NotificationSettingsViewProps } from "../../models/page-props";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
    fetchNotificationSettingsDetails,
    fetchNotificationSettingsOption,
    notificationSettingsActions,
    saveNotificationSettingsOption,
} from "../../store/actions/notification-settings-actions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { notificationSettingsValidation } from "../../../Helper/validation";
import {
    NotificationSubmitFormData,
    saveNotificationOptionsFormData,
} from "../../models/submit-form";
import { setFormData } from "../../../utils/helper";
import { toast } from "react-toastify";
import NotificationList from "../../common/NotificationList";
import Scrollbars from "react-custom-scrollbars";
const NotificationSettingsView = (props: NotificationSettingsViewProps) => {
    const dispatch = useAppDispatch();
    const {
        auth: {
            isAuthenticated,
            userTokenLoading,
            user: { access_token },
        },
        notificationSettings: {
            notificationOptions,
            notificationDetails,
            notificationDetailsLoading,
        },
    } = useAppSelector((state) => state);

    const { register, handleSubmit, setValue, watch } =
        useForm<NotificationSubmitFormData>({
            resolver: yupResolver(notificationSettingsValidation),
        });

    const onSubmit = (data: NotificationSubmitFormData) => {
        let transformData: saveNotificationOptionsFormData["data"] = [];
        if (
            Array.isArray(notificationOptions) &&
            Array.isArray(data.notification)
        ) {
            data?.notification?.forEach((item, index) =>
                transformData.push({
                    event_id: notificationOptions[index].id,
                    is_in_app: item.is_in_app ? 1 : 0,
                    is_email: item.is_email ? 1 : 0,
                })
            );
        }
        if (isAuthenticated && !userTokenLoading) {
            dispatch(
                saveNotificationSettingsOption(access_token, transformData)
            ).then((result) => {
                const { status, msg } = result || {};
                if (status === 200) {
                    toast.success(msg);
                    dispatch(
                        notificationSettingsActions.clearNotificationDetails()
                    );
                } else {
                    toast.error(msg);
                }
            });
        }
    };

    const setFormValue = () => {
        if (notificationDetails && notificationOptions) {
            let tempFormData: NotificationSubmitFormData["notification"] = [];
            notificationOptions?.forEach((item) => {
                let tempObject = notificationDetails.filter(
                    (_item) => _item.event === item.id
                );
                if (tempObject.length > 0) {
                    tempFormData.push({
                        ...(!tempObject[0].is_in_app && !tempObject[0].is_email
                            ? { none: true }
                            : { none: false }),
                        is_email: tempObject[0].is_email,
                        is_in_app: tempObject[0].is_in_app,
                    });
                } else {
                    tempFormData.push({
                        none: false,
                        is_email: true,
                        is_in_app: true,
                    })
                }
            });
            setFormData(
                {
                    notification: tempFormData,
                },
                setValue
            );
        } else {
            if (notificationOptions && !notificationDetails) {
                let temp: NotificationSubmitFormData["notification"] = [];
                for (let i = 0; i < notificationOptions.length; i++) {
                    temp.push({
                        none: false,
                        is_email: true,
                        is_in_app: true,
                    });
                }
                setFormData({ notification: temp }, setValue);
            }
        }
    };

    const onCancelBtnClick = () => {
        setFormValue();
    };

    useLayoutEffect(() => {
        if (isAuthenticated && !userTokenLoading) {
            dispatch(fetchNotificationSettingsOption(access_token));
        }
        // eslint-disable-next-line
    }, [isAuthenticated, userTokenLoading, access_token]);

    useLayoutEffect(() => {
        if (
            notificationDetailsLoading &&
            isAuthenticated &&
            !userTokenLoading
        ) {
            dispatch(fetchNotificationSettingsDetails(access_token));
        }
        // eslint-disable-next-line
    }, [
        notificationDetailsLoading,
        isAuthenticated,
        userTokenLoading,
        access_token,
    ]);

    useEffect(() => {
        setFormValue();
        // eslint-disable-next-line
    }, [notificationDetails, notificationOptions]);
    return (
        <div className="settingsWrapper">
            <form
                className="form-block"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                autoCapitalize="off"
            >
                <div className="settingInside">
                    <Scrollbars
                        className='settingsWrapper-scroll'
                        autoHeightMin={0}
                        renderThumbVertical={props => < div {...props} className="thumb-vertical" />}
                        renderTrackVertical={props => < div {...props} className="track-vertical" />}
                    >
                        <div className="settingWrapperInner">
                            <div className="item">
                                <h3>Notifications</h3>
                                <p>Manage your company name, logo and information</p>
                                <div className="notificationList">
                                    <ul>
                                        <NotificationList
                                            notificationOptions={
                                                Array.isArray(notificationOptions)
                                                    ? notificationOptions
                                                    : []
                                            }
                                            watch={watch}
                                            register={register}
                                            nameKey="notification"
                                            setValue={setValue}
                                        />
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Scrollbars>
                </div>
                <div className="button-action bottom-fixed">
                    <button type="submit" className="btn btn-primary">
                        {notificationDetails === null ? "Save" : "Update"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={onCancelBtnClick}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default withSideNav(NotificationSettingsView);
