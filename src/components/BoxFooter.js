import moment from "moment";
import { observer } from "mobx-react";

const BoxFooter = (props) => {
  if (props.time) {
    const update = moment(parseInt(1000 * props.time));
    const updateDate = new Date(parseInt(1000 * props.time)).toLocaleString()  
    const now = moment();
    const duration = moment.duration(now.diff(update));
    console.log('original timestamp', props.time)
    console.log('update', update)
    console.log('now', now)
    console.log('duration', duration)
    //Get Days and subtract from duration
    const days = duration.days();
    duration.subtract(days, "days");
    const dayStr = days ? (days + " day" + (days > 1 ? "s," : ",") ) : ""

    //Get hours and subtract from duration
    const hours = duration.hours();
    duration.subtract(hours, "hours");
    const hourStr = days ? (hours + " hour" + (hours > 1 ? "s," : ",") ) : ""

    //Get Minutes and subtract from duration
    const minutes = duration.minutes();
    duration.subtract(minutes, "minutes");
    const minuteStr = minutes ? (minutes + " minute" + (minutes > 1 ? "s," : ",") ) : ""

    //Get seconds
    const seconds = duration.seconds();
    const secondStr = seconds ? (seconds + " second" + (seconds > 1 ? "s" : "")) : ""

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
        <small title={updateDate} >
          last updated {dayStr} {hourStr} {minuteStr} {secondStr} ago.      
        </small>
      </div>
    );
  }
};

export default observer(BoxFooter);
