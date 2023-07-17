import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { createServer } from 'http';
import { Server } from 'socket.io';
import schema from './schema/schema';
import DB from '../config/connectDB';
import colors from 'colors';

dotenv.config();
DB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Adjust the origin as needed
  },
});

app.use(express.json());
app.use(cors({ credentials: true }));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: process.env.DEV_MODE === 'development',
}));

const PORT = process.env.PORT || 1337;

io.on('connection', (socket) => {
  console.log('A client connected');

  // Add Socket.IO event handlers as needed

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(colors.cyan(`Server running on ${process.env.DEV_MODE} Port ${PORT}`));
});
