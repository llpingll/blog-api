// eslint-disable-next-line react/prop-types
const Input = ({ name, value, handleChange, type }) => {
  return (
    <label>
      <input name={name} value={value} onChange={handleChange} type={type} />
    </label>
  );
};

export default Input;
