import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();

    //check if roomId exist
    const room = rooms.find(room => {
      return room.roomId === roomId
    })

    //find room and return
    if (room != null)
      return res.json({
        ok: true,
        messages: room.messages
      })
    else
      return res.status(404).json({
        ok: false,
        message: 'Invalid room id'
      })
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //check if roomId exist
    const room = rooms.find(room => {
      return room.roomId === roomId
    })

    //create message
    if (room != null)
      room.messages.push({
        messageId: uuidv4(),
        text: req.body.text,
        username: user.username
      })
    else
      return res.status(404).json({
        ok: false,
        message: 'Invalid room id'
      })

    writeChatRoomsDB(rooms);
    return res.json({
      ok: true,
      messages: room.messages[room.messages.length - 1]
    })
  }
}
