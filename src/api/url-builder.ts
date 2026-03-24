/**
 * Type-safe URL builder for the gateway's CQRS microservices pattern.
 *
 * Gateway URL structure:
 *   /api/{type}/v{version}/{serviceName}/{endpoint}
 *
 * Where type is one of: read (queries), cmd (mutations), aggr (aggregations)
 */

import type { ServiceCmdOnlyConfig, ServiceConfig, ServiceReadOnlyConfig } from '@/config/services'

type ApiType = 'read' | 'cmd' | 'aggr'

function buildUrl(type: ApiType, version: number, serviceName: string, endpoint: string): string {
  return `/api/${type}/v${version}/${serviceName}/${endpoint}`
}

/** Build a read (query) URL for a service that supports reads */
export function readUrl(service: ServiceConfig | ServiceReadOnlyConfig, endpoint: string): string {
  return buildUrl('read', service.api.readVersion, service.name, endpoint)
}

/** Build a cmd (mutation) URL for a service that supports commands */
export function cmdUrl(service: ServiceConfig | ServiceCmdOnlyConfig, endpoint: string): string {
  return buildUrl('cmd', service.api.cmdVersion, service.name, endpoint)
}

/** Build an aggregator URL */
export function aggrUrl(serviceName: string, endpoint: string, version: number): string {
  return buildUrl('aggr', version, serviceName, endpoint)
}
