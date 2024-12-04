To deploy this API template on Heroku using Docker, while effectively managing environment variables and application scaling, follow the steps outlined below.

# API Template

This project serves as a template for creating new APIs or microservices for SROA projects.

## Basic Usage

1. **Clone the Project:**

   ```bash
   git clone https://github.com/your-repo/api-template.git
   cd api-template
   ```

2. **Configure Environment Variables:**

   - Duplicate the `.env.default` file and rename the copy to `.env`.
   - Open the `.env` file and provide valid values for the required environment variables, such as `MONGO_URI`.

3. **Install Dependencies:**

   ```bash
   npm ci
   ```

4. **Start the Application:**

   ```bash
   npm start
   ```

## Deployment on Heroku Using Docker

To deploy this application on Heroku using Docker, follow these steps:

1. **Install the Heroku CLI:**

   Download and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

2. **Log In to Heroku Container Registry:**

   ```bash
   heroku container:login
   ```

3. **Create a New Heroku Application:**

   ```bash
   heroku create your-app-name --stack container
   ```

   Replace `your-app-name` with your desired application name.

4. **Set Environment Variables on Heroku:**

   ```bash
   heroku config:set MONGO_URI=your_mongo_uri
   ```

   Replace `your_mongo_uri` with your actual MongoDB connection string.

5. **Build and Push the Docker Image to Heroku:**

   ```bash
   heroku container:push web
   ```

6. **Release the Image to Your App:**

   ```bash
   heroku container:release web
   ```

7. **Open the Application in Your Browser:**

   ```bash
   heroku open
   ```

## Managing Application Availability

To control the availability of your application and manage resource usage, you can scale your dynos up or down:

- **Deactivate the Application (Scale Down):**

   ```bash
   heroku ps:scale web=0
   ```

   This command stops all web dynos, effectively deactivating the application.

- **Reactivate the Application (Scale Up):**

   ```bash
   heroku ps:scale web=1
   ```

   This command starts one web dyno, reactivating the application.

Adjust the number of dynos (`web=1`, `web=0`, etc.) based on your application's needs.

## Requirements

- **Node.js:** Version 14 is preferred.
- **MongoDB:** An accessible MongoDB database.

By following these instructions, you can deploy and manage the API template on Heroku using Docker, scaling the application as needed to control its availability. 