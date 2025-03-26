const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

// Initialize Express and HTTP server
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
  },
});

// Initialize Supabase client

const SUPABASE_URL1 = "https://kelytxjtgaxzrwpixbfo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbHl0eGp0Z2F4enJ3cGl4YmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMzE2MzgsImV4cCI6MjA1NzcwNzYzOH0.HzKrIiaHDXr8y10wKDCkIclIk2VNAOj1pZXfoeqXVBA";

const supabase = createClient(SUPABASE_URL1, SUPABASE_PUBLISHABLE_KEY1);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // When a user sends a message, save it to Supabase and emit it to the other user/group
  socket.on('send-message', async (message) => {
    try {
      // Prepare message data with dynamic fields
      const messageData = {
        sender_id: message.sender_id,        // ID of the user sending the message
          receiver_id: message.receiver_id,
        sender_name:message.sendername,
          // ID of the user receiving the message (null if group)
               // Group ID if the message is for a group
        message: message.message,             // The actual message content
        timestamp: new Date().toISOString(), // Timestamp when the message is sent
        status: 'sent',                      // Status of the message (could be 'sent', 'delivered', 'read', etc.)
        // Add any other dynamic fields here, such as attachments or custom metadata
      };
  
      // Insert the message into the Supabase messages table
      const { data, error } = await supabase.from('messages').insert([messageData]);
  
      if (error) {
        console.error('Error saving message:', error);
        socket.emit('error', 'Error saving message');
        return;
      }
  
      // Emit the new message to the receiver (1-to-1 or group)
      if (message.receiver_id) {
        // 1-to-1 message
        io.to(message.receiver_id).emit('new-message', messageData);
      } else if (message.group_id) {
        // Group message
        io.to(message.group_id).emit('new-message', messageData);
      }
  
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', 'Error processing message');
    }
  });
  
  // Join a room for group messages
  socket.on('join-group', (groupId) => {
    socket.join(groupId);
    console.log('User joined group:', groupId);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: '*' },
// });

// const users = {}; // Store connected users

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('join-room', (userId) => {
//     socket.join(userId);
//     users[userId] = socket.id; // Store user socket ID
//     console.log(`User ${userId} joined room`);
//   });

//   socket.on('send-message', (messageData) => {
//     const { receiver_id, group_id } = messageData;

//     if (receiver_id) {
//       // Send private message
//       io.to(users[receiver_id]).emit('new-message', messageData);
//     } else if (group_id) {
//       // Broadcast to group
//       socket.to(group_id).emit('new-message', messageData);
//     }

//     // Echo message back to sender (optional)
//     socket.emit('new-message', messageData);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// server.listen(4000, () => {
//   console.log('Server running on port 4000');
// });
