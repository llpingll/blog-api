/* eslint-disable react/prop-types */
import Input from "../Input";
import Button from "../Button";
import styled from "styled-components";
import Error from "../Error";

const PostForm = ({ values, handleChange, handleSubmit, errors, form }) => {
  return (
    <FormContainer>
      <div className="heading">
        {form === "new" ? (
          <>
            <h2>Create New Post</h2>
          </>
        ) : (
          <>
            <h2>Edit Post</h2>
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
        <Button
          type="submit"
          value={form === "new" ? "Add Post" : "Edit Post"}
        />
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 90%;
  max-width: 800px;
  gap: var(--24px);
  flex-grow: 1;
  justify-content: center;
  padding: var(--24px) 0;
  align-self: center;

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

export default PostForm;
