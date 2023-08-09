import React, { useState, useEffect } from "react";
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { css } from "@emotion/react";
import styled from '@emotion/styled';
import { getTeams,getUserById } from "../../services/games.service";


const HighlightedTableCell = styled(TableCell)`
    background-color: #62D2A2;
`;

const GlobalLeaderboard = ({ team1s, currentTeam }) => {
    // Sort teams by score in descending order
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    
console.log(currentTeam);

    useEffect(() => {
        const fetchTeamsAndUsers = async () => {
            const teamsResponse = await getTeams();
            setTeams(teamsResponse.data);

            const updatedCurrentTeam = teamsResponse.data.find(team => team.id === currentTeam.id);
            currentTeam = updatedCurrentTeam;

            const promises = currentTeam.members.map(member =>
                getUserById(member.userId).then(response => {
                    return { ...response.data.userData, ...response.data.gameData };
                })
            );
            const users = await Promise.all(promises);
            setUsers(users);
        };

        fetchTeamsAndUsers();
    }, [currentTeam]);

    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);



    return (
        <Container>
            <Typography variant="h2" css={css`margin-bottom: 1.5rem; font-size: 2.5rem;`}>Game Over</Typography>
            <Typography variant="h6">Final Team Scores:</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedTeams.map((team, index) => (
                            <TableRow key={team.name}>
                                <TableCell>{index + 1}</TableCell>
                                {team.name === currentTeam.name
                                    ? <HighlightedTableCell>{team.name}</HighlightedTableCell>
                                    : <TableCell>{team.name}</TableCell>}
                                <TableCell>{team.pointsEarned}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="h6" css={css`margin-top: 2rem;`}>Individual Scores in {currentTeam.name}:</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Member</TableCell>
                            <TableCell>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{index + 1}</TableCell>
                                <HighlightedTableCell>{user.given_name}</HighlightedTableCell>
                             
                                <TableCell>{user.totalPoints}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>


                </Table>
            </TableContainer>
        </Container>
    );
};

export default GlobalLeaderboard;
