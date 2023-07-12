import React, { Component } from 'react';
import axios from 'axios';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';
import Avatar from '../../../images/avatar4.jpg';
import { Helper, url } from '../../../helper/helper';
import Accept from './Modals/Accept';
import Decline from './Modals/Decline';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import DefaultImg from '../../../images/DefaultImg.png';
import moment from 'moment';
import Spinner from 'react-bootstrap/Spinner';
import { withTranslation } from 'react-i18next';
import TenderProposalModal from '../../myBussiness/modals/TenderProposalModal';
import { v4 as uuidv4 } from 'uuid';
import Message from '../../../images/message-solid.svg';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMessage } from '@fortawesome/free-solid-svg-icons';
import message from '../../../images/message-icon.png';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { getData, modifyDataWithToken } from '../../../helper/api';
import './ListDetails.css';
import { dateFuncExp } from '../../../helper/dateFunc/date';
let images = [];
class ListDetails extends Component {
  constructor(props) {
    super(props);

    window.addEventListener('resize', this.update);
  }

  state = {
    detail: [],
    slider: [],
    imgs: [],
    bids: [],
    bidNew: [],
    deleted: false,
    loaded: false,
    loading: false,
    left: null,
    right: null,
    disabled: false,
    acceptstatus: false,
    isChecked: false,
    _user_id: localStorage.getItem('Login_user_id'),
    properties: [],
    proposal_id: 0,
    proposals: [],
    id: 0,
    bid: [],
    bider_id: 0,
    messages: [],
    isModalOpen: false,
    user_id: 0,
    tb_user_id: 0,
    isAcceptModalOpen: false,
    showDeclineModal: false,
    avtar: null,
    tbId: null,
    tb_quote: null,
    userId: null,
    notif: [],
    countArr: [],
    userId: null,
    count: [],
    unread: 0,
    width: 0,
  };

  handleAcceptModal = ({ avatar, tbId, userId, tb_quote }) => {
    this.setState({
      isAcceptModalOpen: !this.state.isAcceptModalOpen,
      tbId: tbId,
      avatar: avatar,
      userId: userId,
      tb_quote: tb_quote,
    });
  };

  componentDidMount = async () => {
    this.loadData(this.props.match.params.id);
    this.loadConfig();
    this.loadNotif();
    // this.loadUnreadNotif();
    this.loadBid();
    this.update();
  };

  update = () => {
    this.setState({
      width: window.innerWidth,
    });
  };

  // countTheCounts = (arr) => {
  //   for (const num of arr) {
  //     count[num] = count[num] ? count[num] + 1 : 1;
  //   }
  // };
  loadNotif = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/getBidsNotif`, token)
      .then((response) => {
        console.log(response);
        this.setState({
          notif: response.data.data.filter(
            (res) => res.notification_type === 'tender_message'
          ),
          countArr: response.data.data
            .filter(
              (res) =>
                res.notification_type === 'tender_message' &&
                res.notification_bid_id === Number(this.props.match.params.id)
            )
            .map((res) => res.notification_sender_id),
        });
      })
      .catch((err) => {
        if (err?.response?.status >= 400 && err?.response?.status <= 499) {
          localStorage.clear();
          this.setState({ loggedIn: false });
        }
        if (axios.isCancel(err)) {
        }
      });
  };

  loadUnreadNotif = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/notification/unread`, token)
      .then((response) => {
        this.setState({
          unread: response.data.data,
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
        }
      });
  };

  readNotif = async (
    notification_type,
    notification_sender_id,
    notification_bid_id
  ) => {
    const token = localStorage.getItem('token');
    await getData(
      `${url}/api/notification/read_messages/${notification_type}/${notification_sender_id}/${notification_bid_id}`,

      token
    )
      .then((res) => {
        console.log(res);
        this.loadNotif();
      })
      .catch(() => {});
  };

  loadConfig = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/config/currency`, token)
      .then((result) => {
        console.log('&&&&&&&&&&&&&&&', result.data);
        const { left, right } = result.data;
        this.setState({ left, right });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  loadData = async (id) => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/material-offer-detail/${id}`, token)
      .then((result) => {
        const { data } = result;
        console.log(data);
        this.setState({
          detail: data[0],
          isChecked: Number(data[0]?.tender_status) === 0 ? 'true' : 'false',
          id: data[0].tender_id,
        });
        this.setState(
          {
            slider: this.state.detail.tender_slider_images,
          },
          () => {
            const vals = this.state.slider
              ? Object.values(this.state.slider)
              : [];

            this.setState({ imgs: vals });
          }
        );
      })
      .catch((err) => {
        const { history } = this.props;
        // history.push('/feeds');
      });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const id = Number(this.props.match.params.id);

    if (this.state.id !== id) {
      this.loadData(id);
      this.loadBid(id);
    }

    if (prevState.unread !== this.state.unread) {
      this.loadNotif();
    }
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }

  loadBid = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/bid-new/${this.props.match.params.id}`, token)
      .then((result) => {
        const res = result.data.data;
        console.log(res);
        res.map((data) =>
          this.setState({
            bidNew: data,
            userId: data.tb_user_id,
          })
        );
        this.setState({
          bids: result.data.data,
          loaded: true,
        });
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };
  ///

  changeStatus = (id, data) => {
    this.setState({ loading: true, disabled: true });
    const token = localStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append('status', this.state.isChecked === 'true' ? 1 : 0);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}/api/list-detail/remove/${id}`, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        const { t } = this.props;
        this.loadData();
        this.setState({
          loading: false,
          disabled: false,
          buttonStatus: data,
          _status: data,
        });
        NotificationManager.success(
          t('marketplace.feeds.list_details.success_mess')
        );
      })
      .catch((error) => {
        NotificationManager.error('something wants to wrong please try again');
      });
    this.setState({ disabled: false });
  };

  url(category) {
    if (category === 'Material') {
      return 'create-material-list';
    }
    if (category === 'Work') {
      return 'create-work-list';
    }
    return null;
  }

  active_btn = (e, id) => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
    this.changeStatus(id, !this.state.isChecked);
  };

  NewlineText(props) {
    const text = props.text;
    if (text) {
      const newText = text.split('\n').map((str) => <p>{str}</p>);
      return newText;
    }
    return null;
  }

  viewProposal = async (...args) => {
    this.setState({
      properties: args,
      proposal_id: args[1],
      user_id: args[2],
      isModalOpen: !this.state.isModalOpen,
      tb_user_id: args[2],
    });
  };

  render() {
    const { t } = this.props;
    console.log(this.state.countArr);
    // let alert;
    if (this.state.deleted === true) {
      const { history } = this.props;
      history.push('/feeds');
      // alert = (
      //   <Alert variant="success" style={{ fontSize: "13px" }}>
      //     Deleted
      //   </Alert>
      // );
    }
    const { loading } = this.state;
    const data = this.state.bids?.filter((item) => item.tb_status == 1);

    //const prop = this.state.proposals.map((proposal) => proposal);
    // createNotification = (type) => {
    //     return () => {
    //       switch (type) {
    //         case 'info':
    //           NotificationManager.info('Info message');
    //           break;
    //         case 'success':
    //           NotificationManager.success('Success message', 'Title here');
    //           break;
    //         case 'warning':
    //           NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
    //           break;
    //         case 'error':
    //           NotificationManager.error('Error message', 'Click me!', 5000, () => {
    //             alert('callback');
    //           });
    //           break;
    //       }
    //     };
    //   };

    return (
      <div>
        {/* <Header /> */}
        <div className='sidebar-toggle'></div>
        <nav aria-label='breadcrumb'>
          <ol className='breadcrumb'>
            <li className='breadcrumb-item active' aria-current='page'>
              <Link
                to={{
                  pathname: `/feeds`,
                }}
                className='breadcrumb-item active'
              >
                {t('header.marketplace')}
              </Link>
            </li>
            <li className='breadcrumb-item active' aria-current='page'>
              {/* {this.state.detail.tender_category_type}{" "}
              {this.state.detail.tender_type} */}
              {this.state.detail?.tender_category_type === 'Material'
                ? this.state.detail.tender_type === 'Offer'
                  ? `${t('marketplace.all_list_details.Material_Offer1')}`
                  : `${t('marketplace.all_list_details.Material_Request')}`
                : ''}

              {this.state.detail?.tender_category_type === 'Work'
                ? this.state.detail.tender_type === 'Offer'
                  ? `${t('marketplace.all_list_details.Work_Offer')}`
                  : `${t('marketplace.all_list_details.Work_Request')}`
                : ''}
            </li>
          </ol>
        </nav>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <NotificationContainer />

            {/* {alert ? alert : null} */}
            <div className='container-fluid'>
              <h3 className='head3'>
                {/* {this.state.detail.tender_category_type}{" "} 
                {this.state.detail.tender_type} */}
                {/* {this.state.detail.tender_type} */}
                {this.state.detail?.tender_category_type === 'Work'
                  ? this.state.detail.tender_type === 'Offer'
                    ? `${t('marketplace.all_list_details.Work_Offer')}`
                    : `${t('marketplace.all_list_details.Work_Request')}`
                  : ''}

                {this.state.detail?.tender_category_type === 'Material'
                  ? this.state.detail.tender_type === 'Offer'
                    ? `${t('marketplace.all_list_details.Material_Offer')}`
                    : `${t('marketplace.all_list_details.Material_Request')}`
                  : ''}

                {/* // {t("list_details.Material_Request")} */}
              </h3>
              <div className='card'>
                <div className='card-body'>
                  <div className='mt-4'></div>
                  <div style={{ maxWidth: '1145px' }}>
                    <div className='row gutters-60'>
                      <div className='col-xl-3 col-lg-5'>
                        <Carousel className='slider'>
                          {this.state.imgs?.length > 0 ? (
                            this.state.imgs?.map((x, i) => {
                              if (x !== ',' && x !== '') {
                                return (
                                  <Carousel.Item key={i}>
                                    <img
                                      className='imagestyle'
                                      src={
                                        url +
                                        '/images/marketplace/material/' +
                                        x
                                      }
                                      alt='First slide'
                                    />
                                  </Carousel.Item>
                                );
                              }
                            })
                          ) : (
                            <Carousel.Item>
                              <img
                                className='imagestyle'
                                src={DefaultImg}
                                alt='First slide'
                              />{' '}
                            </Carousel.Item>
                          )}
                        </Carousel>
                      </div>
                      <div className='col-xl-8 col-lg-7'>
                        <div className='mt-2'></div>
                        <div className='details-content'>
                          <div className='head'>
                            <h4>{this.state.detail.tender_title}</h4>
                            <p>
                              {this.state.detail.tender_type === 'Offer'
                                ? t('marketplace.all_list_details.Offer')
                                : t(
                                    'marketplace.all_list_details.Request'
                                  )}{' '}
                            </p>
                          </div>
                          <this.NewlineText
                            text={this.state.detail.tender_description}
                          />

                          <p>
                            {t('marketplace.all_list_details.Category')}
                            <a href='javascript:void(0)' className='badge'>
                              {this.state.detail.category}
                            </a>
                          </p>
                          {this.state.detail.tender_attachment ? (
                            <a
                              href={
                                url +
                                '/images/marketplace/material/' +
                                this.state.detail.tender_attachment
                              }
                              target='_blank'
                              className='attachment'
                            >
                              <i className='icon-paperclip'></i>
                              {this.state.detail.tender_attachment}
                            </a>
                          ) : null}

                          <table>
                            <tr>
                              <th>
                                {this.state.detail.tender_budget
                                  ? t('marketplace.all_list_details.budget')
                                  : t('marketplace.all_list_details.quantity')}
                              </th>
                              <td>
                                {
                                  this.state.detail.tender_budget
                                    ? this.state.detail.tender_budget ===
                                      'Hourly'
                                      ? t('marketplace.all_list_details.Hourly')
                                      : this.state.detail.tender_budget ===
                                        'Fixed'
                                      ? t('marketplace.all_list_details.Fixed')
                                      : this.state.detail.tender_budget
                                    : this.state.detail.tender_quantity
                                  // t("list_details.per_m2")
                                }
                              </td>
                            </tr>

                            <tr>
                              {/* <th>
                                {this.state.detail.tender_type === 'Request'
                                  ? t(
                                      'marketplace.all_list_details.volume_need'
                                    )
                                  : t('marketplace.all_list_details.budget')}
                              </th> */}

                              <td>
                                {this.state.detail.tender_cost_per_unit
                                  ? this.state.detail.tender_cost_per_unit +
                                    '€/'
                                  : this.state.detail.tender_quantity}{' '}
                              </td>
                            </tr>

                            <tr>
                              <th>
                                {this.state.detail.tender_rate
                                  ? t('marketplace.all_list_details.rate')
                                  : t('marketplace.all_list_details.unit')}
                              </th>

                              <td>
                                {this.state.left}
                                {this.state.detail.tender_rate
                                  ? this.state.detail.tender_rate
                                  : this.state.detail.tender_unit === 'Pcs'
                                  ? t('marketplace.all_list_details.pcs')
                                  : this.state.detail.tender_unit}
                                {this.state.left}
                              </td>
                            </tr>
                            <tr>
                              <th>
                                {t('marketplace.all_list_details.location')}
                              </th>
                              <td>
                                {this.state.detail.tender_state ===
                                'All regions'
                                  ? t(
                                      'marketplace.all_list_details.All_regions'
                                    )
                                  : this.state.detail.tender_state}
                                {/*  {this.state.detail.tender_city} */}
                              </td>
                            </tr>

                            <tr>
                              {/* / === "Material" ?  "": ""  */}
                              <th>
                                {' '}
                                {this.state.detail.tender_category_type ===
                                'Material'
                                  ? t('marketplace.all_list_details.material')
                                  : t('marketplace.all_list_details.work')}{' '}
                              </th>
                              <td>
                                {' '}
                                {this.state.detail.tender_type === 'Request'
                                  ? t('marketplace.all_list_details.Request')
                                  : t('marketplace.all_list_details.Offer')}
                              </td>
                            </tr>

                            <tr>
                              <th>
                                {t('marketplace.all_list_details.Expires_in')}{' '}
                              </th>
                              <td>
                                {dateFuncExp(
                                  this.state.detail.tender_expiry_date,
                                  this.state.lang
                                )}
                              </td>
                            </tr>

                            {this.state.detail.tender_delivery_type ? (
                              <tr>
                                <th>
                                  {' '}
                                  {this.state.detail?.tender_type === 'Request'
                                    ? t(
                                        'marketplace.all_list_details.Delivery_type'
                                      )
                                    : t(
                                        'marketplace.all_list_details.Delivery_type'
                                      )}{' '}
                                </th>
                                <td>
                                  {' '}
                                  {this.state.detail.tender_delivery_type ===
                                  'Included'
                                    ? t('marketplace.all_list_details.Included')
                                    : t(
                                        'marketplace.all_list_details.Not_Included'
                                      )}{' '}
                                </td>
                              </tr>
                            ) : (
                              ''
                            )}

                            {this.state.detail.extra === 2 ? (
                              <tr>
                                <th>
                                  {t('marketplace.all_list_details.work')}
                                </th>
                                <td>
                                  {t('marketplace.all_list_details.included')}
                                </td>
                              </tr>
                            ) : this.state.detail.extra === 1 ? (
                              <tr>
                                <th>{t('marketplace.feeds.material')}</th>
                                <td>
                                  {t('marketplace.all_list_details.included')}
                                </td>
                              </tr>
                            ) : null}
                            <tr>
                              <th>
                                {this.state.detail.tender_available_from
                                  ? t(
                                      'marketplace.all_list_details.work_starts'
                                    )
                                  : null}
                              </th>
                              <td>
                                {this.state.detail.tender_available_from
                                  ? this.state.detail.tender_available_from
                                  : null}
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    {/* <lable className="lable_font"> {t("list_details.akivoi")} </lable> */}
                    {moment(this.state.detail.tender_expiry_date).isBefore(
                      moment()._d
                    ) ? null : (
                      <>
                        {data == '' ? (
                          <>
                            {this.state.detail?.tender_status == '0' ? (
                              ''
                            ) : this.state.bids?.length == 0 ? (
                              <div></div>
                            ) : (
                              ''
                            )}
                            {this.state.bids?.length === 0 &&
                            this.state.detail.tender_user_id ===
                              Number(this.state._user_id) ? (
                              <>
                                <lable className='lable_font'>
                                  {' '}
                                  {t(
                                    'marketplace.all_list_details.akivoi'
                                  )}{' '}
                                </lable>

                                <div class='toogle_btn'>
                                  <label class='switch'>
                                    <input
                                      type='checkbox'
                                      name='item6'
                                      defaultChecked={
                                        Number(
                                          this.state.detail?.tender_status
                                        ) == 0
                                          ? true
                                          : false
                                      }
                                      onChange={(e) =>
                                        this.active_btn(
                                          e,
                                          this.state.detail?.tender_id
                                        )
                                      }
                                    />
                                    <div></div>
                                  </label>
                                </div>

                                {/* </div> */}
                              </>
                            ) : (
                              ''
                            )}
                          </>
                        ) : (
                          ' '
                        )}
                      </>
                    )}

                    <div className='hr mg-30'></div>
                    <h3> {t('marketplace.all_list_details.bids_on')} </h3>
                    <div
                      className='table-responsive-lg'
                      style={{ maxWidth: '870px' }}
                    >
                      <p style={{ width: '100%' }}>{t('mybid.disclaimer')}</p>
                      <table
                        className='table table-noborder'
                        style={{ tableLayout: 'auto' }}
                      >
                        {this.state.width < 479 ? (
                          <>
                            <tbody>
                              {this.state.loaded ? (
                                <>
                                  {this.state.loaded === true &&
                                  this.state.bids?.length === 0 ? (
                                    <h3>
                                      {t(
                                        'marketplace.all_list_details.company'
                                      )}
                                    </h3>
                                  ) : this.state.loaded === false ? (
                                    <Spinner animation='border' role='status'>
                                      <span className='sr-only'>
                                        Loading...
                                      </span>
                                    </Spinner>
                                  ) : (
                                    <>
                                      {data != '' ? (
                                        <>
                                          {/* {this.state.bids
                                        ?.filter((val) => {
                                          if (val.tb_status === 1) {
                                            return val;
                                          }
                                        }) */}
                                          {this.state.bids.map((bid, index) => {
                                            return (
                                              <tr key={index}>
                                                {this.state.detail
                                                  .tender_status !== 5 ? (
                                                  <>
                                                    <td>
                                                      <div className='profile flex'>
                                                        <Link
                                                          to={`/profile/${bid.code}`}
                                                        >
                                                          <img
                                                            src={
                                                              bid.company_logo_path +
                                                              bid.company_logo
                                                            }
                                                          />
                                                        </Link>

                                                        <div className='content'>
                                                          <Link
                                                            to={`/profile/${bid.code}`}
                                                            style={{
                                                              textDecoration:
                                                                'none',
                                                            }}
                                                          >
                                                            {bid.first_name}{' '}
                                                            {bid.last_name}
                                                          </Link>

                                                          <p>
                                                            {bid.subtype ===
                                                            'company'
                                                              ? t(
                                                                  'marketplace.all_list_details.company'
                                                                )
                                                              : bid.subtype ===
                                                                'consumer'
                                                              ? t(
                                                                  'marketplace.all_list_details.consumer'
                                                                )
                                                              : bid.subtype ===
                                                                'individual'
                                                              ? t(
                                                                  'marketplace.all_list_details.individual'
                                                                )
                                                              : bid.subtype}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </td>

                                                    <td>
                                                      <strong>
                                                        {this.state.left}
                                                        {bid.tb_quote}
                                                        {this.state.right}
                                                      </strong>
                                                    </td>
                                                  </>
                                                ) : (
                                                  ''
                                                )}
                                                {bid.tb_status === 0 &&
                                                this.state.detail
                                                  .tender_status === 1 ? (
                                                  <>
                                                    {this.state.detail
                                                      .tender_user_id ===
                                                    Number(
                                                      this.state._user_id
                                                    ) ? (
                                                      Number(
                                                        this.state.detail.isUser
                                                      ) === 1 ? (
                                                        <>
                                                          <td
                                                            className='btn-accept'
                                                            style={{
                                                              width: '140px',
                                                            }}
                                                          >
                                                            <a
                                                              href='#'
                                                              className='btn btn-outline-dark open-AcceptDialog'
                                                              data-user_id={
                                                                bid.tb_user_id
                                                              }
                                                              data-img={
                                                                bid.company_logo_path +
                                                                bid.company_logo
                                                              }
                                                              data-id={
                                                                bid.full_name
                                                              }
                                                              data-bid={
                                                                bid.tb_quote
                                                              }
                                                              // data-bd_id={bid.tb_id}
                                                              // data-toggle="modal"
                                                              // data-target="#accept"
                                                              onClick={() =>
                                                                this.handleAcceptModal(
                                                                  {
                                                                    avatar:
                                                                      bid.company_logo_path +
                                                                      bid.company_logo,
                                                                    tbId: bid.tb_id,
                                                                    userId:
                                                                      bid.tb_user_id,
                                                                    tb_quote:
                                                                      bid.tb_quote,
                                                                  }
                                                                )
                                                              }
                                                            >
                                                              {t(
                                                                'marketplace.all_list_details.Accept'
                                                              )}
                                                            </a>
                                                          </td>
                                                          <td
                                                            className='btn-decline'
                                                            style={{
                                                              width: '140px',
                                                            }}
                                                          >
                                                            {/* <Decline
                                                          userId={
                                                            bid.tb_user_id
                                                          }
                                                          show={
                                                            this.state
                                                              .showDeclineModal
                                                          }
                                                          handleClose={() =>
                                                            this.setState({
                                                              showDeclineModal: false,
                                                            })
                                                          }
                                                          id={
                                                            this.props.match
                                                              .params.id
                                                          }
                                                        /> */}
                                                            <a
                                                              className='btn btn-gray open-DeclineDialog'
                                                              onClick={() =>
                                                                this.setState({
                                                                  showDeclineModal:
                                                                    !this.state
                                                                      .showDeclineModal,
                                                                  userId:
                                                                    bid.tb_user_id,
                                                                })
                                                              }
                                                              data-user_id={
                                                                bid.tb_user_id
                                                              }
                                                              // data-toggle="modal"
                                                              // data-target="#decline"
                                                            >
                                                              {t(
                                                                'marketplace.all_list_details.Decline'
                                                              )}
                                                            </a>
                                                          </td>
                                                        </>
                                                      ) : (
                                                        ''
                                                      )
                                                    ) : (
                                                      ''
                                                    )}
                                                  </>
                                                ) : (Number(
                                                    this.state.detail.isUser
                                                  ) === 1 &&
                                                    bid.tb_status == 3 &&
                                                    bid.tender_status == 4) ||
                                                  (bid.tb_status === 1 &&
                                                    bid.tender_status) ? (
                                                  <tr>
                                                    <td
                                                      style={{
                                                        width: '140px',
                                                      }}
                                                    >
                                                      {/* <Accept
                                                    show={
                                                      this.state
                                                        .isAcceptModalOpen
                                                    }
                                                    userId={bid.tb_user_id}
                                                    handleClose={() =>
                                                      this.setState({
                                                        isAcceptModalOpen: false,
                                                      })
                                                    }
                                                    key={index}
                                                    id={
                                                      this.props.match.params.id
                                                    }
                                                    history={this.props.history}
                                                    type={
                                                      this.state.detail
                                                        .tender_type
                                                    }
                                                    avatar={
                                                      bid.company_logo_path +
                                                      bid.company_logo
                                                    }
                                                    left={this.state.left}
                                                    right={this.state.right}
                                                  /> */}
                                                      {/* btn btn-outline-dark */}
                                                      <span className='text-muted'>
                                                        {t(
                                                          'marketplace.all_list_details.Accepted'
                                                        )}
                                                      </span>
                                                    </td>
                                                  </tr>
                                                ) : (
                                                  <td
                                                    style={{
                                                      width: '140px',
                                                    }}
                                                  >
                                                    <span className='text-muted'>
                                                      {t(
                                                        'marketplace.all_list_details.Declined'
                                                      )}
                                                    </span>
                                                  </td>
                                                )}
                                                <td>
                                                  <button
                                                    onClick={(e) =>
                                                      this.viewProposal(
                                                        this.state.bidNew
                                                          .tender_user_id,
                                                        this.state.bidNew
                                                          .tender_id,
                                                        Number(e.target.id)
                                                      )
                                                    }
                                                    id={bid.tb_user_id}
                                                    type='button'
                                                    className='btn btn-outline-dark revv-btn'
                                                  >
                                                    {t(
                                                      'marketplace.all_list_details.Revise_notes'
                                                    )}
                                                  </button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </>
                                      ) : (
                                        <>
                                          {this.state.bids?.map(
                                            (bid, index) => {
                                              return (
                                                <tr key={index}>
                                                  {/* {bid.tb_status !== 2 &&
                                          bid.tb_status !== 6 ? (
                                            this.state.detail.tender_status !==
                                            5 ? ( */}
                                                  <>
                                                    <td>
                                                      <div className='profile flex'>
                                                        {bid.company_logo ? (
                                                          <Link
                                                            to={`/profile/${bid.code}`}
                                                          >
                                                            <img
                                                              src={
                                                                bid.company_logo_path +
                                                                bid.company_logo
                                                              }
                                                            />
                                                          </Link>
                                                        ) : (
                                                          <img
                                                            src={DefaultImg}
                                                          />
                                                        )}
                                                        <div className='content'>
                                                          <h4
                                                            style={{
                                                              textAlign:
                                                                'start',
                                                            }}
                                                          >
                                                            <Link
                                                              to={`/profile/${bid.code}`}
                                                              style={{
                                                                textDecoration:
                                                                  'none',
                                                              }}
                                                            >
                                                              {bid.first_name}{' '}
                                                              {bid.last_name}
                                                            </Link>
                                                          </h4>

                                                          <p
                                                            style={{
                                                              textAlign:
                                                                'start',
                                                            }}
                                                          >
                                                            {bid.subtype ===
                                                            'company'
                                                              ? `${t(
                                                                  'marketplace.all_list_details.company'
                                                                )}`
                                                              : bid.subtype ===
                                                                'consumer'
                                                              ? `${t(
                                                                  'marketplace.all_list_details.consumer'
                                                                )}`
                                                              : bid.subtype ===
                                                                'individual'
                                                              ? `${t(
                                                                  'marketplace.all_list_details.individual'
                                                                )}`
                                                              : null}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </td>
                                                    <td>
                                                      <strong>
                                                        {this.state.left}
                                                        {bid.tb_quote}

                                                        {this.state.right}
                                                      </strong>
                                                    </td>
                                                    {bid.tb_status === 0 ? (
                                                      <>
                                                        {Number(
                                                          this.state.detail
                                                            .isUser
                                                        ) === 1 ? (
                                                          <>
                                                            <td
                                                              className='btn-accept'
                                                              style={{
                                                                width: '140px',
                                                              }}
                                                            >
                                                              {/* <Accept
                                                        show={
                                                          this.state
                                                            .isAcceptModalOpen
                                                        }
                                                        userId={bid.tb_user_id}
                                                        handleClose={() =>
                                                          this.setState({
                                                            isAcceptModalOpen: false,
                                                          })
                                                        }
                                                        history={
                                                          this.props.history
                                                        }
                                                        type={
                                                          this.state.detail
                                                            .tender_type
                                                        }
                                                        key={index}
                                                        id={
                                                          this.props.match
                                                            .params.id
                                                        }
                                                        avatar={
                                                          bid.company_logo_path +
                                                          bid.company_logo
                                                        }
                                                        left={this.state.left}
                                                        right={this.state.right}
                                                        img={
                                                          bid.company_logo_path +
                                                          bid.company_logo
                                                        }
                                                      /> */}
                                                              <a
                                                                href='#'
                                                                className='btn btn-outline-dark open-AcceptDialog'
                                                                data-user_id={
                                                                  bid.tb_user_id
                                                                }
                                                                data-id={
                                                                  bid.full_name
                                                                }
                                                                data-bid={
                                                                  bid.tb_quote
                                                                }
                                                                data-img={
                                                                  bid.company_logo_path +
                                                                  bid.company_logo
                                                                }
                                                                // data-toggle="modal"
                                                                // data-target="#accept"
                                                                onClick={() =>
                                                                  this.handleAcceptModal(
                                                                    {
                                                                      avatar:
                                                                        bid.company_logo_path +
                                                                        bid.company_logo,
                                                                      tbId: bid.tb_id,
                                                                      userId:
                                                                        bid.tb_user_id,
                                                                      tb_quote:
                                                                        bid.tb_quote,
                                                                    }
                                                                  )
                                                                }
                                                              >
                                                                {t(
                                                                  'marketplace.all_list_details.Accept'
                                                                )}
                                                              </a>
                                                            </td>
                                                            <td
                                                              className='btn-decline'
                                                              style={{
                                                                width: '140px',
                                                              }}
                                                            >
                                                              <a
                                                                onClick={() =>
                                                                  this.setState(
                                                                    {
                                                                      showDeclineModal:
                                                                        !this
                                                                          .state
                                                                          .showDeclineModal,
                                                                      userId:
                                                                        bid.tb_user_id,
                                                                    }
                                                                  )
                                                                }
                                                                className='btn btn-gray open-DeclineDialog'
                                                                data-user_id={
                                                                  bid.tb_user_id
                                                                }
                                                                // data-toggle="modal"
                                                                // data-target="#decline"
                                                              >
                                                                {t(
                                                                  'marketplace.all_list_details.Decline'
                                                                )}
                                                              </a>
                                                            </td>

                                                            {/* <td
                                                                className='btn-detail'
                                                                style={{
                                                                  width:
                                                                    '140px',
                                                                }}
                                                              >
                                                                <Link
                                                                  to={`/bid-detail/${bid?.tb_id}/${bid.tb_user_id}`}
                                                                  className='btn btn-outline-dark revv-btn'
                                                                >
                                                                  {t(
                                                                    'marketplace.all_list_details.Detail'
                                                                  )}
                                                                </Link>
                                                              </td> */}
                                                          </>
                                                        ) : (
                                                          ''
                                                        )}
                                                      </>
                                                    ) : (Number(
                                                        this.state.detail.isUser
                                                      ) &&
                                                        bid.tb_status == 3 &&
                                                        bid.tender_status ==
                                                          4) ||
                                                      (bid.tb_status === 1 &&
                                                        bid.tender_status) ||
                                                      (bid.tb_status === 6 &&
                                                        bid.tender_status ===
                                                          6) ? (
                                                      <tr>
                                                        <td
                                                          style={{
                                                            width: '140px',
                                                          }}
                                                        >
                                                          {/* <Accept
                                                    show={
                                                      this.state
                                                        .isAcceptModalOpen
                                                    }
                                                    handleClose={() =>
                                                      this.setState({
                                                        isAcceptModalOpen: false,
                                                      })
                                                    }
                                                    history={this.props.history}
                                                    key={index}
                                                    userId={bid.tb_user_id}
                                                    id={
                                                      this.props.match.params.id
                                                    }
                                                    avatar={
                                                      bid.company_logo_path +
                                                      bid.company_logo
                                                    }
                                                    left={this.state.left}
                                                    right={this.state.right}
                                                    type={
                                                      this.state.detail
                                                        .tender_type
                                                    }
                                                  /> */}
                                                          {/* btn btn-outline-dark open-AcceptDialog */}
                                                          <span className='text-muted'>
                                                            {t(
                                                              'marketplace.all_list_details.Accepted'
                                                            )}
                                                          </span>
                                                        </td>
                                                        {/* <td>
                                                  <button
                                                    onClick={(e) =>
                                                      this.viewProposal(
                                                        this.state.bidNew
                                                          .tender_user_id,
                                                        this.state.bidNew
                                                          .tender_id,
                                                        Number(e.target.id)
                                                      )
                                                    }
                                                    data-toggle='modal'
                                                    data-target='#tender-bids'
                                                    id={bid.tb_user_id}
                                                    type='button'
                                                    className='btn btn-outline-dark revv-btn'
                                                  >
                                                    {t(
                                                      'myproposal.Revise_notes'
                                                    )}
                                                  </button>

                                                  <TenderProposalModal
                                                    propsObj={
                                                      this.state.properties
                                                    }
                                                    proposal_id={
                                                      // this.state.bidNew
                                                      //   .tender_id
                                                      this.state.proposal_id
                                                    }
                                                    loadTenders={this.loadBid}
                                                    id={this.state.tb_user_id}
                                                  />
                                                </td> */}
                                                      </tr>
                                                    ) : (
                                                      <td
                                                        style={{
                                                          width: '140px',
                                                        }}
                                                      >
                                                        <span className='text-muted'>
                                                          {t(
                                                            'marketplace.all_list_details.Declined'
                                                          )}
                                                        </span>
                                                      </td>
                                                    )}
                                                  </>

                                                  {/* ) : ( '' ) ) : ( '' )} */}
                                                  <td className='btn-chat'>
                                                    {/* {bid.tb_status === 0 ? ( */}
                                                    <div className='image-container'>
                                                      <div
                                                        style={{
                                                          width: '50px',
                                                        }}
                                                      >
                                                        <img
                                                          src={Message}
                                                          alt='message-icon'
                                                          onClick={(e) => {
                                                            this.viewProposal(
                                                              this.state.bidNew
                                                                .tender_user_id,
                                                              this.state.bidNew
                                                                .tender_id,
                                                              Number(
                                                                e.target.id
                                                              )
                                                            );
                                                            this.readNotif(
                                                              'tender_message',
                                                              bid.tb_user_id,
                                                              bid.tb_tender_id
                                                            );
                                                          }}
                                                          // data-toggle="modal"
                                                          // data-target="#tender-bids"

                                                          id={bid.tb_user_id}
                                                          //type='button'
                                                          className='message-image'
                                                        />
                                                      </div>
                                                      {/* <img
                                                        src={message}
                                                        onClick={(e) => {
                                                          this.viewProposal(
                                                            this.state.bidNew
                                                              .tender_user_id,
                                                            this.state.bidNew
                                                              .tender_id,
                                                            Number(e.target.id)
                                                          );
                                                          this.readNotif(
                                                            "tender_message",
                                                            bid.tb_user_id,
                                                            bid.tb_tender_id
                                                          );
                                                        }}
                                                        // data-toggle="modal"
                                                        // data-target="#tender-bids"

                                                        id={bid.tb_user_id}
                                                        //type='button'
                                                        className='message-image'
                                                      /> */}
                                                      <li className='centered'>
                                                        {
                                                          this.state.countArr.filter(
                                                            (x) =>
                                                              x ===
                                                              bid.tb_user_id
                                                          ).length
                                                        }
                                                      </li>

                                                      {t(
                                                        'marketplace.all_list_details.Revise_notes1'
                                                      )}

                                                      {/* </button> */}

                                                      {/* <TenderProposalModal
                                                propsObj={this.state.properties}
                                                proposal_id={
                                                  this.state.proposal_id
                                                }
                                                show={this.state.isModalOpen}
                                                handleClose={() => {
                                                  this.setState({
                                                    isModalOpen: false,
                                                  });
                                                }}
                                                id={this.state.tb_user_id}
                                                loadTenders={this.loadBid}
                                                messages={this.state.messages}
                                              /> */}
                                                    </div>
                                                    {/* ) : (
                                              ''
                                            )} */}
                                                  </td>
                                                  <td
                                                    className='btn-detail'
                                                    style={{
                                                      width: '140px',
                                                    }}
                                                  >
                                                    <Link
                                                      to={`/bid-detail/${bid?.tb_id}/${bid.tb_user_id}`}
                                                      className='btn btn-outline-dark revv-btn'
                                                      style={{
                                                        borderColor: 'white',
                                                        color: '#0790C9',
                                                      }}
                                                    >
                                                      {t(
                                                        'marketplace.all_list_details.Detail'
                                                      )}
                                                    </Link>
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                ' '
                              )}
                            </tbody>
                          </>
                        ) : (
                          <tbody>
                            {this.state.loaded ? (
                              <>
                                {this.state.loaded === true &&
                                this.state.bids?.length === 0 ? (
                                  <h3>
                                    {t('marketplace.all_list_details.company')}
                                  </h3>
                                ) : this.state.loaded === false ? (
                                  <Spinner animation='border' role='status'>
                                    <span className='sr-only'>Loading...</span>
                                  </Spinner>
                                ) : (
                                  <>
                                    {data != '' ? (
                                      <>
                                        {/* {this.state.bids
                                        ?.filter((val) => {
                                          if (val.tb_status === 1) {
                                            return val;
                                          }
                                        }) */}
                                        {this.state.bids.map((bid, index) => {
                                          return (
                                            <tr key={index}>
                                              {this.state.detail
                                                .tender_status !== 5 ? (
                                                <>
                                                  <td>
                                                    <div className='profile flex'>
                                                      <Link
                                                        to={`/profile/${bid.code}`}
                                                      >
                                                        <img
                                                          src={
                                                            bid.company_logo_path +
                                                            bid.company_logo
                                                          }
                                                        />
                                                      </Link>

                                                      <div className='content'>
                                                        <Link
                                                          to={`/profile/${bid.code}`}
                                                          style={{
                                                            textDecoration:
                                                              'none',
                                                          }}
                                                        >
                                                          {bid.first_name}{' '}
                                                          {bid.last_name}
                                                        </Link>

                                                        <p>
                                                          {bid.subtype ===
                                                          'company'
                                                            ? t(
                                                                'marketplace.all_list_details.company'
                                                              )
                                                            : bid.subtype ===
                                                              'consumer'
                                                            ? t(
                                                                'marketplace.all_list_details.consumer'
                                                              )
                                                            : bid.subtype ===
                                                              'individual'
                                                            ? t(
                                                                'marketplace.all_list_details.individual'
                                                              )
                                                            : bid.subtype}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td>
                                                    <strong>
                                                      {this.state.left}
                                                      {bid.tb_quote}
                                                      {this.state.right}
                                                    </strong>
                                                  </td>
                                                </>
                                              ) : (
                                                ''
                                              )}
                                              {bid.tb_status === 0 &&
                                              this.state.detail
                                                .tender_status === 1 ? (
                                                <>
                                                  {this.state.detail
                                                    .tender_user_id ===
                                                  Number(
                                                    this.state._user_id
                                                  ) ? (
                                                    Number(
                                                      this.state.detail.isUser
                                                    ) === 1 ? (
                                                      <>
                                                        <td
                                                          className='btn-accept'
                                                          style={{
                                                            width: '140px',
                                                          }}
                                                        >
                                                          <a
                                                            href='#'
                                                            className='btn btn-outline-dark open-AcceptDialog'
                                                            data-user_id={
                                                              bid.tb_user_id
                                                            }
                                                            data-img={
                                                              bid.company_logo_path +
                                                              bid.company_logo
                                                            }
                                                            data-id={
                                                              bid.full_name
                                                            }
                                                            data-bid={
                                                              bid.tb_quote
                                                            }
                                                            // data-bd_id={bid.tb_id}
                                                            // data-toggle="modal"
                                                            // data-target="#accept"
                                                            onClick={() =>
                                                              this.handleAcceptModal(
                                                                {
                                                                  avatar:
                                                                    bid.company_logo_path +
                                                                    bid.company_logo,
                                                                  tbId: bid.tb_id,
                                                                  userId:
                                                                    bid.tb_user_id,
                                                                  tb_quote:
                                                                    bid.tb_quote,
                                                                }
                                                              )
                                                            }
                                                          >
                                                            {t(
                                                              'marketplace.all_list_details.Accept'
                                                            )}
                                                          </a>
                                                        </td>
                                                        <td
                                                          className='btn-decline'
                                                          style={{
                                                            width: '140px',
                                                          }}
                                                        >
                                                          {/* <Decline
                                                          userId={
                                                            bid.tb_user_id
                                                          }
                                                          show={
                                                            this.state
                                                              .showDeclineModal
                                                          }
                                                          handleClose={() =>
                                                            this.setState({
                                                              showDeclineModal: false,
                                                            })
                                                          }
                                                          id={
                                                            this.props.match
                                                              .params.id
                                                          }
                                                        /> */}
                                                          <a
                                                            className='btn btn-gray open-DeclineDialog'
                                                            onClick={() =>
                                                              this.setState({
                                                                showDeclineModal:
                                                                  !this.state
                                                                    .showDeclineModal,
                                                                userId:
                                                                  bid.tb_user_id,
                                                              })
                                                            }
                                                            data-user_id={
                                                              bid.tb_user_id
                                                            }
                                                            // data-toggle="modal"
                                                            // data-target="#decline"
                                                          >
                                                            {t(
                                                              'marketplace.all_list_details.Decline'
                                                            )}
                                                          </a>
                                                        </td>
                                                      </>
                                                    ) : (
                                                      ''
                                                    )
                                                  ) : (
                                                    ''
                                                  )}
                                                </>
                                              ) : (Number(
                                                  this.state.detail.isUser
                                                ) === 1 &&
                                                  bid.tb_status == 3 &&
                                                  bid.tender_status == 4) ||
                                                (bid.tb_status === 1 &&
                                                  bid.tender_status) ? (
                                                <tr>
                                                  <td
                                                    style={{
                                                      width: '140px',
                                                    }}
                                                  >
                                                    {/* <Accept
                                                    show={
                                                      this.state
                                                        .isAcceptModalOpen
                                                    }
                                                    userId={bid.tb_user_id}
                                                    handleClose={() =>
                                                      this.setState({
                                                        isAcceptModalOpen: false,
                                                      })
                                                    }
                                                    key={index}
                                                    id={
                                                      this.props.match.params.id
                                                    }
                                                    history={this.props.history}
                                                    type={
                                                      this.state.detail
                                                        .tender_type
                                                    }
                                                    avatar={
                                                      bid.company_logo_path +
                                                      bid.company_logo
                                                    }
                                                    left={this.state.left}
                                                    right={this.state.right}
                                                  /> */}
                                                    {/* btn btn-outline-dark */}
                                                    <span className='text-muted'>
                                                      {t(
                                                        'marketplace.all_list_details.Accepted'
                                                      )}
                                                    </span>
                                                  </td>
                                                </tr>
                                              ) : (
                                                <td
                                                  style={{
                                                    width: '140px',
                                                  }}
                                                >
                                                  <span className='text-muted'>
                                                    {t(
                                                      'marketplace.all_list_details.Declined'
                                                    )}
                                                  </span>
                                                </td>
                                              )}
                                              <td>
                                                <button
                                                  onClick={(e) =>
                                                    this.viewProposal(
                                                      this.state.bidNew
                                                        .tender_user_id,
                                                      this.state.bidNew
                                                        .tender_id,
                                                      Number(e.target.id)
                                                    )
                                                  }
                                                  id={bid.tb_user_id}
                                                  type='button'
                                                  className='btn btn-outline-dark revv-btn'
                                                >
                                                  {t(
                                                    'marketplace.all_list_details.Revise_notes'
                                                  )}
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </>
                                    ) : (
                                      <>
                                        {this.state.bids?.map((bid, index) => {
                                          return (
                                            <tr key={index}>
                                              {/* {bid.tb_status !== 2 &&
                                          bid.tb_status !== 6 ? (
                                            this.state.detail.tender_status !==
                                            5 ? ( */}
                                              <>
                                                <td>
                                                  <div className='profile flex'>
                                                    {bid.company_logo ? (
                                                      <Link
                                                        to={`/profile/${bid.code}`}
                                                      >
                                                        <img
                                                          src={
                                                            bid.company_logo_path +
                                                            bid.company_logo
                                                          }
                                                        />
                                                      </Link>
                                                    ) : (
                                                      <img src={DefaultImg} />
                                                    )}
                                                    <div className='content'>
                                                      <h4
                                                        style={{
                                                          textAlign: 'start',
                                                        }}
                                                      >
                                                        <Link
                                                          to={`/profile/${bid.code}`}
                                                          style={{
                                                            textDecoration:
                                                              'none',
                                                          }}
                                                        >
                                                          {bid.first_name}{' '}
                                                          {bid.last_name}
                                                        </Link>
                                                      </h4>

                                                      <p
                                                        style={{
                                                          textAlign: 'start',
                                                        }}
                                                      >
                                                        {bid.subtype ===
                                                        'company'
                                                          ? `${t(
                                                              'marketplace.all_list_details.company'
                                                            )}`
                                                          : bid.subtype ===
                                                            'consumer'
                                                          ? `${t(
                                                              'marketplace.all_list_details.consumer'
                                                            )}`
                                                          : bid.subtype ===
                                                            'individual'
                                                          ? `${t(
                                                              'marketplace.all_list_details.individual'
                                                            )}`
                                                          : null}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </td>
                                                <td>
                                                  <strong>
                                                    {this.state.left}
                                                    {bid.tb_quote}

                                                    {this.state.right}
                                                  </strong>
                                                </td>
                                                {bid.tb_status === 0 ? (
                                                  <>
                                                    {Number(
                                                      this.state.detail.isUser
                                                    ) === 1 ? (
                                                      <>
                                                        <td
                                                          className='btn-accept'
                                                          style={{
                                                            width: '140px',
                                                          }}
                                                        >
                                                          {/* <Accept
                                                        show={
                                                          this.state
                                                            .isAcceptModalOpen
                                                        }
                                                        userId={bid.tb_user_id}
                                                        handleClose={() =>
                                                          this.setState({
                                                            isAcceptModalOpen: false,
                                                          })
                                                        }
                                                        history={
                                                          this.props.history
                                                        }
                                                        type={
                                                          this.state.detail
                                                            .tender_type
                                                        }
                                                        key={index}
                                                        id={
                                                          this.props.match
                                                            .params.id
                                                        }
                                                        avatar={
                                                          bid.company_logo_path +
                                                          bid.company_logo
                                                        }
                                                        left={this.state.left}
                                                        right={this.state.right}
                                                        img={
                                                          bid.company_logo_path +
                                                          bid.company_logo
                                                        }
                                                      /> */}
                                                          <a
                                                            href='#'
                                                            className='btn btn-outline-dark open-AcceptDialog'
                                                            data-user_id={
                                                              bid.tb_user_id
                                                            }
                                                            data-id={
                                                              bid.full_name
                                                            }
                                                            data-bid={
                                                              bid.tb_quote
                                                            }
                                                            data-img={
                                                              bid.company_logo_path +
                                                              bid.company_logo
                                                            }
                                                            // data-toggle="modal"
                                                            // data-target="#accept"
                                                            onClick={() =>
                                                              this.handleAcceptModal(
                                                                {
                                                                  avatar:
                                                                    bid.company_logo_path +
                                                                    bid.company_logo,
                                                                  tbId: bid.tb_id,
                                                                  userId:
                                                                    bid.tb_user_id,
                                                                  tb_quote:
                                                                    bid.tb_quote,
                                                                }
                                                              )
                                                            }
                                                          >
                                                            {t(
                                                              'marketplace.all_list_details.Accept'
                                                            )}
                                                          </a>
                                                        </td>
                                                        <td
                                                          className='btn-decline'
                                                          style={{
                                                            width: '140px',
                                                          }}
                                                        >
                                                          <a
                                                            onClick={() =>
                                                              this.setState({
                                                                showDeclineModal:
                                                                  !this.state
                                                                    .showDeclineModal,
                                                                userId:
                                                                  bid.tb_user_id,
                                                              })
                                                            }
                                                            className='btn btn-gray open-DeclineDialog'
                                                            data-user_id={
                                                              bid.tb_user_id
                                                            }
                                                            // data-toggle="modal"
                                                            // data-target="#decline"
                                                          >
                                                            {t(
                                                              'marketplace.all_list_details.Decline'
                                                            )}
                                                          </a>
                                                        </td>

                                                        <td
                                                          className='btn-detail'
                                                          style={{
                                                            width: '140px',
                                                          }}
                                                        >
                                                          <Link
                                                            to={`/bid-detail/${bid?.tb_id}/${bid.tb_user_id}`}
                                                            className='btn btn-outline-dark revv-btn'
                                                          >
                                                            {t(
                                                              'marketplace.all_list_details.Detail'
                                                            )}
                                                          </Link>
                                                        </td>
                                                      </>
                                                    ) : (
                                                      ''
                                                    )}
                                                  </>
                                                ) : (Number(
                                                    this.state.detail.isUser
                                                  ) &&
                                                    bid.tb_status == 3 &&
                                                    bid.tender_status == 4) ||
                                                  (bid.tb_status === 1 &&
                                                    bid.tender_status) ||
                                                  (bid.tb_status === 6 &&
                                                    bid.tender_status === 6) ? (
                                                  <tr>
                                                    <td
                                                      style={{
                                                        width: '140px',
                                                      }}
                                                    >
                                                      {/* <Accept
                                                    show={
                                                      this.state
                                                        .isAcceptModalOpen
                                                    }
                                                    handleClose={() =>
                                                      this.setState({
                                                        isAcceptModalOpen: false,
                                                      })
                                                    }
                                                    history={this.props.history}
                                                    key={index}
                                                    userId={bid.tb_user_id}
                                                    id={
                                                      this.props.match.params.id
                                                    }
                                                    avatar={
                                                      bid.company_logo_path +
                                                      bid.company_logo
                                                    }
                                                    left={this.state.left}
                                                    right={this.state.right}
                                                    type={
                                                      this.state.detail
                                                        .tender_type
                                                    }
                                                  /> */}
                                                      {/* btn btn-outline-dark open-AcceptDialog */}
                                                      <span className='text-muted'>
                                                        {t(
                                                          'marketplace.all_list_details.Accepted'
                                                        )}
                                                      </span>
                                                    </td>
                                                    {/* <td>
                                                  <button
                                                    onClick={(e) =>
                                                      this.viewProposal(
                                                        this.state.bidNew
                                                          .tender_user_id,
                                                        this.state.bidNew
                                                          .tender_id,
                                                        Number(e.target.id)
                                                      )
                                                    }
                                                    data-toggle='modal'
                                                    data-target='#tender-bids'
                                                    id={bid.tb_user_id}
                                                    type='button'
                                                    className='btn btn-outline-dark revv-btn'
                                                  >
                                                    {t(
                                                      'myproposal.Revise_notes'
                                                    )}
                                                  </button>

                                                  <TenderProposalModal
                                                    propsObj={
                                                      this.state.properties
                                                    }
                                                    proposal_id={
                                                      // this.state.bidNew
                                                      //   .tender_id
                                                      this.state.proposal_id
                                                    }
                                                    loadTenders={this.loadBid}
                                                    id={this.state.tb_user_id}
                                                  />
                                                </td> */}
                                                  </tr>
                                                ) : (
                                                  <td
                                                    style={{
                                                      width: '140px',
                                                    }}
                                                  >
                                                    <span className='text-muted'>
                                                      {t(
                                                        'marketplace.all_list_details.Declined'
                                                      )}
                                                    </span>
                                                  </td>
                                                )}
                                              </>
                                              {/* ) : ( '' ) ) : ( '' )} */}
                                              <td className='btn-chat'>
                                                {/* {bid.tb_status === 0 ? ( */}
                                                <>
                                                  <button
                                                    onClick={(e) => {
                                                      this.viewProposal(
                                                        this.state.bidNew
                                                          .tender_user_id,
                                                        this.state.bidNew
                                                          .tender_id,
                                                        Number(e.target.id),
                                                        this.state.bidNew
                                                          .tender_user_id,
                                                        Number(e.target.id)
                                                      );
                                                      this.readNotif(
                                                        'tender_message',
                                                        bid.tb_user_id,
                                                        bid.tb_tender_id
                                                      );
                                                    }}
                                                    // data-toggle="modal"
                                                    // data-target="#tender-bids"

                                                    id={bid.tb_user_id}
                                                    type='button'
                                                    className={
                                                      this.state.notif?.find(
                                                        (notif) =>
                                                          notif.notification_sender_id ===
                                                            bid.tb_user_id &&
                                                          notif.notification_bid_id ===
                                                            bid.tb_tender_id
                                                      )
                                                        ?.notification_sender_id ===
                                                      bid.tb_user_id
                                                        ? 'btn btn-outline-success revv-btn notification-badges'
                                                        : 'btn btn-outline-dark revv-btn'
                                                    }
                                                  >
                                                    {t(
                                                      'marketplace.all_list_details.Revise_notes'
                                                    )}

                                                    <li
                                                      data-badge={
                                                        this.state.countArr.filter(
                                                          (x) =>
                                                            x === bid.tb_user_id
                                                        ).length
                                                      }
                                                    ></li>
                                                  </button>

                                                  {/* <TenderProposalModal
                                                propsObj={this.state.properties}
                                                proposal_id={
                                                  this.state.proposal_id
                                                }
                                                show={this.state.isModalOpen}
                                                handleClose={() => {
                                                  this.setState({
                                                    isModalOpen: false,
                                                  });
                                                }}
                                                id={this.state.tb_user_id}
                                                loadTenders={this.loadBid}
                                                messages={this.state.messages}
                                              /> */}
                                                </>
                                                {/* ) : (
                                              ''
                                            )} */}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            ) : (
                              ' '
                            )}
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Accept
          show={this.state.isAcceptModalOpen}
          handleClose={() =>
            this.setState({
              isAcceptModalOpen: false,
            })
          }
          id={this.props.match.params.id}
          avatar={this.state.avatar}
          history={this.props.history}
          type={this.state.detail.tender_type}
          left={this.state.left}
          right={this.state.right}
          tb_id={this.state.tbId}
          userId={this.state.userId}
          tb_quote={this.state.tb_quote}
        />
        <Decline
          userId={this.state.userId}
          show={this.state.showDeclineModal}
          handleClose={() =>
            this.setState({
              showDeclineModal: false,
            })
          }
          id={this.props.match.params.id}
        />
        <TenderProposalModal
          propsObj={this.state.properties}
          proposal_id={this.state.proposal_id}
          show={this.state.isModalOpen}
          handleClose={() => {
            this.setState({
              isModalOpen: false,
            });
          }}
          loadTenders={this.loadBid}
          id={this.state.tb_user_id}
        />
      </div>
    );
  }
}

export default withTranslation()(ListDetails);
