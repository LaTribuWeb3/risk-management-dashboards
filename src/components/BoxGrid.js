import React from "react";

const BoxGrid = (props) => {
  const { columns = 2, rows = 1 } = props;
  const grid = {
    display: "flex",
    justifyContent: "space-between",
    gap: "var(--spacing)",
  };
  return <div style={grid}>{props.children}</div>;
};

export default BoxGrid;
