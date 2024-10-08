import styled from "styled-components";

// eslint-disable-next-line react/prop-types
const Input = ({ name, value, handleChange, type }) => {
  return (
    <Label>
      <Legend className={value ? "filled" : ""}>{name}</Legend>
      <TxtInput
        name={name}
        value={value}
        onChange={handleChange}
        type={type}
        required
      />
    </Label>
  );
};

const Label = styled.label`
  position: relative;
`;

const Legend = styled.legend`
  position: absolute;
  top: 20%;
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

const TxtInput = styled.input`
  height: 2.5rem;
  border-radius: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.grey};
  padding: 0 var(--16px);

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
