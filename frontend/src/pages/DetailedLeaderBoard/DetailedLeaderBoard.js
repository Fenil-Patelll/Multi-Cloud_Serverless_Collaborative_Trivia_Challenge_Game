import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import leaderboardService from "../../services/leaderboard.service";

const DetailedStatisticsPage = () => {
  const [teamStatistics, setTeamStatistics] = useState([]);
  const [playerStatistics, setPlayerStatistics] = useState([]);

  useEffect(() => {
    fetchTeamStatistics();
    fetchPlayerStatistics();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const mockTeamStatistics = generateMockTeamStatistics();
      const mockPlayerStatistics = generateMockPlayerStatistics();

      setTeamStatistics(mockTeamStatistics);
      setPlayerStatistics(mockPlayerStatistics);
    }, 1000);
    return () => clearTimeout(delay);
  }, []);

  const generateMockTeamStatistics = () => {
    return [
      {
        entityId: "team1",
        totalPoints: 500,
        winPercentage: 75,
      },
      {
        entityId: "team2",
        totalPoints: 400,
        winPercentage: 60,
      },
      {
        entityId: "team3",
        totalPoints: 300,
        winPercentage: 45,
      },
    ];
  };

  const generateMockPlayerStatistics = () => {
    return [
      {
        entityId: "player1",
        totalPoints: 200,
        averageScore: 50,
        wins: 10,
        losses: 5,
      },
      {
        entityId: "player2",
        totalPoints: 150,
        averageScore: 30,
        wins: 7,
        losses: 8,
      },
      {
        entityId: "player3",
        totalPoints: 100,
        averageScore: 25,
        wins: 5,
        losses: 10,
      },
    ];
  };

  const fetchTeamStatistics = () => {
    leaderboardService
      .getGlobalLeaderboard()
      .then((response) => {
        const filteredData = response.data.filter(
          (item) => item.entityType === 'team'
        );
        setTeamStatistics(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching team statistics:", error);
      });
  };

  const fetchPlayerStatistics = () => {
    leaderboardService
      .getGlobalLeaderboard()
      .then((response) => {
        const filteredData = response.data.filter(
          (item) => item.entityType === 'player'
        );
        setPlayerStatistics(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching player statistics:", error);
      });
  };

  const renderTeamBarChart = () => {
    const labels = teamStatistics.map((team) => team.entityId);
    const totalPoints = teamStatistics.map((team) => team.totalPoints);
    const winPercentage = teamStatistics.map((team) => team.winPercentage);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Total Points",
          data: totalPoints,
          backgroundColor: "rgba(54, 162, 235, 0.8)",
        },
        {
          label: "Win Percentage",
          data: winPercentage,
          backgroundColor: "rgba(255, 99, 132, 0.8)",
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const renderPlayerLineChart = () => {
    const labels = playerStatistics.map((player) => player.entityId);
    const totalPoints = playerStatistics.map((player) => player.totalPoints);
    const averageScore = playerStatistics.map((player) => player.averageScore);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Total Points",
          data: totalPoints,
          backgroundColor: "rgba(54, 162, 235, 0.8)",
          borderColor: "rgba(54, 162, 235, 1)",
          fill: false,
        },
        {
          label: "Average Score",
          data: averageScore,
          backgroundColor: "rgba(255, 99, 132, 0.8)",
          borderColor: "rgba(255, 99, 132, 1)",
          fill: false,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  const renderPlayerDoughnutChart = () => {
    const labels = playerStatistics.map((player) => player.entityId);
    const wins = playerStatistics.map((player) => player.wins);
    const losses = playerStatistics.map((player) => player.losses);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Wins",
          data: wins,
          backgroundColor: "rgba(255, 99, 132, 0.8)",
        },
        {
          label: "Losses",
          data: losses,
          backgroundColor: "rgba(54, 162, 235, 0.8)",
        },
      ],
    };

    return <Doughnut data={data} />;
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Detailed Statistics</h1>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <iframe width="100%" height="830" src="https://lookerstudio.google.com/embed/reporting/97face70-ed72-4309-83cd-5821c2d6610b/page/PgxXD" frameBorder="0" style={{border:0}} allowFullScreen></iframe>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3>Top-performing Teams (Bar Chart)</h3>
          <div style={{ height: "400px", width: "100%" }}>
            {teamStatistics.length > 0 && renderTeamBarChart()}
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3>Top-performing Players (Line Chart)</h3>
          <div style={{ height: "400px", width: "100%" }}>
            {playerStatistics.length > 0 && renderPlayerLineChart()}
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3>Player Performance (Doughnut Chart)</h3>
          <div style={{ height: "400px", width: "100%" }}>
            {playerStatistics.length > 0 && renderPlayerDoughnutChart()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailedStatisticsPage;
