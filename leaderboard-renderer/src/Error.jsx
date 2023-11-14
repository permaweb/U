import React from "react";
import { styled } from "styled-components";

const ErrorContainer = styled.div`
  background-color: #c0392b;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  font-family: "Arial", sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ErrorText = styled.p`
  color: #ecf0f1;
  font-size: 18px;
  margin-bottom: 20px;
`;

const ErrorComponent = ({ errorMessage }) => (
  <ErrorContainer>
    <ErrorText>Oops! An error occurred.</ErrorText>
    <ErrorText>{errorMessage}</ErrorText>
  </ErrorContainer>
);

export default ErrorComponent;
