# VideoTube Backend

Welcome to VideoTube Backend! This project provides the backend infrastructure for a video streaming platform built using Express.js, MongoDB, and other technologies. It follows production-grade practices and leverages various utilities to ensure scalability, security, and performance.

---

## Features

- **Express.js**: Utilizing Express.js for handling HTTP requests and routing.
- **MongoDB**: Database storage using MongoDB, with aggregation pipelines for efficient data retrieval.
- **CORS Policy**: Implemented CORS policy to allow cross-origin resource sharing.
- **Multer & Cloudinary**: Integrated Multer for handling file uploads and Cloudinary for cloud storage.
- **Environment Variables**: Securely managing environment variables for configuration.
- **API Error and Response Classes**: Utilizing Node.js API error and response classes for structured error handling and consistent responses.
- **JSON Web Token (JWT) Authorization**: Implementing JWT-based authorization with access and refresh tokens.
- **Production-grade Practices**: Following best practices for production deployment, including security, scalability, and maintainability.

---

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/videotube-backend.git
   ```

2. Setup your .env files : I have given a sample file so rename it to .env and fill all the links

3. Install dependencies:
   `npm install`

4. To Run the Project use Command:
   `npm run dev`

5. Install Other dependencies: (temporary)

   CAUTION:- only install these dependencies if these are not installed by command `npm i` first try to run the program without installing these by first setting up .env file and running command `npm i` and if then it doesnt work try installing these dependencies temporary

   ```
   npm i -D nodemon
   npm i -D prettier
   npm i mongoose express dotenv
   npm i cookie-parser cors
   npm i mongoose-aggregate-paginate-v2
   npm i bcrypt jsonwebtoken
   npm i cloudinary
   npm i multer
   ```

## Credits

- **Created by** **_HARSHIT SONI_**
- **Project Mentor** **_HITESH CHOUDHARY_**

## Support

For any queries or support, please contact **kratin67soni@gmail.com**

Happy coding! 🚀
