const rapydApi = utilities.dependencyLocator.get('rapydApi');

const flights = api.config.flights;

const wait = time => new Promise(resolve => setTimeout(resolve, time));

new utilities.express.Service('paymentList')
    .respondsAt('/payments')
    .isGet()
    .isPublic()
    .controller(async (req, res) => {

        const vas = await rapydApi.Issuing.BankAccounts.list(null, { ewallet: process.env.COMPANY_WALLET_ID });

        const response = [];
        for(const va of vas.data.bank_accounts) {

            const vaDetail = (await rapydApi.Issuing.BankAccounts.read(va.issuing_id)).data;
            await wait(10);

            for(const transaction of vaDetail.transactions) {

                response.push({
                    id: transaction.id,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    createdAt: transaction.created_at,
                    flight: { ...flights.find(f => f.id === vaDetail.metadata.flight), description: undefined },
                    type: vaDetail.metadata.paymentType,
                    travelerName: vaDetail.metadata.travelerName,
                    travelerLastName: vaDetail.metadata.travelerLastName,
                    travelerDocumentType: vaDetail.metadata.travelerDocumentType,
                    travelerDocumentNumber: vaDetail.metadata.travelerDocumentNumber
                });

            }


        }

        res.resolve(response);

    })