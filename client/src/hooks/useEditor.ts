import { useEffect, useState } from 'react';
import { message } from 'antd';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

export const useEditor = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('{ }');
  }, []);

  const handleFormat = () => {
    setValue(prettier.format(value, { parser: 'json', plugins: [parser] }));
  };

  const handleCopy = () => {
    message.success('Copied ✅');
  };

  return { value, setValue, handleFormat, handleCopy };
};
