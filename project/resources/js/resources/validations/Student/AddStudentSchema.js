import * as yup from "yup";
import {
    validation,
    addStudentPage as strings,
} from "../../../constants/strings";

const addStudentSchema = yup.object().shape({
    name: yup
        .string(validation.stringMessage.replace(":field", strings.name))
        .min(
            3,
            validation.minMessage
                .replace(":field", strings.name)
                .replace(":min", "3")
        )
        .max(
            100,
            validation.maxMessage
                .replace(":field", strings.name)
                .replace(":max", "100")
        )
        .required(validation.requiredMessage.replace(":field", strings.name)),
    family: yup
        .string(validation.stringMessage.replace(":field", strings.family))
        .min(
            3,
            validation.minMessage
                .replace(":field", strings.family)
                .replace(":min", "3")
        )
        .max(
            100,
            validation.maxMessage
                .replace(":field", strings.family)
                .replace(":max", "100")
        )
        .required(validation.requiredMessage.replace(":field", strings.family)),
    address: yup
        .string(validation.stringMessage.replace(":field", strings.address))
        .max(
            200,
            validation.maxMessage
                .replace(":field", strings.address)
                .replace(":max", "200")
        )
        .required(
            validation.requiredMessage.replace(":field", strings.address)
        ),
    phone: yup
        .string(validation.stringMessage.replace(":field", strings.phone))
        .min(
            11,
            validation.minMessage
                .replace(":field", strings.phone)
                .replace(":min", "11")
        )
        .max(
            50,
            validation.maxMessage
                .replace(":field", strings.phone)
                .replace(":max", "50")
        )
        .required(validation.requiredMessage.replace(":field", strings.phone)),
});

export default addStudentSchema;
