import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_ME_REQUEST } from "./modules/reducers/user";

const Home = () => {
  const { me } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: LOAD_ME_REQUEST,
    });
  }, [dispatch]);
  return (
    <div>
      <h2>여기는 Home 입니다.</h2>
      {me?.userEmail ? (
        <div>로그인 되어있습니다.</div>
      ) : (
        <div>로그인 해주세요</div>
      )}
    </div>
  );
};

export default Home;
