import React from "react";

const Box = props => {
  const box = {
    width: '100%',
    minHeight: '200px',
    marginTop: 0,
    padding: '40px',
    marginBottom: 'var(--spacing)',
    height: props.height
  }
  return (
    <article style={box} aria-busy={props.loading}>
      {props.children}
    </article>
  )
}

export default Box;