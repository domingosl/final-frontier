const rapydApi = utilities.dependencyLocator.get('rapydApi');

new utilities.express.Service('createRefundController')
    .isPost()
    .respondsAt('/refunds')
    .controller(async (req, res) => {

        const payload = {
            ewallet: process.env.COMPANY_WALLET_ID,
            category: 'bank',
            payout_amount: req.body.amount,
            payout_method_type: req.body.payoutMethodType,
            sender_currency: req.body.senderCurrency,
            sender_country: process.env.COMPANY_ISO_COUNTRY,
            beneficiary_country: req.body.beneficiaryCountry,
            payout_currency: req.body.payoutCurrency,
            sender_entity_type: 'company',
            beneficiary_entity_type: 'individual',
            beneficiary: {...req.body.beneficiary, country: req.body.beneficiaryCountry},
            sender: {
                company_name: process.env.COMPANY_NAME,
                identification_type: process.env.COMPANY_IDENTIFICATION_TYPE,
                identification_value: process.env.COMPANY_NUMBER,
                phone_number: process.env.COMPANY_PHONE_NUMBER,
                occupation: process.env.COMPANY_OCCUPATION,
                source_of_income: "business",
                address: process.env.COMPANY_ADDRESS,
                beneficiary_relationship: "client"
            },
            description: req.body.description
        };

        console.log(payload);

        const response = await rapydApi.Payouts.Beneficiaries.create(payload);

        res.resolve(response.data);

    });