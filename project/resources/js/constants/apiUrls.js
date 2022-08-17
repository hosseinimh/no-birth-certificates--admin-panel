const serverConfig = require("../../../server-config.json");
const { appEnv } = serverConfig;

export const SERVER_URL =
    appEnv === "local"
        ? "http://127.0.0.1:8000/api"
        : "https://project.hosseinimh.com/api";

export const DASHBOARD_API_URLS = {
    FETCH_REVIEW: `${SERVER_URL}/dashboard/review`,
};

export const USERS_API_URLS = {
    LOGIN: `${SERVER_URL}/users/login`,
    LOGOUT: `${SERVER_URL}/users/logout`,
    FETCH_USER: `${SERVER_URL}/users/show`,
    FETCH_USERS: `${SERVER_URL}/users`,
    UPDATE_USER: `${SERVER_URL}/users/update`,
    CHANGE_PASSWORD: `${SERVER_URL}/users/change_password`,
};

export const STUDENTS_API_URLS = {
    FETCH_STUDENT: `${SERVER_URL}/students/show`,
    FETCH_STUDENTS: `${SERVER_URL}/students`,
    STORE_STUDENT: `${SERVER_URL}/students/store`,
    UPDATE_STUDENT: `${SERVER_URL}/students/update`,
    REMOVE_STUDENT: `${SERVER_URL}/students/remove`,
};

export const RELATIVES_API_URLS = {
    FETCH_RELATIVE: `${SERVER_URL}/relatives/show`,
    FETCH_RELATIVES: `${SERVER_URL}/relatives`,
    STORE_RELATIVE: `${SERVER_URL}/relatives/store`,
    UPDATE_RELATIVE: `${SERVER_URL}/relatives/update`,
    REMOVE_RELATIVE: `${SERVER_URL}/relatives/remove`,
};
