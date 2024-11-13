import React from 'react'

import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-dracula'
import 'ace-builds/src-noconflict/ace'

import { ActionIcon, Box, Code, CopyButton, Group, Text, Tooltip } from '@mantine/core'
import { Copy, CopySuccess } from 'iconsax-react'
const MirrorEditor = () => {
  function onChange(newValue: string) {
    console.log('change', newValue)
  }

  if (!window) {
    return null
  }
  return (
    <>
      <Group position="right">
        <Code>API KEY: 76788893-b507-4ffd-aef5-cf2698aff05c</Code>
        <CopyButton value="76788893-b507-4ffd-aef5-cf2698aff05c" timeout={1000}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
              <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                {copied ? (
                  <CopySuccess size="20" className="text-green-700" />
                ) : (
                  <Copy size="20" className="text-slate-400" />
                )}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>
      <Group>
        <Box sx={{ width: '49%' }}>
          <Code>Request</Code>
          <AceEditor
            mode="javascript"
            width="100%"
            theme="dracula"
            defaultValue={`[
  {
    "id": 1,
    "title": "REST API",
  }
]`}
            onChange={onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              tabSize: 2,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
            }}
          />
        </Box>
        <Box sx={{ width: '49%' }}>
          <Code>Response</Code>
          <AceEditor
            mode="javascript"
            theme="dracula"
            width="100%"
            value='console.log("Static Text")'
            onChange={onChange}
            name="UNIQUE_ID_OF_DI2"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              readOnly: true,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
            }}
          />
        </Box>
      </Group>
    </>
  )
}

export default MirrorEditor
