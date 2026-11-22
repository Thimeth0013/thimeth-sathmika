import { createPaperPath } from './paperPath';

// Computes the paper's crumple path off the main thread (see paperPath.js).
self.onmessage = (event) => {
  const path = createPaperPath(...event.data);
  self.postMessage(path, [...path.samples.map((sample) => sample.buffer), path.creased.buffer]);
};
