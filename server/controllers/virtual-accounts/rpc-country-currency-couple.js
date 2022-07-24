const countries = require("i18n-iso-countries");

let formatData;

new utilities.express.Service('countryCurrencyCouple')
    .isGet()
    .isPublic()
    .respondsAt('/virtual-accounts/country-currency-couple')
    .controller((req, res) => {

        if(!formatData)
            formatData = api.config.countryCurrency.map(el => ({
                "countryCode": el.country,
                "countryName": countries.getName(el.country.toUpperCase(), 'en'),
                currencies: el.currencies
            }));

        return res.resolve(formatData);

});