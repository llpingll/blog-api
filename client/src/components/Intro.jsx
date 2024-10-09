import techImage from "../assets/tech.png";
import styled from "styled-components";

const Intro = () => {
  return (
    <IntroContainer>
      <div>
        <div className="heading">
          <h2>
            <span>Welcome to</span>
            <span className="color">The Blog API</span>
          </h2>
        </div>
        <div>
          <p>
            Hello My name is Lui and this blog site is a RESTful API that was
            build using nodeJS/express for the backend services, integrating
            passportJS/JWT for user authentication, bcryptJS for securing
            passwords and MongoDB/Mongoose database, and the frontend was built
            with React for a seamless user experience.
          </p>
        </div>
      </div>
      <img src={techImage} alt="coding-image" />
    </IntroContainer>
  );
};

const IntroContainer = styled.div`
  display: flex;
  /* max-height: 30rem; */
  padding: var(--24px);
  gap: 1rem;
  font-size: 1.15rem;
  max-height: 31rem;

  > div {
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 2rem;
    padding: 0 var(--32px);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  }

  .heading h2 {
    display: flex;
    flex-direction: column;
    font-size: 2rem;
  }

  .color {
    background-image: linear-gradient(
      to right,
      #3182ce,
      #55a2e0,
      #d4702e,
      #d4472e
    );
    color: transparent;
    background-clip: text;
    width: max-content;
  }

  img {
    object-fit: cover;
    width: auto;
    height: auto;
    border-radius: 2rem;
    max-width: 40%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  }
`;

export default Intro;
