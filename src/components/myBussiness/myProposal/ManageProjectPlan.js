import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { compareAsc, format } from "date-fns";
import Breadcrumb from "../../shared/Breadcrumb";
import Sidebar from "../../shared/Sidebar";
import "./ManageProject.scss";
import EditIcon from "../../../images/edit.png";
import DeleteIcon from "../../../images/delete.png";
import CopyIcon from "../../../images/copy.png";
import ThreeDots from "../../../images/three-dots.png";
import { url } from "../../../helper/helper";
import { getData, deleteData, postDataWithToken } from "../../../helper/api";
import SweetAlert from "react-bootstrap-sweetalert";

const ManageProjectPlan = ({ t }) => {
  const [succesUpdate, setSuccesUpdate] = useState(false);
  const [modificationState, setModificationState] = useState(false);
  const [openState, setOpenState] = useState(0);
  const [allTemplates, setAllTemplates] = useState([]);

  useEffect(() => {
    getAllTemplates();
  }, []);

  const getAllTemplates = async () => {
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/pro-plan/manage-listing`, token)
      .then((result) => {
        //console.log("result", result);
        if (result.data?.data) {
          setAllTemplates(result.data?.data);
        }
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  const deleteTemplate = async (e, id) => {
    e.preventDefault();
    if (window.confirm("You want to delete ?")) {
      const token = await localStorage.getItem("token");
      await deleteData(`${url}/api/pro-plan/delete/${id}`, token)
        .then((result) => {
          setSuccesUpdate(true);
          getAllTemplates();
        })
        .catch((err) => {
          //console.log(err);
        });
    }
  };

  const copyData = async (props) => {
    const token = await localStorage.getItem("token");
    if (window.confirm("You want to copy ?")) {
      await getData(`${url}/api/pro-plan/duplicate/${props}`, token)
        .then((result) => {
          // console.log(result, "<<result");
          setSuccesUpdate(true);
          getAllTemplates();
        })
        .catch((err) => {
          //console.log(err);
        });
    }
  };

  const handleModification = (modificationId) => {
    setOpenState(modificationId);
    setModificationState(!modificationState);
  };

  return (
    <React.Fragment>
      {succesUpdate ? (
        <SweetAlert
          success
          title={t("login.SuccessPopup")}
          onConfirm={() => setSuccesUpdate(false)}
        ></SweetAlert>
      ) : (
        ""
      )}
      <div>
        <Breadcrumb>
          <li className="breadcrumb-item active project-planning">
            <Link to="/business-dashboard" aria-current="page">
              {t("myBusiness.offer.heading")}
            </Link>
          </li>
          <li className="breadcrumb-item active project-planning">
            <Link to="/proposal-listing" aria-current="page">
              {t("myBusiness.offer.proposal")}
            </Link>
          </li>
          <li
            className="breadcrumb-item active project-planning"
            aria-current="page"
          >
            {t("myBusiness.offer.create")}
          </li>
        </Breadcrumb>
        <div className="main-content">
          <Sidebar dataFromParent={window.location.pathname} />
          <div className="page-content">
            <div className="container-fluid">
              <h2 className="head3">
                {t("project_planning.manage_quotation")}
              </h2>
              <div className="card" style={{ maxWidth: "1150px" }}>
                <div className="card-body manage-Project">
                  <div className="search-block d-flex justify-content-between mb-5">
                    <input
                      type="text"
                      placeholder={t("project_planning.search")}
                    />

                    <Link to="/proposal-projectplanning-new">
                      <button className="btn btn-primary btn-without-radius ">
                        {t("project_planning.create_btn")}
                      </button>
                    </Link>
                  </div>

                  <div className="grid grid-header">
                    <div className="grid-span-2">
                      {t("project_planning.manage_title")}
                    </div>
                    <div> {t("project_planning.date_created")}</div>
                    <div className="desktop-col">
                      {t("project_planning.manage_type")}
                    </div>
                    <div className="desktop-col">
                      {t("project_planning.action")}
                    </div>
                  </div>

                  {allTemplates.map((val, i) => {
                    const modificationId = val.id;
                    return (
                      <div key={i} className="grid grid-content">
                        <div className="grid-span-2">
                          <div className="title-value">{val.template_name}</div>
                          <div className="type-value">{val.type}</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          {format(new Date(val.created_at), "dd MMM yyyy")}
                          <div
                            className="responsive-col three-dots"
                            onClick={() => {
                              handleModification(modificationId);
                            }}
                          >
                            <img src={ThreeDots} alt="three-dots" />

                            {modificationState && (
                              <div
                                className={`three-dots-items ${
                                  openState === modificationId
                                    ? "block"
                                    : "none"
                                }`}
                              >
                                <div className="flex responsive-col">
                                  <div className="edit mr-4">
                                    <Link
                                      to={`/proposal-projectplanning-new/${val.template_name}`}
                                    >
                                      {t("project_planning.edit")}
                                    </Link>
                                  </div>
                                  <div className="copy mr-4">
                                    <Link to="#">
                                      <span onClick={() => copyData(val.id)}>
                                        {t("project_planning.copy")}
                                      </span>
                                    </Link>
                                  </div>
                                  <div className="delete">
                                    <Link to="#">
                                      <span
                                        onClick={(e) =>
                                          deleteTemplate(e, val.id)
                                        }
                                      >
                                        {t("project_planning.delete")}
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="desktop-col">{val.type}</div>
                        <div className="flex desktop-col">
                          <div className="edit mr-4">
                            <Link
                              to={`/proposal-projectplanning-new/${val.template_name}`}
                            >
                              <img src={EditIcon} alt="Edit Icon" />
                            </Link>
                          </div>
                          <div className="copy mr-4">
                            <Link to="#">
                              <img
                                onClick={() => copyData(val.id)}
                                src={CopyIcon}
                                alt="Edit Icon"
                              />
                            </Link>
                          </div>
                          <div className="delete">
                            <Link to="#">
                              <img
                                onClick={(e) => deleteTemplate(e, val.id)}
                                src={DeleteIcon}
                                alt="Edit Icon"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(ManageProjectPlan);
