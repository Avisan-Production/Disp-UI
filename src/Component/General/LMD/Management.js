import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  BarChart,PieChart,Pie,Cell,
  Bar,
} from "recharts";
export default function Management() {
  const chartData = [
    {
      power: 10,
      dateText: "10:15",
    },
    {
      power: 123,
      dateText: "10:20",
    },
    {
      power: 87,
      dateText: "10:25",
    },
    {
      power: 12,
      dateText: "10:30",
    },
    {
      power: 244,
      dateText: "10:35",
    },
    {
      power: 93,
      dateText: "10:40",
    },
    {
      power: 74,
      dateText: "10:45",
    },
    {
      power: 12,
      dateText: "10:50",
    },
    {
      power: 67,
      dateText: "10:55",
    },
    {
      power: 23,
      dateText: "11:00",
    },
    {
      power: 78,
      dateText: "11:05",
    },
    {
      power: 34,
      dateText: "11:10",
    },
    {
      power: 100,
      dateText: "11:15",
    },
  ];
 
const data = [
  { name: '270 ایستگاه فعال', value: 60 },
  { name: '3200 کیلووات همکاری', value: 170 },
  { name: '13 منطقه برق', value: 50 },
  { name: '1200 کیلو وات توان مصرفی', value: 140 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={'middle'} dominantBaseline="central">
      {data[index].name}
    </text>
  );
};

  const getHeight = (id) => {
    let elem = document.getElementById(id);
    return elem ? elem.offsetHeight : 0;
  };
  const CustomBar = (props) => {
    const { fill, x, y, width, height, name } = props;
    return (
      <>
        <rect width={width} height={height} x={x} y={y} fill={fill} />
        <text
          x={-width * 2}
          y={x + width / 2}
          dominant-baseline="central"
          text-anchor="middle"
          font-size="12"
          fill="black"
          transform="rotate(-90, 0, 0)"
        >
          {" "}
          {name}{" "}
        </text>
      </>
    );
  };
  return (
    <>
      <div className="mng-container">
        <div className="box ">
          <div className="col-12 row p-0 ">
            <p className="text-wheat font-12 mb-0">آخرین واکشی اطلاعات</p>
            <div className=" p-2 col-12    mb-1">
              <input
                className="form-control bg-dark text-white"
                style={{ fontSize: 14 }}
                value={new Date().toLocaleString()}
                disabled
              ></input>
            </div>
            <div className=" p-2 col-12    mb-2">
              <p className="text-wheat font-12 mb-0">تعداد کل ایستگاه ها</p>
              <input
                className="form-control bg-dark text-white"
                style={{ fontSize: 14 }}
                value={5}
                disabled
              ></input>
            </div>
            <div className=" p-2  mb-2 col-12 ">
              <p className="text-wheat font-12 mb-0">تعداد کل گروه ها</p>
              <input
                className="form-control bg-dark text-white"
                style={{ fontSize: 14 }}
                value={5}
                disabled
              ></input>
            </div>
            <div className=" p-2  mb-2 col-12 ">
              <p className="text-wheat font-12 mb-0">
                میزان توان مصرفی لحظه ای
              </p>
              <input
                className="form-control bg-dark text-white"
                style={{ fontSize: 14 }}
                value={5}
                disabled
              ></input>
            </div>
            <div className=" p-2  mb-2 col-12 ">
              <p className="text-wheat font-12 mb-0">میزان همکاری لحظه ای</p>
              <input
                className="form-control bg-dark text-white"
                style={{ fontSize: 14 }}
                value={5}
                disabled
              ></input>
            </div>
          </div>
        </div>
        <div id="midd" className="box box-mid">
        <ResponsiveContainer width="100%" height="100%">
        <PieChart width={getHeight('midd')} height={getHeight('midd')}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={200}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
        </div>
        <div className="box" id="lightPie">
          <p className="mb-1 font-12">برترین های همکاری</p>
          {[...Array(8)].map((i, ind) => (
            <>
              <div className="d-flex top-coop" key={ind}>
                <p>تست</p>
                <span>120kw</span>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
