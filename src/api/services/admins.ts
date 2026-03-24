import { ADMINS_SERVICE } from '@/config/services'

import type { ApiResponse } from '@/types/api'
import type { ShopBasicInfo } from '@/types/auth'
import type { ShopEnvironmentSetup, ShopMonthlyFee } from '@/types/shop'

import { gatewayService } from './base'

export const adminsApi = {
  async getShopBasic(shopId: number): Promise<ApiResponse<ShopBasicInfo>> {
    return gatewayService.read<ShopBasicInfo>(ADMINS_SERVICE, 'Shop/Basic', { shopId })
  },

  async getShopEnvironmentSetup(
    shopId: number,
    countryCode: string,
  ): Promise<ApiResponse<ShopEnvironmentSetup>> {
    return gatewayService.read<ShopEnvironmentSetup>(ADMINS_SERVICE, 'Shop/ShopEnvironmentSetup', {
      shopId,
      countryCode,
    })
  },

  async getShopMonthlyFee(shopId: number): Promise<ApiResponse<ShopMonthlyFee>> {
    return gatewayService.read<ShopMonthlyFee>(ADMINS_SERVICE, 'Shop/MonthlyFee', { shopId })
  },
}
