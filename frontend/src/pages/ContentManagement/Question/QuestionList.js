import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, Card, ListGroup } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_CONTENT_MANAGEMENT_BASE_URL;

const QuestionList = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [multiSelectOptions, setMultiSelectOptions] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            try {
                const url = `${BASE_URL}/questions`;
                const response = await axios.get(url);
                const allQuestions = response.data;
                const uniqueQuestions = Array.from(
                    new Set(allQuestions.map(question => question.questionId))
                ).map(id => allQuestions.find(question => question.questionId === id));
                setQuestions(uniqueQuestions);
            } catch (error) {
                console.error('Error fetching questions:', error);
                toast.error('Error fetching questions.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            const uniqueCategories = [...new Set(questions.map(question => question.category))];
            const newMultiSelectOptions = uniqueCategories.map(category => ({
                label: category,
                value: category,
            }));
            setMultiSelectOptions(newMultiSelectOptions);
        }
    }, [questions]);

    useEffect(() => {
        if (selectedCategory.length > 0) {
            const newFilteredQuestions = Array.from(
                new Set(
                    questions
                        .filter(question => selectedCategory.some(category => category.label === question.category))
                        .map(question => question.questionId)
                )
            ).map(id => questions.find(question => question.questionId === id));
            setFilteredQuestions(newFilteredQuestions);
        } else {
            const newFilteredQuestions = Array.from(
                new Set(questions.map(question => question.questionId))
            ).map(id => questions.find(question => question.questionId === id));
            setFilteredQuestions(newFilteredQuestions);
        }
    }, [selectedCategory, questions]);

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategory(selectedOptions);
    };
    const handleDeleteClick = (questId) => {
        setToBeDeleted(questId);
        setShowDeleteConfirm(true);
    };
    const deleteQuestion = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/questions/${toBeDeleted}`);
            if (response.status === 200 || response.status === 201 || response.status === 204) {
                const newQuestions = questions.filter(question => question.questionId !== toBeDeleted);
                setQuestions(newQuestions);
                setFilteredQuestions(newQuestions);
            }
        } catch (error) {
            console.error(`Error deleting question with id ${toBeDeleted}: `, error);
        } finally {
            setIsLoading(false);
            setShowDeleteConfirm(false);
        }
    };
    const handleCreateQuestion = () => {
        navigate('/create-question');
    };

    return (
        <Container className="my-4">
            <Row>
                <Col>
                    <Card className="shadow">
                        <Card.Header as="h2" className="d-flex justify-content-between align-items-center">
                            <div>Question List</div>
                            <div>
                                <Button variant="primary" onClick={handleCreateQuestion}>
                                    Create Question
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="questionCategory">
                                    <Form.Label>Filter by Category</Form.Label>
                                    <MultiSelect
                                        options={multiSelectOptions}
                                        labelledBy={'Select category'}
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                    />
                                </Form.Group>
                            </Form>
                            <ListGroup variant="flush">
                                {isLoading ? (
                                    <Card.Text className="text-center">Loading questions...</Card.Text>
                                ) : (
                                    filteredQuestions.map(qstn => (
                                        <ListGroup.Item key={qstn.questionId}>
                                            {qstn.question}
                                            <Button variant="danger" size="sm" className="float-right" onClick={() => handleDeleteClick(qstn.questionId)}>Delete</Button>
                                        </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete confirmation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this question?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={deleteQuestion}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
};

export default QuestionList;