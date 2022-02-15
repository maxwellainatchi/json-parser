import React, { useState } from "react";
import JSONValue from "../utility/jsonValue";
import { Checkbox, Collapse, Grid, Text } from "@nextui-org/react";

const SetJsonRoot: React.FC<{
  json: JSONValue;
  onSelect?: (value: JSONValue) => void;
}> = ({ json }) => {
  let [root, setRoot] = useState(".");

  if (typeof json === "object" && json) {
    let entries = Object.entries(json);
    return (
      <Collapse.Group>
        {entries.map(([name, value]) => {
          let isObject = typeof value === "object" && value;
          return (
            <Collapse
              key={name}
              contentLeft={<Checkbox />}
              title={isObject ? name : `${name}: ${value}`}
              disabled={!isObject}
              arrowIcon={!isObject ? <span /> : undefined}
            >
              {isObject ? <SetJsonRoot json={value} /> : null}
            </Collapse>
          );
        })}
      </Collapse.Group>
    );
  }

  return (
    <Grid.Container>
      <Grid>
        <Text>{`${json}`}</Text>
      </Grid>
    </Grid.Container>
  );
};

export default SetJsonRoot;
