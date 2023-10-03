import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

//MIDDLEWARES
app.use(morgan('dev'))
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`
  ));


//ROUTE HANDLERS
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};


const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "invalid ID"
    })
  }

  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',


    data: {
      tour
    }
  })
}

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
}

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'inavlid ID'
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour>'
    }
  })
}

const deleteTour = (req, res) => {

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "invalid ID"
    })
  }

  res.status(204).json({
    status: "success",
    data: null
  })
}

//ROUTWS
//req + res = route handler
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)


//SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});