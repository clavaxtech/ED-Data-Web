import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import withSideNav from "../../HOC/withSideNav";
import {
    MySettingsViewProps,
    MysettingbasicInfo,
} from "../../models/page-props";
import { mySettingBasicInfoValidationSchema } from "../../../Helper/validation";
import { useEffect, useState } from "react";
import MediaUploader from "../../common/MediaUploader";
import { toast } from "react-toastify";
import ImageCropperModal from "../../common/Modal/ImageCropperModal";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
    hideImageCropperModal,
    showImageCropperModal,
} from "../../store/actions/modal-actions";
import {
    mySettingActions,
    removeProfilePic,
    uploadProfilePic,
} from "../../store/actions/my-setting-actions";
import { authActions, logout } from "../../store/actions/auth-actions";
import {
    fetchProfileDetail,
    updateProfileDetail,
} from "../../store/actions/my-setting-actions";
import { removeNullOrEmptyValue, setFormData } from "../../../utils/helper";
import { DeactivateRemoveUsers } from "../../store/actions/members-setting-actions";
import DeleteConfirmationModal from "../../common/Modal/DeleteConfirmationModal";
import InputComponent from "../../common/InputComponent";
import Scrollbars from "react-custom-scrollbars";

const MySettingsView = (props: MySettingsViewProps) => {
    const dispatch = useAppDispatch();
    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<MysettingbasicInfo>({
        resolver: yupResolver(mySettingBasicInfoValidationSchema),
    });
    const {
        modal: { image_cropper_show },
        auth: { isAuthenticated, userTokenLoading, user },
        mySettings: { ProfileSettingUser, profileFetchDetailsLoading },
    } = useAppSelector((state) => state);

    const [state, setState] = useState({
        fileUrl: "",
        showDeleteModal: false,
        showRemoveAccountConformationModal: false,
    });

    const { fileUrl, showDeleteModal, showRemoveAccountConformationModal } =
        state;
    const { access_token, user_id } = user;

    const hideProfilePicDeleteModal = () => {
        setState((prev) => ({ ...prev, showDeleteModal: !showDeleteModal }));
    };

    const removeProfilePhoto = () => {
        if (isAuthenticated && !userTokenLoading) {
            if (user.profile_pic) {
                dispatch(removeProfilePic(user.access_token)).then((result) => {
                    const { msg, status } = result || {};
                    if (status === 200) {
                        dispatch(
                            authActions.loadUser({
                                ...user,
                                profile_pic: null,
                            })
                        );
                        toast.success(msg);
                    } else {
                        toast.error(msg);
                    }
                });
            }
            setState((prev) => ({ ...prev, showDeleteModal: false }));
        }
    };

    const handleChange = (acceptedFiles: Blob | Blob[]) => {
        if (!Array.isArray(acceptedFiles)) {
            if (acceptedFiles?.size > 5 * 1024 * 1024) {
                toast.error(`Company logo size is greater than 5 MB.`);
                return;
            }
            const fileUrl = URL.createObjectURL(acceptedFiles);
            setState((prev) => ({ ...prev, fileUrl: fileUrl }));
            dispatch(showImageCropperModal(acceptedFiles?.name));
        }
    };

    const uploadProfileLogo = async (file: string) => {
        if (isAuthenticated && !userTokenLoading) {
            await dispatch(
                uploadProfilePic(user.access_token, {
                    image_file: file,
                })
            ).then((result) => {
                const { file_name, msg, status } = result || {};
                if (status === 200) {
                    setState((prev) => ({ ...prev, fileUrl: "" }));
                    dispatch(
                        authActions.loadUser({
                            ...user,
                            profile_pic: file_name,
                        })
                    );
                    toast.success(msg);
                } else {
                    toast.error(msg);
                }
            });
        }
        dispatch(hideImageCropperModal());
    };

    const saveCropImage = (file: string) => {
        uploadProfileLogo(file);
    };

    const handleClose = () => {
        dispatch(hideImageCropperModal());
        setState((prev) => ({ ...prev, fileName: "", fileUrl: "" }));
    };

    const onSubmit = (data: MysettingbasicInfo) => {
        let transformData = data;
        removeNullOrEmptyValue(transformData);
        transformData.confirmPassword &&
            delete transformData["confirmPassword"];
        if (isAuthenticated && !userTokenLoading) {
            dispatch(updateProfileDetail(access_token, transformData))
                .then((result) => {
                    let { msg, status } = result;
                    if (status === 200) {
                        if (transformData.password) {
                            sessionStorage.setItem(
                                "passwordUpdateMsg",
                                `Profile updated successfully.Now you will be logged out, and need to log back in.`
                            );
                            dispatch(logout(access_token));
                        } else {
                            dispatch(
                                authActions.loadUser({
                                    ...user,
                                    first_name: transformData.first_name,
                                    last_name: transformData.last_name,
                                })
                            );
                            dispatch(
                                mySettingActions.clearProfileSettingDetail()
                            );
                            toast.success(msg);
                        }
                    } else {
                        toast.error(msg);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleCloseRemoveAccountConformationModal = () =>
        setState((prev) => ({
            ...prev,
            showRemoveAccountConformationModal:
                !showRemoveAccountConformationModal,
        }));

    const onRemoveBtnClick = () => {
        dispatch(
            DeactivateRemoveUsers(access_token, {
                user_id: user_id as number,
                delete_type: "all",
            })
        ).then((result) => {
            const { status, msg } = result || {};
            if (status === 200) {
                console.log({ msg });
                sessionStorage.setItem(
                    "accountRemoveOrDeactivateMsg",
                    `${msg}`
                );
                dispatch(logout(access_token));
            } else {
                toast.error(msg);
            }
        });
    };

    useEffect(() => {
        if (
            profileFetchDetailsLoading &&
            isAuthenticated &&
            !userTokenLoading
        ) {
            dispatch(fetchProfileDetail(access_token)).then((result) => {
                const { msg, status } = result || {};
                if (status === 200) {
                } else {
                    toast.error(msg);
                }
            });
        }
        // eslint-disable-next-line
    }, [profileFetchDetailsLoading, isAuthenticated, userTokenLoading]);

    const onCancelClickBtn = () => {
        reset();
        if (ProfileSettingUser.id) {
            setFormData(ProfileSettingUser, setValue);
            return;
        }
    };

    useEffect(() => {
        reset();
        setFormData(ProfileSettingUser, setValue);
        // eslint-disable-next-line
    }, [ProfileSettingUser]);

    return (
        <div className="settingsWrapper">
            <form
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
                                <h3>My Settings</h3>
                                <p>Manage your company name, logo and information</p>
                            </div>
                            <div className="item">
                                <h3 className="mb-4">Basic Information</h3>
                                <div className="basic-info">
                                    <div className="profile-photo-block">
                                        <label>Profile photo</label>
                                        <div className="profile-upload-photo">
                                            {!user.profile_pic ? (
                                                <MediaUploader
                                                    className="update-photo"
                                                    accept={["JPEG", "PNG", "JPG"]}
                                                    handleChange={handleChange}
                                                    name="profilePic"
                                                    control={control}
                                                    multiple={false}
                                                >
                                                    <div>
                                                        <figure>
                                                            <img
                                                                src={
                                                                    "images/profile-pic.png"
                                                                }
                                                                alt="profile-pic"
                                                            />
                                                        </figure>
                                                        {!user.profile_pic && (
                                                            <button
                                                                type="button"
                                                                className="upload-btn"
                                                            >
                                                                Upload photo
                                                            </button>
                                                        )}
                                                    </div>
                                                </MediaUploader>
                                            ) : (
                                                <figure>
                                                    <img
                                                        src={`${process.env.REACT_APP_ED_DATA_CDN_API}/profile_pic/${user.profile_pic}`}
                                                        alt="profile-pic"
                                                    />
                                                </figure>
                                            )}
                                            {user.profile_pic && (
                                                <span
                                                    className="removeProfilepic"
                                                    onClick={() => {
                                                        setState((prev) => ({
                                                            ...prev,
                                                            showDeleteModal: true,
                                                        }));
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="profile-form-fields">
                                        <div className="form-group mb-4">
                                            <InputComponent
                                                label="First Name"
                                                labelClassName="custom-label"
                                                name="first_name"
                                                register={register}
                                                placeholder="Enter your first name"
                                                errorMsg={errors.first_name?.message}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <InputComponent
                                                label="Last Name"
                                                labelClassName="custom-label"
                                                name="last_name"
                                                register={register}
                                                placeholder="Enter your last name"
                                                errorMsg={errors.last_name?.message}
                                            />
                                        </div>
                                        <div className="form-group mb-4">
                                            <InputComponent
                                                label="Email"
                                                name="email"
                                                register={register}
                                                placeholder="Enter your email"
                                                errorMsg={errors.email?.message}
                                            />
                                        </div>
                                        <div className="form-group mb-4">
                                            <InputComponent
                                                label="Password"
                                                name="password"
                                                register={register}
                                                type="password"
                                                placeholder="Enter new password"
                                                errorMsg={errors.password?.message}
                                            />
                                        </div>
                                        <div className="form-group mb-4">
                                            <InputComponent
                                                label="Confirm Password"
                                                name="confirmPassword"
                                                register={register}
                                                type="password"
                                                placeholder="Confirm new password"
                                                errorMsg={
                                                    errors.confirmPassword?.message
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="del-account">
                                    <div className="text">
                                        <h3>Delete Account</h3>
                                        <p>
                                            Permanently delete the account and remove
                                            access from all AOIs
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-outline-tertiary"
                                        onClick={() => {
                                            setState((prev) => ({
                                                ...prev,
                                                showRemoveAccountConformationModal:
                                                    true,
                                            }));
                                        }}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Scrollbars>
                </div>
                <div className="button-action bottom-fixed">
                    <button type="submit" className="btn btn-primary">
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={onCancelClickBtn}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            {image_cropper_show && (
                <ImageCropperModal
                    show={image_cropper_show}
                    handleClose={handleClose}
                    src={fileUrl}
                    saveCropImage={saveCropImage}
                />
            )}

            {showDeleteModal && (
                <DeleteConfirmationModal
                    show={showDeleteModal}
                    handleClose={hideProfilePicDeleteModal}
                    confirmBtnClick={removeProfilePhoto}
                    content={<p> Do you want to delete profile photo ?</p>}
                />
            )}

            {showRemoveAccountConformationModal && (
                <DeleteConfirmationModal
                    show={showRemoveAccountConformationModal}
                    handleClose={handleCloseRemoveAccountConformationModal}
                    confirmBtnClick={onRemoveBtnClick}
                    content={
                        <p> Are you sure you want to remove this account ?</p>
                    }
                />
            )}
        </div>
    );
};

export default withSideNav(MySettingsView);
