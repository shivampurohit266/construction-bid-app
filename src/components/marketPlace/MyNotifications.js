import React, { Component } from 'react';
import axios from 'axios';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import { Helper, url } from '../../helper/helper';
import { Link, Redirect } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Alert } from 'reactstrap';
import Breadcrumb from '../shared/Breadcrumb';
import { getData } from '../../helper/api';
import { dateFunc } from '../../helper/dateFunc/date';
class MyNotifications extends Component {
  state = {
    notifs: [],
    lang: localStorage.getItem('_lng'),
  };

  componentDidMount = () => {
    this.loadNotif();
  };

  loadNotif = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/notifications`, token)
      .then((result) => {
        this.setState({ notifs: result.data.data });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  // getAlert(data) {
  //   // //console.log('data', data)
  //   switch(data){
  //     case 'Narinder':
  //       return  "affdafs" ; break;
  //     case '2':
  //       return  2 ; break;
  //     // .. etc
  //     default:
  //       return  "jhfsajfhbaj";
  //   }
  // }
  render() {
    const { t, i18n } = this.props;

    const notifications = this.state.notifs
      ? this.state.notifs.map((notif) => (
          <div>
            {notif.sender_isLogged &&
            notif.notification_type === 'tender_message' ? (
              <Link
                to={
                  notif.notification_user_id === notif.tender_user_id
                    ? `/bid-detail/${notif.tender_bid_id}/${notif.notification_sender_id}`
                    : `/Biddetails/${notif.tender_bid_id}`
                }

                //pathname: `/listing-detail/${notification.notification_bid_id}`,
              >
                {' '}
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p>
                          {''} {t('b_sidebar.messaging.message')}
                          {''} {notif.sender}
                        </p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : notif.sender_isLogged &&
              notif.notification_type === 'project_task_created' ? (
              <Link to='/manage-projects'>
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p>{notif.notification_message}</p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : notif.sender_isLogged &&
              notif.notification_type === 'submit-offer' ? (
              <Link to='/my-actions/bids'>
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p>
                          {''} {t('b_sidebar.messaging.SubmitOffer')}{' '}
                          {notif.sender}
                        </p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : notif.sender_isLogged &&
              notif.notification_type === 'proposal_message' ? (
              <Link to='/my-actions/offers'>
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p>
                          {t('b_sidebar.messaging.message')}
                          {''}
                          {notif.sender}
                        </p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : notif.sender_isLogged &&
              notif.notification_type === 'project_report_sent' ? (
              <Link to='/create-report'>
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p>
                          {t('b_sidebar.messaging.newReport')}
                          {''}
                          {notif.sender}
                        </p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : notif.sender_isLogged &&
              notif.notification_type === 'agreement_message' ? (
              <Link to='/my-actions/contracts'>
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p>
                          {t('b_sidebar.messaging.message')}
                          {''}
                          {notif.sender}
                        </p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : notif.sender_isLogged &&
              notif.notification_type === 'accept-bid' ? (
              <Link to='/my-actions'>
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p>
                          {' '}
                          {t('b_sidebar.messaging.BidAccepted')} {notif.sender}
                        </p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : notif.sender_isLogged &&
              notif.notification_type === 'decline-bid' ? (
              <Link to='/my-actions'>
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p> {notif.sender}</p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : notif.sender_isLogged &&
              notif.notification_type === 'bid_made' ? (
              <Link
                to={{
                  pathname: `/listing-detail/${notif.notification_bid_id}`,
                }}
              >
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p>
                          {/* {notif.notification_message} */}
                          {notif.sender} {t('b_sidebar.messaging.BidMade')}
                        </p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}
            {notif.sender_isLogged &&
            notif.notification_type === 'proposal_sent' ? (
              <React.Fragment>
                {notif.notification_type === 'accept-bid' ? (
                  <Link to='/my-actions'>
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {notif.notification_type === 'accept-bid'
                                ? `Bid accepted by ${notif.sender}`
                                : notif.notification_type === 'decline-bid'
                                ? `Bid declined by ${notif.sender}`
                                : null}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : notif.notification_type === 'decline-bid' ? (
                  <Link to='/my-actions'>
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {notif.notification_type === 'accept-bid'
                                ? `Bid accepted by ${notif.sender}`
                                : notif.notification_type === 'decline-bid'
                                ? `Bid declined by ${notif.sender}`
                                : null}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : null}
                {notif.sender_isLogged &&
                notif.notification_type === 'proposal_sent' ? (
                  <Link
                    to={{
                      pathname: `/proposal-listing`,
                    }}
                  >
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {t('b_sidebar.messaging.OfferSent')}{' '}
                              {notif.sender}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : null}
              </React.Fragment>
            ) : null}

            {notif.sender_isLogged &&
            notif.notification_type === 'agreement_sent' ? (
              <Link
                to={{
                  pathname: `/agreement-listing`,
                }}
              >
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p>
                          {/* {notif.sender_isLogged &&
                          notif.notification_type === 'agreement_sent'
                            ? `Agreement sent by ${notif.sender} on email`
                            : null} */}
                          {t('b_sidebar.messaging.ContractSent')} {notif.sender}
                        </p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}

            {notif.sender_isLogged &&
            notif.notification_type === 'invoice_sent' ? (
              <Link
                to={{
                  pathname: `/invoice-list`,
                }}
              >
                <div className='card mb-1'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-lg-4'>
                        <p>
                          {notif.sender_isLogged &&
                          notif.notification_type === 'invoice_sent'
                            ? `Invoice sent by ${notif.sender} on email`
                            : null}
                        </p>
                      </div>
                      <div className='col-lg-4'>
                        <b className='fw-500'>
                          {dateFunc(notif.created_at, this.state.lang)}
                        </b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}

            {(notif.sender_isLogged &&
              notif.notification_type === 'agreement_accepted') ||
            notif.notification_type === 'agreement_declined' ||
            notif.notification_type === 'agreement_revision' ? (
              <React.Fragment>
                {notif.sender_isLogged &&
                notif.notification_type === 'agreement_revision' ? (
                  <Link
                    to={{
                      pathname: `/agreement-listing`,
                    }}
                  >
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {t('b_sidebar.messaging.contract_revision')}{' '}
                              {notif.sender}{' '}
                              {t('b_sidebar.messaging.contract_for_request')}{' '}
                              {notif.notification_user_id}
                              {notif.notification_bid_id}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : notif.sender_isLogged &&
                  notif.notification_type === 'agreement_accepted' ? (
                  <Link>
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {t('b_sidebar.messaging.ContractAccepted')}{' '}
                              {notif.notification_message} {notif.sender}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : notif.sender_isLogged &&
                  notif.notification_type === 'agreement_declined' ? (
                  <Link>
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {t('b_sidebar.messaging.ContractDeclined')}{' '}
                              {notif.notification_message} {notif.sender}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : notif.sender_isLogged &&
                  notif.notification_type !== 'agreement_revision' ? (
                  <Link>
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {t('b_sidebar.messaging.ContractAccepted')}{' '}
                              {notif.notification_message} {notif.sender}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : null}
              </React.Fragment>
            ) : null}

            {(notif.sender_isLogged &&
              notif.notification_type === 'proposal_accepted') ||
            notif.notification_type === 'proposal_declined' ||
            notif.notification_type === 'proposal_revision' ? (
              <React.Fragment>
                {notif.sender_isLogged &&
                notif.notification_type === 'proposal_revision' ? (
                  <Link
                    to={{
                      pathname: `/proposal-listing`,
                    }}
                  >
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {t('b_sidebar.messaging.offer_revision')}{' '}
                              {notif.sender}{' '}
                              {t('b_sidebar.messaging.offer_for_request')}{' '}
                              {notif.notification_user_id}
                              {notif.notification_bid_id}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : notif.sender_isLogged &&
                  notif.notification_type === 'proposal_accepted' ? (
                  <Link>
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {t('b_sidebar.messaging.offer_accepted')}{' '}
                              {notif.notification_message} {notif.sender}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : notif.sender_isLogged &&
                  notif.notification_type === 'proposal_declined' ? (
                  <Link>
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {t('b_sidebar.messaging.offer_declined')}{' '}
                              {notif.notification_message} {notif.sender}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : notif.sender_isLogged &&
                  notif.notification_type !== 'proposal_revision' ? (
                  <Link>
                    <div className='card mb-1'>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-lg-4'>
                            <p>
                              {t('b_sidebar.messaging.offer_accepted')}{' '}
                              {notif.notification_message} {notif.sender}
                            </p>
                          </div>
                          <div className='col-lg-4'>
                            <b className='fw-500'>
                              {dateFunc(notif.created_at, this.state.lang)}
                            </b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : null}
              </React.Fragment>
            ) : null}
          </div>
        ))
      : [];

    return (
      <div>
        {/* <Header /> */}
        <Breadcrumb>
          <li className='breadcrumb-item active' aria-current='page'>
            {t('my_notif.title')}
          </li>
        </Breadcrumb>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              <h3 className='head3'> {t('my_notif.title')} </h3>
              {/* <Alert color="info"><span>This is a plain notification</span></Alert> */}
              {notifications}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(MyNotifications);
