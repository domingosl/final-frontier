const axios = require('axios');
const moment = require('moment');
import jwt_decode from "jwt-decode";

const loader = require('./blocking-loader');
const Modals = require('./modals');

angular.module('app', []).controller('main', ['$scope', '$timeout', '$interval', function ($scope, $timeout, $interval) {

    $scope.loginFormData = {show: false};
    $scope.dashboardFormData = {show: false};
    $scope.refundFormData = {show: false};
    $scope.searchQuery = {};

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
                .map(el => ({
                    ...el,
                    executionDate: moment(el.executionDate, 'X').format('DD/MM/YYYY HH:MM'),
                    travelerFullName: (el.travelerName + " " + el.travelerLastName).toLowerCase()
                }));
            $scope.dashboardFormData.show = true;
            loader.hide();
            console.log($scope.dashboardFormData.payments);

        }, 500);


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
            $scope.refundFormData.payment = payment;
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
            $scope.refundFormData.payment.bankAccount.country_iso + '&currency=' +
            $scope.refundFormData.payment.currency + '&amount=' +
            $scope.refundFormData.payment.amount + '&payMethodType=' +
            $scope.refundFormData.selectedBeneficiaryBank, {headers: {'x-auth-token': token}});



        $timeout(()=>{
            $scope.refundFormData.beneficiaryRequiredFields = response.data.data.
            beneficiary_required_fields.map(el => {
                return {
                    id: 'refundFormData_beneficiary_' + el.name,
                    name: el.name,
                    regex: el.regex,
                    model: 'refundFormData.beneficiary.' + el.name,
                    placeholder: el.name.replace(/\_/g, " ") };
            });

            loader.hide();
        },0);

    };

    $scope.submitRefundForm = async event => {
        event.preventDefault();

        loader.show();
        const beneficiaryPayload = {};
        let valid = true;
        for(htmlEl of $scope.refundFormData.beneficiaryRequiredFields) {

            const el = document.getElementById(htmlEl.id);

            if(!(new RegExp(htmlEl.regex).test(el.value))) {
                Modals.Toast('error', "The <strong>" + htmlEl.placeholder + "</strong> is not valid", 5000);
                valid = false;
                console.log(htmlEl.placeholder, htmlEl.regex);
            }

            beneficiaryPayload[htmlEl.id.replace('refundFormData_beneficiary_', '')] = el.value;
        }

        if(!valid) return loader.hide();

        try {
            await axios.post(process.env.API_SERVER + '/refunds', {
                transactionId: $scope.refundFormData.payment._id,
                payoutMethodType: $scope.refundFormData.selectedBeneficiaryBank,
                beneficiary: beneficiaryPayload,
                description: 'Refund from admin dashboard'
            }, {headers: {'x-auth-token': token}});

            loader.hide();

            Modals.Alert("success", "Refund transaction approved", "REFUNDED!", {
                allowOutsideClick: false,
                showConfirmButton: false
            });

            $timeout(()=>location.reload(), 3000);


        }
        catch (e) {
            loader.hide();
            Modals.Toast("error", "Something went wrong, please try again later.", 5000);
        }


    }

    $scope.closeRefundModal = () => {
        $scope.refundFormData.show = false;
        $scope.refundFormData.beneficiaryRequiredFields = [];
        $scope.refundFormData.selectedBeneficiaryBank = null;
    };


}]);
