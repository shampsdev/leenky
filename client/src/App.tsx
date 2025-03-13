import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutPage from "./pages/about.page";
import ChatPage from "./pages/chat.page";
import ChatsPage from "./pages/chats.page";
function App() {
  return (
    <>
      aboba
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
