// src/App.js
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc, 
  orderBy, 
  query, 
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);

  // リアルタイムデータ取得
  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notes = querySnapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setItems(notes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // メモ追加
  const addNote = async () => {
    if (input.trim() === "") return;
    try {
      await addDoc(collection(db, "notes"), { 
        text: input,
        createdAt: serverTimestamp()
      });
      setInput("");
    } catch (error) {
      console.error("メモの追加に失敗しました:", error);
      alert("メモの追加に失敗しました");
    }
  };

  // メモ削除
  const deleteNote = async (id) => {
    if (window.confirm("このメモを削除しますか？")) {
      try {
        await deleteDoc(doc(db, "notes", id));
      } catch (error) {
        console.error("メモの削除に失敗しました:", error);
        alert("メモの削除に失敗しました");
      }
    }
  };

  // 編集開始
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // 編集保存
  const saveEdit = async () => {
    if (editText.trim() === "") return;
    try {
      await updateDoc(doc(db, "notes", editingId), { 
        text: editText,
        updatedAt: serverTimestamp()
      });
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("メモの更新に失敗しました:", error);
      alert("メモの更新に失敗しました");
    }
  };

  // 日時フォーマット
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("ja-JP");
  };

  // Enterキーでメモ追加
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addNote();
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">📝 Firestore メモアプリ</h1>
        
        <div className="input-section">
          <input
            className="note-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="新しいメモを入力してください..."
          />
          <button className="add-button" onClick={addNote}>
            追加
          </button>
        </div>

        <div className="notes-list">
          {items.length === 0 ? (
            <div className="empty-state">
              <p>メモがありません</p>
              <p>新しいメモを追加してみましょう！</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="note-item">
                {editingId === item.id ? (
                  <div className="edit-mode">
                    <textarea
                      className="edit-textarea"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                    />
                    <div className="edit-buttons">
                      <button className="save-button" onClick={saveEdit}>
                        保存
                      </button>
                      <button className="cancel-button" onClick={cancelEdit}>
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="note-content">
                      <p className="note-text">{item.text}</p>
                      <div className="note-meta">
                        <span className="note-date">
                          作成: {formatDate(item.createdAt)}
                        </span>
                        {item.updatedAt && (
                          <span className="note-date">
                            更新: {formatDate(item.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="note-actions">
                      <button 
                        className="edit-button" 
                        onClick={() => startEdit(item)}
                      >
                        編集
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => deleteNote(item.id)}
                      >
                        削除
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
