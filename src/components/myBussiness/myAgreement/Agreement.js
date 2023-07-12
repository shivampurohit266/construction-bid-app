import React, { Component } from 'react';
import axios from 'axios';
import { url, userRole } from '../../../helper/helper';
import Header from '../../shared/Header';
import BussinessSidebar from '../../shared/BussinessSidebar';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './style.css';
// import { Collapse, Accordion, Card, Button } from 'react-bootstrap';
import Breadcrumb from '../../shared/Breadcrumb';
import Sidebar from '../../shared/Sidebar';
import { getData } from '../../../helper/api';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class BusinessProposal extends Component {
  state = {
    feeds: [],
    proposal_id: 0,
    proposal_client_id: 0,
    proposal_client_type: '',
    drafts: [],
    agreement_client_id: 0,
    agreement_request_id: 0,
    open: false,
    draft: '',
    viewRequest: false,
    viewDraft: false,
  };

  handleRequestModalClose = () => {
    this.setState({
      viewRequest: !this.state.viewRequest,
      viewDraft: false,
    });
  };

  handleDraftModalClose = () => {
    this.setState({
      viewDraft: !this.state.viewDraft,
      viewRequest: false,
    });
  };
  componentDidMount = () => {
    this._isMounted = true;

    this.loadProposal();
    this.loadDrafts();
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadProposal = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/agreement/get/proposals`, token)
      .then((result) => {
        if (this._isMounted) {
          this.setState({ feeds: result.data?.filter((x) => x.proposal_id) });
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

  loadDrafts = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/agreement/get/drafts`, token)
      .then((result) => {
        if (this._isMounted) {
          this.setState({ drafts: result.data });
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

  handleNameChange = (e) => {
    if (e.target.value !== '--Select--') {
      const { selectedIndex } = e.target.options;
      const { feeds } = this.state;
      const {
        proposal_id,
        proposal_client_id,
        proposal_client_type,
        proposal_request_id,
      } = feeds[selectedIndex - 1];
      this.setState({
        proposal_id,
        proposal_request_id,
        proposal_client_id,
        proposal_client_type,
        user_title: e.target.value,
      });
    }
  };

  handleNameChange1 = (e) => {
    if (e.target.value !== '--Select--') {
      const { selectedIndex } = e.target.options;
      const { drafts } = this.state;
      const { agreement_client_id, agreement_request_id, draft } =
        drafts[selectedIndex - 1];
      this.setState({ agreement_client_id, agreement_request_id, draft });
    }
  };

  render() {
    const { t } = this.props;
    let options =
      typeof this.state.drafts !== 'string'
        ? this.state.drafts.map(
            (
              { agreement_request_id, agreement_client_type, agreement_names },
              index
            ) => <option key={index}>{`${agreement_names}`}</option>
          )
        : [];

    let options2 =
      typeof this.state.feeds !== 'string'
        ? this.state.feeds.map(
            (
              {
                proposal_id,
                proposal_client_type,
                proposal_names,
                tender_title,
                proposal_request_id,
              },
              index
            ) => <option key={index}>{`${proposal_names}`}</option>
          )
        : [];

    return (
      <div>
        {/* <Header active={'bussiness'} /> */}
        <Breadcrumb>
          <Link
            to='/business-dashboard'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {t('myBusiness.contract.heading')}
          </Link>
          <Link
            to='/agreement-listing'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {t('myBusiness.contract.agreement')}
          </Link>
          <li className='breadcrumb-item active' aria-current='page'>
            {t('myBusiness.contract.create')}
          </li>
        </Breadcrumb>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              <div
                className='card'
                style={{ maxWidth: '1120px', maxHeight: '70vh' }}
              >
                <div className='card-body'>
                  <ul className='nav tablist'>
                    <li className='nav-item'>
                      <Link
                        className='nav-link'
                        to='/business-agreement-create'
                      >
                        {t('myBusiness.contract.scratch')}
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <button
                        className='nav-link'
                        type='button'
                        onClick={() => this.handleRequestModalClose()}
                      >
                        {t('myBusiness.contract.prop_request1')}
                      </button>
                    </li>
                    <li className='nav-item'>
                      <button
                        className='nav-link'
                        type='button'
                        onClick={() => this.handleDraftModalClose()}
                      >
                        {t('myBusiness.contract.agr_upd')}
                      </button>
                    </li>
                  </ul>

                  {/* <Accordion defaultActiveKey="0">
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          Click me 111111
                        </Accordion.Toggle>

                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          Click me 2222222222
                       </Accordion.Toggle>


                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>1111111111111</Card.Body>
                      </Accordion.Collapse>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>22222222222</Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
 */}
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
                        {t("myagreement.SelectPA")}
                        <div className="row">
                          <div className="col-md-8">
                            <select
                              onChange={this.handleNameChange}
                              id="select-agreement"
                              className="form-control"
                            >
                              <option> {t("myagreement.Select")} </option>
                              {options2}
                            </select>
                          </div>

                          <div className="col-md-4 mt-md-0 mt-4">
                            {this.state.proposal_id > 0 ? (
                              <Link
                                className="btn btn-blue"
                                to={{
                                  pathname: `/business-agreement-create/${this.state.proposal_id}/${this.state.proposal_client_id}`,
                                  state: {
                                    data: this.state.user_title,
                                    proposal_request_id:
                                      this.state.proposal_request_id,
                                  },
                                }}
                              >
                                {t("myagreement.Create_Agreement")}
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </ModalBody>
                  </Modal> */}
                  {/* 
                  <Modal
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
                        {t("myagreement.SelectP&A")}
                        <div className="row">
                          <div className="col-md-8">
                            <select
                              onChange={this.handleNameChange1}
                              id="select-agreement"
                              className="form-control"
                            >
                              <option> {t("myagreement.Select")} </option>
                              {options}
                            </select>
                          </div>
                          <div className="col-md-4 mt-md-0 mt-4">
                            {this.state.agreement_request_id > 0 ? (
                              <Link
                                className="btn btn-blue"
                                to={{
                                  pathname: `/business-agreement-create/${this.state.agreement_request_id}/${this.state.agreement_client_id}/${this.state.draft}`,
                                  state: {
                                    proposal_request_id:
                                      this.state.proposal_request_id,
                                  },
                                }}
                              >
                                {t("myagreement.SelectP&A")}
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
                <div
                  className='card'
                  style={{ maxWidth: '1120px', maxHeight: '70vh' }}
                >
                  <div className='card-body'>
                    <div className='form-group'>
                      <label htmlFor='select-proposal' />
                      {t('myBusiness.contract.SelectPA')}
                      <div className='row'>
                        <div className='col-md-8'>
                          <select
                            onChange={this.handleNameChange}
                            id='select-agreement'
                            className='form-control'
                          >
                            <option> {t('myBusiness.contract.Select')} </option>
                            {options2}
                          </select>
                        </div>

                        <div className='col-md-4 mt-md-0 mt-4'>
                          {this.state.proposal_id > 0 ? (
                            <Link
                              className='btn btn-blue'
                              to={{
                                pathname: `/business-agreement-create/${this.state.proposal_id}/${this.state.proposal_client_id}`,
                                state: {
                                  data: this.state.user_title,
                                  proposal_request_id:
                                    this.state.proposal_request_id,
                                },
                              }}
                            >
                              {t('myBusiness.contract.Create_Agreement')}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {this.state.viewDraft && (
                <div
                  className='card'
                  style={{ maxWidth: '1120px', maxHeight: '70vh' }}
                >
                  <div className='card-body'>
                    <div className='form-group'>
                      <label htmlFor='select-proposal' />
                      {t('myBusiness.contract.SelectP&A')}
                      <div className='row'>
                        <div className='col-md-8'>
                          <select
                            onChange={this.handleNameChange1}
                            id='select-agreement'
                            className='form-control'
                          >
                            <option> {t('myBusiness.contract.Select')} </option>
                            {options}
                          </select>
                        </div>
                        <div className='col-md-4 mt-md-0 mt-4'>
                          {this.state.agreement_request_id > 0 ? (
                            <Link
                              className='btn btn-blue'
                              to={{
                                pathname: `/business-agreement-create/${this.state.agreement_request_id}/${this.state.agreement_client_id}/${this.state.draft}`,
                                state: {
                                  proposal_request_id:
                                    this.state.proposal_request_id,
                                },
                              }}
                            >
                              {t('myBusiness.contract.SelectP&A')}
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

export default withTranslation()(BusinessProposal);
