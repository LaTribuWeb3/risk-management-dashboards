import { observer } from "mobx-react";
import { removeTokenPrefix } from "../utils";

const Token = (props) => {
  let name = removeTokenPrefix(props.value);
  return <b>{name}</b>;
};

export default observer(Token);
