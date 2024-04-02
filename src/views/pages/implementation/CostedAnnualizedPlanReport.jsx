// in src/Dashboard.js
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CancelIcon from "@material-ui/icons/Cancel";
import LocalAtmOutlinedIcon from "@material-ui/icons/LocalAtmOutlined";
import SaveIcon from "@material-ui/icons/Save";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import moment from "moment";
import * as React from "react";
import {
  useCreate,
  useDataProvider,
  useNotify,
  useRedirect,
  useTranslate,
} from "react-admin";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import AccessibilityIcon from "@material-ui/icons/Accessibility";
import GavelIcon from "@material-ui/icons/Gavel";
import WarningIcon from "@material-ui/icons/Warning";
import PeopleIcon from "@material-ui/icons/People";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { orderBy } from "lodash";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    textAlign: "center",
    fontSize: "18px",
    lineHeight: "24px",
    margin: "10px 30px",
    color: "#3f50b5",
  },
  button: {
    backgroundColor: "#f4f8ff",
    color: "#3f50b5",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
    width: 200,
    height: 200,
    borderRadius: "4px",
    margin: 15,
    textAlign: "center",
    "&:hover": {
      outline: "1px solid #d0d7ff",
      cursor: "pointer",
    },
    "&:hover > $buttonTitle": {
      // display: "none",
      opacity: 0.5,
    },
    "&:hover > $actions": {
      display: "flex",
    },
  },
  buttonTitle: {
    color: "#3f50b5",
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    fontWeight: "bold",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    height: "100%",
    width: "100%",
    justifyContent: "center",

    gap: "15px",
    "& > * ": {
      fontSize: "18px",
    },
  },
  actions: {
    display: "none",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  actionBtn: {
    width: "100%",
  },
}));

function CostedAnnualizedPlanReport(props) {
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const [resources, setResources] = React.useState([]);
  // const [costPlans, setCostPlans] = React.useState([]);
  const [showYearSelector, setShowYearSelector] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(null);
  const [details, setDetails] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [currentRes, setCurrentRes] = React.useState(null);

  const [createCostPlans] = useCreate("cost-plans");
  const [createRiskAssessments] = useCreate("risk-assessments");
  const [createStakeholders] = useCreate("stakeholder-engagements");
  const [createHumanResources] = useCreate("human-resources");

  const redirectTo = useRedirect();
  const notify = useNotify();

  React.useEffect(() => {
    const resources = [
      "cost-plans",
      "risk-assessments",
      "stakeholder-engagements",
      "human-resources",
    ];

    resources.forEach((resource) => {
      dataProvider
        .getListOfAll(resource, {
          sort_field: "id",
          filter: { project_detail_id: Number(props.match?.params?.id) },
        })
        .then((resp) => {
          if (resp && resp.data) {
            setResources((prev) => ({ ...prev, [resource]: resp.data }));
          }
        });
    });

    dataProvider
      .getOne("project-details", {
        id: Number(props.match?.params?.id),
      })
      .then((response) => {
        if (response && response.data) {
          setDetails(response.data);

          dataProvider
            .getListOfAll("appeals", {
              sort_field: "id",
              filter: { project_id: Number(response.data?.project_id) },
            })
            .then((resp) => {
              if (resp && resp.data) {
                setResources((prev) => ({ ...prev, appeals: resp.data }));
              }
            });

          dataProvider
            .getOne("projects", {
              id: Number(response.data.project_id),
            })
            .then((res) => {
              if (res && res.data) {
                setProject(res.data);
              }
            });
        }
      });

    setSelectedYear(getYearsFromCurrent()[0].id);
  }, []);

  const handleCreateCostPlans = () => {
    dataProvider
      .getOne("project-details", {
        id: Number(props.match?.params?.id),
      })
      .then((response) => {
        if (response && response.data) {
          const formattedActivities = response.data.activities.map((item) => {
            item.activity_id = item.id;
            delete item.id;
            return item;
          });

          createCostPlans(
            {
              payload: {
                data: {
                  year: Number(selectedYear),
                  project_detail_id: Number(props.match?.params?.id),
                  cost_plan_activities: [...formattedActivities],
                  cost_plan_items: [],
                },
              },
            },
            {
              onSuccess: ({ data: newRecord }) => {
                notify("New Report Created", {});
                redirectTo(`/cost-plans/${newRecord.id}`);
              },
            }
          );
        }
      });
  };

  const getLatestCostPlan = () => {
    const filtered = orderBy(resources["cost-plans"], "id").filter(
      (item) => Number(item.year) === Number(selectedYear)
    );

    return filtered.length ? filtered[0].id : null;
  };

  function renderButtons(resource) {
    if (resources[resource] && resources[resource].length > 0) {
      return [
        <Button
          className={classes.actionBtn}
          variant="contained"
          color="primary"
          onClick={() => {
            if (resource === "cost-plans") {
              setCurrentRes(resource);
              if (getLatestCostPlan()) {
                redirectTo(`/cost-plans/${getLatestCostPlan()}`);
              } else {
                handleCreateCostPlans();
              }
            } else if (resource === "risk-assessments") {
              setCurrentRes(resource);
              redirectTo(
                `/risk-assessments/${Number(props.match?.params?.id)}/list`
              );
            } else if (resource === "stakeholder-engagements") {
              setCurrentRes(resource);
              redirectTo(
                `/stakeholder-engagements/${Number(
                  props.match?.params?.id
                )}/list`
              );
            } else if (resource === "appeals") {
              setCurrentRes(resource);
              redirectTo(`/appeals/${Number(props.match?.params?.id)}/list`);
            } else {
              redirectTo(
                `/${resource}/${Number(props.match?.params?.id)}/create`
              );
            }
          }}
        >
          {resource === "risk-assessments" ||
          resource === "stakeholder-engagements" ||
          resource === "appeals"
            ? "Manage"
            : "Update"}
        </Button>,
        resource !== "appeals" && (
          <Button
            className={classes.actionBtn}
            variant="contained"
            onClick={() => {
              if (resource === "cost-plans") {
                if (getLatestCostPlan()) {
                  redirectTo(`/cost-plans/${getLatestCostPlan()}/show`);
                }
              } else {
                redirectTo(
                  `/${resource}/${Number(props.match?.params?.id)}/report`
                );
              }
            }}
          >
            View Report
          </Button>
        ),
      ];
    }

    return (
      <Button
        className={classes.actionBtn}
        variant="contained"
        color="primary"
        onClick={() => {
          switch (resource) {
            case "cost-plans":
              if (!getLatestCostPlan()) {
                handleCreateCostPlans();
              }

              setCurrentRes(resource);
              break;
            case "myc":
              details &&
                details.project_id &&
                redirectTo(`/${resource}/${Number(details.project_id)}/create`);
              break;
            case "project-management":
              details &&
                details.project_id &&
                redirectTo(
                  `/project-management/${project.project_management?.id}`
                );
              break;
            default:
              redirectTo(
                `/${resource}/${Number(props.match?.params?.id)}/create`
              );
              break;
          }
        }}
      >
        {resource === "myc" || resource === "project-management"
          ? "Edit"
          : "Create"}
      </Button>
    );
  }

  function getYearsFromCurrent() {
    const currentYear = moment().startOf("year");
    const nextYear = currentYear.clone().add(1, "years");

    return [
      {
        id: moment(getFiscalYearValueFromYear(currentYear).id).format("YYYY"),
        name: getFiscalYearValueFromYear(currentYear).name,
      },
      {
        id: moment(getFiscalYearValueFromYear(nextYear).id).format("YYYY"),
        name: getFiscalYearValueFromYear(nextYear).name,
      },
    ];
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button
          onClick={() => {
            setShowYearSelector(false);
          }}
          label="Back"
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          style={{ margin: "10px 0px" }}
          href="#/implementation-module"
        >
          Back
        </Button>
        <Card>
          <Typography variant="h2" style={{ margin: "30px 40px 0px" }}>
            {details &&
              details.project &&
              `${details.project.code} - ${details.project.name}`}
          </Typography>
          <Box display={"flex"}>
            <Box
              display={"flex"}
              style={{
                justifyContent: "flex-start",
                flexWrap: "wrap",
                padding: "25px",
                width: "100%",
              }}
            >
              <Paper variant="outlined" square className={classes.button}>
                <div className={classes.buttonTitle}>
                  <Typography className={classes.title}>
                    Costed Annualized Plan
                  </Typography>
                  <LocalAtmOutlinedIcon
                    fontSize="large"
                    style={{ fontSize: 65 }}
                  />
                </div>

                <div className={classes.actions}>
                  {renderButtons("cost-plans")}
                </div>
              </Paper>

              <Paper variant="outlined" square className={classes.button}>
                <div className={classes.buttonTitle}>
                  <Typography className={classes.title}>
                    Project management tool kit
                  </Typography>
                  <HomeWorkIcon fontSize="large" style={{ fontSize: 65 }} />
                </div>

                <div className={classes.actions}>
                  {renderButtons("project-management")}
                </div>
              </Paper>

              <Paper variant="outlined" square className={classes.button}>
                <div className={classes.buttonTitle}>
                  <Typography className={classes.title}>
                    Multi-Year Commitments (MYC)
                  </Typography>
                  <AccountBalanceIcon
                    fontSize="large"
                    style={{ fontSize: 65 }}
                  />
                </div>
                <div className={classes.actions}>{renderButtons("myc")}</div>
              </Paper>

              <Paper variant="outlined" square className={classes.button}>
                <div className={classes.buttonTitle}>
                  <Typography className={classes.title}>
                    Appeals / Change Request
                  </Typography>
                  <GavelIcon fontSize="large" style={{ fontSize: 65 }} />
                </div>
                <div className={classes.actions}>
                  {renderButtons("appeals")}
                </div>
              </Paper>

              <Paper variant="outlined" square className={classes.button}>
                <div className={classes.buttonTitle}>
                  <Typography className={classes.title}>
                    Risk Assessment
                  </Typography>
                  <WarningIcon fontSize="large" style={{ fontSize: 65 }} />
                </div>
                <div className={classes.actions}>
                  {renderButtons("risk-assessments")}
                </div>
              </Paper>

              <Paper variant="outlined" square className={classes.button}>
                <div className={classes.buttonTitle}>
                  <Typography className={classes.title}>
                    Stakeholder Engagement
                  </Typography>
                  <PeopleIcon fontSize="large" style={{ fontSize: 65 }} />
                </div>
                <div className={classes.actions}>
                  {renderButtons("stakeholder-engagements")}
                </div>
              </Paper>

              <Paper variant="outlined" square className={classes.button}>
                <div className={classes.buttonTitle}>
                  <Typography className={classes.title}>
                    Human Resources management
                  </Typography>
                  <AccessibilityIcon
                    fontSize="large"
                    style={{ fontSize: 65 }}
                  />
                </div>
                <div className={classes.actions}>
                  {renderButtons("human-resources")}
                </div>
              </Paper>
            </Box>
          </Box>
        </Card>
      </Grid>
      {/* {showYearSelector && (
        <Dialog
          fullWidth
          maxWidth={"xs"}
          open={showYearSelector}
          onClose={() => {
            setShowYearSelector(false);
          }}
          style={{ overflow: "hidden" }}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle>Create</DialogTitle>
          <DialogContent>
            <InputLabel style={{ marginBottom: 5 }}>
              {"Select Fiscal Year"}
            </InputLabel>
            <Select
              fullWidth
              variant="outlined"
              value={selectedYear}
              onChange={handleChange}
            >
              {getYearsFromCurrent() &&
                getYearsFromCurrent().map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowYearSelector(false);
              }}
              label="Cancel"
              variant="outlined"
              color="primary"
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!selectedYear}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      )} */}
    </Grid>
  );
}

export default CostedAnnualizedPlanReport;
