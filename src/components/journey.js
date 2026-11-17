import { educationData, experienceData } from '../data/about';
import CertificateData from '../data/certificate';
import BadgesData from '../data/badges';

// Data and timing for the Journey scene (JourneyScene.jsx) and its certificates ring (CertRing.jsx), the
// last part of the hero's pinned scroll.
// Kept out of the component file so Home.jsx can size the track from JOURNEY_RUN.
//
// Everything is in screen heights of scroll from the moment the scene starts (Home's SCHEDULE.journey).

// The stops: Education and Experience from about.js, oldest first (a journey reads forwards). The big
// mark is the start year, and the latest stop is "Now".
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const startOf = (period) => {
  const [, month, year] = period.match(/(?:([A-Z][a-z]{2})\s*)?(\d{4})/) ?? [];
  return Number(year) * 12 + Math.max(MONTHS.indexOf(month), 0);
};
export const STOPS = [
  ...educationData.map((item) => ({ ...item, kind: 'Education' })),
  ...experienceData.map((item) => ({ ...item, kind: 'Experience' })),
]
  .sort((a, b) => startOf(a.period) - startOf(b.period))
  .map((item, i, all) => ({
    ...item,
    key: `${item.kind}-${item.id}`,
    mark: i === all.length - 1 ? 'Now' : item.period.match(/\d{4}/)?.[0],
  }));

// Certificates and badges (certificate.js, badges.js), newest first: shown on a turning ring after the
// road ends (CertRing.jsx).
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dateOf = (text = '') => {
  const [month, year] = text.split(' ');
  return Number(year) * 12 + Math.max(MONTH_NAMES.indexOf(month), 0);
};
export const CERTS = [
  ...CertificateData.map((c) => ({ key: `c${c.id}`, kind: 'Certificate', title: c.title, issuer: c.company, date: c.date, url: c.certificateUrl })),
  ...BadgesData.map((b) => ({ key: `b${b.id}`, kind: 'Badge', title: b.title, issuer: b.issuer, date: b.dateEarned, url: b.badgeUrl })),
].sort((a, b) => dateOf(b.date) - dateOf(a.date));

// The heading comes towards you (COME), its letters fill (FILL), "so far" comes in (SO_FAR), then it
// flies past (LEAVE).
export const HEAD = { come: [0, 0.4], fill: [0.15, 0.8], soFar: [0.6, 0.9], leave: [1.05, 1.45] };
// Each stop has its moment `at` (when it is at its readable distance on the road, see JourneyScene's
// placeOnRoad): the first at STOP_FROM, the next STOP_GAP later, plus TURN where the chapter changes
// (Education → Experience), where the road takes its widest bend.
export const STOP_FROM = 1.95;
export const STOP_GAP = 1.35;
export const TURN = 0.9;
STOPS.forEach((stop, i) => {
  const last = STOPS[i - 1];
  stop.at = last ? last.at + STOP_GAP + (last.kind !== stop.kind ? TURN : 0) : STOP_FROM;
});
const LAST = STOPS[STOPS.length - 1].at; // "Now"
// The line (after johnbolster.design's): it draws in from the bottom left to the dot under the heading
// (draw), straightens into a vertical line as the heading goes (straighten) and stays that way through
// the stops; as "Now" goes, the dot swings up to the right and the line bends after it (turn), then it
// sweeps off the right of the screen as the certificates come in (leave).
export const LINE = { draw: [0.1, 0.6], straighten: [0.75, 1.55], turn: [LAST + 0.3, LAST + 0.85], leave: [LAST + 0.75, LAST + 1.3] };
// Then the certificates: as "Now" goes, the ring (and the search bar) comes into the middle (IN) and
// stays CERT_HOLD (scrolling does not turn it: drag it, or search); then the track ends and the page
// scrolls on to the footer.
const CERT_HOLD = 1;
export const CERTS_SHOW = { in: [LAST + 0.85, LAST + 1.5] };
export const JOURNEY_RUN = CERTS_SHOW.in[1] + CERT_HOLD;
