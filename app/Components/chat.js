import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import ReactDom from 'react-dom'

const chat = ({ messages }) => {
    return (
        <Stack direction={'column'} spacing={3} flexGrow={1} overflow={'auto'}>
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
        </Stack>
    )
}

export default chat
