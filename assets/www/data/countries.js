define(function (require) {

    'use strict';

    var countries = [
        {
            id: '113',
            name: 'Nigeria'
        },
        {
            id: '1',
            name: 'Andorra'
        },
        {
            id: '2',
            name: 'United Arab Emirates'
        },
        {
            id: '3',
            name: 'Antigua'
        },
        {
            id: '4',
            name: 'Albania'
        },
        {
            id: '5',
            name: 'Armenia'
        },
        {
            id: '6',
            name: 'Netherlands Antilles'
        },
        {
            id: '7',
            name: 'Argentina'
        },
        {
            id: '8',
            name: 'Austria'
        },
        {
            id: '9',
            name: 'Australia'
        },
        {
            id: '10',
            name: 'Aruba'
        },
        {
            id: '11',
            name: 'Azerbaijan'
        },
        {
            id: '12',
            name: 'Bosnia Herzegovina'
        },
        {
            id: '13',
            name: 'Barbados'
        },
        {
            id: '14',
            name: 'Belgium'
        },
        {
            id: '15',
            name: 'Bulgaria'
        },
        {
            id: '16',
            name: 'Bahrain'
        },
        {
            id: '17',
            name: 'Bermuda'
        },
        {
            id: '18',
            name: 'Brunei Darussalam'
        },
        {
            id: '19',
            name: 'Bolivia'
        },
        {
            id: '20',
            name: 'Brazil'
        },
        {
            id: '21',
            name: 'Bahamas'
        },
        {
            id: '22',
            name: 'Botswana'
        },
        {
            id: '23',
            name: 'Belarus'
        },
        {
            id: '24',
            name: 'Canada'
        },
        {
            id: '25',
            name: 'Zaire'
        },
        {
            id: '26',
            name: 'Congo'
        },
        {
            id: '27',
            name: 'Switzerland'
        },
        {
            id: '28',
            name: 'Cook Islands'
        },
        {
            id: '29',
            name: 'Chile'
        },
        {
            id: '30',
            name: 'Cameroon'
        },
        {
            id: '31',
            name: 'China'
        },
        {
            id: '32',
            name: 'Colombia'
        },
        {
            id: '33',
            name: 'Costa Rica'
        },
        {
            id: '34',
            name: 'Cuba'
        },
        {
            id: '35',
            name: 'Cyprus'
        },
        {
            id: '36',
            name: 'Czech Republic'
        },
        {
            id: '37',
            name: 'Germany'
        },
        {
            id: '38',
            name: 'Denmark'
        },
        {
            id: '39',
            name: 'Dominican Republic'
        },
        {
            id: '40',
            name: 'Ecuador'
        },
        {
            id: '41',
            name: 'Estonia'
        },
        {
            id: '42',
            name: 'Egypt'
        },
        {
            id: '43',
            name: 'Spain'
        },
        {
            id: '44',
            name: 'Ethiopia'
        },
        {
            id: '45',
            name: 'Finland'
        },
        {
            id: '46',
            name: 'Fiji'
        },
        {
            id: '47',
            name: 'Micronesia'
        },
        {
            id: '48',
            name: 'France'
        },
        {
            id: '49',
            name: 'Gabon'
        },
        {
            id: '50',
            name: 'United Kingdom'
        },
        {
            id: '51',
            name: 'Grenada'
        },
        {
            id: '52',
            name: 'Georgia'
        },
        {
            id: '53',
            name: 'Gibraltar'
        },
        {
            id: '54',
            name: 'Greenland'
        },
        {
            id: '55',
            name: 'Gambia'
        },
        {
            id: '56',
            name: 'Guadeloupe'
        },
        {
            id: '57',
            name: 'Greece'
        },
        {
            id: '58',
            name: 'Guatemala'
        },
        {
            id: '59',
            name: 'Guam'
        },
        {
            id: '60',
            name: 'Hong Kong'
        },
        {
            id: '61',
            name: 'Honduras'
        },
        {
            id: '62',
            name: 'Croatia'
        },
        {
            id: '63',
            name: 'Haiti'
        },
        {
            id: '64',
            name: 'Hungary'
        },
        {
            id: '65',
            name: 'Indonesia'
        },
        {
            id: '66',
            name: 'Ireland(Republic of)'
        },
        {
            id: '67',
            name: 'Israel'
        },
        {
            id: '68',
            name: 'India'
        },
        {
            id: '69',
            name: 'Iraq'
        },
        {
            id: '70',
            name: 'Iran'
        },
        {
            id: '71',
            name: 'Iceland'
        },
        {
            id: '72',
            name: 'Italy'
        },
        {
            id: '73',
            name: 'Jamaica'
        },
        {
            id: '74',
            name: 'Jordan'
        },
        {
            id: '75',
            name: 'Japan'
        },
        {
            id: '76',
            name: 'Kenya'
        },
        {
            id: '77',
            name: 'Kyrgyzstan'
        },
        {
            id: '78',
            name: 'Cambodia'
        },
        {
            id: '79',
            name: 'St Kitts and Nevis'
        },
        {
            id: '80',
            name: 'North Korea'
        },
        {
            id: '81',
            name: 'South Korea'
        },
        {
            id: '82',
            name: 'Kuwait'
        },
        {
            id: '83',
            name: 'Cayman Islands'
        },
        {
            id: '84',
            name: 'Kazakhstan'
        },
        {
            id: '85',
            name: 'Laos'
        },
        {
            id: '86',
            name: 'Lebanon'
        },
        {
            id: '87',
            name: 'St Lucia'
        },
        {
            id: '88',
            name: 'Liechtenstein'
        },
        {
            id: '89',
            name: 'Sri Lanka'
        },
        {
            id: '90',
            name: 'Lithuania'
        },
        {
            id: '91',
            name: 'Luxembourg'
        },
        {
            id: '92',
            name: 'Latvia'
        },
        {
            id: '93',
            name: 'Libya'
        },
        {
            id: '94',
            name: 'Morocco'
        },
        {
            id: '95',
            name: 'Monaco'
        },
        {
            id: '96',
            name: 'Moldova'
        },
        {
            id: '97',
            name: 'San Martin (F)'
        },
        {
            id: '98',
            name: 'Macedonia'
        },
        {
            id: '99',
            name: 'Mali'
        },
        {
            id: '100',
            name: 'Myanmar'
        },
        {
            id: '101',
            name: 'Mongolia'
        },
        {
            id: '102',
            name: 'Macau'
        },
        {
            id: '103',
            name: 'Northern Mariana Island'
        },
        {
            id: '104',
            name: 'Malta'
        },
        {
            id: '105',
            name: 'Mauritius'
        },
        {
            id: '106',
            name: 'Maldives'
        },
        {
            id: '107',
            name: 'Mexico'
        },
        {
            id: '108',
            name: 'Malaysia'
        },
        {
            id: '109',
            name: 'Mozambique'
        },
        {
            id: '110',
            name: 'Namibia'
        },
        {
            id: '111',
            name: 'New Caledonia'
        },
        {
            id: '112',
            name: 'Norfolk Island'
        },
        {
            id: '114',
            name: 'Nicaragua'
        },
        {
            id: '115',
            name: 'Netherlands'
        },
        {
            id: '116',
            name: 'Norway'
        },
        {
            id: '117',
            name: 'Nepal'
        },
        {
            id: '118',
            name: 'New Zealand'
        },
        {
            id: '119',
            name: 'Oman'
        },
        {
            id: '120',
            name: 'Panama'
        },
        {
            id: '121',
            name: 'Peru'
        },
        {
            id: '122',
            name: 'French Polynesia'
        },
        {
            id: '123',
            name: 'Philippines'
        },
        {
            id: '124',
            name: 'Pakistan'
        },
        {
            id: '125',
            name: 'Poland'
        },
        {
            id: '126',
            name: 'Puerto Rico'
        },
        {
            id: '127',
            name: 'Portugal'
        },
        {
            id: '128',
            name: 'Palau'
        },
        {
            id: '129',
            name: 'Paraguay'
        },
        {
            id: '130',
            name: 'Qatar'
        },
        {
            id: '131',
            name: 'Romania'
        },
        {
            id: '132',
            name: 'Serbia and Montenegro'
        },
        {
            id: '133',
            name: 'Russia'
        },
        {
            id: '134',
            name: 'Saudi Arabia'
        },
        {
            id: '135',
            name: 'Seychelles'
        },
        {
            id: '136',
            name: 'Sweden'
        },
        {
            id: '137',
            name: 'Singapore'
        },
        {
            id: '138',
            name: 'Saint Barthelemy'
        },
        {
            id: '139',
            name: 'Slovenia'
        },
        {
            id: '140',
            name: 'Slovakia'
        },
        {
            id: '141',
            name: 'San Marino'
        },
        {
            id: '142',
            name: 'Senegal'
        },
        {
            id: '143',
            name: 'Syria'
        },
        {
            id: '144',
            name: 'Swaziland'
        },
        {
            id: '145',
            name: 'Turks and Caicos Island'
        },
        {
            id: '146',
            name: 'Togo'
        },
        {
            id: '147',
            name: 'Thailand'
        },
        {
            id: '148',
            name: 'Tadjikistan'
        },
        {
            id: '149',
            name: 'Turkmenistan'
        },
        {
            id: '150',
            name: 'Tunisia'
        },
        {
            id: '151',
            name: 'Tonga'
        },
        {
            id: '152',
            name: 'Turkey'
        },
        {
            id: '153',
            name: 'Trinidad and Tobago'
        },
        {
            id: '154',
            name: 'Taiwan'
        },
        {
            id: '155',
            name: 'Tanzania'
        },
        {
            id: '156',
            name: 'Ukraine'
        },
        {
            id: '157',
            name: 'Uganda'
        },
        {
            id: '158',
            name: 'United States'
        },
        {
            id: '159',
            name: 'Uruguay'
        },
        {
            id: '160',
            name: 'Uzbekistan'
        },
        {
            id: '161',
            name: 'St Vincent and Grenadines'
        },
        {
            id: '162',
            name: 'Venezuela'
        },
        {
            id: '163',
            name: 'British Virgin Islands'
        },
        {
            id: '164',
            name: 'Virgin Islands (USA)'
        },
        {
            id: '165',
            name: 'Vietnam'
        },
        {
            id: '166',
            name: 'Vanuatu'
        },
        {
            id: '167',
            name: 'Samoa'
        },
        {
            id: '168',
            name: 'Yemen Republic'
        },
        {
            id: '169',
            name: 'South Africa'
        },
        {
            id: '170',
            name: 'Zambia'
        },
        {
            id: '171',
            name: 'Zimbabwe'
        },
        {
            id: '172',
            name: 'Ghana'
        },
        {
            id: '173',
            name: 'Rwanda'
        },
        {
            id: '174',
            name: 'Fiji'
        }
    ];
    
    function sortByFirstName(a, b)
    {
         var x = a.name.toLowerCase(); 
         var y = b.name.toLowerCase();
         return ((x < y) ? -1 : ((x > y) ? 1 : 0)); 
    }
    
    return countries.sort(sortByFirstName);

});