// https://umijs.org/config/
import { defineConfig } from "umi";
import defaultSettings from "./defaultSettings";
import proxy from "./proxy";
const { REACT_APP_ENV } = process.env;
const publicPath = "/admin/";
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: "zh-CN",
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: "@/components/PageLoading/index",
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: "/user",
      component: "../layouts/UserLayout",
      routes: [
        {
          name: "login",
          path: "/user/login",
          component: "./user/login",
        },
        {
          name: "register",
          path: "/user/register",
          component: "./user/register",
        },
      ],
    },
    {
      path: "/",
      component: "../layouts/SecurityLayout",
      routes: [
        {
          path: "/",
          component: "../layouts/BasicLayout",
          authority: ["admin", "user"],
          routes: [
            {
              path: "/",
              redirect: "/settings/websites",
            },
            {
              path: "/settings",
              redirect: "/settings/websites",
            },
            {
              path: "/settings",
              name: "settings",
              icon: "setting",
              routes: [
                {
                  path: "/settings/websites",
                  name: "websites",
                  component: "./settings/websites",
                },
                {
                  path: "/settings/nav",
                  name: "navigation",
                  component: "./settings/nav",
                },
                {
                  path: "/settings/assets",
                  name: "assets",
                  component: "./assets",
                },
                {
                  path: "/settings/upload",
                  name: "upload",
                  component: "./settings/upload",
                },
                {
                  component: "./404",
                },
              ],
            },
            {
              name: "personal_settings",
              path: "/account/settings",
              component: "./user/account/settings",
            },
            {
              path: "/user_manage",
              name: "userManage",
              icon: "setting",
              routes: [
                {
                  name: "adminGroup",
                  path: "/user_manage/admin_group",
                },
                {
                  name: "adminRole",
                  path: "/user_manage/admin_role",
                  component: "./user/role",
                },
                {
                  name: "addRole",
                  path: "/user_manage/authorize/add",
                  component: "./user/authorize/add",
                },
                {
                  name: "roleAuthorize",
                  path: "/user_manage/authorize/edit/:id",
                  component: "./user/authorize/edit",
                },
                {
                  name: "adminUser",
                  path: "/user_manage/admin_user",
                  component: "./user/adminUser",
                },
                {
                  name: "addAdminUser",
                  path: "/user_manage/admin_user/add",
                  component: "./user/adminUser/add",
                },
                {
                  name: "editAdminUser",
                  path: "/user_manage/admin_user/edit/:id",
                  component: "./user/adminUser/edit",
                },
                {
                  name: "userGroup",
                  path: "/user_manage/user_group",
                },
                {
                  name: "userList",
                  path: "/user_manage/user",
                },
              ],
            },
            {
              path: "/portal",
              name: "portalManage",
              icon: "",
              routes: [
                {
                  name: "portalList",
                  path: "/portal/index",
                },
                {
                  name: "portalCategory",
                  path: "/portal/category",
                  component: "./portal/category",
                },
                {
                  name: "addPortalCategory",
                  path: "/portal/category/add",
                  component: "./portal/category/Add",
                },
                {
                  name: "editPortalCategory",
                  path: "/portal/category/edit/:id",
                  component: "./portal/category/Edit",
                }
              ]
            },
            {
              component: "./404",
            },
          ],
        },
        {
          component: "./404",
        },
      ],
    },
    {
      component: "./404",
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    "primary-color": defaultSettings.primaryColor,
  },
  define: {
    PUBLIC_PATH: publicPath,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || "dev"],
  manifest: {
    basePath:
      publicPath.substr(0, publicPath.length - 1) == ""
        ? "/"
        : publicPath.substr(0, publicPath.length - 1),
  },
  base: publicPath,
  //最终输出路径
  publicPath: publicPath,
});
