import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap";
import { Bar, Line, Pie } from "react-chartjs-2";
import teamManagementService from "../../services/team.management.service";
import leaderboardService from "../../services/leaderboard.service";
import NotificationService from "../../services/notification.service";
import { GetAllUsers } from "../../services/user.service";
import { useParams, useNavigate } from "react-router-dom";

const TeamDashboardPage = () => {
  const currentUserId = localStorage.getItem("UserId");
  const isAdmin = localStorage.getItem('isAdmin');
  const { id } = useParams();
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedActionUser, setSelectedActionUser] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [teamStatistics, setTeamStatistics] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    pointsEarned: 0,
  });
  const [gameHistory, setGameHistory] = useState([]);
  const [gameLabels, setGameLabels] = useState([]);
  const [gamePoints, setGamePoints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    updateTeamData();
    const interval = setInterval(() => {
      // Fetch team data by id and populate the state
      updateTeamData();
    }, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [id, selectedUser, selectedActionUser, currentUserId]);

  const updateTeamData = async () => {
    fetchTeamData(id)
        .then((teamData) => {
          setTeamName(teamData.name);
          setTeamMembers(teamData.members);
          setTeamStatistics({
            gamesPlayed: teamData.gamesPlayed,
            wins: teamData.wins,
            losses: teamData.losses,
            pointsEarned: teamData.pointsEarned,
          });
        })
        .catch((error) => console.error("Error fetching team data:", error));

      // Fetch game history data
      fetchGameHistory(id)
        .then((historyData) => setGameHistory(historyData))
        .catch((error) => console.error("Error fetching game history:", error));

      fetchAllUsers()
        .then((users) => setAllUsers(users))
        .catch((error) => console.error("Error fetching all users:", error));
  }

  const fetchTeamData = async (teamId) => {
    const response = await teamManagementService.getTeamById(teamId);
    console.log(response);
    return response.data;
  };

  const fetchAllUsers = async () => {
    try {
      const response = await GetAllUsers();
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  };

  const convertTimestampToDate = (timestamp) => {
    const seconds = timestamp._seconds;
    const milliseconds = timestamp._nanoseconds / 1000000; // Convert nanoseconds to milliseconds
    const totalMilliseconds = seconds * 1000 + milliseconds;
    return new Date(totalMilliseconds);
  };

  const fetchGameHistory = async (teamId) => {
    try {
      const response = await leaderboardService.getLeaderboardByEntityId({
        entityId: teamId,
      });
      setGameLabels(
        response.data[0].statistics.map((game, index) => `Game ${index + 1}`)
      );
      setGamePoints(response.data[0].statistics.map((game) => game.totalScore));
      return response.data[0].statistics;
    } catch (error) {
      console.error("Error fetching game history:", error);
      return [];
    }
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const barChartData = {
    labels: ["Games Played", "Wins", "Losses", "Points Earned"],
    datasets: [
      {
        label: "Team Statistics",
        data: [
          teamStatistics.gamesPlayed,
          teamStatistics.wins,
          teamStatistics.losses,
          teamStatistics.pointsEarned,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 205, 86, 0.5)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: gameLabels,
    datasets: [
      {
        label: "Points Earned",
        data: gamePoints,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Wins", "Losses"],
    datasets: [
      {
        data: [teamStatistics.wins, teamStatistics.losses],
        backgroundColor: ["rgba(54, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  const handleInviteMember = async () => {
    if (selectedUser) {
      const user = allUsers.find((user) => user.id === selectedUser);
      const newInvitation = {
        userId: user.id,
        email: user.email,
        addedBy: currentUserId,
        role: "user",
        status: "pending",
      };

      const currentUser = allUsers.find(
        (user) => user.id === localStorage.getItem("UserId")
      );

      const notificationMsg = {
        type: "sendInvite",
        userId: user.id,
        invitationFromUserId: localStorage.getItem("UserId"),
        invitationFromUserName:
          currentUser.given_name + " " + currentUser.family_name,
        teamID: id,
        teamName: teamName,
        message: `You are invited by ${currentUser.given_name} ${currentUser.family_name} to join ${teamName} team`,
      };

      try {
        await teamManagementService.sendInvite(id, newInvitation);
        await NotificationService.PublishNotification(notificationMsg);
        const response = await fetchTeamData(id);
        console.log(response);
        setTeamMembers(response.members);
        setSelectedUser("");
        setShowInviteModal(false);
      } catch (error) {
        console.error("Error sending invitation:", error);
      }
    }
  };

  const handleActionExecute = async () => {
    if (selectedActionUser && selectedAction) {
      try {
        if (selectedAction === "remove") {
          await teamManagementService.deleteMember(id, selectedActionUser);
          const memInfo = teamMembers.find((member) => member.id === selectedActionUser);
          await NotificationService.PublishNotification({
            type:"deleteMember",
            userId: memInfo.userId,
            teamName: teamName,
            message: `You are no longer part of the ${teamName}`
          });
        } else if (selectedAction === "promote") {
          await teamManagementService.updateMember(id, selectedActionUser, {
            role: "admin",
          });
          const memInfo = teamMembers.find((member) => member.id === selectedActionUser);
          await NotificationService.PublishNotification({
            type:"updateMember",
            userId: memInfo.userId,
            teamName: teamName,
            message: `You have been promoted as admin for team ${teamName}`
          });
        } else if (selectedAction === "user") {
          await teamManagementService.updateMember(id, selectedActionUser, {
            role: "user",
          });
          const memInfo = teamMembers.find((member) => member.id === selectedActionUser);
          await NotificationService.PublishNotification({
            type:"updateMember",
            userId: memInfo.userId,
            teamName: teamName,
            message: `You have been demoted as user for team ${teamName}`
          });
        }

        setSelectedActionUser("");
        setSelectedAction("");
        setShowActionModal(false);
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <h2>Team Dashboard</h2>
          <h4>Team: {teamName}</h4>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Tabs defaultActiveKey="stats" id="team-tabs">
            <Tab eventKey="stats" title="Team Statistics">
              <Row className="mt-5">
                <Col>
                  <h4>Win-Loss Ratio</h4>
                  <div style={{ height: "300px", width: "100%" }}>
                    <Pie data={pieChartData} options={chartOptions} />
                  </div>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col>
                  <h4>Team Statistics</h4>
                  <div style={{ height: "300px", width: "100%" }}>
                    <Bar data={barChartData} options={chartOptions} />
                  </div>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col>
                  <h4>Points Earned Over Time</h4>
                  <div style={{ height: "300px", width: "100%" }}>
                    <Line data={lineChartData} options={chartOptions} />
                  </div>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="members" title="Manage Members">
              <Row className="mt-3">
                <Col xs={12} md={6}>
                  <Button
                    variant="primary"
                    onClick={() => setShowInviteModal(true)}
                  >
                    Invite Member
                  </Button>
                  <Modal
                    show={showInviteModal}
                    onHide={() => setShowInviteModal(false)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Invite Team Member</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Group>
                        <Form.Label>Select a user to invite</Form.Label>
                        <Form.Control
                          as="select"
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                        >
                          <option value="">Select a user...</option>
                          {allUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                              {`${user.given_name} ${user.family_name} - ${user.email}`}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => setShowInviteModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleInviteMember}>
                        Send Invitation
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col>
                  <h4>Invited Members</h4>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers ? (
                        teamMembers
                          .filter((member) => member.status !== "accepted")
                          .map((member) => {
                            return (
                              <tr key={member.userId}>
                                <td>{member.email}</td>
                                <td>{member.status}</td>
                                <td>{member.role}</td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td colSpan="3">No Invitation found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col>
                  <h4>Team Members</h4>
                  <Button onClick={() => setShowActionModal(true)} disabled={isAdmin !== 'true'}>
                    Perform Action
                  </Button>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers ? (
                        teamMembers
                          .filter((member) => member.status === "accepted")
                          .map((member) => {
                            const user = allUsers.find(
                              (user) => user.id === member.userId
                            );
                            const memberName = user
                              ? `${user.given_name} ${user.family_name}`
                              : "Unknown User";
                            return (
                              <tr key={member.id}>
                                <td>{memberName}</td>
                                <td>{member.role}</td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td colSpan="3">No members found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Modal
                    show={showActionModal}
                    onHide={() => setShowActionModal(false)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Perform Action</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Group>
                        <Form.Label>Select User:</Form.Label>
                        <Form.Control
                          as="select"
                          value={selectedActionUser}
                          onChange={(e) =>
                            setSelectedActionUser(e.target.value)
                          }
                        >
                          <option value="">Select a user...</option>
                          {teamMembers
                            .filter((member) => member.status === "accepted")
                            .map((member) => (
                              <option key={member.id} value={member.id}>
                                {`${member.email}`}
                              </option>
                            ))}
                        </Form.Control>
                      </Form.Group>
                      <div className="mt-3"></div>
                      <Form.Group>
                        <Form.Label>Select Action:</Form.Label>
                        <Form.Control
                          as="select"
                          value={selectedAction || ""}
                          onChange={(e) => setSelectedAction(e.target.value)}
                        >
                          <option value="">Select an action</option>
                          <option value="remove">Remove</option>
                          <option value="user">User</option>
                          <option value="promote">Promote to Admin</option>
                        </Form.Control>
                      </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => setShowActionModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant={
                          selectedAction === "remove" ? "danger" : "info"
                        }
                        onClick={handleActionExecute}
                      >
                        Confirm
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="gameHistory" title="Game Play History">
              <Row className="mt-5">
                <Col>
                  <h4>Game Play History</h4>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Result</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameHistory ? (
                        gameHistory.map((game) => (
                          <tr key={game.id}>
                            <td>{game.id.substr(game.id.length - 6)}</td>
                            <td>
                              {convertTimestampToDate(
                                game.created_at
                              ).toLocaleString()}
                            </td>
                            <td>{game.category}</td>
                            <td>{game.result}</td>
                            <td>{game.totalScore}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No games played so far</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="exploreLobby" title="Explore Game Lobby">
              <Row className="mt-5">
                <Col className="d-flex justify-content-center">
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/lobby/" + id)}
                    >
                      View Lobby
                    </button>
                  </div>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default TeamDashboardPage;
