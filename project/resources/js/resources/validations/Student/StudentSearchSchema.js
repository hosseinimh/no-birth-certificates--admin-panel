import * as yup from "yup";
import {
    validation,
    studentsPage as strings,
} from "../../../constants/strings";

const studentSearchSchema = yup.object().shape({
    nameFamily: yup
        .string(validation.stringMessage.replace(":field", strings.nameFamily))
        .max(
            50,
            validation.maxMessage
                .replace(":field", strings.nameFamily)
                .replace(":max", "50")
        ),
});

export default studentSearchSchema;
