import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_REGISTED_GROUP_REQUEST,
  LOAD_SELECTED_GROUP_REQUEST,
  SEARCH_GROUP_REQUEST,
} from "./modules/reducers/group";
import { message } from "antd";
import GroupCreate from "./components/group/GroupCreate";
import SearchedGroupItem from "./components/group/SearchedGroupItem";

const Group = () => {
  const { me, logOutDone } = useSelector((state) => state.user);
  const { group } = useSelector((state) => state.group);
  const { createGroupDone, joinGroupError, joinGroupLoading, joinGroupDone } =
    useSelector((state) => state.group.state);
  const [registedGroupPopupOpen, setRegistedGroupPopupOpen] = useState(true);
  const [findNewGroupPopupOpen, setfindNewGroupPopupOpen] = useState(false);
  const [searchGroupName, setsearchGroupName] = useState("");
  const [searchGroupPurpose, setSearchGroupPurpose] = useState("");
  const [createNewGroupPopupOpen, setCreateNewGroupPopupOpen] = useState(false);

  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const purpose = [
    { id: 1, purpose: "체지방 줄이기" },
    { id: 2, purpose: "근육량 늘리기" },
    { id: 3, purpose: "체력 키우기" },
    { id: 4, purpose: "습관 만들기" },
    { id: 5, purpose: "식단 관리하기" },
  ];

  const navigate = useNavigate();

  const onClickCreateNewGroup = (e) => {
    // navigate("/groupcreate");
    e.preventDefault();
    setCreateNewGroupPopupOpen((prev) => !prev);
  };

  const dispatch = useDispatch();

  /** 그룹 생성이 완료되면 메세지 출력 */
  useEffect(() => {
    if (createGroupDone) {
      message.success("성공적으로 그룹이 생성되었습니다!");
      setCreateNewGroupPopupOpen(false);
    }
  }, [createGroupDone]);

  useEffect(() => {
    dispatch({ type: LOAD_REGISTED_GROUP_REQUEST });
  }, [dispatch]);

  /**
   * 선택한 그룹 정보와 그룹의 Post들을 GroupBoard 페이지에 넘겨주기 위해 dispatch하는함수
   */
  const onClickRegistedGroupItem = (e) => {
    dispatch({
      type: LOAD_SELECTED_GROUP_REQUEST,
      data: { groupId: e.id },
    });
  };

  /** 가입된 그룹을 누른 후 SELECTED_GROUP_SUCCESS 이벤트가 도착하면 해당 그룹으로 이동 */

  // useEffect(() => {
  //   if (!loadSelectedGroupLoading && loadSelectedGroupDone) {
  //     navigate("/groupboard");
  //   }
  // }, [navigate, loadSelectedGroupDone, loadSelectedGroupLoading]);

  /**
   * 그룹 검색 input과 purpose 값이 onChage 될 때마다 그룹 검색 (dispatch) 을 수행하는 함수
   */

  const dispatchGroupSearch = () => {
    dispatch({
      type: SEARCH_GROUP_REQUEST,
      data: {
        name: searchGroupName,
        purpose: searchGroupPurpose,
      },
    });
  };

  const onChageGroupSearchName = (e) => {
    setsearchGroupName(e.target.value);
  };

  const onChangeGroupSearchPurpose = (e) => {
    e.preventDefault();

    setSearchGroupPurpose(
      e.target.value === searchGroupPurpose ? "" : e.target.value
    );
  };

  useEffect(() => {
    dispatchGroupSearch();
  }, [searchGroupPurpose, searchGroupName]);

  /** 그룹 가입 메세지를 토스트팝업으로 출력하는 함수 */
  useEffect(() => {
    if (joinGroupError) message.error(joinGroupError);

    if (joinGroupDone) {
      message.success("가입이 완료되었습니다.");
    }
  }, [joinGroupError, joinGroupLoading]);

  /** 페이지 첫 load시 로그인 여부를 확인하고 경고 메세지를 출력하는 함수 */
  useEffect(() => {
    if (logOutDone) {
      navigate("/");
      return;
    }

    if (!me?.userEmail) {
      message.warning("로그인이 필요합니다");
      navigate("/");
      return;
    }
  }, [me, navigate, logOutDone]);

  return (
    <div className="GroupPage">
      <div>여기는 GroupPage 입니다.</div>
      <div>
        <p className="subTitle" onClick={onClickCreateNewGroup}>
          새로운 그룹 만들기
        </p>
        {createNewGroupPopupOpen && (
          <GroupCreate purpose={purpose}></GroupCreate>
        )}
      </div>
      <div className="searchedGroupList">
        <p
          className="subTitle"
          onClick={() => {
            return setfindNewGroupPopupOpen((prev) => !prev);
          }}
        >
          가입 할 그룹 찾기
        </p>
        {findNewGroupPopupOpen && (
          <div>
            <p>가입할 그룹 목록:</p>
            <input
              placeholder="그룹 이름으로 검색"
              onChange={onChageGroupSearchName}
              value={searchGroupName}
            ></input>
            <p>그룹 태그로 검색: </p>
            {purpose.map((e) => {
              return (
                <label
                  key={e.id}
                  className={`groupPurpose groupPurpose-${e.id} ${
                    e.purpose === searchGroupPurpose
                      ? "groupPurpose-active"
                      : ""
                  }`}
                >
                  <button
                    value={e.purpose}
                    onClick={onChangeGroupSearchPurpose}
                  ></button>
                  <span>{e.purpose}</span>
                </label>
              );
            })}
            <div>
              {group.searchedGroup?.length >= 1 ? (
                group.searchedGroup.map((e) => {
                  return (
                    <SearchedGroupItem
                      key={e.id}
                      group={e}
                      searchGroupPurpose={searchGroupPurpose}
                    ></SearchedGroupItem>
                  );
                })
              ) : (
                <div className="searchedGroupItem">검색 결과가 없습니다.</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="RegistedGroupList">
        <p
          className="subTitle"
          onClick={() => {
            setRegistedGroupPopupOpen((prev) => !prev);
          }}
        >
          가입된 그룹 목록
        </p>

        {group.myGroup.length <= 0 && (
          <div>
            가입중인 그룹이 없습니다. 그룹을 찾아 가입하시거나 새로운 그룹을
            만들어 보세요!{" "}
          </div>
        )}
        {group.myGroup &&
          registedGroupPopupOpen &&
          group.myGroup.map((e) => {
            const groupDate = new Date(e.createdAt);
            return (
              <div
                key={e.id}
                className="RegistedGroupItem"
                onClick={() => onClickRegistedGroupItem(e)}
              >
                <Link to={"/groupboard"}>
                  <span>{`그룹 명: ${e.name}`}</span>
                  {e.password.length >= 1 ? <span>🔒︎</span> : <span></span>}
                  <div className="groupEmoji">{e.emoji}</div>
                  <p>{`정원: ${e.Users?.length || 1}/${e.capacity}`}</p>
                  <p>
                    {e.introduce.length > 10
                      ? `${e.introduce.slice(0, 10)}...`
                      : `${e.introduce}`}
                  </p>
                  <p>
                    그룹 목표:<br></br>
                    {e.purpose &&
                      JSON.parse(e.purpose).map((purpose, index) => {
                        return (
                          <span
                            className={`groupPurpose groupPurpose-${index}`}
                            key={index}
                          >
                            {purpose}
                          </span>
                        );
                      })}
                  </p>
                  <p className="groupSince">{`since: ${groupDate.getFullYear()}. ${
                    groupDate.getMonth() + 1
                  }. ${groupDate.getDate()}. ${days[groupDate.getDay()]}`}</p>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Group;
