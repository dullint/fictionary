import { ResponsiveBar } from '@nivo/bar';
import React from 'react';
import { Scores } from '../../../../server/src/game/types';
import { Player } from '../../../../server/src/room/types';

interface PropsType {
  players: Player[];
  scores: Scores;
}

const ScoreBar = (props: PropsType) => {
  const { players, scores } = props;
  const data = players
    .map((player) => {
      const { socketId, username, color } = player;
      return {
        username,
        score: scores?.[socketId] ?? 0,
        color,
      };
    })
    .sort((player1, player2) => player1.score - player2.score);

  return (
    <ResponsiveBar
      theme={{ fontSize: 20 }}
      data={data}
      keys={['score']}
      indexBy="username"
      margin={{ top: 50, bottom: 50, left: 150 }}
      padding={0.2}
      colors={(d) => d.data.color}
      colorBy="indexValue"
      layout="horizontal"
      isInteractive={false}
      motionConfig="slow"
      enableGridY={false}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={'white'}
      role="application"
    />
  );
};

export default ScoreBar;
