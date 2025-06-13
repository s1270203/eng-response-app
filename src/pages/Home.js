import { useState, useRef } from "react";
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
  const [responses, setResponses] = useState([]); //複数の返答を保存
  const recognitionRef = useRef(null);

  // 録音の開始・停止を切り替える関数
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

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
      fetchChatGPTResponses(text); //3つの返答を取得
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

  // ChatGPT にテキストを送信し、3つの返答を取得
  const fetchChatGPTResponses = async (text) => {
    try {
      // ベースのシステムメッセージ（カジュアル or フォーマル）
      const baseMessage =
        mode === "casual"
          ? "You are a friendly native English speaker who responds in a fun, natural, and relaxed way, as if talking to a close friend. Use casual phrases, contractions, and slang where appropriate."
          : "You are a professional native English speaker who responds in a respectful, polite, and formal way, as if talking to a superior at work. Use professional vocabulary and proper grammar.";
  
      // 異なるバリエーションを出すためのプロンプトリスト
      const variations = [
        "Please provide a different response.",
        "Give me another way to say it.",
        "Offer a slightly unique response.",
      ];
  
      // 3つの異なるリクエストを作成
      const responsePromises = variations.map(async (variation) => {
        const chatResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: baseMessage },
            { role: "user", content: text },
            { role: "user", content: variation }, //各リクエストに異なるバリエーションを追加
          ],
        });
  
        return chatResponse.choices[0].message.content;
      });
  
      // すべてのリクエストを並列処理
      const responses = await Promise.all(responsePromises);
      setResponses(responses);
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

      {/* 録音ボタン（クリックで開始/停止） */}
      <button className={styles.recordButton} onClick={toggleRecording}>
        {isRecording ? "⏹️" : "🎤"}
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

      {/* AI の返答表示（3 つの例をリストで表示） */}
      {responses.length > 0 && (
        <div className={`${styles.responseContainer} ${mode === "casual" ? styles.casual : styles.formal}`}>
          <h3>{mode === "casual" ? "カジュアルな返答:" : "フォーマルな返答:"}</h3>
          <ul className={styles.responseList}>
            {responses.map((resp, index) => (
              <li key={index} className={styles.responseItem}>
                {resp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}