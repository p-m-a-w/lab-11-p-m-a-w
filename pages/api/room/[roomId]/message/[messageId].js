import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;

  //check token

  const rooms = readChatRoomsDB();

  //check if roomId exist

  //check if messageId exist

  //check if token owner is admin, they can delete any message
  //or if token owner is normal user, they can only delete their own message!
}
