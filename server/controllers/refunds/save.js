const mongoose = require('mongoose');
const Transactions = mongoose.model('Transaction');
const rapydApi = utilities.dependencyLocator.get('rapydApi');

const tagLabel = 'createRefundController';

new utilities.express.Service(tagLabel)
    .isPost()
    .respondsAt('/refunds')
    .controller(async (req, res) => {


        const transaction = await Transactions.findOne({ _id: req.body.transactionId });

        if(transaction.status !== 'accepted')
            return res.forbidden('The transaction cannot be refunded');

        const payload = {
            ewallet: process.env.COMPANY_WALLET_ID,
            category: 'bank',

            payout_amount: transaction.amount,
            payout_method_type: req.body.payoutMethodType,
            payout_currency: transaction.currency,

            sender_currency: transaction.currency,
            sender_country: process.env.COMPANY_ISO_COUNTRY,
            sender_entity_type: 'company',

            beneficiary_entity_type: 'individual',
            beneficiary_country: transaction.bankAccount.country_iso,

            beneficiary: {...req.body.beneficiary },
            sender: {
                company_name: process.env.COMPANY_NAME,
                identification_type: process.env.COMPANY_IDENTIFICATION_TYPE,
                identification_value: process.env.COMPANY_NUMBER,
                phone_number: process.env.COMPANY_PHONE_NUMBER,
                occupation: process.env.COMPANY_OCCUPATION,
                source_of_income: "business",
                address: process.env.COMPANY_ADDRESS,
                city: process.env.COMPANY_CITY,
                state: process.env.COMPANY_STATE,
                postcode: process.env.COMPANY_POSTCODE,
                description: process.env.COMPANY_DESCRIPTION,
                beneficiary_relationship: "customer"
            },
            description: req.body.description
        };

        utilities.logger.debug("Payload", {payload, tagLabel});

        const response = await rapydApi.Payouts.Bankwire.create(payload);

        transaction.status = 'refunded';
        await transaction.save();

        res.resolve(response.data);

    });