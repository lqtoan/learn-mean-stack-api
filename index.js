require('dotenv').config(); //
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route');

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.q2tua.mongodb.net/learn-mongodb?retryWrites=true&w=majority`,
      {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
      }
    );
    console.log('MongoDB connect');
  } catch (error) {
    console.log('err' + error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);
app.get('/', (req, res) => res.send('Hello World'));

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
