import {
  Box,
  Button,
  Fade,
  Grid,
  Grow,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import socket from "../../socket";
import Avatar from "../Avatar";
import { RoomContext } from "../Room";
import { getMyPlayer } from "../WaitingRoom/helpers";
import { calculatePlayerRoundScore } from "./helpers";

const WordResult = () => {
  const { gameState, players } = useContext(RoomContext);
  const scores = gameState.scores;
  const selections = gameState.selections;
  const { roomId } = useParams();
  const isAdmin = getMyPlayer(players)?.isAdmin;
  const [displayNewScores, setDisplayNewScores] = useState(false);

  useEffect(() => {
    setTimeout(() => setDisplayNewScores(true), 1000);
  }, []);

  const handleNextStep = () => {
    socket.emit("update_scores", newScores);
    socket.emit("new_round", { roomId });
  };

  const roundScores = players.reduce((acc, { userId }) => {
    return {
      ...acc,
      [userId]: calculatePlayerRoundScore(userId, selections),
    };
  }, {});

  const newScores = players.reduce((acc, { userId }) => {
    const previousScore = scores?.[userId] ?? 0;
    const roundScore = roundScores?.[userId];
    return {
      ...acc,
      [userId]: previousScore + roundScore,
    };
  }, {});

  const displayedScores = displayNewScores ? newScores : scores;

  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      direction="column"
      height={1}
      width={1}
    >
      <Typography variant="h4" sx={{ margin: 2 }}>
        Scores:
      </Typography>

      <Grid container spacing={2}>
        {players &&
          players
            .sort(
              (player1, player2) =>
                displayedScores?.[player2.userId] -
                displayedScores?.[player1.userId]
            )
            .map((player) => (
              <Grid item xs={4} sm={3} key={player.userId}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Avatar
                    player={player}
                    size={"medium"}
                    displayBadge={true}
                    badgeContent={displayedScores?.[player.userId] ?? 0}
                  />
                  <Typography
                    variant="subtitle1"
                    align="center"
                    textOverflow="ellipsis"
                    overflow={"hidden"}
                    sx={{ flex: 1, width: 1 }}
                  >
                    {player.username}
                  </Typography>
                </Box>
              </Grid>
            ))}
      </Grid>
      <Fade in={isAdmin} style={{ transitionDelay: "1s" }}>
        <Button
          onClick={handleNextStep}
          disabled={!isAdmin}
          variant="contained"
          sx={{ marginTop: 1 }}
        >
          Next round
        </Button>
      </Fade>
      <Snackbar
        message="Waiting for the admin to continue..."
        open={!isAdmin}
        TransitionComponent={(props) => (
          <Grow {...props} style={{ transitionDelay: "1s" }} />
        )}
      />
    </Grid>
  );
};

export default WordResult;
