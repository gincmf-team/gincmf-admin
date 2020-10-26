/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from "@ant-design/pro-layout";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useIntl, connect, history } from "umi";
import { Result, Button } from "antd";
import { getAdminMenu } from "@/services/adminMenu";
import Authorized from "@/utils/Authorized";
import RightContent from "@/components/GlobalHeader/RightContent";
import { getMatchMenu } from "@umijs/route-utils";
import logo from "../assets/logo.svg";
import settingsIcon from "../assets/images/settings.png";
import "@/assets/css/style.css";

const Img = (props) => {
  const { src } = props;

  let icon = src;
  if (icon === "") {
    icon = settingsIcon;
  }
  return (
    <span style={{ verticalAlign: "0px" }} className="anticon">
      <img style={{ width: "1em", height: "1em" }} alt="pic" src={icon} />
    </span>
  );
};

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} 码上云网络科技有限公司`}
    links={null}
  />
);

const BasicLayout = (props) => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loopMenuItem = (menus) => {
    console.log("menus", menus);

    return menus.map(({ icon, children, ...item }) => ({
      ...item,
      icon: <Img src={icon} />,
      children: children && loopMenuItem(children),
    }));
  };

  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: "/",
    },
  } = props;
  const menuDataRef = useRef([]);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: "user/fetchCurrent",
      });
    }
    let isUnmounted = false;

    async function featchData() {
      const result = await getAdminMenu();
      if (result.code === 1 && !isUnmounted) {
        setLoading(false);
        setMenuData(result.data);
      }
    }
    featchData();

    return () => {
      isUnmounted = true;
    };
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: "global/changeLayoutCollapsed",
        payload,
      });
    }
  }; // get children authority

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || "/", menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname]
  );
  const { formatMessage } = useIntl();
  return (
    <ProLayout
      logo={logo}
      formatMessage={false}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push("/")}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: "/",
          breadcrumbName: formatMessage({
            id: "menu.home",
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join("/")}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => defaultFooterDom}
      menu={{
        loading,
      }}
      menuDataRender={() => loopMenuItem(menuData)}
      rightContentRender={() => <RightContent />}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
