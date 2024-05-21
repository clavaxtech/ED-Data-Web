import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { alertCountyValidation } from '../../Helper/validation';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { OptionType } from '../models/submit-form';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import CartBasinMultiSelectFields from '../cartBasinToCounty/CartBasinMultiSelectFields';
import { deleteAlertCounty, handleSelectedCountyList, saveCountyList } from '../store/actions/alert-actions';
import { reactSelectProps } from '../models/page-props';
import { AlertModel } from '../models/redux-models';

function CountyDropDown() {
    const { control, setValue } =
        useForm({
            resolver: yupResolver(alertCountyValidation),
        });
    const { alerts: { countyList, selectedCountyList }, auth: { user: { access_token } } } = useAppSelector((state) => state);
    const countyRef = useRef<HTMLDivElement[]>([]);
    const loadOptions = async (
        search: string,
        prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
        { page }: any
    ) => {

        return {
            options: search
                ? [
                    ...countyList.filter((item) =>
                        item.label.toLowerCase().includes(search)
                    ),
                ] : countyList,
            hasMore: false,
            additional: {
                page: page + 1,
            },
        };
    };


    const dispatch = useAppDispatch();
    // this reference will be using to set the form value only one time when data is fetch from the api after will be not set value in the form
    const stopLoadingRef = useRef(false)

    useEffect(() => {
        if (!stopLoadingRef.current) {
            if (selectedCountyList && selectedCountyList.length > 0) {
                setValue('county', selectedCountyList);
                (stopLoadingRef.current = true);
            }
        }
        // eslint-disable-next-line
    }, [selectedCountyList])

    return (
        <>
            <div className="form-group">
                <div className="row">

                    <div
                        className={`col-md-4`}
                    >
                        <CartBasinMultiSelectFields
                            index={0}
                            async={true}
                            isMulti={true}
                            menuPosition={
                                "fixed"
                            }
                            name={"county"}
                            control={control}
                            defaultValue={[]}
                            itemsRef={countyRef}
                            showerror={
                                false
                            }
                            placeholderText={
                                "County"
                            }
                            onChangeHandle={(e, extraOption) => {
                                if (extraOption.action === "select-option") {
                                    // merging the prev array and new array because it will help to keep the id of previous selected array
                                    let tempData = (e as reactSelectProps[]).map((item, index) => {
                                        return index < selectedCountyList.length ? Object.assign({ ...selectedCountyList[index] }, { ...item }) : item
                                    })
                                    dispatch(handleSelectedCountyList(tempData as reactSelectProps[]))
                                    extraOption.option && dispatch(saveCountyList(access_token, [{
                                        county_name: extraOption.option?.label.split(" ").length > 2 ? `${extraOption.option?.label.split(" ")[0]} ${extraOption.option?.label.split(" ")[1]}` : extraOption.option?.label.split(" ")[0],
                                        state_abbr: extraOption.option?.value.split("_")[1],
                                    }]))
                                    return
                                }

                                if (extraOption.action === "deselect-option") {
                                    dispatch(handleSelectedCountyList((selectedCountyList as AlertModel["selectedCountyList"]).filter(item => {
                                        if (item.label === extraOption.option?.label && item.value === extraOption.option?.value) {
                                            "id" in item && dispatch(deleteAlertCounty(access_token, { id: item.id as number }))
                                        }
                                        return !(item.label === extraOption.option?.label && item.value === extraOption.option?.value)
                                    })))
                                    return
                                }
                            }}
                            removedOption={(value) => {
                                if (value.id) {
                                    "id" in value && dispatch(deleteAlertCounty(access_token, { id: value.id as number }))
                                }
                                dispatch(handleSelectedCountyList((selectedCountyList as AlertModel["selectedCountyList"]).filter(item => {
                                    return !(item.label === value?.label && item.value === value?.value)
                                })))
                            }}
                            fetchOptionHandler={
                                loadOptions
                            }
                            searchPlaceholderText={
                                ""
                            }
                            cacheUniqs={
                                []
                            }
                            extraField={
                                null
                            }
                        />
                    </div>
                </div>
            </div>
        </>

    )
}

export default CountyDropDown