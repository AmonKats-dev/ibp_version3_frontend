import React from "react";
import {
  Create,
  Toolbar,
  SimpleForm,
  useTranslate,
  useNotify,
} from "react-admin";
import Button from "@material-ui/core/Button";
import SummaryForm from "./ProjectForms/SummaryForm";
import { checkFeature } from "../../../helpers/checkPermission";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import { makeStyles } from "@material-ui/core";
import { useFormState } from "react-final-form";

const createRedirect = (basePath, id, data) => `/projects/${data.id}/show/1`;

const useStyles = makeStyles((theme) => ({
  button: {
    margin: "0 5px",
  },
  activeStep: {
    width: "100%",
    height: 4,
    marginTop: 10,
    backgroundColor: "#3f51b5",
  },
}));

const ProjectToolbar = ({ basePath, data, record, ...props }) => {
  const translate = useTranslate();
  const showNotification = useNotify();
  const classes = useStyles();
  const { values, hasValidationErrors } = useFormState();
  const phase_id = (record && record.phase_id) || 0;

  const handleSave = () => {
    props.handleSubmitWithRedirect(props.redirect);
  };

  const handleCancel = () => {
    props.history.push("/projects");
  };

  const handleValidate = () => {
    const redirectPath = checkFeature(
      "project_create_submission_button_show",
      phase_id
    )
      ? props.redirect
      : false;

    props.handleSubmitWithRedirect(redirectPath);
    if (hasValidationErrors) {
      showNotification(
        translate("messages.project_has_validation_errors"),
        "error"
      );
    }
  };

  return (
    <Toolbar>
      <Button onClick={handleCancel}>{translate("buttons.back")}</Button>
      <Button color="primary" variant="contained" onClick={handleSave}>
        {translate("buttons.create")}
      </Button>
    </Toolbar>
  );
};

export const ProjectCreate = ({ classes, ...props }) => {
  return (
    <Create {...props}>
      <SimpleForm
        redirect={createRedirect}
        toolbar={<ProjectToolbar {...props} />}
      >
        <SummaryForm {...props} isNewProject />
      </SimpleForm>
    </Create>
  );
};

export default ProjectCreate;
