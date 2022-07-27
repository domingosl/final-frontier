module.exports = [
    {
        id: 0,
        lunchSite: {
            name: 'Kennedy Space Center',
            position: { latitude: 28.6082, longitude: -80.604 }
        },
        description: "<h1><strong>TO THE SPACE STATION</strong></h1>" +
            "<p>From launch to docking, the spacecraft typically takes 11 hours to travel from Earth to the " +
            "International Space Station. On its flight to the International Space Station, Dragon executes " +
            "a series of burns that position the vehicle progressively closer to the station before it " +
            "performs final docking maneuvers, followed by pressurization of the vestibule, hatch opening, " +
            "and crew ingress..</p><div class=\"mt-20\"></div>" +
            "<h1><strong>BACK TO EARTH</strong></h1>" +
            "<p>After 15 days on the station the mission to return to earth starts. Once " +
            "the spacecraft has enough distance from the ISS, it fires it's rocket engines to slow down for " +
            "re-entry into the atmosphere. After that, the spacecraft will deploy small parachutes to slow the " +
            "spacecraft enough for the main parachutes to open. Landing will take place at sea and recovery usually " +
            "takes at most half an hour to get everyone out onto a boat and back to land.</p>",
        departure: "05/08/2025 09:00 GMT",
        duration: "11 Hours",
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
        description: "<h1><strong>How it works</strong></h1><p>This is a sub-orbital spaceflight, which means the spacecraft reaches outer space, but its trajectory " +
            "intersects the atmosphere or surface of the gravitating body from which it was launched, so that it will not " +
            "complete one orbital revolution or reach escape velocity.</p><br />" +
            "<br />" +
            "<h1><strong>The flight to space</strong></h1><p>The spacecraft will take 3 minutes and 20 seconds to reach space and it will shut off its engines well before reaching " +
            "maximum altitude, and then coast up to its highest point. During a few minutes, from the point when the engines are shut off to the point where the atmosphere " +
            "begins to slow down the downward acceleration, the passengers will experience weightlessness.</p><br /><br />" +
            "<h1><strong>The flight back home</strong></h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consequat massa eget dignissim gravida. " +
            "Pellentesque quam eros, egestas et fermentum quis, sollicitudin sed erat. Phasellus pulvinar, erat id tincidunt fermentum, orci ante tempus nunc, ac feugiat " +
            "orci arcu sit amet nisl. In vel facilisis turpis, quis consequat quam. </p>",
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
        description: "<h1><strong>How it works</strong></h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consequat massa eget dignissim gravida. " +
            "Pellentesque quam eros, egestas et fermentum quis, sollicitudin sed erat. Phasellus pulvinar, erat id tincidunt fermentum, orci ante tempus nunc, ac feugiat " +
            "orci arcu sit amet nisl. In vel facilisis turpis, quis consequat quam. </p><br />" +
            "<br />" +
            "<h1><strong>The flight to space</strong></h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consequat massa eget dignissim gravida. " +
            "Pellentesque quam eros, egestas et fermentum quis, sollicitudin sed erat. Phasellus pulvinar, erat id tincidunt fermentum, orci ante tempus nunc, ac feugiat " +
            "orci arcu sit amet nisl. In vel facilisis turpis, quis consequat quam. </p><br /><br />" +
            "<h1><strong>The flight back home</strong></h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consequat massa eget dignissim gravida. " +
            "Pellentesque quam eros, egestas et fermentum quis, sollicitudin sed erat. Phasellus pulvinar, erat id tincidunt fermentum, orci ante tempus nunc, ac feugiat " +
            "orci arcu sit amet nisl. In vel facilisis turpis, quis consequat quam. </p>",
        departure: "01/14/2027 11:00 GMT",
        duration: "2.1 Hours",
        type: "Orbital",
        cost: 127000,
        currencyDisplay: "$",
        currency: "USD",
        companyLogo: "nasa.png"
    }
];