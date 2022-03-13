import React from 'react';
import styled from 'styled-components';
import { HallOfFameData } from "../lib/types";
import { sortArray } from "../lib/util";
import { CONSTANTS } from '../lib/constants';

const HeaderDiv = styled.div`
  max-width: 800px;
  text-align: center;
`;

const Logo = styled.img`
  width: 600px;
  height: auto;
`;

const StatsTitle = styled.div`
  font-size: 3em;
  text-decoration: underline;
`;
const SubTitle = styled.div`
  font-size: 1.5em;
`;
const Updated = styled.div`
  width: 100%;
  text-align: right;
  font-style: italic;
`;
const SocialInfo = styled.div`
  font-size: 1.2em;

  a {
    color: var(--heart);
  }
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
        <a href={CONSTANTS.URLs.Game}>
          <Logo
            src="images/logo.png"
            alt="Tough Love Arena"
          />
        </a>
      </div>
      <StatsTitle>The Hall of Fame</StatsTitle>
      <Updated>
        last updated {updated}
      </Updated>
      <SubTitle>
        Here we celebrate and immortalize all of the Tough Love Arena champions
      </SubTitle>
      <SocialInfo>
        Want to submit your event to the Hall of Fame?
        Send us an <a href={CONSTANTS.URLs.Email}>email</a> or message us on <a href={CONSTANTS.URLs.Twitter}>Twitter</a>
      </SocialInfo>
    </HeaderDiv>
  );
}
