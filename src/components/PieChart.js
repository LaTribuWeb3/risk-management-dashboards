import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
} from "recharts";

import { PureComponent } from "react";
import { observer } from "mobx-react";
import { tokenColors } from "../constants";
import { whaleFriendlyFormater } from "../components/WhaleFriendly";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="var(--contrast)"
      >{`${whaleFriendlyFormater(value)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="var(--secondery)"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

class Example extends PureComponent {
  static demoUrl =
    "https://codesandbox.io/s/pie-chart-with-customized-active-shape-y93si";

  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  getcolor(name){
    return tokenColors[name];

  }

  render() {
    const { data } = this.props;
    const cleanData = [];
    Object.entries(data).forEach(([key, val]) => {
      cleanData.push({
        name: key,
        value: val,
      });
    });

    cleanData.sort((a, b) => b.value - a.value);
    return (
      <ResponsiveContainer>
        <PieChart>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={cleanData}
            innerRadius={100}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={this.onPieEnter}
          >
            {cleanData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={this.getcolor(entry.name)} />
            ))}
          </Pie>
          <Legend
            payload={cleanData.map((item, index) => ({
              name: item.name,
              value: item.name + ` (${whaleFriendlyFormater(item.value)})`,
              color: this.getcolor(item.name),
            }))}
            iconType={"circle"}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

export default observer(Example);
