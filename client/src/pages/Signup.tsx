import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ msg: string }[] | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      if (typeof error === "object" && error !== null && "errors" in error) {
        // Server returned error
        setErrors((error as { errors: { msg: string }[] }).errors);
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
    <UserForm
      values={[
        { name: "name", value: name, type: "text" },
        { name: "email", value: email, type: "email" },
        { name: "password", value: password, type: "text" },
      ]}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      errors={errors}
      form={"signup"}
    />
  );
};

export default Signup;
