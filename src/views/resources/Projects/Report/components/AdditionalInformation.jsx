import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../helpers/formatters";
import { ADDITIONAL_SOURCES } from "../../../../../constants/common";
import { find } from "lodash";

export const AdditionalInformation = (props) => {
  const translate = useTranslate();
  const { customRecord, counter = 1 } = props;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(counter)}.{" "}
          {translate("printForm.project_info.additional_info")}
        </h2>
        {HTML2React(customRecord.other_info)}

        {customRecord?.additional_data?.has_other_financing && (
          <>
            <p>{`Project is financed by other sources: ${find(
              ADDITIONAL_SOURCES,
              (it) =>
                it.id === customRecord?.additional_data?.other_finance_source
            )?.name || ""}`}</p>
          </>
        )}
      </div>
    </div>
  );
};
