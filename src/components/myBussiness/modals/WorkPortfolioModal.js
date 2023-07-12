import { Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import React, { useEffect, useState } from "react";
import { base_url, url } from "../../../helper/helper";
import { getData } from "../../../helper/api";
import "./workhistorymodal.css";

const WorkPortfolioModal = (props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const token = localStorage.getItem("token");

  const { id, userId, show, handleClose } = props;
  console.log(title, ">>>>>>>", image);

  useEffect(() => {
    editWorkHistory(id, userId);
  }, [id, userId]);
  const editWorkHistory = async (id, userId) => {
    if (id && userId) {
      await getData(
        `${url}/api/account/get-user-work-history-detail/${userId}/${id}`,
        token
      )
        .then((res) => {
          console.log(res.data[0], ">>>>>>>>");
          if (res.data) {
            let data = res?.data[0];
            setImage({
              preview: `${url}/images/marketplace/work-history/${res?.data[0].image}`,
            });
            setTitle(res?.data[0]?.title);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <Modal
        isOpen={show}
        toggle={() => {
          handleClose();
          setImage([]);
          setTitle("");
        }}
        className={"modalPropu preview-modal"}
        centered
      >
        <ModalHeader
          className="justify-content-center"
          toggle={() => {
            handleClose();
            setImage([]);
            setTitle("");
          }}
        ></ModalHeader>
        <ModalBody>
          <h4 style={{ textAlign: "center" }}></h4>
          <div className="d-flex justify-content-center mb-3">
            {image?.preview ? (
              <img
                style={{
                  width: "350px",
                }}
                src={image?.preview}
                alt="..."
              />
            ) : (
              <Spinner></Spinner>
            )}
          </div>
          <div className="d-flex justify-content-center">
            <h3>{title}</h3>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default WorkPortfolioModal;
