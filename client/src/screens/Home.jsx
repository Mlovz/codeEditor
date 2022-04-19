import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Создана новая комната!");
  };

  const joinRomm = (e) => {
    e.preventDefault();
    if (!roomId || !userName) {
      return toast.error("RoomId, Username required");
    }
    navigate(`/code/${roomId}`, {
      state: userName,
    });
  };

  const handleInputEnter = (e) => {
    if (e.coder === "Enter") {
      joinRomm();
    }
  };

  return (
    <div className="home">
      <div className="home__wrap">
        <h3>Online Code</h3>

        <form onSubmit={joinRomm}>
          <div>
            <label>ID</label>
            <input
              type="text"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
            />
          </div>
          <div>
            <label>UserName</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyUp={handleInputEnter}
            />
          </div>

          <div>
            <button>Войти</button>
          </div>

          <div>
            <button className="create__id" onClick={createNewRoom}>
              Cоздать ID
            </button>{" "}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
