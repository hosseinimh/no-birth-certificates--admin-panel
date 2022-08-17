import * as yup from "yup";
import {
    validation,
    relativesPage as strings,
} from "../../../constants/strings";

const relativeSearchSchema = yup.object().shape({
    nameFamily: yup
        .string(validation.stringMessage.replace(":field", strings.nameFamily))
        .max(
            50,
            validation.maxMessage
                .replace(":field", strings.nameFamily)
                .replace(":max", "50")
        ),
});

export default relativeSearchSchema;
