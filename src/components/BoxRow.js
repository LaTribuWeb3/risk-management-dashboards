import React from "react";

const boxRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
  paddingBottom: '10px',
  borderBottom: '1px solid rgba(120, 120, 120, 0.1)'
}

const BoxRow = props => {
  return (
    <div style={boxRowStyle}>
      {props.children}
    </div>
  )
}

export default BoxRow;