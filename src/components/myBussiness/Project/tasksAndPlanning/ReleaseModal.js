import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { postDataWithToken } from "../../../../helper/api";
import { url } from "../../../../helper/helper";

const ReleaseModal = (props) => {
  const [isCustomer, setIsCustomer] = useState(false);
  const [isAssignee, setIsAssignee] = useState(false);

  const handleChangeCustomer = () => {
    setIsCustomer(!isCustomer);
  };
  const handleChangeAssignee = () => {
    setIsAssignee(!isAssignee);
  };
  console.log(
    props.projectId,
    "????",
    props.resources,
    isCustomer,
    "assignee",
    isAssignee
  );
  const releaseProject = async () => {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.set("project_id", props.projectId);
    if (isAssignee === true) {
      data.set("permission", props.resources);
    } else {
      data.set("permission", []);
    }
    // if (isCustomer === true) {
    //   data.set("permission", props.resources);
    // } else {
    //   data.set("permission", []);
    // }

    await postDataWithToken(`${url}/api/project/release_project`, data, token)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Modal
        isOpen={props.show}
        toggle={() => {
          props.handleClose();
        }}
        className={"modalPropu"}
        style={{ width: "40%" }}
        centered
        dialogClassName="modal-20w"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <ModalHeader
          toggle={() => {
            props.handleClose();
          }}
          className="d-flex justify-content-between"
        >
          <div className="modal-title">Notify Parties</div>
        </ModalHeader>
        <ModalBody>
          <div
            className="form-check form-check-inline"
            style={{ fontSize: "15px", fontWeight: "500" }}
          >
            <input
              onChange={handleChangeCustomer}
              type="checkbox"
              defaultChecked={isCustomer}
              className="form-check-input"
            />
            <label className="form-check-label">Customer</label>
          </div>
          <br />
          <div
            className="form-check form-check-inline"
            style={{ fontSize: "15px", fontWeight: "500" }}
          >
            <input
              onChange={handleChangeAssignee}
              type="checkbox"
              defaultChecked={isAssignee}
              className="form-check-input"
            />
            <label className="form-check-label">Assignee</label>
          </div>
          <hr />
          When you will release projects then above selected parties will be
          notified and assigned to this project so they can see and activites in
          project.
          <hr />
          <button className="btn btn-primary p-2" onClick={releaseProject}>
            Release Project
          </button>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ReleaseModal;
