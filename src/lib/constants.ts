import { isMobile as isMobileV1 } from "is-mobile";
import { isMobile as isMobileV2 } from "mobile-device-detect";

export const CONSTANTS = {
  isMobile: isMobileV1({ tablet: true }) || isMobileV2,
  URLs: {
    Game: "https://toughlovearena.com",
    Email: "mailto:toughlovearena@gmail.com",
    Twitter: "https://twitter.com/ToughLoveArena",
    Form: "https://forms.gle/6Z6f2Yghss2Q1KrH9",
  },
};
