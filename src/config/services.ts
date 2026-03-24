/**
 * Static service configuration
 * These values are identical across all environments (local, dev, staging, production)
 * and do not need to be in .env files
 */

// ---- Solution & Gateway ----

export const SOLUTION_ID = 3002
export const GATEWAY_VERSION = 1

// ---- Third-party Authentication Keys ----

export const KT_CID_AUTHENTICATION_KEY = '7a8bd33b83cfd8cde4d0e86e508f38c93cbd2842'

// ---- Service API Version Pair ----

export interface ServiceApiVersions {
  readonly readVersion: number
  readonly cmdVersion: number
}

export interface ServiceConfig {
  readonly name: string
  readonly api: ServiceApiVersions
}

export interface ServiceReadOnlyConfig {
  readonly name: string
  readonly api: {
    readonly readVersion: number
  }
}

export interface ServiceCmdOnlyConfig {
  readonly name: string
  readonly api: {
    readonly cmdVersion: number
  }
}

// ---- Service Definitions ----

export const GOODS_SERVICE: ServiceConfig = {
  name: 'goods',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const BOOKINGS_SERVICE: ServiceConfig = {
  name: 'bookings',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const BOOKINGS_BKG_TASKS_SERVICE: ServiceReadOnlyConfig = {
  name: 'bookings-bkg-tasks',
  api: { readVersion: 1 },
} as const

export const CLIENTS_SERVICE: ServiceConfig = {
  name: 'clients',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const STAFFS_SERVICE: ServiceConfig = {
  name: 'staffs',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const SALES_SERVICE: ServiceConfig = {
  name: 'sales',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const INVENTORY_SERVICE: ServiceConfig = {
  name: 'inventory',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const ADMINS_SERVICE: ServiceConfig = {
  name: 'admins',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const IDENTITIES_SERVICE: ServiceConfig = {
  name: 'identities',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const ADMIN_SALES_SERVICE: ServiceConfig = {
  name: 'adminsales',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const BOARDS_SERVICE: ServiceConfig = {
  name: 'boards',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const MESSAGES_SERVICE: ServiceConfig = {
  name: 'messages',
  api: { readVersion: 1, cmdVersion: 1 },
} as const

export const MESSAGE_AUTOS_SERVICE: ServiceCmdOnlyConfig = {
  name: 'messageautos',
  api: { cmdVersion: 1 },
} as const
