require('dotenv').config({ path: '../.env' } );

const RapydApi = require('rapyd-node-sdk');

const rapydApi = new RapydApi(process.env.RAPYD_ACCESS_KEY, process.env.RAPYD_SECRET_KEY, 'sandbox');
rapydApi.events.on('log', (level, message, payload = {}) => console.log("LOG", { level, message, payload }));

const run = async () => {

    try {
        const response = await rapydApi.Issuing.SimulatedBankAccountTransfer.create({
            amount: 90000,
            currency: 'MXN',
            //issued_bank_account: 'issuing_3045e84eb9f11238964d14b141262f45'
            issued_bank_account: 'issuing_6a624c9b3409b6bbe66a86de004412f9'
        });

        console.log(response);
    }
    catch (e) {
        console.log(e);
    }
};

run();