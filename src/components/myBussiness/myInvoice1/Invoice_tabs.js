import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import Header from '../../shared/Header';
import BussinessSidebar from '../../shared/BussinessSidebar';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Sidebar from '../../shared/Sidebar';
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
  };

  handleRequestModalClose = () => {
    this.setState({
      viewRequest: !this.state.viewRequest,
    });
  };

  handleDraftModalClose = () => {
    this.setState({
      viewDraft: !this.state.viewDraft,
    });
  };

  componentDidMount = () => {
    this._isMounted = true;

    this.axiosCancelSource = axios.CancelToken.source();
    this.loadResources(this.axiosCancelSource);
    this.getproject(this.axiosCancelSource);
    this.getDraft();
    // this.loadProposal(this.axiosCancelSource);
    // this.loadDrafts(this.axiosCancelSource);
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.axiosCancelSource.cancel();
  }

  handleNameChange = (e) => {
    //console.log(e.target.value);
    if (e.target.value !== '--Select--') {
      const { selectedIndex } = e.target.options;
      const { projectdata } = this.state;
      const { id, pro_user_id, key_name, status, name } =
        projectdata[selectedIndex - 1];
      this.setState({ id, pro_user_id, key_name, status, name });
    }
  };

  getDraft = () => {
    const token = localStorage.getItem('token');
    axios
      .get(`${url}/api/invoice/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // cancelToken: axiosCancelSource.token,
      })
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
      .catch(() => {});
  };

  loadResources = async (axiosCancelSource) => {
    const token = await localStorage.getItem('token');
    axios
      .get(`${url}/api/invoice/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        // //console.log("rellllllllllllll", result.data)
        if (this._isMounted) {
          // const { data } = result.data;
          // this.feeds_search = data;
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
    //console.log("due_date", e.target.value)
    if (e.target.value !== '--Select--') {
      const { selectedIndex } = e.target.options;
      // const { resources } = this.state;
      const resources = this.state.resources ? this.state.resources : '';
      const { id, invoice_names, invoice_number, due_date, client_id } =
        resources[selectedIndex - 1];
      // //console.log("id========", id)
      // if (id && invoice_names && invoice_number && due_date && client_id) {
      this.setState({ id, invoice_names, invoice_number, due_date, client_id });
      // }
    }
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        {/* <Header active={'bussiness'} /> */}
        <div className='sidebar-toggle'></div>
        <nav aria-label='breadcrumb'>
          <ol className='breadcrumb'>
            <Link
              to='/business-dashboard'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('myBusiness.invoice.heading1')}
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
          </ol>
        </nav>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              <div className='card' style={{ maxWidth: '1120px' }}>
                <div className='card-body'>
                  <ul className='nav tablist'>
                    <li className='nav-item'>
                      <Link className='nav-link' to='/invoice'>
                        {t('myBusiness.invoice.scratch')}
                      </Link>
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
                  <Modal
                    isOpen={this.state.viewRequest}
                    toggle={() => this.handleRequestModalClose()}
                    className={'modalPropu'}
                    centered
                  >
                    <ModalHeader
                      toggle={() => this.handleRequestModalClose()}
                    ></ModalHeader>
                    <ModalBody>
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
                                  pathname: `/invoice/${this.state.id}`,
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
                    </ModalBody>
                  </Modal>

                  <Modal
                    isOpen={this.state.viewDraft}
                    toggle={() => this.handleDraftModalClose()}
                    className={'modalPropu'}
                    centered
                  >
                    <ModalHeader
                      toggle={() => this.handleDraftModalClose()}
                    ></ModalHeader>
                    <ModalBody>
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
                    </ModalBody>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Invoice_tabs);
