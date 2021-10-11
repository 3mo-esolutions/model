// eslint-disable-next-line @typescript-eslint/no-unused-vars
const enum CurrencyCode {
	/** Bitcoin */
	BTC = 'BTC',
	/** Afghani */
	AFN = 'AFN',
	/** Euro */
	EUR = 'EUR',
	/** Lek */
	ALL = 'ALL',
	/** Algerian Dinar */
	DZD = 'DZD',
	/** US Dollar */
	USD = 'USD',
	/** Kwanza */
	AOA = 'AOA',
	/** East Caribbean Dollar */
	XCD = 'XCD',
	/** No universal currency */
	ARS = 'ARS',
	/** Argentine Peso */
	AMD = 'AMD',
	/** Armenian Dram */
	AWG = 'AWG',
	/** Aruban Florin */
	AUD = 'AUD',
	/** Australian Dollar */
	AZN = 'AZN',
	/** Azerbaijan Manat */
	BSD = 'BSD',
	/** Bahamian Dollar */
	BHD = 'BHD',
	/** Bahraini Dinar */
	BDT = 'BDT',
	/** Taka */
	BBD = 'BBD',
	/** Barbados Dollar */
	BYN = 'BYN',
	/** Belarusian Ruble */
	BZD = 'BZD',
	/** Belize Dollar */
	XOF = 'XOF',
	/** CFA Franc BCEAO */
	BMD = 'BMD',
	/** Bermudian Dollar */
	INR = 'INR',
	/** Indian Rupee */
	BTN = 'BTN',
	/** Ngultrum */
	BOB = 'BOB',
	/** Boliviano */
	BOV = 'BOV',
	/** Mvdol */
	BAM = 'BAM',
	/** Convertible Mark */
	BWP = 'BWP',
	/** Pula */
	NOK = 'NOK',
	/** Norwegian Krone */
	BRL = 'BRL',
	/** Brazilian Real */
	BND = 'BND',
	/** Brunei Dollar */
	BGN = 'BGN',
	/** Bulgarian Lev */
	BIF = 'BIF',
	/** Burundi Franc */
	CVE = 'CVE',
	/** Cabo Verde Escudo */
	KHR = 'KHR',
	/** Riel */
	XAF = 'XAF',
	/** CFA Franc BEAC */
	CAD = 'CAD',
	/** Canadian Dollar */
	KYD = 'KYD',
	/** Cayman Islands Dollar */
	CLP = 'CLP',
	/** Chilean Peso */
	CLF = 'CLF',
	/** Unidad de Fomento */
	CNY = 'CNY',
	/** Yuan Renminbi */
	COP = 'COP',
	/** Colombian Peso */
	COU = 'COU',
	/** Unidad de Valor Real */
	KMF = 'KMF',
	/** Comorian Franc */
	CDF = 'CDF',
	/** Congolese Franc */
	NZD = 'NZD',
	/** New Zealand Dollar */
	CRC = 'CRC',
	/** Costa Rican Colon */
	HRK = 'HRK',
	/** Kuna */
	CUP = 'CUP',
	/** Cuban Peso */
	CUC = 'CUC',
	/** Peso Convertible */
	ANG = 'ANG',
	/** Netherlands Antillean Guilder */
	CZK = 'CZK',
	/** Czech Koruna */
	DKK = 'DKK',
	/** Danish Krone */
	DJF = 'DJF',
	/** Djibouti Franc */
	DOP = 'DOP',
	/** Dominican Peso */
	EGP = 'EGP',
	/** Egyptian Pound */
	SVC = 'SVC',
	/** El Salvador Colon */
	ERN = 'ERN',
	/** Nakfa */
	SZL = 'SZL',
	/** Lilangeni */
	ETB = 'ETB',
	/** Ethiopian Birr */
	FKP = 'FKP',
	/** Falkland Islands Pound */
	FJD = 'FJD',
	/** Fiji Dollar */
	XPF = 'XPF',
	/** CFP Franc */
	GMD = 'GMD',
	/** Dalasi */
	GEL = 'GEL',
	/** Lari */
	GHS = 'GHS',
	/** Ghana Cedi */
	GIP = 'GIP',
	/** Gibraltar Pound */
	GTQ = 'GTQ',
	/** Quetzal */
	GBP = 'GBP',
	/** Pound Sterling */
	GNF = 'GNF',
	/** Guinean Franc */
	GYD = 'GYD',
	/** Guyana Dollar */
	HTG = 'HTG',
	/** Gourde */
	HNL = 'HNL',
	/** Lempira */
	HKD = 'HKD',
	/** Hong Kong Dollar */
	HUF = 'HUF',
	/** Forint */
	ISK = 'ISK',
	/** Iceland Krona */
	IDR = 'IDR',
	/** Rupiah */
	XDR = 'XDR',
	/** SDR (Special Drawing Right) */
	IRR = 'IRR',
	/** Iranian Rial */
	IQD = 'IQD',
	/** Iraqi Dinar */
	ILS = 'ILS',
	/** New Israeli Sheqel */
	JMD = 'JMD',
	/** Jamaican Dollar */
	JPY = 'JPY',
	/** Yen */
	JOD = 'JOD',
	/** Jordanian Dinar */
	KZT = 'KZT',
	/** Tenge */
	KES = 'KES',
	/** Kenyan Shilling */
	KPW = 'KPW',
	/** North Korean Won */
	KRW = 'KRW',
	/** Won */
	KWD = 'KWD',
	/** Kuwaiti Dinar */
	KGS = 'KGS',
	/** Som */
	LAK = 'LAK',
	/** Lao Kip */
	LBP = 'LBP',
	/** Lebanese Pound */
	LSL = 'LSL',
	/** Loti */
	ZAR = 'ZAR',
	/** Rand */
	LRD = 'LRD',
	/** Liberian Dollar */
	LYD = 'LYD',
	/** Libyan Dinar */
	CHF = 'CHF',
	/** Swiss Franc */
	MOP = 'MOP',
	/** Pataca */
	MKD = 'MKD',
	/** Denar */
	MGA = 'MGA',
	/** Malagasy Ariary */
	MWK = 'MWK',
	/** Malawi Kwacha */
	MYR = 'MYR',
	/** Malaysian Ringgit */
	MVR = 'MVR',
	/** Rufiyaa */
	MRU = 'MRU',
	/** Ouguiya */
	MUR = 'MUR',
	/** Mauritius Rupee */
	XUA = 'XUA',
	/** ADB Unit of Account */
	MXN = 'MXN',
	/** Mexican Peso */
	MXV = 'MXV',
	/** Mexican Unidad de Inversion (UDI) */
	MDL = 'MDL',
	/** Moldovan Leu */
	MNT = 'MNT',
	/** Tugrik */
	MAD = 'MAD',
	/** Moroccan Dirham */
	MZN = 'MZN',
	/** Mozambique Metical */
	MMK = 'MMK',
	/** Kyat */
	NAD = 'NAD',
	/** Namibia Dollar */
	NPR = 'NPR',
	/** Nepalese Rupee */
	NIO = 'NIO',
	/** Cordoba Oro */
	NGN = 'NGN',
	/** Naira */
	OMR = 'OMR',
	/** Rial Omani */
	PKR = 'PKR',
	/** Pakistan Rupee */
	PAB = 'PAB',
	/** Balboa */
	PGK = 'PGK',
	/** Kina */
	PYG = 'PYG',
	/** Guarani */
	PEN = 'PEN',
	/** Sol */
	PHP = 'PHP',
	/** Philippine Peso */
	PLN = 'PLN',
	/** Zloty */
	QAR = 'QAR',
	/** Qatari Rial */
	RON = 'RON',
	/** Romanian Leu */
	RUB = 'RUB',
	/** Russian Ruble */
	RWF = 'RWF',
	/** Rwanda Franc */
	SHP = 'SHP',
	/** Saint Helena Pound */
	WST = 'WST',
	/** Tala */
	STN = 'STN',
	/** Dobra */
	SAR = 'SAR',
	/** Saudi Riyal */
	RSD = 'RSD',
	/** Serbian Dinar */
	SCR = 'SCR',
	/** Seychelles Rupee */
	SLL = 'SLL',
	/** Leone */
	SGD = 'SGD',
	/** Singapore Dollar */
	XSU = 'XSU',
	/** Sucre */
	SBD = 'SBD',
	/** Solomon Islands Dollar */
	SOS = 'SOS',
	/** Somali Shilling */
	SSP = 'SSP',
	/** South Sudanese Pound */
	LKR = 'LKR',
	/** Sri Lanka Rupee */
	SDG = 'SDG',
	/** Sudanese Pound */
	SRD = 'SRD',
	/** Surinam Dollar */
	SEK = 'SEK',
	/** Swedish Krona */
	CHE = 'CHE',
	/** WIR Euro */
	CHW = 'CHW',
	/** WIR Franc */
	SYP = 'SYP',
	/** Syrian Pound */
	TWD = 'TWD',
	/** New Taiwan Dollar */
	TJS = 'TJS',
	/** Somoni */
	TZS = 'TZS',
	/** Tanzanian Shilling */
	THB = 'THB',
	/** Baht */
	TOP = 'TOP',
	/** Pa’anga */
	TTD = 'TTD',
	/** Trinidad and Tobago Dollar */
	TND = 'TND',
	/** Tunisian Dinar */
	TRY = 'TRY',
	/** Turkish Lira */
	TMT = 'TMT',
	/** Turkmenistan New Manat */
	UGX = 'UGX',
	/** Uganda Shilling */
	UAH = 'UAH',
	/** Hryvnia */
	AED = 'AED',
	/** UAE Dirham */
	USN = 'USN',
	/** US Dollar (Next day) */
	UYU = 'UYU',
	/** Peso Uruguayo */
	UYI = 'UYI',
	/** Uruguay Peso en Unidades Indexadas (UI) */
	UYW = 'UYW',
	/** Unidad Previsional */
	UZS = 'UZS',
	/** Uzbekistan Sum */
	VUV = 'VUV',
	/** Vatu */
	VES = 'VES',
	/** Bolívar Soberano */
	VED = 'VED',
	/** Dong */
	VND = 'VND',
	/** Yemeni Rial */
	YER = 'YER',
	/** Zambian Kwacha */
	ZMW = 'ZMW',
	/** Zimbabwe Dollar */
	ZWL = 'ZWL',
	/** Bond Markets Unit European Composite Unit (EURCO) */
	XBA = 'XBA',
	/** Bond Markets Unit European Monetary Unit (E.M.U.-6) */
	XBB = 'XBB',
	/** Bond Markets Unit European Unit of Account 9 (E.U.A.-9) */
	XBC = 'XBC',
	/** Bond Markets Unit European Unit of Account 17 (E.U.A.-17) */
	XBD = 'XBD',
	/** Codes specifically reserved for testing purposes */
	XTS = 'XTS',
	/** The codes assigned for transactions where no currency is involved */
	XXX = 'XXX',
	/** Gold */
	XAU = 'XAU',
	/** Palladium */
	XPD = 'XPD',
	/** Platinum */
	XPT = 'XPT',
	/** Silver */
	XAG = 'XAG',
}