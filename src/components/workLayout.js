// Featured Work's phone layout, shared by WorkScene (where the cards sit) and Home (when Tools starts).
// Phones: five 16:9 cards one under another, MOBILE_H screen heights tall (their width follows from it,
// ≈ 88% of a typical phone's width), MOBILE_GAP apart, the first just under the heading's button. Tools
// starts (MOBILE_TOOLS_AT, a column position) once the last card is the only one left, still whole,
// its top TOOLS_LEAD screen heights from the top of the screen, so the screen never sits empty under it.
export const MOBILE_H = 0.23;
const MOBILE_GAP = 0.03;
export const MOBILE_Y = [0, 1, 2, 3, 4].map((i) => 1.15 + i * (MOBILE_H + MOBILE_GAP));
const TOOLS_LEAD = 0.14;
export const MOBILE_TOOLS_AT = MOBILE_Y[4] - TOOLS_LEAD;
