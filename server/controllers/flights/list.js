new utilities.express.Service('flightList')
    .isPublic()
    .isGet()
    .respondsAt('/flights')
    .controller((req, res) => {
        res.resolve(api.config.flights);
    })