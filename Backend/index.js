const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./config/database')
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors')

const app = express();
dotenv.config();
connectDB()

app.use(express.json());
app.use(cors({origin: '*' }))  
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});