const tagLabel = 'rapydHooks';

const flights = api.config.flights;

new utilities.express.Service('rapydWebhookController')
    .isPost()
    .isPublic()
    .respondsAt('/webhooks/rapyd')
    .controller(async (req, res) => {

        res.resolve();

        utilities.logger.debug("New Rapyd hook", {tagLabel, body: req.body});

        if (req.body.type !== 'ISSUING_DEPOSIT_COMPLETED')
            return utilities.logger.debug("Webhook ignored!", {tagLabel, type: req.body.type});

        const vaDetail = (await rapydApi.Issuing.BankAccounts.read(req.body.data.issued_account_id)).data;

        const transaction = {
            rapydId: req.body.data.issuing_transaction_id,
            bankAccount: vaDetail.bank_account,
            amount: req.body.data.amount,
            currency: req.body.data.currency,
            createdAt: req.body.data.created_at,
            flight: {...flights.find(f => f.id === vaDetail.metadata.flight), description: undefined},
            type: vaDetail.metadata.paymentType,
            travelerName: vaDetail.metadata.travelerName,
            travelerLastName: vaDetail.metadata.travelerLastName,
            travelerDocumentType: vaDetail.metadata.travelerDocumentType,
            travelerDocumentNumber: vaDetail.metadata.travelerDocumentNumber
        };

        utilities.logger.debug("New transaction stored", { tagLabel, transaction });


    });