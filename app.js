import express from 'express';

const app = express();

app.get('/', (req, res) => {

  res.status(200).json({ message: 'Hello from the server', app: "Tours" });

});

app.post('/', (req, res) => {
  res.send('You can POST');
})

const port = 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});