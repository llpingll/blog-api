import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";
import UserForm from "../components/UserForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const { state } = useLocation();

  const navigate = useNavigate();
  const { setToken } = useAuth();

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

      // Otherwise parse body, set token & redirect to homepage
      const data = await response.json();
      setToken(data.token);
      navigate(state?.path || "/");
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

  // Create form with inputs
  return (
    <>
      <UserForm
        values={[
          { name: "email", value: email, type: "email" },
          { name: "password", value: password, type: "text" },
        ]}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        errors={errors}
        form={"login"}
      />
    </>
  );
};

export default Login;
