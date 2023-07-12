import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import Header from '../../shared/Header';
import BussinessSidebar from '../../shared/BussinessSidebar';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Breadcrumb from '../../shared/Breadcrumb';
import Sidebar from '../../shared/Sidebar';
import { getData } from '../../../helper/api';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class Invoice_tabs extends Component {
  state = {
    feeds: [],
    projectdata: [],
    proposal_id: 0,
    proposal_client_id: 0,
    proposal_client_type: '',
    notification_bid_id: 0,
    notification_sender_id: 0,
    drafts: [],
    agreement_client_id: 0,
    agreement_request_id: 0,
    draft: '',
    viewRequest: false,
    viewDraft: false,
    viewAgreement: false,
    agreementListing: [],
  };

  handleRequestModalClose = () => {
    this.setState({
      viewRequest: !this.state.viewRequest,
      viewDraft: false,
      viewAgreement: false,
    });
  };

  handleDraftModalClose = () => {
    this.setState({
      viewDraft: !this.state.viewDraft,
      viewRequest: false,
      viewAgreement: false,
    });
  };
  handleAgreementModalClose = () => {
    this.setState({
      viewAgreement: !this.state.viewAgreement,
      viewDraft: false,
      viewRequest: false,
    });
  };

  componentDidMount = () => {
    this._isMounted = true;
    this.agreementListing();

    this.loadResources();
    this.getproject();
    this.getDraft();
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleNameChange = (e) => {
    if (e.target.value !== '--Select--') {
      const { selectedIndex } = e.target.options;
      const { projectdata } = this.state;
      const { id, pro_user_id, key_name, status, name } =
        projectdata[selectedIndex - 1];
      this.setState({ id, pro_user_id, key_name, status, name });
    }
  };

  handleNameChange2 = (e) => {
    if (e.target.value !== '--Select--') {
      const { selectedIndex } = e.target.options;
      const { agreementListing } = this.state;
      const {
        agreement_id,
        agreement_user_id,
        agreement_status,
        agreement_names,
      } = agreementListing[selectedIndex - 1];
      this.setState({
        agreement_id,
        agreement_user_id,
        agreement_status,
        agreement_names,
      });
    }
  };
  getDraft = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/invoice/get`, token)
      .then((result) => {
        if (this._isMounted) {
          const { data } = result.data;
          this.feeds_search = data;
          this.setState({ drafts: result.data.data });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  // getproject = async (axiosCancelSource) => {
  //   const token = await localStorage.getItem("token");
  //   var myHeaders = new Headers();
  //   myHeaders.append("Accept", "application/json");
  //   myHeaders.append("Authorization", `Bearer ${token}`);

  //   var requestOptions = {
  //     method: 'GET',
  //     headers: myHeaders,
  //     redirect: 'follow'
  //   };

  //   fetch(`${url}/public/api/projectGet`, requestOptions)
  //     .then(response => response.json())
  //     .then(result => {
  //       //console.log("result===========", result);
  // this.setState({
  //   projectdata: result.data
  // })
  //     })
  //     .catch(error => //console.log('error', error));
  // }

  agreementListing = async () => {
    const token = await localStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${url}/api/agreement/completed`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result,"result>>");
        this.setState({ 
          agreementListing: result,
        });
      })
      .catch((error) => console.log('error', error));
  };

  getproject = async () => {
    const token = await localStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${url}/api/projectGet`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log(result)
        this.setState({
          projectdata: result.data,
        });
      })
      .catch((error) => console.log('error', error));
  };

  loadResources = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/invoice/get`, token)
      .then((result) => {
        if (this._isMounted) {
          const d = result.data.data?.filter((x) => x.sent === 0);
          if (d) {
            this.setState({ resources: d });
          }
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  handleNameChange1 = (e) => {
    if (e.target.value !== '--Select--') {
      const { selectedIndex } = e.target.options;

      const resources = this.state.resources ? this.state.resources : '';
      const { id, invoice_names, invoice_number, due_date, client_id } =
        resources[selectedIndex - 1];

      this.setState({ id, invoice_names, invoice_number, due_date, client_id });
    }
  };

  render() {
    console.log(this.state.agreementListing);
    const { t } = this.props;
    return (
      <div>
        {/* <Header active={'bussiness'} /> */}
        <Breadcrumb>
          <Link
            to='/business-dashboard'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {t('myBusiness.invoice.heading')}
          </Link>
          <Link
            to='/invoice-list'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {t('myBusiness.invoice.invoice')}
          </Link>
          <li className='breadcrumb-item active' aria-current='page'>
            {t('myBusiness.invoice.create')}
          </li>
        </Breadcrumb>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              <div className='card' style={{ maxWidth: '1120px' }}>
                <div className='card-body'>
                  <ul className='nav tablist'>
                    <li className='nav-item'>
                      <Link className='nav-link' to='/invoice/0'>
                        {t('myBusiness.invoice.scratch')}
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <button
                        className='nav-link'
                        type='button'
                        onClick={() => this.handleAgreementModalClose()}
                      >
                        {t('myBusiness.invoice.create_agreement')}
                      </button>
                    </li>
                    <li className='nav-item'>
                      <button
                        className='nav-link'
                        type='button'
                        onClick={() => this.handleRequestModalClose()}
                      >
                        {t('myBusiness.invoice.prop_request')}
                      </button>
                    </li>
                    <li className='nav-item'>
                      <button
                        className='nav-link'
                        type='button'
                        onClick={() => this.handleDraftModalClose()}
                      >
                        {t('myBusiness.invoice.invoic_upd')}
                      </button>
                    </li>
                  </ul>
                  {/* <Modal
                    isOpen={this.state.viewRequest}
                    toggle={() => this.handleRequestModalClose()}
                    className={"modalPropu"}
                    centered
                  >
                    <ModalHeader
                      toggle={() => this.handleRequestModalClose()}
                    ></ModalHeader>
                    <ModalBody>
                      <div className="form-group">
                        <label htmlFor="select-proposal" />
                        {t("myBusiness.invoice.Select_Agreement/Invoice")}
                        <div className="row">
                          <div className="col-md-8">
                            <select
                              onChange={this.handleNameChange}
                              id="select-agreement"
                              className="form-control"
                            >
                              <option> {t("myBusiness.invoice.Select")} </option>

                              {this.state.projectdata?.length > 0
                                ? this.state.projectdata?.map((project, i) => {
                                    return (
                                      <>
                                        {" "}
                                        <option key={i} id={i}>
                                          {project.name}
                                        </option>{" "}
                                      </>
                                    );
                                  })
                                : ""}
                            </select>
                          </div>
                          <div className="col-md-4 mt-md-0 mt-4">
                            {this.state.pro_user_id > 0 ? (
                              <Link
                                className="btn btn-blue"
                                to={{
                                  pathname: `/invoice/${this.state.id}`,
                                  state: {
                                    data: this.state.name,
                                  },
                                }}
                              >
                                {t("myBusiness.invoice.Create_Invoice")}
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </ModalBody>
                  </Modal> */}

                  {/* <Modal
                    isOpen={this.state.viewDraft}
                    toggle={() => this.handleDraftModalClose()}
                    className={"modalPropu"}
                    centered
                  >
                    <ModalHeader
                      toggle={() => this.handleDraftModalClose()}
                    ></ModalHeader>
                    <ModalBody>
                      <div className="form-group">
                        <label htmlFor="select-proposal" />
                        {t("myBusiness.invoice.Selectproject")}

                        <div className="row">
                          <div className="col-md-8">
                            <select
                              onChange={this.handleNameChange1}
                              id="select-agreement"
                              className="form-control"
                            >
                              <option> {t("myBusiness.invoice.Select")} </option>
                              {typeof this.state.drafts !== "string"
                                ? this.state.drafts
                                    ?.filter((val) => {
                                      if (val.sent === 0) {
                                        return val;
                                      }
                                    })
                                    .map(
                                      (
                                        {
                                          proposal_request_id,
                                          proposal_client_type,
                                          invoice_names,
                                          id,
                                        },
                                        index
                                      ) => (
                                        <option
                                          key={index}
                                        >{`${invoice_names}`}</option>
                                      )
                                    )
                                : []}
                            </select>
                          </div>
                          <div className="col-md-4 mt-md-0 mt-4">
                            {this.state.id > 0 ? (
                              <Link
                                className="btn btn-blue"
                                to={{
                                  pathname: `/invoice/${this.state.id}/draft`,
                                }}
                              >
                                {t("myBusiness.invoice.Update_Invoice")}
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </ModalBody>
                  </Modal> */}
                </div>
              </div>
              {this.state.viewRequest && (
                <div className='card' style={{ maxWidth: '1120px' }}>
                  <div className='card-body'>
                    <div className='form-group'>
                      <label htmlFor='select-proposal' />
                      {t('myBusiness.invoice.Select_Agreement/Invoice')}
                      <div className='row'>
                        <div className='col-md-8'>
                          <select
                            onChange={this.handleNameChange}
                            id='select-agreement'
                            className='form-control'
                          >
                            <option> {t('myBusiness.invoice.Select')} </option>
                            {/* {options2} */}

                            {this.state.projectdata?.length > 0
                              ? this.state.projectdata?.map((project, i) => {
                                  return (
                                    <>
                                      {' '}
                                      <option key={i} id={i}>
                                        {project.name}
                                      </option>{' '}
                                    </>
                                  );
                                })
                              : ''}
                          </select>
                        </div>
                        <div className='col-md-4 mt-md-0 mt-4'>
                          {this.state.pro_user_id > 0 ? (
                            <Link
                              className='btn btn-blue'
                              to={{
                                pathname: `/invoice/2/${this.state.id}`,
                                state: {
                                  data: this.state.name,
                                },
                              }}
                            >
                              {t('myBusiness.invoice.Create_Invoice')}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {this.state.viewDraft && (
                <div className='card' style={{ maxWidth: '1120px' }}>
                  <div className='card-body'>
                    <div className='form-group'>
                      <label htmlFor='select-proposal' />
                      {t('myBusiness.invoice.Selectproject')}

                      <div className='row'>
                        <div className='col-md-8'>
                          <select
                            onChange={this.handleNameChange1}
                            id='select-agreement'
                            className='form-control'
                          >
                            <option> {t('myBusiness.invoice.Select')} </option>
                            {/* {typeof this.state.drafts !== "string" */}
                            {typeof this.state.drafts !== 'string'
                              ? this.state.drafts
                                  ?.filter((val) => {
                                    if (val.sent === 0) {
                                      return val;
                                    }
                                  })
                                  .map(
                                    (
                                      {
                                        proposal_request_id,
                                        proposal_client_type,
                                        invoice_names,
                                        id,
                                      },
                                      index
                                    ) => (
                                      <option
                                        key={index}
                                      >{`${invoice_names}`}</option>
                                    )
                                  )
                              : []}
                          </select>
                        </div>
                        <div className='col-md-4 mt-md-0 mt-4'>
                          {this.state.id > 0 ? (
                            <Link
                              className='btn btn-blue'
                              to={{
                                pathname: `/invoice/${this.state.id}/draft`,
                              }}
                            >
                              {t('myBusiness.invoice.Update_Invoice')}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {this.state.viewAgreement && (
                <div className='card' style={{ maxWidth: '1120px' }}>
                  <div className='card-body'>
                    <div className='form-group'>
                      <label htmlFor='select-proposal' />
                      {t('myBusiness.invoice.Select_Agreement/Invoice')}
                      <div className='row'>
                        <div className='col-md-8'>
                          <select
                            onChange={this.handleNameChange2}
                            id='select-agreement'
                            className='form-control'
                          >
                            <option> {t('myBusiness.invoice.Select')} </option>
                            {/* {options2} */}

                            {typeof this.state.agreementListing !== 'string' && this.state.agreementListing?.length > 0
                              ? this.state.agreementListing?.map(
                                  (agreement, i) => {
                                    return (
                                      <>
                                        {' '}
                                        <option
                                          key={i}
                                          id={agreement.agreement_id}
                                        >
                                          {agreement.agreement_names}
                                        </option>{' '}
                                      </>
                                    );
                                  }
                                )
                              : ''}
                          </select>
                        </div>
                        <div className='col-md-4 mt-md-0 mt-4'>
                          {this.state.agreement_user_id > 0 ? (
                            <Link
                              className='btn btn-blue'
                              to={{
                                pathname: `/invoice/1/${this.state.agreement_id}`,
                                state: {
                                  data: this.state.agreement_names,
                                },
                              }}
                            >
                              {t('myBusiness.invoice.Create_Invoice')}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Invoice_tabs);
