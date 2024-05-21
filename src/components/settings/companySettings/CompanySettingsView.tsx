import { useEffect, useState } from "react";
import { CompanySettingsViewProps } from "../../models/page-props";
import { companyBasicInfoValidationSchema } from "../../../Helper/validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { submitBasicCompanyInfo } from "../../models/submit-form";
import withSideNav from "../../HOC/withSideNav";
import LocationSearchInput from "../../common/LocationSearchInput";
import { geocodeByAddress } from "react-places-autocomplete";
import MobileInput from "../../common/MobileInput";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import MediaUploader from "../../common/MediaUploader";
import "react-image-crop/dist/ReactCrop.css";
import ImageCropperModal from "../../common/Modal/ImageCropperModal";
import {
    fetchCompanySettingDetail,
    removeCompanyLogo,
    saveCompanyDetails,
    uploadCompanyPic,
} from "../../store/actions/company-settings-actions";
import {
    hideImageCropperModal,
    showCheckOutModal,
    showImageCropperModal,
} from "../../store/actions/modal-actions";
import { toast } from "react-toastify";
import {
    ADMIN,
    MEMBERS,
    removeNullOrEmptyValue,
    setFormData,
} from "../../../utils/helper";
import { authActions } from "../../store/actions/auth-actions";
import { useLocation, useNavigate } from "react-router-dom";
import InputComponent from "../../common/InputComponent";
import DeleteConfirmationModal from "../../common/Modal/DeleteConfirmationModal";
import Scrollbars from "react-custom-scrollbars";
const CompanySettingsView = (props: CompanySettingsViewProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        modal: { image_cropper_show },
        auth: { isAuthenticated, userTokenLoading, user },
        companySettings: { address: addressDetails, company },
    } = useAppSelector((state) => state);
    const { access_token, user_id, signin_as, company_data: { company_id } } = user;
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        // resetField,
        // setError,
        // getValues,
        // watch,
        reset,
    } = useForm<submitBasicCompanyInfo>({
        resolver: yupResolver(companyBasicInfoValidationSchema),
        mode: "all",
    });
    const [state, setState] = useState({
        address: "",
        // addressFocusValue: "",
        // optionSelected: false,
        fileUrl: "",
        fileName: "",
        fileLoading: false,
        isEdit: false,
        fetchDetails: true,
        showComLogoDelModal: false,
    });
    const {
        address,
        // addressFocusValue,
        // optionSelected,
        fileUrl,
        fileName,
        fileLoading,
        isEdit,
        fetchDetails,
        showComLogoDelModal,
    } = state;

    const uploadCompanyLogo = (file: string, companyId?: number) => {
        setState((prev) => ({
            ...prev,
            fileLoading: true,
        }));
        if (isAuthenticated && !userTokenLoading) {
            dispatch(
                uploadCompanyPic(access_token, {
                    image_file: file,
                    upload_type: "company_logo",
                    user_id: user_id as number,
                    ...((company.company_id || companyId) && {
                        company_id: company.company_id || companyId,
                    }),
                })
            ).then((result) => {
                if (result) {
                    const { file_name, msg, status } = result || {};
                    if (status === 200) {
                        dispatch(
                            authActions.loadUser({
                                ...user,
                                company_data: {
                                    ...user.company_data,
                                    company_logo: file_name,
                                },
                            })
                        );
                        setValue("company_logo", file_name);
                        setState((prev) => ({
                            ...prev,
                            fileName: file_name,
                            fileLoading: false,
                            fileUrl: "",
                            fetchDetails: true,
                        }));
                        isEdit && toast.success(msg);
                    } else {
                        toast.error(msg);
                        setState((prev) => ({
                            ...prev,
                            fileLoading: false,
                        }));
                    }
                }
            });
        }
        dispatch(hideImageCropperModal());
    };

    const saveCropImage = (file: string) => {
        if (!isEdit) {
            // Note:- fileUrl is first to show image for cropping after cropping it used to for storeing base 64 stirng of image
            setState((prev) => ({ ...prev, fileUrl: file }));
            dispatch(hideImageCropperModal());
        } else {
            uploadCompanyLogo(file);
        }
    };

    const onSubmit = (data: submitBasicCompanyInfo) => {
        let transformData = data;
        if (isEdit) {
            transformData = {
                ...transformData,
                ...(addressDetails.address_id && {
                    address_id: addressDetails.address_id,
                }),
                ...(company.company_id && { company_id: company.company_id }),
            };
        }
        removeNullOrEmptyValue(transformData);
        if (isAuthenticated && !userTokenLoading) {
            dispatch(
                saveCompanyDetails(access_token, transformData, isEdit)
            ).then((result) => {
                // eslint-disable-next-line
                const { msg, status } = result || {};
                if (status === 200) {
                    toast.success(msg);
                    dispatch(
                        authActions.loadUser({
                            ...user,
                            company_data: {
                                ...user.company_data,
                                ...(!isEdit &&
                                    result?.data?.company_id && {
                                    company_id: result?.data?.company_id,
                                }),
                                ...(!isEdit &&
                                    result?.data?.allowed_sub_user && {
                                    allowed_sub_user: Number(
                                        result?.data?.allowed_sub_user
                                    ),
                                }),
                                company_name: transformData.company_name,
                                ...(!isEdit &&
                                {
                                    billing_email: transformData.billing_email
                                }),

                            },
                            ...(!isEdit &&
                                result?.data?.company_configs && {
                                company_configs: result?.data?.company_configs,
                            }),
                            ...(!isEdit &&
                                result?.data?.company_configs && result?.data?.company_configs.free_trial_period_enabled && {
                                trial_remaining_days: result?.data?.company_configs?.no_of_free_days_allowed,
                            }),
                        })
                    );
                    if (!isEdit && fileUrl) {
                        uploadCompanyLogo(fileUrl, result?.data?.company_id);
                    }
                    setState((prev) => ({
                        ...prev,
                        isEdit: true,
                        fetchDetails: true,
                    }));
                    if (!isEdit && result?.data?.company_configs.free_trial_period_enabled) {
                        navigate("/cart-select-basin");
                        return
                    }
                    if (!isEdit && location.state?.checkout) {
                        window.history.replaceState({}, document.title);
                        dispatch(showCheckOutModal());
                        navigate("/cart-select-basin");
                    }
                } else {
                    toast.error(msg);
                }
            });
        }
    };

    const locationOnChange = (address: string) => {
        setState((prev) => ({ ...prev, address }));
    };

    const locationOnSelect = (address: string) => {
        let tempValue = address.split(",");
        let tempFirstAddress = [];
        for (let i = 1; i <= tempValue.length; i++) {
            switch (i) {
                case 1:
                    break;
                case 2:
                    setValue("state", tempValue[tempValue.length - i]?.trim());
                    break;
                case 3:
                    setValue("city", tempValue[tempValue.length - i]?.trim());
                    break;
                default:
                    tempFirstAddress.push(
                        tempValue[tempValue.length - i].trim()
                    );
            }
        }
        let formatedAddress = tempFirstAddress.reverse().join(",");
        setValue("first_address", formatedAddress);
        setState((prev) => ({
            ...prev,
            address: formatedAddress,
            // optionSelected: true,
        }));
        geocodeByAddress(address)
            .then((results) => {
                const { address_components } = results[0];
                address_components?.forEach((item) => {
                    if (item.types.includes("postal_code")) {
                        setValue("zip_code", item.long_name?.trim());
                    }
                });
            })
            .catch((error) => console.error("Error", error));
    };

    // const onLocationOnBlur = () => {
    //     if (!optionSelected && addressFocusValue?.trim() !== address?.trim()) {
    //         setState((prev) => ({ ...prev, address: addressFocusValue || "" }));
    //         setValue("first_address", addressFocusValue || "");
    //     }
    // };
    // const onLocationFocus = () => {
    //     setState((prev) => ({
    //         ...prev,
    //         addressFocusValue: getValues("first_address"),
    //         optionSelected: false,
    //     }));
    // };

    const handleChange = (acceptedFiles: Blob | Blob[]) => {
        if (!Array.isArray(acceptedFiles)) {
            if (acceptedFiles?.size > 5 * 1024 * 1024) {
                toast.error(`Company logo size is greater than 5 MB.`);
                return;
            }
            let fileName = acceptedFiles?.name;
            const fileUrl = URL.createObjectURL(acceptedFiles);
            setState((prev) => ({ ...prev, fileUrl, fileName }));
            dispatch(showImageCropperModal(fileName));
        }
    };

    const handleClose = () => {
        dispatch(hideImageCropperModal());
        setState((prev) => ({ ...prev, fileName: "", fileUrl: "" }));
    };

    const removeCompLogo = () => {
        if (!isEdit) {
            setState((prev) => ({ ...prev, fileUrl: "", fileName: "" }));
            return;
        }
        if (isAuthenticated && !userTokenLoading) {
            if (fileName) {
                dispatch(
                    removeCompanyLogo(access_token, {
                        upload_type: "company_logo",
                        image_name: fileName,
                        user_id: user_id as number,
                        ...(company.company_id && {
                            company_id: company.company_id,
                        }),
                    })
                ).then((result) => {
                    const { msg, status } = result || {};
                    if (status === 200) {
                        dispatch(
                            authActions.loadUser({
                                ...user,
                                company_data: {
                                    ...user.company_data,
                                    company_logo: "",
                                },
                            })
                        );
                        toast.success(msg);
                        setState((prev) => ({
                            ...prev,
                            fileName: "",
                            fetchDetails: true,
                            showComLogoDelModal: false,
                        }));
                    } else {
                        toast.error(msg);
                    }
                });
            }
        }
    };

    const hideComLogoDelModal = () => {
        setState((prev) => ({ ...prev, showComLogoDelModal: false }));
    };

    useEffect(() => {
        if (company_id && isAuthenticated && !userTokenLoading && fetchDetails) {
            dispatch(fetchCompanySettingDetail(access_token)).then((result) => {
                const { msg, status } = result || {};
                if (status === 200) {
                    setState((prev) => ({ ...prev, fetchDetails: false }));
                } else {
                    toast.error(msg);
                }
            });
        }
        // eslint-disable-next-line
    }, [fetchDetails]);

    useEffect(() => {
        if (addressDetails.address_id) {
            setFormData(addressDetails, setValue);
        }
        if (company.company_id) {
            setFormData(company, setValue);
        }
        setState((prev) => ({
            ...prev,
            ...((addressDetails.address_id || company.company_id) && {
                isEdit: true,
            }),
            ...(addressDetails.first_address && {
                address: addressDetails.first_address,
            }),
            ...(company.company_logo && {
                fileName: company.company_logo,
            }),
        }));
        // eslint-disable-next-line
    }, [addressDetails, company]);
    return (
        <div className="settingsWrapper">
            <Scrollbars
                className='settingsWrapper-scroll'
                autoHeightMin={0}
                renderThumbVertical={props => < div {...props} className="thumb-vertical" />}
                renderTrackVertical={props => < div {...props} className="track-vertical" />}
            >
                <div className="settingWrapperInner">
                    <form
                        className="form-block"
                        autoComplete="off"
                        autoCapitalize="off"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="item">
                            <h3>Company Settings</h3>
                            <p>Manage your company name, logo and information</p>
                        </div>
                        <div className="item">
                            <h3 className="mb-4">Basic Information</h3>
                            <div className="half-row row">
                                <div className="form-group mb-4">
                                    <InputComponent
                                        label="Company Name"
                                        name="company_name"
                                        placeholder="Enter your company name"
                                        register={register}
                                        disabled={signin_as === MEMBERS ? true : false}
                                        errorMsg={errors.company_name?.message}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <InputComponent
                                        label="Company Email"
                                        name="company_email"
                                        placeholder="Enter your company email"
                                        register={register}
                                        disabled={signin_as === MEMBERS ? true : false}
                                        errorMsg={errors.company_email?.message}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <InputComponent
                                        label="Billing Email"
                                        name="billing_email"
                                        placeholder="Enter your billing email"
                                        register={register}
                                        disabled={signin_as === MEMBERS ? true : false}
                                        errorMsg={errors.billing_email?.message}
                                    />
                                </div>
                                {!fileName && !fileLoading && (
                                    <div className="form-group mb-4">
                                        <label htmlFor="">Company Logo</label>
                                        {signin_as === MEMBERS ? (
                                            <div className="company-profile">
                                                {company.company_name
                                                    ? company.company_name.split(" ")
                                                        .length === 1
                                                        ? `${company.company_name
                                                            ?.slice(0, 1)
                                                            ?.toUpperCase()}`
                                                        : `${company.company_name
                                                            ?.split(" ")[0]
                                                            ?.slice(0, 1)
                                                            ?.toUpperCase()}${company.company_name
                                                                ?.split(" ")[1]
                                                                ?.slice(0, 1)
                                                                ?.toUpperCase()}`
                                                    : "CO"}
                                            </div>
                                        ) : (
                                            <>
                                                <MediaUploader
                                                    className="drag-drop"
                                                    accept={["JPEG", "PNG", "JPG"]}
                                                    handleChange={handleChange}
                                                    name="company_logo"
                                                    control={control}
                                                    disabled={
                                                        signin_as === MEMBERS
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <div>
                                                        <img
                                                            src="images/drag-upload.svg"
                                                            alt=""
                                                        />
                                                        <p>
                                                            <span>Drag &amp; Drop</span>
                                                            Drag your company logo or
                                                            click here to upload
                                                        </p>
                                                        <button
                                                            type="button"
                                                            className="upload-btn"
                                                        >
                                                            Upload Image
                                                        </button>
                                                    </div>
                                                </MediaUploader>
                                                {signin_as === ADMIN && (
                                                    <p className="mb-2">
                                                        Upload an image and it will show
                                                        up in your sidebar and
                                                        notifications.
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                                <div className="form-group mb-4">
                                    {fileLoading ? (
                                        <div className="drag-drop uploading-file">
                                            <h3>Uploading files</h3>
                                            <div className="filename">{fileName}</div>
                                            <div className="progressbar"></div>
                                        </div>
                                    ) : fileName ? (
                                        <div className="drag-drop uploaded-image">
                                            <img
                                                src={
                                                    !fileUrl.includes("data")
                                                        ? `${process.env.REACT_APP_ED_DATA_CDN_API}/company_logo/${fileName}`
                                                        : fileUrl
                                                }
                                                alt={"Company Logo"}
                                            />
                                            {signin_as === ADMIN && (
                                                <span
                                                    onClick={() =>
                                                        setState((prev) => ({
                                                            ...prev,
                                                            showComLogoDelModal: true,
                                                        }))
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <h3 className="mb-4">Address</h3>
                            <div className="half-row row">
                                <div className="form-group mb-4">
                                    <label htmlFor="">Address Line 1</label>
                                    <LocationSearchInput
                                        name={`first_address`}
                                        valueLoc={address}
                                        errorMsg={errors?.first_address?.message || ""}
                                        onChangeLoc={locationOnChange}
                                        onSelect={locationOnSelect}
                                        control={control}
                                        debounce={500}
                                        searchOptions={{
                                            componentRestrictions: {
                                                country: ["usa", "us"],
                                            },
                                            types: [],
                                        }}
                                        // onFocus={onLocationFocus}
                                        // onBlur={onLocationOnBlur}
                                        placeholder="Enter address line 1"
                                        shouldFetchSuggestions={address?.length >= 3}
                                        disabled={signin_as === MEMBERS ? true : false}
                                    />
                                    {/* <span className={`error`}>
                                {errors.first_address?.message}
                            </span> */}
                                </div>
                                <div className="form-group mb-4">
                                    <InputComponent
                                        label="Address Line 2"
                                        name="second_address"
                                        placeholder="Enter address line 2"
                                        register={register}
                                        disabled={signin_as === MEMBERS ? true : false}
                                        errorMsg={errors.second_address?.message}
                                    />
                                </div>
                            </div>
                            <div className="half-row row">
                                <div className="col-md-4">
                                    <div className="form-group mb-4">
                                        <InputComponent
                                            label="City"
                                            name="city"
                                            placeholder="City"
                                            register={register}
                                            // readOnly={true}
                                            // style={{ cursor: "not-allowed" }}
                                            disabled={
                                                signin_as === MEMBERS ? true : false
                                            }
                                            errorMsg={errors.city?.message}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-4">
                                        <InputComponent
                                            label="State"
                                            name="state"
                                            placeholder="State"
                                            register={register}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => {
                                                setValue(
                                                    "state",
                                                    e.target.value.toUpperCase()
                                                );
                                            }}
                                            // readOnly={true}
                                            // style={{ cursor: "not-allowed" }}
                                            disabled={
                                                signin_as === MEMBERS ? true : false
                                            }
                                            errorMsg={errors.state?.message}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-4">
                                        <InputComponent
                                            label="Zip"
                                            name="zip_code"
                                            placeholder="Zip code"
                                            register={register}
                                            disabled={
                                                signin_as === MEMBERS ? true : false
                                            }
                                            errorMsg={errors.zip_code?.message}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="half-row row">
                                <div className="form-group mb-4">
                                    <label htmlFor="">Mobile Number</label>
                                    <MobileInput
                                        control={control}
                                        name={"phone_no"}
                                        maxLength={14}
                                        // mobileOnChange={mobileOnChange}
                                        // defaultCountry="US"
                                        country="US"
                                        className={`form-control`}
                                        placeholder={`(XXX) XXX-XXXX`}
                                        // countryCallingCodeEditable={false}
                                        // className="form-control"
                                        disabled={signin_as === MEMBERS ? true : false}
                                    />
                                    <span className={`error`}>
                                        {errors.phone_no?.message}
                                    </span>
                                </div>
                            </div>
                            {image_cropper_show && (
                                <ImageCropperModal
                                    show={image_cropper_show}
                                    handleClose={handleClose}
                                    src={fileUrl}
                                    saveCropImage={saveCropImage}
                                />
                            )}
                        </div>
                        {signin_as === ADMIN && (
                            <div className="button-action">
                                <button type="submit" className="btn btn-primary">
                                    {isEdit ? "Update" : "Save"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => {
                                        if (addressDetails.address_id) {
                                            setFormData(addressDetails, setValue);
                                        }
                                        if (company.company_id) {
                                            setFormData(company, setValue);
                                            return;
                                        }
                                        setState((prev) => ({
                                            ...prev,
                                            address: "",
                                            // addressFocusValue: "",
                                            // optionSelected: false,
                                        }));
                                        reset();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                    {showComLogoDelModal && (
                        <DeleteConfirmationModal
                            show={showComLogoDelModal}
                            handleClose={hideComLogoDelModal}
                            confirmBtnClick={removeCompLogo}
                            content={<p> Do you want to delete company logo ?</p>}
                        />
                    )}
                </div>
            </Scrollbars>
        </div>
    );
};

export default withSideNav(CompanySettingsView);
