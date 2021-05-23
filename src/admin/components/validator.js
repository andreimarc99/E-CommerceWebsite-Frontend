const minLengthValidator = (value, minLength) => {
    return value.length >= minLength;
};

const minValueValidator = (value) => {
    return value >= 0;
};

const maxValueValidator = (value) => {
    return value <= 5;
};

const requiredValidator = value => {
    return value.trim() !== '';
};

const emailValidator = value => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (re.test(String(value).toLowerCase()));
}

const validate = (value, rules) => {
    let isValid = true;

    for (let rule in rules) {

        switch (rule) {
            case 'minLength': isValid = isValid && minLengthValidator(value, rules[rule]);
                break;

            case 'isRequired': isValid = isValid && requiredValidator(value);
                break;

            case 'minValue': isValid = isValid && minValueValidator(value);
                break;

            case 'maxValue': isValid = isValid && maxValueValidator(value);
                break;

            case 'email': isValid = isValid && emailValidator(value);
                break;

            default: isValid = true;
        }

    }

    return isValid;
};

export default validate;