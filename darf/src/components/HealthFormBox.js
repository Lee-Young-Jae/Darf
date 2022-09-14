import React from "react";
import MyButton from "./MyButton";

const HealthFormBox = ({
  onChange,
  itemValue,
  min,
  max,
  titleMessage,
  onSubmit,
}) => {
  return (
    <div className="HealthFormBox">
      {titleMessage}
      {/* <input className="Date" type={"date"}></input> */}
      <div className="InputWrapper">
        <input
          className="RangeInput"
          value={itemValue}
          type="range"
          onChange={onChange}
          min={min}
          max={max}
        ></input>
        <input
          className="Input"
          value={itemValue}
          onChange={onChange}
          min={0}
        ></input>
      </div>
      <MyButton text={"제출"} onClick={onSubmit}></MyButton>
    </div>
  );
};

export default HealthFormBox;
