import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function callUserLogin() {
    try {
      const resp = await axios.post("/api/user/login", { username, password });
      if (resp.data.ok) {
        localStorage.setItem("authenData", JSON.stringify(resp.data));
        router.push("/chat");
      }
    } catch (e) {
      alert(e.response.data.message);
    }
  }

  return (
    <div>
      <p>Private Chat Room</p>
      <label>Username</label>
      <input onChange={(e) => setUsername(e.target.value)} value={username} />
      <br />
      <label>Password</label>
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        onKeyUp={(e) => {
          if (e.key === "Enter") callUserLogin();
        }}
        type="password"
      />
      <br />
      <button onClick={callUserLogin}>Login</button>
    </div>
  );
}
