import React, { Component } from 'react';
import axios from 'axios';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import ReactScrollableFeed from 'react-scrollable-feed';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { url } from '../../../helper/helper';
import 'font-awesome/css/font-awesome.min.css';
import AgreementProposalModal from '../../myBussiness/modals/AgreementProposalModal';
import Decline from '../listingdetails/Modals/Decline';
import './Biddetails.css';
import { locale } from 'moment';
import { dateFunc } from '../../../helper/dateFunc/date';
import { getData, postDataWithToken } from '../../../helper/api';
var moment = require('moment');

class Biddetails extends Component {
  feeds_search = [];
  state = {
    feeds: [],
    status: '',
    search: '',
    proposal_submitted: false,
    proposals: [],
    messages: [],
    loaded: false,
    left: null,
    right: null,
    properties: [],
    proposal_id: 0,
    showDeclineModal: false,
    message: '',
    tender_id: localStorage.getItem('tender_id'),
    user_id: 0,
    lang: localStorage.getItem('_lng'),
    tender_user_id: localStorage.getItem('tender_user_id'),
  };

  componentDidMount = () => {
    let id = this.props.match.params.id;
    this.getDetails(id);
    this.loadProposals();
    this._isMounted = true;
    this.loadMessages(this.state.tender_id, Number(this.state.tender_user_id));
  };

  getDetails = async (id) => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/bid/bid-detail/${id}`, token)
      .then((res) => {
        console.log(res);
        this.setState({
          result: res.data.data,
        });
      })
      .catch((err) => {
        //console.log("error", err)
      });
  };

  handleStatus = async (id, status) => {
    this.setState({ loaded: false });
    const token = await localStorage.getItem('token');
    const response = await postDataWithToken(
      `${url}/api/contracts/status/${id}/${status}`,
      null,
      token
    );

    if (response.status === 200 && status === 3) {
      this.props.location.state.getData();
      this.setState({ proposal_submitted: true });
      this.props.history.push(`/business-proposal-create`);
    }
    // this.loadNotif(this.axiosCancelSource);
  };

  getDate = (date) => {
    return moment(date).format('MMM DD, YYYY');
  };

  loadProposals = async () => {
    const token = await localStorage.getItem('token');
    await getData(
      `${url}/api/bid/bid-detail-new/${this.props.match.params.id}`,
      token
    )
      .then((result) => {
        result.data.data.map((proposal) =>
          this.setState({
            proposals: proposal,
            tender_user_id: proposal.tender_user_id,
            tender_id: proposal.tender_id,
          })
        );
        // if (result.data.data.tender_id !== 'undefined') {
        //   result.data.data.map((tender) =>
        //     localStorage.setItem('tender_id', tender.tender_id)
        //   );
        // }
        // if (result.data.data.tender_user_id !== 'undefined') {
        //   result.data.data.map((tender) =>
        //     localStorage.setItem('tender_user_id', tender.tender_user_id)
        //   );
        // }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  handleSubmit = async (
    event,
    propertyOne,
    propertyTwo,
    propertyThree,
    propertyFour,
    propertyFive
  ) => {
    console.log(event);
    event.preventDefault();
    // this.setState({ loading: true });
    const token = await localStorage.getItem('token');

    var myHeaders = new Headers();

    myHeaders.append('Authorization', `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append('message', this.state.message);
    formdata.append('user_id', propertyOne);
    formdata.append('propID', propertyTwo);
    formdata.append('client', propertyThree);
    formdata.append('sender', propertyFour);
    formdata.append('receiver', propertyFive);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}/api/revisions/inserttendermessages`, requestOptions)
      .then((response) => {
        this.clearMessageInput();
        response.json();
      })
      .then((result) => {
        this.setState({
          sucess_msg: true,
          message: '',
          loaded: false,
          user_id: propertyThree,
        });

        this.loadMessages(this.state.tender_id, this.state.tender_user_id);
      })
      .catch((error) => {
        //console.log('error', error)
        this.setState({ message: '', loading: false });
        // window.location.reload();
      });
  };

  clearMessageInput = () => {
    const element = document.getElementById('message-box');
    element.value = '';
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.tender_id !== this.state.tender_id ||
      prevState.tender_user_id !== this.state.tender_user_id
    ) {
      this.loadMessages(this.state.tender_id, this.state.tender_user_id);
    }
  };

  loadMessages = async (id, userId) => {
    console.log(id, userId);
    const token = localStorage.getItem('token');
    await getData(
      `${url}/api/revisions/tendermessagesbyuser/${id}/${userId}`,
      token
    )
      .then((result) => {
        if (result.data?.data?.length > 0) {
          this.setState({
            messages: result.data.data,

            last_status: result.data?.data[result.data.data.length - 1].status,
          });
        }

        if (result.data?.data?.length == 0) {
          this.setState({
            messages: [],
            last_status: 0,
          });
        }
        console.log(this.state.messages);
        // window.location.reload();
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  // orderMessages(messages) {
  //   return messages?.sort(function (a, b) {
  //     return new Date(b.created_at) - new Date(a.created_at);
  //   });
  // }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ message: value });
  };

  getdate = (date) => {
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
  };

  render() {
    const { t } = this.props;

    let alert;
    if (this.state.proposal_submitted === true) {
      alert = (
        <Alert variant='success' style={{ fontSize: '13px' }}>
          {t('my_bid.Proposal_Requested')}
        </Alert>
      );
    }

    const { result } = this.state;

    return (
      <div>
        {/* <Header active={'market'} /> */}
        <div className='sidebar-toggle'></div>
        <nav aria-label='breadcrumb'>
          <ol className='breadcrumb'>
            <Link
              to='/feeds'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('header.marketplace')}
            </Link>
            <li className='breadcrumb-item active' aria-current='page'>
              {t('my_bid.Bid_details')}
            </li>
          </ol>
        </nav>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              {alert ? alert : null}
              <h3 className='head3'>{t('my_bid.Bid_details')}</h3>

              {result ? (
                <div className='card'>
                  {result.map((data, index) => (
                    <div className='card-body' key={index}>
                      <div className='col-md-8 biddetails_title box'>
                        <h3>{data.tender_title}</h3>

                        <span>
                          {' '}
                          {t('my_bid.Posted_on')}{' '}
                          {dateFunc(data?.created_at, this.state.lang)}{' '}
                        </span>
                      </div>
                      <br />
                      <br />
                      <div className='row'>
                        <div className='col-sm-4 col-6 biddetails_li'>
                          {/* <li> {t('my_bid.Volume_Need')} </li> */}
                          <li> {t('my_bid.location')} </li>
                          <li>
                            {' '}
                            {data.tender_category_type === 'Material'
                              ? t('my_bid.material')
                              : t('my_bid.work')}{' '}
                          </li>
                          {data.tender_type == 'Offer' ? (
                            <li>{t('my_bid.Delivery_type')} </li>
                          ) : (
                            ''
                          )}
                          <li> {t('my_bid.Expires_in')}</li>
                          <li>
                            {' '}
                            {data.tender_rate
                              ? t('marketplace.all_list_details.rate')
                              : t('invoice.unit')}{' '}
                          </li>
                        </div>
                        <div className='col-sm-4 col-6 biddetails_li'>
                          <li>{data?.tender_state_name} </li>
                          {/* <li> {data?.tender_quantity} </li> */}

                          <li>
                            {data?.tender_type === 'Request'
                              ? t('my_bid.tender_type_request')
                              : t('my_bid.tender_type_offer')}{' '}
                          </li>
                          {data.tender_type == 'Offer' ? (
                            <li>
                              {data.tender_delivery_type === 'Included'
                                ? t(
                                    'marketplace.material.create_material_list.offer.Included'
                                  )
                                : t(
                                    'marketplace.material.create_material_list.offer.Not_included'
                                  )}{' '}
                            </li>
                          ) : (
                            ''
                          )}
                          <li>{data?.tender_expiry_date}</li>
                          <li>
                            {' '}
                            {data.tender_rate
                              ? data.tender_rate
                              : data.tender_unit === 'Pcs'
                              ? t('list_details.pcs')
                              : data.tender_unit}{' '}
                          </li>
                        </div>
                      </div>
                      <hr />
                      <h3>{t('my_bid.mydetails')}</h3>
                      <br />
                      <br />
                      <div className='row'>
                        <div className='col-sm-3 col-6 biddetails_li'>
                          <li> {t('my_bid.Your_quote')} </li>
                          {/* <li> {t('my_bid.Quantity')} </li>
                          <li> {t('my_bid.Shipping_from')}</li>
                          {data.tender_type == 'Request' ? (
                            <li>{t('my_bid.Delivery_type')} </li>
                          ) : (
                            ''
                          )} */}
                          <li> {t('my_bid.Description')} </li>
                        </div>

                        <div className='col-sm-3 col-6 biddetails_li'>
                          <li>{data.tb_quote} </li>
                          {/* <li>{data.tb_quantity} </li> */}
                          {/* <li>
                            {data.state_identifier === 'All regions'
                              ? t('list_details.All_regions')
                              : data.state_identifier}{' '}
                          </li> */}
                          {/* {data.tender_type == 'Request' ? (
                            <li>
                              {data.tb_delivery_charges === 'Included'
                                ? t(
                                    'marketplace.material.create_material_list.offer.Included'
                                  )
                                : t(
                                    'marketplace.material.create_material_list.offer.Not_included'
                                  )}{' '}
                            </li>
                          ) : (
                            ''
                          )} */}
                          {data.tb_description ? (
                            <div>{data.tb_description}</div>
                          ) : (
                            ''
                          )}
                        </div>
                        <div className='col-sm-4 col-4 button_li'>
                          <li>
                            {data.tb_status === 3 &&
                            data.tb_status !== 6 &&
                            !data.sender_isLogged ? (
                              <Link
                                className='btn btn-primary button_bid'
                                to={{
                                  pathname: `/business-proposal-create/${data.tb_id}/${data.tender_user_id}`,
                                  state: {
                                    data: data.tender_title,
                                  },
                                }}
                              >
                                {t('my_contracts.submit_proposal')}
                              </Link>
                            ) : data.tb_status !== 2 && data.tb_status !== 4 ? (
                              <>
                                <Decline
                                  userId={data.tb_user_id}
                                  show={this.state.showDeclineModal}
                                  handleClose={() =>
                                    this.setState({ showDeclineModal: false })
                                  }
                                  id={`${data.tb_tender_id}`}
                                />
                                <a
                                  onClick={() =>
                                    this.setState({
                                      showDeclineModal:
                                        !this.state.showDeclineModal,
                                    })
                                  }
                                  className='btn btn-secondary button_bid'
                                  // data-user_id={bid.tb_user_id}
                                  // data-toggle='modal'
                                  // data-target='#decline'
                                >
                                  {t('mybid.Withdraw')}
                                </a>
                              </>
                            ) : (
                              ''
                            )}
                          </li>
                        </div>
                      </div>
                      <br />
                      <div
                        className='col-md-6 biddetails_titles'
                        style={{ maxWidth: '100%' }}
                      >
                        <div className='modal-dialog2 modal-lg modal-dialog-centered'>
                          <div className='modal-content2'>
                            <div className='modal-header2'>
                              {/* <h5
                                className='modal-title'
                                id='exampleModalLabel'
                              >
                                {t('b_sidebar.agreement.View_message')}
                              </h5> */}
                            </div>
                            <div className='modal-body'>
                              <div className='row'>
                                <div className='col-md-11'>
                                  <div className='form-group '>
                                    <div
                                      className='scroller mt-5'
                                      style={{
                                        height: 262,
                                        margin: 0,
                                        display: 'flex',
                                        flexDirection: 'column-reverse',
                                      }}
                                    >
                                      <div className='detail-list'>
                                        {this.state.messages.map(
                                          ({
                                            message,
                                            created_at,
                                            user_name,
                                            status,
                                          }) => (
                                            <dl className='d-flex'>
                                              <dt
                                                className='flex-grow-0'
                                                style={{ marginRight: '2rem' }}
                                              >
                                                {user_name}
                                              </dt>
                                              <dd>
                                                <h5>{message}</h5>
                                                <span className='date'>
                                                  {this.getdate(created_at)}
                                                </span>
                                              </dd>
                                            </dl>
                                          )
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <textarea
                                        className='form-control'
                                        id='message-box'
                                        placeholder={t(
                                          'b_sidebar.agreement.message'
                                        )}
                                        name='message'
                                        onChange={this.handleChange}
                                      ></textarea>
                                      <p style={{ color: '#eb516d ' }}>
                                        {this.state.message_err === true
                                          ? 'Message is required'
                                          : null}
                                      </p>
                                      <div className='form-group'>
                                        <button
                                          type='button'
                                          className='btn btn-light'
                                          onClick={(e) =>
                                            this.handleSubmit(
                                              e,
                                              this.state.proposals?.tb_user_id,
                                              this.state.proposals?.tender_id,
                                              this.state.proposals
                                                ?.tender_user_id,
                                              this.state.proposals?.tb_user_id,
                                              this.state.proposals
                                                ?.tender_user_id
                                            )
                                          }
                                          style={{ background: '#efefef' }}
                                        >
                                          {this.state.loading ? (
                                            <Spinner
                                              animation='border'
                                              role='status'
                                            >
                                              <span className='sr-only'>
                                                Loading...
                                              </span>
                                            </Spinner>
                                          ) : (
                                            ''
                                          )}{' '}
                                          {t('b_sidebar.agreement.Send')}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* <div className='chatContainer'> 
                          <ReactScrollableFeed>
                            {this.state.messages.map((msg) => {
                              const { user_name, message } = msg;
                              return (
                                <div className='messages'>
                                  <div
                                    className='messageContainer'
                                    id={
                                      ''
                                      // msg.username == userInfo.username
                                      //   ? 'You'
                                      //   : 'Other'
                                    }
                                  >
                                    {' '}
                                    <div
                                      style={{
                                        color: '#ffffff',
                                        width: '100px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: '20px',
                                        fontSize: '16px',
                                      }}
                                    >
                                      {' '}
                                      {user_name} :
                                    </div>
                                    <div
                                      className='messageIndividual'
                                      style={{ fontSize: '16px' }}
                                      //key={msg.id}
                                    >
                                      {message}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </ReactScrollableFeed>
                          <div className='messageInputs'>
                            <input
                              type='text'
                              placeholder='Message...'
                              onChange={this.handleChange}
                            />
                            <button
                              onClick={(e) =>
                                this.handleSubmit(
                                  e,
                                  this.state.proposals?.tender_user_id,
                                  this.state.proposals?.tender_id,
                                  this.state.proposals?.tb_user_id
                                )
                              }
                            >
                              Send
                            </button>
                          </div>
                        </div> */}
                      </div>
                      <br />
                      <div className='paperclip'>
                        {data.tb_attachment ? (
                          <i
                            className='fa fa-paperclip fa-2x'
                            aria-hidden='true'
                          >
                            {' '}
                            <h5
                              className=''
                              style={{ float: 'right', font: '10px' }}
                            >
                              {/* {data.tb_attachment}  */}
                              <a
                                href={
                                  url +
                                  '/images/marketplace/material/' +
                                  data.tb_attachment
                                }
                                target='_blank'
                                className='attachment'
                              >
                                {data.tb_attachment}
                              </a>
                            </h5>
                          </i>
                        ) : (
                          ' '
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Spinner animation='border' role='status'>
                  <span className='sr-only'> {t('my_bid.Loading')} </span>
                </Spinner>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Biddetails);
