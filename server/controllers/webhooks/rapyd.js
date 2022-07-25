new utilities.express.Service('rapydWebhookController')
    .isPost()
    .isPublic()
    .respondsAt('/webhooks/rapyd')
    .controller(async (req, res)=>{

        utilities.logger.debug("New Rapyd hook", { tagLabel, body: req.body });

        res.resolve();


    });