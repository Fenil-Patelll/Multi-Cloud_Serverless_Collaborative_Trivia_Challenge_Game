import React, { useState, useEffect } from "react";
import teamManagementService from "../../services/team.management.service";
import NotificationService from "../../services/notification.service";
import { Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const TeamList = () => {
  const loggedInUserId = localStorage.getItem('UserId');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTeams();
    const interval = setInterval(fetchTeams, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTeams = async () => {
    try {
      const currentUserId = localStorage.getItem("UserId");
      const response = await teamManagementService.getAllTeams();
      const filteredTeams = response.data.filter(
        (team) =>
          team.userId === currentUserId ||
          team.members.some((member) => member.userId === currentUserId && member.status === "accepted")
      );
      setTeams(filteredTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const notifyMembers = async (teamId) => {
    try {
      const teamDetail = teams.find((team) => team.id === teamId);
      const notifications = teamDetail.members.map(async (member) => {
        await NotificationService.PublishNotification({
          type: "deleteTeam",
          userId: member.userId,
          teamName: teamDetail.name,
          message: `The team ${teamDetail.name} has been terminated`
        });
      });
  
      await Promise.all(notifications);
    } catch (error) {
      console.error("Error notifying deleting team:", error);
    }
  };  

  const handleDeleteTeam = async () => {
    try {
      await teamManagementService.deleteTeam(selectedTeam.id);
      await notifyMembers(selectedTeam.id);
      setTeams((prevTeams) =>
        prevTeams.filter((team) => team.id !== selectedTeam.id)
      );
      setSelectedTeam(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const openConfirmationModal = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const closeConfirmationModal = () => {
    setSelectedTeam(null);
    setShowModal(false);
  };

  return (
    <div className="row">
      <div className="col-md-12 mb-4 d-flex justify-content-end">
        <Link to="/createteam" className="btn btn-primary">
          Create New Team
        </Link>
      </div>
      {teams.map((team) => (
        <div key={team.id} className="col-md-4">
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{team.name}</Card.Title>
              <Link
                to={`/teamdashboard/${team.id}`}
                className="btn btn-primary mr-2"
              >
                View
              </Link>
              <Button variant="danger" onClick={() => openConfirmationModal(team)} disabled={loggedInUserId !== team.userId}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={closeConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedTeam?.name}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmationModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTeam}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeamList;
