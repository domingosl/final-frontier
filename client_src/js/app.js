const axios = require('axios');
const loader = require('./blocking-loader');
const Modals = require('./modals');
const moment = require('moment');

const quotes = require('./quotes');

const quote = quotes[Math.floor(Math.random() * quotes.length)];

document.getElementById('quote-text').innerHTML = "<span>" + quote.text.trim().split("").join("</span><span>") + "</span>";
document.getElementById('quote-author').innerHTML = quote.author;


const el3d = require('./3d');

const clickSound = new Audio('/assets/sounds/beep.mp3');


function capitalizeWords(text) {
    return text.split().map(element => {
        return element.charAt(0).toUpperCase() + element.substring(1).toLowerCase();
    });
}

angular.module('app', ['ngAnimate']).controller('main', ['$scope', '$timeout', '$sce', function ($scope, $timeout, $sce) {

    const loadFlights = async () => {
        const flights = (await axios.get(process.env.API_SERVER + '/flights')).data.data;
        $timeout(()=>$scope.formData.flights = flights.map(f => ({ ...f, description: $sce.trustAsHtml(f.description)})));
    };

    const loadCountryCurrencyCouples = async () => {
        const countryCurrencyCouples = (await axios.get(process.env.API_SERVER + '/virtual-accounts/country-currency-couple')).data.data;
        $timeout(()=>$scope.formData.countryCurrencyCouple=countryCurrencyCouples);
    };

    $scope.getDaysFromDate = stringDate => {
        return moment(stringDate).fromNow();
    }

    (async () => {

        const stop3D = false;

        const minLoaderTime = 0;

        $scope.formData = {
            isLoading3D: !stop3D,
            state: 'welcome',
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

        await loadFlights();
        await loadCountryCurrencyCouples();

        let placeMarker = () => {};
        let setRendering = () => {};

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
            $scope.formData.traveler.currency = $scope.formData.currencies[0];
        }

        $scope.generateVirtualAccount = async () => {
            loader.show();
            const response = await axios.post(process.env.API_SERVER + '/virtual-accounts', $scope.formData.traveler);
            loader.hide();
            $timeout(() => $scope.changeState('done'), 0);



            let formatHtml = "<p>In order to complete your booking " +
                "please send a bank wire of " +
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format($scope.formData.flights[$scope.formData.selectedFlightIndex].cost * 0.1) +
                " (equivalent in your local currency) using the" +
                " bank information stated bellow:</p><br \><br \><div class='bankwire_data'>";

            Object.keys(response.data.data).forEach(key => {
                if(key.toLowerCase() === 'country_iso' || key.toLowerCase() === 'country') return;
                formatHtml += '<div class="row"><div class="col-xs-4 text-right"><strong>' + capitalizeWords(key.replace(/\_/g, " ")) + '</strong></div><div class="col-xs-6">' +
                    '<input class="select" readonly value="' + response.data.data[key] + '" /></div></div>'
            });
            formatHtml += "</div><div class='text-center mt-30'><p>Thank you for choosing Final Frontier!</p></div>";

            Modals.Alert('success', formatHtml, 'Almost ready for liftoff!', {
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
            else if(state === 'done')
                setRendering(true, true);
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


    })();



}]);