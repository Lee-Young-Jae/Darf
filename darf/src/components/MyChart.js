import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { graphic } from "echarts";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_CHART_INFO_REQUEST } from "../modules/reducers/user";

const MyChart = () => {
  const [getWeekData, setGetWeekData] = useState(true);
  const { loadChartInfoDone } = useSelector((state) => state.user.state);
  const { chart } = useSelector((state) => state.user.me);

  const onStackChange = () => {
    if (!getWeekData) {
      dispatch({
        type: LOAD_CHART_INFO_REQUEST,
        data: 7,
      });
    } else {
      dispatch({
        type: LOAD_CHART_INFO_REQUEST,
        data: 29,
      });
    }

    setGetWeekData((prev) => !prev);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: LOAD_CHART_INFO_REQUEST,
      data: 7,
    });
  }, [dispatch]);

  return (
    <>
      {getWeekData ? (
        <div className="btnWrapper">
          <button onClick={onStackChange} className="active">
            일주일 데이터 가져오기
          </button>
          <button onClick={onStackChange}>한달 데이터 가져오기</button>
        </div>
      ) : (
        <div className="btnWrapper">
          <button onClick={onStackChange}>일주일 데이터 가져오기</button>
          <button onClick={onStackChange} className="active">
            한달 데이터 가져오기
          </button>
        </div>
      )}
      {loadChartInfoDone && (
        <ReactEcharts
          option={{
            tooltip: {
              trigger: "axis",
            },
            dataZoom: {
              show: false,
              start: 0,
              end: 100,
            },
            xAxis: [
              {
                type: "category",
                boundaryGap: false,
                axisTick: {
                  alignWithLabel: true,
                },
                data: chart?.dates.map((e) => {
                  const time = new Date(e);

                  return `${time.getMonth() + 1}. ${time.getDate()}`;
                }),
              },
            ],
            yAxis: [
              {
                name: "내 체중",
                type: "value",
                show: true,
                scale: true,
                position: "left",
                min: 0,
                max:
                  chart?.width &&
                  Math.floor(
                    Math.max(...chart?.width.map((e) => parseInt(e.width))) *
                      1.3
                  ),

                axisLabel: {
                  formatter: (value, index) => value + "kg",
                  // hideOverlap: true,
                },
              },
              {
                name: "섭취한 칼로리",
                type: "value",
                position: "right",

                show: true,
                scale: true,
                max:
                  chart?.diet &&
                  Math.floor(
                    Math.max(...chart?.diet.map((e) => parseInt(e.kcal))) * 1.1
                  ),
                min: 0,
                axisLabel: {
                  formatter: (value, index) => value + "kcal",
                  // hideOverlap: true,
                },
              },
            ],
            legend: {
              data: ["내 체중", "섭취한 칼로리"],
              left: "10%",
            },
            series: [
              {
                name: "내 체중",
                type: "line",
                // stack: isStacked ? "Total" : null,
                smooth: true,
                yAxisIndex: 0,
                lineStyle: {
                  width: 0,
                },
                showSymbol: false,
                areaStyle: {
                  opacity: 0.5,
                  color: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "rgb(0, 221, 255)",
                    },
                    {
                      offset: 1,
                      color: "rgb(77, 119, 255)",
                    },
                  ]),
                  // shadowBlur: 1,
                },
                emphasis: {
                  focus: "series",
                },
                data: chart?.width.map((e) => e.width),
              },
              {
                name: "섭취한 칼로리",
                type: "line",
                // stack: isStacked ? "Total" : null,

                smooth: true,
                yAxisIndex: 1,
                lineStyle: {
                  width: 0,
                },
                showSymbol: false,
                areaStyle: {
                  opacity: 0.5,
                  color: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "rgb(128, 255, 165)",
                    },
                    {
                      offset: 1,
                      color: "rgb(1, 191, 236)",
                    },
                  ]),
                },
                emphasis: {
                  focus: "series",
                },
                data: chart?.diet.map((e) => parseInt(e.kcal)),
              },
            ],
          }}
        />
      )}
    </>
  );
};

export default MyChart;
