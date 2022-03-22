import React from "react";
import styled from "styled-components";
import { Table } from "./Table";
import { useEffect, useState } from "react";
import {
  HallOfFameData,
  HallOfFameEntry,
  ViewAll,
  ViewOption,
} from "../lib/types";
import { DataManager } from "../lib/data";
import { sleep } from "../lib/util";
import { Search } from "./Search";
import { Header } from "./Header";
import { CONSTANTS } from "../lib/constants";
import { Background } from "./Background";

const AppDiv = styled.div`
  padding: 1em;
  color: white;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  ${CONSTANTS.isMobile
    ? `
    max-width: 100%;
    `
    : ``}
`;

export function App() {
  const [data, setData] = useState<HallOfFameData>();
  const [view, setView] = useState<ViewOption>(ViewAll);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    (async () => {
      const dm = new DataManager();
      const fetchPromise = dm.fetchEvents();
      await Promise.all([fetchPromise, sleep(1000)]);
      const data = await fetchPromise;
      setData(data);
    })();
  }, []);

  let filtered: HallOfFameEntry[] | undefined;
  if (data) {
    const { events } = data;
    const terms = query.toLowerCase().split(" ");
    const filteredByCategory =
      view === ViewAll
        ? events
        : events.filter((entry) => entry.category === view);
    const filteredBySearch = query
      ? filteredByCategory.filter((entry) => {
          const toMatch = [
            entry.name.toLowerCase(),
            entry.winner.toLowerCase(),
          ];
          return terms.every((searchTerm) =>
            toMatch.some((data) => data.includes(searchTerm)),
          );
        })
      : filteredByCategory;
    filtered = filteredBySearch;
  }

  return (
    <AppDiv>
      <Header data={data} />
      <Search
        filtered={filtered}
        view={view}
        query={query}
        setView={setView}
        setQuery={setQuery}
      />
      <Table filtered={filtered} view={view} query={query} />
      <Background />
    </AppDiv>
  );
}
