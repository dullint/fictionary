import React, { createContext, useContext, useEffect, useState } from 'react';
import WaitingRoom from '../WaitingRoom';
import { SocketContext } from '../../App';
import { Player } from '@server/src/room/types';
import { useNavigate, useParams } from 'react-router-dom';
import { Game } from '@server/src/game/games';
import WordPrompt from '../WordPrompt';
import Leaderboard from '../Leaderboard';
import WordGuess from '../WordGuess';
import WordResult from '../WordResult';
import { Button, Grid, Typography } from '@mui/material';

export const PlayerContext = createContext<Player[]>([]);
export const GameContext = createContext<Game>(null);

export enum GameStep {
  WAIT,
  PROMPT,
  GUESS,
  RESULTS,
  FINISHED,
}

const Room = () => {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const { roomId } = useParams();
  const [game, setGame] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.emit('join_room', { roomId });
      socket.emit('players', { roomId });
      socket.on('players', (players: Player[]) => setPlayers(players));

      socket.emit('game', { roomId });
      socket.on('game', (game: Game) => setGame(game));
    }
  }, [socket, roomId]);

  const renderComponent = (gameStep: GameStep) => {
    switch (gameStep) {
      case GameStep.WAIT:
        return <WaitingRoom />;
      case GameStep.PROMPT:
        return <WordPrompt />;
      case GameStep.GUESS:
        return <WordGuess />;
      case GameStep.RESULTS:
        return <WordResult />;
      case GameStep.FINISHED:
        return <Leaderboard />;
      default:
        return (
          <Grid
            flexDirection={'column'}
            justifyContent="center"
            alignItems={'center'}
            container
          >
            <Typography variant="subtitle1">
              {`The room ${roomId} does not exist, please come back to the menu`}
            </Typography>
            <Button
              onClick={() => navigate('/')}
              variant="contained"
              size="large"
              sx={{ m: 2 }}
            >
              Go to Menu
            </Button>
          </Grid>
        );
    }
  };

  return (
    <PlayerContext.Provider value={players}>
      <GameContext.Provider value={game}>
        {renderComponent(game?.gameStep)}
      </GameContext.Provider>
    </PlayerContext.Provider>
  );
};

export default Room;
