import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  
  // Fetch users from backend
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Add user
  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
    
    return promise.then((res) => {
      if (res.status === 201) {
        return res.json();
      } else {
        throw new Error("Failed to create user.")
      }
    });
    
  }

  function updateList(person) {
    postUser(person)
      .then((person) => setCharacters([...characters, person]))
      .catch((error) => {
        console.log(error);
      });
  }

  // Delete user
  function removeOneCharacter(index) {
    const deleted = characters[index].id;
    const promise = fetch(`http://localhost:8000/users/${deleted}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    return promise.then((res) => {
      if (res.status === 204) {
        const updated = characters.filter((character, i) => {
          return i !== index;
        });
        setCharacters(updated);
      } else if (res.status === 404) {
        throw new Error("Character not found");
      } else {
        throw new Error("Failed to delete character");
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
