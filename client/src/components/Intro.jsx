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
  margin: var(--24px);
  gap: 2rem;
  font-size: 1.15rem;
  max-height: 31rem;
  max-width: 1600px;
  background: white;
  border-radius: 2rem;
  padding: var(--32px);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  align-self: center;

  @media (max-width: 1100px) {
    font-size: 99.9999%;
  }

  @media (max-width: 750px) {
    flex-direction: column;
    max-height: 100%;
    align-items: center;
  }

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
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
    border-radius: 2rem;
    max-width: 40%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

    @media (max-width: 750px) {
      min-width: 100%;
      max-height: 25rem;
    }
  }
`;

export default Intro;
