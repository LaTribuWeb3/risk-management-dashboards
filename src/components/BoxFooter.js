import moment from "moment";
import { observer } from "mobx-react";

const BoxFooter = (props) => {
  const time = props.time
    ? "last updated " + moment(parseInt(1000 * props.time)).fromNow()
    : "";

    const update = moment(props.time);
    const now = moment()
    const duration = moment.duration(now.diff(update));
//Get Days and subtract from duration
const days = duration.days();
duration.subtract(days, 'days');

//Get hours and subtract from duration
const hours = duration.hours();
duration.subtract(hours, 'hours');

//Get Minutes and subtract from duration
const minutes = duration.minutes();
duration.subtract(minutes, 'minutes');

//Get seconds
const seconds = duration.seconds();
console.log('days', days)
console.log('hours', hours)
console.log('minutes', minutes)
console.log('seconds', seconds)

  const text = props.text || "";
  return (
    <div
      style={{
        color: "var(--muted-color)",
        display: "flex",
        justifyContent: "right",
        alignItems: "center",
        width: "100%",
        paddingTop: "calc(var(--spacing) * 2)",
      }}
    >
      <small>last updated {days ? days + " days, ": ""} {hours ? hours + " hours, " : ""}{minutes ? minutes + " minutes, " : ""} {seconds ? seconds + " seconds ago" : ""}</small>
    </div>
  );
};

export default observer(BoxFooter);
