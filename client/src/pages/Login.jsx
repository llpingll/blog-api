import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email,
      password,
    };

    const apiBaseUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check response
      if (!response.ok) {
        const err = await response.json();
        throw err;
      }

      // Otherwise store token in local storage and redirect to home page
    } catch (error) {
      if (error.errors) {
        // Error resonse from server
        setErrors(error);
      } else if (error instanceof TypeError) {
        // Network error
        setErrors([{ msg: "Network or server down, please check connection" }]);
      } else {
        // Unexpected error (All other errors)
        setErrors([
          { msg: "An unexpected error occurred. Please try again later." },
        ]);
      }
    }
  };

  // Create form with inputs
  return (
    <form onSubmit={handleSubmit}>
      {errors && (
        <div>
          {errors.map((err, index) => (
            <p key={index}>{err.msg}</p>
          ))}
        </div>
      )}
      <label>
        <input
          name="email"
          value={email}
          onChange={handleChange}
          type="email"
        />
      </label>
      <label>
        <input
          name="password"
          value={password}
          onChange={handleChange}
          type="text"
        />
      </label>
      <button type="submit">Signup</button>
    </form>
  );
};

export default Login;