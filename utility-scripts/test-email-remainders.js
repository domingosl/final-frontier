require('dotenv').config({ path: '../.env' } );


const run = async () => {

    const postman = require('../server/services/postman');

    await postman.mailer.to('Domingo', process.env.SENDER_EMAIL)
        .setSubject('Almost time to go to space!')
        .setTemplate("7")
        .setParams({
            name: "Domingo",
            remainingAmount: "80.000 USD",
            paidAmount: "20.000 USD",
            paymentDetails: "Rapyd Holdings Pte. Ltd.\n83-85 Castlereagh Street, Sydney\nJPMorgan Chase Bank, Sydney Branch\nBSB: 212200\nBIC: CHASAU2X"
        }).send();
};

run();