// import express from 'serverless-express/express';
import app from './app';
import MongoService from './lib/mongodb';

// Call to app.listen to create local server for dev env.
MongoService.getConnection().then((connection) => {
  const port = process.env.PORT || 8080;
  app.listen(port);

  console.log('App listenting on :', port);
});
