import type { ChainImage } from './shop'

// Login request payload
export interface LoginRequest {
  userID: string
  password: string
  solutionId: string
}

// User authentication info from login response
export interface UserAuthInfo {
  authToken: string
  tokenExpiredDateTimeTS: number
  refreshToken: string
  refreshTokenExpiredDateTimeTS: number
  userAccountId: number
  countryCode: string
  solutionId: number
  shopId: number
  userID: string
  name: string | null
  language: string
  userRoleCode: string
  shopUserRoleId: number
  shopUserRoleCode: string | null
  lastestLoginDate: string
  isTemporaryPassword: boolean
  lastPasswordModificationDate: string
  isClientSearchedInBranches: boolean
}

// Chain info within shop basic info
export interface ChainInfo {
  chainId: number
  branchType: number
  branchNumber: number
  boardType: number
  chainImages: ChainImage[]
  hqNoticeOption: number
  shareClient: boolean
  shareService: boolean
  shareProduct: boolean
  useOtherShopSharePrepaidCard: boolean
  useOtherShopSharePrepaidService: boolean
  allowShopService: boolean
  allowShopProduct: boolean
  dataDownload: boolean
}

// Shop basic info from login response
export interface ShopBasicInfo {
  shopId: number
  registrationDate: string
  modificationDate: string
  expiryDateTS: number
  netmoneyBalance: number
  overdueMonths: number
  autoTransfer: boolean
  autoTransferDay: number | null
  taxInvoiceRequest: number
  taxInvoiceInfoId: number
  solutionName: string
  businessTypeName: string
  serviceTypeName: string
  chainInfo: ChainInfo
  timezone: number
  serviceAgreeDateTimeTS: number | null
  ownerMobileVerifyDateTimeTS: number | null
  shopLevel: number
  countryCode: string
  solutionId: number
  serviceTypeCode: string
  businessTypeCode: string
  shopName: string
  ownerName: string
  ownerMobileNumber: string | null
  managerName: string
  managerTitle: string
  mobileNumber: string
  messageRejected: boolean
  phoneNumber: string | null
  email: string | null
  emailRejected: boolean
  postCode: string | null
  address1: string | null
  address2: string | null
  shopRatingNumber: number
  referralSourceId: string | null
  referralSourceEtc: string | null
  issueShop: boolean
  shopStatus: number
  notes: string | null
  isAllowedClientDownloadData: boolean
  isExcludedVerify: boolean
}

// Full login result (combined response from backend)
export interface LoginResult {
  userAuthInfo: UserAuthInfo
  shopBasicInfo: ShopBasicInfo
}

// Refresh token response result
export interface RefreshTokenResult {
  authToken: string
  tokenExpiredDateTimeTS: number
  refreshToken: string
  refreshTokenExpiredDateTimeTS: number
}
