import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";
import Input from "../components/Input";
import Button from "../components/Button";
import styled from "styled-components";

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
    <LoginContainer>
      <div className="heading">
        <h2>Welcome Back!</h2>
        <p>Please sign in to access your account</p>
      </div>
      <Form onSubmit={handleSubmit}>
        {errors && (
          <div className="errors">
            {errors.map((err, index) => (
              <p key={index}>{err.msg}</p>
            ))}
          </div>
        )}
        <Input
          name={"email"}
          value={email}
          handleChange={handleChange}
          type={"email"}
        />
        <Input
          name={"password"}
          value={password}
          handleChange={handleChange}
          type={"text"}
        />
        <Button type="submit" value={"Log In"} />
        <p className="signup-link">
          Not a member?{" "}
          <Link to={"/signup"}>
            <span>Sign up here.</span>
          </Link>
        </p>
      </Form>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  text-align: center;
  width: fit-content;
  gap: var(--24px);

  .heading {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    & h2 {
      font-size: var(--40px);
    }

    & p {
      font-size: 1.15rem;
    }
  }
`;

const Form = styled.form`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  display: flex;
  flex-direction: column;
  padding: var(--32px);
  gap: var(--24px);
  background-color: white;
  border-radius: var(--16px);

  .errors p {
    color: red;
  }

  button {
    align-self: center;
  }

  .signup-link {
    padding: var(--24px) 0 0 0;

    span {
      color: #4299e1;
    }
  }
`;

export default Login;
