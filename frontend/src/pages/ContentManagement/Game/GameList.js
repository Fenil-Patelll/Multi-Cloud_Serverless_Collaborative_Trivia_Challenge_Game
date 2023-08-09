import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Modal, Card, ListGroup } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_CONTENT_MANAGEMENT_BASE_URL;

const GameList = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [multiSelectOptions, setMultiSelectOptions] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);
            try {
                const url = `${BASE_URL}/games`;
                const response = await axios.get(url);
                const allGames = response.data;
                const uniqueGames = Array.from(
                    new Set(allGames.map(game => game.gameId))
                ).map(id => allGames.find(game => game.gameId === id));
                setGames(uniqueGames);
            } catch (error) {
                console.error('Error fetching games: ', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, []);

    useEffect(() => {
        if (games.length > 0) {
            const uniqueCategories = [...new Set(games.map(game => game.category))];
            const newMultiSelectOptions = uniqueCategories.map(category => ({
                label: category,
                value: category,
            }));
            setMultiSelectOptions(newMultiSelectOptions);
        }
    }, [games]);

    useEffect(() => {
        if (selectedCategory.length > 0) {
            const newFilteredGames = games.filter(game =>
                selectedCategory.some(category => category.label === game.category)
            );
            setFilteredGames(newFilteredGames);
        } else {
            setFilteredGames(games);
        }
    }, [selectedCategory, games]);

    const handleDeleteClick = (gameId) => {
        setToBeDeleted(gameId);
        setShowDeleteConfirm(true);
    };

    const deleteGame = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/games/${toBeDeleted}`);
            if (response.status === 200 || response.status === 201 || response.status === 204) {
                setGames(games.filter(game => game.gameId !== toBeDeleted));
                setFilteredGames(filteredGames.filter(game => game.gameId !== toBeDeleted));
            }
        } catch (error) {
            console.error(`Error deleting game with id ${toBeDeleted}: `, error);
        } finally {
            setIsLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategory(selectedOptions);
    };
    const handleCreateGame = () => {
        navigate('/create-game');
    };


    return (
        <Container className="my-4">
            <Row>
                <Col>
                    <Card className="shadow">
                        <Card.Header as="h2" className="d-flex justify-content-between align-items-center">
                            <div>Game List</div>
                            <div>
                                <Button variant="primary" onClick={handleCreateGame}>
                                    Create Game
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="gameCategory">
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
                                    <Card.Text className="text-center">Loading games...</Card.Text>
                                ) : (
                                    filteredGames.map(gm => (
                                        <ListGroup.Item key={gm.gameId}>
                                            {gm.name}
                                            <Button variant="danger" size="sm" className="float-right" onClick={() => handleDeleteClick(gm.gameId)}>Delete</Button>
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
                            Are you sure you want to delete this game?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={deleteGame}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
};

export default GameList;