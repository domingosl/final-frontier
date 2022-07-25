require('dotenv').config();

const tagLabel = 'Initialization routine';

const glob = require('glob');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

global.api = {
    config: require('./server/config'),
    customErrors: require('./server/utils/custom-errors')
};

global.utilities = require('@growishpay/service-utilities');


const apiApp = express();
const clientApp = express();

apiApp.disable('x-powered-by');
clientApp.disable('x-powered-by');

apiApp.use(cors());
apiApp.options('*', cors());

apiApp.use(require('morgan')("combined", {"stream": utilities.logger.stream}));
apiApp.use(compression());
apiApp.use(bodyParser.json({limit: '1mb'}));

clientApp.use(express.static('dist'));


apiApp.get('/favicon.ico', (req, res) => res.status(204));
clientApp.get('/favicon.ico', (req, res) => res.status(204));


clientApp.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'dist/admin.html')));

(async () => {

    utilities.express.init(apiApp, (req, res, next)=>{
        try {
            jwt.verify(req.headers['x-auth-token'], process.env.JWT_SECRET);
            next();
        } catch (e) {
            res.unauthorized();
        }
    });

    //Loads plugins, services, models and controllers
    const patterns = [
        "server/plugins/*.js",
        "server/services/**/index.js",
        "server/services/*.js",
        "server/models/*.js",
        "server/controllers/**/*.js"
    ];

    for (const pattern of patterns) {
        const files = glob.sync(pattern, null);

        for (const filePath of files) {
            require("./" + filePath);
        }

    }


    apiApp.use('*', (req, res) => res.notFound());

    apiApp.use(function (error, req, res, next) {

        if (error) {

            utilities.logger.error("API ERROR NOT HANDLED", {error});
            res.status(400).json({code: 400, data: {}});

        }

        next();

    });


    apiApp.listen(process.env.API_PORT, async () => {

        utilities.logger.info('Agenda client running', {tagLabel});

        utilities.logger.info('API server running', {tagLabel, port: process.env.API_PORT});
        utilities.state.increment('restarts');
        utilities.state.set('APILastBootDate', new Date());

        if (process && typeof process.send === 'function') process.send('ready');

        if (process.env.ENABLE_RESTART_NOTIFICATION === 'true')
            utilities.notifier.send('API server running!', {env: process.env.NODE_ENV}, 'low');

        try {
            await mongoose.connect('mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PASSWORD + '@mongodb');
            utilities.logger.info('Connected to DB!', {tagLabel});
        } catch (error) {
            utilities.logger.warn('Running with no DB!', {tagLabel, error});
        }

    });

    clientApp.listen(process.env.CLIENT_APP_PORT, () => {
        utilities.logger.info('Client app running', { tagLabel, port: process.env.CLIENT_APP_PORT });
    });


})();

const shutdown = () => {
    utilities.logger.info("Goodbye!", {tagLabel});
    process.exit();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);