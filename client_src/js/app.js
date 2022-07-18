const axios = require('axios');
const loader = require('./blocking-loader');
const Modals = require('./modals');

const quotes = require('./quotes');

const quote = quotes[Math.floor(Math.random() * quotes.length)];

document.getElementById('quote-text').innerHTML = "<span>" + quote.text.trim().split("").join("</span><span>") + "</span>";
document.getElementById('quote-author').innerHTML = quote.author;


const el3d = require('./3d');

const clickSound = new Audio('/assets/sounds/beep.mp3');

angular.module('app', ['ngAnimate']).controller('main', ['$scope', '$timeout', function ($scope, $timeout) {

    const stop3D = true;

    const minLoaderTime = 0;

    $scope.formData = {
        isLoading3D: !stop3D,
        state: 'details',
        animating: !stop3D,
        flights: [],
        currencies: ['USD'],
        selectedFlightIndex: 0,
        traveler: {
            country: 'US',
            currency: 'USD'
        },
        countryCurrencyCouple: []
    };

    axios.get(process.env.API_SERVER + '/flights')
        .then(r => $scope.formData.flights = r.data.data);

    axios.get(process.env.API_SERVER + '/virtual-accounts/country-currency-couple')
        .then(r => $timeout($scope.formData.countryCurrencyCouple = r.data.data, 0));

    let placeMarker;
    let setRendering;

    let assetsLoaded = 0;

    const onLoaded = () => {
        assetsLoaded++;

        if (assetsLoaded >= 6) {

            let delta = minLoaderTime - (new Date().getTime() - now);
            if (delta < 0) delta = 0;
            $timeout(() => $scope.formData.isLoading3D = false, delta);
        }
    }

    let now = new Date().getTime();

    if(!stop3D)
        el3d.init(onLoaded).then(r => {
            placeMarker = r.placeMarker;
            setRendering = r.setRendering;
        });


    const updateMarker = () => {
        const selectedFlight = $scope.formData.flights[$scope.formData.selectedFlightIndex];
        $timeout(() => $scope.formData.animating = false, selectedFlight.landingPosition ? 5500 : 11000);
        setTimeout(() => placeMarker(selectedFlight), 0);
    }

    $scope.countryChanged = () => {
        $scope.formData.currencies = $scope.formData.countryCurrencyCouple
            .find(el => el.countryCode === $scope.formData.traveler.country).currencies;
    }

    $scope.generateVirtualAccount = async () => {
        loader.show();
        const response = await axios.post(process.env.API_SERVER + '/virtual-accounts', $scope.formData.traveler);
        loader.hide();
        $timeout(() => $scope.changeState('done'), 0);

        let formatHtml = "<p>Great!, in order to complete your booking " +
            "please send a bank wire of " + 0.1 * $scope.formData.flights[$scope.formData.selectedFlightIndex].cost + " (equivalent in your local currency) using the" +
            " bank information stated bellow:</p><br \><br \><ul>";

        Object.keys(response.data.data).forEach(key => {
            formatHtml += '<li><strong>' + key.replace("_", " ") + '</strong>: ' + response.data.data[key] + '</li>'
        });
        formatHtml += "</ul>";

        Modals.Alert('success', formatHtml, 'All ready to go!', {
            allowOutsideClick: false,
            showConfirmButton: false
        });
    }

    let firstPass = true;
    $scope.changeState = state => {

        clickSound.play();

        $scope.formData.state = state;

        if (firstPass && state === 'flight') {
            updateMarker();
            firstPass = false;
        }
        else if(state === 'flight')
            setRendering(true);
        else {
            setRendering(false);
        }

    }

    $scope.validateTravelerData = async () => {
        loader.show();

        $scope.formData.traveler.flightId = $scope.formData.traveler.flightId || $scope.formData.flights[$scope.formData.selectedFlightIndex].id || 0;
        $scope.formData.traveler.country = $scope.formData.traveler.country || 'us';
        $scope.formData.traveler.currency = $scope.formData.traveler.currency || 'usd';

        try {
            const response = await axios.post(process.env.API_SERVER + '/virtual-accounts?justValidation=true', $scope.formData.traveler);
            console.log(response);
            loader.hide();
            $timeout(() => $scope.changeState('payment'), 0);

        } catch (error) {
            loader.hide();
            Modals.Alert('error', error.response.data.data[Object.keys(error.response.data.data)[0]]);
            console.log(error.response.data);
        }
    };

    $scope.debugFiller = () => {
        $scope.formData.traveler = {
            firstName: "John",
            lastName: "Doe",
            gender: "m",
            birthDay: new Date(),
            documentType: "passport",
            documentNumber: "ABC123",
            phone: "+555.555.22.11",
            email: "john.doe@email.com"
        }
    };

    $scope.nextFlight = () => {

        if ($scope.formData.animating) return;

        $scope.formData.animating = true;

        clickSound.play();

        if ($scope.formData.selectedFlightIndex < $scope.formData.flights.length - 1) {
            $scope.formData.selectedFlightIndex++;
            return updateMarker();
        }

        $scope.formData.selectedFlightIndex = 0;
        updateMarker();
    };

}]);