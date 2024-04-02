import moment from "moment";
import React, { useEffect } from "react";
import {
  Create,
  DateInput,
  FormDataConsumer,
  SelectInput,
  SimpleForm,
  TextInput,
  useTranslate,
  useDataProvider,
  BooleanInput,
  useRedirect, //Amon
  Button, //Amon
} from "react-admin";
import { QUARTERS } from "../../../constants/common";
import ArrowBackIcon from "@material-ui/icons/ArrowBack"; //Amon
import { formatValuesToQuery } from "../../../helpers/dataHelpers"; //Amon
import { getFiscalYearsRangeForIntervals } from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";
import { useDispatch } from "react-redux";
import { Typography } from "@material-ui/core";

const RiskAssessmentsCreate = (props) => {
  const [dateRange, setDateRange] = React.useState([]);
  const [details, setDetails] = React.useState([]);
  const dataProvider = useDataProvider();
  //Amon
  const [project, setProject] = React.useState(null);
  const redirect = useRedirect();

  React.useEffect(() => {
    dataProvider
      .getOne("project-details", {
        id: props.match?.params?.projectId,
      })
      .then((resp) => {
        if (resp && resp.data) {
          const { start_date, end_date } = resp.data;
          setDetails(formatValuesToQuery({ ...resp.data })); //Amon
          // setDetails(resp.data);
          setDateRange(getFiscalYearsRangeForIntervals(start_date, end_date));
        }
      });

    //Amon
    dataProvider
      .getOne("projects", {
        id: props.match?.params?.projectId,
      })
      .then((res) => {
        if (res && res.data) {
          setProject(formatValuesToQuery({ ...res.data }));
        }
      });

  }, []);

  const translate = useTranslate();
  const LEVELS = [
    {
      id: "LOW",
      name: translate(
        "resources.project_options.fields.analytical_modules.risk_evaluations.levels.low"
      ),
    },
    {
      id: "MEDIUM",
      name: translate(
        "resources.project_options.fields.analytical_modules.risk_evaluations.levels.medium"
      ),
    },
    {
      id: "HIGH",
      name: translate(
        "resources.project_options.fields.analytical_modules.risk_evaluations.levels.high"
      ),
    },
  ];

  function getTitle() {
    return (
      <h1 style={{ width: "100%"}}>
        {details &&
          details.project &&
          `${details.project.code} - ${details.project.name}`}
      </h1>
    );
  }

  return (
    <Create {...props} undoable={false}>
      <SimpleForm
        redirect={() => {
          return `/risk-assessments/${props.match?.params?.projectId}/list`;
        }}
        toolbar={
          <CustomToolbar projectDetailId={props.match?.params?.projectId} />
        }
      >
        {/* Amon */}
        <div className="float-start">
          <Button
            onClick={() => {
              redirect(
                `/implementation-module/${Number(
                  props.match?.params?.projectId
                )}/costed-annualized-plan`
              );
            }}
            label="Back"
            color="primary"
            startIcon={<ArrowBackIcon />}
            // style={{ margin: "10px 0px" }}
          />
        </div>

        {getTitle()}

        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (props.match?.params?.projectId && formData) {
              formData.project_detail_id = props.match?.params?.projectId;
            }

            return null;
          }}
        </FormDataConsumer>
        <Typography variant="h4" style={{ margin: "5px 10px 10px 10px" }}>
          Risk Monitoring
        </Typography>

        <CustomInput
          tooltipText={
            "tooltips.resources.risk_assessments.fields.has_risk_occurred"
          }
          bool
        >
          <BooleanInput
            source="has_risk_occurred"
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (props.match?.params?.projectId && formData) {
              formData.project_detail_id = props.match?.params?.projectId;
            }

            return formData.has_risk_occurred ? null : (
              <Typography variant="h4" style={{ margin: "5px 10px 10px 10px" }}>
                Additional Risk
              </Typography>
            );
          }}
        </FormDataConsumer>
        <CustomInput
          tooltipText={"tooltips.resources.risk_assessments.fields.description"}
          fullWidth
        >
          <TextInput source="description" variant="outlined" margin="none" />
        </CustomInput>

        <CustomInput
          tooltipText={"tooltips.resources.risk_assessments.fields.effects"}
          fullWidth
        >
          <TextInput source="effects" variant="outlined" margin="none" />
        </CustomInput>
        <CustomInput
          tooltipText={
            "tooltips.resources.risk_assessments.fields.mitigation_response"
          }
          fullWidth
        >
          <TextInput
            source="mitigation_response"
            variant="outlined"
            margin="none"
          />
        </CustomInput>
      </SimpleForm>
    </Create>
  );
};

export default RiskAssessmentsCreate;
