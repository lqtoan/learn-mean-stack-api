require('dotenv').config(); //
const express = require('express');
const mongoose = require('mongoose');
const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.q2tua.mongodb.net/learn-mongodb?retryWrites=true&w=majority`;

const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route');

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(`${URL}`);
    console.log('MongoDB connect');
  } catch (error) {
    console.log('err' + error.message);
    process.exit(1);
  }
};

connectDB();

app.get('/', (req, res) => res.send('Hello World'));

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
