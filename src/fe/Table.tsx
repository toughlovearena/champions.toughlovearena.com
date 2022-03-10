import { useEffect, useState } from "react";
import { HallOfFameData } from "../lib/types";
import { DataManager } from '../lib/data';
import { sleep, sortArrayOfObjects } from "../lib/util";

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

  const sorted = sortArrayOfObjects(data.events, evt => evt.date).reverse();
  return (
    <div>
      {sorted.map(evt => (
        <div>
          {evt.name}
        </div>
      ))}
    </div>
  )
}
