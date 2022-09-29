import fs from "fs";

//memory variable
let chatrooms = [
  {
    roomId: "bff04e07-3c50-410a-877d-8bc908fbae98",
    roomName: "261207 General",
    messages: [
      {
        messageId: "e1480e86-8fdd-4a9d-83fb-69e34e9848f2",
        text: "สวัสดีค้าบ นี่ admin เอง",
        username: "admin",
      },
      {
        messageId: "b10afeea-9814-4e9b-b7a5-e9e6d1606d3b",
        text: "อิอิ",
        username: "user1",
      },
    ],
  },
  {
    roomId: "c3023eee-1112-411b-81d3-79c5ba78c517",
    roomName: "ศาลาคนเศร้า",
    messages: [
      {
        messageId: "87740661-e20e-4159-b6b2-e48dc8165097",
        text: "ร้านไหนดีเพื่อน",
        username: "user1",
      },
    ],
  },
];

//memory variable
let users = [
  {
    username: "admin",
    password: "$2a$12$6lU7JRPa1lbbxnZlGBGJVOWcLxCxKphY2hyhMFydu8Yiyn.kWLAou",
    isAdmin: true,
  },
  {
    username: "user1",
    password: "$2a$12$6lU7JRPa1lbbxnZlGBGJVOWcLxCxKphY2hyhMFydu8Yiyn.kWLAou",
    isAdmin: false,
  },
];

export function readChatRoomsDB() {
  //read db from text file if run on local
  if (process.env.NODE_ENV === "development") {
    const str = fs.readFileSync("db/chatrooms.json", {
      encoding: "utf-8",
    });
    const chatrooms = JSON.parse(str);
    return chatrooms;
    //read db from memory if run on vercel
  } else if (process.env.NODE_ENV === "production") {
    return chatrooms;
  }
}

export function writeChatRoomsDB(_chatrooms) {
  //write db to text file if run on local
  if (process.env.NODE_ENV === "development") {
    const str = JSON.stringify(_chatrooms);
    fs.writeFileSync("db/chatrooms.json", str, { encoding: "utf-8" });
    //write db to memory if run on vercel
  } else if (process.env.NODE_ENV === "production") chatrooms = _chatrooms;
}

export function readUsersDB() {
  //read db from text file if run on local
  if (process.env.NODE_ENV === "development") {
    const str = fs.readFileSync("db/users.json", {
      encoding: "utf-8",
    });
    const users = JSON.parse(str);
    return users;
    //read db from memory if run on vercel
  } else if (process.env.NODE_ENV === "production") {
    return users;
  }
}

export function writeUsersDB(_users) {
  //read db from text file if run on local
  if (process.env.NODE_ENV === "development") {
    const str = JSON.stringify(_users);
    fs.writeFileSync("db/users.json", str, { encoding: "utf-8" });
    //read db from memory if run on vercel
  } else if (process.env.NODE_ENV === "production") {
    users = _users;
  }
}
