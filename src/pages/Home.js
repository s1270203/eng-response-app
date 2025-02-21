import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css"; // CSS Modules をインポート

export default function Home() {
  const [mode, setMode] = useState("casual");
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* モード切り替え */}
      <div>
        <label className="mr-2">モード:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="casual">カジュアル</option>
          <option value="formal">フォーマル</option>
        </select>
      </div>

      {/* タイトル */}
      <h1 className={styles.title}>英会話アシスタント</h1>

      {/* 録音ボタン */}
      <button className={styles.recordButton} onClick={() => navigate("/recording")}>
        🎤
      </button>
    </div>
  );
}