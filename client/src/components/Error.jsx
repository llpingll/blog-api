/* eslint-disable react/prop-types */
import styled from "styled-components";

const Error = ({ errors }) => {
  return (
    <Err>
      {errors.map((err, index) => (
        <p key={index}>{err.msg}</p>
      ))}
    </Err>
  );
};

const Err = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: red;
  text-align: center;
`;

export default Error;
