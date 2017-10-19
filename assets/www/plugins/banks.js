define(function (require) {

    'use strict';

    var banks = [
        {
            name: 'Access Bank',
            id: '044'
        },
        {
            name: 'Citi Bank',
            id: '023'
        },
//        {
//            name: 'Diamond Bank',
//            id: '063'
//        },
        {
            name: 'Ecobank',
            id: '050'
        },
        {
            name: 'Enterprise Bank',
            id: '084'
        },
        {
            name: 'Fidelity Bank',
            id: '070'
        },
        {
            name: 'Finbank',
            id: '085'
        },
        {
            name: 'First Bank',
            id: '011'
        },
        {
            name: 'FCMB',
            id: '214'
        },
        {
            name: 'Heritage Bank',
            id: '030'
        },
        {
            name: 'Jaiz Bank',
            id: '233'
        },
        {
            name: 'Keystone Bank',
            id: '082'
        },
        {
            name: 'Mainstreet Bank',
            id: '014'
        },
        {
            name: 'Skye Bank',
            id: '076'
        },
        {
            name: 'Stanbic IBTC',
            id: '221'
        },
        {
            name: 'Standard Chartered',
            id: '068'
        },
        {
            name: 'Sterling Bank',
            id: '232'
        },
        {
            name: 'Union Bank',
            id: '032'
        },
        {
            name: 'UBA',
            id: '033'
        },
        {
            name: 'Unity Bank',
            id: '215'
        },
        {
            name: 'Wema Bank',
            id: '035'
        },
        {
            name: 'Zenith Bank',
            id: '057'
        },
        {
            name: 'GT Bank',
            id: '058'
        }
    ];

    banks.isValidAccount = function (bankCode, accountNumber) {
        'use strict';
        var val = [].concat(bankCode.split('')).concat(accountNumber.split('')),
            check = 0,
            m = [3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7, 3],
            i;
        for (i = 0; i < m.length; i += 1) {
            check += val[i] * m[i];
        }
        return (10 - check % 10) % 10 === parseInt(val[val.length - 1], 10);
    };

    banks.getName = function (id) {
        for (var i = 0; i < this.length; i++) {
            if (id === this[i].id) {
                return this[i].name;
            }
        }
    };

    banks.get = function (id) {
        for (var i = 0; i < this.length; i++) {
            if (id === this[i].id) {
                return this[i];
            }
        }
    };

    banks.getId = function (name) {
        for (var i = 0; i < this.length; i++) {
            if (name === this[i].name) {
                return this[i].id;
            }
        }
    };

    return banks;

});