var CryptoJS = require("crypto-js");

function isValidEmail(value) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(value).toLowerCase());
}

function validateEmail(value, setEmailError) {
    if (value === "" || isValidEmail(value)) setEmailError("");
    else setEmailError("Invalid Email");
}

function validatePassword(value, setPasswordError) {
    if (value.length < 9) setPasswordError("Password must be 9 characters");
    else setPasswordError("");
}

function isJsonString(str) {
    try {
        str = JSON.stringify(str);
        str = str
            .replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
        str = str.replace(/[\u0000-\u0019]+/g, "");
        JSON.parse(str);
    } catch (e) {
        console.log(error);
        return false;
    }
    return true;
}

function clearLS() {
    localStorage.removeItem("email");
    localStorage.removeItem("user");
}

//get localStorage variable
const getLSVariable = (key) => {
    try {
        const text = localStorage.getItem(key);

        if (!text) return null;

        const bytes = CryptoJS.AES.decrypt(text, "api_resource");
        const value = bytes.toString(CryptoJS.enc.Utf8);

        return value;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const setLSVariable = (key, value) => {
    try {
        const text = CryptoJS.AES.encrypt(value, "api_resource").toString();

        localStorage.setItem(key, text);
    } catch (error) {
        console.log(error);
    }
};

const getLSUser = () => {
    let user = getLSVariable("user");

    if (!user) {
        clearLS();

        return null;
    }

    try {
        user = JSON.parse(user);
    } catch {
        console.log(error);
        clearLS();

        return null;
    }

    return user;
};

const addCommas = (num) =>
    num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const en2faDigits = (s) =>
    s
        ?.toString()
        .replace(/[0-9]/g, (w) =>
            String.fromCharCode(w.charCodeAt(0) + 1728)
        ) ?? "";

const convertNumberToEnglish = (s) =>
    s?.toString().replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

const convertNumberToPersion = () => {
    let persian = {
        0: "۰",
        1: "۱",
        2: "۲",
        3: "۳",
        4: "۴",
        5: "۵",
        6: "۶",
        7: "۷",
        8: "۸",
        9: "۹",
    };

    function traverse(el) {
        if (el.nodeType === 3) {
            var list = el.data.match(/[0-9]/g);

            if (list !== null && list.length !== 0) {
                for (var i = 0; i < list.length; i++)
                    el.data = el.data.replace(list[i], persian[list[i]]);
            }
        }

        for (var i = 0; i < el.childNodes.length; i++) {
            traverse(el.childNodes[i]);
        }
    }

    traverse(document.body);
};

const removeNonNumeric = (num) => num?.toString().replace(/[^0-9]/g, "");

const digitInputChange = (setValue, field, event) => {
    setValue(field, addCommas(removeNonNumeric(event.target.value)));
};

const utils = {
    isValidEmail,
    validateEmail,
    validatePassword,
    isJsonString,
    getLSVariable,
    setLSVariable,
    getLSUser,
    clearLS,
    digitInputChange,
    addCommas,
    en2faDigits,
    convertNumberToEnglish,
    convertNumberToPersion,
    removeNonNumeric,
};

export default utils;
