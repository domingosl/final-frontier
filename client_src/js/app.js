const quotes = [
    {
        text:
            "To confine our attention to terrestrial matters would be to limit the human spirit",
        author: "Stephen Hawking"
    },
    {
        text:
            "Earth is the cradle of humanity, but one cannot live in a cradle forever",
        author: "Konstantin Tsiolkovsky"
    },
    {
        text:
            "Somewhere, something incredible is waiting to be known",
        author: "Carl Sagan"
    }
];

const quote = quotes[Math.floor(Math.random()*quotes.length)];

document.getElementById('quote-text').innerHTML = "<span>" + quote.text.trim().split("").join("</span><span>") + "</span>";
document.getElementById('quote-author').innerHTML = quote.author;


const el3d = require('./3d');

const clickSound = new Audio('/assets/sounds/beep.mp3');

angular.module('app', ['ngAnimate']).controller('main', function ($scope, $timeout, $interval) {

    const minLoaderTime = 0;

    $scope.formData = {
        isLoading3D: true,
        state: 'welcome',
        flights: require('./flights'),
        selectedFlight: 0,
        animating: true
    };

    let placeMarker;
    let cameraAnimating;

    let assetsLoaded = 0;

    const onLoaded = () => {
        assetsLoaded++;

        if(assetsLoaded >= 6) {
            let delta = minLoaderTime - (new Date().getTime() - now);
            if(delta < 0) delta = 0;
            $timeout(() => $scope.formData.isLoading3D = false, delta);
        }
    }

    let now = new Date().getTime();
    el3d.init(onLoaded).then(r => {
        placeMarker = r.placeMarker;
    });


    const updateMarker = () => {
        const selectedFlight = $scope.formData.flights[$scope.formData.selectedFlight];
        $timeout(()=>$scope.formData.animating = false, selectedFlight.landingPosition ? 5500 : 9000);
        setTimeout(()=> placeMarker(selectedFlight), 0);
    }

    $scope.changeState = state => {

        clickSound.play();
        $scope.formData.state = state;

        if(state === 'flight') updateMarker();

    }


    $scope.nextFlight = () => {

        if($scope.formData.animating) return;

        $scope.formData.animating = true;

        clickSound.play();

        if($scope.formData.selectedFlight < $scope.formData.flights.length - 1) {
            $scope.formData.selectedFlight++;
            return updateMarker();
        }

        $scope.formData.selectedFlight = 0;
        updateMarker();
    };

});