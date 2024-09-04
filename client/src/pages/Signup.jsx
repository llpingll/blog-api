import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setName(value);
        break;
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
      name,
      email,
      password,
    };

    const apiBaseUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

    try {
      // Post data
      const response = await fetch(`${apiBaseUrl}/users`, {
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

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      if (error.errors) {
        // Server returned error
        setErrors(error.errors);
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
        <input name="name" value={name} onChange={handleChange} type="text" />
      </label>
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

export default Signup;
