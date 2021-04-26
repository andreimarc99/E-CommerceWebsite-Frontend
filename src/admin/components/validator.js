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

            default: isValid = true;
        }

    }

    return isValid;
};

export default validate;