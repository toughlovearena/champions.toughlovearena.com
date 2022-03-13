import { useEffect, useState } from "react";
import { HallOfFameData } from "../lib/types";
import { DataManager } from '../lib/data';
import { sleep } from "../lib/util";
import { Legacy } from "./Legacy";

export function Table() {
  const [data, setData] = useState<HallOfFameData>();

  useEffect(() => {
    (async () => {
      const dm = new DataManager();
      const data = await dm.fetchEvents();
      await sleep(1000); // todo temp
      setData(data);
    })();
  }, []);

  if (!data) {
    return <div>loading...</div>;
  }

  return <Legacy data={data} />;
}
