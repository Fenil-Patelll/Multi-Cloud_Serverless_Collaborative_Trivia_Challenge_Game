import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import teamManagementService from '../../services/team.management.service';
import { useNavigate } from 'react-router-dom';
import { GetUserByUserId } from "../../services/user.service";

const CreateTeamPage = () => {
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

  const generateTeamName = async () => {
    try {
      const response = await teamManagementService.generateTeamName();
      setTeamName(response.data.teamName);
    } catch (error) {
      console.log("Failed to generate Team Name");
      setTeamName("Failed");
    }
  };

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  const handleCreateTeam = async () => {
    console.log('Creating team:', teamName);
    try {
      const userId = localStorage.getItem('UserId');
      const userResponse = await GetUserByUserId(userId);
      await teamManagementService.createTeam({name: teamName, userId: userId, email: userResponse.data.email});
      navigate(`/teamlist`);
    } catch (error) {
      console.log("Failed to create Team");
    }
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <h2>Create Team</h2>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} md={6}>
          <Form.Group>
            <Form.Label>Team Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter team name"
              value={teamName}
              onChange={handleTeamNameChange}
            />
          </Form.Group>
          <Button variant="primary" onClick={generateTeamName}>
            Generate Name
          </Button>{' '}
          <Button variant="success" onClick={handleCreateTeam}>
            Create Team
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTeamPage;
