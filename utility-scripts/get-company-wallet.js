require('dotenv').config({ path: '../.env' } );

const RapydApi = require('rapyd-node-sdk');

const rapydApi = new RapydApi(process.env.RAPYD_ACCESS_KEY, process.env.RAPYD_SECRET_KEY, 'sandbox');

const run = async () => {

    const response = await rapydApi.Wallets.read(process.env.COMPANY_WALLET_ID);

    console.log(response);

};

run();