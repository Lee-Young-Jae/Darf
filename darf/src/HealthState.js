import React, { useCallback, useEffect, useState } from "react"; //useState
import CalenderGuideImages from "./components/CalenderGuideImages";
// import { useSelector } from "react-redux";
import Calender from "./components/Calendar";
// import HealthFormBox from "./components/HealthFormBox";

const HealthState = () => {
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    const LSshowGuide =
      window.localStorage.getItem("showGuide") &&
      window.localStorage.getItem("showGuide") === "true";
    if (LSshowGuide === null || LSshowGuide) {
      setShowGuide(true);
      return;
    }
    setShowGuide(false);
  }, [setShowGuide]);

  const onClickNeverShowGuideBtn = useCallback(() => {
    console.log("onClickNeverShowGuideBtn", showGuide);
    window.localStorage.setItem("showGuide", false);
    setShowGuide(false);
  }, [setShowGuide, showGuide]);

  return (
    <div className="HealthState">
      <Calender></Calender>
      {showGuide && (
        <div className="calenderGuideBox">
          <div onClick={onClickNeverShowGuideBtn}>
            <h2 className="button">더 이상 가이드가 필요 없어요 (Click❗)</h2>
          </div>
          <CalenderGuideImages></CalenderGuideImages>
        </div>
      )}
    </div>
  );
};

export default HealthState;
