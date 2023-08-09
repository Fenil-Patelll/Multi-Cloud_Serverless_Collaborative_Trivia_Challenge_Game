import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, Modal, Card } from 'react-bootstrap';
import axios from "axios";
import questionCategories from "../questionCategories";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_CONTENT_MANAGEMENT_BASE_URL;

const GameForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    difficulty: "",
    questions: [],
    timeLimit: "",
    name: "",
    participants: "",
    status: false,
  });

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [multiSelectOptions, setMultiSelectOptions] = useState([]);

  useEffect(() => {
    const fetchQuestionsByCategory = async () => {
      if (formData.category) {
        setIsLoading(true);
        try {
          const category = formData.category;
          const url = `${BASE_URL}/questions/category/${category}`;
          const response = await axios.get(url);
          setQuestions(response.data);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
        setIsLoading(false);
      }
    };

    fetchQuestionsByCategory();
  }, [formData.category]);

  // Initialize the options for MultiSelect after questions are fetched
  useEffect(() => {
    if (questions.length > 0) {
      let newMultiSelectOptions = questions.map((question) => ({
        label: question.question,
        value: question.questionId,
      }));
      setMultiSelectOptions(newMultiSelectOptions);
    }
  }, [questions]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue,
    }));
  };

  const handleQuestionSelection = (selectedQuestions) => {
    if (selectedQuestions.length === multiSelectOptions.length) {
      // When 'Select all' operation, put all questions in formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        questions,
      }));
    } else {
      // When not select all, filter questions from existing questions list
      setFormData((prevFormData) => ({
        ...prevFormData,
        questions: selectedQuestions.map((selectedQuestion) =>
          questions.find((question) => question.questionId === selectedQuestion.value)
        ),
      }));
    }
  };

  const validateForm = () => {
    const {
      category,
      difficulty,
      questions,
      timeLimit,
      name,
      participants,
    } = formData;

    if (
      category.trim() === "" ||
      difficulty.trim() === "" ||
      questions.length === 0 ||
      timeLimit.trim() === "" ||
      name.trim() === "" ||
      participants.trim() === ""
    ) {
      toast.error("All fields are required.");
      return false;
    }

    if (isNaN(participants) || isNaN(timeLimit)) {
      toast.error("Participants and Time limit should be numeric value.");
      return false;
    }

    if (participants <= 0 || timeLimit <= 0) {
      toast.error("Participants and Time limit should be greater than 0.");
      return false;
    }

    return true;
  };

  const submitGameData = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const url = `${BASE_URL}/games`;
      const response = await axios.post(url, formData);

      if (response.status === 200) {
        toast.success(`Game: ${formData.name} created`);
        setFormData({
          category: "",
          difficulty: "",
          questions: [],
          timeLimit: "",
          name: "",
          participants: "",
          status: false,
        });
      } else {
        throw new Error("An error occurred while creating the game.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the game");
      console.error(error);
    }
  };

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header as="h2" className="text-center">Create Game</Card.Header>
            <Card.Body>
              <Form onSubmit={submitGameData}>
                <Form.Group controlId="gameCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                  >
                    <option value="">Select category</option>
                    {questionCategories().map((category, index) => (
                      <option key={category.label} value={category.label}>
                        {category.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="gameDifficulty">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Control
                    as="select"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleFormChange}
                  >
                    <option value="">Select difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="gameQuestions">
                  <Form.Label>Questions</Form.Label>
                  {isLoading ? (
                    <p>Loading questions...</p>
                  ) : (
                    <MultiSelect
                      options={multiSelectOptions}
                      hasSelectAll={true}
                      value={formData.questions.map((question) => ({
                        label: question.question,
                        value: question.questionId,
                      }))}
                      onChange={handleQuestionSelection}
                      labelledBy={"Select questions"}
                    />
                  )}
                </Form.Group>

                <Form.Group controlId="gameTimeLimit">
                  <Form.Label>Time Limit (seconds)</Form.Label>
                  <Form.Control
                    name="timeLimit"
                    type="number"
                    placeholder="Time limit per question"
                    min="1"
                    value={formData.timeLimit}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="gameName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter game name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="gameParticipants">
                  <Form.Label>Participants</Form.Label>
                  <Form.Control
                    name="participants"
                    type="number"
                    placeholder="Number of participants"
                    min="1"
                    value={formData.participants}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="gameStatus">
                  <Form.Check
                    name="status"
                    type="checkbox"
                    label="Game Active"
                    checked={formData.status}
                    onChange={handleFormChange}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Create Game
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GameForm;