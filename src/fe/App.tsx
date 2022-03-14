import React from 'react';
import styled from 'styled-components';
import { Table } from './Table';
import { useEffect, useState } from "react";
import { HallOfFameData, ViewAll, ViewOption } from "../lib/types";
import { DataManager } from '../lib/data';
import { sleep } from "../lib/util";
import { Search } from './Search';
import { Header } from './Header';

const AppDiv = styled.div`
  padding: 2em;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export function App() {
  const [data, setData] = useState<HallOfFameData>();
  const [view, setView] = useState<ViewOption>(ViewAll);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    (async () => {
      const dm = new DataManager();
      const fetchPromise = dm.fetchEvents();
      await Promise.all([fetchPromise, sleep(1000)]);
      const data = await fetchPromise;
      setData(data);
    })();
  }, []);

  return (
    <AppDiv>
      <Header
        data={data}
      />

      <Search
        view={view}
        query={query}
        setView={setView}
        setQuery={setQuery}
      />

      <Table
        data={data}
        view={view}
        query={query}
      />
    </AppDiv>
  );
}
