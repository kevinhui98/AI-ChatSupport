import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

const Chat = ({ messages }) => {
    return (
        <Stack direction={'column'} spacing={3} flexGrow={1} overflow={'auto'}>
            {messages.map((message, index) => (
                <Box 
                    key={index} 
                    display={"flex"} 
                    justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                    <Box 
                        bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'} 
                        p={2} 
                        borderRadius={'16px'}>
                        <Typography variant="body1">
                            {message.content}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Stack>
    );
};

export default Chat;
