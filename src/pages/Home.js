import { useState, useRef, useEffect } from "react";
import styles from "./Home.module.css";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Home() {
  const [mode, setMode] = useState("casual");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
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

  // 録音開始
  const startRecording = () => {
    setIsRecording(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("このブラウザは音声認識をサポートしていません");
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      fetchChatGPTResponse(text);
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

  // ChatGPT にテキストを送信し、返答を取得
  const fetchChatGPTResponse = async (text) => {
    try {
      const chatResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: mode === "casual"
              ? "You are a friendly native English speaker who responds in a natural and casual way."
              : "You are a professional native English speaker who responds formally and politely.",
          },
          { role: "user", content: text },
        ],
      });

      setResponse(chatResponse.choices[0].message.content);
    } catch (error) {
      console.error("ChatGPT API エラー:", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* モード切り替え */}
      <div className={styles.modeSelectorContainer}>
        <label className={styles.label}>モード:</label>
        <select className={styles.modeSelector} value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="casual">カジュアル</option>
          <option value="formal">フォーマル</option>
        </select>
      </div>

      {/* タイトル */}
      <h1 className={styles.title}>英会話アシスタント</h1>

      {/* 録音ボタン */}
      <button className={styles.recordButton} onMouseDown={startRecording} onTouchStart={startRecording}>
        録音
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

      {/* 録音テキスト表示 */}
      {transcript && (
        <div className={styles.textContainer}>
          <h3>あなたの質問:</h3>
          <p className={styles.transcript}>{transcript}</p>
        </div>
      )}

      {/* AI の返答表示 */}
      {response && (
        <div className={`${styles.responseContainer} ${mode === "casual" ? styles.casual : styles.formal}`}>
          <h3>{mode === "casual" ? "カジュアルな返答:" : "フォーマルな返答:"}</h3>
          <p className={styles.transcript}>{response}</p>
        </div>
      )}
    </div>
  );
}