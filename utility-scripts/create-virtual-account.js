require('dotenv').config({ path: '../.env' } );

const RapydApi = require('rapyd-node-sdk');

const rapydApi = new RapydApi(process.env.RAPYD_ACCESS_KEY, process.env.RAPYD_SECRET_KEY, 'sandbox');
rapydApi.events.on('log', (level, message, payload = {}) => console.log("LOG", { level, message, payload }));

const run = async () => {

    try {
        const response = await rapydApi.Issuing.BankAccounts.create({
            "currency": "EUR",
            "country": "DE",
            "description": "Issue virtual account number to wallet",
            "ewallet": process.env.COMPANY_WALLET_ID,
            "merchant_reference_id": "traveler_001",
            "metadata": {
                "flight": "001",
                "type": "down payment",
            }
        });

        console.log(response);
    }
    catch (e) {
        console.log(e);
    }
};

run();