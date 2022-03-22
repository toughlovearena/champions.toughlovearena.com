import fs from "fs";
import { DataManager } from "../data";

describe("data.ts", () => {
  test("parser", () => {
    const yaml = fs.readFileSync("public/data.yaml").toString();
    const dm = new DataManager();
    const data = dm.parseYaml(yaml);
    expect(data.events.length).toBeGreaterThan(0);
  });
});
