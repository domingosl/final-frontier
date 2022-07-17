const tagLabel = 'joiValidatorService';

utilities.dependencyLocator.register('joiValidator', {
    validateOrBreak: (schema, data) => {

        const validation = schema.validate(data);

        if (!validation.error)
            return;


        let errors = {};
        validation.error.details.map(error => {
            errors[error.context.label] = error.message;
        });

        const {ValidationError} = api.customErrors;

        throw new ValidationError(errors);


    }
});