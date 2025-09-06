import React, { useState } from "react";
import "../App.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="app-root">
      {/* Header */}
      <header className="header">
        <h1 className="header-title">Title of the Project</h1>
        <nav className="header-nav">
          <button>Home</button>
          <button>Solutions</button>
          <button>Work</button>
          <button>About</button>
          <button>Login</button>
          <button>Sign Up</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Create an account</h2>
            <a href="/login">log in instead</a>
          </div>

          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />

          <label className="form-label">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              required
            />
            <span>
              By creating an account, I agree to our{" "}
              <a href="/terms">Terms of use</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </span>
          </label>

          <button type="submit" className="form-button">
            Create an account
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="font-semibold">Company's Banner</div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="https://www.examplecompany.com/about">About Us</a>
            </li>
            <li>
              <a href="https://www.examplecompany.com/services">Services</a>
            </li>
            <li>
              <a href="https://www.examplecompany.com/contact">Contact</a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Connect with us</h4>
          <ul>
            <li>
              <a href="https://twitter.com/examplecompany">Twitter</a>
            </li>
            <li>
              <a href="https://linkedin.com/company/examplecompany">LinkedIn</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default RegisterForm;
