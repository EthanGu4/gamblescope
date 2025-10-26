import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Homepage.css";

function Homepage() {
  const { signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // Sign up validation
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }

        // Email validation - must have @ and a period after @
        const emailParts = formData.email.split("@");
        if (emailParts.length !== 2 || !emailParts[1].includes(".")) {
          setError(
            "Email must contain @ and a valid domain (e.g., name@example.com)",
          );
          setIsLoading(false);
          return;
        }

        const result = signUp({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          // New user created successfully - they will be redirected to market by App.js
          console.log("New user created, will redirect to market");
        } else {
          setError(result.error);
        }
      } else {
        // Sign in
        const result = signIn({
          username: formData.username,
          password: formData.password,
        });

        if (!result.success) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="homepage">
      <div className="homepage-container">
        <div className="welcome-section">
          <div className="logo">
            <div className="logo-container">
              <img 
                src="/images/gamblescope_logo.png" 
                alt="GambleScope" 
                className="logo-image"
              />
              <h1>GambleScope</h1>
            </div>
            <p className="tagline">get rich off gradescope</p>
          </div>

          <div className="features">
            <h2>Why GambleScope?</h2>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">🤑</span>
                <div>
                  <h3>Get Filthy Rich</h3>
                  <p>finally make some real cash</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💯</span>
                <div>
                  <h3>Makes Gradescope Fun</h3>
                  <p>No longer the boring gradescope you once knew</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔎</span>
                <div>
                  <h3>Insight</h3>
                  <p>See how your peers feel about recent midterms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-section">
          <div className="auth-card">
            <div className="auth-header">
              <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
              <p>
                {isSignUp
                  ? "Join GambleScope and start betting on test scores!"
                  : "Welcome back! Sign in to your account."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your username"
                />
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  type="button"
                  className="toggle-button"
                  onClick={toggleMode}
                >
                  {isSignUp ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
