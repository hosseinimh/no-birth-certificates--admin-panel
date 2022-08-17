import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { InsertPage } from "../_layout";
import { Relative as Entity } from "../../../http/entities";
import {
    editRelivePage as strings,
    general,
    relativesTitle,
    validation,
} from "../../../constants/strings";
import { editRelativeSchema as schema } from "../../validations";
import {
    MESSAGE_TYPES,
    MESSAGE_CODES,
    basePath,
    UPLOADED_FILE,
} from "../../../constants";
import {
    setLoadingAction,
    setTitleAction,
} from "../../../state/layout/layoutActions";
import {
    clearMessageAction,
    setMessageAction,
} from "../../../state/message/messageActions";
import utils from "../../../utils/Utils";

const EditRelative = () => {
    const dispatch = useDispatch();
    const layoutState = useSelector((state) => state.layoutReducer);
    const messageState = useSelector((state) => state.messageReducer);
    const navigate = useNavigate();
    const backUrl = `${basePath}/relatives`;
    const studentsUrl = `${basePath}/students`;
    let entity = new Entity();
    let { relativeId } = useParams();
    relativeId = parseInt(relativeId);
    const [date, setDate] = useState(null);
    const [image, setImage] = useState(null);
    const [studentId, setStudentId] = useState(0);
    const relatives = [
        { id: 1, title: relativesTitle.father },
        { id: 2, title: relativesTitle.mother },
        { id: 3, title: relativesTitle.brother },
        { id: 4, title: relativesTitle.sister },
        { id: 5, title: relativesTitle.grandFather },
        { id: 6, title: relativesTitle.grandMother },
        { id: 7, title: relativesTitle.other },
    ];
    const [selectedRelative, setSelectedRelative] = useState({
        id: 1,
        title: relativesTitle.father,
    });
    const [isCurrent, setIsCurrent] = useState(true);
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const fillForm = async () => {
        dispatch(setLoadingAction(true));

        let result = await entity.get(relativeId);

        if (result === null) {
            dispatch(
                setMessageAction(
                    general.itemNotFound,
                    MESSAGE_TYPES.ERROR,
                    MESSAGE_CODES.ITEM_NOT_FOUND,
                    false
                )
            );
            navigate(studentsUrl);

            return;
        }

        setStudentId(result.item.student_id);
        setValue("name", result.item.name);
        setValue("family", result.item.family);
        setValue("relation", result.item.relation);
        setValue("relationText", result.item?.relation_text ?? "");
        setSelectedRelative({
            id: result.item.relation + "",
            title: result.item?.relation_text ?? "",
        });
        dispatch(
            setTitleAction(
                `${strings._title} [ ${result?.item?.student_name} ${result?.item?.student_family} ]`
            )
        );
        dispatch(setLoadingAction(false));
    };

    const onSubmit = async (data) => {
        dispatch(setLoadingAction(true));
        dispatch(clearMessageAction());
        window.scrollTo(0, 0);

        if (date === null) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    strings.dateRequired,
                    MESSAGE_TYPES.ERROR,
                    MESSAGE_CODES.FORM_INPUT_INVALID,
                    true,
                    "date"
                )
            );

            return;
        }

        if (selectedRelative.id === "7") {
            if (data?.relationText?.length < 3) {
                dispatch(setLoadingAction(false));
                dispatch(
                    setMessageAction(
                        validation.minMessage
                            .replace(":field", strings.relationText)
                            .replace(":min", "3"),
                        MESSAGE_TYPES.ERROR,
                        MESSAGE_CODES.FORM_INPUT_INVALID,
                        true,
                        "relationText"
                    )
                );

                return;
            }

            if (data?.relationText?.length > 50) {
                dispatch(setLoadingAction(false));
                dispatch(
                    setMessageAction(
                        validation.maxMessage
                            .replace(":field", strings.relationText)
                            .replace(":max", "50"),
                        MESSAGE_TYPES.ERROR,
                        MESSAGE_CODES.FORM_INPUT_INVALID,
                        true,
                        "relationText"
                    )
                );

                return;
            }
        }

        let result = await entity.update(
            relativeId,
            data.name,
            data.family,
            utils.convertNumberToEnglish(date),
            selectedRelative.id,
            selectedRelative.id === "7"
                ? data.relationText
                : selectedRelative.title,
            image
        );

        if (result === null) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        if (
            image &&
            (!result?.uploaded || result?.uploaded !== UPLOADED_FILE.OK)
        ) {
            dispatch(setLoadingAction(false));
            dispatch(
                setMessageAction(
                    result?.uploadedText,
                    MESSAGE_TYPES.ERROR,
                    result?.uploaded,
                    true,
                    "image"
                )
            );

            return;
        }

        dispatch(
            setMessageAction(
                strings.saved,
                MESSAGE_TYPES.SUCCESS,
                MESSAGE_CODES.OK,
                false
            )
        );
        navigate(backUrl + "/" + studentId);
    };

    const onCancel = () => {
        navigate(backUrl + "/" + studentId);
    };

    const convert = () => {
        let persian = new Date().toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });

        return persian.toString();
    };

    useEffect(() => {
        dispatch(setTitleAction(strings._title));

        if (isNaN(relativeId) || relativeId <= 0) {
            dispatch(
                setMessageAction(
                    general.itemNotFound,
                    MESSAGE_TYPES.ERROR,
                    MESSAGE_CODES.ITEM_NOT_FOUND,
                    false
                )
            );
            navigate(backUrl + "/" + studentId);

            return;
        }

        document.querySelector("[name='relation']").selectedIndex = 0;

        let date = convert();

        setDate(date);
        fillForm();

        return () => {
            setIsCurrent(false);
        };
    }, []);

    const onSelectedRelativeChanged = (e) => {
        setSelectedRelative({
            id: e?.target?.value,
            title: e?.target?.options[e?.target?.selectedIndex]?.text,
        });
    };

    const onChangeFile = (e) => {
        const file = e?.target?.files[0];

        if (file) {
            setImage(file);
        }
    };

    const renderInputRow = (field, type = "text", placeholder = null) => {
        placeholder = placeholder
            ? placeholder
            : strings[`${field}Placeholder`];

        return (
            <div className="col-md-4 col-sm-12 pb-4">
                <label className="form-label" htmlFor={field}>
                    {strings[field]}
                </label>
                <input
                    {...register(`${field}`)}
                    className={
                        messageState?.messageField === field
                            ? "form-control is-invalid"
                            : "form-control"
                    }
                    id={field}
                    placeholder={strings[`${field}Placeholder`]}
                    disabled={layoutState?.loading}
                    type={type}
                />
                {messageState?.messageField === field && (
                    <div className="invalid-feedback">
                        {messageState?.message}
                    </div>
                )}
            </div>
        );
    };

    const renderDateRow = (field, label, value, handleChange) => (
        <div className="col-md-2 col-sm-12 pb-4">
            <label
                className="form-label"
                style={{ marginLeft: "1rem", display: "block" }}
                htmlFor={field}
            >
                {label}
            </label>
            <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                value={value}
                onChange={(e) => {
                    handleChange(e?.toString());
                }}
                inputClass="form-control"
                id={field}
                disabled={layoutState?.loading}
            />
            {messageState?.messageField === field && (
                <div className="invalid-feedback">{messageState?.message}</div>
            )}
        </div>
    );

    const renderSelectRow = (field, items, key, value, handleChange = null) => (
        <div className="col-md-3 col-sm-12 pb-4">
            <label className="form-label" htmlFor={field}>
                {strings[field]}
            </label>
            <select
                {...register(`${field}`)}
                className={
                    messageState?.messageField === field
                        ? "form-select is-invalid"
                        : "form-select"
                }
                aria-label={`select ${field}`}
                disabled={layoutState?.loading}
                onChange={(e) => {
                    if (handleChange) handleChange(e);
                }}
            >
                {items?.map((item, index) => (
                    <option value={item[key]} key={index}>
                        {item[value]}
                    </option>
                ))}
            </select>
            {messageState?.messageField === field && (
                <div className="invalid-feedback">{messageState?.message}</div>
            )}
        </div>
    );

    const renderFileRow = (field) => (
        <div className="col-md-4 col-sm-12 pb-4">
            <label className="form-label" htmlFor={field}>
                {strings[field]}
            </label>
            <input
                {...register(`${field}`)}
                className={
                    messageState?.messageField === field
                        ? "form-control is-invalid"
                        : "form-control"
                }
                id={field}
                placeholder={strings[`${field}Placeholder`]}
                disabled={layoutState?.loading}
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => onChangeFile(e)}
            />
            {messageState?.messageField === field && (
                <div className="invalid-feedback">{messageState?.message}</div>
            )}
        </div>
    );

    const renderForm = () => (
        <div className="card mb-4">
            <div className="card-body">
                <div className="row">
                    {renderInputRow("name")}
                    {renderInputRow("family")}
                    {renderDateRow("date", strings.date, date, setDate)}
                    {renderSelectRow(
                        "relation",
                        relatives,
                        "id",
                        "title",
                        onSelectedRelativeChanged
                    )}
                    {selectedRelative?.id === "7" &&
                        renderInputRow("relationText")}
                    {renderFileRow("image")}
                </div>
            </div>
            <div className="card-footer">
                <div className="row">
                    <div className="col-sm-12">
                        <button
                            className="btn btn-success px-4 ml-2"
                            type="button"
                            title={general.submit}
                            onClick={handleSubmit(onSubmit)}
                            disabled={layoutState?.loading}
                        >
                            {general.submit}
                        </button>
                        <button
                            className="btn btn-secondary px-4"
                            type="button"
                            title={general.cancel}
                            onClick={onCancel}
                            disabled={layoutState?.loading}
                        >
                            {general.cancel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!isCurrent) <></>;

    return (
        <InsertPage page={"Students"} errors={errors}>
            <div className="row">
                <div className="col-12">{renderForm()}</div>
            </div>
        </InsertPage>
    );
};

export default EditRelative;
