import React from "react";
import InputComponent from "./InputComponent";
import {
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form";

function NotificationList({
    notificationOptions,
    register,
    watch,
    setValue,
    nameKey,
    pushNoti
}: {
    notificationOptions: {
        name: string;
        description?: string;
    }[];
    register: UseFormRegister<any>;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
    nameKey: string;
    pushNoti?: boolean
}) {
    const notiBtnOption = pushNoti ? [
        { label: "None", value: "none" },
        { label: "In Platform", value: "is_in_platform" },
        { label: "Email", value: "is_email" },
        // { label: "Mobile Push", value: "is_mobile_push" },
    ] : [
        { label: "None", value: "none" },
        { label: "In-app", value: "is_in_app" },
        { label: "In-Email", value: "is_email" },
    ];
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const nameSplit = name.split(".");
        const index = Number(nameSplit[1]);
        const value = nameSplit[2];

        switch (value) {
            case "none":
                if (checked) {
                    setValue(`${nameKey}.${index}.is_in_app`, false);
                    setValue(`${nameKey}.${index}.is_email`, false);
                    pushNoti && setValue(`${nameKey}.${index}.is_in_platform`, false);
                }
                break;
            case "is_in_app":
                if (checked) {
                    setValue(`${nameKey}.${index}.none`, false);
                } else {
                    // if (!watch(`${nameKey}`)[index]["is_email"]) {
                    //     setValue(`${nameKey}.${index}.none`, true);
                    // }
                    if (!watch(`${nameKey}`)[index]["is_email"] && (pushNoti ? !watch(`${nameKey}`)[index]["is_in_platform"] : true)) {
                        setValue(`${nameKey}.${index}.none`, true);
                    }
                }
                break;
            // this  is same as is_in_app but name is different for alert page  
            case "is_in_platform":
                if (checked) {
                    setValue(`${nameKey}.${index}.none`, false);
                } else {
                    // if (!watch(`${nameKey}`)[index]["is_email"]) {
                    //     setValue(`${nameKey}.${index}.none`, true);
                    // }
                    if (!watch(`${nameKey}`)[index]["is_email"] && (pushNoti ? !watch(`${nameKey}`)[index]["is_in_platform"] : true)) {
                        setValue(`${nameKey}.${index}.none`, true);
                    }
                }
                break;
            case "is_email":
                if (checked) {
                    setValue(`${nameKey}.${index}.none`, false);
                } else {
                    // if (!watch(`${nameKey}`)[index]["is_in_app"]) {
                    //     setValue(`${nameKey}.${index}.none`, true);
                    // }
                    if (!watch(`${nameKey}`)[index]["is_in_app"] && (pushNoti ? !watch(`${nameKey}`)[index]["is_in_platform"] : true)) {
                        setValue(`${nameKey}.${index}.none`, true);
                    }
                }
                break;
            // case "is_mobile_push":
            //     if (checked) {
            //         setValue(`${nameKey}.${index}.none`, false);
            //     } else {
            //         // if (!watch(`${nameKey}`)[index]["is_in_app"]) {
            //         //     setValue(`${nameKey}.${index}.none`, true);
            //         // }
            //         if (!watch(`${nameKey}`)[index]["is_in_app"] && (pushNoti ? !watch(`${nameKey}`)[index]["is_email"] : true)) {
            //             setValue(`${nameKey}.${index}.none`, true);
            //         }
            //     }
            //     break;
            default:
                break;
        }
    };
    return (
        <ul>
            {notificationOptions.map((item, index) => {
                const { name, description } = item;
                return (
                    <li key={index}>
                        <div>
                            <h3>{name}</h3>
                            {description && <p>{description}</p>}
                        </div>
                        <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic radio toggle button group"
                        >
                            {notiBtnOption.map((_item, _index) => {
                                const { label, value } = _item;
                                return (
                                    <React.Fragment key={_index}>
                                        <InputComponent
                                            type="checkbox"
                                            className="btn-check"
                                            name={`${nameKey}.${index}.${value}`}
                                            id={`${nameKey}.${index}.${value}`}
                                            disabled={
                                                value === "none" &&
                                                    watch(`${nameKey}`) &&
                                                    watch(`${nameKey}`)[index][
                                                    "none"
                                                    ]
                                                    ? true
                                                    : false
                                            }
                                            register={register}
                                            onChange={onChange}
                                        />

                                        <label
                                            className="btn btn-primary"
                                            htmlFor={`${nameKey}.${index}.${value}`}
                                        >
                                            {label}
                                        </label>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

export default NotificationList;
