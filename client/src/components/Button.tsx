import styled from "styled-components";

type ButtonProps = {
  value: string;
  type: "button" | "submit" | "reset";
  action?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Button = ({ value, type, action }: ButtonProps) => {
  return (
    <ButtonGeneric onClick={action} type={type}>
      {value}
    </ButtonGeneric>
  );
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
