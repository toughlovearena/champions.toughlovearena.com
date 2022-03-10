export enum HallOfFameType {
  Official = 'official',
  Community = 'community',
}

export interface HallOfFameLink {
  label: string;
  url: string;
}

export interface HallOfFameEntry {
  date: string;
  name: string;
  entrants: number;
  winner: string;
  category: HallOfFameType;
  challonge?: string;
  youtube?: string;
  links?: HallOfFameLink[];
}

export interface HallOfFameData {
  events: HallOfFameEntry[];
}
