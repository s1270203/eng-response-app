import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* ホーム画面をルートに設定 */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;