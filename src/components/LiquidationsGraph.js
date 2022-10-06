import React, { Component } from "react";
import { observer } from "mobx-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "../constants";
import mainStore from "../stores/main.store";
import { removeTokenPrefix } from "../utils";
import {
  WhaleFriendlyAxisTick,
  whaleFriendlyFormater,
} from "../components/WhaleFriendly";
import BoxRow from "../components/BoxRow";
import poolsStore from "../stores/pools.store";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const content = Object.assign({}, payload[0].payload);
    const colorMap = {};
    payload.forEach(({ dataKey, color }) => {
      colorMap[dataKey] = color;
    });
    const price = content.x.toFixed(2);
    delete content.x;
    const total = Object.entries(content)
      .reduce((acc, [k, v]) => {
        return acc + parseFloat(v);
      }, 0)
      .toFixed(2);
    return (
      <div className="tooltip-container">
        <BoxRow slim={true}>
          <div>Price</div>
          <div>{whaleFriendlyFormater(price)}</div>
        </BoxRow>
        {Object.entries(content).map(([k, v], i) => {
          k = k === "x" ? "Price" : k;
          return (
            <BoxRow slim={true} key={i}>
              <div style={{ color: colorMap[k] }}>{removeTokenPrefix(k)}</div>
              <div>{whaleFriendlyFormater(v)}</div>
            </BoxRow>
          );
        })}
        <BoxRow slim={true}>
          <div>Total</div>
          <div>{whaleFriendlyFormater(total)}</div>
        </BoxRow>
      </div>
    );
  }
};

class LiquidationsGraph extends Component {
  render() {
    const graphData = {};
    const graphKeys = {};
    const pool = poolsStore["tab"];
    const apiData = Object.assign(poolsStore["data/liquidations"]);





    // Object.entries(this.props.data.graph_data).forEach(([k, v]) => {
    //   Object.entries(v).forEach(([x, y]) => {
    //     y = parseFloat(y).toFixed(2);
    //     x = parseFloat(x).toFixed(2);
    //     graphData[x] = graphData[x] || {};
    //     graphData[x][k] = y;
    //     graphData[x].x = parseFloat(x);
    //     graphKeys[k] = k;
    //   });
    // });
    // const dataKeys = Object.keys(graphKeys);
    // const dataSet = Object.values(graphData).sort((a, b) => a.x - b.x);
    // const rawData = Object.assign({}, mainStore["oracles_data"] || {});
    // const asset = this.props.data.key;
    // const currentPrice = (rawData[asset] || {}).oracle;
    return (
      <div style={{ width: "100%", height: "30vh" }}>
        {/* <ResponsiveContainer>
          <AreaChart data={dataSet}>
            {currentPrice && (
              <ReferenceLine
                alwaysShow={true}
                x={currentPrice}
                label={`current`}
                stroke="var(--primary"
                strokeWidth="1"
              />
            )}
            <XAxis
              tickCount={55}
              domain={[0, "dataMax"]}
              type="number"
              dataKey="x"
            />
            <YAxis tick={<WhaleFriendlyAxisTick />} />
            <Tooltip content={CustomTooltip} />
            {dataKeys.map((k, i) => (
              <Area
                key={i}
                type="monotone"
                dataKey={k}
                stackId="1"
                stroke={COLORS[i]}
                fill={COLORS[i]}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer> */}
      </div>
    );
  }
}

export default observer(LiquidationsGraph);
