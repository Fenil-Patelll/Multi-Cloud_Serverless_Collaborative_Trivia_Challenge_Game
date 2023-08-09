import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown, Table } from "react-bootstrap";
import leaderBoardService from "../../services/leaderboard.service";
import teamManagementService from "../../services/team.management.service";
import { GetUserById } from "../../services/user.service";

const LeaderboardPage = () => {
  const [leaderboardType, setLeaderboardType] = useState("individual");
  const [timeInterval, setTimeInterval] = useState("all-time");
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboardType, timeInterval]);

  const fetchLeaderboard = async () => {
    try {
      const response = await leaderBoardService.filterLeaderboardByTimeFrame({
        timeFrame: timeInterval,
      });
      console.log(response.data);
      const filteredData = response.data.filter(
        (item) => item.entityType === leaderboardType
      );

      const fetchEntityDetails = filteredData.map(async (entry) => {
        if (entry.entityType === "team") {
          const tresponse = await teamManagementService.getTeamById(
            entry.entityId
          );
          return {
            id: entry.entityId,
            name: tresponse.data ? tresponse.data.name : "Unknown Team",
            gamesPlayed: entry.gamesPlayed,
            totalPoints: entry.totalPoints,
            wins: entry.wins,
            winPercentage: entry.winPercentage,
          };
        } else {
          const tresponse = await GetUserById(entry.entityId);
          return {
            id: entry.entityId,
            name: tresponse.data
              ? `${tresponse.data.given_name} ${tresponse.data.family_name}`
              : "Unknown User",
            gamesPlayed: entry.gamesPlayed,
            totalPoints: entry.totalPoints,
            wins: entry.wins,
            winPercentage: entry.winPercentage,
          };
        }
      });

      const resolvedEntityDetails = await Promise.all(fetchEntityDetails);

      // Sort the resolvedEntityDetails by totalPoints in descending order
      const sortedLeaderboardData = resolvedEntityDetails.sort(
        (a, b) => b.totalPoints - a.totalPoints
      );

      console.log(sortedLeaderboardData);

      setLeaderboardData(sortedLeaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleLeaderboardTypeChange = (type) => {
    setLeaderboardType(type);
  };

  const handleTimeIntervalChange = (interval) => {
    setTimeInterval(interval);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Leaderboard</h1>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              {leaderboardType === "individual" ? "Individual" : "Team"}{" "}
              Leaderboard
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => handleLeaderboardTypeChange("individual")}
              >
                Individual
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleLeaderboardTypeChange("team")}
              >
                Team
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              {timeInterval === "all-time"
                ? "All Time"
                : timeInterval.charAt(0).toUpperCase() + timeInterval.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleTimeIntervalChange("daily")}>
                Daily
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleTimeIntervalChange("weekly")}>
                Weekly
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleTimeIntervalChange("monthly")}
              >
                Monthly
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleTimeIntervalChange("all-time")}
              >
                All Time
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3>
            {leaderboardType === "individual" ? "Individual" : "Team"}{" "}
            Leaderboard
          </h3>
          <Table striped bordered style={{ marginTop: "30px" }}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>GamesPlayed</th>
                <th>Wins</th>
                <th>WinsPecentage</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr key={entry.id}>
                  <td>
                    {index + 1 === 1 ? (
                      <img
                        style={{ width: "30px", height: "30px" }}
                        src={require("../../assets/gold.png")}
                        alt="trophy"
                      />
                    ) : index + 1 === 2 ? (
                      <img
                        style={{ width: "30px", height: "30px" }}
                        src={require("../../assets/silver.png")}
                        alt="trophy"
                      />
                    ) : index + 1 === 3 ? (
                      <img
                        style={{ width: "30px", height: "30px" }}
                        src={require("../../assets/bronze.png")}
                        alt="trophy"
                      />
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td>{entry.name}</td>
                  <td>{entry.totalPoints}</td>
                  <td>{entry.gamesPlayed}</td>
                  <td>{entry.wins}</td>
                  <td>{entry.winPercentage.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default LeaderboardPage;
