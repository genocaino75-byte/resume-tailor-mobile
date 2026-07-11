import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./SplashScreen";
import WelcomeScreen from "./WelcomeScreen";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import HomeScreen from "./HomeScreen";
import TailorScreen from "./TailorScreen";
import ResultsScreen from "./ResultsScreen";
import ProfileScreen from "./ProfileScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/tailor" element={<TailorScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
