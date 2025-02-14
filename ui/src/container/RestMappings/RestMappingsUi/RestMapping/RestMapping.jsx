import * as React from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Collapse,
} from "@mui/material";
import TextField from "../../../../component/TextField/TextField";
import { useAtom } from "jotai";
import Store from "../../../../store/store";
import { cloneDeep } from "lodash";

const methods = ["GET", "POST", "PATCH", "PUT"];

function RestMapping(props) {
  const { mapping, updateRestMappings } = props;
  const [collapsed, setCollapsed] = React.useState(false);
  const [name, setName] = React.useState(mapping.name);
  const [endpoint, setEndpoint] = React.useState(mapping.endpoint);
  const [method, setMethod] = React.useState(mapping.method);
  const [requestBody, setRequestBody] = React.useState(mapping.requestBody);
  const [headers, setHeaders] = React.useState(
    JSON.stringify(mapping.headers, null, 2)
  );
  const [queryParams, setQueryParams] = React.useState(
    JSON.stringify(mapping.queryParams, null, 2)
  );
  const [restMappings] = useAtom(Store.restMappingsAtom);
  const [resolverMappings, setResolverMappings] = useAtom(
    Store.resolverMappingsAtom
  );

  const updateRestNameInResolverMappings = (oldName, newName) => {
    resolverMappings.queryResolvers
      .filter((qr) => qr.resolver.restName === oldName)
      .forEach((qr) => (qr.resolver.restName = newName));
    resolverMappings.mutationResolvers
      .filter((mr) => mr.resolver.restName === oldName)
      .forEach((mr) => (mr.resolver.restName = newName));
    resolverMappings.typeResolvers.forEach((tr) => {
      tr.keyResolvers
        .filter((kr) => kr.restName === oldName)
        .forEach((kr) => (kr.restName = newName));
    });
    setResolverMappings(cloneDeep(resolverMappings));
  };

  const onBlurHandler = () => {
    if (name !== mapping.name) {
      updateRestNameInResolverMappings(mapping.name, name);
      mapping.name = name;
    }
    mapping.endpoint = endpoint;
    mapping.method = method;
    mapping.headers = JSON.parse(headers);
    mapping.queryParams = JSON.parse(queryParams);
    mapping.requestBody = requestBody;
    updateRestMappings(restMappings);
  };

  const deleteHandler = () => {
    const index = restMappings.findIndex((e) => e.name === name);
    if (index > -1) {
      restMappings.splice(index, 1);
    }
    updateRestMappings(restMappings);
  };
  return (
    <Box sx={{ minWidth: 275, display: "flex", width: "100%" }} mt={1}>
      <Card variant="outlined" style={{ width: "100%", marginRight: "1rem" }}>
        <React.Fragment>
          <CardHeader
            title={!collapsed && name}
            titleTypographyProps={{ variant: "h8" }}
            avatar={
              collapsed && (
                <TextField
                  label="Rest Name"
                  setTo={setName}
                  value={name}
                  onBlur={onBlurHandler}
                />
              )
            }
            action={
              <IconButton
                onClick={() => setCollapsed(!collapsed)}
                aria-label="expand"
                size="small"
              >
                {collapsed ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            }
          />
          <Collapse in={collapsed} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="span" style={{ display: "flex" }}>
                <TextField
                  label="Method"
                  value={method}
                  select
                  SelectProps={{
                    native: true,
                  }}
                  setTo={setMethod}
                  onBlur={onBlurHandler}
                  style={{ maxWidth: "100px" }}
                >
                  {methods.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Endpoint"
                  value={endpoint}
                  setTo={setEndpoint}
                  onBlur={onBlurHandler}
                />
              </Typography>
              <Typography variant="span" style={{ display: "flex" }}>
                <TextField
                  label="Headers JSON"
                  value={headers}
                  setTo={setHeaders}
                  onBlur={onBlurHandler}
                  multiline
                />
                <TextField
                  label="Query Params JSON"
                  value={queryParams}
                  setTo={setQueryParams}
                  onBlur={onBlurHandler}
                  multiline
                />
              </Typography>
              {method !== "GET" && (
                <TextField
                  label="Request Body"
                  value={requestBody}
                  setTo={setRequestBody}
                  onBlur={onBlurHandler}
                  multiline
                  rows={2}
                  fullwidth
                />
              )}
            </CardContent>
          </Collapse>
        </React.Fragment>
      </Card>
      <div>
        <IconButton onClick={deleteHandler} size="medium">
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </div>
    </Box>
  );
}
RestMapping.propTypes = {
  mapping: PropTypes.object.isRequired,
  updateRestMappings: PropTypes.func,
};

export default RestMapping;
