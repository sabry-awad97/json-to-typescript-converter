export const useDownload = () => {
  const download = (output: string) => {
    const element = document.createElement('a');
    const file = new Blob([output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'output.ts';
    document.body.appendChild(element);
    element.click();
  };

  return download;
};
