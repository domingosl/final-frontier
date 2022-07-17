require('dotenv').config({ path: '../.env' } );

const RapydApi = require('rapyd-node-sdk');

const rapydApi = new RapydApi(process.env.RAPYD_ACCESS_KEY, process.env.RAPYD_SECRET_KEY, 'sandbox');

const run = async () => {



    const response = await rapydApi.Wallets.create(
        {
            "first_name": "Final Frontier CO.",
            "last_name": "",
            "business_details": {
                "entity_type": "association",
                "name": "Final Frontier CO.",
                "registration_number": "112212345",
                "industry_category": "company",
                "industry_sub_category": "tourism",
                "address": {
                    "name": "John Doe",
                    "line_1": "1234 Main Street",
                    "line_2": "Suite 1200",
                    "line_3": "",
                    "city": "Anytown",
                    "state": "NY",
                    "country": "US",
                    "zip": "10101",
                    "phone_number": "14155557778"
                }
            },
            "ewallet_reference_id": "company_main_wallet",
            "type": "company"
        }
    );

    console.log(response);

};

run();