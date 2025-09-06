import React, { useState } from "react";
import RegisterForm from "./components/register.jsx";
import LoginForm from "./components/login.jsx";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return showLogin ? (
    <LoginForm />
  ) : (
    <RegisterForm onLoginClick={() => setShowLogin(true)} />
  );
}

export default App;