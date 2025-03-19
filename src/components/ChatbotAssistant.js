import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  TextField,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon
} from '@mui/icons-material';

const predefinedResponses = {
  greeting: ['Hello!', 'Hi there!', 'Hey! How can I help you?'],
  farewell: ['Goodbye!', 'See you later!', 'Take care!'],
  help: [
    'I can help you with:\n- Booking classroom resources\n- Checking attendance\n- Viewing your schedule\n- Accessing study materials\n- General questions about the system'
  ],
  booking: [
    'To book a resource:\n1. Go to the Resources section\n2. Select the resource you want to book\n3. Choose your preferred date and time\n4. Fill in the booking details\n5. Submit your request'
  ],
  attendance: [
    'To check attendance:\n1. Navigate to the Attendance section\n2. Select your class\n3. View your attendance records\n4. You can also see attendance analytics in the Dashboard'
  ],
  default: [
    'I\'m not sure about that. Could you please rephrase your question?',
    'I don\'t have information about that. Try asking something else.',
    'I\'m still learning. Could you try asking in a different way?'
  ]
};

function ChatbotAssistant() {
  const [messages, setMessages] = useState([
    {
      text: 'Hello! I\'m your classroom assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return predefinedResponses.greeting[Math.floor(Math.random() * predefinedResponses.greeting.length)];
    }
    
    if (input.includes('bye') || input.includes('goodbye') || input.includes('see you')) {
      return predefinedResponses.farewell[Math.floor(Math.random() * predefinedResponses.farewell.length)];
    }
    
    if (input.includes('help') || input.includes('what can you do')) {
      return predefinedResponses.help[0];
    }
    
    if (input.includes('book') || input.includes('booking') || input.includes('resource')) {
      return predefinedResponses.booking[0];
    }
    
    if (input.includes('attendance') || input.includes('present') || input.includes('absent')) {
      return predefinedResponses.attendance[0];
    }
    
    return predefinedResponses.default[Math.floor(Math.random() * predefinedResponses.default.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    const botResponse = {
      text: getBotResponse(input),
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '600px', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <BotIcon sx={{ mr: 1 }} />
          Classroom Assistant
        </Typography>
      </Box>

      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
              gap: 1,
              alignItems: 'flex-start'
            }}
          >
            <Avatar sx={{ bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main' }}>
              {message.sender === 'user' ? <UserIcon /> : <BotIcon />}
            </Avatar>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: '70%',
                bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary'
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word'
                }}
              >
                {message.text}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 1,
                  opacity: 0.7
                }}
              >
                {message.timestamp.toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        {isTyping && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <BotIcon />
            </Avatar>
            <CircularProgress size={20} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
        />
        <IconButton 
          color="primary" 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default ChatbotAssistant; 