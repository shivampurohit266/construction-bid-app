import React, { useState, useEffect } from "react";
import Header from "../../shared/Header";
import { Link } from "react-router-dom";
import BussinessSidebar from "../../shared/BussinessSidebar";
import { withTranslation } from "react-i18next";
import { url } from "../../../helper/helper";
import axios from "axios";

import "./roles.css";
import Sidebar from "../../shared/Sidebar";

const CreateRoles = (props) => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState("");

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
    createRole();
    props.history.push("/permission");
  };

  const createRole = async () => {
    const token = await localStorage.getItem("token");

    axios
      .post(
        `${url}/api/role/store`,
        { name: name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {})
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
            to="/roles/create"
            className="breadcrumb-item active"
            aria-current="page"
          >
            {props.t("b_sidebar.roles.create")}
          </Link>
        </ol>
      </nav>
      <div className="main-content">
        <Sidebar dataFromParent={props.location.pathname} />
        <div className="page-content">
          <h3 className="project-title">
            {props.t("permission.create_new_role")}
          </h3>
          <section className="create-section">
            <form className="role-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{props.t("account.Role")}</label>
                <input
                  className={errors ? "hasError" : "noError"}
                  type="text"
                  placeholder={props.t("permission.add_name")}
                  value={name}
                  onChange={handleChange}
                  name="input"
                />
                <div className="error">{errors}</div>
              </div>
              <button type="submit" className="create">
                {props.t("c_material_list.listing.create")}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(CreateRoles);
