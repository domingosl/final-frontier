const rapydApi = utilities.dependencyLocator.get('rapydApi');

new utilities.express.Service('requiredFieldRPCController')
    .isGet()
    .respondsAt('/refunds/rpc-available-banks')
    .controller(async (req, res)=>{

        const supportedMethods = await rapydApi
            .Payouts
            .SupportedMethods(req.query.country, 'individual', req.query.currency, 'bank').read();


        return res.resolve(supportedMethods.data);

    });