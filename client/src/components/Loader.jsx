import styled from "styled-components";

const Loader = () => {
  return (
    <Container>
      <div className="loader"></div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;

  .loader {
    --w: 10ch;
    font-weight: bold;
    font-family: monospace;
    font-size: 30px;
    letter-spacing: var(--w);
    width: var(--w);
    overflow: hidden;
    white-space: nowrap;
    text-shadow: calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0,
      calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0,
      calc(-9 * var(--w)) 0;
    animation: l16 2s infinite;
  }
  .loader:before {
    content: "Loading...";
  }
  @keyframes l16 {
    20% {
      text-shadow: calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0 red,
        calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0 #ffa516,
        calc(-5 * var(--w)) 0 #63fff4, calc(-6 * var(--w)) 0,
        calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0 green,
        calc(-9 * var(--w)) 0;
    }
    40% {
      text-shadow: calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0 red,
        calc(-3 * var(--w)) 0 #e945e9, calc(-4 * var(--w)) 0,
        calc(-5 * var(--w)) 0 green, calc(-6 * var(--w)) 0 orange,
        calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0 green,
        calc(-9 * var(--w)) 0;
    }
    60% {
      text-shadow: calc(-1 * var(--w)) 0 lightblue, calc(-2 * var(--w)) 0,
        calc(-3 * var(--w)) 0 #e945e9, calc(-4 * var(--w)) 0,
        calc(-5 * var(--w)) 0 green, calc(-6 * var(--w)) 0,
        calc(-7 * var(--w)) 0 yellow, calc(-8 * var(--w)) 0 #ffa516,
        calc(-9 * var(--w)) 0 red;
    }
    80% {
      text-shadow: calc(-1 * var(--w)) 0 lightblue, calc(-2 * var(--w)) 0 yellow,
        calc(-3 * var(--w)) 0 #63fff4, calc(-4 * var(--w)) 0 #ffa516,
        calc(-5 * var(--w)) 0 red, calc(-6 * var(--w)) 0,
        calc(-7 * var(--w)) 0 grey, calc(-8 * var(--w)) 0 #63fff4,
        calc(-9 * var(--w)) 0;
    }
  }
`;

export default Loader;
