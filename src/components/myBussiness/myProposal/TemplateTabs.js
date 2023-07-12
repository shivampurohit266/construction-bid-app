import React from "react";
import { withTranslation } from "react-i18next";
// import {
//   Button,
//   Card,
//   CardText,
//   CardTitle,
//   Col,
//   Nav,
//   NavItem,
//   NavLink,
//   Row,
//   TabContent,
//   TabPane,
// } from "reactstrap";

const TemplateTabs = ({ t, children, type, setType, reset }) => {
  return (
    <div>
      <ul className="nav nav-pills row">
        <li
          onClick={() => {
            setType("Work");
            reset();
          }}
          className={type === "Work" ? "active col" : "col"}
        >
          <a
            className={type === "Work" ? "active" : ""}
            data-toggle="pill"
            href="#work"
          >
            {t("myBusiness.template.Work")}
          </a>
        </li>
        <li
          onClick={() => {setType("Material"); reset()}}
          className={type === "Material" ? "active col" : "col"}
        >
          <a
            className={type === "Material" ? "active" : ""}
            data-toggle="pill"
            href="#material"
          >
            {t("myBusiness.template.Material")}
          </a>
        </li>
        <li
          onClick={() => {setType("Both"); reset()}}
          className={type === "Both" ? "active col" : "col"}
        >
          <a
            className={type === "Both" ? "active" : ""}
            data-toggle="pill"
            href="#work-material"
          >
            {t("myBusiness.template.WorkandMaterial")}
          </a>
        </li>
      </ul>
      <div className="tab-content">{children}</div>
    </div>
  );
};

export default withTranslation()(TemplateTabs);
