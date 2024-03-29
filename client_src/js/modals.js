const Swal = require('sweetalert2');
const Noty = require('noty');

class Modal {

    constructor() {

    }

    static Alert(type, message, title = 'Final Frontier', options = {}) {

        Swal.fire({
            title,
            icon: type,
            html: message,
            ...options
        })

    }

    static Toast(type, message, timeout = 1500) {


        new Noty({
            type: type,
            layout: 'topRight',
            text: message,
            timeout,
            theme: 'solarized'
        }).show();

    }

}

module.exports = Modal;