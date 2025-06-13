import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // Home.js から受け取ったデータ
  const { transcript, responseCasual, responseFormal } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">結果画面</h1>

      {/* ユーザーの質問 */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-lg mb-4">
        <h2 className="text-lg font-semibold">あなたの質問:</h2>
        <p className="text-gray-300">{transcript || "（質問がありません）"}</p>
      </div>

      {/* カジュアルな返答 */}
      <div className="bg-blue-800 p-4 rounded-lg shadow-md w-full max-w-lg mb-4">
        <h2 className="text-lg font-semibold">カジュアルな返答:</h2>
        <p className="text-gray-200">{responseCasual || "（返答なし）"}</p>
      </div>

      {/* フォーマルな返答 */}
      <div className="bg-green-800 p-4 rounded-lg shadow-md w-full max-w-lg mb-6">
        <h2 className="text-lg font-semibold">フォーマルな返答:</h2>
        <p className="text-gray-200">{responseFormal || "（返答なし）"}</p>
      </div>

      {/* 戻るボタン */}
      <button
        className="bg-gray-700 px-6 py-2 rounded text-white hover:bg-gray-600 transition-all"
        onClick={() => navigate("/")}
      >
        ホームに戻る
      </button>
    </div>
  );
}