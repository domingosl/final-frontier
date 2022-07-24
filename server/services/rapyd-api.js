require('dotenv').config({ path: '../../.env' } );

const RapydApi = require('rapyd-node-sdk');

const rapydApi = new RapydApi(process.env.RAPYD_ACCESS_KEY, process.env.RAPYD_SECRET_KEY, 'sandbox');
rapydApi.events.on(
    'log',
    (level, message, payload = {}) => process.env.DEBUG_RAPYD_API === 'true' && console.log("LOG", { level, message, payload: JSON.stringify(payload) }));


utilities.dependencyLocator.register('rapydApi', rapydApi);