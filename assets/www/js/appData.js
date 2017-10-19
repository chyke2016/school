/*global define , require */
define(function (require) {

    'use strict';
    var Tripican_Live = true,
        Live_Proxy = true,

        AppData = {

            Name: 'Diamond',

            Version: '3.2.0.0',

            Timeout: 1000 * 60 * 3, //3mins

            Debug: false,

            Get_Error: false,

            network_connection: '',

            Tripican_billercodes: Tripican_Live ? 'B00007' : 'B00019',

            App_Key: Live_Proxy ? '1b86d9bc0636a65236d7a52164146cd33067bccc' : 'b15ca482619b2d1e6704494dbfcf2053a7dc131c',

            push_secret: '58c8058d9c76e87429fcc27248799ccb',
            push_app_Id: '1bf02a316f9eef38',
            push_language: 'en',
            push_tags: {},
            push_timezone: '2',
            push_devicetype: 'phone',

            Url: Live_Proxy ? 'https://appsecure.diamondbank.com:8090/VBPDiamond/resources/' : 'http://197.253.5.211:8080/VBPDiamond/resources/',

            Store: {
                name: 'DBStore',
                data: {
                    notifications: []
                }
            },

            Url_Location: 'http://apps.vanso.com/ip2location/ip2location_webservice.php',

            Url_Location_LatLon: 'http://vanso.io/api/latlong.php',

            Url_Adserver: 'https://adserver.mimo.com.ng/',

            Url_Branches: 'http://vansogeo.cartodb.com/api/v1/',

            Url_Carrier: 'http://apps.vanso.com/ip2location/ip2location_webservice.php/',

            Url_Countly: 'https://mobile-analytics.vanso.com/i',

            Url_Bank_Info: 'http://vanso.io/api/bankval.php',

            Url_Bank_Info_Key: 'fa419b193cb109ad32214a37e53c92f95d1ed613',

            Service: {},

            Session_Id: null,

            Customer_Name: null,

            Url_Push_Registration: 'https://rtcp.mimo.com.ng/api/devices/register_device?',
            Url_Push_Receipt: 'https://rtcp.mimo.com.ng/api/read_receipt/opened?'
        };

    Object.defineProperty(AppData, 'UUID', {
        get: function () {
            return window.device ? device.uuid : 'testAccount';
        }
    });

    Object.defineProperty(AppData, 'DevicePlatform', {
        get: function () {
            return window.device ? device.platform : 'desktop';
        }
    });

    AppData.Service = {
        authenticate: AppData.Url + 'authenticate',
        getAccounts: AppData.Url + 'getAccounts',
        getStatement: AppData.Url + 'getStatement',
        accountTrends: AppData.Url + 'accountTrends',
        localTransfer: AppData.Url + 'localTransfer',
        transferToAnotherBank: AppData.Url + 'transferToAnotherBank',
        accountNameLookup: AppData.Url + 'accountNameLookup',
        nipAccountLookup: AppData.Url + 'nipAccountLookup',
        getMBPPBillerCategory: AppData.Url + 'getMBPPBillerCategory',
        getMbppVersionNumber: AppData.Url + 'getMbppVersionNumber',
        getMBPPBillerVersion: AppData.Url + 'getMBPPDataVersion',
        getSpecialBillerCodes: AppData.Url + 'getSpecialBillerCodes',
        getMBPPBillers: AppData.Url + 'getMBPPBillers',
        getMBPPbillerproducts: AppData.Url + 'getMBPPbillerproducts',
        payBill: AppData.Url + 'doMBPPBillPay',
        chequeConfirmation: AppData.Url + 'chequeConfirmation',
        chequeStop: AppData.Url + 'chequeStop',
        chequeBookRequest: AppData.Url + 'chequeBookRequest',
        tripicanTopBoxOffice: AppData.Url + 'tripican/getTopBoxOffice',
        tripicanShowingToday: AppData.Url + 'tripican/getShowingToday',
        tripicanPlaces: AppData.Url + 'tripican/getTripicanCinemas',
        tripicanInCinemas: AppData.Url + 'tripican/getInCinemas',
        tripicanShowTimes: AppData.Url + 'tripican/getShowTimes',
        tripicanPayment: AppData.Url + 'tripican/doMovieBooking',
        getBanks: AppData.Url + 'getBanks',
        searchAfriEvents: AppData.Url + 'afriTicket/searchEvents',
        postEventBookingAfriTickets: AppData.Url + 'afriTicket/doEventsBooking',
        reRegister: AppData.Url + 'selfService/initiateChangeDevice',
        reRegisterValidate: AppData.Url + 'selfService/validateCode',
        initiateRegistration: AppData.Url + 'initiateRegistration',
        initiateRegistrationWithCard: AppData.Url + 'initiateRegistrationWithCard',
        validateRegistrationCode: AppData.Url + 'validateRegistrationCode',
        completeRegistration: AppData.Url + 'completeRegistration',
        assistanceRegistration: AppData.Url + 'requestAssistance',
        adUrl: AppData.Url_Adserver + 'www/delivery/ax.php',
        doSearchFlight: AppData.Url + 'doSearchFlight/new',
        doBookFlight: AppData.Url + 'doBookFlight',
        forgot_GenerateTempPassword: AppData.Url + 'generateTempPassword',
        forgot_ResetPassword: AppData.Url + 'resetPassword',
        branchesList: AppData.Url_Branches,
        yelloGetBeneficiary: AppData.Url + 'yello/nameEnquiry',
        yelloDiamondAccountTransfer: AppData.Url + 'yello/diamondAccountTransfer',
        forgotInternetBankingId: AppData.Url + 'selfService/getInternetBankingId',
        profileFetchDetail: AppData.Url + 'getProfile',
        profileChangePassword: AppData.Url + 'changePassword',
        profileChangePIN: AppData.Url + 'changePIN',
        getCreditCards: AppData.Url + 'getCreditCards',
        doCreditCardPayment: AppData.Url + 'doCreditCardPayment',
        getDebitCards: AppData.Url + 'getCards',
        disableDebitCard: AppData.Url + 'disableCard',
        enableDebitCard: AppData.Url + 'enableCard',
        getFAQ: AppData.Url + 'getQnA',
        diamondMoneyTransfer: AppData.Url + 'walkInTransfer',
        getBillBeneficiary: AppData.Url + 'billBeneficiary/getBeneficiary',
        deleteBillBeneficiary: AppData.Url + 'billBeneficiary/deleteBeneficiary',
        createBillBeneficiary: AppData.Url + 'billBeneficiary/createBeneficiary',
        getBillBeneficiaryTransfer: AppData.Url + 'transferBeneficiary/getBeneficiary',
        deleteBillBeneficiaryTransfer: AppData.Url + 'transferBeneficiary/deleteBeneficiary',
        createBillBeneficiaryTransfer: AppData.Url + 'transferBeneficiary/createBeneficiary',
        requestStatement: AppData.Url + 'doStatementRequest',
        billNameLookup: AppData.Url + 'billNameLookup',
        smileBundleCatalogues: AppData.Url + 'smile/getBundleCatalogues',
        doValidate: AppData.Url + 'smile/doValidate',
        doRecharge: AppData.Url + 'smile/doRecharge',
        purchaseBundle: AppData.Url + 'smile/purchaseBundle',
        getFCYSwiftDetails: AppData.Url + 'fcy/getFCYSwiftDetails',
        getFCYTransferEstimate: AppData.Url + 'fcy/getFCYTransferEstimate',
        doFCYTransfer: AppData.Url + 'fcy/doFCYTransfer',
        getFCYBeneficiary: AppData.Url + 'FCYBeneficiary/getFCYBeneficiary',
        createFCYBeneficiary: AppData.Url + 'FCYBeneficiary/createFCYBeneficiary',
        deleteFCYBeneficiary: AppData.Url + 'FCYBeneficiary/deleteFCYBeneficiary',
        logout: AppData.Url + 'logout',
        fuelNameLookup: AppData.Url + 'fuel/nameLookup',
        fuelTopUp: AppData.Url + 'fuel/topUpWallet',
        fuelVoucher: AppData.Url + 'fuel/purchaseVoucher',
    };

    return AppData;

});