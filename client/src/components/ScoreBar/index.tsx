import { ResponsiveBar } from '@nivo/bar';
import React from 'react';
import { Scores } from '../../../../server/src/game/types';
import { Player } from '../../../../server/src/player';

interface PropsType {
  players: Player[];
  scores: Scores;
  animate?: boolean;
  layout?: 'horizontal' | 'vertical';
  number?: number;
}

const ScoreBar = (props: PropsType) => {
  const { players, scores, animate, layout = 'horizontal', number } = props;
  const data = players
    .map(({ username, color }) => {
      return {
        username,
        score: scores?.[username] ?? 0,
        color,
      };
    })
    .sort((player1, player2) => player1.score - player2.score)
    .slice(0, number);

  return (
    <ResponsiveBar
      theme={{ fontSize: 20 }}
      data={data}
      animate={animate}
      keys={['score']}
      indexBy="username"
      margin={{
        left: layout === 'vertical' ? 50 : 120,
        right: 50,
        bottom: layout === 'vertical' ? 50 : 0,
      }}
      padding={0.2}
      colors={(d) => d.data.color}
      colorBy="indexValue"
      layout={layout}
      isInteractive={false}
      motionConfig={{ friction: 100 }}
      enableGridY={false}
      axisTop={null}
      axisRight={null}
      axisBottom={
        layout === 'vertical'
          ? {
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }
          : null
      }
      axisLeft={
        layout === 'horizontal'
          ? {
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }
          : null
      }
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={'white'}
      role="application"
    />
  );
};

export default ScoreBar;
