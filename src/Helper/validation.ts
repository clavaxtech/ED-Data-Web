// export const textValidate = value => {
//     if (!value || value.trim().length === 0) return true
//     else return false;
// }
import * as Yup from "yup";
// import {
//     formatPhoneNumber,
//     formatPhoneNumberIntl,
//     isPossiblePhoneNumber,
//     isValidPhoneNumber,
// } from "react-phone-number-input";

const emailRegExp =
    // eslint-disable-next-line
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// const onlyCharacterRegExp = /^[aA-zZ\s]+$/;
const onlyAlaphaNumericRegExp = /^[a-zA-Z0-9\s]+$/;
const passwordRegExp =
    // eslint-disable-next-line
    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;

const zipCodeRegExp = /(^\d{5}(-\d{4})?$)/;

// const phoneNoRegExp = /^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/;
const tenDigitRegExp = /^[2-9]{1}[0-9]{9}$/;

// const csvRegExp = /^\d{10}(,\d{10}){0,}$/;
//sing up
export const SignUpValidationSchema = Yup.object().shape({
    first_name: Yup.string()
        .strict()
        .trim("The first name cannot include leading and trailing spaces")
        .required("First name is required.")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters.")
        .matches(
            onlyAlaphaNumericRegExp,
            "No special character allowed for this field"
        ),
    last_name: Yup.string()
        .strict()
        .trim("The last name cannot include leading and trailing spaces")
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must not exceed 50 characters")
        .matches(
            onlyAlaphaNumericRegExp,
            "No special character allowed for this field"
        ),

    email: Yup.string()
        .strict()
        .trim("The email cannot include leading and trailing spaces")
        .required("Email is required")
        .matches(emailRegExp, "Email is invalid"),
    password: Yup.string()
        .strict()
        .trim("The password cannot include leading and trailing spaces")
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must not exceed 32 characters")
        // eslint-disable-next-line
        .matches(
            passwordRegExp,
            "Password must contain 8 characters, one uppercase, one lowercase, one number and one special character (!, @, #, $, %, ^, &,*, (, ), , -, _, =, +, {, }, ;, :, <, ., >, and ,)"
        ),
    confirmPassword: Yup.string()
        .strict()
        .trim("The confirm password cannot include leading and trailing spaces")
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), ""], "Confirm Password does not match"),
    terms_accepted: Yup.bool().oneOf(
        [true],
        "Accept Terms & Privacy is required"
    ),
    "g-recaptcha-response": Yup.string().required("Recaptcha is required"),
    account_type: Yup.string().required("Account type is required"),
    company_name: Yup.string()
        .strict()
        .trim("Company Name cannot include leading and trailing spaces")
        .test(
            "is required when account type is company",
            "Company name is required.",
            function (value) {
                if (this.parent.account_type === "company" && value === "") {
                    return false;
                }
                return true;
            }
        )
        .test(
            "Company name must be at least 3 characters",
            "Company name must be at least 3 characters.",
            function (value) {
                if (value && value.length < 3) {
                    return false;
                }
                return true;
            }
        )
        .test(
            "Company name must not exceed 50 characters",
            "Company name must not exceed 50 characters.",
            function (value) {
                if (value && value.length > 50) {
                    return false;
                }
                return true;
            }
        ),
});

//sign in
export const SignInValidationSchema = Yup.object().shape({
    email: Yup.string()
        .strict()
        .trim("The email cannot include leading and trailing spaces")
        .required("Email is required")
        .matches(emailRegExp, "Email is invalid"),
    password: Yup.string()
        .strict()
        .trim("The password cannot include leading and trailing spaces")
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must not exceed 32 characters"),
    rememberMe: Yup.bool(),
});

//forgotPassword

export const ForgotPasswordValidationSchema = Yup.object().shape({
    email: Yup.string()
        .strict()
        .trim("The email cannot include leading and trailing spaces")
        .required("Email is required")
        .matches(emailRegExp, "Email is invalid"),
});

//UpdatePassword

export const UpdatePasswordValidationSchema = Yup.object().shape({
    password: Yup.string()
        .strict()
        .trim("The password cannot include leading and trailing spaces")
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must not exceed 32 characters")
        // eslint-disable-next-line
        .matches(
            passwordRegExp,
            "Password must contain 8 characters, one uppercase, one lowercase, one number and one special character (!, @, #, $, %, ^, &,*, (, ), , -, _, =, +, {, }, ;, :, <, ., >, and ,)"
        ),
    confirmPassword: Yup.string()
        .strict()
        .trim("The confirm password cannot include leading and trailing spaces")
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), ""], "Confirm Password does not match"),
    "g-recaptcha-response": Yup.string().required("Recaptcha is required"),
});

export const companyBasicInfoValidationSchema = Yup.object().shape({
    company_name: Yup.string()
        .strict()
        .trim("Company Name cannot include leading and trailing spaces")
        .required("Company Name is required")
        .min(3, "Company name must be at least 3 characters")
        .max(50, "Company name must not exceed 50 characters"),
    company_email: Yup.string()
        .strict()
        .trim("The company email cannot include leading and trailing spaces")
        .required("Company email is required")
        .matches(emailRegExp, "Company email is invalid"),
    billing_email: Yup.string()
        .strict()
        .trim("The billing email cannot include leading and trailing spaces")
        .required("Billing Email is required")
        .matches(emailRegExp, "Billing email is invalid"),
    // company_logo: Yup.string().required("Company logo is required"),
    first_address: Yup.string()
        .strict()
        .trim("Address line 1 cannot include leading and trailing spaces")
        .required("Address line 1 is required")
        .min(3, "Address line 1 must be at least 3 characters")
        .max(80, "Address line 1 must not exceed 50 characters"),
    second_address: Yup.string()
        .nullable()
        .strict()
        .trim("Address line 2 cannot include leading and trailing spaces")
        .max(50, "Address line 2 must not exceed 50 characters"),
    city: Yup.string()
        .strict()
        .trim("City cannot include leading and trailing spaces")
        .required("City is required")
        .min(2, "City must be at least 2 characters")
        .max(50, "City must not exceed 50 characters"),
    state: Yup.string()
        .strict()
        .trim("State cannot include leading and trailing spaces")
        .required("State is required")
        .min(2, "Please use 2 characters state iso code.")
        .max(2, "Please use 2 characters state iso code."),
    zip_code: Yup.string()
        .required("Zip code is required")
        .matches(zipCodeRegExp, "Zip code is not valid"),
    phone_no: Yup.string()
        .strict()
        .trim("Mobile number cannot include leading and trailing spaces")
        .required("Mobile number is required")
        .test(
            "isValidPhoneNumber",
            "Mobile number is invalid",
            function (value) {
                if (value && tenDigitRegExp.test(value.slice(2))) {
                    return true;
                }
                return false;
            }
        ),
    // .matches(phoneNoRegExp, "Mobile number is invalid"),
    // .test("isValidPhoneNumber", "Invalid mobile number", function (value) {
    //     if (value && isValidPhoneNumber(value)) {
    //         return true;
    //     } else if (value) {
    //         return false;
    //     }
    //     return true;
    // })
    // .test(
    //     "isPossiblePhoneNumber",
    //     "Invalid mobile number",
    //     function (value) {
    //         if (value && isPossiblePhoneNumber(value)) {
    //             return true;
    //         } else if (value) {
    //             return false;
    //         }
    //         return true;
    //     }
    // )
    // .test("formatPhoneNumber", "Invalid mobile number", function (value) {
    //     if (value && formatPhoneNumber(value)) {
    //         return true;
    //     } else if (value) {
    //         return false;
    //     }
    //     return true;
    // })
    // .test(
    //     "formatPhoneNumberIntl",
    //     "Invalid mobile number",
    //     function (value) {
    //         if (value && formatPhoneNumberIntl(value)) {
    //             return true;
    //         } else if (value) {
    //             return false;
    //         }
    //         return true;
    //     }
    // ),
});

export const inviteMemberSettingValidationSchema = Yup.object().shape({
    first_name: Yup.string()
        .strict()
        .trim("The first name cannot include leading and trailing spaces")
        .required("First name is required.")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters.")
        .matches(
            onlyAlaphaNumericRegExp,
            "No special character allowed for this field"
        ),
    last_name: Yup.string()
        .strict()
        .trim("The last name cannot include leading and trailing spaces")
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must not exceed 50 characters")
        .matches(
            onlyAlaphaNumericRegExp,
            "No special character allowed for this field"
        ),
    email: Yup.string()
        .strict()
        .trim("The email cannot include leading and trailing spaces")
        .required("Email is required")
        .matches(emailRegExp, "Email is invalid"),
    invite_as: Yup.string().required("Role is required"),
});

export const mySettingBasicInfoValidationSchema = Yup.object().shape({
    // profilePic: Yup.mixed()
    //     .required('Profile is required'),
    first_name: Yup.string()
        .strict()
        .trim("The first name cannot include leading and trailing spaces")
        .required("First name is required.")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters.")
        .matches(
            onlyAlaphaNumericRegExp,
            "No special character allowed for this field"
        ),
    last_name: Yup.string()
        .strict()
        .trim("The last name cannot include leading and trailing spaces")
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must not exceed 50 characters")
        .matches(
            onlyAlaphaNumericRegExp,
            "No special character allowed for this field"
        ),
    email: Yup.string()
        .strict()
        .trim("The email cannot include leading and trailing spaces")
        .required("Email is required")
        .matches(emailRegExp, "Email is invalid"),
    password: Yup.string()
        .transform((value) => (value === "" ? "" : value))
        .strict()
        .nullable()
        .trim("The password cannot include leading and trailing spaces")
        .test(
            "password",
            "Password must be at least 8 characters",
            function (value) {
                if (value && value.length < 8) {
                    return false;
                }
                return true;
            }
        )
        .test(
            "password",
            "Password must contain 8 characters, one uppercase, one lowercase, one number and one special character (!, @, #, $, %, ^, &,*, (, ), , -, _, =, +, {, }, ;, :, <, ., >, and ,)",
            function (value) {
                if (value && !value.match(passwordRegExp)) {
                    return false;
                }
                return true;
            }
        )
        .max(32, "Password must not exceed 32 characters"),
    // eslint-disable-next-line
    confirmPassword: Yup.string()
        .strict()
        .nullable()
        .trim("The confirm password cannot include leading and trailing spaces")
        .test(
            "password match",
            "Confirm Password does not match",
            function (value) {
                if (this.parent.password && !value) {
                    return false;
                }
                if (this.parent.password && value) {
                    if (this.parent.password !== value) {
                        return false;
                    }
                    return true;
                }
                return true;
            }
        ),
});

export const CartBasinSchema = Yup.object().shape({
    // apitext: Yup.string()
    //     .strict()
    //     .trim("API cannot include leading and trailing spaces")
    //     .test("Csv", "API's should be separated by comma & of length 10", (value) => {
    //         if (value) return csvRegExp.test(value)
    //         else return true
    //     })
});

export const filterCartBasinSchema = Yup.object().shape({
    search_user: Yup.string()
        .strict()
        .trim("The Search text cannot include leading and trailing spaces")
        .test("Name_or_Email", "Search text is invalid", (value) => {
            if (value) return onlyAlaphaNumericRegExp.test(value);
            return true;
        }),
});

export const notificationSettingsValidation = Yup.object().shape({
    notification: Yup.array().of(
        Yup.object().shape({
            None: Yup.boolean(),
            is_in_app: Yup.boolean(),
            is_email: Yup.boolean(),
        })
    ),
});

export const deactivateRemoveValidation = Yup.object().shape({
    activeMember: Yup.string(),
});

export const deactivateRemoveRequiredValidation = Yup.object().shape({
    activeMember: Yup.string().strict().required("Please select active member"),
});

//sign in
export const CheckOutFormValidationSchema = Yup.object().shape({
    name: Yup.string()
        .strict()
        .trim("The name cannot include leading and trailing spaces")
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    billing_email: Yup.string()
        .strict()
        .trim("The email cannot include leading and trailing spaces")
        .required("Billing email is required")
        .matches(emailRegExp, "Billing email is invalid"),
    address: Yup.string()
        .strict()
        .trim("Address cannot include leading and trailing spaces")
        .required("Address is required")
        .min(3, "Address must be at least 3 characters")
        .max(80, "Address must not exceed 50 characters"),
    city: Yup.string()
        .strict()
        .trim("City cannot include leading and trailing spaces")
        .required("City is required")
        .min(2, "City must be at least 2 characters")
        .max(50, "City must not exceed 50 characters"),
    state: Yup.string()
        .strict()
        .trim("State cannot include leading and trailing spaces")
        .required("State is required")
        .min(2, "Please use 2 characters state iso code.")
        .max(2, "Please use 2 characters state iso code."),
    country: Yup.string().required("Country is required"),
    zip_code: Yup.string()
        .required("Zip code is required")
        .matches(zipCodeRegExp, "Zip code is not valid"),
    cardNumber: Yup.object()
        .test(
            "Card number is required",
            "Card number is required",
            function (value) {
                if (!value || ("empty" in value && value.empty)) {
                    return false;
                }
                return true;
            }
        )
        .test(
            "Card number is invalid",
            "Card number is invalid",
            function (value) {
                if (value && "error" in value && value.error) {
                    return false;
                }
                return true;
            }
        ),
    cardCvc: Yup.object()
        .test("Card cvc is required", "Card cvc is required", function (value) {
            if (!value || ("empty" in value && value.empty)) {
                return false;
            }
            return true;
        })
        .test("Card cvc is invalid", "Card cvc is invalid", function (value) {
            if (value && "error" in value && value.error) {
                return false;
            }
            return true;
        }),
    cardExpiry: Yup.object()
        .test(
            "Card expiry is required",
            "Card expiry is required",
            function (value) {
                if (!value || ("empty" in value && value.empty)) {
                    return false;
                }
                return true;
            }
        )
        .test(
            "Card expiry is invalid",
            "Card expiry is invalid",
            function (value) {
                if (value && "error" in value && value.error) {
                    return false;
                }
                return true;
            }
        ),
});

export const CheckOutFormSavedCardValidationSchema = Yup.object().shape({
    name: Yup.string()
        .strict()
        .trim("The name cannot include leading and trailing spaces")
        .test("Name is required", "Name is required", function (value) {
            if (this.parent.saved_card === "0" && !value) {
                return false;
            }
            return true;
        })
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    billing_email: Yup.string()
        .strict()
        .trim("The email cannot include leading and trailing spaces")
        .required("Billing email is required")
        .matches(emailRegExp, "Billing email is invalid"),
    address: Yup.string()
        .strict()
        .trim("Address cannot include leading and trailing spaces")
        .test("Address is required", "Address is required", function (value) {
            if (this.parent.saved_card === "0" && !value) {
                return false;
            }
            return true;
        })
        .min(3, "Address must be at least 3 characters")
        .max(80, "Address must not exceed 50 characters"),
    city: Yup.string()
        .strict()
        .trim("City cannot include leading and trailing spaces")
        .test("City is required", "City is required", function (value) {
            if (this.parent.saved_card === "0" && !value) {
                return false;
            }
            return true;
        })
        .min(2, "City must be at least 2 characters")
        .max(50, "City must not exceed 50 characters"),
    state: Yup.string()
        .strict()
        .trim("State cannot include leading and trailing spaces")
        .test("State is required", "State is required", function (value) {
            if (this.parent.saved_card === "0" && !value) {
                return false;
            }
            return true;
        })
        .min(2, "Please use 2 characters state iso code.")
        .max(2, "Please use 2 characters state iso code."),
    country: Yup.string().test(
        "Country is required",
        "Country is required",
        function (value) {
            if (this.parent.saved_card === "0" && !value) {
                return false;
            }
            return true;
        }
    ),
    zip_code: Yup.string()
        .test("Zip_code is required", "Zip code is required", function (value) {
            if (this.parent.saved_card === "0" && !value) {
                return false;
            }
            return true;
        })
        .matches(zipCodeRegExp, "Zip code is not valid"),
    saved_card: Yup.string().required("Payment method is required"),
    cardNumber: Yup.object()
        .test(
            "Card number is required",
            "Card number is required",
            function (value) {
                if (
                    (this.parent.saved_card === "0" && !value) ||
                    (this.parent.saved_card === "0" &&
                        "empty" in value &&
                        value.empty)
                ) {
                    return false;
                }
                return true;
            }
        )
        .test(
            "Card number is invalid",
            "Card number is invalid",
            function (value) {
                if (
                    this.parent.saved_card === "0" &&
                    value &&
                    "error" in value &&
                    value.error
                ) {
                    return false;
                }
                return true;
            }
        ),
    cardCvc: Yup.object()
        .test("Card cvc is required", "Card cvc is required", function (value) {
            if (
                (this.parent.saved_card === "0" && !value) ||
                (this.parent.saved_card === "0" &&
                    "empty" in value &&
                    value.empty)
            ) {
                return false;
            }
            return true;
        })
        .test("Card cvc is invalid", "Card cvc is invalid", function (value) {
            if (
                this.parent.saved_card === "0" &&
                value &&
                "error" in value &&
                value.error
            ) {
                return false;
            }
            return true;
        }),
    cardExpiry: Yup.object()
        .test(
            "Card expiry is required",
            "Card expiry is required",
            function (value) {
                if (
                    (this.parent.saved_card === "0" && !value) ||
                    (this.parent.saved_card === "0" &&
                        "empty" in value &&
                        value.empty)
                ) {
                    return false;
                }
                return true;
            }
        )
        .test(
            "Card expiry is invalid",
            "Card expiry is invalid",
            function (value) {
                if (
                    this.parent.saved_card === "0" &&
                    value &&
                    "error" in value &&
                    value.error
                ) {
                    return false;
                }
                return true;
            }
        ),
});

//creditCardUpdateModal
export const CreditCardUpdateModalValidationSchema = Yup.object().shape({
    full_name: Yup.string()
        .strict()
        .trim("The name cannot include leading and trailing spaces")
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    cardNumber: Yup.object()
        .test(
            "Card number is required",
            "Card number is required",
            function (value) {
                if (!value || ("empty" in value && value.empty)) {
                    return false;
                }
                return true;
            }
        )
        .test(
            "Card number is invalid",
            "Card number is invalid",
            function (value) {
                if (value && "error" in value && value.error) {
                    return false;
                }
                return true;
            }
        ),
    cardCvc: Yup.object()
        .test("Card cvc is required", "Card cvc is required", function (value) {
            if (!value || ("empty" in value && value.empty)) {
                return false;
            }
            return true;
        })
        .test("Card cvc is invalid", "Card cvc is invalid", function (value) {
            if (value && "error" in value && value.error) {
                return false;
            }
            return true;
        }),
    cardExpiry: Yup.object()
        .test(
            "Card expiry is required",
            "Card expiry is required",
            function (value) {
                if (!value || ("empty" in value && value.empty)) {
                    return false;
                }
                return true;
            }
        )
        .test(
            "Card expiry is invalid",
            "Card expiry is invalid",
            function (value) {
                if (value && "error" in value && value.error) {
                    return false;
                }
                return true;
            }
        ),
    first_address: Yup.string()
        .strict()
        .trim("Address line 1 cannot include leading and trailing spaces")
        .required("Address line 1 is required")
        .min(3, "Address line 1 must be at least 3 characters")
        .max(80, "Address line 1 must not exceed 50 characters"),
    second_address: Yup.string()
        .nullable()
        .strict()
        .trim("Address line 2 cannot include leading and trailing spaces")
        .max(50, "Address line 2 must not exceed 50 characters"),
    city: Yup.string()
        .strict()
        .trim("City cannot include leading and trailing spaces")
        .required("City is required")
        .min(2, "City must be at least 2 characters")
        .max(50, "City must not exceed 50 characters"),
    state: Yup.string()
        .strict()
        .trim("State cannot include leading and trailing spaces")
        .required("State is required")
        .min(2, "Please use 2 characters state iso code.")
        .max(2, "Please use 2 characters state iso code."),
    zip_code: Yup.string()
        .required("Zip code is required")
        .matches(zipCodeRegExp, "Zip code is not valid"),
});

//UpdateBillingAddressModal
export const UpdateBillingAddressModalValidationSchema = Yup.object().shape({
    billing_email: Yup.string()
        .strict()
        .trim("The email cannot include leading and trailing spaces")
        .required("Billing email is required")
        .matches(emailRegExp, "Billing email is invalid"),
    first_address: Yup.string()
        .strict()
        .trim("Address line 1 cannot include leading and trailing spaces")
        .required("Address line 1 is required")
        .min(3, "Address line 1 must be at least 3 characters")
        .max(80, "Address line 1 must not exceed 50 characters"),
    second_address: Yup.string()
        .nullable()
        .strict()
        .trim("Address line 2 cannot include leading and trailing spaces")
        .max(50, "Address line 2 must not exceed 50 characters"),
    city: Yup.string()
        .strict()
        .trim("City cannot include leading and trailing spaces")
        .required("City is required")
        .min(2, "City must be at least 2 characters")
        .max(50, "City must not exceed 50 characters"),
    state: Yup.string()
        .strict()
        .trim("State cannot include leading and trailing spaces")
        .required("State is required")
        .min(2, "Please use 2 characters state iso code.")
        .max(2, "Please use 2 characters state iso code."),
    zip_code: Yup.string()
        .required("Zip code is required")
        .matches(zipCodeRegExp, "Zip code is not valid"),
});

export const aoiGenTabNotiValidation = Yup.object().shape({
    notification: Yup.array().of(
        Yup.object().shape({
            None: Yup.boolean(),
            is_in_app: Yup.boolean(),
            is_email: Yup.boolean(),
        })
    ),
});

export const aoiModalInputValidation = Yup.object().shape({
    aoi_name: Yup.string()
        .strict()
        .trim("The AOI name cannot include leading and trailing spaces")
        .required("AOI name is required")
        .min(2, "AOI name must be at least 2 characters")
        .max(50, "AOI name must not exceed 50 characters"),
    bufferDistance: Yup.string()
        .strict()
        .trim("The buffer distance cannot include leading and trailing spaces")
        .required("Buffer distance is required."),
});

export const crsModalInputValidation = Yup.object().shape({
    crs: Yup.object().required("CRS is required"),
});

export const aoiNotiValidation = Yup.object().shape({
    notification_settings: Yup.array().of(
        Yup.object().shape({
            None: Yup.boolean(),
            is_in_app: Yup.boolean(),
            is_email: Yup.boolean(),
        })
    ),
});

export const saveAsAoiValidation = aoiModalInputValidation;

export const apiListTableValidation = Yup.object().shape({
    wellMatching: Yup.array().of(
        Yup.object().shape({
            name: Yup.array().nullable().required("Well name is required"),
        })
    ),
});

export const apiListTableNotRequiredValidation = Yup.object().shape({
    wellMatching: Yup.array().of(
        Yup.object().shape({
            name: Yup.array().nullable(),
        })
    ),
});

export const advancedFilterValidation = Yup.object().shape({
    obj: Yup.array().of(
        Yup.object().shape({
            condition: Yup.string().required("This field is required."),
            filter: Yup.array().of(
                Yup.object().shape({
                    dataPoint: Yup.string().required("This field is required."),
                    fields: Yup.string().required("This field is required."),
                    operator: Yup.string().required("This field is required."),
                    // value: Yup.string().required("This field is required."),
                    value: Yup.string().test(
                        "checking for required",
                        "This field is required.",
                        function (value) {
                            if (
                                !value &&
                                this.parent.operator &&
                                (this.parent.operator === "6" ||
                                    this.parent.operator === "7")
                            ) {
                                return true;
                            }
                            if (value) {
                                return true;
                            }
                            return false;
                        }
                    ),
                    upperValue: Yup.string()
                        .transform((value) =>
                            typeof value === "object"
                                ? JSON.stringify(value)
                                : value
                        )
                        .test(
                            "checking for depth",
                            "This field is required.",
                            function (value) {
                                if (
                                    !value &&
                                    this.parent.fields === "7" &&
                                    this.parent.operator &&
                                    this.parent.operator === "4"
                                ) {
                                    return false;
                                }
                                return true;
                            }
                        )
                        .test(
                            "checking for county",
                            "This field is required.",
                            function (value) {
                                if (!value && this.parent.fields === "9") {
                                    return false;
                                }
                                return true;
                            }
                        ),
                    endDate: Yup.string().test(
                        "checking for required",
                        "This field is required.",
                        function (value) {
                            if (
                                !value &&
                                (this.parent.fields === "16" ||
                                    this.parent.fields === "17" ||
                                    this.parent.fields === "18") &&
                                this.parent.operator === "14"
                            ) {
                                return false;
                            }
                            return true;
                        }
                    ),
                })
            ),
        })
    ),
});

export const saveSegmentValidation = Yup.object().shape({
    segmentName: Yup.string().required("This Field is required."),
});

export const ChooseColExportToCsvModalValidation = Yup.object().shape({});

export const alertsTabNotiValidation = Yup.object().shape({
    notification: Yup.array().of(
        Yup.object().shape({
            None: Yup.boolean(),
            is_in_platform: Yup.boolean(),
            is_email: Yup.boolean(),
            // is_mobile_push: Yup.boolean(),
        })
    ),
});

export const alertCountyValidation = Yup.object().shape({
    county: Yup.array().of(
        Yup.object().shape({
            label: Yup.string(),
            value: Yup.string(),
        })
    ),
});

export const requestMoreSeatValidation = Yup.object().shape({
    seatNumber: Yup.string()
        .required("This Field is required.")
        .max(2, "Max 2 digit value is allow"),
});

export const forecastingFilterObjValidation = Yup.object().shape({
    wlife: Yup.string()
        .test(
            "is required",
            "Well Life (months) is required.",
            function (value) {
                if (!value) {
                    return false;
                }
                return true;
            }
        )
        .test(
            "is greater than zero",
            "Well Life (months) should be greater than 0",
            function (value) {
                if (value && Number(value) > 0) {
                    return true;
                }
                return false;
            }
        )
        .test(
            "should be greater than array value",
            `Well Life (months) should be greater than`,
            function (value) {
                if (
                    value &&
                    Number(value) <
                        Number(sessionStorage.getItem("wlifMinValue"))
                ) {
                    return false;
                }
                return true;
            }
        ),
    ftype: Yup.string(),
    qi_solution: Yup.string(),
    qi_fixed: Yup.string()
        .test(
            "Fixed qi is required.",
            "Fixed qi is required.",
            function (value) {
                if (!value && this.parent.qi_solution === "fixed") {
                    return false;
                }
                return true;
            }
        )
        .test(
            "is greater than zero",
            "Fixed qi should be greater than 0",
            function (value) {
                if (this.parent.qi_solution !== "fixed") {
                    return true;
                }
                if (Number(value) > 0) {
                    return true;
                }
                return false;
            }
        ),
    // .test(
    //     "is less than 100",
    //     "Fixed qi should be less or equal to than 100%",
    //     function (value) {
    //         if (Number(value) > 100) {
    //             return false;
    //         }
    //         return true;
    //     }
    // ),
    ai_solution: Yup.string(),
    ai_fixed: Yup.string()
        .test(
            "Fixed ai is required.",
            "Fixed ai is required.",
            function (value) {
                if (!value && this.parent.ai_solution === "fixed") {
                    return false;
                }
                return true;
            }
        )
        .test(
            "is greater than zero",
            "Fixed ai should be greater than 0 and less than 100",
            function (value) {
                if (this.parent.ai_solution === "variable") {
                    return true;
                }
                if (
                    Number(
                        value?.includes("%")
                            ? value?.slice(0, value.length - 1)
                            : value
                    ) > 0 &&
                    Number(
                        value?.includes("%")
                            ? value?.slice(0, value.length - 1)
                            : value
                    ) <= 100
                ) {
                    return true;
                }
                return false;
            }
        ),
    // .test(
    //     "is less than 100",
    //     "Fixed ai should be less or equal to than 100%",
    //     function (value) {
    //         if (Number(value) > 100) {
    //             return false;
    //         }
    //         return true;
    //     }
    // )
    b_solution: Yup.string(),
    bmin: Yup.string()
        .test(
            "Minimum b is required.",
            "Minimum b is required.",
            function (value) {
                if (
                    (this.parent.b_solution === "variable" &&
                        this.parent.ftype === "exp") ||
                    this.parent.b_solution === "fixed"
                ) {
                    return true;
                }
                if (
                    this.parent.b_solution === "fixed" &&
                    this.parent.ftype === "exp"
                ) {
                    return true;
                } else {
                    if (!value) return false;
                }
                return true;
            }
        )
        .test(
            "bmin must be >0 and < bmax",
            "Minimum b must be greater than 0.00 and less than Maximum b.",
            function (value) {
                if (
                    value &&
                    (Number(value) === 0 ||
                        (this.parent.bmax &&
                            Number(value) > Number(this.parent.bmax)))
                ) {
                    return false;
                }
                return true;
            }
        ),
    bmax: Yup.string()
        .test(
            "Maximum b is required.",
            "Maximum b is required.",
            function (value) {
                if (
                    this.parent.ftype === "exp" ||
                    this.parent.b_solution === "fixed"
                ) {
                    return true;
                } else {
                    if (!value) return false;
                }
                return true;
            }
        )
        .test(
            "bmax must be >bmin and <=5",
            "Maximum b must be greater than Minimum b and should be less than 5.00",
            function (value) {
                if (
                    value &&
                    ((this.parent.bmin &&
                        Number(value) < Number(this.parent.bmin)) ||
                        Number(value) > 5)
                ) {
                    return false;
                }
                return true;
            }
        ),
    b_fixed: Yup.string()
        .test("Fixed b is required.", "Fixed b is required.", function (value) {
            if (!value && this.parent.b_solution === "fixed") {
                return false;
            }
            return true;
        })
        .test(
            "Fixed b  Fixed b >0.00 and <=5.00",
            "Fixed b must be greater than 0.00 and should be less than or equal to 5.00.",
            function (value) {
                if (value && (Number(value) === 0 || Number(value) > 5)) {
                    return false;
                }
                return true;
            }
        ),
    dlim: Yup.string()
        .test(
            "Limiting Decline is required.",
            "Limiting Decline is required.",
            function (value) {
                if (!value && this.parent.ftype !== "exp") {
                    return false;
                }
                return true;
            }
        )
        .test(
            "is greater than zero",
            "Limiting Decline should be greater than 0 and less than 100",
            function (value) {
                if (this.parent.ftype === "exp") {
                    return true;
                }
                if (
                    Number(
                        value?.includes("%")
                            ? value?.slice(0, value.length - 1)
                            : value
                    ) > 0 &&
                    Number(
                        value?.includes("%")
                            ? value?.slice(0, value.length - 1)
                            : value
                    ) <= 100
                ) {
                    return true;
                }
                return false;
            }
        ),
    // .test(
    //     "Dlim must be >0 and <=0.1 (10% for user input",
    //     "Limiting Decline must be should be less than or equal to 1%.",
    //     function (value) {
    //         if (value && Number(value) > 1) {
    //             return false;
    //         }
    //         return true;
    //     }
    // )
});

export const forecastingFilterTypeCurveObjValidation = Yup.object().shape({
    wlife: Yup.string()
        .test(
            "is required",
            "Well Life (months) is required.",
            function (value) {
                if (!value) {
                    return false;
                }
                return true;
            }
        )
        .test(
            "is greater than zero",
            "Well Life (months) should be greater than 0",
            function (value) {
                if (value && Number(value) > 0) {
                    return true;
                }
                return false;
            }
        )
        .test(
            "should be greater than array value",
            `Well Life (months) should be greater than`,
            function (value) {
                if (
                    value &&
                    Number(value) <
                        Number(sessionStorage.getItem("wlifMinValue"))
                ) {
                    return false;
                }
                return true;
            }
        ),
    ftype: Yup.string(),
    qi_solution: Yup.string(),
    qi_fixed: Yup.string()
        .test(
            "Fixed qi is required.",
            "Fixed qi is required.",
            function (value) {
                if (!value && this.parent.qi_solution === "fixed") {
                    return false;
                }
                return true;
            }
        )
        .test(
            "is greater than zero",
            "Fixed qi should be greater than 0",
            function (value) {
                if (this.parent.qi_solution !== "fixed") {
                    return true;
                }
                if (Number(value) > 0) {
                    return true;
                }
                return false;
            }
        ),
    // .test(
    //     "is less than 100",
    //     "Fixed qi should be less or equal to than 100%",
    //     function (value) {
    //         if (Number(value) > 100) {
    //             return false;
    //         }
    //         return true;
    //     }
    // ),
    ai_solution: Yup.string(),
    ai_fixed: Yup.string()
        .test(
            "Fixed ai is required.",
            "Fixed ai is required.",
            function (value) {
                if (!value && this.parent.ai_solution === "fixed") {
                    return false;
                }
                return true;
            }
        )
        .test(
            "is greater than zero",
            "Fixed ai should be greater than 0 and less than 100",
            function (value) {
                if (this.parent.ai_solution === "variable") {
                    return true;
                }
                if (
                    Number(
                        value?.includes("%")
                            ? value?.slice(0, value.length - 1)
                            : value
                    ) > 0 &&
                    Number(
                        value?.includes("%")
                            ? value?.slice(0, value.length - 1)
                            : value
                    ) <= 100
                ) {
                    return true;
                }
                return false;
            }
        ),
    // .test(
    //     "is less than 100",
    //     "Fixed ai should be less or equal to than 100%",
    //     function (value) {
    //         if (Number(value) > 100) {
    //             return false;
    //         }
    //         return true;
    //     }
    // )
    b_solution: Yup.string(),
    bmin: Yup.string()
        .test(
            "Minimum b is required.",
            "Minimum b is required.",
            function (value) {
                if (
                    (this.parent.b_solution === "variable" &&
                        this.parent.ftype === "exp") ||
                    this.parent.b_solution === "fixed"
                ) {
                    return true;
                }
                if (
                    this.parent.b_solution === "fixed" &&
                    this.parent.ftype === "exp"
                ) {
                    return true;
                } else {
                    if (!value) return false;
                }
                return true;
            }
        )
        .test(
            "bmin must be >0 and < bmax",
            "Minimum b must be greater than 0.00 and less than Maximum b.",
            function (value) {
                if (
                    value &&
                    (Number(value) === 0 ||
                        (this.parent.bmax &&
                            Number(value) > Number(this.parent.bmax)))
                ) {
                    return false;
                }
                return true;
            }
        ),
    bmax: Yup.string()
        .test(
            "Maximum b is required.",
            "Maximum b is required.",
            function (value) {
                if (
                    this.parent.ftype === "exp" ||
                    this.parent.b_solution === "fixed"
                ) {
                    return true;
                } else {
                    if (!value) return false;
                }
                return true;
            }
        )
        .test(
            "bmax must be >bmin and <=5",
            "Maximum b must be greater than Minimum b and should be less than 5.00",
            function (value) {
                if (
                    value &&
                    ((this.parent.bmin &&
                        Number(value) < Number(this.parent.bmin)) ||
                        Number(value) > 5)
                ) {
                    return false;
                }
                return true;
            }
        ),
    b_fixed: Yup.string()
        .test("Fixed b is required.", "Fixed b is required.", function (value) {
            if (!value && this.parent.b_solution === "fixed") {
                return false;
            }
            return true;
        })
        .test(
            "Fixed b  Fixed b >0.00 and <=5.00",
            "Fixed b must be greater than 0.00 and should be less than or equal to 5.00.",
            function (value) {
                if (value && (Number(value) === 0 || Number(value) > 5)) {
                    return false;
                }
                return true;
            }
        ),
    dlim: Yup.string()
        .test(
            "Limiting Decline is required.",
            "Limiting Decline is required.",
            function (value) {
                if (!value && this.parent.ftype !== "exp") {
                    return false;
                }
                return true;
            }
        )
        .test(
            "is greater than zero",
            "Limiting Decline should be greater than 0 and less than 100",
            function (value) {
                if (this.parent.ftype === "exp") {
                    return true;
                }
                if (
                    Number(
                        value?.includes("%")
                            ? value?.slice(0, value.length - 1)
                            : value
                    ) > 0 &&
                    Number(
                        value?.includes("%")
                            ? value?.slice(0, value.length - 1)
                            : value
                    ) <= 100
                ) {
                    return true;
                }
                return false;
            }
        ),
    // .test(
    //     "Dlim must be >0 and <=0.1 (10% for user input",
    //     "Limiting Decline must be should be less than or equal to 1%.",
    //     function (value) {
    //         if (value && Number(value) > 1) {
    //             return false;
    //         }
    //         return true;
    //     }
    // )
    peak_solution: Yup.string(),
    peak_month: Yup.string()
        .test(
            "Fixed peak month is required.",
            "Fixed peak month is required.",
            function (value) {
                if (!value && this.parent.peak_solution === "fixed") {
                    return false;
                }
                return true;
            }
        )
        .test(
            "Fixed peak month >=0",
            "Fixed b must be greater and equal to 0.",
            function (value) {
                if (value && Number(value) < 0) {
                    return false;
                }
                return true;
            }
        ),
});
