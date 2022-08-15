import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Page } from "../_layout";
import { Student as Entity } from "../../../http/entities";
import { studentsPage as strings, general } from "../../../constants/strings";
import { Table } from "../../components";
import {
    MESSAGE_TYPES,
    imgPath,
    basePath,
    MESSAGE_CODES,
} from "../../../constants";
import { studentSearchSchema as schema } from "../../validations";
import {
    setLoadingAction,
    setTitleAction,
} from "../../../state/layout/layoutActions";
import {
    clearMessageAction,
    setMessageAction,
} from "../../../state/message/messageActions";
import utils from "../../../utils/Utils";
import { BsFillFileExcelFill, BsPencilFill } from "react-icons/bs";

const Students = () => {
    const dispatch = useDispatch();
    const layoutState = useSelector((state) => state.layoutReducer);
    const messageState = useSelector((state) => state.messageReducer);
    const navigate = useNavigate();
    let entity = new Entity();
    const columnsCount = 4;
    const [formData, setFormData] = useState(null);
    const [items, setItems] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [itemsCount, setItemsCount] = useState(0);
    const [item, setItem] = useState(null);
    const [action, setAction] = useState(null);
    const [removeModal, setRemoveModal] = useState(null);
    const [isCurrent, setIsCurrent] = useState(true);
    const { register, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });
    const { handleSubmit: handleRemoveSubmit, clearErrors: resetRemoveErrors } =
        useForm();

    const setPage = (page) => {
        submit({ ...formData, page });
    };

    const fillForm = async (data) => {
        dispatch(clearMessageAction());
        dispatch(setLoadingAction(true));

        let result = await entity.getPagination(data.nameFamily, data.page);

        if (result === null) {
            setItems(null);
            setPageNumber(1);
            setItemsCount(0);
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

        setItems(result.items);
        setPageNumber(data.page);
        setItemsCount(result.count);

        dispatch(setLoadingAction(false));
    };

    const submit = async (data) => {
        setFormData(data);

        data.page = !isNaN(data?.page) ? data.page : pageNumber;

        await fillForm(data);
    };

    const onSubmit = (data) => {
        setItems(null);
        setPageNumber(1);
        setItemsCount(0);
        submit({ ...data, page: 1 });
    };

    const onAdd = () => {
        setAction("ADD");
    };

    const onEdit = (id) => {
        setItem(id);
        setAction("EDIT");
    };

    const onRemove = (id) => {
        setItem(id);
        setAction("REMOVE");
    };

    const addStudent = () => {
        navigate(`${basePath}/students/add`);
    };

    const editStudent = () => {
        navigate(`${basePath}/students/edit/${item}`);
    };

    const removeStudent = async () => {
        dispatch(setLoadingAction(true));

        let result = await entity.get(item);

        if (result === null) {
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        setItem(result?.item);
        removeModal?.show();

        dispatch(setLoadingAction(false));
    };

    const reset = () => {
        removeModal?.hide();
        setItem(null);
        setAction(null);
        setPageNumber(1);
        resetRemoveErrors();
        window.scrollTo(0, 0);
    };

    const onRemoveSubmit = async () => {
        if (isNaN(item?.id)) {
            return;
        }

        dispatch(setLoadingAction(true));
        dispatch(clearMessageAction());

        let result = await entity.remove(item?.id);

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

        dispatch(
            setMessageAction(
                strings.studentRemoved,
                MESSAGE_TYPES.SUCCESS,
                MESSAGE_CODES.OK
            )
        );

        reset();
        submit({ ...formData, page: 1 });

        dispatch(setLoadingAction(false));
    };

    const renderRemoveModal = () => (
        <div
            className="modal fade"
            id="removeModal"
            tabIndex={"-1"}
            aria-labelledby="removeModal"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5
                            className="modal-title"
                            id="exampleModalCenterTitle"
                        >
                            {`${strings.removeStudentModalTitle} - [ ${
                                item?.name ?? ""
                            } ${item?.family ?? ""} ]`}
                        </h5>
                        <button
                            className="btn-close"
                            type="button"
                            data-coreui-dismiss="modal"
                            aria-label="Close"
                            disabled={layoutState?.loading}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p className="mb-0 text-center">
                            {strings.removeStudentModalBody}
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleRemoveSubmit(onRemoveSubmit)}
                            disabled={layoutState?.loading}
                        >
                            {general.yes}
                        </button>
                        <button
                            className="btn btn-secondary"
                            type="button"
                            data-coreui-dismiss="modal"
                        >
                            {general.no}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        if (action) {
            if (action === "ADD") {
                addStudent();
            } else if (action === "EDIT" && !isNaN(item)) {
                editStudent();
            } else if (action === "REMOVE" && !isNaN(item)) {
                removeStudent();
            }
        }
    }, [action]);

    useEffect(() => {
        dispatch(setTitleAction(strings._title));

        submit({ ...formData, page: 1 });

        const removeModalElement = document.getElementById("removeModal");

        if (removeModalElement) {
            let m = new coreui.Modal(removeModalElement);
            removeModalElement.addEventListener("hidden.coreui.modal", () => {
                setItem(null);
                setAction(null);
                resetRemoveErrors();
            });
            setRemoveModal(m);
        }

        return () => {
            setIsCurrent(false);
        };
    }, []);

    const renderFilterSection = () => (
        <div className="card mb-4">
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-6">
                        <input
                            {...register("nameFamily")}
                            className={
                                messageState?.messageField === "nameFamily"
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
                            maxLength="50"
                            placeholder={strings.nameFamily}
                            disabled={layoutState?.loading}
                        />
                        {messageState?.messageField === "nameFamily" && (
                            <div className="invalid-feedback">
                                {messageState?.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <div className="row">
                    <div className="col-sm-12">
                        <button
                            className="btn btn-dark px-4 ml-2"
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={layoutState?.loading}
                        >
                            {general.search}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHeader = () => (
        <tr>
            <th scope="col" style={{ width: "50px" }}>
                #
            </th>
            <th scope="col">{strings.nameFamily}</th>
            <th style={{ width: "200px" }} scope="col">
                {strings.date}
            </th>
            <th scope="col" style={{ width: "150px", textAlign: "center" }}>
                {general.actions}
            </th>
        </tr>
    );

    const renderFooter = () => {
        if (layoutState?.loading) {
            return;
        }

        let pagesCount = Math.ceil(itemsCount / 10);
        let prevStatus = pageNumber === 1 ? "disabled" : "";
        let nextStatus = pageNumber >= pagesCount ? "disabled" : "";
        let pages = [pageNumber];

        for (let i = pageNumber - 1; i >= 1 && i >= pageNumber - 2; i--) {
            pages.push(i);
        }

        for (
            let i = pageNumber + 1;
            i <= pagesCount && i <= pageNumber + 2;
            i++
        ) {
            pages.push(i);
        }

        pages.sort();

        return (
            <tr>
                <th scope="row" colSpan={columnsCount}>
                    <nav className="pagination" aria-label="...">
                        <ul className="pagination">
                            <li className={`page-item ${prevStatus}`}>
                                <a
                                    className="page-link"
                                    tabIndex={"-1"}
                                    aria-disabled="true"
                                    onClick={() => setPage(1)}
                                >
                                    {general.first}
                                </a>
                            </li>
                            <li className={`page-item ${prevStatus}`}>
                                <a
                                    className="page-link"
                                    aria-disabled="true"
                                    onClick={() => setPage(pageNumber - 1)}
                                >
                                    {general.previous}
                                </a>
                            </li>
                            {pages.map((page, index) => (
                                <li
                                    className={`page-item ${
                                        page === pageNumber ? "active" : ""
                                    }`}
                                    key={index}
                                >
                                    <a
                                        className="page-link"
                                        onClick={() => setPage(page)}
                                    >
                                        {utils.en2faDigits(page)}
                                    </a>
                                </li>
                            ))}
                            <li className={`page-item ${nextStatus}`}>
                                <a
                                    className="page-link"
                                    onClick={() => setPage(pageNumber + 1)}
                                >
                                    {general.next}
                                </a>
                            </li>
                            <li className={`page-item ${nextStatus}`}>
                                <a
                                    className="page-link"
                                    onClick={() => setPage(pagesCount)}
                                >
                                    {general.last}
                                </a>
                            </li>
                        </ul>
                        <span className="mx-4">
                            {utils.en2faDigits(itemsCount)} {general.records}
                        </span>
                    </nav>
                </th>
            </tr>
        );
    };

    const renderItems = () => {
        if (items && items.length > 0) {
            return items.map((item, index) => (
                <tr key={item.id}>
                    <td scope="row">{(pageNumber - 1) * 10 + index + 1}</td>
                    <td>
                        {item.name} {item.family}
                    </td>
                    <td style={{ direction: "ltr", textAlign: "right" }}>
                        {item.created_at_fa}
                    </td>
                    <td>
                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            onClick={() => onEdit(item.id)}
                            title={general.edit}
                            disabled={layoutState?.loading}
                        >
                            <BsPencilFill />
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            title={general.remove}
                            data-coreui-toggle="modal"
                            data-coreui-target="#removeModal"
                            data-coreui-tag={item.id}
                            onClick={() => onRemove(item.id)}
                            disabled={layoutState?.loading}
                        >
                            <BsFillFileExcelFill />
                        </button>
                    </td>
                </tr>
            ));
        }

        if (layoutState?.loading) {
            return (
                <tr>
                    <td colSpan={columnsCount} className="img-loading-wrapper">
                        <img
                            src={`${imgPath}/loading-form.gif`}
                            className="img-loading"
                        />
                    </td>
                </tr>
            );
        }

        return (
            <tr>
                <td colSpan={columnsCount}>{general.noDataFound}</td>
            </tr>
        );
    };

    if (!isCurrent) <></>;

    return (
        <Page page={"Students"}>
            {renderFilterSection()}
            <div className="row mb-2">
                <div className="col-sm-12 mb-4">
                    <button
                        className="btn btn-success px-4"
                        type="button"
                        title={strings.addStudent}
                        onClick={onAdd}
                        disabled={layoutState?.loading}
                    >
                        {strings.addStudent}
                    </button>
                </div>
            </div>
            <div className="row mb-4">
                <Table
                    items={items}
                    renderHeader={renderHeader}
                    renderItems={renderItems}
                    renderFooter={renderFooter}
                />
            </div>
            {renderRemoveModal()}
        </Page>
    );
};

export default Students;
