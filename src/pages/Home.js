import { useState, useRef, useEffect } from "react";
import styles from "./Home.module.css"; // CSS Modules をインポート

export default function Home() {
  const [mode, setMode] = useState("casual");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(""); // 文字起こしデータ
  const recognitionRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = () => {
      stopRecording();
    };

    if (isRecording) {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isRecording]);

  // 録音開始（リアルタイム音声認識）
  const startRecording = () => {
    setIsRecording(true);

    // Web Speech API の設定
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("このブラウザは音声認識をサポートしていません");
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // 英語認識
    recognition.continuous = true; // 継続的に録音
    recognition.interimResults = true; // リアルタイムで結果を取得

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = 0; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript + " ";
      }
      setTranscript(finalText.trim()); // 認識結果を保存
    };

    recognition.onerror = (event) => {
      console.error("音声認識エラー:", event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 録音停止
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className={styles.container}>
      {/* モード切り替え */}
      <select className={styles.modeSelector} value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="casual">カジュアル</option>
        <option value="formal">フォーマル</option>
      </select>

      {/* タイトル */}
      <h1 className={styles.title}>英会話アシスタント</h1>

      {/* 録音ボタン */}
      <button
        className={styles.recordButton}
        onMouseDown={startRecording}
        onTouchStart={startRecording}
      >
        🎤
      </button>

      {/* モーダル（録音中） */}
      {isRecording && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>録音中...</h2>
            <div className={styles.recordingIndicator}></div>
          </div>
        </div>
      )}

      {/* リアルタイムのテキスト表示 */}
      {transcript && (
        <div className={styles.textContainer}>
          <h3>音声認識結果:</h3>
          <p className={styles.transcript}>{transcript}</p>
        </div>
      )}
    </div>
  );
}