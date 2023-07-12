import React, { Component } from 'react';
import axios from 'axios';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { url } from '../../helper/helper';
import 'font-awesome/css/font-awesome.min.css';
import Accept from '../marketPlace/listingdetails/Modals/Accept';
import Decline from '../marketPlace/listingdetails/Modals/Decline';
import { getData } from '../../helper/api';
import { dateFunc, dateFuncExp } from '../../helper/dateFunc/date';

class bid_detail extends Component {
  feeds_search = [];
  state = {
    feeds: [],
    status: '',
    search: '',
    proposal_submitted: false,
    result: [],
    loaded: false,
    messages: [],
    message: '',
    left: null,
    right: null,
    isAcceptModalOpen: false,
    showDeclineModal: false,
    tb_user_id: '',
    tb_tender_id: '',
    lang: localStorage.getItem('_lng'),
  };

  handleAcceptModal = () => {
    this.setState({
      isAcceptModalOpen: !this.state.isAcceptModalOpen,
    });
  };

  componentDidMount = () => {
    let id = this.props.match.params.id;
    let user_id = this.props.match.params.userid;
    this.loadConfig();
    //this.loadMessages(this.state.tb_tender_id, this.state.tb_user_id);
    this.getDetails(id, user_id);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.tb_tender_id !== this.state.tb_tender_id ||
      prevState.tb_user_id !== this.state.tb_user_id
    ) {
      this.loadMessages(this.state.tb_tender_id, this.state.tb_user_id);
    }
  };

  loadConfig = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/config/currency`, token)
      .then((result) => {
        const { left, right } = result.data;
        this.setState({ left, right });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  getDetails = async (id, user_id) => {
    const token = await localStorage.getItem('token');
    await getData(
      `${url}/api/bid/tender-bid-detail-new/${id}/${user_id}`,
      token
    )
      .then((res) => {
        res.data.data.map((res) => {
          this.setState({
            result: res,
            tender_unit: res?.tender_unit,
            tender_rate: res?.tender_rate,
            full_name: res?.full_name,
            tb_quantity: res?.tb_quantity,
            tb_quote: res?.tb_quote,
            tb_user_name: res?.tb_user_name,
            tb_attachment: res?.tb_attachment,
            tb_delivery_charges: res?.tb_delivery_charges,
            tb_description: res?.tb_description,
            tb_featured_image: res?.tb_featured_image,
            tb_warrenty_type: res?.tb_warrenty_type,
            tb_warrenty: res?.tb_warrenty,
            state_name: res?.state_identifier,
            tender_title: res?.tender_title,
            created_at: res?.created_at,
            tender_category_type: res?.tender_category_type,
            tender_description: res?.tender_description,
            tender_type: res?.tender_type,
            tender_quantity: res?.tender_quantity,
            tender_state_name: res?.tender_state_name,
            tender_expiry_date: res?.tender_expiry_date,
            tender_delivery_type: res?.tender_delivery_type,
            tender_attachment: res?.tender_attachment,
            company_logo: res?.company_logo,
            tb_user_id: res?.tb_user_id,
            tender_status: res?.tender_status,
            tb_status: res?.tb_status,
            tb_tender_id: res?.tb_tender_id,
            company_logo: res?.company_logo,
            tender_user_id: res?.tender_user_id,
            company_logo_path: res?.company_logo_path,
          });
        });
      })
      .catch((err) => {
        //console.log("error", err)
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

        this.loadMessages(this.state.tb_tender_id, this.state.tb_user_id);
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

  render() {
    console.log(this.state.tb_tender_id, this.state.tb_user_id);
    const { t } = this.props;
    let alert;
    if (this.state.proposal_submitted === true) {
      alert = (
        <Alert variant='success' style={{ fontSize: '13px' }}>
          {t('my_bid.Proposal_Requested')}
        </Alert>
      );
    }
    //console.log('this.porps', result);
    const {
      full_name,
      tb_quantity,
      tb_id,
      tb_quote,
      tb_attachment,
      tb_delivery_charges,
      tb_description,
      tb_featured_image,
      tb_warrenty_type,
      tb_warrenty,
      state_name,
      tender_expiry_date,
      tender_state_name,
      tender_quantity,
      tender_type,
      tender_description,
      tender_title,
      created_at,
      tender_delivery_type,
      tender_attachment,
      company_logo,
      tender_category_type,
      tb_user_id,
      tb_status,
      tb_user_name,
      tender_user_id,
      tender_status,
      tb_tender_id,
      tender_rate,
      tender_unit,
      company_logo_path,
    } = this.state;

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
              {t('my_contracts.title')}
            </li>
          </ol>
        </nav>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              {alert ? alert : null}
              <h3 className='head3'>{t('my_bid.Bid_details')}</h3>

              <div className='card'>
                <div className='card-body'>
                  <div className='col-md-8 biddetails_title box'>
                    <h5>{tender_title}</h5>

                    <span>
                      {' '}
                      {t('my_bid.Posted_on')}{' '}
                      {dateFunc(created_at, this.state.lang)}{' '}
                    </span>
                    <br />
                    <h5>{tender_description}</h5>
                  </div>
                  <br />
                  {/* <din */}
                  <br />
                  <div className='row'>
                    <div className='col-sm-3 col-6 biddetails_li'>
                      {/* <li> {t('my_bid.Volume_Need')} </li> */}
                      <li> {t('my_bid.location')} </li>
                      <li> {t('my_bid.Work')} </li>
                      {tender_type == 'Offer' ? (
                        <li>{t('my_bid.Delivery_type')} </li>
                      ) : (
                        ''
                      )}
                      <li>
                        {' '}
                        {tender_rate
                          ? t('marketplace.feeds.list_details.rate')
                          : t('invoice.unit')}{' '}
                      </li>
                      <li> {t('my_bid.Expires_in')}</li>
                    </div>

                    <div className='col-sm-3 col-6 biddetails_li'>
                      {/* <li> {tender_quantity} </li> */}
                      <li>
                        {state_name === 'All regions'
                          ? t('list_details.All_regions')
                          : state_name}{' '}
                      </li>
                      <li>
                        {tender_type}
                        {/* {tender_type !== 'Request'
                          ? t('my_bid.tender_type_request')
                          : t('my_bid.full_name')}{' '} */}
                      </li>
                      {tender_type == 'Offer' ? (
                        <li>{tender_delivery_type} </li>
                      ) : (
                        ''
                      )}
                      <li>
                        {' '}
                        {tender_rate
                          ? tender_rate
                          : tender_unit === 'Pcs'
                          ? t('list_details.pcs')
                          : tender_unit}{' '}
                      </li>
                      <li>
                        {dateFuncExp(tender_expiry_date, this.state.lang)}
                      </li>
                    </div>

                    {/* <div className="col-sm-3 biddetails_li">
                                            hii
                                        </div> */}
                  </div>
                  {tender_attachment ? (
                    <a
                      href={
                        url +
                        '/images/marketplace/material/' +
                        tender_attachment
                      }
                      target='_blank'
                      className='attachment'
                    >
                      {tender_attachment}
                    </a>
                  ) : (
                    ''
                  )}
                  <hr />
                  <h3>{t('my_bid.details')}</h3>
                  <br />
                  <br />
                  <div className='row'>
                    <div className='col-sm-3 col-6 biddetails_li'>
                      {full_name ? <li> {t('my_bid.full_name')} </li> : ''}
                      {tb_quantity ? <li> {t('my_bid.Quantity')} </li> : ''}
                      {tb_quote ? <li> {t('my_bid.Quote')} </li> : ''}
                      {tb_warrenty_type ? (
                        <li> {t('my_bid.Warrenty_Type')} </li>
                      ) : (
                        ''
                      )}
                      {tb_warrenty ? <li> {t('my_bid.Warrenty')} </li> : ''}
                      {tb_delivery_charges ? (
                        <li> {t('my_bid.Delivery_type')}</li>
                      ) : (
                        ''
                      )}
                      {state_name ? <li> {t('my_bid.State_name')}</li> : ''}
                      {tb_user_name ? <li>{t('my_bid.name')}</li> : ''}
                    </div>

                    <div className='col-sm-3 col-6 biddetails_li'>
                      {full_name ? <li>{full_name} </li> : ''}
                      {tb_quantity ? <li>{tb_quantity} </li> : ''}
                      {tb_quote ? <li>{tb_quote}</li> : ''}
                      {tb_warrenty_type ? <li>{tb_warrenty_type}</li> : ''}
                      {tb_warrenty ? <li>{tb_warrenty} </li> : ''}
                      {tb_delivery_charges ? (
                        <li>{tb_delivery_charges}</li>
                      ) : (
                        ''
                      )}
                      {state_name ? (
                        <li>
                          {' '}
                          {state_name === 'All regions'
                            ? t('list_details.All_regions')
                            : state_name}{' '}
                        </li>
                      ) : (
                        ''
                      )}
                      {tb_user_name ? <li>{tb_user_name}</li> : ''}
                    </div>
                  </div>
                  {/* <br /> */}
                  <div className='row'>
                    <div className='col-sm-3 col-6 biddetails_li'>
                      <li> {t('my_bid.Description')} </li>
                    </div>
                    <div className='col-sm-3 col-6 biddetails_li'>
                      {tb_description ? <div>{tb_description}</div> : ''}
                    </div>
                    {tb_status == 0 && tender_status !== 5 ? (
                      <div className='col-sm-3 col-6 biddetails_li'>
                        <td style={{ width: '140px' }}>
                          <Accept
                            show={this.state.isAcceptModalOpen}
                            userId={tb_user_id}
                            handleClose={() =>
                              this.setState({
                                isAcceptModalOpen: false,
                              })
                            }
                            history={this.props.history}
                            type={tender_type}
                            id={tb_tender_id}
                            avatar={
                              company_logo === null
                                ? company_logo_path + '1612851626_logo.jpg'
                                : company_logo_path + company_logo
                            }
                            left={this.state.left}
                            right={this.state.right}
                            tb_id={tb_id}
                            tb_quote={tb_quote}
                          />
                          <a
                            href='#'
                            className='btn btn-outline-dark open-AcceptDialog'
                            data-user_id={tb_user_id}
                            data-id={full_name}
                            data-bid={tb_quote}
                            data-img={
                              company_logo === null
                                ? company_logo_path + '1612851626_logo.jpg'
                                : company_logo_path + company_logo
                            }
                            // data-toggle='modal'
                            // data-target='#accept'
                            onClick={() => this.handleAcceptModal()}
                          >
                            {t('marketplace.feeds.list_details.Accept')}
                          </a>
                          {/* <Accept
                            //   key={index}
                            id={tb_tender_id}
                            avatar={company_logo}
                            left={this.state.left}
                            right={this.state.right}
                          />
                          <a
                            href='#'
                            className='btn btn-outline-dark open-AcceptDialog'
                            data-user_id={tb_user_id}
                            data-id={full_name}
                            data-bid={tb_quote}
                            data-toggle='modal'
                            data-target='#accept'
                          >
                            {t('list_details.Accept')}
                          </a> */}
                        </td>
                        <td style={{ width: '140px' }}>
                          <Decline
                            userId={tb_user_id}
                            show={this.state.showDeclineModal}
                            handleClose={() =>
                              this.setState({ showDeclineModal: false })
                            }
                            id={tb_tender_id}
                          />
                          <a
                            onClick={() =>
                              this.setState({
                                showDeclineModal: !this.state.showDeclineModal,
                              })
                            }
                            className='btn btn-gray open-DeclineDialog'
                            // data-user_id={tb_user_id}
                            // data-toggle="modal"
                            // data-target="#decline"
                          >
                            {t('marketplace.feeds.list_details.Decline')}
                          </a>
                        </td>
                      </div>
                    ) : tb_status === 1 ? (
                      <td style={{ width: '140px' }}>
                        <Accept
                          show={this.state.isAcceptModalOpen}
                          userId={tb_user_id}
                          handleClose={() =>
                            this.setState({
                              isAcceptModalOpen: false,
                            })
                          }
                          id={tb_tender_id}
                          avatar={
                            company_logo === null
                              ? company_logo_path + '1612851626_logo.jpg'
                              : company_logo_path + company_logo
                          }
                          left={this.state.left}
                          right={this.state.right}
                          history={this.props.history}
                          type={tender_type}
                          tb_id={tb_id}
                          tb_quote={tb_quote}
                        />
                        <button className='btn btn-outline-dark open-AcceptDialog'>
                          {t('list_details.Accepted')}
                        </button>
                      </td>
                    ) : (
                      ''
                    )}
                  </div>

                  {/* <div className='row'>
                    <div className='col-sm-3 biddetails_li'>
                      {/* <li>{t('my_bid.description')}</li> 
                    </div>
                    <div className='col-sm-3 biddetails_li'>
                      {tb_description ? <li>{tb_description}</li> : ''}
                    </div>
                  </div> */}
                  <div
                    className='col-lg biddetails_titles'
                    style={{ padding: '0px' }}
                  >
                    {/* <p>{tb_description} </p> */}
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
                                    overflowY: 'auto',
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
                                        <dl
                                          className='d-flex'
                                          id='message'
                                          ref={this.mesRef}
                                        >
                                          <dt
                                            className='flex-grow-0'
                                            style={{
                                              marginRight: '2rem',
                                            }}
                                          >
                                            {user_name}
                                          </dt>
                                          <dd>
                                            <p>{message}</p>
                                            <span className='date'>
                                              {dateFunc(
                                                created_at,
                                                this.state.lang
                                              )}
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
                                    placeholder={t(
                                      'b_sidebar.agreement.message'
                                    )}
                                    name='message'
                                    id='message-box'
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
                                          tender_user_id,
                                          tb_tender_id,
                                          tb_user_id,
                                          tender_user_id,
                                          tb_user_id
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
                  </div>
                  <div className='paperclip'>
                    {tb_attachment ? (
                      <a
                        href={
                          url + '/images/marketplace/material/' + tb_attachment
                        }
                        target='_blank'
                        className='attachment'
                      >
                        {tb_attachment}
                      </a>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(bid_detail);
