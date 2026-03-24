// Chain image within chain info
export interface ChainImage {
  id: number
  name: string
  imagePath: string
  imageName: string
  imageLinkUrl: string | null
  imageViewType: number
}

// Shop environment setup configuration
export interface ShopEnvironmentSetup {
  shopId: number
  countryCode: string
  solutionId: number
  van: string | null
  vanName: string | null
  vanModel: string | null
  vanModelName: string | null
  vanSupplierName: string | null
  cid: string | null
  cidName: string | null
  salesType: number
  reviewPosted: boolean
  timeZone: number
  logoImagePath: string | null
  netmoneyAlarm: boolean
  netmoneyAlarmAmount: number
  vatRate: number
  dateFormat: string
  moneyDigit: number
  isTextSenderPhonePopUp: boolean
  cidAccounts: unknown[] | null
  isHasCIDMobileDevices: boolean
  viewMyShopSalesType: number
  modificationDate: string
  registrationDate: string
}

// Shop monthly fee configuration
export interface ShopMonthlyFee {
  month6DCRate: number
  month12DCRate: number
  feeTruncate: number
  autoTransfer: boolean
  billingType: number
  shopSolutionAmount: number
  shopTotalExtraAmount: number
  shopDiscountAmount: number
  dependentTotalFee: number
  waivedMonthlyFee: number
  includeExtraAmountOfDependents: boolean
  autoTransferARSStatus: number
  shopId: number
  modificationDate: string
  registrationDate: string
}
