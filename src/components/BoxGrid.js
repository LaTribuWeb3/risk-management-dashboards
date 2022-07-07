import React from "react";

const BoxGrid = props => {
  const {columns=2, rows=1} = props;
  const grid = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridColumnGap: '15px',
    gridRowGap: '15px',
  }
  return (
    <div style={grid}>
      {props.children}
    </div>
  )
}

export default BoxGrid