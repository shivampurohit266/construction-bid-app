import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Files from "react-files";
import ProgressBar from "react-bootstrap/ProgressBar";
import File from "../../../images/workhistorymodal.svg";
import { getData, postDataWithToken } from "../../../helper/api";
import { base_url, url } from "../../../helper/helper";
import "./workhistorymodal.css";

const WorkHistoryModal = (props) => {
  const [image, setImage] = useState([]);
  const [title, setTitle] = useState("");
  const [loaded, setLoaded] = useState(0);
  // const[userId,setUserId]=useState("")
  const { t, show, handleClose, getWorkHistory, id } = props;
  console.log(id, ">>>>>>>>>");
  useEffect(() => {
    setImage([]);
    setTitle("");
    editWorkHistory(id);
  }, [id]);

  const addWorkHistory = async () => {
    const data = new FormData();
    data.set("title", title);
    data.set("image", image);
    const token = await localStorage.getItem("token");
    await postDataWithToken(
      `${url}/api/account/add-work-history`,
      data,
      token
    )
      .then((res) => {
        if (res) {
          console.log("successss");
          handleClose();
          setImage([]);
          setTitle("");
          setLoaded(0);
          getWorkHistory();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateWorkHistory = async () => {
    const data = new FormData();
    data.set("title", title);
    data.set("image", image);
    data.set("id", id);
    const token = await localStorage.getItem("token");
    await postDataWithToken(
      `${url}/api/account/update-work-history`,
      data,
      token
    )
      .then((res) => {
        console.log(res);
        if (res) {
          console.log("successs");
          handleClose();
          setImage([]);
          setTitle("");
          setLoaded(0);
          getWorkHistory();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editWorkHistory = async (id) => {
    if (id) {
      const token = await localStorage.getItem("token");
      await getData(
        `${url}/api/account/edit-work-history/${id}`,
        token
      )
        .then((res) => {
          console.log(res.data, ">>>>>>>>");
          if (res.data) {
            let data = res?.data[0];
            setImage({
              preview: `${url}/images/marketplace/work-history/${res?.data[0].image}`,
            });
            setTitle(res?.data[0]?.title);
            setLoaded(100);
            //  setUserId(res?.data[0]?.user_id)
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const deleteWorkHistory = async (id) => {
    if (id) {
      const token = await localStorage.getItem("token");
      await getData(
        `${url}/api/account/delete-work-history/${id}`,
        token
      )
        .then((res) => {
          console.log(res, ">>>>>>>>");
          if (res?.data) {
            handleClose();
            setImage([]);
            setTitle("");
            setLoaded(0);
            getWorkHistory();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onFilesChange = (files) => {
    if (files.length > 0) {
      setLoaded(0);
      setImage(
        Object.assign(files[0], {
          preview: URL.createObjectURL(files[0]),
        })
      );
      if (loaded <= 100) {
        setTimeout(function () {
          setLoaded(100);
        }, 1000); // wait 2 seconds, then reset to false
      }
    }
  };
  const onFilesError = (error, file) => {
    console.log(error);
  };
  return (
    <div>
      <Modal
        isOpen={show}
        toggle={() => {
          handleClose();
          setImage([]);
          setTitle("");
          setLoaded(0);
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
            setLoaded(0);
          }}
        ></ModalHeader>
        <ModalBody>
          <h4 style={{ textAlign: "center" }}>
            {/* {t('account.confirmDelete')} */}
          </h4>
          <div className="form-group work-history">
            <Files
              className="work-files-dropzone"
              onChange={(e) => onFilesChange(e)}
              onError={(e) => onFilesError(e)}
              accepts={[
                "image/gif",
                "image/jpeg",
                "image/png",
                "image/jpg",
                ".svg",
              ]}
              maxFileSize={10000000}
              minFileSize={10}
              clickable
            >
              <label htmlFor="file11">
                {image.length <= 0 ? (
                  <img src={File} alt="..." />
                ) : (
                  <div>
                    <img
                      style={{
                        width: "350px",
                      }}
                      src={image.length <= 0 ? File : image.preview}
                      alt="..."
                    />
                  </div>
                )}
                {!image?.preview && (
                  <span className="status">
                    {t("marketplace.work.create_work_list.Upload")}
                  </span>
                )}
                <ProgressBar className="mt-2" now={loaded} />
              </label>
            </Files>
          </div>
          {id && (
            <div className="d-flex justify-content-end mb-2">
              <button
                className="btn btn-primary"
                onClick={() => deleteWorkHistory(id)}
              >
                Delete
              </button>
            </div>
          )}
          <div className="mb-2">
            <textarea
              name="email"
              onChange={(e) => setTitle(e.target.value)}
              id="email"
              value={title}
              className="form-control"
              type="text"
              rows={4}
              placeholder="Caption of image"
            />
          </div>
          {!id ? (
            <button
              disabled={!title || !image.preview}
              className="btn btn-primary"
              onClick={addWorkHistory}
            >
              Add
            </button>
          ) : (
            <button className="btn btn-primary" onClick={updateWorkHistory}>
              Update
            </button>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default withTranslation()(WorkHistoryModal);
