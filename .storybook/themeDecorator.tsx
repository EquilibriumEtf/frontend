// themeDecorator.js
import React from 'react';

const ThemeDecorator = (storyFn) => (
  <main className="dark text-white">{storyFn()}</main>
);

export default ThemeDecorator;
