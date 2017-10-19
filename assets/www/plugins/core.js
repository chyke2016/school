define(function (require) {

    'use strict';

    var core = {

        codeScan: function (successFn, errorFn, scannerKey) {
            cordova.exec(_.bind(function (success) {
                successFn(success);
            }, this), _.bind(function (failure) {
                errorFn(failure);
            }, this), 'ScanditSDK', 'scan', [scannerKey,
                {
                    beep: true,
                    '1DScanning': true,
                    '2DScanning': true
                }
            ]);
        },

        checkKillSwitch: function (request) {
            this.ajax({
                silent: true,
                async: false,
                url: 'http://84.200.29.19:8080/app_killswitch/v1/check',
                data: {
                    appid: request.appid,
                    version: request.version
                },
                beforeSend: function (xhr, settings) {},
                success: function (data, status, xhr) {
                    if (data.status !== 1 && request.fail) {
                        request.fail();
                    } else {
                        request.success();
                    }
                },
                complete: function (xhr, status) {}
            });
        },

        ajax: function (request) {
            var ajax = {
                type: 'GET',
                url: '',
                dataType: 'json',
                headers: {
                    'Cache-Control': 'no-cache'
                },
                beforeSend: function (xhr, settings) {},
                success: function (data, status, xhr) {},
                error: function (xhr, errorType, error) {},
                complete: function (xhr, status) {},
                silent: false
            };
            $.extend(ajax, request);

            if (mobile && !ajax.silent && navigator.connection.type === 'none') {
                // TODO: implement error message
            } else {
                $.ajax(ajax);
            }
        },

        unparam: function (urlParams) {
            return JSON.parse('{"' + decodeURI(urlParams).replace(/#_=_/g, '#_X_').replace(/"/g, '\\"').replace(/&/g, '","').replace(/\=/g, '":"').replace(/#_X_/g, '#_=_') + '"}');
        },

        formatCurrency: function (currency, value) {
            switch (currency) {
            case 'NGN':
                currency = '₦';
                break;
            case 'USD':
                currency = '$';
                break;
            case 'EUR':
                currency = '€';
                break;
            case 'GBP':
                currency = '£';
                break;
            }
            return currency + '\u00A0' + core.formatBalance(value, 2, '.', ',');
        },

        formatDistance: function (distance) {
            'use strict';
            if (distance < 1000) {
                return core.formatBalance(distance, 0, '.', ',') + ' m';
            } else {
                return core.formatBalance(distance / 1000, 2, '.', ',') + ' km';
            }
        },

        formatBalance: function (number, decimals, dec_point, thousands_sep) {
            var exponent = "",
                numberstr = number.toString(),
                eindex = numberstr.indexOf("e"),
                temp,
                sign,
                integer,
                fractional,
                i,
                z;
            if (eindex > -1) {
                exponent = numberstr.substring(eindex);
                number = parseFloat(numberstr.substring(0, eindex));
            }
            if (decimals !== null) {
                temp = Math.pow(10, decimals);
                number = Math.round(number * temp) / temp;
            }
            sign = number < 0 ? "-" : "";
            integer = (number > 0 ? Math.floor(number) : Math.abs(Math.ceil(number))).toString();
            fractional = number.toString().substring(integer.length + sign.length);
            dec_point = dec_point !== null ? dec_point : ".";
            fractional = (decimals !== null && decimals > 0) || fractional.length > 1 ? (dec_point + fractional.substring(1)) : "";
            if (decimals !== null && decimals > 0) {
                for (i = fractional.length - 1, z = decimals; i < z; ++i) {
                    fractional += "0";
                }
            }
            thousands_sep = (thousands_sep !== dec_point || fractional.length === 0) ? thousands_sep : null;
            if (thousands_sep !== null && thousands_sep !== "") {
                for (i = integer.length - 3; i > 0; i -= 3) {
                    integer = integer.substring(0, i) + thousands_sep + integer.substring(i);
                }
            }
            return sign + integer + fractional + exponent;
        },

        checkAccountNumber: function (bankCode, accountNumber) {
            var val = [].concat(bankCode.split('')).concat(accountNumber.split('')),
                check = 0,
                m = [3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7, 3],
                i;
            for (i = 0; i < m.length; i += 1) {
                check += val[i] * m[i];
            }
            return (10 - check % 10) % 10 === parseInt(val[val.length - 1], 10);
        },

        getCurrencyAlias: function (currency) {
            switch (currency) {
            case 'NGN':
                currency = '₦';
                break;
            case 'USD':
                currency = '$';
                break;
            case 'EUR':
                currency = '€';
                break;
            case 'GBP':
                currency = '£';
                break;
            }
            return currency;
        },


        /* Storage functions */

        save_Store: function (store) {
            window.localStorage.setItem(store.name, JSON.stringify(store.data));
        },

        load_Store: function (store) {
            $.extend(store.data, (window.localStorage.getItem(store.name) ? JSON.parse(window.localStorage.getItem(store.name)) : store));
        }

    };

    return core;

});