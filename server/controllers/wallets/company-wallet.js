const rapydApi = utilities.dependencyLocator.get('rapydApi');

new utilities.express.Service('walletStatement')
    .respondsAt('/wallets/company')
    .isGet()
    .isPublic()
    .controller(async (req, res) => {

        const response = await rapydApi.Wallets.read(process.env.COMPANY_WALLET_ID);

        res.resolve(response.data);

    })