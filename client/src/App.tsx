import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutPage from "./pages/about.page";
import ChatPage from "./pages/chat.page";
import ChatsPage from "./pages/chats.page";
import { initData } from "@telegram-apps/sdk-react";
function App() {
  return (
    <>
      <p className="overflow-auto flex  text-center">{initData.raw()}</p>
      <Router>
        <Routes>
          <Route path="/" Component={ChatsPage} />
          <Route path="/about" Component={AboutPage} />
          <Route path="/chat" Component={ChatPage} />
          <Route path="/chat/:chatId" Component={ChatPage} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
