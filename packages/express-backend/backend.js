import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// function createID() {
//   const alphabet = 'abcdefghijklmnopqrstuvwxyz';
//   const digits = '0123456789';

//   const letters = Array.from({length: 3}, () => alphabet.charAt(Math.floor(Math.random() * alphabet.length))).join('');
//   const numbers = Array.from({length: 3}, () => digits.charAt(Math.floor(Math.random() * digits.length))).join('');

//   return letters + numbers;
// }

// Get home page
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get user by name/job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  
  userService.getUsers(name, job).then((result) => 
    res.send({users_list: result})
  ).catch( (error) =>
    console.log(error)
  );
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  
  userService.findUserById(id).then((result) => {
    if(!result) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
  }).catch((error) =>
    res.status(500).send(error)
  );
});

// Create new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;

  //userToAdd.id = createID();
  
  userService.addUser(userToAdd).then((user) =>
    res.status(201).send(user)
  ).catch((error) =>
    res.status(500).send(error)
  )

});

// Delete user
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  
  userService.findUserByIdAndDelete(id).then((deleted) => {
    if(deleted != undefined) {
      res.status(204).send();
    } else {
      res.status(404);
    }
  }
  );
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
