import React, { useState, useEffect } from "react";
import axios from "axios";

function PeopleList() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:5000/people");
        setPeople(response.data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchData();
  }, []);

  const handleAddPerson = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/people", {
        name,
        age,
        gender,
        email,
      });

      setPeople([...people, response.data]);
      setName("");
      setAge("");
      setGender("");
      setEmail("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePerson = async (id) => {
    setLoading(true);
    setError("");

    try {
      await axios.delete(`http://localhost:5000/people/${id}`);
      setPeople(people.filter((person) => person.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePerson = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(`http://localhost:5000/people/${id}`, {
        name,
        age,
        gender,
        email,
      });

      const updatedPeople = people.map((person) => {
        if (person.id === id) {
          return response.data;
        }

        return person;
      });

      setPeople(updatedPeople);
      setEditingId(null);
      setName("");
      setAge("");
      setGender("");
      setEmail("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPerson = (person) => {
    setEditingId(person.id);
    setName(person.name);
    setAge(person.age);
    setGender(person.gender);
    setEmail(person.email);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setAge("");
    setGender("");
    setEmail("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId !== null) {
      handleUpdatePerson(editingId);
    } else {
      handleAddPerson();
    }
  };

  return (
    <div className="container">
      <h1>People List</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </label>

        <label>
          Gender:
          <input
            type="text"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
          />
        </label>

        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <button type="submit">
          {editingId !== null ? "Save Changes" : "Add Person"}
        </button>
        {editingId !== null && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <span>{person.id}</span>
            <span>
              {person.name} ({person.age})
            </span>
            <span>{person.gender}</span>
            <span>{person.email}</span>
            {editingId !== person.id && (
              <button onClick={() => handleEditPerson(person)}>Edit</button>
            )}
            {editingId === person.id && (
              <button onClick={() => handleUpdatePerson(person.id)}>
                Save Changes
              </button>
            )}
            <button onClick={() => handleDeletePerson(person.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PeopleList;
