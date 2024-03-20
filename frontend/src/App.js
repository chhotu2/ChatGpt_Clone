import logo from "./logo.svg";
// import "./App.css";
import Navbar from "./components/Navbar";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import ForgetPassword from "./pages/ForgetPassword";
import { Toaster } from "react-hot-toast";
// import { token } from "morgan";
import Password from "./pages/Password"

function App() {
  return (
    <div className="App">
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/password-reset/:id" element={<Password/>} />
      </Routes>
    </div>
  );
}

export default App;
