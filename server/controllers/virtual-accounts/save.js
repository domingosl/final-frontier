const Joi = require('joi');

const rapydApi = utilities.dependencyLocator.get('rapydApi');
const validator = utilities.dependencyLocator.get('joiValidator');

const bodySchema = Joi.object({
    flightId: Joi.number().required(),
    country: Joi.string().min(2).max(2).required(),
    currency: Joi.string().min(3).max(3).required(),
    firstName: Joi.string().min(2).max(120).required().label("Traveler's first name"),
    lastName: Joi.string().min(2).max(120).required().label("Traveler's last name"),
    gender: Joi.string().min(1).max(1).required().label("Traveler's gender"),
    birthDay: Joi.date().required().label("Traveler's date of birth"),
    documentType: Joi.string().allow('passport', 'driver licence', 'id document').required().label("A document type"),
    documentNumber: Joi.string().min(2).max(120).required().label("A document number"),
    phone: Joi.string().min(2).max(50).required().label("Traveler's phone"),
    email: Joi.string().email().required().label("Traveler's email")
});

new utilities.express.Service('countryCurrencyCouple')
    .isPost()
    .isPublic()
    .respondsAt('/virtual-accounts')
    .controller(async (req, res) => {

        validator.validateOrBreak(bodySchema, req.body);

        if(req.query.justValidation)
            return res.resolve();

        const merchantReferenceId = "traveler_" +
            req.body.firstName.toLowerCase().replace(/ /g, '_').substring(0,2) + "_" +
            req.body.lastName.toLowerCase().replace(/ /g, '_').substring(0,2) + "_" +
            req.body.documentNumber.toLowerCase().replace(/ /g, '_')

        const flight = api.config.flights.find(flight => flight.id === req.body.flightId);
        if(!flight)
            return res.forbidden("Invalid flight id");


        const response = await rapydApi.Issuing.BankAccounts.create({
            currency: req.body.currency.toUpperCase(),
            country: req.body.country.toUpperCase(),
            description: "Issue virtual account number for traveler payment",
            ewallet: process.env.COMPANY_WALLET_ID,
            merchant_reference_id: merchantReferenceId,
            metadata: {
                flight: flight.id,
                paymentType: "flightPayment",
                travelerName: req.body.firstName,
                travelerLastName: req.body.lastName,
                travelerDocumentType: req.body.documentType,
                travelerDocumentNumber: req.body.documentNumber
            }
        });

        utilities.logger.debug("Response from Rapyd", response.data);

        return res.resolve(response.data.bank_account);

    });