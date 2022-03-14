import React from 'react';
import styled from 'styled-components';
import { HallOfFameData } from "../lib/types";
import { sortArray } from "../lib/util";
import { CONSTANTS } from '../lib/constants';

const HeaderDiv = styled.div`
  text-align: center;

  ${CONSTANTS.isMobile ? `
    max-width: 100%;
    ` : `
    max-width: 800px;
    font-size: 1.5em;
  `}

  a {
    color: var(--heart);
  }
`;

const Logo = styled.img`
  max-width: 100%;
  width: 600px;
  height: auto;
`;

const StatsTitle = styled.div`
  font-size: 2em;
`;
const SubTitle = styled.div`
  font-size: 1em;
  margin: 1em 0;
`;
const Updated = styled.div`
  width: 100%;
  text-align: right;
  font-style: italic;
  font-size: 0.8em;
`;
const SocialInfo = styled.div`
  font-size: 0.8em;
`;

export function Header(props: {
  data?: HallOfFameData;
}) {
  const updated = (
    props.data ? sortArray(props.data.events.map(evt => evt.date)).reverse()[0] : undefined
  ) ?? '???';

  return (
    <HeaderDiv>
      <div>
        <Logo
          src="images/logo.png"
          alt="Tough Love Arena"
        />
      </div>
      <StatsTitle>The Hall of Fame</StatsTitle>
      <Updated>
        last updated {updated}
      </Updated>
      <SubTitle>
        Here we celebrate and immortalize all of the <a href={CONSTANTS.URLs.Game}>Tough Love Arena</a> champions
      </SubTitle>
      <SocialInfo>
        Want to submit your event to the Hall of Fame?
        Send us an <a href={CONSTANTS.URLs.Email}>email</a> or message us on <a href={CONSTANTS.URLs.Twitter}>Twitter</a>
      </SocialInfo>
    </HeaderDiv>
  );
}
