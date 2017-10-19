define(function (require) {

    'use strict';


    var airports = {
        domestic: [{
            name: 'Abuja',
            code: 'ABV'
    }, {
            name: 'Akure',
            code: 'AKR'
    }, {
            name: 'Bauchi',
            code: 'BCU'
    }, {
            name: 'Benin',
            code: 'BNI'
    }, {
            name: 'Calabar',
            code: 'CBQ'
    }, {
            name: 'Enugu',
            code: 'ENU'
    }, {
            name: 'Ibadan',
            code: 'IBA'
    }, {
            name: 'Ilorin',
            code: 'ILR'
    }, {
            name: 'Jos',
            code: 'JOS'
    }, {
            name: 'Kaduna',
            code: 'KAD'
    }, {
            name: 'Kano',
            code: 'KAN'
    }, {
            name: 'Lagos',
            code: 'LOS'
    }, {
            name: 'Maiduguri',
            code: 'MIU'
    }, {
            name: 'Makurdi',
            code: 'MDI'
    }, {
            name: 'Owerri',
            code: 'QOW'
    }, {
            name: 'Port Harcourt',
            code: 'PHC'
    }, {
            name: 'Sokoto',
            code: 'SKO'
    }, {
            name: 'Warri',
            code: 'QRW'
    }, {
            name: 'Yola',
            code: 'YOL'
    }, {
            name: 'Zaria',
            code: 'ZAR'
    }],

        international: [{
            code: "OAJ",
            name: "A J Ellis",
            cityCode: "OAJ",
            cityName: "Jacksonville-NC",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ABZ",
            name: "Aberdeen",
            cityCode: "ABZ",
            cityName: "Aberdeen",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "ABR",
            name: "Aberdeen Mnpl",
            cityCode: "ABR",
            cityName: "Aberdeen",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ABI",
            name: "Abilene",
            cityCode: "ABI",
            cityName: "Abilene",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AUH",
            name: "Abu Dhabi Intl",
            cityCode: "AUH",
            cityName: "Turkistan",
            countryCode: "AE",
            countryName: "Arab Amirat"
    }, {
            code: "ADD",
            name: "Addis Ababa",
            cityCode: "ADD",
            cityName: "Addis Ababa",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "ADL",
            name: "Adelaide",
            cityCode: "ADL",
            cityName: "Adelaide",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "IXA",
            name: "Agartala",
            cityCode: "IXA",
            cityName: "Agartala",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "AGX",
            name: "Agatti Island",
            cityCode: "AGX",
            cityName: "Agatti Island",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "AGR",
            name: "Agra",
            cityCode: "AGR",
            cityName: "Agra",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "AMD",
            name: "Ahmedabad",
            cityCode: "AMD",
            cityName: "Ahmedabad",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "AKL",
            name: "Aickland International",
            cityCode: "AKL",
            cityName: "Auckland",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "AKR",
            name: "Akure Airport ",
            cityCode: "AKR",
            cityName: "Akure",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "ALH",
            name: "Albany - AU",
            cityCode: "ALH",
            cityName: "Albany-WA",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "ABY",
            name: "Albany - GA",
            cityCode: "ABY",
            cityName: "Albany-GA",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ALB",
            name: "Albany Intl Apt",
            cityCode: "ALB",
            cityName: "Albany-NY",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ABQ",
            name: "Albuquerque",
            cityCode: "ABQ",
            cityName: "Albuquerque",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ABX",
            name: "Albury",
            cityCode: "ABX",
            cityName: "Albury",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "ALP",
            name: "Aleppo",
            cityCode: "ALP",
            cityName: "Aleppo",
            countryCode: "SY",
            countryName: "Syria"
    }, {
            code: "ALR",
            name: "Alexandra",
            cityCode: "ALR",
            cityName: "Alexandra",
            countryCode: "SY",
            countryName: "Syria"
    }, {
            code: "ESF",
            name: "Alexandria",
            cityCode: "AEX",
            cityName: "Alexandria",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AEX",
            name: "Alexandria Intl",
            cityCode: "AEX",
            cityName: "Alexandria",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ALG",
            name: "Algiers",
            cityCode: "ALG",
            cityName: "Algiers",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "ASP",
            name: "Alice Springs",
            cityCode: "ASP",
            cityName: "Alice Springs",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "IXD",
            name: "Allahabad",
            cityCode: "IXD",
            cityName: "Allahabad",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "ABE",
            name: "Allentown  Bthlehm",
            cityCode: "ABE",
            cityName: "Allentown Bthlehm",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ALA",
            name: "ALMATY",
            cityCode: "ALA",
            cityName: "Almaty",
            countryCode: "KZ",
            countryName: "Kazakhstan"
    }, {
            code: "APN",
            name: "Alpena",
            cityCode: "APN",
            cityName: "Alpena",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AOC",
            name: "Altenburg Nobitz",
            cityCode: "AOC",
            cityName: "Altenburg Nobitz",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "AOO",
            name: "Altoona",
            cityCode: "AOO",
            cityName: "Altoona",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AMU",
            name: "Amanab",
            cityCode: "AMU",
            cityName: "Amanab",
            countryCode: "PG",
            countryName: "Papua New Guinea"
    }, {
            code: "AMA",
            name: "Amarillo Intl",
            cityCode: "AMA",
            cityName: "Amarillo",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AMM",
            name: "Amman",
            cityCode: "AMM",
            cityName: "Amman",
            countryCode: "JO",
            countryName: "Jordan"
    }, {
            code: "ATQ",
            name: "Amritsar",
            cityCode: "ATQ",
            cityName: "Amritsar",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "AAA",
            name: "Anaa",
            cityCode: "AAA",
            cityName: "Anaa",
            countryCode: "PF",
            countryName: "French Polynesia"
    }, {
            code: "ANA",
            name: "Anaheim",
            cityCode: "ANA",
            cityName: "Anaheim",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ANC",
            name: "Anchorage Intl",
            cityCode: "ANC",
            cityName: "Anchorage",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ANR",
            name: "Antwerp",
            cityCode: "ANR",
            cityName: "Antwerp",
            countryCode: "BE",
            countryName: "Belgium"
    }, {
            code: "ACV",
            name: "Arcata",
            cityCode: "ACV",
            cityName: "Arcata",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GYL",
            name: "Argyle",
            cityCode: "GYL",
            cityName: "Argyle",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "AVL",
            name: "Asheville Mnpl",
            cityCode: "AVL",
            cityName: "Asheville",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ASB",
            name: "Ashgabad",
            cityCode: "ASB",
            cityName: "Ashgabad",
            countryCode: "TM",
            countryName: "Turkmenistan"
    }, {
            code: "ASE",
            name: "Aspen",
            cityCode: "ASE",
            cityName: "Aspen",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ATH",
            name: "Athens",
            cityCode: "ATH",
            cityName: "Athens",
            countryCode: "GR",
            countryName: "Greece"
    }, {
            code: "AHN",
            name: "Athens",
            cityCode: "AHN",
            cityName: "Athens",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ATL",
            name: "Atlanta",
            cityCode: "ATL",
            cityName: "Atlanta",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ACY",
            name: "Atlantic City Intl",
            cityCode: "AIY",
            cityName: "Atlanic City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AGS",
            name: "Augusta",
            cityCode: "AGS",
            cityName: "Augusta",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IXU",
            name: "Aurangabad",
            cityCode: "IXU",
            cityName: "Aurangabad",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "AUS",
            name: "Austin",
            cityCode: "AUS",
            cityName: "Austin",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GRB",
            name: "Austin Field",
            cityCode: "GRB",
            cityName: "Green Bay",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AVN",
            name: "Avignon Caum",
            cityCode: "AVN",
            cityName: "Avignon Caum",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "AYQ",
            name: "Ayers Rock",
            cityCode: "AYQ",
            cityName: "Ayers Rock",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "AIY",
            name: "Bader Field ",
            cityCode: "AIY",
            cityName: "Atlanic City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IXB",
            name: "Bagdogra",
            cityCode: "IXB",
            cityName: "Bagdogra",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "BAH",
            name: "Bahrain Intl",
            cityCode: "BAH",
            cityName: "Bahrain",
            countryCode: "BH",
            countryName: "Bahrain"
    }, {
            code: "BFL",
            name: "Bakersfield",
            cityCode: "BFL",
            cityName: "Bakersfied",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BNK",
            name: "Ballina",
            cityCode: "BNK",
            cityName: "Ballina",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "BWI",
            name: "Baltimore",
            cityCode: "WAS",
            cityName: "Washington",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BLR",
            name: "Bangalore",
            cityCode: "BLR",
            cityName: "Bengaluru",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "BKK",
            name: "Bangkok Intl",
            cityCode: "BKK",
            cityName: "Bangkok",
            countryCode: "TH",
            countryName: "Thailand"
    }, {
            code: "BGR",
            name: "Bangor Intl",
            cityCode: "BGR",
            cityName: "Bangor",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MAD",
            name: "Barajas",
            cityCode: "MAD",
            cityName: "MADRID",
            countryCode: "ES",
            countryName: "Spain"
    }, {
            code: "BCI",
            name: "Barcaldine",
            cityCode: "BCI",
            cityName: "Barcaldine",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "BCN",
            name: "Barcelona",
            cityCode: "BCN",
            cityName: "Barcelona",
            countryCode: "ES",
            countryName: "Spain"
    }, {
            code: "MLH",
            name: "Basel Mulhouse",
            cityCode: "EAP",
            cityName: "Basel Mulhouse",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "BIA",
            name: "Bastia",
            cityCode: "BIA",
            cityName: "Bastia",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "BTR",
            name: "Baton Rouge",
            cityCode: "BTR",
            cityName: "Baton Rouge",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AZO",
            name: "Battle Creek",
            cityCode: "AZO",
            cityName: "Kalamazoo",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BAM",
            name: "Battle Mountain",
            cityCode: "BAM",
            cityName: "Battle Mountain",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BCU",
            name: "Bauchi Airport",
            cityCode: "BCU",
            cityName: "Bauchi",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "PFN",
            name: "Bay County",
            cityCode: "PFN",
            cityName: "Panama City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BYU",
            name: "Bayreuth",
            cityCode: "BYU",
            cityName: "Bayreuth",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "BKW",
            name: "Beckley",
            cityCode: "BKW",
            cityName: "Beckley",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BHD",
            name: "Belfast Intl",
            cityCode: "BFS",
            cityName: "Belfast",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "IXG",
            name: "Belgaum",
            cityCode: "IXG",
            cityName: "Balgaum",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "BLI",
            name: "Bellingham",
            cityCode: "BLI",
            cityName: "Bellingham",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BEO",
            name: "Belmont",
            cityCode: "NTL",
            cityName: "Newcastle",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "BJI",
            name: "Bemidji",
            cityCode: "BJI",
            cityName: "Bemidji",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BEB",
            name: "Benbecula",
            cityCode: "BEB",
            cityName: "Benbecula",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "BNI",
            name: "Benin Airport ",
            cityCode: "BNI",
            cityName: "Benin",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "ZYZ",
            name: "Berchem Railway Stn.",
            cityCode: "ANR",
            cityName: "Antwerp",
            countryCode: "BE",
            countryName: "Belgium"
    }, {
            code: "TXL",
            name: "Berlin - Tegel",
            cityCode: "BER",
            cityName: "Berlin",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "THF",
            name: "Berlin-Tempelhof",
            cityCode: "BER",
            cityName: "Berlin",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "BRN",
            name: "Berne",
            cityCode: "BRN",
            cityName: "Berne",
            countryCode: "CH",
            countryName: "Switzerland"
    }, {
            code: "BHU",
            name: "Bhavnagar",
            cityCode: "BHU",
            cityName: "Bhavnagar",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "BHO",
            name: "Bhopal",
            cityCode: "BHO",
            cityName: "Bhopal",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "BBI",
            name: "Bhubaneswar",
            cityCode: "BBI",
            cityName: "Bhubaneshwar",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "BHJ",
            name: "Bhuj",
            cityCode: "BHJ",
            cityName: "Bhuj",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "BIQ",
            name: "Biarritz Parme",
            cityCode: "BIQ",
            cityName: "Biarritz",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "BIL",
            name: "Billings",
            cityCode: "BIL",
            cityName: "Billings",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GPT",
            name: "Biloxi Regional",
            cityCode: "GPT",
            cityName: "Gulfport",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BGM",
            name: "Binghamton",
            cityCode: "BGM",
            cityName: "Binghamton",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BHM",
            name: "Birmingham - AL",
            cityCode: "BHM",
            cityName: "Birmingham-AL",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BHX",
            name: "Birmingham - UK",
            cityCode: "BHX",
            cityName: "Birmingham",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "FNT",
            name: "Bishop",
            cityCode: "FNT",
            cityName: "Flint",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BIS",
            name: "Bismarck",
            cityCode: "BIS",
            cityName: "Bismarck",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BKQ",
            name: "Blackall",
            cityCode: "BKQ",
            cityName: "Blackall",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "BOD",
            name: "Bordeaux Airport",
            cityCode: "BOD",
            cityName: "Bordeaux",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "BOU",
            name: "Bourges",
            cityCode: "BOU",
            cityName: "Bourges",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "SRQ",
            name: "Bradenton",
            cityCode: "SRQ",
            cityName: "Sarasota",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BFD",
            name: "Bradford",
            cityCode: "BFD",
            cityName: "Bradford",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SGF",
            name: "Branson Rg",
            cityCode: "SGF",
            cityName: "Springfield",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BRE",
            name: "Bremen",
            cityCode: "BRE",
            cityName: "Bremen",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "BSH",
            name: "Brighton",
            cityCode: "BSH",
            cityName: "Brighton",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "BNE",
            name: "Brisbane",
            cityCode: "BNE",
            cityName: "Brisbane",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "BRS",
            name: "Bristol Intl",
            cityCode: "BRS",
            cityName: "Bristol",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "BME",
            name: "Broome",
            cityCode: "BME",
            cityName: "Broome",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "BRO",
            name: "Brownsville",
            cityCode: "BRO",
            cityName: "Brownsville",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BRU",
            name: "Brussels",
            cityCode: "BRU",
            cityName: "Brussels",
            countryCode: "BE",
            countryName: "Belgium"
    }, {
            code: "OTP",
            name: "Bucharest Otopeni Intl",
            cityCode: "BUH",
            cityName: "Bucharest",
            countryCode: "RO",
            countryName: "Romani"
    }, {
            code: "BUD",
            name: "Budapest",
            cityCode: "BUD",
            cityName: "Budapest",
            countryCode: "HU",
            countryName: "Hungary"
    }, {
            code: "BUF",
            name: "Buffalo Niagara Intl",
            cityCode: "BUF",
            cityName: "Buffalo",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BDB",
            name: "Bundaberg",
            cityCode: "BDB",
            cityName: "Bundaberg",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "BUR",
            name: "Burbank",
            cityCode: "BUR",
            cityName: "Burbank",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BRL",
            name: "Burlington - IO",
            cityCode: "BRL",
            cityName: "Burlington-IO",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BTV",
            name: "Burlington Intl",
            cityCode: "BTV",
            cityName: "Burlington",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BWT",
            name: "Burnie Wyn",
            cityCode: "BWT",
            cityName: "Burnie Wyn",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "PUS",
            name: "Busan",
            cityCode: "PUS",
            cityName: "Busan",
            countryCode: "KR",
            countryName: "Korea"
    }, {
            code: "BTM",
            name: "Butte",
            cityCode: "BTM",
            cityName: "Butte",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CAD",
            name: "Cadillac",
            cityCode: "CAD",
            cityName: "Cadillac",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CFR",
            name: "Caen",
            cityCode: "CFR",
            cityName: "Caen",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "CNS",
            name: "Cairns",
            cityCode: "CNS",
            cityName: "Cairns",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "CAI",
            name: "Cairo Intl",
            cityCode: "CAI",
            cityName: "Cairo",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "CQF",
            name: "Calais",
            cityCode: "CQF",
            cityName: "Calais",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "YYC",
            name: "Calgary Intl",
            cityCode: "YYC",
            cityName: "Calgary",
            countryCode: "CA",
            countryName: "Canada"
    }, {
            code: "CCJ",
            name: "Calicut",
            cityCode: "CCJ",
            cityName: "Calicut",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "JST",
            name: "Cambria County",
            cityCode: "JST",
            cityName: "Johnstown",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CBG",
            name: "Cambridge",
            cityCode: "CBG",
            cityName: "Cambridge",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "CAM",
            name: "Camiri",
            cityCode: "CAM",
            cityName: "Camiri",
            countryCode: "BO",
            countryName: "Bolivia"
    }, {
            code: "CBR",
            name: "Canberra",
            cityCode: "CBR",
            cityName: "Canberra",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "CAK",
            name: "Canton Akron",
            cityCode: "CAK",
            cityName: "Canton Akron",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CPT",
            name: "Cape Town Intl",
            cityCode: "CPT",
            cityName: "Cape Town",
            countryCode: "ZA",
            countryName: "South Africa "
    }, {
            code: "PEK",
            name: "Capital Apt",
            cityCode: "BJS",
            cityName: "Beijing",
            countryCode: "CN",
            countryName: "China"
    }, {
            code: "LAN",
            name: "Capital City",
            cityCode: "LAN",
            cityName: "Lansing",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CWL",
            name: "Cardiff Wales",
            cityCode: "CWL",
            cityName: "Cardiff",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "CLD",
            name: "Carlsbad",
            cityCode: "CLD",
            cityName: "Carlsbad",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CVQ",
            name: "Carnarvon",
            cityCode: "CVQ",
            cityName: "Carnarvon",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "CSN",
            name: "Carson City",
            cityCode: "CSN",
            cityName: "Carson City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CPR",
            name: "Casper",
            cityCode: "CPR",
            cityName: "Casper",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AVX",
            name: "Catalina Island",
            cityCode: "AVX",
            cityName: "Catalina Island",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CCC",
            name: "Cayo Coco",
            cityCode: "CCC",
            cityName: "Cayo Coco",
            countryCode: "CU",
            countryName: "Cuba"
    }, {
            code: "CEB",
            name: "Cebu",
            cityCode: "CEB",
            cityName: "Cebu",
            countryCode: "PH",
            countryName: "Philippines"
    }, {
            code: "CDC",
            name: "Cedar City",
            cityCode: "CDC",
            cityName: "Cedar City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CDK",
            name: "Cedar Key",
            cityCode: "CDK",
            cityName: "Cedar Key",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CID",
            name: "Cedar Rapids",
            cityCode: "CID",
            cityName: "Cedar Rapids",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IXC",
            name: "Chandigarh",
            cityCode: "IXC",
            cityName: "Chandigarh",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "CDG",
            name: "Charles De Gaulle",
            cityCode: "PAR",
            cityName: "Paris",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "CHS",
            name: "Charleston",
            cityCode: "CHS",
            cityName: "Charleston",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CTL",
            name: "Charleville",
            cityCode: "CTL",
            cityName: "Charleville",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "CLT",
            name: "Charlotte",
            cityCode: "CLT",
            cityName: "Charlotte",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CHO",
            name: "Charlottesville - VA",
            cityCode: "CHO",
            cityName: "Charlottesville-VA",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CHA",
            name: "Chattanooga",
            cityCode: "CHA",
            cityName: "Chattanooga",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MAA",
            name: "Chennai",
            cityCode: "MAA",
            cityName: "Chennai",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "CYS",
            name: "Cheyenne",
            cityCode: "CYS",
            cityName: "Cheyennie",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CNX",
            name: "Chiang Mai Intl",
            cityCode: "CNX",
            cityName: "Chiang Mai",
            countryCode: "TH",
            countryName: "Thailand"
    }, {
            code: "ORD",
            name: "Chicago O hare Intl",
            cityCode: "CHI",
            cityName: "Chicago",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CIC",
            name: "Chico",
            cityCode: "CIC",
            cityName: "Chico",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CIU",
            name: "Chippewa",
            cityCode: "SSM",
            cityName: "Sault Ste Marie",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HIB",
            name: "Chisholm",
            cityCode: "HIB",
            cityName: "Chisholm",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CGP",
            name: "Chittagong",
            cityCode: "CGP",
            cityName: "Chittagong",
            countryCode: "BD",
            countryName: "Bangladesh"
    }, {
            code: "CHC",
            name: "Christchurch",
            cityCode: "CHC",
            cityName: "Christchurch",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "CVG",
            name: "Cincinnati",
            cityCode: "CVG",
            cityName: "Cincinnati",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CKB",
            name: "Clarksburg",
            cityCode: "CKB",
            cityName: "Clarksburg",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CFE",
            name: "Clermont Ferrand",
            cityCode: "CFE",
            cityName: "Clermont Ferrand",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "CLE",
            name: "Cleveland",
            cityCode: "CLE",
            cityName: "Cleveland",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CSM",
            name: "Clinton",
            cityCode: "CSM",
            cityName: "Clinton",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "COD",
            name: "Cody",
            cityCode: "COD",
            cityName: "Cody",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CFS",
            name: "Coffs Harbour",
            cityCode: "CFS",
            cityName: "Coffs Harbour",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "CJB",
            name: "Coimbatore",
            cityCode: "CJB",
            cityName: "Coimbatore",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "CMB",
            name: "Colombo",
            cityCode: "CMB",
            cityName: "Colombo",
            countryCode: "LK",
            countryName: "Sri Lanka"
    }, {
            code: "COS",
            name: "Colorado Springs",
            cityCode: "COS",
            cityName: "Colorado Springs",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CAE",
            name: "Columbia Met",
            cityCode: "CAE",
            cityName: "Columbia",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "COU",
            name: "Columbia Rgnl",
            cityCode: "COU",
            cityName: "Columbia-MO",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CSG",
            name: "Columbus - GA",
            cityCode: "CSG",
            cityName: "Columbus-GA",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "OOM",
            name: "Cooma",
            cityCode: "OOM",
            cityName: "Cooma",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "CPH",
            name: "Copenhagen Apt",
            cityCode: "CPH",
            cityName: "Copenhagen",
            countryCode: "DK",
            countryName: "Denmark"
    }, {
            code: "CRP",
            name: "Corpus Christi",
            cityCode: "CRP",
            cityName: "Corpus Christi",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CVO",
            name: "Corvallis",
            cityCode: "CVO",
            cityName: "Corvallis",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SBP",
            name: "County Apt",
            cityCode: "CSL",
            cityName: "San Luis Obispo",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "VCT",
            name: "County Foster",
            cityCode: "VCT",
            cityName: "Victoria",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CVT",
            name: "Coventry",
            cityCode: "CVT",
            cityName: "Coventry",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "CEC",
            name: "Crescent City",
            cityCode: "CEC",
            cityName: "Crescent City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BRD",
            name: "Crow Wing Cnty",
            cityCode: "BRD",
            cityName: "Brainerd",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DCK",
            name: "Dahl Creek",
            cityCode: "DCK",
            cityName: "Dahl Creek",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DFW",
            name: "Dallas Ft Worth",
            cityCode: "DFW",
            cityName: "Dallas",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DAM",
            name: "Damascus Intl",
            cityCode: "DAM",
            cityName: "Damascus",
            countryCode: "SY",
            countryName: "Syria"
    }, {
            code: "DMM",
            name: "Dammam ",
            cityCode: "DMM",
            cityName: "Dammam",
            countryCode: "SA",
            countryName: "Saudi Arabia"
    }, {
            code: "MSN",
            name: "Dane County Region",
            cityCode: "MSN",
            cityName: "Madison",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DRW",
            name: "Darwin",
            cityCode: "DRW",
            cityName: "Darwin",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "DAY",
            name: "Dayton",
            cityCode: "DAY",
            cityName: "Dayton",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DAB",
            name: "Daytona Beach",
            cityCode: "DAB",
            cityName: "Daytona Beach",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DEL",
            name: "Delhi",
            cityCode: "DEL",
            cityName: "New Delhi",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "ESC",
            name: "Delta County",
            cityCode: "ESC",
            cityName: "Escanaba",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DPS",
            name: "Denpasar Bali",
            cityCode: "DPS",
            cityName: "Bali",
            countryCode: "ID",
            countryName: "Indonesia"
    }, {
            code: "DEN",
            name: "Denver Intl",
            cityCode: "DEN",
            cityName: "Denver",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DRB",
            name: "Derby",
            cityCode: "DRB",
            cityName: "Derby",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "DSM",
            name: "Des Moines",
            cityCode: "DSM",
            cityName: "Des Moines",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DTW",
            name: "Detroit Metro",
            cityCode: "DTT",
            cityName: "Detroit",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DPO",
            name: "Devonport",
            cityCode: "DPO",
            cityName: "Devonport",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "DIB",
            name: "Dibrugarh",
            cityCode: "DIB",
            cityName: "Dibrugarh",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "DIJ",
            name: "Dijon",
            cityCode: "DIJ",
            cityName: "Dijon",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "DWS",
            name: "Disney World",
            cityCode: "ORL",
            cityName: "Orlando",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DIU",
            name: "Diu",
            cityCode: "DIU",
            cityName: "Diu",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "DDC",
            name: "Dodge City",
            cityCode: "DDC",
            cityName: "Dodge City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DOH",
            name: "Doha",
            cityCode: "DOH",
            cityName: "Doha",
            countryCode: "QA",
            countryName: "Qatar"
    }, {
            code: "DME",
            name: "Domodedovo",
            cityCode: "VKO",
            cityName: "Moscow",
            countryCode: "RU",
            countryName: "Russian Federation"
    }, {
            code: "DTM",
            name: "Dortmund",
            cityCode: "DTM",
            cityName: "Dortmund",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "DHN",
            name: "Dothan",
            cityCode: "DHN",
            cityName: "Dothan",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DUG",
            name: "Douglas",
            cityCode: "DUG",
            cityName: "Douglas",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DRS",
            name: "Dresden Apt",
            cityCode: "DRS",
            cityName: "Dresden",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "EVV",
            name: "Dress Rgnl",
            cityCode: "EVV",
            cityName: "Evansville",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DXB",
            name: "Dubai",
            cityCode: "DXB",
            cityName: "Dubai",
            countryCode: "AE",
            countryName: "Arab Amirat"
    }, {
            code: "DBO",
            name: "Dubbo",
            cityCode: "DBO",
            cityName: "Dubbo",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "DUB",
            name: "Dublin",
            cityCode: "DUB",
            cityName: "Dublin",
            countryCode: "IE",
            countryName: "Ireland"
    }, {
            code: "DBQ",
            name: "Dubuque Mnpl",
            cityCode: "DBQ",
            cityName: "Dubuque",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DLH",
            name: "Duluth Intl",
            cityCode: "DLH",
            cityName: "Duluth",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DUD",
            name: "Dunedin",
            cityCode: "DUD",
            cityName: "Dunedin",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "DRO",
            name: "Durango",
            cityCode: "DRO",
            cityName: "Durango",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DUR",
            name: "Durban Intl",
            cityCode: "DUR",
            cityName: "Durban",
            countryCode: "ZA",
            countryName: "South Africa "
    }, {
            code: "DUS",
            name: "Dusseldorf",
            cityCode: "DUS",
            cityName: "Dusseldorf",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "CLL",
            name: "Easterw",
            cityCode: "CLL",
            cityName: "College Station-TX",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "EAU",
            name: "Eau Claire",
            cityCode: "EAU",
            cityName: "Eau Claire",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "EDI",
            name: "Edinburgh - UK",
            cityCode: "EDI",
            cityName: "Edinburgh",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "YEG",
            name: "Edmonton",
            cityCode: "YEA",
            cityName: "Edmonton",
            countryCode: "CA",
            countryName: "Canada"
    }, {
            code: "EIN",
            name: "Eindhoven",
            cityCode: "EIN",
            cityName: "Eindhoven",
            countryCode: "NL",
            countryName: "Netherlands"
    }, {
            code: "IPL",
            name: "El Centro",
            cityCode: "IPL",
            cityName: "El Centro",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ELP",
            name: "El Paso Intl",
            cityCode: "ELP",
            cityName: "El Paso",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SAH",
            name: "El Rahaba Airport",
            cityCode: "SAH",
            cityName: "Sanaa",
            countryCode: "YE",
            countryName: "Yemen"
    }, {
            code: "EKO",
            name: "Elko",
            cityCode: "EKO",
            cityName: "Elko",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "EFD",
            name: "Ellington Field",
            cityCode: "HOU",
            cityName: "Houston",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ELM",
            name: "Elmira",
            cityCode: "ELM",
            cityName: "Elmira",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "EMD",
            name: "Emerald",
            cityCode: "EMD",
            cityName: "Emerald",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "PLN",
            name: "Emmet County",
            cityCode: "PLN",
            cityName: "Pellston",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ENU",
            name: "Enugu Airport ",
            cityCode: "ENU",
            cityName: "Enugu",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "ECN",
            name: "Ercan",
            cityCode: "ECN",
            cityName: "ERCAN",
            countryCode: "CY",
            countryName: "Cyprus"
    }, {
            code: "ERF",
            name: "Erfurt",
            cityCode: "ERF",
            cityName: "Erfurt",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "ERI",
            name: "Erie Intl",
            cityCode: "ERI",
            cityName: "Erie",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ESS",
            name: "Essen",
            cityCode: "ESS",
            cityName: "Essen",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "EUG",
            name: "Eugene",
            cityCode: "EUG",
            cityName: "Eugene",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FAI",
            name: "Fairbanks Intl",
            cityCode: "FAI",
            cityName: "Fairbanks",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CLM",
            name: "Fairchild",
            cityCode: "CLM",
            cityName: "Port Angeles",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IDA",
            name: "Fanning Fld ",
            cityCode: "IDA",
            cityName: "Idaho Falls",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FAY",
            name: "Fayetttville - NC",
            cityCode: "FAY",
            cityName: "Fayetteville",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FVL",
            name: "Flora Valley",
            cityCode: "FVL",
            cityName: "Flora Valley",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "FLR",
            name: "Florence",
            cityCode: "FLR",
            cityName: "Florence",
            countryCode: "IT",
            countryName: "Italy"
    }, {
            code: "FLO",
            name: "Florence - SC",
            cityCode: "FLO",
            cityName: "Florence",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FOD",
            name: "Fort Dodge",
            cityCode: "FOD",
            cityName: "Fort Dodge",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FLL",
            name: "Fort Lauderdale",
            cityCode: "FLL",
            cityName: "Fort Lauderdale",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "RSW",
            name: "Fort Myers",
            cityCode: "FMY",
            cityName: "Fort Myers",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FSM",
            name: "Fort Smith Mnpl",
            cityCode: "FSM",
            cityName: "Fort Smith",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FRA",
            name: "Frankfurt Intl",
            cityCode: "FRA",
            cityName: "Frankfurt",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "FKL",
            name: "Franklin ",
            cityCode: "FKL",
            cityName: "Fraklin",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MUC",
            name: "Franz Josef Strauss",
            cityCode: "MUC",
            cityName: "Munich",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "MZM",
            name: "Frescaty",
            cityCode: "MZM",
            cityName: "Metz Frescaty",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "FAT",
            name: "Fresno-Airterminal",
            cityCode: "FAT",
            cityName: "Fresno",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FDH",
            name: "Friedrichshafen",
            cityCode: "FDH",
            cityName: "Friedrichshafen",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "FUK",
            name: "Fukuoka",
            cityCode: "FUK",
            cityName: "Fukuoka",
            countryCode: "JP",
            countryName: "Japan"
    }, {
            code: "GNV",
            name: "Gainesville - FL",
            cityCode: "GNV",
            cityName: "Gainesville-FL",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BZN",
            name: "Gallatin Field",
            cityCode: "BZN",
            cityName: "Bozeman",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GCK",
            name: "Garden City",
            cityCode: "GCK",
            cityName: "Garden City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LGW",
            name: "Gatwick",
            cityCode: "LON",
            cityName: "London",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "GVA",
            name: "Geneva",
            cityCode: "GVA",
            cityName: "Geneva",
            countryCode: "CH",
            countryName: "Switzerland"
    }, {
            code: "GET",
            name: "Geraldton",
            cityCode: "GET",
            cityName: "Geraldton",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "GSM",
            name: "Gheshm",
            cityCode: "GSM",
            cityName: "Gheshm",
            countryCode: "IR",
            countryName: "Iran"
    }, {
            code: "GIS",
            name: "Gisborne",
            cityCode: "GIS",
            cityName: "Gisborne",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "FCA",
            name: "Glacier Natio",
            cityCode: "FCA",
            cityName: "Kalispell",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GLT",
            name: "Gladstone",
            cityCode: "GLT",
            cityName: "Gladstone",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "GLA",
            name: "Glasgow Int",
            cityCode: "GLA",
            cityName: "Glasgow",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "BQK",
            name: "Glynko Jetport",
            cityCode: "SSI",
            cityName: "Brunswick",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GOI",
            name: "Goa-Dabolim Apt",
            cityCode: "GOI",
            cityName: "Goa",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "OOL",
            name: "Gold Coast",
            cityCode: "OOL",
            cityName: "Gold Coast",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "GTR",
            name: "Golden Triangle",
            cityCode: "GTR",
            cityName: "Columbus-MS",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GOV",
            name: "Gove",
            cityCode: "GOV",
            cityName: "Gove",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "BOI",
            name: "Gowen Fld",
            cityCode: "BOI",
            cityName: "Boise",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FPO",
            name: "Grand Bahama",
            cityCode: "FPO",
            cityName: "Freeport",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GCN",
            name: "Grand Canyon",
            cityCode: "GCN",
            cityName: "Grand Canyon",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GFK",
            name: "Grand Forks",
            cityCode: "GFK",
            cityName: "Grand Forks",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GJT",
            name: "Grand Junction",
            cityCode: "GJT",
            cityName: "Grand Junction",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GRR",
            name: "Grand Rapids",
            cityCode: "GRR",
            cityName: "Grand Rapids-MI",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GPZ",
            name: "Grand Rapids",
            cityCode: "GPZ",
            cityName: "Grand Rapids-MN",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ILG",
            name: "Great  Wilming",
            cityCode: "ILG",
            cityName: "Wilmington-DE",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GBD",
            name: "Great Bend",
            cityCode: "GBD",
            cityName: "Great Bend",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GTF",
            name: "Great Falls",
            cityCode: "GTF",
            cityName: "Great Falls",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PIA",
            name: "Greater Peoria",
            cityCode: "PIA",
            cityName: "Peoria",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LWB",
            name: "Greenbrier Valley",
            cityCode: "LWB",
            cityName: "Lewisburg",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GSO",
            name: "Greensboro",
            cityCode: "GSO",
            cityName: "Greensboro",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GSP",
            name: "Greenville",
            cityCode: "GSP",
            cityName: "Greenville",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GLH",
            name: "Greenville - MS",
            cityCode: "GLH",
            cityName: "Greenville-MS",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GTE",
            name: "Groote Eylandt",
            cityCode: "GTE",
            cityName: "Groote Eylandt",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "GON",
            name: "Groton",
            cityCode: "GON",
            cityName: "Groton",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CAN",
            name: "Guangzhou",
            cityCode: "CAN",
            cityName: "GUANGZHOU",
            countryCode: "CN",
            countryName: "China"
    }, {
            code: "GCI",
            name: "Guernsey",
            cityCode: "GCI",
            cityName: "Guernsey",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "GUC",
            name: "Gunnison",
            cityCode: "GUC",
            cityName: "Gunnison",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GAU",
            name: "Guwahati",
            cityCode: "GAU",
            cityName: "Guwahati",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "GWL",
            name: "Gwalior",
            cityCode: "GWL",
            cityName: "Gwalior",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "YHZ",
            name: "Halifax",
            cityCode: "CAD",
            cityName: "Cadillac",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HAM",
            name: "Hamburg",
            cityCode: "HAM",
            cityName: "Hamburg",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "HLZ",
            name: "Hamilton - NZ",
            cityCode: "HLZ",
            cityName: "Hamilton",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "HTI",
            name: "Hamilton Island",
            cityCode: "HTI",
            cityName: "Hamilton Island",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "HAN",
            name: "Hanoi Noibai",
            cityCode: "HAN",
            cityName: "HANOI",
            countryCode: "VN",
            countryName: "Vietnam"
    }, {
            code: "HAJ",
            name: "Hanover Apt",
            cityCode: "HAJ",
            cityName: "Hanover",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "HRL",
            name: "Harlingen",
            cityCode: "HRL",
            cityName: "Harlingen",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MDT",
            name: "Harrisburg Intl",
            cityCode: "HAR",
            cityName: "Harrisburg",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BDL",
            name: "Hartford",
            cityCode: "HFD",
            cityName: "Hartford",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PIB",
            name: "Hattiesburg",
            cityCode: "LUL",
            cityName: "Laurel",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HDN",
            name: "Hayden",
            cityCode: "HDN",
            cityName: "Hayden",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HIS",
            name: "Hayman Island",
            cityCode: "HIS",
            cityName: "Hayman Island",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "HYS",
            name: "Hays",
            cityCode: "HYS",
            cityName: "Hays",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LHR",
            name: "Heathrow",
            cityCode: "LON",
            cityName: "London",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "FAR",
            name: "Hector Field",
            cityCode: "FAR",
            cityName: "Fargo",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HDB",
            name: "Heidelberg",
            cityCode: "HDB",
            cityName: "Heidelberg",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "HLN",
            name: "Helena",
            cityCode: "HLN",
            cityName: "Helena",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HEL",
            name: "Helsinki-Vantaa",
            cityCode: "HEL",
            cityName: "Vantaa",
            countryCode: "FI",
            countryName: "Finland"
    }, {
            code: "HHH",
            name: "Hilton Head",
            cityCode: "HHH",
            cityName: "Hilton Head",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SGN",
            name: "Ho Chi Minh City",
            cityCode: "SGN",
            cityName: "HO CHI MINH CITY",
            countryCode: "VN",
            countryName: "Vietnam"
    }, {
            code: "HBA",
            name: "Hobart",
            cityCode: "HBA",
            cityName: "Hobart",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "HOU",
            name: "Hobby",
            cityCode: "HOU",
            cityName: "Houston",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HOQ",
            name: "Hof",
            cityCode: "HOQ",
            cityName: "Hof",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "HKK",
            name: "Hokitika",
            cityCode: "HKK",
            cityName: "Hokitika",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "HKG",
            name: "Hong Kong Intl",
            cityCode: "HKG",
            cityName: "Hong Kong",
            countryCode: "HK",
            countryName: "Hong Kong"
    }, {
            code: "HNL",
            name: "Honolulu Intl",
            cityCode: "HNL",
            cityName: "Honolulu",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HID",
            name: "Horn Island Qld",
            cityCode: "HID",
            cityName: "Horn Island Qld",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "CMX",
            name: "Houghton County",
            cityCode: "CMX",
            cityName: "Hancock",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IAH",
            name: "Houston",
            cityCode: "HOU",
            cityName: "Houston",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HBX",
            name: "Hubli",
            cityCode: "HBX",
            cityName: "Hubli",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "HUY",
            name: "Humberside",
            cityCode: "HUY",
            cityName: "Humberside",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "HTS",
            name: "Huntington",
            cityCode: "HTS",
            cityName: "Huntington",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HSV",
            name: "Huntsville - AL",
            cityCode: "HSV",
            cityName: "Huntsville",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HYA",
            name: "Hyannis",
            cityCode: "HYA",
            cityName: "Hyannis",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HYD",
            name: "Hyderabad",
            cityCode: "HYD",
            cityName: "Hyderabad",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "IBA",
            name: "Ibadan Airport ",
            cityCode: "IBA",
            cityName: "Ibadan",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "IMF",
            name: "Imphal",
            cityCode: "IMF",
            cityName: "Imphal",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "IND",
            name: "Indianapolis",
            cityCode: "IND",
            cityName: "Indianapolis",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IDR",
            name: "Indore",
            cityCode: "IDR",
            cityName: "Indore",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "INN",
            name: "Innsbruck",
            cityCode: "INN",
            cityName: "Innsbruck",
            countryCode: "AT",
            countryName: "Austria"
    }, {
            code: "INL",
            name: "International Falls",
            cityCode: "INL",
            cityName: "International Falls",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IVC",
            name: "Invercargill",
            cityCode: "IVC",
            cityName: "Invercargill",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "INV",
            name: "Inverness",
            cityCode: "INV",
            cityName: "Inverness",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "IYK",
            name: "Inyokern",
            cityCode: "IYK",
            cityName: "Inyokern",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ISB",
            name: "Islamabad Intl",
            cityCode: "ISB",
            cityName: "Islamabad",
            countryCode: "PK",
            countryName: "Pakistan"
    }, {
            code: "IOM",
            name: "Isle Of Man",
            cityCode: "IOM",
            cityName: "Isle Of Man",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "ISC",
            name: "Isles Of Scilly",
            cityCode: "ISC",
            cityName: "Isles Of Scilly",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "ISP",
            name: "Islip",
            cityCode: "ISP",
            cityName: "Islip",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IST",
            name: "Istanbul",
            cityCode: "IST",
            cityName: "Istanbul",
            countryCode: "TR",
            countryName: "Turkey"
    }, {
            code: "ITH",
            name: "Ithaca",
            cityCode: "ITH",
            cityName: "Ithaca",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AEP",
            name: "J Newbery Buenos Aires",
            cityCode: "BUE",
            cityName: "Buenos Aires",
            countryCode: "AR",
            countryName: "Argentina"
    }, {
            code: "MFR",
            name: "Jackson County",
            cityCode: "MFR",
            cityName: "Medford",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "JAC",
            name: "Jackson Hole - WY",
            cityCode: "JAC",
            cityName: "Jackson-WY",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "JAN",
            name: "Jackson Intl",
            cityCode: "JAN",
            cityName: "Jackson-MS",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "JAX",
            name: "Jacksonville - FL",
            cityCode: "JAX",
            cityName: "Jacksonville",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "JAI",
            name: "Jaipur",
            cityCode: "JAI",
            cityName: "Jaipur",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "CGK",
            name: "Jakarta",
            cityCode: "JKT",
            cityName: "Jakarta",
            countryCode: "ID",
            countryName: "Indonesia"
    }, {
            code: "JHW",
            name: "Jamestown  ",
            cityCode: "JHW",
            cityName: "Jamestown",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IXJ",
            name: "Jammu",
            cityCode: "IXJ",
            cityName: "Jammu",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "JGA",
            name: "Jamnagar",
            cityCode: "JGA",
            cityName: "Jamnagar",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "BPT",
            name: "Jefferson Cnty",
            cityCode: "BPT",
            cityName: "Beaumont",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DUJ",
            name: "Jefferson County",
            cityCode: "DUJ",
            cityName: "Dubois",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "JER",
            name: "Jersey",
            cityCode: "JER",
            cityName: "Jersey",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "JDH",
            name: "Jodhpur",
            cityCode: "JDH",
            cityName: "Jodhpur",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "JNB",
            name: "Johannesburg",
            cityCode: "JNB",
            cityName: "Johannesburg",
            countryCode: "ZA",
            countryName: "South Africa "
    }, {
            code: "JLP",
            name: "Juan Les Pins",
            cityCode: "JLP",
            cityName: "Juan Les Pins",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "SUB",
            name: "Juanda Surabaya",
            cityCode: "SUB",
            cityName: "SURABAYA",
            countryCode: "ID",
            countryName: "Indonesia"
    }, {
            code: "JNU",
            name: "Juneau Intl",
            cityCode: "JNU",
            cityName: "Juneau",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "KBL",
            name: "Kabul",
            cityCode: "KBL",
            cityName: "Kabul",
            countryCode: "AF",
            countryName: "Afghanistan"
    }, {
            code: "KAD",
            name: "Kaduna Airport",
            cityCode: "KAD",
            cityName: "Kaduna",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "OGG",
            name: "Kahului",
            cityCode: "OGG",
            cityName: "Kahului",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IHX",
            name: "Kailashahar",
            cityCode: "IHX",
            cityName: "Kailashahar",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "IXH",
            name: "Kailashahar",
            cityCode: "IXH",
            cityName: "Kailashahar",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "KAT",
            name: "Kaitaia",
            cityCode: "KAT",
            cityName: "Kaitaia",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "KGI",
            name: "Kalgoorlie",
            cityCode: "KGI",
            cityName: "Kalgoorlie",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "KNU",
            name: "Kanpur",
            cityCode: "KNU",
            cityName: "Kanpur",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "MCI",
            name: "Kansas City",
            cityCode: "MKC",
            cityName: "Kansas City-MO",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "KCK",
            name: "Kansas City - KS",
            cityCode: "KCK",
            cityName: "Kansas City-KS",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "KHI",
            name: "Karachi",
            cityCode: "KHI",
            cityName: "Krachi",
            countryCode: "PK",
            countryName: "Pakistan"
    }, {
            code: "FKB",
            name: "Karlsruhe",
            cityCode: "FKB",
            cityName: "Karlsruhe",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "KTA",
            name: "Karratha",
            cityCode: "KTA",
            cityName: "Karratha",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "KTM",
            name: "Kathmandu",
            cityCode: "KTM",
            cityName: "Kathmandu",
            countryCode: "NP",
            countryName: "Nepal"
    }, {
            code: "LIH",
            name: "Kauai Island",
            cityCode: "LIH",
            cityName: "Kauai Island",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "KEW",
            name: "Keewaywin",
            cityCode: "KEW",
            cityName: "Keewaywin",
            countryCode: "CA",
            countryName: "Canada"
    }, {
            code: "KKE",
            name: "Kerikeri",
            cityCode: "KKE",
            cityName: "Kerikeri",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "EYW",
            name: "Key West Intl",
            cityCode: "EYW",
            cityName: "Key West",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HJR",
            name: "Khajuraho",
            cityCode: "HJR",
            cityName: "Khajuraho",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "KEL",
            name: "Kiel",
            cityCode: "KEL",
            cityName: "Kiel",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "KBP",
            name: "Kiev",
            cityCode: "IEV",
            cityName: "Kiev",
            countryCode: "UA",
            countryName: "Ukraine"
    }, {
            code: "ILE",
            name: "Killeen Mnpl",
            cityCode: "ILE",
            cityName: "Killeen",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "INR",
            name: "Kinchelo",
            cityCode: "SSM",
            cityName: "Sault Ste Marie",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "JED",
            name: "King Abdulaziz Int",
            cityCode: "JED",
            cityName: "Jeddah",
            countryCode: "SA",
            countryName: "Saudi Arabia"
    }, {
            code: "KOI",
            name: "Kirkwall",
            cityCode: "KOI",
            cityName: "Kirkwall",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "RKD",
            name: "Knox County ",
            cityCode: "RKD",
            cityName: "Rockland",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "COK",
            name: "Kochi International Airport",
            cityCode: "COK",
            cityName: "Cochin",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "CGN",
            name: "Koeln",
            cityCode: "CGN",
            cityName: "Cologne",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "USM",
            name: "Koh Samui",
            cityCode: "USM",
            cityName: "Koh Samui",
            countryCode: "TH",
            countryName: "Thailand"
    }, {
            code: "CCU",
            name: "Kolkata",
            cityCode: "CCU",
            cityName: "Kolkata",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "KOA",
            name: "Kona",
            cityCode: "KOA",
            cityName: "Kona",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "KTU",
            name: "Kota",
            cityCode: "KTU",
            cityName: "Kota",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "KUL",
            name: "Kuala Lumpur International",
            cityCode: "KUL",
            cityName: "Kuala Lumpur",
            countryCode: "MY",
            countryName: "Malaysia"
    }, {
            code: "KNX",
            name: "Kununurra",
            cityCode: "KNX",
            cityName: "Kununurra",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "KWI",
            name: "Kuwait Intl",
            cityCode: "KWI",
            cityName: "Kuwait",
            countryCode: "KW",
            countryName: "Kuwait"
    }, {
            code: "LSE",
            name: "La Crosse Mnpl",
            cityCode: "LSE",
            cityName: "La Crosse",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LGA",
            name: "La Guardia",
            cityCode: "NYC",
            cityName: "New York",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LFT",
            name: "Lafayette Rgnl",
            cityCode: "LFT",
            cityName: "Lafayette-LA",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LHE",
            name: "Lahore",
            cityCode: "LHE",
            cityName: "Lahore",
            countryCode: "PK",
            countryName: "Pakistan"
    }, {
            code: "LCH",
            name: "Lake Charles",
            cityCode: "LCH",
            cityName: "Lake Charles",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LGE",
            name: "Lake Gregory Airport",
            cityCode: "LGE",
            cityName: "Lake Gregory",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "TVL",
            name: "Lake Tahoe South",
            cityCode: "TVL",
            cityName: "Lake Tahoe South",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LNS",
            name: "Lancaster",
            cityCode: "LNS",
            cityName: "Lancaster",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LGK",
            name: "Langkawi",
            cityCode: "LGK",
            cityName: "Langkawi",
            countryCode: "MY",
            countryName: "Malaysia"
    }, {
            code: "LRD",
            name: "Laredo Intl",
            cityCode: "LRD",
            cityName: "Laredo",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LAS",
            name: "Las Vegas",
            cityCode: "LAS",
            cityName: "Las Vegas",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LBE",
            name: "Latrobe",
            cityCode: "LBE",
            cityName: "Latrobe",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LST",
            name: "Launceston",
            cityCode: "LST",
            cityName: "Launceston",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "LAW",
            name: "Lawton",
            cityCode: "LAW",
            cityName: "Lawton",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LEH",
            name: "Le Havre",
            cityCode: "LEH",
            cityName: "Le Havre",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "LME",
            name: "Le Mans",
            cityCode: "LME",
            cityName: "Le Mans",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "LEA",
            name: "Learmonth",
            cityCode: "LEA",
            cityName: "Learmonth",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "LEB",
            name: "Lebanon Rgnl ",
            cityCode: "LEB",
            cityName: "Lebanon",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LBA",
            name: "Leeds",
            cityCode: "LBA",
            cityName: "Leeds",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "IXL",
            name: "Leh",
            cityCode: "IXL",
            cityName: "Leh",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "LEJ",
            name: "Leipzig",
            cityCode: "LEJ",
            cityName: "Leipzig",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "TUP",
            name: "Lemons Municipal",
            cityCode: "TUP",
            cityName: "Tupelo",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LEX",
            name: "Lexington",
            cityCode: "LEX",
            cityName: "Lexington",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LIL",
            name: "Lille",
            cityCode: "LIL",
            cityName: "Lille",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "LIG",
            name: "Limoges",
            cityCode: "LIG",
            cityName: "Limoges",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "LIN",
            name: "Linate",
            cityCode: "MIL",
            cityName: "Milan",
            countryCode: "IT",
            countryName: "Italy"
    }, {
            code: "LNK",
            name: "Lincoln Mnpl",
            cityCode: "LNK",
            cityName: "Lincoln",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LIS",
            name: "Lisbon",
            cityCode: "LIS",
            cityName: "Lisbon",
            countryCode: "PT",
            countryName: "Portugal"
    }, {
            code: "LIT",
            name: "Little Rock",
            cityCode: "LIT",
            cityName: "Little Rock",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LPL",
            name: "Liverpool",
            cityCode: "LPL",
            cityName: "Liverpool",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "LPH",
            name: "Lochgilphead",
            cityCode: "LPH",
            cityName: "Lochgilphead",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "BOS",
            name: "Logan Intl",
            cityCode: "BOS",
            cityName: "Boston",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LCY",
            name: "London City Airport",
            cityCode: "LON",
            cityName: "London",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "LDY",
            name: "Londonderry",
            cityCode: "LDY",
            cityName: "Londonderry",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "LGB",
            name: "Long Beach",
            cityCode: "LGB",
            cityName: "Long Beach",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LRE",
            name: "Longreach",
            cityCode: "LRE",
            cityName: "Longreach",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "GGG",
            name: "Longview",
            cityCode: "GGG",
            cityName: "Longview",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LAX",
            name: "Los Angeles",
            cityCode: "LAX",
            cityName: "Los Angeles",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SDF",
            name: "Louisville Intl",
            cityCode: "SDF",
            cityName: "Louisville-KY",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LDE",
            name: "Lourdes Tarbes",
            cityCode: "LDE",
            cityName: "Lourdes Tarbes",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "DAL",
            name: "Love Field",
            cityCode: "DFW",
            cityName: "Dallas",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LBB",
            name: "Lubbock Intl",
            cityCode: "LBB",
            cityName: "Lubbock",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LKO",
            name: "Lucknow",
            cityCode: "LKO",
            cityName: "Lucknow",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "LUH",
            name: "Ludhiana",
            cityCode: "LUH",
            cityName: "Ludhiana",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "LBC",
            name: "Luebeck",
            cityCode: "HAM",
            cityName: "Hamburg",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "LYH",
            name: "Lynchburg",
            cityCode: "LYH",
            cityName: "Lynchburg",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GNB",
            name: "Lyon",
            cityCode: "LYS",
            cityName: "Lyon",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "MKY",
            name: "Mackay",
            cityCode: "MKY",
            cityName: "Mackay",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "MCN",
            name: "Macon",
            cityCode: "MCN",
            cityName: "Macon",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IXM",
            name: "Madurai",
            cityCode: "IXM",
            cityName: "Madurai",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "MIU",
            name: "Maiduguri Airport",
            cityCode: "MIU",
            cityName: "Maiduguri",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "MDI",
            name: "Makurdi Airport ",
            cityCode: "MDI",
            cityName: "Makurdi",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "AGP",
            name: "Malaga",
            cityCode: "AGP",
            cityName: "Malaga",
            countryCode: "ES",
            countryName: "Spain"
    }, {
            code: "MLE",
            name: "Male",
            cityCode: "MLE",
            cityName: "Maldives",
            countryCode: "MV",
            countryName: "Maldives"
    }, {
            code: "KAN",
            name: "Mallam Aminu Kano International Airport",
            cityCode: "KAN",
            cityName: "Kano ",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "MXP",
            name: "Malpensa",
            cityCode: "MIL",
            cityName: "Milan",
            countryCode: "IT",
            countryName: "Italy"
    }, {
            code: "MLA",
            name: "Malta",
            cityCode: "MLA",
            cityName: "Malta",
            countryCode: "MT",
            countryName: "Malta "
    }, {
            code: "MHT",
            name: "Manchester",
            cityCode: "MHT",
            cityName: "Manchester",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MAN",
            name: "Manchester Intl",
            cityCode: "MAN",
            cityName: "Manchester",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "IXE",
            name: "Mangalore",
            cityCode: "IXE",
            cityName: "Mangalore",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "MHK",
            name: "Manhattan",
            cityCode: "MHK",
            cityName: "Manhattan",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MNL",
            name: "Manila",
            cityCode: "MNL",
            cityName: "Manila",
            countryCode: "PH",
            countryName: "Philippines"
    }, {
            code: "CBQ",
            name: "Margaret Ekpo International Airport",
            cityCode: "CBQ",
            cityName: "Calabar",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "MRS",
            name: "Marseille",
            cityCode: "MRS",
            cityName: "Marseille",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "MVY",
            name: "Marthas Vineyard",
            cityCode: "MVY",
            cityName: "Marthas Vineyard",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MCW",
            name: "Mason City",
            cityCode: "MCW",
            cityName: "Mason City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MRU",
            name: "Mauritius",
            cityCode: "MRU",
            cityName: "Mauritius",
            countryCode: "MU",
            countryName: "Mauritius"
    }, {
            code: "TYS",
            name: "Mc Ghee Tyson",
            cityCode: "TYS",
            cityName: "Knoxville",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MFE",
            name: "Mcallen",
            cityCode: "MFE",
            cityName: "Mcallen",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MEL",
            name: "Melbourne",
            cityCode: "MEL",
            cityName: "Melbourne",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "MLB",
            name: "Melbourne - FL",
            cityCode: "MLB",
            cityName: "Melbourne",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MEM",
            name: "Memphis Intl",
            cityCode: "MEM",
            cityName: "Memphis",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BLF",
            name: "Mercer County ",
            cityCode: "BLF",
            cityName: "Bluefield",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MEI",
            name: "Meridian",
            cityCode: "MEI",
            cityName: "Meridian",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MIM",
            name: "Merimbula",
            cityCode: "MIM",
            cityName: "Merimbula",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "MEX",
            name: "Mexico Juarez Intl",
            cityCode: "MEX",
            cityName: "Mexico City",
            countryCode: "MX",
            countryName: "Mexico"
    }, {
            code: "MIA",
            name: "Miami Intl",
            cityCode: "MIA",
            cityName: "Miami",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ZYR",
            name: "Midi Railway Station",
            cityCode: "CRL",
            cityName: "Brussels",
            countryCode: "BE",
            countryName: "Belgium"
    }, {
            code: "MAF",
            name: "Midland",
            cityCode: "MAF",
            cityName: "Midland",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MDW",
            name: "Midway",
            cityCode: "CHI",
            cityName: "Chicago",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MQL",
            name: "Mildura",
            cityCode: "MQL",
            cityName: "Mildura",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "MKE",
            name: "Milwaukee",
            cityCode: "MKE",
            cityName: "Milwaukee",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MSP",
            name: "Minneapolis",
            cityCode: "MSP",
            cityName: "Minneapolis",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MOT",
            name: "Minot Intl",
            cityCode: "MOT",
            cityName: "Minot",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MSO",
            name: "Missoula",
            cityCode: "MSO",
            cityName: "Missoula",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MOB",
            name: "Mobile",
            cityCode: "MOB",
            cityName: "Mobile",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MOD",
            name: "Modesto",
            cityCode: "MOD",
            cityName: "Modesto",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MLI",
            name: "Moline",
            cityCode: "MLI",
            cityName: "Moline",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MJK",
            name: "Monkey Mia",
            cityCode: "MJK",
            cityName: "Monkey Mia",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "MLU",
            name: "Monroe",
            cityCode: "MLU",
            cityName: "Monroe",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MRY",
            name: "Monterey Penins",
            cityCode: "MRY",
            cityName: "Monterey",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MGM",
            name: "Montgomery",
            cityCode: "MGM",
            cityName: "Montgomery",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MPL",
            name: "Montpellier",
            cityCode: "MPL",
            cityName: "Montpellier",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "YUL",
            name: "Montreal",
            cityCode: "YMQ",
            cityName: "Montreal",
            countryCode: "CA",
            countryName: "Canada"
    }, {
            code: "MTJ",
            name: "Montrose",
            cityCode: "MTJ",
            cityName: "Montrose",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MGW",
            name: "Morgantown",
            cityCode: "MGW",
            cityName: "Morgantown",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SVO",
            name: "Moscow",
            cityCode: "MOW",
            cityName: "Moscow",
            countryCode: "RU",
            countryName: "Russian Federation"
    }, {
            code: "PUW",
            name: "Moscow Regional",
            cityCode: "PUW",
            cityName: "Pullman",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MON",
            name: "Mount Cook",
            cityCode: "MON",
            cityName: "Mount Cook",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "ISA",
            name: "Mount Isa",
            cityCode: "ISA",
            cityName: "Mount Isa",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "FMO",
            name: "Muenster",
            cityCode: "FMO",
            cityName: "Muenster",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "BOM",
            name: "Mumbai - Chhatrapati Shivaji",
            cityCode: "BOM",
            cityName: "Mumbai",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "FWA",
            name: "Municipal",
            cityCode: "FWA",
            cityName: "Fort Wayne",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BBB",
            name: "Municipal",
            cityCode: "BBB",
            cityName: "Benson",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FYV",
            name: "Municipal (Drake Fld)",
            cityCode: "FYV",
            cityName: "Fayett-AR",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "LOS",
            name: "Murtala Muhammed International Airport",
            cityCode: "LOS",
            cityName: "Lagos",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "MSL",
            name: "Muscle Shoals",
            cityCode: "MSL",
            cityName: "Muscle Shoals",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MKG",
            name: "Muskegon",
            cityCode: "MKG",
            cityName: "Muskegon",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MYR",
            name: "Myrtle Beach",
            cityCode: "MYR",
            cityName: "Myrtle Beach",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "NGO",
            name: "Nagoya",
            cityCode: "NGO",
            cityName: "Nagoya",
            countryCode: "JP",
            countryName: "Japan"
    }, {
            code: "NAG",
            name: "Nagpur",
            cityCode: "NAG",
            cityName: "Nagpur",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "ENC",
            name: "Nancy Essey",
            cityCode: "ENC",
            cityName: "Nancy Essey",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "NTE",
            name: "Nantes Atlantique",
            cityCode: "NTE",
            cityName: "Nantes",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "ACK",
            name: "Nantucket",
            cityCode: "ACK",
            cityName: "Nantucket",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "NPE",
            name: "Napier",
            cityCode: "NPE",
            cityName: "Napier",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "APF",
            name: "Naples - FL",
            cityCode: "APF",
            cityName: "Naples-FL",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BNA",
            name: "Nashville",
            cityCode: "BNA",
            cityName: "Nashville",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "NAS",
            name: "Nassau Intl",
            cityCode: "NAS",
            cityName: "Nassau",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "NSN",
            name: "Nelson",
            cityCode: "NSN",
            cityName: "Nelson",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "HVN",
            name: "New Haven",
            cityCode: "HVN",
            cityName: "New Haven",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MSY",
            name: "New Orleans",
            cityCode: "MSY",
            cityName: "New Orleans",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "NPL",
            name: "New Plymouth",
            cityCode: "NPL",
            cityName: "New Plymouth",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "JFK",
            name: "New York",
            cityCode: "NYC",
            cityName: "New York",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "EWR",
            name: "Newark Liberty International",
            cityCode: "NYC",
            cityName: "New York",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "NCL",
            name: "Newcastle",
            cityCode: "NCL",
            cityName: "Newcastle",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "ZNE",
            name: "Newman",
            cityCode: "ZNE",
            cityName: "Newman",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "PHF",
            name: "Newport News Hamp",
            cityCode: "PHF",
            cityName: "Newport News Hamp",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "NQY",
            name: "Newquay",
            cityCode: "NQY",
            cityName: "Newquay",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "LWS",
            name: "Nez Perce Cnt",
            cityCode: "LWS",
            cityName: "Lewiston",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "NCE",
            name: "Nice",
            cityCode: "NCE",
            cityName: "Nice",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "ABV",
            name: "Nnamdi Azikwe International Airport",
            cityCode: "ABV",
            cityName: "Abuja",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "ORF",
            name: "Norfolk Intl",
            cityCode: "ORF",
            cityName: "Norfolk",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BMI",
            name: "Normal",
            cityCode: "BMI",
            cityName: "Bloomington",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "XNA",
            name: "Northwest Arkansas Regional",
            cityCode: "FYV",
            cityName: "Fayett-AR",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "NWI",
            name: "Norwich",
            cityCode: "NWI",
            cityName: "Norwich",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "EMA",
            name: "Nottingham",
            cityCode: "NQT",
            cityName: "Nottingham",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "NUE",
            name: "Nuremberg",
            cityCode: "NUE",
            cityName: "Nuremberg",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "OAK",
            name: "Oakland Intl",
            cityCode: "OAK",
            cityName: "Oakland",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "OBN",
            name: "Oban",
            cityCode: "OBN",
            cityName: "Oban",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "OGS",
            name: "Ogdensburg ",
            cityCode: "OGS",
            cityName: "Ogdensburg",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "OKC",
            name: "Oklahoma City",
            cityCode: "OKC",
            cityName: "Oklahoma City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "OMA",
            name: "Omaha",
            cityCode: "OMA",
            cityName: "Omaha",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "RHI",
            name: "Oneida Coun",
            cityCode: "RHI",
            cityName: "Rhinelander",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ONT",
            name: "Ontario Intl",
            cityCode: "ONT",
            cityName: "Ontario",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "OAG",
            name: "Orange Springhill",
            cityCode: "OAG",
            cityName: "Orange Springhill",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "MCO",
            name: "Orlando International",
            cityCode: "ORL",
            cityName: "Orlando",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "KIX",
            name: "Osaka",
            cityCode: "OSA",
            cityName: "Osaka",
            countryCode: "JP",
            countryName: "Japan"
    }, {
            code: "YOW",
            name: "Ottawa Intl",
            cityCode: "YOW",
            cityName: "Ottawa",
            countryCode: "CA",
            countryName: "Canada"
    }, {
            code: "ATW",
            name: "Outagamie Cty",
            cityCode: "ATW",
            cityName: "Appleton",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "OXR",
            name: "Oxnard",
            cityCode: "OXR",
            cityName: "Oxnard",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PAD",
            name: "Paderborn",
            cityCode: "PAD",
            cityName: "Paderborn",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "PAH",
            name: "Paducah - KY",
            cityCode: "PAH",
            cityName: "Paducah",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PSP",
            name: "Palm Springs",
            cityCode: "PSP",
            cityName: "Palm Springs",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PMR",
            name: "Palmerston North",
            cityCode: "PMR",
            cityName: "Palmerston North",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "EAT",
            name: "Pangborn Field",
            cityCode: "EAT",
            cityName: "Wenatchee",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ORY",
            name: "Paris - Orly",
            cityCode: "PAR",
            cityName: "Paris",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "PKB",
            name: "Parkersburg",
            cityCode: "PKB",
            cityName: "Parkersburg",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PAT",
            name: "Patna",
            cityCode: "PAT",
            cityName: "Patna",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "PUF",
            name: "Pau",
            cityCode: "PUF",
            cityName: "Pau",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "PEN",
            name: "Penang Intl",
            cityCode: "PEN",
            cityName: "Penang",
            countryCode: "MY",
            countryName: "Malaysia"
    }, {
            code: "PNS",
            name: "Pensacola",
            cityCode: "PNS",
            cityName: "Pensacola",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PER",
            name: "Perth",
            cityCode: "PER",
            cityName: "Perth",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "PTB",
            name: "Petersburg Mnpl",
            cityCode: "PTB",
            cityName: "Petersburg",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PHL",
            name: "Philadelphia - Intl",
            cityCode: "PHL",
            cityName: "Philadelphia",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PHX",
            name: "Phoenix",
            cityCode: "PHX",
            cityName: "Phoenix",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HKT",
            name: "Phuket Intl",
            cityCode: "HKT",
            cityName: "Phuket",
            countryCode: "TH",
            countryName: "Thailand"
    }, {
            code: "PIR",
            name: "Pierre",
            cityCode: "PIR",
            cityName: "Pierre",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PGV",
            name: "Pitt Greenvi",
            cityCode: "PGV",
            cityName: "Greenville",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PIT",
            name: "Pittsburgh Intl",
            cityCode: "PIT",
            cityName: "Pittsburgh",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PLH",
            name: "Plymouth",
            cityCode: "PLH",
            cityName: "Plymouth",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "PIH",
            name: "Pocatello",
            cityCode: "PIH",
            cityName: "Pocatello",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PBD",
            name: "Porbandar",
            cityCode: "PBD",
            cityName: "Porbandar",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "IXZ",
            name: "Port Blair",
            cityCode: "IXZ",
            cityName: "Port Blair",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "CMH",
            name: "Port Columbus",
            cityCode: "CMH",
            cityName: "Columbus-OH",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PHC",
            name: "Port Harcourt International Airport ",
            cityCode: "PHC",
            cityName: "Port Harcourt",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "PHE",
            name: "Port Hedland",
            cityCode: "PHE",
            cityName: "Port Hedland",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "POS",
            name: "Port of Spain",
            cityCode: "POS",
            cityName: "PORT OF SPAIN",
            countryCode: "TT",
            countryName: "Trinidad And Tobago"
    }, {
            code: "PTJ",
            name: "Portland - AU",
            cityCode: "PTJ",
            cityName: "Portland",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "PDX",
            name: "Portland Intl",
            cityCode: "PDX",
            cityName: "Portland",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PWM",
            name: "Portland Intl",
            cityCode: "PWM",
            cityName: "Portland Me",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "OPO",
            name: "Porto",
            cityCode: "OPO",
            cityName: "Porto",
            countryCode: "PT",
            countryName: "Portugal"
    }, {
            code: "PME",
            name: "Portsmouth",
            cityCode: "PME",
            cityName: "Portsmouth",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "SWF",
            name: "Poughkeepsie",
            cityCode: "POU",
            cityName: "Poughkeepsie",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PRG",
            name: "Prague",
            cityCode: "PRG",
            cityName: "PRAGUE",
            countryCode: "CZ",
            countryName: "Czech Republic"
    }, {
            code: "PQI",
            name: "Presque",
            cityCode: "PQI",
            cityName: "Presque Isle",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PPP",
            name: "Proserpine",
            cityCode: "PPP",
            cityName: "Proserpine",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "PVD",
            name: "Providence",
            cityCode: "PVD",
            cityName: "Providence",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PVG",
            name: "Pu Dong Airport",
            cityCode: "SHA",
            cityName: "Shanghai",
            countryCode: "CN",
            countryName: "China"
    }, {
            code: "LAC",
            name: "Pulau Layang",
            cityCode: "LAC",
            cityName: "Pulau Layang",
            countryCode: "MY",
            countryName: "Malaysia"
    }, {
            code: "PNQ",
            name: "Pune",
            cityCode: "PNQ",
            cityName: "Pune",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "LAF",
            name: "Purdue Univer",
            cityCode: "LAF",
            cityName: "Lafayette-IN",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PUT",
            name: "Puttaparthi",
            cityCode: "PUT",
            cityName: "Puttaprathe",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "YQB",
            name: "Quebec",
            cityCode: "YQB",
            cityName: "Quebec",
            countryCode: "CA",
            countryName: "Canada"
    }, {
            code: "ZQN",
            name: "Queenstown",
            cityCode: "ZQN",
            cityName: "Queenstown",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "RPR",
            name: "Raipur",
            cityCode: "RPR",
            cityName: "Raipur",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "RAJ",
            name: "Rajkot",
            cityCode: "RAJ",
            cityName: "Rajkot",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "RDU",
            name: "Raleigh Durham",
            cityCode: "RDU",
            cityName: "Raleigh Durham",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IXR",
            name: "Ranchi",
            cityCode: "IXR",
            cityName: "Ranchi",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "RDG",
            name: "Reading",
            cityCode: "RDG",
            cityName: "Reading",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DCA",
            name: "Reagan National",
            cityCode: "WAS",
            cityName: "Washington",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "RDD",
            name: "Redding",
            cityCode: "RDD",
            cityName: "Redding",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "RAP",
            name: "Regional",
            cityCode: "RAP",
            cityName: "Rapid City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SHV",
            name: "Regional",
            cityCode: "SHV",
            cityName: "Shreveport",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FSD",
            name: "Regional",
            cityCode: "FSD",
            cityName: "Sioux Falls",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "RNO",
            name: "Reno",
            cityCode: "RNO",
            cityName: "Reno",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MSS",
            name: "Richards Field",
            cityCode: "MSS",
            cityName: "Massena",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "RIC",
            name: "Richmond Intl",
            cityCode: "RIC",
            cityName: "Richmond",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "RUH",
            name: "Riyadh",
            cityCode: "RUH",
            cityName: "Riyadh",
            countryCode: "SA",
            countryName: "Saudi Arabia"
    }, {
            code: "ROA",
            name: "Roanoke Mnpl",
            cityCode: "ROA",
            cityName: "Roanoke",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "RDM",
            name: "Roberts Field",
            cityCode: "RDM",
            cityName: "Redmond",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "DSA",
            name: "Robin Hood",
            cityCode: "DSA",
            cityName: "Doncaster Sheffield",
            countryCode: "GB",
            countryName: "United Kingdom"
    }, {
            code: "ROC",
            name: "Rochester",
            cityCode: "ROC",
            cityName: "Rochester",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "RST",
            name: "Rochester Mnpl",
            cityCode: "RST",
            cityName: "Rochester Mn",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ROK",
            name: "Rockhampton",
            cityCode: "ROK",
            cityName: "Rockhampton",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "FCO",
            name: "Rome",
            cityCode: "ROM",
            cityName: "Rome",
            countryCode: "IT",
            countryName: "Italy"
    }, {
            code: "ROX",
            name: "Roseau Mnpl",
            cityCode: "ROX",
            cityName: "Roseau",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ROT",
            name: "Rotorua",
            cityCode: "ROT",
            cityName: "Rotorua",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "SCN",
            name: "Saarbrucken",
            cityCode: "SCN",
            cityName: "Saarbrucken",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "SJU",
            name: "Sab Juan",
            cityCode: "SJU",
            cityName: "San Juan",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SMF",
            name: "Sacramento Intl",
            cityCode: "SAC",
            cityName: "Sacramento",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SBA",
            name: "Saint Ba Mnpl",
            cityCode: "SBA",
            cityName: "Santa Barbara",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "STC",
            name: "Saint Cloud",
            cityCode: "STC",
            cityName: "Saint Cloud",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "EBU",
            name: "Saint Etienne",
            cityCode: "EBU",
            cityName: "Saint Etienne",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "SGU",
            name: "Saint George",
            cityCode: "SGU",
            cityName: "Saint George",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "STL",
            name: "Saint Louis",
            cityCode: "STL",
            cityName: "Saint Louis",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PIE",
            name: "Saint Petersburg Intl",
            cityCode: "PIE",
            cityName: "Saint Petersburg-FL",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "FSP",
            name: "Saint Pierre",
            cityCode: "FSP",
            cityName: "Saint Pierre",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "SLN",
            name: "Salina ",
            cityCode: "SLN",
            cityName: "Salina",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SBY",
            name: "Salisbury",
            cityCode: "SBY",
            cityName: "Salisbury",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SLC",
            name: "Salt Lake City - Intl",
            cityCode: "SLC",
            cityName: "Salt Lake City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SZG",
            name: "Salzburg",
            cityCode: "SZG",
            cityName: "Salzburg",
            countryCode: "AT",
            countryName: "Austria"
    }, {
            code: "QOW",
            name: "Sam Mbakwe Airport",
            cityCode: "QOW",
            cityName: "Owerri",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "SJT",
            name: "San Angelo",
            cityCode: "SJT",
            cityName: "San Angelo",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SAT",
            name: "San Antonia",
            cityCode: "SAT",
            cityName: "San Antonio",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SAN",
            name: "San Diego",
            cityCode: "SAN",
            cityName: "San Diego",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SFO",
            name: "San Francisco - Intl",
            cityCode: "SFO",
            cityName: "San Francisco",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SJC",
            name: "San Jose Mnpl",
            cityCode: "SJC",
            cityName: "San Jose",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SGL",
            name: "Sangley Point Manila ",
            cityCode: "MNL",
            cityName: "Manila",
            countryCode: "PH",
            countryName: "Philippines"
    }, {
            code: "SNA",
            name: "Santa Ana",
            cityCode: "SNA",
            cityName: "Santa Ana",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SMX",
            name: "Santa Maria",
            cityCode: "SMX",
            cityName: "Santa Maria",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SSM",
            name: "Sault Ste Marie",
            cityCode: "SSM",
            cityName: "Sault Ste Marie",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SAV",
            name: "Savannah",
            cityCode: "SAV",
            cityName: "Savannah",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MQT",
            name: "Sawyer Intl",
            cityCode: "MQT",
            cityName: "Marquette",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "AMS",
            name: "Schiphol",
            cityCode: "AMS",
            cityName: "Amsterdam",
            countryCode: "NL",
            countryName: "Netherlands"
    }, {
            code: "SXF",
            name: "Schoenefeld",
            cityCode: "BER",
            cityName: "Berlin",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "AVP",
            name: "Scranton Intl",
            cityCode: "AVP",
            cityName: "Scranton",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SEA",
            name: "Seattle",
            cityCode: "SEA",
            cityName: "Seattle",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MCT",
            name: "Seeb",
            cityCode: "MCT",
            cityName: "Muscat",
            countryCode: "OM",
            countryName: "Oman"
    }, {
            code: "ICN",
            name: "Seoul",
            cityCode: "SEL",
            cityName: "Seoul",
            countryCode: "KR",
            countryName: "Korea"
    }, {
            code: "SEZ",
            name: "Seychelles Intl",
            cityCode: "SEZ",
            cityName: "Mahe Island",
            countryCode: "SC",
            countryName: "Seychelles"
    }, {
            code: "NRI",
            name: "Shangi La",
            cityCode: "NRI",
            cityName: "Shangri La",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SHJ",
            name: "Sharjah",
            cityCode: "SHJ",
            cityName: "Sharjah",
            countryCode: "AE",
            countryName: "Arab Amirat"
    }, {
            code: "SZD",
            name: "Sheffield",
            cityCode: "SZD",
            cityName: "Sheffield",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "LSI",
            name: "Shetland Islands",
            cityCode: "SDZ",
            cityName: "Shetland Islands",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "IXS",
            name: "Silchar",
            cityCode: "IXS",
            cityName: "Silchar",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "EWN",
            name: "Simmons Nott",
            cityCode: "EWN",
            cityName: "New Bern",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SIN",
            name: "Singapore",
            cityCode: "SIN",
            cityName: "Singapore",
            countryCode: "SG",
            countryName: "Singapore    "
    }, {
            code: "SUX",
            name: "Sioux Gateway",
            cityCode: "SUX",
            cityName: "Sioux City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HAR",
            name: "Skyport",
            cityCode: "HAR",
            cityName: "Harrisburg",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SOF",
            name: "Sofia Intl",
            cityCode: "SOF",
            cityName: "Sofia",
            countryCode: "BG",
            countryName: "Bulgaria"
    }, {
            code: "SBN",
            name: "South Bend",
            cityCode: "SBN",
            cityName: "South Bend",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SOU",
            name: "Southampton",
            cityCode: "SOU",
            cityName: "Southampton",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "GEG",
            name: "Spokane Intl",
            cityCode: "GEG",
            cityName: "Spokane",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SPI",
            name: "Springfield - IL",
            cityCode: "SPI",
            cityName: "Springfield-IL",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SXR",
            name: "Srinagar",
            cityCode: "SXR",
            cityName: "Srinagar",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "LYS",
            name: "St-Exupery",
            cityCode: "LYS",
            cityName: "Lyon",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "STN",
            name: "Stansted",
            cityCode: "LON",
            cityName: "London",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "SHD",
            name: "Staunton",
            cityCode: "SHD",
            cityName: "Staunton",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ARN",
            name: "Stockholm",
            cityCode: "STO",
            cityName: "Stockholm",
            countryCode: "SE",
            countryName: "Sweden"
    }, {
            code: "SYY",
            name: "Stornoway",
            cityCode: "SYY",
            cityName: "Stornoway",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "SXB",
            name: "Strasbourg",
            cityCode: "SXB",
            cityName: "Strasbourg",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "SUA",
            name: "Stuart",
            cityCode: "SUA",
            cityName: "Stuart",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "STR",
            name: "Stuttgart",
            cityCode: "STR",
            cityName: "Stuttgart",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "SKO",
            name: "Sultan Saddik Abubakar Airport",
            cityCode: "SKO",
            cityName: "Sokoto",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "SUN",
            name: "Sun Valley",
            cityCode: "SUN",
            cityName: "Hailey",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MCY",
            name: "Sunshine Coast",
            cityCode: "MCY",
            cityName: "Sunshine Coast",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "SYD",
            name: "Sydney",
            cityCode: "SYD",
            cityName: "Sydney",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "SYR",
            name: "Syracuse",
            cityCode: "SYR",
            cityName: "Syracuse",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "TPE",
            name: "Taipei",
            cityCode: "TPE",
            cityName: "Taipei",
            countryCode: "TW",
            countryName: "Taiwan"
    }, {
            code: "TLH",
            name: "Tallahassee",
            cityCode: "TLH",
            cityName: "Tallahassee",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "TPA",
            name: "Tampa Intl",
            cityCode: "TPA",
            cityName: "Tampa",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "TMW",
            name: "Tamworth",
            cityCode: "TMW",
            cityName: "Tamworth",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "TIS",
            name: "Tari",
            cityCode: "TIS",
            cityName: "Tari",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "TAS",
            name: "Tashkent",
            cityCode: "TAS",
            cityName: "Tashkent",
            countryCode: "UZ",
            countryName: "Uzbekistan"
    }, {
            code: "TUO",
            name: "Taupo",
            cityCode: "TUO",
            cityName: "Taupo",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "TRG",
            name: "Tauranga",
            cityCode: "TRG",
            cityName: "Tauranga",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "TEU",
            name: "Te Anau",
            cityCode: "TEU",
            cityName: "Te Anau",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "MME",
            name: "Teesside Intl",
            cityCode: "MME",
            cityName: "Teesside",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "THR",
            name: "Tehran",
            cityCode: "THR",
            cityName: "Tehran",
            countryCode: "IR",
            countryName: "Iran"
    }, {
            code: "TLV",
            name: "Telaviv Yafo",
            cityCode: "TLV",
            cityName: "Telaviv Yafo",
            countryCode: "IL",
            countryName: "Israel"
    }, {
            code: "TEX",
            name: "Telluride",
            cityCode: "TEX",
            cityName: "Telluride",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "TXK",
            name: "Texarkana",
            cityCode: "TXK",
            cityName: "Texarkana",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "TEZ",
            name: "Tezpur",
            cityCode: "TEZ",
            cityName: "Tezpur",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "TEI",
            name: "Tezu",
            cityCode: "TEI",
            cityName: "Tezu",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "TVF",
            name: "Thief River Falls",
            cityCode: "TVF",
            cityName: "Thief River Falls",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "TIU",
            name: "Timaru",
            cityCode: "TIU",
            cityName: "Timaru",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "TRZ",
            name: "Tiruchirapally",
            cityCode: "TRZ",
            cityName: "Tiruchirapally",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "HND",
            name: "Tokyo-Haneda",
            cityCode: "TYO",
            cityName: "Tokyo",
            countryCode: "JP",
            countryName: "Japan"
    }, {
            code: "NRT",
            name: "Tokyo-Narita",
            cityCode: "TYO",
            cityName: "Tokyo",
            countryCode: "JP",
            countryName: "Japan"
    }, {
            code: "TOL",
            name: "Toledo",
            cityCode: "TOL",
            cityName: "Toledo",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "YYZ",
            name: "Toronto",
            cityCode: "YTO",
            cityName: "Toronto",
            countryCode: "CA",
            countryName: "Canada"
    }, {
            code: "TLN",
            name: "Toulon",
            cityCode: "TLN",
            cityName: "Toulon",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "TLS",
            name: "Toulouse",
            cityCode: "TLS",
            cityName: "Toulouse",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "TUF",
            name: "Tours",
            cityCode: "TUF",
            cityName: "Tours",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "TSV",
            name: "Townsville",
            cityCode: "TSV",
            cityName: "Townsville",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "TVC",
            name: "Traverse City",
            cityCode: "TVC",
            cityName: "Traverse City",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "TRI",
            name: "Tri Cities",
            cityCode: "TRI",
            cityName: "Bristol",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "PSC",
            name: "Tri Cities",
            cityCode: "PSC",
            cityName: "Pasco",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "MBS",
            name: "Tri City",
            cityCode: "MBS",
            cityName: "Saginaw",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "TRV",
            name: "Trivandrum",
            cityCode: "TRV",
            cityName: "Trivandrum",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "TUS",
            name: "Tucson Intl",
            cityCode: "TUS",
            cityName: "Tucson",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "TUL",
            name: "Tulsa Intl",
            cityCode: "TUL",
            cityName: "Tulsa",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "TUN",
            name: "Tunis",
            cityCode: "TUN",
            cityName: "TUNIS",
            countryCode: "TN",
            countryName: "Tunisia"
    }, {
            code: "TYR",
            name: "Tyler",
            cityCode: "TYR",
            cityName: "Tyler",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "UDR",
            name: "Udaipur",
            cityCode: "UDR",
            cityName: "Udaipur",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "SCE",
            name: "University Park",
            cityCode: "SCE",
            cityName: "State College",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "BDQ",
            name: "Vadodara",
            cityCode: "BDQ",
            cityName: "Vadodara",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "EGE",
            name: "Vail Eagle",
            cityCode: "EGE",
            cityName: "Vail Eagle",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "VLD",
            name: "Valdosta",
            cityCode: "VLD",
            cityName: "Valdosta",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "VPS",
            name: "Valparaiso",
            cityCode: "VPS",
            cityName: "Valparaiso",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "YVR",
            name: "Vancouver Intl",
            cityCode: "YVR",
            cityName: "Vancouver",
            countryCode: "CA",
            countryName: "Canada"
    }, {
            code: "VNS",
            name: "Varanasi",
            cityCode: "VNS",
            cityName: "Varanasi",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "VCE",
            name: "Venice",
            cityCode: "VCE",
            cityName: "Venice",
            countryCode: "IT",
            countryName: "Italy"
    }, {
            code: "VHY",
            name: "Vichy",
            cityCode: "VHY",
            cityName: "Vichy",
            countryCode: "FR",
            countryName: "France"
    }, {
            code: "VIE",
            name: "Vienna Intl",
            cityCode: "VIE",
            cityName: "Vienna",
            countryCode: "AT",
            countryName: "Austria"
    }, {
            code: "VIS",
            name: "Visalia",
            cityCode: "VIS",
            cityName: "Visalia",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "VTZ",
            name: "Vishakhapatnam",
            cityCode: "VTZ",
            cityName: "Vishakhapatnam",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "ACT",
            name: "Waco Mnpl",
            cityCode: "ACT",
            cityName: "Waco",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "WGA",
            name: "Wagga Wagga",
            cityCode: "WGA",
            cityName: "Wagga Wagga",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "ALW",
            name: "Walla Walla",
            cityCode: "ALW",
            cityName: "Walla Walla",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "WAG",
            name: "Wanganui",
            cityCode: "WAG",
            cityName: "Wanganui",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "WGC",
            name: "Warangal",
            cityCode: "WGC",
            cityName: "Warangal",
            countryCode: "IN",
            countryName: "India"
    }, {
            code: "QRW",
            name: "Warri Airport ",
            cityCode: "QRW",
            cityName: "Warri",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "WAW",
            name: "Warsaw",
            cityCode: "WAW",
            cityName: "Warsaw",
            countryCode: "PL",
            countryName: "Poland"
    }, {
            code: "HGR",
            name: "Wash County",
            cityCode: "HGR",
            cityName: "Hagerstown",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IAD",
            name: "Washington Dulles",
            cityCode: "WAS",
            cityName: "Washington",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ALO",
            name: "Waterloo",
            cityCode: "ALO",
            cityName: "Waterloo",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ATY",
            name: "Watertown",
            cityCode: "ATY",
            cityName: "Watertown",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ART",
            name: "Watertown",
            cityCode: "ART",
            cityName: "Watertown",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "CWA",
            name: "Wausau",
            cityCode: "AUW",
            cityName: "Wausau",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "WEI",
            name: "Weipa",
            cityCode: "WEI",
            cityName: "Weipa",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "WLG",
            name: "Wellington",
            cityCode: "WLG",
            cityName: "Wellington",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "PBI",
            name: "West Palm Beach",
            cityCode: "PBI",
            cityName: "West Palm Beach",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "HPN",
            name: "Westchester",
            cityCode: "HPN",
            cityName: "Westchester County",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "GWT",
            name: "Westerland",
            cityCode: "GWT",
            cityName: "Westerland",
            countryCode: "DE",
            countryName: "Germany"
    }, {
            code: "WSZ",
            name: "Westport",
            cityCode: "WSZ",
            cityName: "Westport",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "WHK",
            name: "Whakatane",
            cityCode: "WHK",
            cityName: "Whakatane",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "WRE",
            name: "Whangarei",
            cityCode: "WRE",
            cityName: "Whangarei",
            countryCode: "NZ",
            countryName: "New Zealand"
    }, {
            code: "ICT",
            name: "Wichita",
            cityCode: "ICT",
            cityName: "Wichita",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "SPS",
            name: "Wichita Falls - TX",
            cityCode: "SPS",
            cityName: "Wichita Falls",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "WIC",
            name: "Wick",
            cityCode: "WIC",
            cityName: "Wick",
            countryCode: "UK",
            countryName: "United Kingdom"
    }, {
            code: "CMI",
            name: "Willard Unive",
            cityCode: "CMI",
            cityName: "Champaign",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "IPT",
            name: "Williamsport",
            cityCode: "IPT",
            cityName: "Willamsport",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "NTL",
            name: "Williamtown",
            cityCode: "NTL",
            cityName: "Newcastle",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "ILM",
            name: "Wilmington",
            cityCode: "ILM",
            cityName: "Wilmington-NC",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "YWG",
            name: "Winnipeg",
            cityCode: "YWG",
            cityName: "Winnipeg",
            countryCode: "CA",
            countryName: "Canada"
    }, {
            code: "WOL",
            name: "Wollongong",
            cityCode: "WOL",
            cityName: "Wollongong",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "YKM",
            name: "Yakima",
            cityCode: "YKM",
            cityName: "Yakima",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "JOS",
            name: "Yakubu Gowon Airport",
            cityCode: "JOS",
            cityName: "Jos",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "RGN",
            name: "Yangon",
            cityCode: "RGN",
            cityName: "YANGON",
            countryCode: "MM",
            countryName: "Myanmar"
    }, {
            code: "CRW",
            name: "Yeager",
            cityCode: "CRW",
            cityName: "Charleston-WV",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "KYF",
            name: "Yeelirrie",
            cityCode: "KYF",
            cityName: "Yeelirrie",
            countryCode: "AU",
            countryName: "Australia"
    }, {
            code: "YOL",
            name: "Yola Airport",
            cityCode: "YOL",
            cityName: "Yola",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "YUM",
            name: "Yuma Intl",
            cityCode: "YUM",
            cityName: "Yuma",
            countryCode: "US",
            countryName: "United States"
    }, {
            code: "ZAR",
            name: "Zaria Airport",
            cityCode: "ZAR",
            cityName: "Zaria",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "DAC",
            name: "Zia Intl",
            cityCode: "DAC",
            cityName: "Dhaka",
            countryCode: "BD",
            countryName: "Bangladesh"
    }, {
            code: "ZRH",
            name: "Zurich",
            cityCode: "ZRH",
            cityName: "Zurich",
            countryCode: "CH",
            countryName: "Switzerland"
    }, {
            code: "ORN",
            name: "Oran airport",
            cityCode: "ORN",
            cityName: "Oran",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "CZL",
            name: "Constantine airport",
            cityCode: "CZL",
            cityName: "Constantine",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "BJA",
            name: "Bejaia airport",
            cityCode: "BJA",
            cityName: "Bejaia",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "QSF",
            name: "Setif airport",
            cityCode: "QSF",
            cityName: "Setif",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "AAE",
            name: "Annaba airport",
            cityCode: "AAE",
            cityName: "Annaba",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "TLM",
            name: "Tlemcen airport",
            cityCode: "TLM",
            cityName: "Tlemcen",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "HME",
            name: "Hassi Messaoud airport",
            cityCode: "HME",
            cityName: "Hassi Messaoud",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "BLJ",
            name: "Batna airport",
            cityCode: "BLJ",
            cityName: "Batna",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "CFK",
            name: "Chlef airport",
            cityCode: "CFK",
            cityName: "Chlef",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "BSK",
            name: "Biskra airport",
            cityCode: "BSK",
            cityName: "Biskra",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "TMR",
            name: "Tamanrasset airport",
            cityCode: "TMR",
            cityName: "Tamanrasset",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "VVZ",
            name: "Illizi airport",
            cityCode: "VVZ",
            cityName: "Illizi",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "INZ",
            name: "In Salah airport",
            cityCode: "INZ",
            cityName: "In Salah",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "IAM",
            name: "In Amenas airport",
            cityCode: "IAM",
            cityName: "In Amenas",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "TMX",
            name: "Timimoun airport",
            cityCode: "TMX",
            cityName: "Timimoun",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "TEE",
            name: "Tbessa airport",
            cityCode: "TEE",
            cityName: "Tbessa",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "TGR",
            name: "Touggourt airport",
            cityCode: "TGR",
            cityName: "Touggourt",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "TID",
            name: "Tiaret airport",
            cityCode: "TID",
            cityName: "Tiaret",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "TIN",
            name: "Tindouf airport",
            cityCode: "TIN",
            cityName: "Tindouf",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "LOO",
            name: "Laghouat airport",
            cityCode: "LOO",
            cityName: "Laghouat",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "MZW",
            name: "Mechria airport",
            cityCode: "MZW",
            cityName: "Mechria",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "OGX",
            name: "Ouargla airport",
            cityCode: "OGX",
            cityName: "Ouargla",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "DJG",
            name: "Djanet airport",
            cityCode: "DJG",
            cityName: "Djanet",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "ELU",
            name: "El Oued airport",
            cityCode: "ELU",
            cityName: "El Oued",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "GHA",
            name: "Ghardaia airport",
            cityCode: "GHA",
            cityName: "Ghardaia",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "GJL",
            name: "Jijel airport",
            cityCode: "GJL",
            cityName: "Jijel",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "CBH",
            name: "Bechar airport",
            cityCode: "CBH",
            cityName: "Bechar",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "BMW",
            name: "Bordj Badji Mokhtar airport",
            cityCode: "BMW",
            cityName: "Bordj Badji Mokhtar",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "LAD",
            name: "Luanda airport",
            cityCode: "LAD",
            cityName: "Luanda",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "SDD",
            name: "Lubango airport",
            cityCode: "SDD",
            cityName: "Lubango",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "CBT",
            name: "Catumbela airport",
            cityCode: "CBT",
            cityName: "Catumbela",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "CAB",
            name: "Cabinda airport",
            cityCode: "CAB",
            cityName: "Cabinda",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "SPP",
            name: "Menongue airport",
            cityCode: "SPP",
            cityName: "Menongue",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "SSY",
            name: "M'Banza Congo airport",
            cityCode: "SSY",
            cityName: "M'Banza Congo",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "SZA",
            name: "Soyo airport",
            cityCode: "SZA",
            cityName: "Soyo",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "VPE",
            name: "Ongiva airport",
            cityCode: "VPE",
            cityName: "Ongiva",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "LUO",
            name: "Luena airport",
            cityCode: "LUO",
            cityName: "Luena",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "MSZ",
            name: "Namibe airport",
            cityCode: "MSZ",
            cityName: "Namibe",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "NOV",
            name: "Huambo airport",
            cityCode: "NOV",
            cityName: "Huambo",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "COO",
            name: "Cotonou airport",
            cityCode: "COO",
            cityName: "Cotonou",
            countryCode: "BJ",
            countryName: "Benin"
    }, {
            code: "GBE",
            name: "Gaborone airport",
            cityCode: "GBE",
            cityName: "Gaborone",
            countryCode: "BW",
            countryName: "Botswana"
    }, {
            code: "MUB",
            name: "Maun airport",
            cityCode: "MUB",
            cityName: "Maun",
            countryCode: "BW",
            countryName: "Botswana"
    }, {
            code: "FRW",
            name: "Francistown airport",
            cityCode: "FRW",
            cityName: "Francistown",
            countryCode: "BW",
            countryName: "Botswana"
    }, {
            code: "BBK",
            name: "Kasane airport",
            cityCode: "BBK",
            cityName: "Kasane",
            countryCode: "BW",
            countryName: "Botswana"
    }, {
            code: "OUA",
            name: "Ouagadougou airport",
            cityCode: "OUA",
            cityName: "Ouagadougou",
            countryCode: "BF",
            countryName: "Burkina Faso"
    }, {
            code: "BOY",
            name: "Bobo Dioulasso airport",
            cityCode: "BOY",
            cityName: "Bobo Dioulasso",
            countryCode: "BF",
            countryName: "Burkina Faso"
    }, {
            code: "BJM",
            name: "Bujumbura airport",
            cityCode: "BJM",
            cityName: "Bujumbura",
            countryCode: "BI",
            countryName: "Burundi"
    }, {
            code: "DLA",
            name: "Douala airport",
            cityCode: "DLA",
            cityName: "Douala",
            countryCode: "CM",
            countryName: "Cameroon "
    }, {
            code: "NSI",
            name: "Yaounde airport",
            cityCode: "NSI",
            cityName: "Yaounde",
            countryCode: "CM",
            countryName: "Cameroon "
    }, {
            code: "SID",
            name: "Sal airport",
            cityCode: "SID",
            cityName: "Sal",
            countryCode: "CV",
            countryName: "Cape Verde"
    }, {
            code: "RAI",
            name: "Praia airport",
            cityCode: "RAI",
            cityName: "Praia",
            countryCode: "CV",
            countryName: "Cape Verde"
    }, {
            code: "BVC",
            name: "Boa Vista airport",
            cityCode: "BVC",
            cityName: "Boa Vista",
            countryCode: "CV",
            countryName: "Cape Verde"
    }, {
            code: "VXE",
            name: "Sao Vicente airport",
            cityCode: "VXE",
            cityName: "Sao Vicente",
            countryCode: "CV",
            countryName: "Cape Verde"
    }, {
            code: "SFL",
            name: "Sao Filipe airport",
            cityCode: "SFL",
            cityName: "Sao Filipe",
            countryCode: "CV",
            countryName: "Cape Verde"
    }, {
            code: "SNE",
            name: "Sao Nicolau airport",
            cityCode: "SNE",
            cityName: "Sao Nicolau",
            countryCode: "CV",
            countryName: "Cape Verde"
    }, {
            code: "MMO",
            name: "Maio airport",
            cityCode: "MMO",
            cityName: "Maio",
            countryCode: "CV",
            countryName: "Cape Verde"
    }, {
            code: "BGF",
            name: "Bangui airport",
            cityCode: "BGF",
            cityName: "Bangui",
            countryCode: "CF",
            countryName: "Central African Republic "
    }, {
            code: "NDJ",
            name: "Ndjamena airport",
            cityCode: "NDJ",
            cityName: "Ndjamena",
            countryCode: "TD",
            countryName: "Chad"
    }, {
            code: "HAH",
            name: "Moroni Prince Said Ibrahim In airport",
            cityCode: "HAH",
            cityName: "Moroni Prince Said Ibrahim In",
            countryCode: "KM",
            countryName: "Comoros "
    }, {
            code: "YVA",
            name: "Moroni Iconi airport",
            cityCode: "YVA",
            cityName: "Moroni Iconi",
            countryCode: "KM",
            countryName: "Comoros "
    }, {
            code: "AJN",
            name: "Anjouan airport",
            cityCode: "AJN",
            cityName: "Anjouan",
            countryCode: "KM",
            countryName: "Comoros "
    }, {
            code: "NWA",
            name: "Moheli airport",
            cityCode: "NWA",
            cityName: "Moheli",
            countryCode: "KM",
            countryName: "Comoros "
    }, {
            code: "BZV",
            name: "Brazzaville airport",
            cityCode: "BZV",
            cityName: "Brazzaville",
            countryCode: "CG",
            countryName: "Congo"
    }, {
            code: "PNR",
            name: "Pointe Noire airport",
            cityCode: "PNR",
            cityName: "Pointe Noire",
            countryCode: "CG",
            countryName: "Congo"
    }, {
            code: "",
            name: "Ouesso airports",
            cityCode: "",
            cityName: "Ouessos",
            countryCode: "CG",
            countryName: "Congo"
    }, {
            code: "",
            name: "Impfondo airports",
            cityCode: "",
            cityName: "Impfondos",
            countryCode: "CG",
            countryName: "Congo"
    }, {
            code: "FIH",
            name: "Kinshasa airport",
            cityCode: "FIH",
            cityName: "Kinshasa",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "FBM",
            name: "Lubumbashi airport",
            cityCode: "FBM",
            cityName: "Lubumbashi",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "",
            name: "Kongolo airports",
            cityCode: "",
            cityName: "Kongolos",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "KWZ",
            name: "Kolwezi airport",
            cityCode: "KWZ",
            cityName: "Kolwezi",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "FKI",
            name: "Kisangani airport",
            cityCode: "FKI",
            cityName: "Kisangani",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "MJM",
            name: "Mbuji Mayi airport",
            cityCode: "MJM",
            cityName: "Mbuji Mayi",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "GOM",
            name: "Goma airport",
            cityCode: "GOM",
            cityName: "Goma",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "KGA",
            name: "Kananga airport",
            cityCode: "KGA",
            cityName: "Kananga",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "GMA",
            name: "Gemena airport",
            cityCode: "GMA",
            cityName: "Gemena",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "MDK",
            name: "Mbandaka airport",
            cityCode: "MDK",
            cityName: "Mbandaka",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "JIB",
            name: "Djibouti airport",
            cityCode: "JIB",
            cityName: "Djibouti",
            countryCode: "DJ",
            countryName: "Djibouti "
    }, {
            code: "HRG",
            name: "Hurghada airport",
            cityCode: "HRG",
            cityName: "Hurghada",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "SSH",
            name: "Sharm El Sheikh airport",
            cityCode: "SSH",
            cityName: "Sharm El Sheikh",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "LXR",
            name: "Luxor airport",
            cityCode: "LXR",
            cityName: "Luxor",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "ALY",
            name: "Alexandria El Nohza airport",
            cityCode: "ALY",
            cityName: "Alexandria El Nohza",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "HBE",
            name: "Alexandria Borg El Arab airport",
            cityCode: "HBE",
            cityName: "Alexandria Borg El Arab",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "ASW",
            name: "Aswan Daraw airport",
            cityCode: "ASW",
            cityName: "Aswan Daraw",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "RMF",
            name: "Marsa Allam airport",
            cityCode: "RMF",
            cityName: "Marsa Allam",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "ABS",
            name: "Abu Simbel airport",
            cityCode: "ABS",
            cityName: "Abu Simbel",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "ATZ",
            name: "Assiut airport",
            cityCode: "ATZ",
            cityName: "Assiut",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "TCP",
            name: "Taba airport",
            cityCode: "TCP",
            cityName: "Taba",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "MUH",
            name: "Mersa Matruh airport",
            cityCode: "MUH",
            cityName: "Mersa Matruh",
            countryCode: "EG",
            countryName: "Egypt"
    }, {
            code: "SSG",
            name: "Malabo airport",
            cityCode: "SSG",
            cityName: "Malabo",
            countryCode: "GQ",
            countryName: "Equatorial Guinea "
    }, {
            code: "BSG",
            name: "Bata airport",
            cityCode: "BSG",
            cityName: "Bata",
            countryCode: "GQ",
            countryName: "Equatorial Guinea "
    }, {
            code: "ASM",
            name: "Asmara airport",
            cityCode: "ASM",
            cityName: "Asmara",
            countryCode: "ER",
            countryName: "Eritrea "
    }, {
            code: "MSW",
            name: "Massawa airport",
            cityCode: "MSW",
            cityName: "Massawa",
            countryCode: "ER",
            countryName: "Eritrea "
    }, {
            code: "ASA",
            name: "Assab airport",
            cityCode: "ASA",
            cityName: "Assab",
            countryCode: "ER",
            countryName: "Eritrea "
    }, {
            code: "BJR",
            name: "Bahar Dar airport",
            cityCode: "BJR",
            cityName: "Bahar Dar",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "LLI",
            name: "Lalibela airport",
            cityCode: "LLI",
            cityName: "Lalibela",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "DIR",
            name: "Dire Dawa airport",
            cityCode: "DIR",
            cityName: "Dire Dawa",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "JIM",
            name: "Jimma airport",
            cityCode: "JIM",
            cityName: "Jimma",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "GDQ",
            name: "Gondar airport",
            cityCode: "GDQ",
            cityName: "Gondar",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "AXU",
            name: "Axum airport",
            cityCode: "AXU",
            cityName: "Axum",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "MQX",
            name: "Makale airport",
            cityCode: "MQX",
            cityName: "Makale",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "JIJ",
            name: "Jijiga airport",
            cityCode: "JIJ",
            cityName: "Jijiga",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "GMB",
            name: "Gambela airport",
            cityCode: "GMB",
            cityName: "Gambela",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "SHC",
            name: "Indaselassie airport",
            cityCode: "SHC",
            cityName: "Indaselassie",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "ASO",
            name: "Asosa airport",
            cityCode: "ASO",
            cityName: "Asosa",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "GDE",
            name: "Gode/Iddidole airport",
            cityCode: "GDE",
            cityName: "Gode/Iddidole",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "AMH",
            name: "Arba Mintch airport",
            cityCode: "AMH",
            cityName: "Arba Mintch",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "ABK",
            name: "Kabri Dar airport",
            cityCode: "ABK",
            cityName: "Kabri Dar",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "HIL",
            name: "Shillavo airport",
            cityCode: "HIL",
            cityName: "Shillavo",
            countryCode: "ET",
            countryName: "Ethiopia"
    }, {
            code: "LBV",
            name: "Libreville airport",
            cityCode: "LBV",
            cityName: "Libreville",
            countryCode: "GA",
            countryName: "Gabon"
    }, {
            code: "POG",
            name: "Port Gentil airport",
            cityCode: "POG",
            cityName: "Port Gentil",
            countryCode: "GA",
            countryName: "Gabon"
    }, {
            code: "TCH",
            name: "Tchibanga airport",
            cityCode: "TCH",
            cityName: "Tchibanga",
            countryCode: "GA",
            countryName: "Gabon"
    }, {
            code: "GAX",
            name: "Gamba airport",
            cityCode: "GAX",
            cityName: "Gamba",
            countryCode: "GA",
            countryName: "Gabon"
    }, {
            code: "KOU",
            name: "Koulamoutou airport",
            cityCode: "KOU",
            cityName: "Koulamoutou",
            countryCode: "GA",
            countryName: "Gabon"
    }, {
            code: "MJL",
            name: "Mouila airport",
            cityCode: "MJL",
            cityName: "Mouila",
            countryCode: "GA",
            countryName: "Gabon"
    }, {
            code: "MKU",
            name: "Makokou airport",
            cityCode: "MKU",
            cityName: "Makokou",
            countryCode: "GA",
            countryName: "Gabon"
    }, {
            code: "MVB",
            name: "Franceville airport",
            cityCode: "MVB",
            cityName: "Franceville",
            countryCode: "GA",
            countryName: "Gabon"
    }, {
            code: "OYE",
            name: "Oyem airport",
            cityCode: "OYE",
            cityName: "Oyem",
            countryCode: "GA",
            countryName: "Gabon"
    }, {
            code: "BJL",
            name: "Banjul airport",
            cityCode: "BJL",
            cityName: "Banjul",
            countryCode: "GM",
            countryName: "Gambia"
    }, {
            code: "ACC",
            name: "Accra airport",
            cityCode: "ACC",
            cityName: "Accra",
            countryCode: "GH",
            countryName: "Ghana"
    }, {
            code: "KMS",
            name: "Kumasi airport",
            cityCode: "KMS",
            cityName: "Kumasi",
            countryCode: "GH",
            countryName: "Ghana"
    }, {
            code: "TML",
            name: "Tamale airport",
            cityCode: "TML",
            cityName: "Tamale",
            countryCode: "GH",
            countryName: "Ghana"
    }, {
            code: "CKY",
            name: "Conakry airport",
            cityCode: "CKY",
            cityName: "Conakry",
            countryCode: "GN",
            countryName: "Guinea"
    }, {
            code: "OXB",
            name: "Bissau airport",
            cityCode: "OXB",
            cityName: "Bissau",
            countryCode: "GW",
            countryName: "Guinea-Bissau "
    }, {
            code: "ABJ",
            name: "Abidjan airport",
            cityCode: "ABJ",
            cityName: "Abidjan",
            countryCode: "CI",
            countryName: "Ivory Coast"
    }, {
            code: "NBO",
            name: "Nairobi Jomo Kenyatta airport",
            cityCode: "NBO",
            cityName: "Nairobi Jomo Kenyatta",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "WIL",
            name: "Nairobi Wilson airport",
            cityCode: "WIL",
            cityName: "Nairobi Wilson",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "MBA",
            name: "Mombasa airport",
            cityCode: "MBA",
            cityName: "Mombasa",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "KIS",
            name: "Kisumu airport",
            cityCode: "KIS",
            cityName: "Kisumu",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "MRE",
            name: "Mara Lodges airport",
            cityCode: "MRE",
            cityName: "Mara Lodges",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "MYD",
            name: "Malindi airport",
            cityCode: "MYD",
            cityName: "Malindi",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "EDL",
            name: "Eldoret airport",
            cityCode: "EDL",
            cityName: "Eldoret",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "LAU",
            name: "Lamu airport",
            cityCode: "LAU",
            cityName: "Lamu",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "ASV",
            name: "Amboseli airport",
            cityCode: "ASV",
            cityName: "Amboseli",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "KTL",
            name: "Kitale airport",
            cityCode: "KTL",
            cityName: "Kitale",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "NYK",
            name: "Nanyuki airport",
            cityCode: "NYK",
            cityName: "Nanyuki",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "UAS",
            name: "Samburu airport",
            cityCode: "UAS",
            cityName: "Samburu",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "LKG",
            name: "Lokichoggio airport",
            cityCode: "LKG",
            cityName: "Lokichoggio",
            countryCode: "KE",
            countryName: "Kenya "
    }, {
            code: "MSU",
            name: "Maseru airport",
            cityCode: "MSU",
            cityName: "Maseru",
            countryCode: "LS",
            countryName: "Lesotho "
    }, {
            code: "ROB",
            name: "Monrovia airport",
            cityCode: "ROB",
            cityName: "Monrovia",
            countryCode: "LR",
            countryName: "Liberia "
    }, {
            code: "TIP",
            name: "Tripoli airport",
            cityCode: "TIP",
            cityName: "Tripoli",
            countryCode: "LY",
            countryName: "Libya"
    }, {
            code: "BEN",
            name: "Benghazi airport",
            cityCode: "BEN",
            cityName: "Benghazi",
            countryCode: "LY",
            countryName: "Libya"
    }, {
            code: "SEB",
            name: "Sebha airport",
            cityCode: "SEB",
            cityName: "Sebha",
            countryCode: "LY",
            countryName: "Libya"
    }, {
            code: "AKF",
            name: "Kufrah airport",
            cityCode: "AKF",
            cityName: "Kufrah",
            countryCode: "LY",
            countryName: "Libya"
    }, {
            code: "SRX",
            name: "Sert airport",
            cityCode: "SRX",
            cityName: "Sert",
            countryCode: "LY",
            countryName: "Libya"
    }, {
            code: "LAQ",
            name: "Beida airport",
            cityCode: "LAQ",
            cityName: "Beida",
            countryCode: "LY",
            countryName: "Libya"
    }, {
            code: "HUQ",
            name: "Houn airport",
            cityCode: "HUQ",
            cityName: "Houn",
            countryCode: "LY",
            countryName: "Libya"
    }, {
            code: "TOB",
            name: "Tobruk airport",
            cityCode: "TOB",
            cityName: "Tobruk",
            countryCode: "LY",
            countryName: "Libya"
    }, {
            code: "LTD",
            name: "Ghadames airport",
            cityCode: "LTD",
            cityName: "Ghadames",
            countryCode: "LY",
            countryName: "Libya"
    }, {
            code: "GHT",
            name: "Ghat airport",
            cityCode: "GHT",
            cityName: "Ghat",
            countryCode: "LY",
            countryName: "Libya"
    }, {
            code: "TNR",
            name: "Antananarivo airport",
            cityCode: "TNR",
            cityName: "Antananarivo",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "TMM",
            name: "Tamatave airport",
            cityCode: "TMM",
            cityName: "Tamatave",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "MJN",
            name: "Majunga airport",
            cityCode: "MJN",
            cityName: "Majunga",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "NOS",
            name: "Nossi-be airport",
            cityCode: "NOS",
            cityName: "Nossi-be",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "MOQ",
            name: "Morondava airport",
            cityCode: "MOQ",
            cityName: "Morondava",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "TLE",
            name: "Tulear airport",
            cityCode: "TLE",
            cityName: "Tulear",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "DIE",
            name: "Antsiranana airport",
            cityCode: "DIE",
            cityName: "Antsiranana",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "SMS",
            name: "Sainte Marie airport",
            cityCode: "SMS",
            cityName: "Sainte Marie",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "FTU",
            name: "Fort Dauphin airport",
            cityCode: "FTU",
            cityName: "Fort Dauphin",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "WMN",
            name: "Maroantsetra airport",
            cityCode: "WMN",
            cityName: "Maroantsetra",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "SVB",
            name: "Sambava airport",
            cityCode: "SVB",
            cityName: "Sambava",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "ANM",
            name: "Antalaha airport",
            cityCode: "ANM",
            cityName: "Antalaha",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "MXM",
            name: "Morombe airport",
            cityCode: "MXM",
            cityName: "Morombe",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "MXT",
            name: "Maintirano airport",
            cityCode: "MXT",
            cityName: "Maintirano",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "WTS",
            name: "Tsiroanomandidy airport",
            cityCode: "WTS",
            cityName: "Tsiroanomandidy",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "WMR",
            name: "Mananara airport",
            cityCode: "WMR",
            cityName: "Mananara",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "MNJ",
            name: "Mananjary airport",
            cityCode: "MNJ",
            cityName: "Mananjary",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "BPY",
            name: "Besalampy airport",
            cityCode: "BPY",
            cityName: "Besalampy",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "WAQ",
            name: "Antsalova airport",
            cityCode: "WAQ",
            cityName: "Antsalova",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "MJA",
            name: "Manja airport",
            cityCode: " MJ",
            cityName: "Manja",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "DWB",
            name: "Soalala airport",
            cityCode: "DWB",
            cityName: "Soalala",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "RVA",
            name: "Farafangana airport",
            cityCode: "RVA",
            cityName: "Farafangana",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "JVA",
            name: "Ankavandra airport",
            cityCode: "JVA",
            cityName: "Ankavandra",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "AMY",
            name: "Ambatomainty airport",
            cityCode: "AMY",
            cityName: "Ambatomainty",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "HVA",
            name: "Analalava airport",
            cityCode: "HVA",
            cityName: "Analalava",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "BMD",
            name: "Belo airport",
            cityCode: "BMD",
            cityName: "Belo",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "TVA",
            name: "Morafenobe airport",
            cityCode: "TVA",
            cityName: "Morafenobe",
            countryCode: "MG",
            countryName: "Madagascar"
    }, {
            code: "LLW",
            name: "Lilongwe airport",
            cityCode: "LLW",
            cityName: "Lilongwe",
            countryCode: "MW",
            countryName: "Malawi "
    }, {
            code: "BLZ",
            name: "Blantyre airport",
            cityCode: "BLZ",
            cityName: "Blantyre",
            countryCode: "MW",
            countryName: "Malawi "
    }, {
            code: "BKO",
            name: "Bamako airport",
            cityCode: "BKO",
            cityName: "Bamako",
            countryCode: "ML",
            countryName: "Mali"
    }, {
            code: "NKC",
            name: "Nouakchott airport",
            cityCode: "NKC",
            cityName: "Nouakchott",
            countryCode: "MR",
            countryName: "Mauritania"
    }, {
            code: "RRG",
            name: "Rodrigues Is airport",
            cityCode: "RRG",
            cityName: "Rodrigues Is",
            countryCode: "MU",
            countryName: "Mauritius"
    }, {
            code: "DZA",
            name: "Dzaoudzi airport",
            cityCode: "DZA",
            cityName: "Dzaoudzi",
            countryCode: "YT",
            countryName: "Mayotte"
    }, {
            code: "CMN",
            name: "Casablanca airport",
            cityCode: "CMN",
            cityName: "Casablanca",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "RAK",
            name: "Marrakech Menara airport",
            cityCode: "RAK",
            cityName: "Marrakech Menara",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "AGA",
            name: "Agadir airport",
            cityCode: "AGA",
            cityName: "Agadir",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "RBA",
            name: "Rabat Sale airport",
            cityCode: "RBA",
            cityName: "Rabat Sale",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "TNG",
            name: "Tangier airport",
            cityCode: "TNG",
            cityName: "Tangier",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "OUD",
            name: "Oujda airport",
            cityCode: "OUD",
            cityName: "Oujda",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "FEZ",
            name: "Fez Sais airport",
            cityCode: "FEZ",
            cityName: "Fez Sais",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "NDR",
            name: "Nador airport",
            cityCode: "NDR",
            cityName: "Nador",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "OZZ",
            name: "Ouarzazate airport",
            cityCode: "OZZ",
            cityName: "Ouarzazate",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "EUN",
            name: "Laayoune Hassan I airport",
            cityCode: "EUN",
            cityName: "Laayoune Hassan I",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "VIL",
            name: "Dakhla airport",
            cityCode: "VIL",
            cityName: "Dakhla",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "ESU",
            name: "Essaouira airport",
            cityCode: "ESU",
            cityName: "Essaouira",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "ERH",
            name: "Errachidia airport",
            cityCode: "ERH",
            cityName: "Errachidia",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "AHU",
            name: "Al Hoceima Charif Idr airport",
            cityCode: "AHU",
            cityName: "Al Hoceima Charif Idr",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "GLN",
            name: "Goulimime airport",
            cityCode: "GLN",
            cityName: "Goulimime",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "",
            name: "Kenitra airports",
            cityCode: "",
            cityName: "Kenitras",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "TTA",
            name: "Tan Tan airport",
            cityCode: "TTA",
            cityName: "Tan Tan",
            countryCode: "MA",
            countryName: "Morocco"
    }, {
            code: "MPM",
            name: "Maputo airport",
            cityCode: "MPM",
            cityName: "Maputo",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "BEW",
            name: "Beira airport",
            cityCode: "BEW",
            cityName: "Beira",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "APL",
            name: "Nampula airport",
            cityCode: "APL",
            cityName: "Nampula",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "VNX",
            name: "Vilanculos airport",
            cityCode: "VNX",
            cityName: "Vilanculos",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "POL",
            name: "Pemba airport",
            cityCode: "POL",
            cityName: "Pemba",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "INH",
            name: "Inhambane airport",
            cityCode: "INH",
            cityName: "Inhambane",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "UEL",
            name: "Quelimane airport",
            cityCode: "UEL",
            cityName: "Quelimane",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "BCW",
            name: "Benguera Island airport",
            cityCode: "BCW",
            cityName: "Benguera Island",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "BZB",
            name: "Bazaruto Island airport",
            cityCode: "BZB",
            cityName: "Bazaruto Island",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "IBL",
            name: "Indigo Bay Lodge airport",
            cityCode: "IBL",
            cityName: "Indigo Bay Lodge",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "TET",
            name: "Tete airport",
            cityCode: "TET",
            cityName: "Tete",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "VPY",
            name: "Chimoio airport",
            cityCode: "VPY",
            cityName: "Chimoio",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "VXC",
            name: "Lichinga airport",
            cityCode: "VXC",
            cityName: "Lichinga",
            countryCode: "MZ",
            countryName: "Mozambique "
    }, {
            code: "ERS",
            name: "Windhoek Eros airport",
            cityCode: "ERS",
            cityName: "Windhoek Eros",
            countryCode: "NA",
            countryName: "Namibia"
    }, {
            code: "WDH",
            name: "Windhoek Hosea Kutako airport",
            cityCode: "WDH",
            cityName: "Windhoek Hosea Kutako",
            countryCode: "NA",
            countryName: "Namibia"
    }, {
            code: "WVB",
            name: "Walvis Bay airport",
            cityCode: "WVB",
            cityName: "Walvis Bay",
            countryCode: "NA",
            countryName: "Namibia"
    }, {
            code: "LUD",
            name: "Luderitz airport",
            cityCode: "LUD",
            cityName: "Luderitz",
            countryCode: "NA",
            countryName: "Namibia"
    }, {
            code: "OND",
            name: "Ondangwa airport",
            cityCode: "OND",
            cityName: "Ondangwa",
            countryCode: "NA",
            countryName: "Namibia"
    }, {
            code: "OMD",
            name: "Oranjemund airport",
            cityCode: "OMD",
            cityName: "Oranjemund",
            countryCode: "NA",
            countryName: "Namibia"
    }, {
            code: "MPA",
            name: "Mpacha airport",
            cityCode: "MPA",
            cityName: "Mpacha",
            countryCode: "NA",
            countryName: "Namibia"
    }, {
            code: "NIM",
            name: "Niamey airport",
            cityCode: "NIM",
            cityName: "Niamey",
            countryCode: "NE",
            countryName: "Niger"
    }, {
            code: "PHG",
            name: "Port Harcourt airport",
            cityCode: "PHG",
            cityName: "Port Harcourt",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "RUN",
            name: "St Denis de la Reunion airport",
            cityCode: "RUN",
            cityName: "St Denis de la Reunion",
            countryCode: "RE",
            countryName: "Reunion "
    }, {
            code: "KGL",
            name: "Kigali airport",
            cityCode: "KGL",
            cityName: "Kigali",
            countryCode: "RW",
            countryName: "Rwanda"
    }, {
            code: "GYI",
            name: "Gisenyi airport",
            cityCode: "GYI",
            cityName: "Gisenyi",
            countryCode: "RW",
            countryName: "Rwanda"
    }, {
            code: "KME",
            name: "Kamembe airport",
            cityCode: "KME",
            cityName: "Kamembe",
            countryCode: "RW",
            countryName: "Rwanda"
    }, {
            code: "TMS",
            name: "Sao Tome Is airport",
            cityCode: "TMS",
            cityName: "Sao Tome Is",
            countryCode: "ST",
            countryName: "Sao Tome and Principe "
    }, {
            code: "DKR",
            name: "Dakar airport",
            cityCode: "DKR",
            cityName: "Dakar",
            countryCode: "SN",
            countryName: "Senegal"
    }, {
            code: "ZIG",
            name: "Ziguinchor airport",
            cityCode: "ZIG",
            cityName: "Ziguinchor",
            countryCode: "SN",
            countryName: "Senegal"
    }, {
            code: "CSK",
            name: "Cap Skirring airport",
            cityCode: "CSK",
            cityName: "Cap Skirring",
            countryCode: "SN",
            countryName: "Senegal"
    }, {
            code: "TUD",
            name: "Tambacounda airport",
            cityCode: "TUD",
            cityName: "Tambacounda",
            countryCode: "SN",
            countryName: "Senegal"
    }, {
            code: "PRI",
            name: "Praslin Island airport",
            cityCode: "PRI",
            cityName: "Praslin Island",
            countryCode: "SC",
            countryName: "Seychelles "
    }, {
            code: "FNA",
            name: "Freetown airport",
            cityCode: "FNA",
            cityName: "Freetown",
            countryCode: "SL",
            countryName: "Sierra Leone "
    }, {
            code: "HGA",
            name: "Hargeisa airport",
            cityCode: "HGA",
            cityName: "Hargeisa",
            countryCode: "SO",
            countryName: "Somalia "
    }, {
            code: "MGQ",
            name: "Mogadishu airport",
            cityCode: "MGQ",
            cityName: "Mogadishu",
            countryCode: "SO",
            countryName: "Somalia "
    }, {
            code: "BSA",
            name: "Bossaso airport",
            cityCode: "BSA",
            cityName: "Bossaso",
            countryCode: "SO",
            countryName: "Somalia "
    }, {
            code: "BBO",
            name: "Berbera airport",
            cityCode: "BBO",
            cityName: "Berbera",
            countryCode: "SO",
            countryName: "Somalia "
    }, {
            code: "GLK",
            name: "Galcaio airport",
            cityCode: "GLK",
            cityName: "Galcaio",
            countryCode: "SO",
            countryName: "Somalia "
    }, {
            code: "BXX",
            name: "Borama airport",
            cityCode: "BXX",
            cityName: "Borama",
            countryCode: "SO",
            countryName: "Somalia "
    }, {
            code: "BUO",
            name: "Burao airport",
            cityCode: "BUO",
            cityName: "Burao",
            countryCode: "SO",
            countryName: "Somalia "
    }, {
            code: "PLZ",
            name: "Port Elizabeth airport",
            cityCode: "PLZ",
            cityName: "Port Elizabeth",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "ELS",
            name: "East London airport",
            cityCode: "ELS",
            cityName: "East London",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "BFN",
            name: "Bloemfontein airport",
            cityCode: "BFN",
            cityName: "Bloemfontein",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "GRJ",
            name: "George airport",
            cityCode: "GRJ",
            cityName: "George",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "MQP",
            name: "Nelspruit airport",
            cityCode: "MQP",
            cityName: "Nelspruit",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "KIM",
            name: "Kimberley airport",
            cityCode: "KIM",
            cityName: "Kimberley",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "PZB",
            name: "Pietermaritzburg airport",
            cityCode: "PZB",
            cityName: "Pietermaritzburg",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "RCB",
            name: "Richards Bay airport",
            cityCode: "RCB",
            cityName: "Richards Bay",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "PTG",
            name: "Polokwane airport",
            cityCode: "PTG",
            cityName: "Polokwane",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "HDS",
            name: "Hoedspruit airport",
            cityCode: "HDS",
            cityName: "Hoedspruit",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "PHW",
            name: "Phalaborwa airport",
            cityCode: "PHW",
            cityName: "Phalaborwa",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "HLA",
            name: "Lanseria airport",
            cityCode: "HLA",
            cityName: "Lanseria",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "UTT",
            name: "Umtata airport",
            cityCode: "UTT",
            cityName: "Umtata",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "UTN",
            name: "Upington airport",
            cityCode: "UTN",
            cityName: "Upington",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "MBD",
            name: "Mmabatho airport",
            cityCode: "MBD",
            cityName: "Mmabatho",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "AAM",
            name: "Mala Mala airport",
            cityCode: "AAM",
            cityName: "Mala Mala",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "MGH",
            name: "Margate airport",
            cityCode: "MGH",
            cityName: "Margate",
            countryCode: "ZA",
            countryName: "South Africa"
    }, {
            code: "KRT",
            name: "Khartoum airport",
            cityCode: "KRT",
            cityName: "Khartoum",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "JUB",
            name: "Juba airport",
            cityCode: "JUB",
            cityName: "Juba",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "UYL",
            name: "Nyala airport",
            cityCode: "UYL",
            cityName: "Nyala",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "ELF",
            name: "El Fasher airport",
            cityCode: "ELF",
            cityName: "El Fasher",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "EGN",
            name: "Geneina airport",
            cityCode: "EGN",
            cityName: "Geneina",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "PZU",
            name: "Port Sudan airport",
            cityCode: "PZU",
            cityName: "Port Sudan",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "EBD",
            name: "El Obeid airport",
            cityCode: "EBD",
            cityName: "El Obeid",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "RBX",
            name: "Rumbek airport",
            cityCode: "RBX",
            cityName: "Rumbek",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "DOG",
            name: "Dongola airport",
            cityCode: "DOG",
            cityName: "Dongola",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "MAK",
            name: "Malakal airport",
            cityCode: "MAK",
            cityName: "Malakal",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "WHF",
            name: "Wadi Halfa airport",
            cityCode: "WHF",
            cityName: "Wadi Halfa",
            countryCode: "SD",
            countryName: "Sudan"
    }, {
            code: "MTS",
            name: "Manzini airport",
            cityCode: "MTS",
            cityName: "Manzini",
            countryCode: "SZ",
            countryName: "Swaziland"
    }, {
            code: "DAR",
            name: "Dar Es Salaam airport",
            cityCode: "DAR",
            cityName: "Dar Es Salaam",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "ZNZ",
            name: "Zanzibar airport",
            cityCode: "ZNZ",
            cityName: "Zanzibar",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "JRO",
            name: "Kilimanjaro airport",
            cityCode: "JRO",
            cityName: "Kilimanjaro",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "MWZ",
            name: "Mwanza airport",
            cityCode: "MWZ",
            cityName: "Mwanza",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "",
            name: "Bukoba airports",
            cityCode: "",
            cityName: "Bukobas",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "PMA",
            name: "Pemba airport",
            cityCode: "PMA",
            cityName: "Pemba",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "ARK",
            name: "Arusha airport",
            cityCode: "ARK",
            cityName: "Arusha",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "MYW",
            name: "Mtwara airport",
            cityCode: "MYW",
            cityName: "Mtwara",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "TBO",
            name: "Tabora airport",
            cityCode: "TBO",
            cityName: "Tabora",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "TKQ",
            name: "Kigoma airport",
            cityCode: "TKQ",
            cityName: "Kigoma",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "SHY",
            name: "Shinyanga airport",
            cityCode: "SHY",
            cityName: "Shinyanga",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "MUZ",
            name: "Musoma airport",
            cityCode: "MUZ",
            cityName: "Musoma",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "",
            name: "Songea airports",
            cityCode: "",
            cityName: "Songeas",
            countryCode: "TZ",
            countryName: "Tanzania "
    }, {
            code: "LFW",
            name: "Lome airport",
            cityCode: "LFW",
            cityName: "Lome",
            countryCode: "TG",
            countryName: "Togo"
    }, {
            code: "MIR",
            name: "Monastir airport",
            cityCode: "MIR",
            cityName: "Monastir",
            countryCode: "TN",
            countryName: "Tunisia"
    }, {
            code: "DJE",
            name: "Djerba airport",
            cityCode: "DJE",
            cityName: "Djerba",
            countryCode: "TN",
            countryName: "Tunisia"
    }, {
            code: "TOE",
            name: "Tozeur airport",
            cityCode: "TOE",
            cityName: "Tozeur",
            countryCode: "TN",
            countryName: "Tunisia"
    }, {
            code: "SFA",
            name: "Sfax El Maou airport",
            cityCode: "SFA",
            cityName: "Sfax El Maou",
            countryCode: "TN",
            countryName: "Tunisia"
    }, {
            code: "GAF",
            name: "Gafsa airport",
            cityCode: "GAF",
            cityName: "Gafsa",
            countryCode: "TN",
            countryName: "Tunisia"
    }, {
            code: "GAE",
            name: "Gabes airport",
            cityCode: "GAE",
            cityName: "Gabes",
            countryCode: "TN",
            countryName: "Tunisia"
    }, {
            code: "EBB",
            name: "Entebbe airport",
            cityCode: "EBB",
            cityName: "Entebbe",
            countryCode: "UG",
            countryName: "Uganda"
    }, {
            code: "RUA",
            name: "Arua airport",
            cityCode: "RUA",
            cityName: "Arua",
            countryCode: "UG",
            countryName: "Uganda"
    }, {
            code: "OYG",
            name: "Moyo airport",
            cityCode: "OYG",
            cityName: "Moyo",
            countryCode: "UG",
            countryName: "Uganda"
    }, {
            code: "ULU",
            name: "Gulu airport",
            cityCode: "ULU",
            cityName: "Gulu",
            countryCode: "UG",
            countryName: "Uganda"
    }, {
            code: "LUN",
            name: "Lusaka airport",
            cityCode: "LUN",
            cityName: "Lusaka",
            countryCode: "ZM",
            countryName: "Zambia"
    }, {
            code: "NLA",
            name: "Ndola airport",
            cityCode: "NLA",
            cityName: "Ndola",
            countryCode: "ZM",
            countryName: "Zambia"
    }, {
            code: "LVI",
            name: "Livingstone airport",
            cityCode: "LVI",
            cityName: "Livingstone",
            countryCode: "ZM",
            countryName: "Zambia"
    }, {
            code: "SLI",
            name: "Solwezi airport",
            cityCode: "SLI",
            cityName: "Solwezi",
            countryCode: "ZM",
            countryName: "Zambia"
    }, {
            code: "MFU",
            name: "Mfuwe airport",
            cityCode: "MFU",
            cityName: "Mfuwe",
            countryCode: "ZM",
            countryName: "Zambia"
    }, {
            code: "CIP",
            name: "Chipata airport",
            cityCode: "CIP",
            cityName: "Chipata",
            countryCode: "ZM",
            countryName: "Zambia"
    }, {
            code: "ZKP",
            name: "Kasompe airport",
            cityCode: "ZKP",
            cityName: "Kasompe",
            countryCode: "ZM",
            countryName: "Zambia"
    }, {
            code: "HRE",
            name: "Harare airport",
            cityCode: "HRE",
            cityName: "Harare",
            countryCode: "ZW",
            countryName: "Zimbabwe"
    }, {
            code: "VFA",
            name: "Victoria Falls airport",
            cityCode: "VFA",
            cityName: "Victoria Falls",
            countryCode: "ZW",
            countryName: "Zimbabwe"
    }, {
            code: "BUQ",
            name: "Bulawayo airport",
            cityCode: "BUQ",
            cityName: "Bulawayo",
            countryCode: "ZW",
            countryName: "Zimbabwe"
    }, {
            code: "GOU",
            name: "Garoua  airport",
            cityCode: "GOU",
            cityName: "Garoua",
            countryCode: "CM",
            countryName: "Cameroon"
    }, {
            code: "GXG",
            name: "Negage airport",
            cityCode: "GXG",
            cityName: "Negage",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "ILR",
            name: "Ilorin airport",
            cityCode: "ILR",
            cityName: "Ilorin",
            countryCode: "NG",
            countryName: "Nigeria"
    }, {
            code: "KND",
            name: "Kindu airport",
            cityCode: "KND",
            cityName: "Kindu",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "KOO",
            name: "Kongolo airport",
            cityCode: "KOO",
            cityName: "Kongolo",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }, {
            code: "MEG",
            name: "Malange airport",
            cityCode: "MEG",
            cityName: "Malange",
            countryCode: "AO",
            countryName: "Angola"
    }, {
            code: "MVR",
            name: "Salam airport",
            cityCode: "MVR",
            cityName: "Salam",
            countryCode: "CM",
            countryName: "Cameroon"
    }, {
            code: "MZI",
            name: "Mopti airport",
            cityCode: "MZI",
            cityName: "Mopti",
            countryCode: "ML",
            countryName: "Mali"
    }, {
            code: "NDB",
            name: "Nouadhibou airport",
            cityCode: "NDB",
            cityName: "Nouadhibou",
            countryCode: "MR",
            countryName: "Mauritania"
    }, {
            code: "NGE",
            name: "Ngaoundere airport",
            cityCode: "NGE",
            cityName: "Ngaoundere",
            countryCode: "CM",
            countryName: "Cameroon"
    }, {
            code: "OUZ",
            name: "Zouerate airport",
            cityCode: "OUZ",
            cityName: "Zouerate",
            countryCode: "MR",
            countryName: "Mauritania"
    }, {
            code: "TOM",
            name: "Tombouctou airport",
            cityCode: "TOM",
            cityName: "Tombouctou",
            countryCode: "ML",
            countryName: "Mali"
    }, {
            code: "ELG",
            name: "El Golea airport",
            cityCode: "ELG",
            cityName: "El Golea",
            countryCode: "DZ",
            countryName: "Algeria"
    }, {
            code: "BUX",
            name: "Bunia airport",
            cityCode: "BUX",
            cityName: "Bunia",
            countryCode: "CD",
            countryName: "Democratic Republic of the Congo"
    }]
    };

    return airports;

});