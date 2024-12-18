/* eslint-disable react/prop-types */
import Input from "./Input";
import Button from "./Button";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Error from "./Error";

type FormProps = {
  values: {
    name: string;
    value: string;
    type: "text" | "textarea" | "url" | "checkbox" | "email";
  }[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: { msg: string }[] | null;
  form: "signup" | "login";
};

const UserForm = ({
  values,
  handleChange,
  handleSubmit,
  errors,
  form,
}: FormProps) => {
  // Create form with inputs
  return (
    <LoginContainer>
      <div className="heading">
        {form === "login" ? (
          <>
            <h2>Welcome Back!</h2>
            <p>Please sign in to access your account.</p>
          </>
        ) : (
          <>
            <h2>Sign Up</h2>
            <p>to post comments and join the community!</p>
          </>
        )}
      </div>
      <Form onSubmit={handleSubmit}>
        {errors && <Error errors={errors} />}
        {values.map((input, index) => {
          return (
            <Input
              key={index}
              name={input.name}
              value={input.value}
              handleChange={handleChange}
              type={input.type}
            />
          );
        })}
        <Button type="submit" value={form === "login" ? "Log In" : "Sign Up"} />
        {form === "login" ? (
          <p className="link-to">
            Not a member?{" "}
            <Link to={"/signup"}>
              <span>Sign up here.</span>
            </Link>
          </p>
        ) : (
          <p className="link-to">
            Already a member?{" "}
            <Link to={"/login"}>
              <span>Sign in here.</span>
            </Link>
          </p>
        )}
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
  flex-grow: 1;
  justify-content: center;

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

  .link-to {
    padding: var(--24px) 0 0 0;

    span {
      color: #4299e1;
    }
  }
`;

export default UserForm;
