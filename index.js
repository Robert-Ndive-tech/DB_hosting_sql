const cors = require('cors');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const { createClient } = require('@supabase/supabase-js');


// Initialize Express and HTTP server
const appclose = express();
const server = createServer(appclose);

appclose.use(cors());
appclose.use(express.json());

// the problem comes from her  the online will use online serves while the reverse is also true
const io = new Server(server, {
  cors: {
    origin: "https://closeencounter.vercel.app", // React appclose URL
    methods: ["GET", "POST"],
  },
});

// Initialize Supabase client
const SUPABASE_URL = "https://kelytxjtgaxzrwpixbfo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbHl0eGp0Z2F4enJ3cGl4YmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMzE2MzgsImV4cCI6MjA1NzcwNzYzOH0.HzKrIiaHDXr8y10wKDCkIclIk2VNAOj1pZXfoeqXVBA";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Store active users
const activeUsers = new Map();

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`✅ New user connected: ${socket.id}`);

  // **User joins with authentication**
  socket.on("authenticate", async ({ user_id, token }) => {
    try {
      // Verify user token with Supabase
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data) {
        console.error("❌ Authentication failed:", error);
        socket.emit("auth-failed", "Invalid token");
        return;
      }

      // Store active user
      activeUsers.set(socket.id, user_id);
      socket.join(user_id); // Join personal room for private messages
      console.log(`✅ User authenticated: ${user_id}`);
    } catch (error) {
      console.error("❌ Authentication error:", error);
    }
  });

  // **Send a message (1-to-1 or group)**
  socket.on("send-message", async (message) => {
    try {
      const messageData = {
        sender_id: message.sender_id,
        receiver_id: message.receiver_id || null,
        sender_name: message.sender_name,
        message: message.message,
        timestamp: new Date().toISOString(),
        //status: "sent",
      };

      // Insert into Supabase
      const { error } = await supabase.from("messages").insert([messageData]);
      if (error) throw error;

      // Emit message to receiver or group
      if (message.receiver_id) {
        io.to(message.receiver_id).emit("new-message", messageData);
      } else if (message.group_id) {
        io.to(message.group_id).emit("new-message", messageData);
      }

      console.log(`📨 Message sent: ${message.message}`);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      socket.emit("error", "Error processing message");
    }
  });

  // **Join a group chat**
  socket.on("join-group", (groupId) => {
    socket.join(groupId);
    console.log(`👥 User joined group: ${groupId}`);
  });

  // **Handle disconnection**
  socket.on("disconnect", () => {
    const userId = activeUsers.get(socket.id);
    if (userId) {
      activeUsers.delete(socket.id);
      console.log(`❌ User disconnected: ${userId}`);
    }
  });
});

// **New Endpoint to Fetch Messages (User as Sender or Receiver)**
appclose.get("/messages", async (req, res) => {
  try {
    const { user_id } = req.query;

    console.log("Received query parameters:", { user_id });

    // Ensure that user_id or group_id is provided
    if (!user_id) {
      console.log("Missing required query parameters");

      return res
        .status(400)
        .json({ error: "Missing required query parameters" });
    }

    // Construct the base query for messages
    let query = supabase
      .from("messages")
      .select("sender_id, sender_name, receiver_id, message, timestamp")
      .order("timestamp", { ascending: true });

    console.log("Constructed query:", query);

    // If a user_id is provided, filter messages where the user is either the sender or the receiver
    if (user_id) {
      console.log(`Filtering messages by user_id: ${user_id}`);

      query = query.or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`);
    }

    // Execute the query
    console.log("Executing query...");

    const { data, error } = await query;

    if (error) {
      console.error("❌ Error fetching messages:", error);
      return res.status(500).json({ error: "Error fetching messages" });
    }

    // Fetch the receiver's name from the profiles table based on receiver_id
    const receiverIds = data.map((message) => message.receiver_id);
    const { data: receiverProfiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, name")
      .in("id", receiverIds);

    if (profileError) {
      console.error("❌ Error fetching receiver profiles:", profileError);
      return res
        .status(500)
        .json({ error: "Error fetching receiver profiles" });
    }

    // Add receiver names to messages
    const messagesWithReceiverName = data.map((message) => {
      const receiver = receiverProfiles.find(
        (profile) => profile.id === message.receiver_id
      );
      return {
        ...message,
        receiver_name: receiver ? receiver.name : "Unknown", // Default to "Unknown" if no profile found
      };
    });

    // Return the fetched messages with receiver names
    return res.json({ messages: messagesWithReceiverName });
  } catch (error) {
    console.error("❌ Error in /messages route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// **New Endpoint to Fetch Distinct Contacts for a User**
appclose.get("/distinct-contacts", async (req, res) => {
  try {
    const { user_id } = req.query;

    console.log("Received query parameters:", { user_id });

    // Ensure that user_id is provided
    if (!user_id) {
      console.log("Missing user_id query parameter");

      return res.status(400).json({ error: "Missing user_id query parameter" });
    }

    // Construct the query to get distinct sender and receiver IDs
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("sender_id, receiver_id")
      .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`); // Get messages where the user is either sender or receiver

    if (messagesError) {
      console.error("❌ Error fetching messages:", messagesError);
      return res.status(500).json({ error: "Error fetching messages" });
    }

    // Collect all distinct user IDs from both sender_id and receiver_id fields
    const contactIds = new Set(
      messages.flatMap((message) =>
        message.sender_id === user_id ? message.receiver_id : message.sender_id
      )
    );

    // Fetch the user details (name) of these distinct contact IDs
    const { data: contactProfiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, name")
      .in("id", Array.from(contactIds)); // Fetch profiles for distinct contact IDs

    if (profileError) {
      console.error("❌ Error fetching contact profiles:", profileError);
      return res.status(500).json({ error: "Error fetching contact profiles" });
    }

    // Return distinct contacts with their names
    return res.json({
      contacts: contactProfiles.map((profile) => ({
        contact_id: profile.id,
        contact_name: profile.name,
      })),
    });
  } catch (error) {
    console.error("❌ Error in /distinct-contacts route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Add this new endpoint to mark messages as read
appclose.put("/messages/read", async (req, res) => {
  try {
    const { message_id, user_id } = req.body;

    // Validate request body
    if (!message_id || !user_id) {
      return res.status(400).json({ 
        error: "Missing required parameters: message_id and user_id are required" 
      });
    }

    // Fetch the message to verify ownership
    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("*")
      .eq("id", message_id)
      .single();

    if (fetchError || !message) {
      console.error("❌ Error fetching message:", fetchError);
      return res.status(404).json({ error: "Message not found" });
    }

    // Ensure the user is the intended receiver
    if (message.receiver_id !== user_id) {
      return res.status(403).json({ 
        error: "Unauthorized: User is not the recipient of this message" 
      });
    }

    // Update the message as read
    const { error: updateError } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("id", message_id);

    if (updateError) {
      console.error("❌ Error marking message as read:", updateError);
      return res.status(500).json({ error: "Failed to update message status" });
    }

    // Notify sender via socket if they're online
    const senderId = message.sender_id;
    // Find if sender is connected
    const senderSocketIds = Array.from(activeUsers.entries())
      .filter(([_, id]) => id === senderId)
      .map(([socketId]) => socketId);
    
    // Emit read receipt to sender if they're online
    senderSocketIds.forEach(socketId => {
      io.to(socketId).emit("message-read", { message_id: message_id });
    });

    return res.json({ success: true, message: "Message marked as read" });
  } catch (error) {
    console.error("❌ Error in /messages/read route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Add this endpoint to mark all messages from a sender as read
appclose.put("/messages/read-all", async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.body;

    // Validate request body
    if (!sender_id || !receiver_id) {
      return res.status(400).json({ 
        error: "Missing required parameters: sender_id and receiver_id are required" 
      });
    }

    // Update all unread messages from this sender to this receiver
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", sender_id)
      .eq("receiver_id", receiver_id)
      .eq("read", false);

    if (error) {
      console.error("❌ Error marking messages as read:", error);
      return res.status(500).json({ error: "Failed to update message status" });
    }

    // Get count of updated messages for response
    const { count, error: countError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("sender_id", sender_id)
      .eq("receiver_id", receiver_id)
      .eq("read", true);

    if (countError) {
      console.error("❌ Error counting read messages:", countError);
    }

    // Notify sender via socket if they're online
    // Find if sender is connected
    const senderSocketIds = Array.from(activeUsers.entries())
      .filter(([_, id]) => id === sender_id)
      .map(([socketId]) => socketId);
    
    // Emit read receipt to sender if they're online
    senderSocketIds.forEach(socketId => {
      io.to(socketId).emit("all-messages-read", { 
        sender_id,
        receiver_id 
      });
    });

    return res.json({ 
      success: true, 
      message: "All messages marked as read",
      count: count || 0
    });
  } catch (error) {
    console.error("❌ Error in /messages/read-all route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch all available profiles for initiating new conversations
appclose.get("/profiles", async (req, res) => {
  try {
    const { user_id, query } = req.query;

    console.log("Received query parameters:", { user_id, query });

    // Ensure that user_id is provided
    if (!user_id) {
      console.log("Missing user_id query parameter");
      return res.status(400).json({ error: "Missing user_id query parameter" });
    }

    // Base query to get all profiles except the current user
    let profileQuery = supabase
      .from("profiles")
      .select("id, name, avatar_url, bio, last_seen")
      .neq("id", user_id); // Exclude the current user

    // Add search functionality if query parameter is provided
    if (query && typeof query === 'string' && query.trim() !== '') {
      profileQuery = profileQuery.ilike("name", `%${query}%`);
    }

    // Limit results for better performance
    profileQuery = profileQuery.limit(50);

    // Execute the query
    const { data: profiles, error: profilesError } = await profileQuery;

    if (profilesError) {
      console.error("❌ Error fetching profiles:", profilesError);
      return res.status(500).json({ error: "Error fetching profiles" });
    }

    // Get existing contacts for the user to mark which ones already have conversations
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("sender_id, receiver_id")
      .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`);

    if (messagesError) {
      console.error("❌ Error fetching messages:", messagesError);
      // Continue without conversation status - it's not critical
    }

    // If we have messages data, identify which profiles already have conversations
    let contactIds = new Set();
    if (messages && messages.length > 0) {
      contactIds = new Set(
        messages.flatMap((message) =>
          message.sender_id === user_id ? message.receiver_id : message.sender_id
        )
      );
    }

    // Enhance profile data with conversation status and format response
    const enhancedProfiles = profiles.map((profile) => ({
      contact_id: profile.id,
      contact_name: profile.name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      last_seen: profile.last_seen,
      has_conversation: contactIds.has(profile.id),
    }));

    // Return profiles with conversation status
    return res.json({
      profiles: enhancedProfiles,
    });
  } catch (error) {
    console.error("❌ Error in /profiles route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get a specific profile by ID
appclose.get("/profiles/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Profile ID is required" });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, name, about_me, photos, last_seen")
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ Error fetching profile:", error);
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json({
      profile: {
        contact_id: profile.id,
        contact_name: profile.name,
        avatar_url: profile.photos[0],
        bio: profile.about_me,
        last_seen: profile.last_seen,
      },
    });
  } catch (error) {
    console.error("❌ Error in /profiles/:id route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 1000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
