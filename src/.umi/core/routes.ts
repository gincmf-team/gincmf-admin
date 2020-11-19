// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/return/workspace/react/gincmf-admin/node_modules/_@umijs_runtime@3.2.27@@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@/components/PageLoading/index';

export function getRoutes() {
  const routes = [
  {
    "path": "/user",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__UserLayout' */'/Users/return/workspace/react/gincmf-admin/src/layouts/UserLayout'), loading: LoadingComponent}),
    "routes": [
      {
        "name": "login",
        "path": "/user/login",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__login' */'/Users/return/workspace/react/gincmf-admin/src/pages/user/login'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "name": "register",
        "path": "/user/register",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__register' */'/Users/return/workspace/react/gincmf-admin/src/pages/user/register'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__SecurityLayout' */'/Users/return/workspace/react/gincmf-admin/src/layouts/SecurityLayout'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__BasicLayout' */'/Users/return/workspace/react/gincmf-admin/src/layouts/BasicLayout'), loading: LoadingComponent}),
        "authority": [
          "admin",
          "user"
        ],
        "routes": [
          {
            "path": "/",
            "redirect": "/settings/websites",
            "exact": true
          },
          {
            "path": "/settings",
            "redirect": "/settings/websites",
            "exact": true
          },
          {
            "path": "/settings",
            "name": "settings",
            "icon": "setting",
            "routes": [
              {
                "path": "/settings/websites",
                "name": "websites",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__settings__websites' */'/Users/return/workspace/react/gincmf-admin/src/pages/settings/websites'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/settings/nav",
                "name": "navigation",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__settings__nav' */'/Users/return/workspace/react/gincmf-admin/src/pages/settings/nav'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/settings/assets",
                "name": "assets",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__assets' */'/Users/return/workspace/react/gincmf-admin/src/pages/assets'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/settings/upload",
                "name": "upload",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__settings__upload' */'/Users/return/workspace/react/gincmf-admin/src/pages/settings/upload'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/return/workspace/react/gincmf-admin/src/pages/404'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "name": "personal_settings",
            "path": "/account/settings",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__account__settings' */'/Users/return/workspace/react/gincmf-admin/src/pages/user/account/settings'), loading: LoadingComponent}),
            "exact": true
          },
          {
            "path": "/user_manage",
            "name": "userManage",
            "icon": "setting",
            "routes": [
              {
                "name": "adminGroup",
                "path": "/user_manage/admin_group",
                "exact": true
              },
              {
                "name": "adminRole",
                "path": "/user_manage/admin_role",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__role' */'/Users/return/workspace/react/gincmf-admin/src/pages/user/role'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "addRole",
                "path": "/user_manage/authorize/add",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__authorize__add' */'/Users/return/workspace/react/gincmf-admin/src/pages/user/authorize/add'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "roleAuthorize",
                "path": "/user_manage/authorize/edit/:id",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__authorize__edit' */'/Users/return/workspace/react/gincmf-admin/src/pages/user/authorize/edit'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "adminUser",
                "path": "/user_manage/admin_user",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__adminUser' */'/Users/return/workspace/react/gincmf-admin/src/pages/user/adminUser'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "addAdminUser",
                "path": "/user_manage/admin_user/add",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__adminUser__add' */'/Users/return/workspace/react/gincmf-admin/src/pages/user/adminUser/add'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "editAdminUser",
                "path": "/user_manage/admin_user/edit/:id",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__adminUser__edit' */'/Users/return/workspace/react/gincmf-admin/src/pages/user/adminUser/edit'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "userGroup",
                "path": "/user_manage/user_group",
                "exact": true
              },
              {
                "name": "userList",
                "path": "/user_manage/user",
                "exact": true
              }
            ]
          },
          {
            "path": "/portal",
            "name": "portalManage",
            "icon": "",
            "routes": [
              {
                "name": "portalList",
                "path": "/portal/index",
                "exact": true
              },
              {
                "name": "portalCategory",
                "path": "/portal/category",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__portal__category' */'/Users/return/workspace/react/gincmf-admin/src/pages/portal/category'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "addPortalCategory",
                "path": "/portal/category/add",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__portal__category__Add' */'/Users/return/workspace/react/gincmf-admin/src/pages/portal/category/Add'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "editPortalCategory",
                "path": "/portal/category/edit/:id",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__portal__category__Edit' */'/Users/return/workspace/react/gincmf-admin/src/pages/portal/category/Edit'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/return/workspace/react/gincmf-admin/src/pages/404'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/return/workspace/react/gincmf-admin/src/pages/404'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  },
  {
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/return/workspace/react/gincmf-admin/src/pages/404'), loading: LoadingComponent}),
    "exact": true
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
