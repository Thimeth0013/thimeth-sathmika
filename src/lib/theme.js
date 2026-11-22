import { useSyncExternalStore } from 'react';

// Light and dark ("day" and "night"). The theme is `data-theme` on <html>: a script in each page's
// <head> (index.html, work/index.html) sets it before the first paint, from the visitor's saved choice
// or else their system setting, so the page never flashes the wrong one. The way to switch is the
// Enderman on the footer's meadow (Enderman.jsx): clicking him toggles it and saves the choice.
// The look itself is CSS (index.css): `.theme-flip` sections swap the white and forest tokens,
// `.theme-keep` puts them back for things that stay light, `--paper` is the page colour, and the
// scenes have night grades (`.night-*`, `.stars`).

const KEY = 'theme';

export const getTheme = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

export const setTheme = (theme) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage unavailable: it just won't be remembered */
  }
  // The phone browser bar: each page's meta carries its own colour for each (data-light, data-dark).
  const bar = document.querySelector('meta[name="theme-color"]');
  if (bar?.dataset[theme]) bar.setAttribute('content', bar.dataset[theme]);
};

export const toggleTheme = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark');

// The current theme, re-rendering when it changes.
const subscribe = (onChange) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};
export const useTheme = () => useSyncExternalStore(subscribe, getTheme, () => 'light');
