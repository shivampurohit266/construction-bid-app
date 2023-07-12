import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
import { getData } from '../../../helper/api';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class ProjectPlanOpen extends Component {
  state = {
    template_names: [],
    name: '',
  };

  componentDidMount = () => {
    this.loadNames();
  };

  handleName = (event) => {
    this.setState({ name: event.target.value });
  };

  SendName = () => {
    this.props.onSelectedName(this.state.name);
  };

  loadNames = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/pro-plan/names/all`, token)
      .then((result) => {
        //console.log("result", result);
        if (result.data?.data) {
          this.setState({ template_names: result.data?.data });
        }
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  render() {
    const { t, i18n, show, handleClose } = this.props;
    const options = this.state.template_names
      ? this.state.template_names?.map(({ template_name }, index) => (
        <option key={index} value={template_name}>
          {template_name}
        </option>
      ))
      : [];
    return (
      <Modal
        isOpen={show}
        toggle={() => handleClose()}
        className={"modalPropu"}
        centered
      >
        <ModalHeader toggle={() => handleClose()}>
          {t("ProjectPlanOpen.heading")}
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-11">
              <div className="form-group mb-5">
                <div className="profile flex">
                  <div className="content">
                    <h4> {t("ProjectPlanOpen.template")} </h4>
                  </div>
                </div>
              </div>
              <div className="form-group ">
                <select
                  onChange={this.handleName}
                  name="type"
                  className="form-control"
                >
                  <option value=""> {t("ProjectPlanOpen.Name")} </option>
                  {options}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-outline-dark mt-3"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.SendName}
              >
                {t("ProjectPlanOpen.Open")}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default withTranslation()(ProjectPlanOpen);
