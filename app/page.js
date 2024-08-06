'use client'
import { Box, Typography, Stack, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Chat from "./Components/chat"; // Corrected the file name to match the actual file name
export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Headstarter AI assistant. How can I help you today?`
    }]);
  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [...messages, { role: 'user', content: message }, { role: 'assistant', content: '' }])
    const response = fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      reader.read().then(function processText({ done, value }) {
        if (done) {
          console.log('Stream complete');
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [...otherMessages, { ...lastMessage, content: lastMessage.content + text }];
        })
        return reader.read().then(processText);
      })
    })

    // const data = await response.json();
    // setMessages((messages) => [...messages, { role: 'assistant', content: data.message }])
  }
  useEffect(() => {
    const listener = (event) => {
      if (event.key === 'Enter') {
        sendMessage();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    }
  });
  const [message, setMessage] = useState('');
  return (
    <Box
      width={'100vw'} height={'100vh'} flexDirection={'column'}
      display={'flex'} justifyContent={'center'} alignItems={'center'}
    >
      <Stack direction={'column'} width={'500px'} height={'700px'} border={1} p={2} spacing={2}>
        {/* <Stack direction={'column'} spacing={3} flexGrow={1} overflow={'auto'}>
          {
            messages.map((message, index) => {
              return (
                <Box key={index} display={"flex"} justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                  <Box bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'} p={2} borderRadius={'16px'}>
                    {message.content}
                  </Box>
                </Box>
              );
            })
          }
        </Stack> */}
        <Chat messages={messages} />
        <Stack direction={'row'} spacing={2}>
          <TextField label='Message' fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button variant='contained' color='primary' onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
