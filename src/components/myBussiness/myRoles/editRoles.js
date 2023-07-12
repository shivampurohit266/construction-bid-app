import React, { useState, useEffect } from "react";
import Header from "../../shared/Header";
import { Link } from "react-router-dom";
import BussinessSidebar from "../../shared/BussinessSidebar";
import { withTranslation } from "react-i18next";
import { url } from "../../../helper/helper";
import axios from "axios";

import "./roles.css";
import Sidebar from "../../shared/Sidebar";
const EditRoles = (props) => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState("");

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("RoleID");

    axios
      .get(`${url}/api/role_list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const match = res.data.find((result) => String(result.id) === id);

        setName(match.display_name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setName(e.target.value);
    const newErrors = errors;
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasErrors = false;
    let newErrors = errors;

    if (!name) {
      hasErrors = true;
      newErrors = "Name Required";
    }
    if (name.length > 1 && name.length < 5) {
      hasErrors = true;
      newErrors = "Please enter at least 5 characters";
    }
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    EditRole();
    props.history.push("/permission");
  };

  const EditRole = () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("RoleID");

    axios
      .post(
        `${url}/api/role/update/${id}`,
        { name: name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {/* <Header /> */}
      <div className="sidebar-toggle"></div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <Link
            to="/business-dashboard"
            className="breadcrumb-item active"
            aria-current="page"
          >
            {props.t("header.my_bussiness")}
          </Link>
          <Link
            to="/roles/edit"
            className="breadcrumb-item active"
            aria-current="page"
          >
            {props.t("create_report.edit_roles")}
          </Link>
        </ol>
      </nav>
      <div className="main-content">
        <Sidebar dataFromParent={props.location.pathname} />
        <div className="page-content">
          <h3 className="project-title">Create Project</h3>
          <section className="create-section">
            <form className="role-form" onSubmit={handleSubmit}>
              <label>
                Role
                <input
                  className={errors ? "hasError" : "noError"}
                  type="text"
                  placeholder="Role"
                  value={name}
                  onChange={handleChange}
                  name="input"
                />
                <div className="error">{errors}</div>
              </label>
              <button type="submit" className="create">
                {props.t("create_report.edit")}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(EditRoles);
