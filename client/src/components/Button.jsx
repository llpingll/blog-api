import styled from "styled-components";

// eslint-disable-next-line react/prop-types
const Button = ({ value, type }) => {
  return <ButtonGeneric type={type}>{value}</ButtonGeneric>;
};

const ButtonGeneric = styled.button`
  font-size: var(--16px);
  padding: 1rem;
  border-radius: 0.8rem;
  background-image: linear-gradient(to right, #4299e1, #3182ce, #2b6cb0);
  color: white;
  font-weight: 600;
`;

export default Button;
