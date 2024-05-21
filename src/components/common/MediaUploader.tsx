import React from "react";
import { RouteProps } from "../models/page-props";
import { Controller } from "react-hook-form";
import { FileUploader } from "react-drag-drop-files";

const MediaUploader = ({
    handleChange,
    accept,
    className,
    children,
    control,
    name,
    errorMsg,
    multiple,
    disabled,
}: {
    handleChange?: (acceptedFiles: Blob | Blob[]) => void;
    accept?: string[];
    className?: string;
    children: RouteProps["children"];
    control: any;
    name: string;
    errorMsg?: string;
    multiple?: boolean;
    disabled?: boolean;
}) => {
    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, name, ref, ...field } }) => (
                    <FileUploader
                        handleChange={handleChange}
                        name={name}
                        types={accept}
                        classes={className}
                        multiple={multiple}
                        onChange={onChange}
                        disabled={disabled}
                    >
                        {children}
                    </FileUploader>
                )}
            />
            {errorMsg !== "undefined" && (
                <span className={`error`}>{errorMsg}</span>
            )}
        </>
    );
};

export default MediaUploader;
