import { useState } from 'react';
import { message } from 'antd';

export const useConversion = () => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const convert = (value: string) => {
    setLoading(true);
    fetch('http://localhost:4000/api/convert', {
      method: 'POST',
      body: JSON.stringify({
        value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        setOutput(data.response);
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
        message.error('An error occurred. Please try again later.');
      });
  };

  return { output, loading, convert };
};
