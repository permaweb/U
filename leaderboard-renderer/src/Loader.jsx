import React, { useEffect, useState } from "react";
import { styled, keyframes } from "styled-components";

// Static array of Arweave facts
const arweaveFacts = [
  "Arweave is a decentralized storage platform that enables permanent, low-cost data storage.",
  "AR is the native cryptocurrency of the Arweave network.",
  "Arweave uses a novel consensus algorithm called SPoRA",
  "Data stored on Arweave is immutable and cannot be altered or deleted.",
  "Arweave is often referred to as the Permaweb due to its permanent and decentralized nature and it's ease of composability.",
];

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.6;
  }
`;

const LoadingContainer = styled.div`
  background-color: #1a1a1a;
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

const LoadingText = styled.p`
  color: #ecf0f1;
  font-size: 18px;
  margin-bottom: 20px;
`;

const CoolEffect = styled.div`
  width: 80px;
  height: 80px;
  background-color: #3498db;
  border-radius: 50%;
  animation: ${pulseAnimation} 1s linear infinite;
`;

const ArweaveFact = styled.p`
  color: #ecf0f1;
  font-size: 14px;
  margin-top: 20px;
`;

const LoadingComponent = () => {
  const [randomFactIndex, setRandomFactIndex] = useState(0);

  useEffect(() => {
    // Change the displayed Arweave fact every 5 seconds
    const interval = setInterval(() => {
      setRandomFactIndex((prevIndex) => (prevIndex + 1) % arweaveFacts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingContainer>
      <LoadingText>Loading the state of the $U contract.</LoadingText>
      <CoolEffect />
      <ArweaveFact>Did you know? {arweaveFacts[randomFactIndex]}</ArweaveFact>
    </LoadingContainer>
  );
};

export default LoadingComponent;
