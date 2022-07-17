module.exports = [
    {
        id: 0,
        lunchSite: {
            name: 'Kennedy Space Center',
            position: { latitude: 28.6082, longitude: -80.604 }
        },
        description: "Foo bar",
        departure: "05/08/2025 09:00 GMT",
        duration: "1.5 Hours",
        type: "ISS Visit",
        cost: 250000,
        currencyDisplay: "$",
        currency: "USD",
        companyLogo: "spacex.png"
    },
    {
        id: 1,
        lunchSite: {
            name: 'Vandenberg California',
            position: {latitude: 34.66486285, longitude: -120.60124}
        },
        landingPosition: { latitude: 37.77814, longitude: -128.94438 },
        description: "Foo bar",
        departure: "05/12/2025 16:00 GMT",
        duration: "3 Hours",
        type: "Sub-Orbital",
        cost: 120000,
        currencyDisplay: "$",
        currency: "USD",
        companyLogo: "nasa.png"
    },
    {
        id: 2,
        lunchSite: {
            name: 'Sarabhai Space Centre',
            position: {latitude: 8.5314, longitude: 76.8690}
        },
        landingPosition: { latitude: -9.050980, longitude: 47.707587982 },
        description: "Foo bar",
        departure: "01/14/2027 11:00 GMT",
        duration: "2.1 Hours",
        type: "Orbital",
        cost: 127000,
        currencyDisplay: "$",
        currency: "USD",
        companyLogo: "nasa.png"
    }
];