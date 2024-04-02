import * as React from "react";

import {
  CreateButton,
  ExportButton,
  TopToolbar,
  sanitizeListRestProps,
  useListContext,
  usePermissions,
} from "react-admin";
import { cloneElement, useMemo } from "react";

import {
  checkFeature,
  checkPermission,
} from "../../../../../helpers/checkPermission";
import lodash from "lodash";
import { useSelector } from "react-redux";
import FiltersSidebar from "../../FIltersSidebar";
import { Box } from "@material-ui/core";
import FilterButton from "../../FIltersSidebar/FilterButton";

const ListActions = (props) => {
  const { className, exporter, filters, maxResults, ...rest } = props;
  const { permissions } = usePermissions();
  const { resource, displayedFilters, filterValues, basePath, showFilter } =
    useListContext();
  const userInfo = useSelector((state) => state.user.userInfo);
  const appConfig = useSelector((state) => state.app.appConfig);

  function hasCreateButton() {
    if (appConfig) {
      const maxLevel = lodash.max(lodash.keys(appConfig.organizational_config));
      const hasMaxLevelRule = checkFeature("has_pimis_fields")
        ? true
        : Number(userInfo.organization.level) === Number(maxLevel);

      if (
        userInfo &&
        userInfo.organization &&
        hasMaxLevelRule &&
        checkPermission(permissions, "create_project") &&
        !props.disableCreate
      ) {
        return true;
      }
    }

    return false;
  }

  return (
    <Box width="100%">
      <TopToolbar
        className={className}
        {...sanitizeListRestProps(rest)}
        style={{
          display: "flex",
          alignItems: "end",
          paddingTop: "15px !important",
        }}
      >
        {filters &&
          cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: "button",
          })}
        {hasCreateButton() && <CreateButton basePath={basePath} />}
        <ExportButton />
        {checkFeature("has_filter_panel") && <FilterButton />}
      </TopToolbar>
      {checkFeature("has_filter_panel") && <FiltersSidebar {...props} />}
    </Box>
  );
};

export default ListActions;
