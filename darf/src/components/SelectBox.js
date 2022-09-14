import React from "react";

const SelectBox = ({ props, eventHandler, defaultEmoji }) => {
  const onChangeSelectBox = (e) => {
    eventHandler(e.target.value);
  };

  return (
    <select onChange={onChangeSelectBox} defaultValue={defaultEmoji}>
      {props.options.map((option) => {
        return (
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        );
      })}
    </select>
  );
};

export default SelectBox;
