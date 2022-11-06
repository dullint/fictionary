import { Typography, Grid, Avatar, AvatarGroup } from '@mui/material';
import React, { useContext, useState } from 'react';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import { shuffle } from 'shuffle-seed';
import { useParams } from 'react-router-dom';
import DefinitionDisplay from '../DefinitionDisplay';

const WordGuess = () => {
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const definitions = game?.definitions;
  const entry = game?.entry;
  const realDefinition = entry?.definition;
  const selections = game.selections;
  const [selectedUsernameDef, setSelectedUsernameDef] = useState(null);
  const { roomId } = useParams();
  const socket = useContext(SocketContext);

  const handleSelectDefinition = (username) => {
    setSelectedUsernameDef(username);
    socket.emit('select_definition', { username });
  };
  const definitionToDisplay = Object.entries(definitions).concat([
    ['REAL_DEFINITION', realDefinition],
  ]);
  const seed = `${entry.word}-${roomId}`;
  const suffledDefinitions = shuffle(definitionToDisplay, seed);
  const votingPlayersByDefinitions = players.reduce((acc, { username }) => {
    acc[username] = players.filter(
      (player) => selections[player.username] === username
    );
    return acc;
  }, {});
  votingPlayersByDefinitions['REAL_DEFINITION'] = players.filter(
    (player) => selections[player.username] === 'REAL_DEFINITION'
  );
  console.log({ suffledDefinitions, selections, votingPlayersByDefinitions });
  return (
    <Grid container direction="column">
      <Typography variant="subtitle1" sx={{ m: 2 }}>
        Guess the Right Word!
      </Typography>
      <Grid container direction="column">
        {suffledDefinitions.map(([username, definition]) => (
          <Grid
            item
            onClick={() => handleSelectDefinition(username)}
            sx={{
              border: username === selectedUsernameDef ? '1px solid red' : '',
              '&:hover': { border: '1px solid' },
            }}
          >
            <DefinitionDisplay
              word={entry.word}
              definition={definition}
              type={entry.type}
            />
            <Grid container>
              <AvatarGroup>
                {(votingPlayersByDefinitions[username] ?? []).map((player) => {
                  return (
                    <Avatar
                      sx={{ height: 20, width: 20, bgcolor: player.color }}
                    />
                  );
                })}
              </AvatarGroup>
            </Grid>
          </Grid>
        ))}
        <Typography variant="body1" sx={{ m: 1 }}>
          {selectedUsernameDef
            ? 'Waiting for other players to pick a definition'
            : null}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default WordGuess;
