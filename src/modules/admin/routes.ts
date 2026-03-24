import type { RouteRecordRaw } from 'vue-router'

export const ADMIN_ROUTE_NAMES = {
  ADMIN: 'admin',
  ADMIN_LIST: 'admin-list',
  ADMIN_CREATE: 'admin-create',
  ADMIN_DETAIL: 'admin-detail',
  ADMIN_EDIT: 'admin-edit',
} as const

export type AdminRouteNameType = (typeof ADMIN_ROUTE_NAMES)[keyof typeof ADMIN_ROUTE_NAMES]

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'admin',
    name: ADMIN_ROUTE_NAMES.ADMIN,
    component: () => import('./views/AdminView.vue'),
    meta: {
      title: 'Admin',
      module: 'admin',
    },
    children: [
      {
        path: '',
        name: ADMIN_ROUTE_NAMES.ADMIN_LIST,
        component: () => import('./views/AdminList.vue'),
        meta: { title: 'Admin List', module: 'admin' },
      },
      {
        path: 'create',
        name: ADMIN_ROUTE_NAMES.ADMIN_CREATE,
        component: () => import('./views/AdminCreate.vue'),
        meta: { title: 'Admin Create', module: 'admin' },
      },
      {
        path: ':id',
        name: ADMIN_ROUTE_NAMES.ADMIN_DETAIL,
        component: () => import('./views/AdminDetail.vue'),
        meta: { title: 'Admin Detail', module: 'admin' },
      },
      {
        path: ':id/edit',
        name: ADMIN_ROUTE_NAMES.ADMIN_EDIT,
        component: () => import('./views/AdminEdit.vue'),
        meta: { title: 'Admin Edit', module: 'admin' },
      },
    ],
  },
]
