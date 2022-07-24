const axios = require('axios');
const moment = require('moment');
import jwt_decode from "jwt-decode";

const loader = require('./blocking-loader');
const Modals = require('./modals');

angular.module('app', []).controller('main', ['$scope', '$timeout', '$interval', function ($scope, $timeout, $interval) {

    $scope.loginFormData = {show: false};
    $scope.dashboardFormData = {show: false};
    $scope.refundFormData = {show: false};

    let token = localStorage.getItem('token');

    const loadLogin = () => {
        $scope.loginFormData.show = true;
        $scope.dashboardFormData.show = false;
        loader.hide();
    };

    const loadDash = async () => {

        loader.show();
        $scope.loginFormData.show = false;

        let response;
        try {
            response = await axios.get(process.env.API_SERVER + '/payments', {headers: {'x-auth-token': token}});
        }
        catch (e) {
            $scope.logout();
            loader.hide();
        }

        $timeout(() => {

            $scope.dashboardFormData.payments = response.data.data
                .map(el => ({...el, createdAt: moment(el.createdAt, 'X').format('DD/MM/YYYY HH:MM')}));
            $scope.dashboardFormData.show = true;
            loader.hide();

        }, 0);


    };

    $scope.submitLoginForm = async event => {
        event.preventDefault();
        loader.show();

        try {

            const response = await axios.post(process.env.API_SERVER + '/auth/login', $scope.loginFormData);
            token = response.data.data.token;

            localStorage.setItem('token', token);

            $timeout(async () => {
                $scope.dashboardFormData.user = $scope.loginFormData.email;
                await loadDash();
                loader.hide();
            }, 500);


        } catch (e) {
            loader.hide();
            Modals.Toast('success', 'Invalid login credentials', 4000);
        }

    };

    if (token) {
        try {
            $scope.dashboardFormData.user = jwt_decode(token).email;
        }
        catch (e) { return loadLogin() }
        loadDash();
    } else loadLogin();

    $scope.logout = () => {
        localStorage.setItem('token', null);
        $scope.loginFormData.show = true;
        $scope.dashboardFormData.show = false;
    };

    $scope.openRefundModal = async (payment) => {
        loader.show();

        let response = await axios.get(
            process.env.API_SERVER + '/refunds/rpc-available-banks?country=' +
            payment.bankAccount.country_iso + '&currency=' +
            payment.currency + '&amount=' +
            payment.amount, {headers: {'x-auth-token': token}});


        $timeout(()=>{
            $scope.refundFormData.amount = payment.amount;
            $scope.refundFormData.currency = payment.currency;
            $scope.refundFormData.country = payment.bankAccount.country;
            $scope.refundFormData.isoCountry = payment.bankAccount.country_iso;
            $scope.refundFormData.beneficiaryBanks = response.data.data;
            $scope.refundFormData.show = true;

            loader.hide();
        },0);

    };

    $scope.bankwireMethodChange = async () => {

        if(!$scope.refundFormData.selectedBeneficiaryBank)
            return;

        loader.show();

        console.log("CHANGED!", $scope.refundFormData.selectedBeneficiaryBank);

        let response = await axios.get(
            process.env.API_SERVER + '/refunds/rpc-required-fields?country=' +
            $scope.refundFormData.isoCountry + '&currency=' +
            $scope.refundFormData.currency + '&amount=' +
            $scope.refundFormData.amount + '&payMethodType=' +
            $scope.refundFormData.selectedBeneficiaryBank, {headers: {'x-auth-token': token}});



        $timeout(()=>{
            $scope.refundFormData.beneficiaryRequiredFields = response.data.data.
            beneficiary_required_fields.map(el => {
                return {
                    id: 'refundFormData_beneficiary_' + el.name,
                    name: el.name,
                    model: 'refundFormData.beneficiary.' + el.name,
                    placeholder: el.name.replace(/\_/g, " ") };
            });

            loader.hide();
        },0);

    };

    $scope.submitRefundForm = event => {
        event.preventDefault();
        for(htmlEl of $scope.refundFormData.beneficiaryRequiredFields) {
            console.log(htmlEl.id, document.getElementById(htmlEl.id)?.value);
        }
    }

    $scope.closeRefundModal = () => {
        $scope.refundFormData.show = false;
    };


}]);
