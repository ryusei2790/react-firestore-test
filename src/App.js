// src/App.js
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function App() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      setItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  // データ追加
  const addItem = async () => {
    if (input.trim() === "") return;
    await addDoc(collection(db, "items"), { text: input });
    setInput("");
    window.location.reload(); // 簡易的に再読み込み
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Firestore 簡易メモアプリ</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="入力してください"
      />
      <button onClick={addItem}>追加</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
