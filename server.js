const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let people = [
  { id: 1, name: "Ahmed", age: 21, gender: "Male", email: "ahmed@gmail.com" },
  {
    id: 2,
    name: "Mohamed",
    age: 30,
    gender: "Male",
    email: "mohamed@gmail.com",
  },
];

function getNextId() {
  const ids = people.map((person) => person.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

app.get("/people", (req, res) => {
  res.json(people);
});

app.post("/people", (req, res) => {
  const person = { id: getNextId(), ...req.body };
  people.push(person);
  res.json(person);
});

app.delete("/people/:id", (req, res) => {
  const id = parseInt(req.params.id);
  people = people.filter((person) => person.id !== id);
  res.sendStatus(204);
});

app.put("/people/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const personIndex = people.findIndex((person) => person.id === id);
  const updatedPerson = { ...people[personIndex], ...req.body };
  people[personIndex] = updatedPerson;
  res.json(updatedPerson);
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
