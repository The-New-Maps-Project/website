import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import calcData from "../calculate/calcData";
import PContext from "../services/context";
import writeNum from "../services/writeNum";
import PercentBar from "./PercentBar";
import Popup from "./Popup";
import { Bar } from "react-chartjs-2";

export default function Analysis() {
  const { data, districts, parameters } = useContext(PContext);
  const [needRecalculate, setNeedRecalculate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState<boolean[]>([]);
  const [res, setRes] = useState<object | null>(null);
  const [selectedParam, setSelectedParam] = useState<number>(0);
  const [chartValue, setChartValue] = useState<string | null>(null); //whether it is pAllData, or cAllData, or null, don't show popup

  //array of arrays of length 2: [name,property name on object]
  const paramPopInfo = [
    ["Total Population", "pTotal"],
    ["Average", "pMean"],
    ["Standard Deviation", "pStddev"],
    ["RSD (%)", "pRSD"],
    ["Outliers", "pOutliers"],
    ["Median", "pMedian"],
  ];

  const paramCompInfo = [
    ["Average ASDPC", "cTotal"],
    ["ASDPC Stddev", "cStddev"],
    ["ASDPC Outliers", "cOutliers"],
    ["Median", "cMedian"],
  ];

  const precinctInfo = [
    ["Total Precincts","total"],
    ["Mean Precinct Size","mean"],
    ["Standard Deviation","stddev"],
    ["Precinct Density Index","precinctDensity"],
    ["Population Density Index","populationDensity"]
  ]

  useEffect(() => {
    setNeedRecalculate(true);
  }, [data]);

  const reCalculate = () => {
    setLoading(true);
    var r = calcData(data, districts, parameters);
    setRes(r);
    setLoading(false);
    setNeedRecalculate(false);
  };

  const renderDistricts = () => {
    if (!res["districts"]) return;
    var arr = [];
    for (let i = 0; i <= districts.length; i++) {
      arr.push(
        <li key={i} className="single-district">
          <div className="main-row">
            <div className="district-name">
              {i > 0 && (
                <div
                  className="color-box"
                  style={{ backgroundColor: `var(--${districts[i - 1]}-icon)` }}
                ></div>
              )}
              {i == 0 ? "Total Population" : `District ${i}`}
            </div>
            <button
              className="tb"
              onClick={() => {
                let a = [...showInfo];
                a[i] = !showInfo[i];
                setShowInfo(a);
              }}
            >
              {showInfo[i] ? "Hide" : "More"}
            </button>
          </div>
          {showInfo[i] && (
            <div className="info">
              <ul className="table">
                <li className="top-row">
                  <div></div>
                  <div>Pop.</div>
                  <div>ASDPC (km)</div>
                </li>
                {renderParamInfo(res["districts"][i])}
              </ul>
            </div>
          )}
        </li>
      );
    }
    return arr;
  };

  const renderParamInfo = (districtData: object) => {
    var arr = [];
    for (let i = 0; i <= parameters.length; i++) {
      arr.push(
        <li className="row">
          <div className="p-name">
            {i - 1 >= 0 ? parameters[i - 1] : "Total"}
          </div>
          <div>{writeNum(districtData["populations"][i], 0)}</div>
          <div>{writeNum(districtData["asdpc"][i], 1)}</div>
        </li>
      );
    }
    return arr;
  };

  const renderParamOptions = () => {
    var arr = [];
    for (let i = 0; i <= parameters.length; i++) {
      arr.push(
        <option value={i}>{i == 0 ? "Population" : parameters[i - 1]}</option>
      );
    }
    return arr;
  };

  interface dataObj {
    value: number;
    index: number;
  }

  const renderCharts = () => {
    let allData: number[] = res["params"][selectedParam][chartValue];
    if(selectedParam!=0&&chartValue=="pAllData"){
      let count =-1;
       allData = allData.map(a=> {
         count++;
         return Number(writeNum(a/res["params"][0][chartValue][count],4));
        })
    }
    let dataObjs: dataObj[] = [];
    for (let i = 1; i < allData.length; i++) {
      dataObjs.push({
        index: i,
        value: allData[i],
      });
    }
    dataObjs.sort((a, b) => a.value - b.value);
    let colorVars = dataObjs.map((d) =>
      String(`var(--${districts[d.index - 1]}-icon)`)
    );
    const data = {
      labels: dataObjs.map((d) => String(`District ${d.index}`)),
      datasets: [
        {
          label: chartValue == "pAllData" ? "Population" : "ASDPC (in km)",
          data: dataObjs.map((d) => d.value),
          backgroundColor: dataObjs.map(() => "#004c93"),
        },
      ],
    };
    if(dataObjs.length==0) return <p>No Data Available</p>

    //Calculate histogram data;
    const buckets = 7;
    let lowest = dataObjs[0].value;
    let highest = dataObjs[dataObjs.length-1].value;//add one because you want the last object to fall into a bucket (a bucket being strictly less than the upper value)
    let increment = (highest-lowest)/buckets;
    let histogramDataObjs:dataObj[] = [...dataObjs];
    let histogramNums:number[] = [];
    let histogramLabels:string[] = [];
    for(let i = 0;i<buckets;i++){
        let count = 0;
        let hi = lowest + (i+1)*increment;
        while(histogramDataObjs.length>0&&histogramDataObjs[0].value<hi){
            count += 1;
            histogramDataObjs.shift();
        }
        histogramNums.push(count);
        histogramLabels.push(`${(hi-increment).toFixed(4)}-${hi.toFixed(4)}`);
    }
    histogramNums[histogramNums.length-1]++; //add one to the last bucket for the highest amount;
    const histogramData = {
        labels: histogramLabels,
      datasets: [
        {
          label: "",
          data: histogramNums,
          backgroundColor: dataObjs.map(() => "#004c93"),
        },
      ],
    }
    const options = {
      indexAxis: "x",
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        bar: {
        },
      },
      responsive: false,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
        },
      },
    };
    const title = `${
      selectedParam == 0 ? "Entire " : `\"${parameters[selectedParam - 1]}\" `
    }${chartValue == "pAllData" ? "Population" : "ASDPC (in km)"}`;
    return (
      <ul className="all-charts">
        <li className="chart-area">
          <h6 className="chart-title">All Districts - {title}</h6>
          <div className="barchart-container">
            <Bar
              type="bar"
              data={data}
              height={500}
              width={Math.max(600, 30 * dataObjs.length)}
              options={options}
            ></Bar>
          </div>
        </li>
        <li className="chart-area">
          <h6 className="chart-title">Histogram - {title}</h6>
          <div className="barchart-container">
            <Bar
              type="bar"
              data={histogramData}
              height={500}
              width={Math.max(600, 30 * histogramDataObjs.length)}
              options={options}
            ></Bar>
          </div>
        </li>
      </ul>
    );
  };

  return (
    <div id="analysis-container">
      <hr></hr>
      <div className="recalc-button-container">
        {needRecalculate && <div className="row">
          {res!=null&&<div className="mr15">Data has changed</div>}
          <button className={`calc-button${res==null?"":" re"}`} onClick={reCalculate}>
            {res==null?"":"Re-"}Calculate Stats
          </button>
        </div>}
      </div>
      {res&&<p style={{margin: "10px 0px", fontSize: "12px"}}>**Average Squared Distance to Population Center is abbreviated as "ASDPC"</p>}
      {res && (
        <div id="analysis-main">
          <section id="param-analysis">
            <div className="first-row">
              <select
                id="param-select"
                value={selectedParam}
                onChange={(e) => setSelectedParam(Number(e.target.value))}
              >
                {renderParamOptions()}
              </select>
            </div>
            <div id="param-info">
              <h3>
                {selectedParam == 0
                  ? "Population"
                  : parameters[selectedParam - 1]}
              </h3>
              {selectedParam > 0&&res["params"][selectedParam] && (
                <div>
                  <PercentBar
                    text="Majority Districts"
                    percent={
                      (res["params"][selectedParam]["majorityDistricts"] /
                        districts.length) *
                      100
                    }
                  ></PercentBar>
                  <PercentBar
                    text="of Population"
                    percent={
                      (res["params"][selectedParam]["pTotal"] /
                        res["params"][0]["pTotal"]) *
                      100
                    }
                  ></PercentBar>
                  {"Majority Districts: "+res["params"][selectedParam]["majorityDistricts"] + " out of " + districts.length}
                </div>
              )}
              <ul className="values-list">
                {paramPopInfo.map((a) => {
                  var b;
                  if(!res["params"][selectedParam]){
                    b = 0;
                  }else{
                    b = res["params"][selectedParam][a[1]];
                  }
                  if (a[1] == "pOutliers") b = b.length;

                  return (
                    <li key={a[0]}>
                      <label>{a[0]}:</label>
                      <p>{writeNum(b)}</p>
                    </li>
                  );
                })}
                <li key={"allData"}>
                  <button
                    className="allData"
                    onClick={() => setChartValue("pAllData")}
                  >
                    Graph Data
                  </button>
                </li>
              </ul>
              <hr></hr>

              <ul className="values-list">
                {paramCompInfo.map((a) => {
                  var b;
                  if(!res["params"][selectedParam]){
                    b = 0;
                  }else{
                    b = res["params"][selectedParam][a[1]];
                  }
                  if (a[1] == "cOutliers") b = b.length;

                  return (
                    <li key={a[0]}>
                      <label>{a[0]}:</label>
                      <p>{writeNum(b)}</p>
                    </li>
                  );
                })}
                <li key={"allData"}>
                  <button
                    className="allData"
                    onClick={() => setChartValue("cAllData")}
                  >
                    Graph Data
                  </button>
                </li>
              </ul>
            </div>
          </section>
          <section id="district-analysis">
            <ul id="districts-list">{renderDistricts()}</ul>
          </section>
        </div>
      )}
      {res && <ul id="precinct-data-analysis">
       
          {precinctInfo.map(v=>{
            return <li>
              <span className="name">{v[0]}:</span>
              <span className="value">{writeNum(res["precincts"][v[1]],v[1]=="precinctDensity"?3:1)}</span>
            </li>
          })}
        </ul>
      }

      {chartValue && (
        <Popup>
          <button className="x-button" onClick={() => setChartValue(null)}>
            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
          </button>
          <div id="chart-popup">{renderCharts()}</div>
        </Popup>
      )}
    </div>
  );
}
