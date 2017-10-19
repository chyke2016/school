define(function (require) {

    'use strict';

    var countries = [
        {
            id: 4,
            name: "AFGHANISTAN"
  },
        {
            id: 8,
            name: "ALBANIA"
  },
        {
            id: 12,
            name: "ALGERIA"
  },
        {
            id: 16,
            name: "AMERICAN SAMOE"
  },
        {
            id: 1,
            name: "AMMAN"
  },
        {
            id: 20,
            name: "ANDORA"
  },
        {
            id: 24,
            name: "ANGOLA"
  },
        {
            id: 660,
            name: "ANGUILLA"
  },
        {
            id: 10,
            name: "ANTARCTICA"
  },
        {
            id: 26,
            name: "ANTIGUA AND BARBUDA"
  },
        {
            id: 32,
            name: "ARGENTINA"
  },
        {
            id: 533,
            name: "ARUBA"
  },
        {
            id: 36,
            name: "AUSTRALIA"
  },
        {
            id: 40,
            name: "AUSTRIA"
  },
        {
            id: 895,
            name: "Armenia"
  },
        {
            id: 896,
            name: "Azerbaijan"
  },
        {
            id: 44,
            name: "BAHAMAS"
  },
        {
            id: 48,
            name: "BAHRAIN"
  },
        {
            id: 50,
            name: "BANGLADESH"
  },
        {
            id: 52,
            name: "BARBADOS"
  },
        {
            id: 56,
            name: "BELGIUM"
  },
        {
            id: 84,
            name: "BELIZE"
  },
        {
            id: 204,
            name: "BENIN"
  },
        {
            id: 60,
            name: "BERMUDA"
  },
        {
            id: 64,
            name: "BHUTAN"
  },
        {
            id: 68,
            name: "BOLIVIA"
  },
        {
            id: 72,
            name: "BOTSWANA"
  },
        {
            id: 74,
            name: "BOVET ISLAND"
  },
        {
            id: 76,
            name: "BRAZIL"
  },
        {
            id: 86,
            name: "BRITISH INDIAN OCEAN TERRITORY"
  },
        {
            id: 96,
            name: "BRUNEI DARUSSALAM"
  },
        {
            id: 100,
            name: "BULGARIA"
  },
        {
            id: 854,
            name: "BURKINA FASO"
  },
        {
            id: 104,
            name: "BURMA"
  },
        {
            id: 108,
            name: "BURUNDI"
  },
        {
            id: 897,
            name: "Belarus"
  },
        {
            id: 898,
            name: "Bosnia and Herzegovina"
  },
        {
            id: 120,
            name: "CAMEROON"
  },
        {
            id: 124,
            name: "CANADA"
  },
        {
            id: 132,
            name: "CAPE VERDE"
  },
        {
            id: 136,
            name: "CAYMAN ISLANDS"
  },
        {
            id: 140,
            name: "CENTRAL AFRICAN REPUBLIC"
  },
        {
            id: 148,
            name: "CHAD"
  },
        {
            id: 152,
            name: "CHILE"
  },
        {
            id: 156,
            name: "CHINA"
  },
        {
            id: 162,
            name: "CHRISTMAS ISLAND"
  },
        {
            id: 166,
            name: "COCOS (KEELING) ISLANDS"
  },
        {
            id: 170,
            name: "COLOMBIA"
  },
        {
            id: 174,
            name: "COMOROS"
  },
        {
            id: 178,
            name: "CONGO"
  },
        {
            id: 184,
            name: "COOK ISLANDS"
  },
        {
            id: 188,
            name: "COSTA RICA"
  },
        {
            id: 384,
            name: "COTE DLVOIRE"
  },
        {
            id: 192,
            name: "CUBA"
  },
        {
            id: 196,
            name: "CYPRUS"
  },
        {
            id: 200,
            name: "CZECHOSLOVAKIA"
  },
        {
            id: 899,
            name: "Cambodia"
  },
        {
            id: 900,
            name: "Croatia"
  },
        {
            id: 208,
            name: "DENMARK"
  },
        {
            id: 262,
            name: "DJIBOUTI"
  },
        {
            id: 212,
            name: "DOMINICA"
  },
        {
            id: 214,
            name: "DOMINICAN REPUBLIC"
  },
        {
            id: 626,
            name: "EAST TIMOR"
  },
        {
            id: 218,
            name: "ECUADOR"
  },
        {
            id: 818,
            name: "EGYPT"
  },
        {
            id: 222,
            name: "EL SALVADOR"
  },
        {
            id: 226,
            name: "EQUATORIAL GUINEA"
  },
        {
            id: 230,
            name: "ETHIOPIA"
  },
        {
            id: 901,
            name: "Eritrea"
  },
        {
            id: 902,
            name: "Estonia"
  },
        {
            id: 238,
            name: "FALKLAND ISLANDS (MALVINAS)"
  },
        {
            id: 234,
            name: "FARO ISLANDS"
  },
        {
            id: 242,
            name: "FIJI"
  },
        {
            id: 246,
            name: "FINLAND"
  },
        {
            id: 250,
            name: "FRANCE"
  },
        {
            id: 254,
            name: "FRENCH GUIANA"
  },
        {
            id: 258,
            name: "FRENCH POLYNESIA"
  },
        {
            id: 260,
            name: "FRENCH SOUTHERN TERRITORIES"
  },
        {
            id: 266,
            name: "GABON"
  },
        {
            id: 270,
            name: "GAMBIA"
  },
        {
            id: 278,
            name: "GERMAN DEMOCRATIC REPUBLIC"
  },
        {
            id: 280,
            name: "GERMANY,FEDERAL REPUBLIC"
  },
        {
            id: 288,
            name: "GHANA"
  },
        {
            id: 292,
            name: "GIBALTAR"
  },
        {
            id: 300,
            name: "GREECE"
  },
        {
            id: 304,
            name: "GREENLAND"
  },
        {
            id: 312,
            name: "GUADELOUPE"
  },
        {
            id: 316,
            name: "GUAM"
  },
        {
            id: 320,
            name: "GUATEMALA"
  },
        {
            id: 324,
            name: "GUINEA"
  },
        {
            id: 624,
            name: "GUINEA-BISSAU"
  },
        {
            id: 328,
            name: "GUYANA"
  },
        {
            id: 903,
            name: "Georgia"
  },
        {
            id: 904,
            name: "Grenada"
  },
        {
            id: 332,
            name: "HAITI"
  },
        {
            id: 334,
            name: "HEARD AND MCDONALD ISLANDS"
  },
        {
            id: 340,
            name: "HONDURAS"
  },
        {
            id: 344,
            name: "HONG KONG"
  },
        {
            id: 348,
            name: "HUNGARY"
  },
        {
            id: 352,
            name: "ICELAND"
  },
        {
            id: 356,
            name: "INDIA"
  },
        {
            id: 360,
            name: "INDONESIA"
  },
        {
            id: 364,
            name: "IRAN (ISLAMIC REPUBLIC)"
  },
        {
            id: 368,
            name: "IRAQ"
  },
        {
            id: 372,
            name: "IRELAND"
  },
        {
            id: 376,
            name: "ISRAEL"
  },
        {
            id: 380,
            name: "ITALY"
  },
        {
            id: 905,
            name: "Isle of Man"
  },
        {
            id: 388,
            name: "JAMAICA"
  },
        {
            id: 392,
            name: "JAPAN"
  },
        {
            id: 400,
            name: "JORDAN"
  },
        {
            id: 906,
            name: "Johnston Island"
  },
        {
            id: 116,
            name: "KAMPUCHEA , DEMOCRATIC"
  },
        {
            id: 404,
            name: "KENYA"
  },
        {
            id: 296,
            name: "KIRIBATI"
  },
        {
            id: 410,
            name: "KOREA ,REPUBLIC"
  },
        {
            id: 408,
            name: "KOREA,DEMOCRATIC PEOPLE'S REPUBLIC"
  },
        {
            id: 414,
            name: "KUWAIT"
  },
        {
            id: 907,
            name: "Kazakstan"
  },
        {
            id: 908,
            name: "Kyrgyzstan"
  },
        {
            id: 418,
            name: "LAO PEOPLE'S DEMOCRATIC REPUBLIC"
  },
        {
            id: 422,
            name: "LEBANON"
  },
        {
            id: 426,
            name: "LESOTHO"
  },
        {
            id: 430,
            name: "LIBERIA"
  },
        {
            id: 434,
            name: "LIBYAN ARAB JAMAHIRIYA"
  },
        {
            id: 438,
            name: "LIECHTENSTEIN"
  },
        {
            id: 442,
            name: "LUXEMBOURG"
  },
        {
            id: 909,
            name: "Latvia"
  },
        {
            id: 910,
            name: "Lithuania"
  },
        {
            id: 446,
            name: "MACAU"
  },
        {
            id: 450,
            name: "MADAGASCAR"
  },
        {
            id: 454,
            name: "MALAWI"
  },
        {
            id: 458,
            name: "MALAYSIA"
  },
        {
            id: 462,
            name: "MALDIVES"
  },
        {
            id: 466,
            name: "MALI"
  },
        {
            id: 470,
            name: "MALTA"
  },
        {
            id: 584,
            name: "MARSHALL ISLANDS"
  },
        {
            id: 474,
            name: "MARTINIQUE"
  },
        {
            id: 478,
            name: "MAURITANIA"
  },
        {
            id: 480,
            name: "MAURITIUS"
  },
        {
            id: 484,
            name: "MEXICO"
  },
        {
            id: 583,
            name: "MICRONESIA"
  },
        {
            id: 492,
            name: "MONACO"
  },
        {
            id: 496,
            name: "MONGOLIA"
  },
        {
            id: 500,
            name: "MONTSERRAT"
  },
        {
            id: 504,
            name: "MOROCCO"
  },
        {
            id: 508,
            name: "MOZAMBIQUE"
  },
        {
            id: 918,
            name: "Macedonia"
  },
        {
            id: 911,
            name: "Midway Islands"
  },
        {
            id: 914,
            name: "Montenegro"
  },
        {
            id: 516,
            name: "NAMIBIA"
  },
        {
            id: 520,
            name: "NAURU"
  },
        {
            id: 524,
            name: "NEPAL"
  },
        {
            id: 528,
            name: "NETHERLANDS"
  },
        {
            id: 532,
            name: "NETHERLANDS ANTILLES"
  },
        {
            id: 536,
            name: "NEUTRAL ZONE"
  },
        {
            id: 540,
            name: "NEW CALEDONIA"
  },
        {
            id: 554,
            name: "NEW ZELAND"
  },
        {
            id: 558,
            name: "NICARAGUA"
  },
        {
            id: 562,
            name: "NIGER"
  },
        {
            id: 566,
            name: "NIGERIA"
  },
        {
            id: 570,
            name: "NIUE"
  },
        {
            id: 574,
            name: "NORFOLK ISLAND"
  },
        {
            id: 580,
            name: "NORTHEN MARIANA ISLANDS"
  },
        {
            id: 578,
            name: "NORWAY"
  },
        {
            id: 512,
            name: "OMAN"
  },
        {
            id: 586,
            name: "PAKISTAN"
  },
        {
            id: 585,
            name: "PALAU"
  },
        {
            id: 275,
            name: "PALESTINE"
  },
        {
            id: 588,
            name: "PALESTINE"
  },
        {
            id: 590,
            name: "PANAMA"
  },
        {
            id: 598,
            name: "PAPUA NEW GUINEA"
  },
        {
            id: 600,
            name: "PARAGUAY"
  },
        {
            id: 604,
            name: "PERU"
  },
        {
            id: 608,
            name: "PHILIPPINES"
  },
        {
            id: 612,
            name: "PITCAIRN"
  },
        {
            id: 616,
            name: "POLAND"
  },
        {
            id: 620,
            name: "PORTUGAL"
  },
        {
            id: 630,
            name: "PUERTO RICO"
  },
        {
            id: 634,
            name: "QATAR"
  },
        {
            id: 638,
            name: "REUNION"
  },
        {
            id: 642,
            name: "ROMANIA"
  },
        {
            id: 646,
            name: "RWANDA"
  },
        {
            id: 912,
            name: "Republic of Moldova"
  },
        {
            id: 922,
            name: "Republic of Serbia "
  },
        {
            id: 913,
            name: "Russian Federation"
  },
        {
            id: 659,
            name: "SAINT KITTS AND NEVIS"
  },
        {
            id: 662,
            name: "SAINT LUCIA"
  },
        {
            id: 670,
            name: "SAINT VINCENT AND THE GRENADINES"
  },
        {
            id: 882,
            name: "SAMOA"
  },
        {
            id: 674,
            name: "SAN MARINO"
  },
        {
            id: 678,
            name: "SAO TOME AND PRINCIPE"
  },
        {
            id: 682,
            name: "SAUDI ARABIA"
  },
        {
            id: 686,
            name: "SENEGAL"
  },
        {
            id: 690,
            name: "SEYCHELLES"
  },
        {
            id: 702,
            name: "SINGAPORE"
  },
        {
            id: 694,
            name: "SIRRA LEONE"
  },
        {
            id: 90,
            name: "SOLOMON ISLAND"
  },
        {
            id: 706,
            name: "SOMALIA"
  },
        {
            id: 710,
            name: "SOUTH AFRICA"
  },
        {
            id: 724,
            name: "SPAIN"
  },
        {
            id: 144,
            name: "SRI LANKA"
  },
        {
            id: 666,
            name: "ST. PIERRE AND MIQUELON"
  },
        {
            id: 654,
            name: "ST.HELENA"
  },
        {
            id: 736,
            name: "SUDAN"
  },
        {
            id: 740,
            name: "SURINAME"
  },
        {
            id: 744,
            name: "SVALLBARD AND JAN MAYEN ISLANDS"
  },
        {
            id: 752,
            name: "SWEDEN"
  },
        {
            id: 756,
            name: "SWITZERLAND"
  },
        {
            id: 748,
            name: "SWIZILAND"
  },
        {
            id: 760,
            name: "SYRIAN ARAB REPUBLIC"
  },
        {
            id: 915,
            name: "Slovakia"
  },
        {
            id: 916,
            name: "Slovenia"
  },
        {
            id: 158,
            name: "TAIWAN"
  },
        {
            id: 834,
            name: "TANZANIA, UNITED REPUBLIC"
  },
        {
            id: 764,
            name: "THAILAND"
  },
        {
            id: 768,
            name: "TOGO"
  },
        {
            id: 772,
            name: "TOKELAU"
  },
        {
            id: 776,
            name: "TONGA"
  },
        {
            id: 780,
            name: "TRINIDAD AND TOBAGO"
  },
        {
            id: 788,
            name: "TUNISIA"
  },
        {
            id: 792,
            name: "TURKEY"
  },
        {
            id: 796,
            name: "TURKS AND CAICOS ISLANDS"
  },
        {
            id: 798,
            name: "TUVALU"
  },
        {
            id: 917,
            name: "Tajikistan"
  },
        {
            id: 919,
            name: "Turkmenistan"
  },
        {
            id: 800,
            name: "UGANDA"
  },
        {
            id: 804,
            name: "UKRAINIAN SSR"
  },
        {
            id: 784,
            name: "UNITED ARAB EMIRATES"
  },
        {
            id: 826,
            name: "UNITED KINGDOM"
  },
        {
            id: 840,
            name: "UNITED STATES"
  },
        {
            id: 581,
            name: "UNITED STATES MINOR OUTLYING ISLANDS"
  },
        {
            id: 858,
            name: "URUGUAY"
  },
        {
            id: 810,
            name: "USSR"
  },
        {
            id: 920,
            name: "Uzbekistan"
  },
        {
            id: 548,
            name: "VANUATU"
  },
        {
            id: 336,
            name: "VATICAN CITY STATE"
  },
        {
            id: 862,
            name: "VENEZUELA"
  },
        {
            id: 704,
            name: "VIET NAM"
  },
        {
            id: 92,
            name: "VIRGIN ISLANDS (BRITISH)"
  },
        {
            id: 850,
            name: "VIRGIN ISLANDS (U.S)"
  },
        {
            id: 876,
            name: "WALLIS AND FUTUNA ISLANDS"
  },
        {
            id: 732,
            name: "WESTERN SAHARA"
  },
        {
            id: 921,
            name: "Wake Island"
  },
        {
            id: 886,
            name: "YEMEN"
  },
        {
            id: 720,
            name: "YEMEN, DEMOCRATIC"
  },
        {
            id: 890,
            name: "YUGOSLAVIA"
  },
        {
            id: 180,
            name: "ZAIRE"
  },
        {
            id: 894,
            name: "ZAMBIA"
  },
        {
            id: 716,
            name: "ZIMBABWE"
  }
    ];
    return countries;
});