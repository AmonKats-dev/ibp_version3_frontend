import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { forwardRef } from "react";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../../helpers/checkPermission";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import lodash from "lodash";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { Button } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Collapse } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import { NavLink as RouterLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import cn from "classnames";
import jm from "../../../../../jm_navigation";
import ug from "../../../../../ug_navigation";
import { useSelector, useDispatch } from "react-redux";
import { useTranslate } from "react-admin";

const drawerWidth = 205;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    zIndex: 1,
  },
  drawerPaper: {
    backgroundColor: checkFeature("has_pimis_fields")
      ? theme.palette.background.sidebar_jm
      : theme.palette.background.sidebar,
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    overflow: "visible",
  },
  logo: {
    padding: 14,
    background: "#fff",
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    width: 35,
    height: 35,
    marginRight: 15,
  },
  logoImagePimis: {
    width: 35,
    height: 20,
    marginRight: 15,
  },
  drawerFooter: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: checkFeature("has_pimis_fields")
      ? theme.palette.background.sidebar_jm
      : theme.palette.background.sidebar,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(8) + 1,
    [theme.breakpoints.down("md")]: {
      width: theme.spacing(8) + 1,
    },
    "& $navItem": {
      overflow: "visible",
    },
  },
  menuWrapper: {
    height: "calc(100vh - 130px)",
  },
  menuWrapperScrolled: {
    height: "calc(100vh - 130px)",
    overflow: "auto",
  },
  overflow: {
    // overflow: "auto",
  },
  menuList: {
    // height: "65vh",
  },
  secondLevelGroup: {
    // background: "#2f3539",
    backgroundColor: checkFeature("has_pimis_fields")
      ? theme.palette.background.sidebar_jm
      : theme.palette.background.sidebar,
    position: "absolute",
    left: "calc(100%)",
    borderLeft: "1px solid #fff",
    bottom: 0,
    opacity: 0,
    width: 255,
    display: "flex",
    flexDirection: "column",
    visibility: "hidden",
    // bottom: "-100%",
    transition: theme.transitions.create("opacity", {
      easing: theme.transitions.easing.easeInOut,
      duration: "450ms",
    }),
  },
  lastLevelGroup: {
    bottom: "calc(100% - 40vh)",
  },

  subNavItem: {
    display: "block",
    paddingTop: "4px",
    paddingBottom: "4px",
  },

  navItem: {
    position: "relative",

    "&:hover > $secondLevelGroup": {
      visibility: "visible",
      zIndex: 9999,
      opacity: 1,
    },
    "&:hover": {
      background: "rgb(255 255 255 / 0.05) !important",
    },

    "& .MuiListItemIcon-root": {
      color: "#fff !important",
      minWidth: 50,
    },
    "& .MuiListItemText-root span": {
      color: "#fff !important",
      textTransform: "none",
      whiteSpace: "normal",
      lineHeight: "16px",
    },
  },
  groupItem: {
    "& > *": {
      color: "#a5a5a5",
      lineHeight: "10px",
    },
  },
  navItemActive: {
    backgroundColor: "rgb(255 255 255 / 0.25) !important",
  },
  button: {
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    fontWeight: theme.typography.fontWeightMedium,
    padding: "2px 8px",
  },
  active: {
    backgroundColor: "#707070",
    fontWeight: theme.typography.fontWeightBold,
    "& $icon": {
      color: theme.palette.primary.main,
    },
  },
  subLevel: {
    paddingLeft: theme.spacing(3),
  },
}));

function SidebarPimis(props) {
  const classes = useStyles();
  const translate = useTranslate();
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const checkPermission = useCheckPermissions();
  const appConfig = useSelector((state) => state.app.appConfig);
  const appPrefix = appConfig.application_config.prefix;
  const dispatch = useDispatch();

  const link = window && window.location && window.location.hash.split("/")[1];
  const handleDrawerOpen = () => {
    props.onOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    props.onCloseDrawer(false);
  };

  const { className, onSidebarOpen, userLogout, ...rest } = props;

  const handleDrawerToggle = () => {
    props.onMobileOpen(!props.mobileOpened);
  };

  const CustomRouterLink = forwardRef((props, ref) => (
    <div ref={ref} style={{ flexGrow: 1 }}>
      <RouterLink {...props} target="_self" />
    </div>
  ));

  function renderMenuPimis(items, level, subLevel) {
    return items
      .filter((page) => checkPermission(page.permission))
      .filter((page) => (page.feature ? checkFeature(page.feature) : true))
      .filter((page) => page.title)
      .map((page, idx) => (
        <ListItem
          key={page.title + "" + idx}
          className={clsx(classes.navItem, {
            [classes.subNavItem]: level,
            [classes.active]:
              (page.href && page.href === "/" + link) ||
              (page.children &&
                lodash.find(
                  page.children,
                  (child) => child.href && child.href === "/" + link
                )),
          })}
          disableGutters
        >
          <Button
            activeclassname={classes.navItemActive}
            className={clsx(classes.button, {
              [classes.subLevel]: level,
            })}
            component={page.href && CustomRouterLink}
            to={page.href}
          >
            <ListItemIcon>{page.icon}</ListItemIcon>
            {props.opened ? (
              <ListItemText
                primary={
                  page.translation ? translate(page.translation) : page.title
                }
                style={{ textAlign: "left" }}
              />
            ) : (
              subLevel && (
                <ListItemText
                  primary={
                    page.translation ? translate(page.translation) : page.title
                  }
                  style={{ textAlign: "left" }}
                />
              )
            )}
          </Button>
          {page.children && (
            <div
              className={clsx(
                classes.secondLevelGroup,
                page.level === 3 &&
                  page.children.length > 3 &&
                  classes.lastLevelGroup
              )}
            >
              {renderMenuPimis(page.children, true, true)}
            </div>
          )}
        </ListItem>
      ));
  }

  function renderMenu(items, level) {
    return items
      .filter((page) => checkPermission(page.permission))
      .filter((page) => (page.feature ? checkFeature(page.feature) : true))
      .map((page, idx) => (
        <ListItem
          className={classes.navItem}
          disableGutters
          key={page.title + "" + idx}
        >
          <Button
            activeclassname={classes.navItemActive}
            className={clsx(classes.button, {
              [classes.subLevel]: level,
            })}
            component={CustomRouterLink}
            to={page.href}
          >
            <ListItemIcon>{page.icon}</ListItemIcon>
            <ListItemText
              primary={
                page.translation ? translate(page.translation) : page.title
              }
            />
          </Button>
        </ListItem>
      ));
  }

  const handleClick = (href) => () => {
    if (href === menuOpen) {
      setMenuOpen(false);
    } else {
      setMenuOpen(href);
    }
  };

  const renderTitle = () => {
    switch (appPrefix) {
      case "ug":
        return { full: "IBP", short: "I" };
      case "mzb":
        return { full: "ESNIP", short: "E" };
      case "jm":
        return { full: "PIMIS", short: "P" };
      default:
        return "";
    }
  };

  const getNavigationMenu = () => {
    switch (appPrefix) {
      case "ug":
        return ug;
      case "mzb":
        return ug;
      case "jm":
        return jm;
      default:
        return ug;
    }
  };

  const drawer = (
    <div>
      <div className={classes.logo}>
        <img
          alt="Logo"
          src={`/assets/images/${appPrefix}/${
            checkFeature("has_pimis_fields") ? "logo" : "coat_of_arms"
          }.png`}
          className={clsx(
            classes.logoImage,
            checkFeature("has_pimis_fields") && classes.logoImagePimis
          )}
        />

        {props.opened && (
          <Typography variant="h3" noWrap>
            {props.opened ? renderTitle().full : renderTitle().short}
          </Typography>
        )}
      </div>

      <Divider />

      <div
        className={clsx(classes.menuWrapper, {
          [classes.menuWrapperScrolled]: !checkFeature("has_pimis_fields"),
        })}
      >
        {checkFeature("has_pimis_fields") && <br />}
        <List className={classes.menuList} bulkActionButtons={false}>
          {getNavigationMenu()
            .filter((page) => checkPermission(page.permission))
            .filter((page) =>
              page.feature ? checkFeature(page.feature) : true
            )
            .map((page, idx) => {
              if (page.children) {
                return (
                  <div key={page.title + "" + idx}>
                    {checkFeature("has_pimis_fields") && (
                      <>
                        <ListItem
                          className={clsx(classes.navItem, {
                            [classes.active]:
                              page.href && page.href.indexOf(link) > -1,
                          })}
                          disableGutters
                          key={page.title}
                          style={{
                            paddingLeft: 10,
                            // borderBottom: "1px solid #7c7c7c",
                            fontSize: 10,
                          }}
                        >
                          <ListItemText
                            secondary={
                              !props.opened
                                ? page.title?.split(" ")[0]
                                : page.title
                            }
                            style={{ textAlign: "left", fontSize: 10 }}
                            className={classes.groupItem}
                          />
                        </ListItem>
                        {renderMenuPimis(page.children, true)}
                      </>
                    )}
                    {!checkFeature("has_pimis_fields") && (
                      <>
                        <ListItem
                          className={clsx(classes.navItem, {
                            [classes.active]:
                              page.href && page.href.indexOf(link) > -1,
                          })}
                          disableGutters
                          key={page.title + "" + idx}
                        >
                          <Button
                            activeclassname={classes.navItemActive}
                            className={classes.button}
                            onClick={handleClick(page.href)}
                          >
                            <ListItemIcon>{page.icon}</ListItemIcon>
                            <ListItemText
                              primary={page.title}
                              style={{ textAlign: "left" }}
                            />
                            {menuOpen !== page.href ? (
                              <ExpandMore
                                onClick={handleClick(page.href)}
                                style={{ color: "#fff" }}
                              />
                            ) : (
                              <ExpandLess
                                onClick={handleClick()}
                                style={{ color: "#fff" }}
                              />
                            )}
                          </Button>
                        </ListItem>
                        <Collapse
                          in={menuOpen === page.href}
                          timeout="auto"
                          unmountOnExit
                        >
                          {renderMenu(page.children, true)}
                        </Collapse>
                      </>
                    )}
                  </div>
                );
              }
              return (
                <ListItem
                  className={clsx(classes.navItem, {
                    [classes.active]: page.href && page.href.indexOf(link) > -1,
                  })}
                  disableGutters
                  key={page.title + "" + idx}
                >
                  <Button
                    activeclassname={classes.navItemActive}
                    className={classes.button}
                    component={CustomRouterLink}
                    to={page.href}
                    onClick={() => {
                      checkFeature("has_pimis_fields") &&
                        dispatch({
                          type: "SET_PROJECT_TITLE_HEADER",
                          payload: {
                            data: "",
                          },
                        });
                    }}
                  >
                    <ListItemIcon>{page.icon}</ListItemIcon>
                    <ListItemText primary={page.title} />
                  </Button>
                </ListItem>
              );
            })}
        </List>
      </div>
      <Hidden smDown implementation="css">
        <div className={classes.drawerFooter}>
          <IconButton
            onClick={props.opened ? handleDrawerClose : handleDrawerOpen}
          >
            {props.opened ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
      </Hidden>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav aria-label="mailbox folders">
        <Hidden mdDown implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={props.mobileOpened}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: props.opened,
              [classes.drawerClose]: !props.opened,
            })}
            classes={{
              paper: clsx(classes.drawerPaper, {
                [classes.drawerOpen]: props.opened,
                [classes.drawerClose]: !props.opened,
              }),
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default SidebarPimis;
