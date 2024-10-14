import styled from "styled-components";

// eslint-disable-next-line react/prop-types
const Input = ({ name, value, handleChange, type }) => {
  return (
    <Label>
      {type === "checkbox" ? (
        <div className="checkbox">
          <legend>{name}</legend>
          <CheckboxInput
            name={name}
            checked={value}
            onChange={handleChange}
            type={type}
          />
        </div>
      ) : (
        <>
          <Legend className={value ? "filled" : ""}>{name}</Legend>
          {type === "textarea" ? (
            <TextArea
              name={name}
              value={value}
              onChange={handleChange}
              required
            />
          ) : (
            <TxtInput
              name={name}
              value={value}
              onChange={handleChange}
              type={type}
              required
            />
          )}
        </>
      )}
    </Label>
  );
};

const Label = styled.label`
  position: relative;

  legend {
    color: #a7a7a7;
  }
`;

const Legend = styled.legend`
  position: absolute;
  top: 0.5rem;
  left: var(--16px);
  transition: 0.2s ease all;
  color: #a7a7a7;

  &.filled,
  ${Label}:focus-within & {
    top: -0.8rem;
    font-size: 0.9rem;
    color: #4299e1;
    background-color: white;
    padding: 0 0.4rem;
  }
`;

const CheckboxInput = styled.input`
  height: 2.5rem;
  border-radius: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.grey};
  padding: 0 var(--16px);
  width: 2rem;
`;

const TextArea = styled.textarea`
  height: 40vh;
  border-radius: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.grey};
  padding: var(--16px) var(--16px);
  width: 100%;
  max-width: 100%;
  overflow-y: scroll;

  /* Hide scrollbar in Chrome, Safari, Edge */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar in Firefox */
  scrollbar-width: none;

  &:focus {
    border: 2px solid #4299e1;
    background-color: white;
  }

  /* Prevent browser autofill styles */
  &:-webkit-autofill {
    background-color: white !important;
    -webkit-box-shadow: 0 0 0 30px white inset !important; /* Reset the background */
    -webkit-text-fill-color: black !important; /* Ensure the text color is visible */
  }

  &:-moz-autofill {
    background-color: white !important;
  }

  &:-ms-autofill {
    background-color: white !important;
  }
`;

const TxtInput = styled.input`
  height: 2.5rem;
  border-radius: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.grey};
  padding: 0 var(--16px);
  width: 100%;

  &:focus {
    border: 2px solid #4299e1;
    background-color: white;
  }

  /* Prevent browser autofill styles */
  &:-webkit-autofill {
    background-color: white !important;
    -webkit-box-shadow: 0 0 0 30px white inset !important; /* Reset the background */
    -webkit-text-fill-color: black !important; /* Ensure the text color is visible */
  }

  &:-moz-autofill {
    background-color: white !important;
  }

  &:-ms-autofill {
    background-color: white !important;
  }
`;

export default Input;
