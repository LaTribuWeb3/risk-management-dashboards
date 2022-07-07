import React from "react";

const Box = props => {
  const box = {
    width: '100%',
    minHeight: '200px'
  }
  return (
    <article style={box} aria-busy={props.loading}>
      {props.children}
    </article>
  )
}

export default Box;