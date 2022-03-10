import YAML from 'yaml';
import { HallOfFameData } from './types';

export class DataManager {
  readonly path = 'data.yaml';
  private async fetchText(): Promise<string> {
    const now = new Date();
    const resp = await fetch(`${this.path}?v=${now.getTime()}`);
    const text = await resp.text();
    return text;
  }
  private parseYaml(text: string): HallOfFameData {
    const data = YAML.parse(text) as HallOfFameData;
    // todo validate
    return data;
  }

  async fetchEvents(): Promise<HallOfFameData> {
    const yaml = await this.fetchText();
    const data = this.parseYaml(yaml);
    return data;
  }
}
