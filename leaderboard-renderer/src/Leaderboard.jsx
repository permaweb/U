import React, { useState } from "react";
import { styled } from "styled-components";

const LeaderboardContainer = styled.div`
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  font-family: "Arial", sans-serif;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 15px;
  cursor: pointer;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background-color: #34495e;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #212121;
    cursor: pointer;
  }
`;

const TableData = styled.td`
  padding: 15px;
  border-bottom: 1px solid #2c3e50;
  font-size: 16px;
  color: #ecf0f1;
`;

const PropertyContainer = styled.div`
  margin-top: 20px;
`;

const PropertyLabel = styled.span`
  color: #ecf0f1;
  font-weight: bold;
  margin-right: 10px;
`;

const PropertyValue = styled.span`
  color: #3498db;
`;

const ExploreU = ({ state, goToPlayer }) => {
  const { name, ticker, balances, settings, divisibility, owner } = state;
  const [sortBy, setSortBy] = useState("asc");

  // Convert balances object to an array and sort it
  const sortedBalances = Object.entries(balances).sort((a, b) => {
    const order = sortBy === "asc" ? 1 : -1;
    return order * (b[1] - a[1]);
  });

  const toggleSortOrder = () => {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
  };

  return (
    <LeaderboardContainer>
      <h1 style={{ color: "#ecf0f1", fontSize: "24px", marginBottom: "20px" }}>
        {name} Leaderboard ({ticker})
      </h1>
      <PropertyContainer>
        <PropertyLabel>Owner:</PropertyLabel>
        <PropertyValue>{owner}</PropertyValue>
      </PropertyContainer>
      <PropertyContainer>
        <PropertyLabel>Divisibility:</PropertyLabel>
        <PropertyValue>{divisibility}</PropertyValue>
      </PropertyContainer>
      {settings.map(([key, value]) => (
        <PropertyContainer key={key}>
          <PropertyLabel>{key}:</PropertyLabel>
          <PropertyValue>{value}</PropertyValue>
        </PropertyContainer>
      ))}
      <LeaderboardTable>
        <thead>
          <tr>
            <TableHeader onClick={toggleSortOrder}>Player</TableHeader>
            <TableHeader onClick={toggleSortOrder}>Balance</TableHeader>
          </tr>
        </thead>
        <tbody>
          {sortedBalances.map(([player, balance]) => (
            <TableRow key={player} onClick={() => goToPlayer(player)}>
              <TableData>{player}</TableData>
              <TableData>{(balance / 1e6).toFixed(2)}</TableData>
            </TableRow>
          ))}
        </tbody>
      </LeaderboardTable>
    </LeaderboardContainer>
  );
};

export default ExploreU;
