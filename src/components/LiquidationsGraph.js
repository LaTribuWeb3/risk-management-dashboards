import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  WhaleFriendlyAxisTick,
  liquidationWhaleFriendlyFormater,
} from "../components/WhaleFriendly";

import BoxRow from "../components/BoxRow";
import { COLORS } from "../constants";
import { Component } from "react";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";

const CustomTooltip = ({ active, payload, symbol }) => {
  if (active && payload && payload.length) {
    const content = Object.assign({}, payload[0].payload);

    const colorMap = {};
    payload.forEach(({ dataKey, color }) => {
      colorMap[dataKey] = color;
    });
    const price = content.x;
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
          <div>{liquidationWhaleFriendlyFormater(price, symbol)}</div>
        </BoxRow>
        <BoxRow slim={true}>
          <div>Total</div>
          <div>{liquidationWhaleFriendlyFormater(total, symbol)}</div>
        </BoxRow>
      </div>
    );
  }
};

class LiquidationsGraph extends Component {
  render() {
    if (this.props.data.graph_data) {
      const graphData = {};
      const graphKeys = {};
      const token = Object.keys(this.props.data.graph_data)["0"];
      const underlying = poolsStore["activeTabSymbol"];
      let symbol = null;
      if (token.toLowerCase() === underlying.toLowerCase()) {
        symbol = "$";
      } else {
        symbol = underlying;
      }

      Object.entries(this.props.data.graph_data).forEach(([k, v]) => {
        Object.entries(v).forEach(([x, y]) => {
          graphData[x] = graphData[x] || {};
          graphData[x][k] = y;
          graphData[x].x = x;
          graphKeys[k] = k;
        });
      });

      const dataKeys = Object.keys(graphKeys);
      const dataSet = Object.values(graphData).sort((a, b) => a.x - b.x);
      const dataSetItemProps = Object.keys(dataSet[0]).filter((p) => p !== "x");
      let currentPrice = Math.max(...dataSet.map((_) => _.x));
      if (this.props.data.key === poolsStore["activeTabSymbol"]) {
        currentPrice = Math.min(...dataSet.map((_) => _.x));
      }
      const biggestValue = dataSet.map((o) => o.x).sort((a, b) => b - a)[0];
      if (biggestValue < currentPrice) {
        const item = { x: currentPrice };
        dataSetItemProps.forEach((p) => (item[p] = 0));
        dataSet.push(item);
      }
      const DoubleCurrentPrice = currentPrice * 2;
      if (biggestValue < DoubleCurrentPrice) {
        const item = { x: DoubleCurrentPrice };
        dataSetItemProps.forEach((p) => (item[p] = 0));
        dataSet.push(item);
      }
      let dataMax = Math.max(biggestValue, DoubleCurrentPrice);

      const DataFormater = (number) => {
        if (number < 1 / 1e6) {
          return (number * 1e6).toString() + "µ";
        } else if (number < 1 / 1e3) {
          return (number * 1e3).toString() + "m";
        } else {
          return number.toString();
        }
      };

      return (
        <div style={{ width: "70vw", height: "30vh" }}>
          <ResponsiveContainer>
            <AreaChart margin={{ left: 40 }} data={dataSet}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              {currentPrice && (
                <ReferenceLine
                  ifOverflow="extendDomain"
                  x={currentPrice}
                  label={`current`}
                  stroke="var(--primary"
                  strokeWidth="1"
                />
              )}
              {/* <ReferenceLine y={650000} label="Max" stroke="red" /> */}
              <XAxis
                tickFormatter={DataFormater}
                tickCount={55}
                domain={[0, dataMax]}
                type="number"
                dataKey="x"
              />
              <YAxis tick={<WhaleFriendlyAxisTick symbol={symbol} />} />
              <Tooltip symbol={symbol} content={CustomTooltip} />
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
          </ResponsiveContainer>
        </div>
      );
    } else {
      return <div>No graph data - there is no token holder in the pool.</div>;
    }
  }
}

export default observer(LiquidationsGraph);
