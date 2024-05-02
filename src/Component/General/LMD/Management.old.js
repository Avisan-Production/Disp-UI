import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  BarChart,
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
    {
      name: "سهروردی",
      power: 1232,
    },
    {
      name: "17 شهریور",
      power: 1415,
    },
    {
      name: "دانشگاه",
      power: 1222,
    },
    {
      name: "فردوسی",
      power: 6532,
    },
    {
      name: "قدس",
      power: 4253,
    },
    {
      name: "نارمک",
      power: 1564,
    },
    {
      name: "سهروردی",
      power: 1232,
    },
    {
      name: "17 شهریور",
      power: 1415,
    },
    {
      name: "دانشگاه",
      power: 1222,
    },
    {
      name: "فردوسی",
      power: 6532,
    },
    {
      name: "قدس",
      power: 4253,
    },
    {
      name: "نارمک",
      power: 1564,
    },  {
        name: "سهروردی",
        power: 1232,
      },
      {
        name: "17 شهریور",
        power: 1415,
      },
      {
        name: "دانشگاه",
        power: 1222,
      },
      {
        name: "فردوسی",
        power: 6532,
      },
      {
        name: "قدس",
        power: 4253,
      },
      {
        name: "نارمک",
        power: 1564,
      },
  ];
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
        <div className="box box-mid">
          <div className="h-half-1" id="powerchart">
            <p className="mb-1 font-12">
              نمودار لحظه ای توان مصرفی یکساعت گذشته
            </p>
            <div
              dir="ltr"
              style={{ height: getHeight("powerchart") - 40, width: "100%" }}
            >
              <ResponsiveContainer width={"100%"} height={"100%"}>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 20,
                    bottom: 5,
                    left: 0,
                  }}
                >
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="dateText" fontSize={14} tickCount={12}>
                    <Label position="left" fontSize={12} dx={-20}>
                      زمان
                    </Label>
                  </XAxis>

                  <YAxis tickCount={20} fontSize={12} tick={20}>
                    <Label position="center" fontSize={12} angle={-90} dx={-20}>
                      توان(KW)
                    </Label>
                  </YAxis>
                  <Line
                    type="monotone"
                    dataKey="power"
                    name="توان"
                    unit="kw"
                    stroke="#8884d8"
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div id="groupschart" className="h-half-2">
            <p className="mb-1 font-12">نمودار توان مصرفی گروه ها</p>
            <div
              dir="ltr"
              style={{ height: getHeight("groupschart") - 40, width: "100%" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={14} hide angle={-90}>
                    <Label position="left" fontSize={13} dx={-20}>
                      گروه
                    </Label>
                  </XAxis>

                  <YAxis tickCount={20} fontSize={14}>
                    <Label position="center" fontSize={13} angle={-90} dx={-40}>
                      توان(KW)
                    </Label>
                  </YAxis>
                  <Tooltip />
                  <Bar dataKey="power" fill="#8884d8" shape={<CustomBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
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
