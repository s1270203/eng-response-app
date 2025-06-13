# 英会話サポートアプリ（English Response App）
このアプリは、英語の質問に対してカジュアル・フォーマルの2パターンでAIによる返答を提示するReactアプリです。  
英語学習者が即座に適切な表現を学ぶことを目的としています。

---

## 主な機能
- ユーザーの発話を音声認識でテキストに変換
- 質問すると、AIが英語での返答例を生成
- 「カジュアル」または「フォーマル」な返答スタイルを選択可能
- スマホにも対応したシンプルなUI

---

## 使用技術
- **React（JavaScript）**：ユーザーインターフェース構築
- **Web Speech API**（`SpeechRecognition`）：音声認識
- **OpenAI API**：英語返答の生成
- **AWS Amplify Hosting**：アプリのホスティング

---

## セットアップ手順（ローカル環境）
```bash
git clone https://github.com/s1270203/eng-response-app.git
cd eng-response-app
npm install
npm start
```

開発サーバーが起動したら、ブラウザで `http://localhost:3000` にアクセスします。

---

## アーキテクチャ構成図
```text
[React アプリ]
        │
        ▼
[Web Speech API（SpeechRecognition）]
        │
        ▼
[OpenAI API（fetchで直接呼び出し）]
        │
        ▼
[AIによる返答（カジュアル／フォーマル）]
```

- AWS Amplify Hosting によりGitHubから自動デプロイ
- バックエンドサーバーやAPI Gateway、Lambdaなどは使用していません

---

## 音声入力の仕組み
- `window.SpeechRecognition`（Web Speech API）を利用して、マイク音声をリアルタイムでテキストに変換
- 音声ファイルそのものは取得しておらず、録音（保存）は行っていません

---

## 今後の展望
- GPTプロンプトの最適化
- UIの改善やデザインの向上