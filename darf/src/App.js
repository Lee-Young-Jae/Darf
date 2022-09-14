import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Diary from "./Diary";
import Profile from "./Profile";
import Width from "./Width";
import Fitness from "./Fitness";
import Diet from "./Diet";
import HealthState from "./HealthState";
import AppLayout from "./components/AppLayout";
import KakaoLogin from "./KakaoLogin";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { LOAD_ME_REQUEST } from "./modules/reducers/user";
import Kakaologout from "./KakaoLogout";
import Group from "./Group";
import GroupCreate from "./GroupCreate";
import GroupBoard from "./GroupBoard";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: LOAD_ME_REQUEST,
    });
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppLayout>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="/login" element={<Login></Login>} />
            <Route path="/diary" element={<Diary></Diary>} />
            <Route path="/width" element={<Width></Width>} />
            <Route path="/fitness" element={<Fitness></Fitness>} />
            <Route path="/diet" element={<Diet></Diet>} />
            <Route path="/profile/:id" element={<Profile></Profile>} />
            <Route path="/healthstate" element={<HealthState></HealthState>} />
            <Route path="/group" element={<Group></Group>} />
            <Route path="/groupcreate" element={<GroupCreate></GroupCreate>} />
            <Route path="/groupboard" element={<GroupBoard />}></Route>

            <Route
              path="/kakaologin"
              element={<KakaoLogin></KakaoLogin>}
            ></Route>
            <Route
              path="/kakaologout"
              element={<Kakaologout></Kakaologout>}
            ></Route>
          </Routes>
        </div>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
