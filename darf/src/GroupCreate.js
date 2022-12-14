import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectBox from "./components/SelectBox";
import { GROUP_CREATE_REQUEST } from "./modules/reducers/group";

const GroupCreate = ({ purpose }) => {
  const { state } = useSelector((state) => state.group);

  const [GroupEmoji, setGroupEmoji] = useState("๐ช");
  const [GroupName, setGroupName] = useState("");
  const [GroupCapacity, setGroupCapacity] = useState(10);
  const [checkedItem, setCheckedItem] = useState(new Set());
  const [GroupIntroduce, setGroupIntroduce] = useState("");
  const [GroupPublic, setGroupPublic] = useState(true);
  const [GroupPassword, setGroupPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onChangeGroupName = (e) => {
    setGroupName(e.target.value);
  };
  const onChangeGroupCapacity = (e) => {
    setGroupCapacity(e.target.value);
  };
  const onChangeGroupIntroduce = (e) => {
    setGroupIntroduce(e.target.value);
  };

  const emoji = {
    options: [
      { value: "๐ช" },
      { value: "๐ดโโ๏ธ" },
      { value: "๐ฅ" },
      { value: "๐ฆ" },
      { value: "๐ฅ" },
      { value: "๐ฅ" },
      { value: "๐ฅฉ" },
      { value: "๐" },
      { value: "๐" },
      { value: "โฝ" },
      { value: "๐" },
      { value: "๐ธ" },
      { value: "๐" },
      { value: "๐ฎ" },
    ],
  };

  /** ๊ทธ๋ฃน ์์ฑ์ด ์๋ฃ๋๋ฉด state ์ด๊ธฐํ ๊ทธ๋ฃน ์์ฑ Error์ Error ๋ฉ์ธ์ง ์ถ๋ ฅ*/
  useEffect(() => {
    if (state.createGroupError) {
      message.error(state.createGroupError);
    }
    if (state.createGroupDone) {
      setGroupEmoji("๐ช");
      setGroupName("");
      setGroupCapacity(10);
      setCheckedItem(new Set());
      setGroupIntroduce("");
      setGroupPublic(true);
      setGroupPassword("");
    }
  }, [state.createGroupError, state.createGroupDone]);
  const onChangeCheckHandler = (e) => {
    checkedItemHandler(e.target.parentNode, e.target.value, e.target.checked);
  };
  const checkedItemHandler = (box, id, isChecked) => {
    if (isChecked) {
      checkedItem.add(id);
      setCheckedItem(checkedItem);
      box.style.backgroundColor = "#F6CB44";
    } else if (!isChecked && checkedItem.has(id)) {
      checkedItem.delete(id);
      setCheckedItem(checkedItem);
      box.style.backgroundColor = "#FFF";
    }
    return checkedItem;
  };

  const dispatch = useDispatch();
  const onSubmitCreateGroup = (e) => {
    e.preventDefault();
    dispatch({
      type: GROUP_CREATE_REQUEST,
      data: {
        name: GroupName,
        capacity: GroupCapacity,
        purpose: JSON.stringify(Array.from(checkedItem)),
        emoji: GroupEmoji,
        introduce: GroupIntroduce,
        password: GroupPassword,
      },
    });
  };

  /**
   *  ๊ทธ๋ฃน์ ๊ณต๊ฐ ์ํ๋ก ๋ฐ๊พธ๋ฉด ์๋ ฅํ๋ ๋น๋ฐ๋ฒํธ ๊ฐ์ "" ๋ก ์ด๊ธฐํ
   */
  useEffect(() => {
    setGroupPassword("");
  }, [GroupPublic]);

  return (
    <div className="GroupCreatePage">
      <form onSubmit={onSubmitCreateGroup}>
        <label>
          ๊ทธ๋ฃน ์ด๋ฆ:
          <input value={GroupName} onChange={onChangeGroupName}></input>
        </label>
        <label>
          ๊ทธ๋ฃน Emoji:
          <SelectBox props={emoji} eventHandler={setGroupEmoji}></SelectBox>
        </label>
        <label>
          ๊ทธ๋ฃน ์ ์
          <input
            value={GroupCapacity}
            type="number"
            step="1"
            max="20"
            onChange={onChangeGroupCapacity}
          ></input>
        </label>
        <div>
          <span>๊ทธ๋ฃน์๊ฐ:</span>
          <textarea
            onChange={onChangeGroupIntroduce}
            value={GroupIntroduce}
          ></textarea>
        </div>
        <div>
          <span>๊ทธ๋ฃน ๋ชฉํ: </span>
          {purpose.map((e) => {
            return (
              <label key={e.id} className="TypeBox">
                <input
                  type="checkbox"
                  value={e.purpose}
                  onChange={onChangeCheckHandler}
                ></input>
                <span>{e.purpose}</span>
              </label>
            );
          })}
        </div>
        <div>
          <span>๊ทธ๋ฃน ๊ณต๊ฐ: </span>
          <div>
            <input
              type="checkbox"
              checked={GroupPublic}
              onChange={(e) => {
                setGroupPublic((prev) => !prev);
              }}
            ></input>
          </div>
          {GroupPublic || (
            <>
              <label>
                ๋น๋ฐ๋ฒํธ
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setGroupPassword(e.target.value);
                  }}
                  value={GroupPassword}
                ></input>
              </label>
              <label>
                ๋น๋ฐ๋ฒํธ ๋ณด๊ธฐ
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setShowPassword((prev) => !prev);
                  }}
                  checked={showPassword}
                ></input>
              </label>
            </>
          )}
        </div>
        <button>๊ทธ๋ฃน ์์ฑ</button>
      </form>
    </div>
  );
};

export default GroupCreate;
