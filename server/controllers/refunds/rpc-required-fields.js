const rapydApi = utilities.dependencyLocator.get('rapydApi');

new utilities.express.Service('requiredFieldRPCController')
    .isGet()
    .respondsAt('/refunds/rpc-required-fields')
    .controller(async (req, res)=>{

        const reqFieldsResponse = await rapydApi
            .Payouts
            .RequiredFields(
                process.env.COMPANY_ISO_COUNTRY,
                req.query.country,
                'company',
                'individual',
                req.query.amount,
                req.query.currency).read(req.query.payMethodType);

        res.resolve(reqFieldsResponse.data);

    });