import React, { Component } from "react";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { url } from "../../helper/helper";
import List from "./list";

class Roles extends React.Component {
  state = {
    name: "",
    list: null,
  };

  componentDidMount() {
    this.loadRole();
  };
 

  handleChange = (event) => {
    let { name, value } = event.target;
    let { errors } = this.state;
    this.setState({
      errors,
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, display_name } = this.state;
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify([
        {
          name,
          display_name,
        },
      ]),
    };
    fetch(`${url}/api/role/store?name=${this.state.name}`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          res.json().then(({ errors }) => {
            return console.log(errors);
          });
        }
        return res.json();
      })
      .then((res) => {
        this.setState({ name: "", display_name: "" });
        // this.props.history.push("/");
      })
      .catch((errors) => this.setState({ errors }));
    this.loadRole();
  };
  loadRole = () => {
    const token = localStorage.getItem("token");
    fetch(`${url}/api/role_list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ list: data });
      });
  };

  render() {
    return (
      <>
        {/* <Header /> */}
        <div>
          <button style={{ fontSize: "30px" }}>Add New</button>
          <form onSubmit={this.handleSubmit}>
            <input name="name" onChange={this.handleChange} />
            <input
              type="submit"
              className="bg-green-500 px-8 py-3 rounded text-white font-semibold text-xl"
              value="Add Roles"
              onClick={this.handleSubmit}
            ></input>
          </form>
        </div>
        <List list={this.state.list} />
      </>
    );
  }
}

export default withTranslation()(Roles);
