import express from 'express';
import getFeeds from './routes/GeneralFeeds.js';
import cors from 'cors';
import getSportsFeeds from './routes/SportsRoute.js'
import getEntertainmentFeeds from './routes/EntertainmentRoute.js'
import getTechFeeds from './routes/TechRoute.js'

const app = express();


app.use(cors());
const port = process.env.PORT || 8000;
app.use(express.json());
 

app.get('/', (req,res) => {
  res.status(200).json({message:'welocme to home page'})
} );

app.get('/check', (req,res) => {
  res.status(200).json({message:'welocme to check page'})
} );

app.use('/api/getGeneralFeeds/', getFeeds);
app.use('/api/getSportsFeeds/', getSportsFeeds);
app.use('/api/getEntertainmentFeeds/', getEntertainmentFeeds);
app.use('/api/getTechFeeds/', getTechFeeds)

app.listen(port, () => {
  console.log(`app running on ${port}`);
});


