import React, { useEffect, useMemo } from "react";
import {
  ArrayInput,
  FormDataConsumer,
  ReferenceInput,
  required,
  SelectInput,
  SimpleFormIterator,
  useTranslate,
} from "react-admin";
import {
  checkFeature,
  useChangeField,
} from "../../../../helpers/checkPermission";
import useCheckFeature from "../../../../hooks/useCheckFeature";
import OrganisationalStructure from "../../OrganisationalStructure";
import { useFormState } from "react-final-form";
import CustomInput from "../../../components/CustomInput";
import { DEFAULT_SORTING } from "../../../../constants/common";

function ImplementingAgencies(props) {
  const translate = useTranslate();
  const formValues = useFormState().values;
  const { record } = props;
  const hasMultipleImplementingAgencies = useCheckFeature(
    "project_implementing_agencies_multiple"
  );
  const hasDefaultArrayInputValue = useCheckFeature(
    "has_default_array_input_value"
  );
  const changeAgencies = useChangeField({ name: "implementing_agencies" });

  useMemo(() => {
    if (
      (!hasMultipleImplementingAgencies || hasDefaultArrayInputValue) &&
      formValues &&
      formValues.implementing_agencies &&
      formValues.implementing_agencies.length === 0
    ) {
      changeAgencies([{}]);
    }
  }, [record]);

  if (!record || (record && !record.phase_id)) return null;

  //FEATURE: project has multiple implementing agencies
  return (
    <ArrayInput
      source={"implementing_agencies"}
      label={translate(
        "resources.project-details.fields.implementing_agencies"
      )}
    >
      <SimpleFormIterator
        disableAdd={!hasMultipleImplementingAgencies}
        disableRemove={!hasMultipleImplementingAgencies}
      >
        <FormDataConsumer>
          {({ formData, scopedFormData, getSource, ...rest }) => {
            return checkFeature("has_pimis_fields") ? (
                <OrganisationalStructure
                  {...props}
                  source={getSource("organization_id")}
                  title="Implementing Agencies"
                  config="organizational_config"
                  reference="organizations"
                  field={getSource("organization")}
                  level={4}
                />
            ) : (
              <OrganisationalStructure
                {...props}
                source={getSource("organization_id")}
                title="Implementing Agencies"
                config="organizational_config"
                reference="organizations"
                field={getSource("organization")}
                level={checkFeature("has_esnip_fields") ? 4 : 2}
              />
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
}

export default ImplementingAgencies;
