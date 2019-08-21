import React, { Component } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import axios from "axios";
import { Table } from "bootstrap-4-react";

class App extends Component {
  // initialize our state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    addItem: ""
  };
  addToDB = () => {
    console.log(this.state.addItem);
    this.putDataToDB(this.state.addItem);
  };
  changeAddItem = newValue => {
    this.setState(
      {
        addItem: newValue
      },
      () => {
        console.log("setState completed", this.state);
        this.addToDB();
      }
    );
  };
  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = idTodelete => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
      <>
        <SearchBar
          addItem={this.state.first}
          changeAddItem={this.changeAddItem.bind(this)}
          addToDB={this.addToDB.bind(this)}
        />
        <Table className striped bordered hover>
          <thead>
            <tr>
              <th className="head-1">Name</th>
              <th>id</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length <= 0
              ? "NO DB ENTRIES YET"
              : data.map(dat => {
                  return (
                    <>
                      <tr key={data.message}>
                        <td>{dat.message}</td>
                        <td>{dat.id} </td>
                        <td
                          onClick={() =>
                            this.setState({ idToDelete: dat.id }, () =>
                              this.deleteFromDB(this.state.idToDelete)
                            )
                          }
                        >
                          Delete
                        </td>
                      </tr>
                    </>
                  );
                })}
          </tbody>
        </Table>

        {/* <div>
          <ul>
            {data.length <= 0
              ? "NO DB ENTRIES YET"
              : data.map(dat => (
                  <li style={{ padding: "10px" }} key={data.message}>
                    <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                    <span style={{ color: "gray" }}> data: </span>
                    {dat.message}
                  </li>
                ))}
          </ul>
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              onChange={e => this.setState({ message: e.target.value })}
              placeholder="add something in the database"
              style={{ width: "200px" }}
            />
            <button onClick={() => this.putDataToDB(this.state.message)}>
              ADD
            </button>
          </div> 
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToDelete: e.target.value })}
              placeholder="put id of item to delete here"
            />
            <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              DELETE
            </button>
          </div>
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToUpdate: e.target.value })}
              placeholder="id of item to update here"
            />
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ updateToApply: e.target.value })}
              placeholder="put new value of the item here"
            />
            <button
              onClick={() =>
                this.updateDB(this.state.idToUpdate, this.state.updateToApply)
              }
            >
              UPDATE
            </button>
          </div>
        </div> */}
      </>
    );
  }
}

export default App;
