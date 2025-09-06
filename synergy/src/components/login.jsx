import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/'); // Redirect to projects page after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-root">
      {/* Header */}
      <header className="login-header">
        <h1 className="login-header-title">Title of the Project</h1>
        <nav className="login-header-nav">
          <button>Home</button>
          <button>Solutions</button>
          <button>Work</button>
          <button>About</button>
          <button>Login</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="login-main-content">
        <form
          className="login-form-container"
          onSubmit={handleSubmit}
        >
          <div className="login-form-header">
            <h2>Login into account</h2>
            <Link to="/register" className="login-form-link">
              signup instead
            </Link>
          </div>
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="login-form-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-form-input"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <a href="/forgot-password" className="login-form-link">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="login-form-button"
          >
            Login
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/services" className="hover:underline">Services</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <p>© 2025 Your Company</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Connect with us</h4>
          <ul>
            <li><a href="https://twitter.com" className="hover:underline">Twitter</a></li>
            <li><a href="https://linkedin.com" className="hover:underline">LinkedIn</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default LoginForm;


