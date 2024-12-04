// import express from 'serverless-express/express';
import app from './app';
import MongoService from './lib/mongodb';

// Call to app.listen to create local server for dev env.
MongoService.getConnection()
  .then((connection) => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log('App listening on:', port);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the process with an error code
  });

