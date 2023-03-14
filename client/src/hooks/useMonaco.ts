import { useState } from 'react';
import { OnMount } from '@monaco-editor/react';

import dracula from '../assets/themes/Dracula.json';
import monokai from '../assets/themes/Monokai.json';

export const themes = [
  { label: 'Dracula', value: dracula },
  { label: 'Monokai', value: monokai },
];

export const useMonaco = () => {
  const [theme, setTheme] = useState('');

  const handleEditorDidMount: OnMount = (_, monaco) => {
    for (const theme of themes) {
      monaco.editor.defineTheme(theme.label, theme.value);
    }
  };

  return { theme, setTheme, handleEditorDidMount };
};
