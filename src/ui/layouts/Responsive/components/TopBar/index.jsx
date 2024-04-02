import {
  Badge,
  Button,
  Divider,
  Link,
  MenuItem,
  Select,
  Tooltip,
} from "@material-ui/core";
import { Notification, userLogout, useTranslate } from "react-admin";
import React, { forwardRef } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import IconWithMenu from "../IconWithMenu";
import InputIcon from "@material-ui/icons/Input";
import MenuIcon from "@material-ui/icons/Menu";
import MobileActions from "../../MobileActions";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import PersonIcon from "@material-ui/icons/Person";
import PropTypes from "prop-types";
import RoleSwitch from "../../../../../views/components/RoleSwitch";
import { NavLink as RouterLink } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { connect } from "react-redux";
import { useAuthProvider } from "react-admin";
import { useDispatch } from "react-redux";
import NotificationsAction from "./NotificationIcon";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../../helpers/checkPermission";
import { RELEASE_VERSION } from "../../../../../constants/config";

const drawerWidth = 205;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& .MuiToolbar-regular": {
      minHeight: checkFeature("has_pimis_fields") ? 58 : 64,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0px -5px 5px -5px rgba(34, 60, 80, 0.6) inset",
    },
  },
  // drawer: {
  //   [theme.breakpoints.up("md")]: {
  //     width: drawerWidth,
  //     flexShrink: 0,
  //   },
  // },
  appBar: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    boxShadow: "none",
    backgroundColor: "#fff",
    color: "#576065",
    borderBottom: "1px solid #eeeeee",
    zIndex: 10,
  },
  appBarClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${theme.spacing(8) + 1}px)`,
      marginLeft: theme.spacing(8) + 1,
    },
  },
  appBarActions: {
    // position: "absolute",
    right: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

function TopBar(props) {
  const classes = useStyles();
  const auth = useAuthProvider();
  const dispatch = useDispatch();
  const checkPermission = useCheckPermissions();
  const translate = useTranslate();

  const { className, onSidebarOpen, userLogout, ...rest } = props;

  const handleSignOut = () => {
    userLogout();
  };

  const handleRoleSwitch = (role_id) => {
    auth.switchRole({ role_id, success: dispatch });
  };

  function generateMenu() {
    const MENU = [];

    if (checkPermission("edit_profile")) {
      MENU.push({ title: "Profile", className: "title", disabled: true });
      MENU.push({
        icon: <HelpOutlineIcon fontSize="small" />,
        component: (
          <a href={`#/users/${props.user ? props.user.id : ""}`}>
            Edit Profile
          </a>
        ),
      });
    }
    if (checkPermission("view_profile") && !checkPermission("edit_profile")) {
      MENU.push({ title: "Profile", className: "title", disabled: true });
      MENU.push({
        icon: <HelpOutlineIcon fontSize="small" />,
        component: (
          <a href={`#/users/${props.user ? props.user.id : ""}/show`}>
            View Profile
          </a>
        ),
      });
    }

    // if (checkPermission("edit_vacations")){
    //   MENU.push({
    //     icon: <HelpOutlineIcon fontSize="small" />,
    //     component: <a href={`#/vacations`}>Edit Vacations</a>,
    //   })
    // }

    // if (checkPermission("user_role_select")){
    MENU.push({ title: "Role", className: "title", disabled: true });
    MENU.push({
      component:
        props.user && props.user.current_role ? (
          <RoleSwitch
            onSelect={handleRoleSwitch}
            roles={props.user.user_roles}
            currentRole={props.user.current_role.role_id}
          />
        ) : null,
    });
    // }

    MENU.push({
      icon: <InputIcon fontSize="small" />,
      title: "Sign Out",
      onClick: handleSignOut,
    });

    if (checkFeature("has_pimis_fields")) {
      MENU.push({
        title: `release v${RELEASE_VERSION}`,
        className: "title",
        disabled: true,
      });
    }

    return MENU;
  }

  function renderTitle() {
    if (checkFeature("has_pimis_fields")) {
      return props.location &&
        (props.location.indexOf("project-details") > -1 ||
          props.location.indexOf("expenditure") > -1 ||
          props.location.indexOf("gfms_data") > -1 ||
          props.location.indexOf("cost-plans") > -1 ||
          props.location.indexOf("projects") > -1 ||
          props.location.indexOf("project-indicators") > -1 ||
          props.location.indexOf("project-management") > -1) &&
        props.headerTitle
        ? props.headerTitle
        : "Public Investment Management Information System";
    }
    if (checkFeature("has_esnip_fields")) {
      return "Subsistema Nacional de Investimentos Públicos";
    }

    return props.headerTitle
      ? props.headerTitle
      : "Integrated Bank of Projects";
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarClose]: !props.opened,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => props.onMobileOpen(!props.mobileOpened)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              width: "70%",
              marginRight: 15,
            }}
          >
            <Typography variant="h3" noWrap>
              {renderTitle()}
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {checkFeature("has_pimis_fields") && (
              <Typography
                variant="caption"
                style={{
                  color: "#546e7a",
                }}
              >
                {`Logged in as ${
                  props.user &&
                  props.user.current_role &&
                  props.user.current_role.role.name
                }`}
              </Typography>
            )}
            {checkFeature("has_topbar_information_block") && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p style={{ margin: "1px 0px", fontSize: 10 }}>
                  Phone: <a href="tel:0414707386"> 0414707386 </a>
                </p>
                <p style={{ margin: "1px 0px", fontSize: 10 }}>
                  Email:
                  <a href="mailto:ibpsupport@finance.go.ug">
                    ibpsupport@finance.go.ug
                  </a>
                </p>
              </div>
            )}
            <div className={classes.appBarActions}>
              <Hidden xsDown implementation="css">
                <div style={{ display: "flex" }}>
                  <NotificationsAction />
                  <Tooltip
                    title={translate("tooltips.help")}
                    placement="bottom"
                  >
                    <IconButton color="inherit">
                      <Link
                        href={
                          checkFeature("has_pimis_fields")
                            ? "#"
                            : "http://ibp-help.torusline.com/"
                        }
                        target="_blank"
                        underline="none"
                      >
                        <HelpOutlineIcon fontSize="small" />
                      </Link>
                    </IconButton>
                  </Tooltip>

                  <IconWithMenu
                    icon={
                      <Tooltip
                        title={translate("tooltips.user_actions")}
                        placement="bottom"
                      >
                        <PersonIcon />
                      </Tooltip>
                    }
                    menu={generateMenu()}
                  />
                </div>
              </Hidden>
              <Hidden smUp implementation="css">
                <MobileActions />
              </Hidden>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) => ({
  ui: state.ui,
  user: state.user.userInfo,
  location: state.router.location.pathname,
});

const mapDispatchToProps = (state) => ({
  ui: state.ui,
  user: state.user.userInfo,
});

export default connect(mapStateToProps, { userLogout })(TopBar);
