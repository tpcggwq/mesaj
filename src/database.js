import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore();

async function sendMessage(senderId, receiverId, message) {
  try {
    await addDoc(collection(db, "chats"), {
      sender: senderId,
      receiver: receiverId,
      message: message,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Mesaj gönderilemedi:", error);
  }
}
import { onSnapshot, query, orderBy } from "firebase/firestore";

function listenForMessages(chatId, callback) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    callback(messages);
  });
}
