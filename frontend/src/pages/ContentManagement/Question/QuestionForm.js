import React, { useState } from "react";
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import questionCategories from "../questionCategories";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const BASE_URL = `${process.env.REACT_APP_CONTENT_MANAGEMENT_BASE_URL}`;

const QuestionForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        category: "",
        difficulty: "",
        question: "",
        options: [],
        correctAnswer: "",
        explanation: "",
        points: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'points') {
            if (value === '' || (Number.isInteger(+value) && +value >= 0)) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: +value,
                }));
            }
        } else if (name.startsWith('option')) {
            const optionNumber = parseInt(name.slice(-1)); // Get the option number (1, 2, 3, or 4) from the input name
            setFormData((prevData) => ({
                ...prevData,
                options: [
                    ...prevData.options.slice(0, optionNumber - 1), // Copy options before the changed option
                    value, // Update the changed option
                    ...prevData.options.slice(optionNumber), // Copy options after the changed option
                ],
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormDataValid = Object.values(formData).every(value => {
            if (Array.isArray(value)) {
                return value.every(option => option.trim() !== "");
            }
            if (typeof value === 'string') return value.trim() !== "";
            if (typeof value === 'number') return value >= 0;
            toast.success('Question added successfully!');
            navigate('/profile');
            return true;
        });

        if (!isFormDataValid) {
            alert('Please fill out all fields before submitting.');
            return;
        }

        try {
            const url = `${BASE_URL}/questions`;
            const response = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                toast.error('There was an issue submitting your form.');
                throw new Error('An error occurred');
            }
            toast.success('Your form was submitted successfully!')
        } catch (err) {
            console.error(err);
            toast.error('There was an issue submitting your form.');
        }
    };

    return (
        <Container className="my-4">
            <Row>
                <Col>
                    <Card className="shadow">
                        <Card.Header as="h2" className="text-center">Create Question</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="questionCategory">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select category</option>
                                        {questionCategories().map((category, index) => (
                                            <option key={category.label} value={category.label}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="questionDifficulty">
                                    <Form.Label>Difficulty</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select difficulty</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="questionQuestion">
                                    <Form.Label>Question</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="question"
                                        rows={4}
                                        value={formData.question}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="option1">
                                    <Form.Label>Option 1</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="option1"
                                        value={formData.options[0]} // Update the value prop here
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="option2">
                                    <Form.Label>Option 2</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="option2"
                                        value={formData.options[1]} // Update the value prop here
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="option3">
                                    <Form.Label>Option 3</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="option3"
                                        value={formData.options[2]}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="option4">
                                    <Form.Label>Option 4</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="option4"
                                        value={formData.options[3]}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="correctAnswer">
                                    <Form.Label>Correct Answer</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="correctAnswer"
                                        value={formData.correctAnswer}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select correct answer</option>
                                        <option value={formData.options[0]}>{formData.options[0]}</option>
                                        <option value={formData.options[1]}>{formData.options[1]}</option>
                                        <option value={formData.options[2]}>{formData.options[2]}</option>
                                        <option value={formData.options[3]}>{formData.options[3]}</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="explanation">
                                    <Form.Label>Explanation</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="explanation"
                                        rows={4}
                                        value={formData.explanation}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="points">
                                    <Form.Label>Points</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="points"
                                        value={formData.points}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default QuestionForm;