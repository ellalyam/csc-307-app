import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

function createID() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';

  const letters = Array.from({length: 3}, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
  const numbers = Array.from({length: 3}, () => digits.charAt(Math.floor(Math.random() * digits.length))).join('');

  return letters + numbers;
}

const addUser = (user) => {
  user.id = createID();
  users["users_list"].push(user);
  return user;
};

// Get home page
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get user by name and job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  let result = users["users_list"];
  
  if (name != undefined) {
    result = findUserByName(name);
  }

  if (job != undefined) {
    result = result.filter((user) => user["job"] === job);
  }

  res.send({users_list: result});
});

// Get user by name
app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

// Get all users
app.get("/users", (req, res) => {
  res.send(users);
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

// Create new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const user = addUser(userToAdd);
  res.status(201).send(user);
});

// Delete user
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  let deleted = findUserById(id);

  if (deleted !== undefined) {
    users["users_list"] = users["users_list"].filter((user) => user.id !== id);
    res.status(204).send(users);
  } else {
    res.status(404);
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
