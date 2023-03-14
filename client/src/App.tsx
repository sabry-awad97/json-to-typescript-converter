import { Button, Row, Col, Select } from 'antd';
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Loading from './components/Loading';

import { useConversion } from './hooks/useConversion';
import { useDownload } from './hooks/useDownload';
import { themes, useMonaco } from './hooks/useMonaco';
import { useEditor } from './hooks/useEditor';

const App = () => {
  const { output, loading, convert } = useConversion();
  const download = useDownload();
  const { value, setValue, handleFormat, handleCopy } = useEditor();
  const { theme, setTheme, handleEditorDidMount } = useMonaco();

  return (
    <div className="app">
      <div className="header__container">
        <Row justify="space-between" align="middle">
          <Col>
          <h1 className="title">JSON to TypeScript Converter</h1>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => convert(value)}
              title="Convert the JSON code to Typescript"
            >
              Convert
            </Button>
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => setValue('{ }')}
              title="Clear the editor"
            >
              Clear
            </Button>
            <Button onClick={handleFormat} title="Format the JSON code">
              Format
            </Button>
          </Col>
        </Row>
        <Row justify="space-between" align="middle">
          <Col>
            <CopyToClipboard text={output} onCopy={handleCopy}>
              <Button
                shape="circle"
                icon={<CopyOutlined />}
                title="Copy to clipboard"
              >
                Copy
              </Button>
            </CopyToClipboard>
            <Button
              onClick={() => download(output)}
              title="Download the Typescript code"
            >
              Download
            </Button>
          </Col>
        </Row>
      </div>

      <Select defaultValue={theme} onChange={value => setTheme(value)}>
        {themes.map(({ label }) => (
          <Select.Option key={label} value={label}>
            {label}
          </Select.Option>
        ))}
      </Select>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Editor
            onMount={handleEditorDidMount}
            height="90vh"
            className="editor"
            defaultLanguage="json"
            defaultValue="{ }"
            value={value}
            onChange={value => {
              value && setValue(value);
            }}
            theme={theme}
          />
        </Col>

        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          {loading ? (
            <Loading />
          ) : (
            <Editor
              height="90vh"
              className="editor"
              defaultLanguage="typescript"
              options={{
                readOnly: true,
                domReadOnly: true,
              }}
              defaultValue=""
              value={output}
              onChange={value => {
                value && setValue(value);
              }}
              theme={theme}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default App;
