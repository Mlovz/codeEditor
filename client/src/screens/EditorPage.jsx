import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socketClient";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigate = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  const clipBoard = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the room");
    }
  };

  const leaveRoom = () => {
    reactNavigate("/");
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        toast.error("Socket connection error, try again later");
        reactNavigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state) {
            toast.success(`${username} joined the room`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, [location.state, reactNavigate, roomId]);

  if (!location.state) {
    <Navigate to="/" />;
  }

  return (
    <div className="editor__page">
      <div className="aside">
        <div className="aside__logo">Online Code</div>
        <h3>Пользователи</h3>
        <div className="aside__content">
          <div className="aside__clients">
            {clients.map((client, index) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <div className="aside__content__btn">
            <button onClick={clipBoard}>Cкопировать ID</button>
            <button onClick={leaveRoom}>Выйти</button>
          </div>
        </div>
      </div>

      <div className="editor__page__container">
        <Editor
          onCodeChange={(code) => (codeRef.current = code)}
          socketRef={socketRef}
          roomId={roomId}
        />
      </div>
    </div>
  );
};

export default EditorPage;
