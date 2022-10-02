import { Button, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../App';
import { GameContext } from '../Room';

const WordPrompt = () => {
  const game = useContext(GameContext);
  const socket = useContext(SocketContext);
  const [definition, setDefinition] = useState('');
  const [hasSubmited, setHasSubmited] = useState(false);
  const entry = game?.entry;

  const handleKnowWord = () => {
    socket.emit('get_new_word');
  };
  const handleTextFieldChange = (event) => {
    setDefinition(event.target.value);
  };
  const handleSubmit = () => {
    if (definition) {
      setHasSubmited(true);
      socket.emit('submit_definition', { word: entry.word, definition });
    }
  };
  const handleModify = () => {
    setHasSubmited(false);
    socket.emit('modify_definition', { word: entry.word });
  };

  return (
    <div>
      <h1>WordPrompt</h1>
      {entry && (
        <div>
          <h2>{entry.word}</h2>
          {hasSubmited ? (
            <p>{definition}</p>
          ) : (
            <TextField
              autoFocus
              value={definition}
              label="Definition"
              multiline
              maxRows={4}
              onChange={handleTextFieldChange}
            />
          )}
          <div>
            <div>
              <Button onClick={handleKnowWord}>I already know this word</Button>
              {hasSubmited ? (
                <Button onClick={handleModify}>Modify</Button>
              ) : (
                <Button onClick={handleSubmit}>Submit</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordPrompt;
