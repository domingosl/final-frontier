const countries = require("i18n-iso-countries");

const rawData = [
    {
        "country": "AU",
        "currencies": ["AUD", "USD"]
    },
    {
        "country": "DE", "currencies": ["EUR"]
    },
    {
        "country": "DK",
        "currencies": ["AED", "AUD", "CAD", "CHF", "CZK", "DKK", "EUR", "GBP", "HKD", "HRK", "HUF", "ILS", "JPY", "MXN", "NOK", "NZD", "PLN", "RON", "SAR", "SEK", "SGD", "TRY", "USD"]
    },
    {
        "country": "GB",
        "currencies": ["GBP"]
    },
    {
        "country": "ID",
        "currencies": ["IDR"]
    },
    {
        "country": "MX",
        "currencies": ["MXN"]
    },
    {
        "country": "NZ",
        "currencies": ["NZD", "USD"]
    }, {
        "country": "SG",
        "currencies": ["AUD", "CAD", "CHF", "EUR", "GBP", "HKD", "JPY", "NOK", "NZD", "SEK", "SGD", "USD"]
    },
    {
        "country": "SK",
        "currencies": ["EUR"]
    },
    {
        "country": "US",
        "currencies": ["USD"]
    }
];

let formatData;

new utilities.express.Service('countryCurrencyCouple')
    .isGet()
    .isPublic()
    .respondsAt('/virtual-accounts/country-currency-couple')
    .controller((req, res) => {

        if(!formatData)
            formatData = rawData.map(el => ({
                "countryCode": el.country,
                "countryName": countries.getName(el.country.toUpperCase(), 'en'),
                currencies: el.currencies
            }));

        return res.resolve(formatData);

});