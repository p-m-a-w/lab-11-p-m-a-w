import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Chat() {
  const [authenData, setAuthenData] = useState(null);
  const [roomList, setRoomList] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [roomName, setRoomName] = useState("");

  const [msgs, setMsgs] = useState([]);
  const [msg, setMsg] = useState("");

  const router = useRouter();

  useEffect(() => {
    const str = localStorage.getItem("authenData");
    const parsed = JSON.parse(str);
    setAuthenData(parsed);
  }, []);

  //get rooms list when authened
  useEffect(() => {
    if (!authenData) return;
    getRooms();
  }, [authenData]);

  //utility functions
  function processMsgs(msgs) {
    msgs.reverse();
    const msgs2 = msgs.slice(0, 10);
    msgs2.reverse();
    setMsgs(msgs2);
  }

  function makeHeader() {
    return {
      headers: { Authorization: `Bearer ${authenData?.token}` },
    };
  }

  //We are too lazy to code try-catch everytime we call api request
  async function runAxios(axiosCode) {
    try {
      await axiosCode();
    } catch (e) {
      alert(e.response.data.message);
      if (e.response.status === 401) {
        clearInterval(intId);
        window.location = "/";
      }
    }
  }
  //end utility functions

  async function getRooms() {
    runAxios(async () => {
      const resp = await axios.get("/api/room", makeHeader());
      setRoomList(resp.data.rooms);
    });
  }

  async function getMsgs() {
    if (!roomId) return;
    runAxios(async () => {
      const resp = await axios.get(
        "/api/room/" + roomId + "/message",
        makeHeader()
      );
      const msgs = resp.data.messages;
      processMsgs(msgs);
    });
  }

  async function joinRoom(roomId, roomName) {
    setRoomId(roomId);
    setRoomName(roomName);

    runAxios(async () => {
      const resp = await axios.get(
        "/api/room/" + roomId + "/message",
        makeHeader()
      );
      const msgs = resp.data.messages;
      processMsgs(msgs);
    });
  }

  async function postMsg() {
    runAxios(async () => {
      const resp = await axios.post(
        "/api/room/" + roomId + "/message",
        {
          text: msg,
        },
        makeHeader()
      );
      if (resp.data.ok) await getMsgs();
    });
  }

  async function deleteMsg(messageId) {
    runAxios(async () => {
      const resp = await axios.delete(
        "/api/room/" + roomId + "/message/" + messageId,
        makeHeader()
      );
      if (resp.data.ok) await getMsgs();
    });
  }

  const [intId, setIntId] = useState(null);
  useEffect(() => {
    clearInterval(intId);
    const newIntId = setInterval(() => {
      if (roomId) {
        getMsgs();
        console.log("called");
      }
    }, 2000);
    setIntId(newIntId);
  }, [roomId]);

  return (
    <div>
      <p>
        <strong>Private Chat Room</strong>
      </p>
      {authenData && (
        <p>
          Welcome {authenData.username}{" "}
          {authenData.isAdmin && <span>(Admin) </span>}
          <button
            onClick={() => {
              localStorage.removeItem("authenData");
              router.push("/");
            }}
          >
            Logout
          </button>
        </p>
      )}

      {roomList.length > 0 && (
        <ul>
          {roomList.map((x) => (
            <li key={x.roomId}>
              {x.roomName}{" "}
              <button
                onClick={() => {
                  joinRoom(x.roomId, x.roomName);
                }}
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr />

      {roomId && (
        <>
          <p style={{ textAlign: "center" }}>Room Name : {roomName}</p>
          <div
            style={{
              minHeight: "350px",
              maxHeight: "350px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "500px",
              overflowY: "auto",
            }}
          >
            {msgs.map((x) => (
              <div
                key={x.messageId}
                style={{
                  display: "flex",
                  justifyContent:
                    x.username === authenData?.username ? "right" : "left",
                }}
              >
                <div style={{ margin: "5px" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    {x.username}
                  </div>
                  <span
                    style={{
                      backgroundColor:
                        x.username === authenData?.username
                          ? "LightSkyBlue"
                          : "lightgray",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {" "}
                    {x.text}{" "}
                    {(authenData?.isAdmin ||
                      x.username === authenData?.username) && (
                      <button
                        onClick={() => deleteMsg(x.messageId)}
                        style={{ fontSize: "8px" }}
                      >
                        X
                      </button>
                    )}
                  </span>
                </div>
              </div>
            ))}

            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  postMsg();
                  setMsg("");
                }
              }}
              placeholder="Send Message.."
            ></input>
          </div>
        </>
      )}
    </div>
  );
}
