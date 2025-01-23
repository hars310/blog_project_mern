import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RegisterPage from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateBlogWithImages from "./pages/CreateBlog";

const App = () => {
  return (
    <div className="bg-darkBackground text-black min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-blog" element={<CreateBlogWithImages />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
