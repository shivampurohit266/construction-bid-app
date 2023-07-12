import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../helper/helper';
import Logo from '../../images/Full-Logo-lighter.png';
import FavLogo from '../../images/favicon-32.png';
import { Link, Redirect } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import i18n from '../../locales/i18n';
import img from '../../images/DefaultImg.png';
import { initializeUserData } from '../../store/userSlice/userActionCreators';
import { store } from '../../store/appStore';
import { ReactComponent as English } from '../../images/english.svg';
import { ReactComponent as Finland } from '../../images/finland.svg';
import { ReactComponent as Estonia } from '../../images/estonia.svg';
import {
  getData,
  modifyDataWithToken,
  postDataWithToken,
} from '../../helper/api';
import './header.css';
import Banner from './Banner';

class Header extends Component {
  state = {
    loggedIn: true,
    count: 0,
    unread: 0,
    info: [],
    notif: [],
    show: false,
    token: localStorage.getItem('token'),
    clickedNotif: 0,
    Login_user_permissions: localStorage.getItem('Login_user_permissions')
      ? localStorage.getItem('Login_user_permissions')
      : [],
  };

  componentDidMount = () => {
    i18n.changeLanguage(this.props.i18n.language);
    // localStorage.setItem('i18nextLng', this.props.i18n.language);
    // localStorage.setItem('_lng', this.props.i18n.language);
    this._isMounted = true;

    this.loadToken();
    this.loadNotif();
    this.loadUnreadNotif();
    this.loadData();
  };

  componentDidUpdate = (prevState, prevProps) => {
    this._isMounted = true;
    if (this.state.count !== this.state.unread) {
      this.loadNotif();
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadData = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/account`, token)
      .then(
        ({ data }) => {
          if (this._isMounted) {
            this.setState({
              package: data[0].package_price,
              country_id: data[0].address_country,
            });
            console.log(data);
            i18n.changeLanguage(data[0].language);
            localStorage.setItem('i18nextLng', data[0].language);
            localStorage.setItem('_lng', data[0].language);
            this.setState({ info: data[0] });
            store.dispatch(initializeUserData(data[0]));
          }
        },
        () => {}
      )
      .catch(() => {});
  };

  loadNotif = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/getBidsNotif`, token)
      .then((response) => {
        this.setState({
          notif: response.data.data,
          count: response.data.count,
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
    if (this._isMounted) {
      const token = this.state.token;
      await getData(`${url}/api/notification/unread`, token)
        .then((response) => {
          if (this._isMounted) {
            this.setState({
              unread: response.data.data,
            });
          }
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
          }
        });
      setTimeout(() => {
        this.loadUnreadNotif();
      }, 30000);
    }
  };

  readNotif = async (id) => {
    const token = localStorage.getItem('token');
    await modifyDataWithToken(`${url}/api/notification/read/${id}`, null, token)
      .then(() => {
        this.loadUnreadNotif();
      })
      .catch(() => {});
  };

  readNotifAll = async () => {
    const token = localStorage.getItem('token');
    await modifyDataWithToken(`${url}/api/notification/readall`, null, token)
      .then(() => {
        this.loadUnreadNotif();
      })
      .catch(() => {});
  };

  loadToken = async () => {
    const token = localStorage.getItem('token');
    if (token == null) {
      this.setState({ loggedIn: false });
    }
  };

  // changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  //   localStorage.setItem('_lng', lng);
  //   this.Set_leng(lng);
  // };

  Set_leng = async (lng) => {
    const data = new FormData();
    data.set('user_id', localStorage.getItem('Login_user_id'));
    data.set('language_code', lng);

    const token = localStorage.getItem('token');
    await postDataWithToken(`${url}/api/update_language_flag`, data, token)
      .then(() => {
        this.setState({ success: true, password_err: false });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch(() => {});
  };

  render() {
    if (
      this.state.loggedIn === false
      // !window.location.pathname.includes('api/profile')
    ) {
      return <Redirect to='/' />;
    }
    console.log(this.state.count, this.state.notif, this.state.unread);
    const { t } = this.props;

    const notif = this.state.notif
      ? this.state.notif.map((notification, index) => (
          <div key={index}>
            {notification.sender_isLogged &&
            notification.notification_type === 'tender_message' ? (
              <Link
                className='dropdown-item'
                onClick={() => this.readNotif(notification.notification_id)}
                to={
                  notification.notification_user_id ===
                  notification.tender_user_id
                    ? `/bid-detail/${notification.tender_bid_id}/${notification.notification_sender_id}`
                    : `/Biddetails/${notification.tender_bid_id}`
                }
              >
                {t('b_sidebar.messaging.message')} {notification.sender}
              </Link>
            ) : notification.sender_isLogged &&
              notification.notification_type === 'project_task_created' ? (
              <Link
                className='dropdown-item'
                onClick={() => this.readNotif(notification.notification_id)}
                to='/manage-projects'
              >
                {notification.notification_message}
              </Link>
            ) : notification.sender_isLogged &&
              notification.notification_type === 'proposal_message' ? (
              <Link
                className='dropdown-item'
                onClick={() => this.readNotif(notification.notification_id)}
                to={
                  notification.notification_user_id ===
                  notification.tender_user_id
                    ? '/my-actions/'
                    : '/my-actions/offers'
                }
              >
                {t('b_sidebar.messaging.message')} {notification.sender}
              </Link>
            ) : notification.sender_isLogged &&
              notification.notification_type === 'project_report_sent' ? (
              <Link
                className='dropdown-item'
                onClick={() => this.readNotif(notification.notification_id)}
                to={
                  notification.notification_user_id ===
                  notification.tender_user_id
                    ? '/create-report'
                    : '/create-report'
                }
              >
                {t('b_sidebar.messaging.newReport')} {notification.sender}
              </Link>
            ) : notification.sender_isLogged &&
              notification.notification_type === 'agreement_message' ? (
              <Link
                className='dropdown-item'
                onClick={() => this.readNotif(notification.notification_id)}
                to={
                  notification.notification_user_id ===
                  notification.tender_user_id
                    ? '/my-actions/'
                    : '/my-actions/contracts'
                }
              >
                {t('b_sidebar.messaging.message')} {notification.sender}
              </Link>
            ) : notification.sender_isLogged &&
              notification.notification_type === 'submit-offer' ? (
              <Link
                className='dropdown-item'
                to='/my-actions/bids'
                onClick={() => this.readNotif(notification.notification_id)}
              >
                {t('b_sidebar.messaging.SubmitOffer')} {notification.sender}
              </Link>
            ) : notification.sender_isLogged &&
              notification.notification_type === 'accept-bid' ? (
              <Link
                className='dropdown-item'
                to='/my-actions/bids'
                onClick={() => this.readNotif(notification.notification_id)}
              >
                {t('b_sidebar.messaging.BidAccepted')} {notification.sender}
              </Link>
            ) : notification.sender_isLogged &&
              notification.notification_type === 'decline-bid' ? (
              <Link
                className='dropdown-item'
                to='/my-actions/bids'
                onClick={() => this.readNotif(notification.notification_id)}
              >
                {t('header.Proposal_declined')} {notification.sender}
              </Link>
            ) : notification.sender_isLogged &&
              notification.notification_type === 'bid_made' ? (
              <Link
                className='dropdown-item'
                to={{
                  pathname: `/listing-detail/${notification.notification_bid_id}`,
                }}
                onClick={() => this.readNotif(notification.notification_id)}
                //to='/my-actions'
              >
                {t('b_sidebar.messaging.BidMade')} {notification.sender}
              </Link>
            ) : null}

            {notification.sender_isLogged &&
            notification.notification_type === 'proposal_sent' ? (
              <div>
                {' '}
                {/* <Link
                  onClick={() => this.readNotif(notification.notification_id)}
                  className='dropdown-item'
                  to='/my-actions'
                >
                  {notification.notification_type === 'accept-bid'
                    ? `Bid accepted by ${notification.sender}`
                    : notification.notification_type === 'decline-bid'
                    ? `Bid declined by ${notification.sender}`
                    : null}
                </Link>{' '}
                {notification.sender_isLogged &&
                notification.notification_type === 'proposal_sent' ? ( */}
                <Link
                  to={{
                    pathname: `/my-actions/offers`,
                  }}
                  className='dropdown-item'
                  onClick={() => this.readNotif(notification.notification_id)}
                >
                  {t('b_sidebar.messaging.OfferSent')} {notification.sender}{' '}
                </Link>
                {/* ) : null} */}
              </div>
            ) : null}

            {notification.sender_isLogged &&
            notification.notification_type === 'agreement_sent' ? (
              <div>
                {notification.sender_isLogged &&
                notification.notification_type === 'agreement_sent' ? (
                  <Link
                    to={{
                      pathname: `/my-actions/contracts`,
                    }}
                    className='dropdown-item'
                    onClick={() => this.readNotif(notification.notification_id)}
                  >
                    {t('b_sidebar.messaging.ContractSent')}
                    {''}
                    {notification.sender}
                  </Link>
                ) : null}
              </div>
            ) : null}
            {/* {notification.sender_isLogged && notification.notification_type} */}
            {notification.sender_isLogged &&
            notification.notification_type === 'invoice_sent' ? (
              <div>
                <Link
                  to={{
                    pathname: `/invoice-list`,
                  }}
                  className='dropdown-item'
                  onClick={() => this.readNotif(notification.notification_id)}
                >
                  {notification.sender_isLogged &&
                  notification.notification_type === 'invoice_sent'
                    ? `Invoice sent by ${notification.sender} on email`
                    : null}
                </Link>{' '}
              </div>
            ) : null}

            {(notification.sender_isLogged &&
              notification.notification_type === 'agreement_accepted') ||
            notification.notification_type === 'agreement_declined' ||
            notification.notification_type === 'agreement_revision' ? (
              <div>
                {notification.sender_isLogged &&
                notification.notification_type === 'agreement_revision' ? (
                  <Link
                    to={{
                      pathname: `/my-actions/contracts`,
                    }}
                    className='dropdown-item'
                    onClick={() => this.readNotif(notification.notification_id)}
                  >
                    {t('b_sidebar.messaging.contract_revision')}{' '}
                    {notification.sender}{' '}
                    {t('b_sidebar.messaging.contract_for_request')}{' '}
                    {notification.notification_user_id}{' '}
                    {notification.notification_bid_id}
                  </Link>
                ) : notification.sender_isLogged &&
                  notification.notification_type === 'agreement_accepted' ? (
                  <Link
                    className='dropdown-item'
                    onClick={() => this.readNotif(notification.notification_id)}
                  >
                    {t('b_sidebar.messaging.ContractAccepted')}{' '}
                    {notification.notification_message} {notification.sender}
                  </Link>
                ) : notification.sender_isLogged &&
                  notification.notification_type === 'agreement_declined' ? (
                  <Link
                    className='dropdown-item'
                    onClick={() => this.readNotif(notification.notification_id)}
                  >
                    {t('b_sidebar.messaging.ContractDeclined')}{' '}
                    {notification.notification_message} {notification.sender}
                  </Link>
                ) : notification.sender_isLogged &&
                  notification.notification_type !== 'agreement_revision' ? (
                  <Link
                    className='dropdown-item'
                    onClick={() => this.readNotif(notification.notification_id)}
                  >
                    {t('b_sidebar.messaging.ContractAccepted')}{' '}
                    {notification.notification_message} {notification.sender}
                  </Link>
                ) : null}
              </div>
            ) : null}

            {(notification.sender_isLogged &&
              notification.notification_type === 'proposal_accepted') ||
            notification.notification_type === 'proposal_declined' ||
            notification.notification_type === 'proposal_revision' ? (
              <div>
                {notification.sender_isLogged &&
                notification.notification_type === 'proposal_revision' ? (
                  <Link
                    to={{
                      pathname: `/my-actions/offers`,
                    }}
                    className='dropdown-item'
                    onClick={() => this.readNotif(notification.notification_id)}
                  >
                    {t('b_sidebar.messaging.offer_revision')}{' '}
                    {notification.sender}{' '}
                    {t('b_sidebar.messaging.offer_for_request')}{' '}
                    {notification.notification_user_id}
                    {notification.notification_bid_id}
                  </Link>
                ) : notification.sender_isLogged &&
                  notification.notification_type === 'proposal_accepted' ? (
                  <Link
                    to={{
                      pathname: `/my-actions/offers`,
                    }}
                    className='dropdown-item'
                    onClick={() => this.readNotif(notification.notification_id)}
                  >
                    {t('b_sidebar.messaging.offer_accepted')}{' '}
                    {notification.notification_message} {notification.sender}
                  </Link>
                ) : notification.sender_isLogged &&
                  notification.notification_type === 'proposal_declined' ? (
                  <Link
                    to={{
                      pathname: `/my-actions/offers`,
                    }}
                    className='dropdown-item'
                    onClick={() => this.readNotif(notification.notification_id)}
                  >
                    {t('b_sidebar.messaging.offer_declined')}{' '}
                    {notification.notification_message} {notification.sender}
                  </Link>
                ) : notification.sender_isLogged &&
                  notification.notification_type !== 'proposal_revision' ? (
                  <Link
                    to={{
                      pathname: `/my-actions/offers`,
                    }}
                    className='dropdown-item'
                    onClick={() => this.readNotif(notification.notification_id)}
                  >
                    {t('b_sidebar.messaging.offer_accepted')}{' '}
                    {notification.notification_message} {notification.sender}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        ))
      : null;

    const { Login_user_permissions } = this.state;

    const filter_my_business =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter((x) => x === 'my_business')
        : [];
    const filter_marketplace =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter((x) => x === 'marketplace')
        : [];

    return (
      <>
        <header className='header'>
          <div className='logo'>
            <Link
              to={{
                pathname: `/index`,
              }}
            >
              <img
                src={Logo}
                width='150px'
                alt='Proppu logo'
                className='desktop-logo'
              />
              <img src={FavLogo} alt='Proppu logo' className='mobile-logo' />
            </Link>
          </div>
          {/* <div className="menu-toggle">
          <i class="fa fa-bars" aria-hidden="true"></i>
        </div> */}
          <nav className='navbar navbar-expand-md'>
            <button
              className='navbar-toggler'
              type='button'
              data-toggle='collapse'
              data-target='#navbarContent'
              aria-controls='navbarContent'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <span className='icon-down'></span>
            </button>
            {/* <div className='collapse navbar-collapse' id='navbarContent'>
            <ul className='navbar-nav mr-auto'>
              <li
                className={
                  this.props.active === 'Dashboard'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <Link className='nav-link' to='/Dashboard'>
                  {t('header.Dashboard')}
                </Link>
              </li>

              {filter_my_business.length > 0 ? (
                filter_my_business[0] === 'my_business' ? (
                  <li
                    className={
                      this.props.active === 'bussiness'
                        ? 'nav-item active'
                        : 'nav-item'
                    }
                  >
                    <Link className='nav-link' to='/business-dashboard'>
                      {t('header.my_bussiness')}
                    </Link>
                  </li>
                ) : (
                  ''
                )
              ) : (
                ''
              )}

              {filter_marketplace.length > 0 ? (
                filter_marketplace[0] === 'marketplace' ? (
                  <li
                    className={
                      this.props.active === 'market'
                        ? 'nav-item active'
                        : 'nav-item'
                    }
                  >
                    <Link className='nav-link' to='/index'>
                      {t('header.marketplace')}
                    </Link>
                  </li>
                ) : (
                  ''
                )
              ) : (
                ''
              )}
            </ul>
          </div> */}
          </nav>
          <div className='right-buttons'>
            <div className='dropdown'>
              <a
                className='dropdown-toggle no-arrow'
                type='button'
                id='alert-messages'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <i className='icon-bell-o'></i>
                {this.state.unread > 0 ? (
                  <span className='badge badge-danger'>
                    {this.state.unread}
                  </span>
                ) : (
                  ''
                )}
              </a>
              <div
                className='dropdown-menu dropdown-menu-right notification-dropdown'
                aria-labelledby='alert-messages'
                style={{
                  float: 'left',
                  overflowY: 'auto',
                  height: '200px',
                }}
              >
                {notif?.length <= 10 ? notif : notif?.slice(0, 10)}
                <Link
                  className='dropdown-item view-all'
                  to='/my-notif'
                  onClick={() => this.readNotifAll()}
                >
                  <span>{t('header.view_all')}</span>
                </Link>
              </div>
            </div>
            <div className='dropdown'>
              <a
                className='dropdown-toggle'
                id='dropdownMenuButton'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <div className='avatar'>
                  {this.state.info.company_logo ? (
                    <img
                      className='rounded-circle'
                      src={
                        this.state.info.company_logo === null
                          ? img
                          : url +
                            '/images/marketplace/company_logo/' +
                            this.state.info.company_logo
                      }
                      alt='Logo'
                    />
                  ) : (
                    <i className='fa fa-user' aria-hidden='true'></i>
                  )}
                </div>
                <span style={{ marginRight: '10px' }}>
                  {this.state.info.first_name}
                </span>
              </a>
              <div
                className='dropdown-menu dropdown-menu-right'
                aria-labelledby='dropdownMenuButton'
              >
                <Link className='dropdown-item' to='/myaccount'>
                  {t('account.my_account')}
                </Link>
                <Link className='dropdown-item' to='/logout'>
                  {t('account.logout')}
                </Link>
              </div>
            </div>
            {/* <nav
              className='dropdown navbar navbar-expand-md language-nav'
              style={{ display: 'none' }}
            >
              <button
                className={
                  localStorage.getItem('_lng') === 'en'
                    ? 'language-active'
                    : 'language-none'
                }
                onClick={() => {
                  this.changeLanguage('en');
                  this.setState({ show: !this.state.show });
                }}
              >
                <English
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                  }}
                />
                {t('header.EN')}
              </button>
              <button
                className={
                  localStorage.getItem('_lng') === 'fi'
                    ? 'language-active'
                    : 'language-none'
                }
                onClick={() => {
                  this.changeLanguage('fi');
                  this.setState({ show: !this.state.show });
                }}
              >
                <Finland
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                  }}
                />
                {t('header.FI')}
              </button>
              <button
                className={
                  localStorage.getItem('_lng') === 'est'
                    ? 'language-active'
                    : 'language-none'
                }
                onClick={() => {
                  this.changeLanguage('est');
                  this.setState({ show: !this.state.show });
                }}
              >
                <Estonia
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                  }}
                />
                {t('header.EST')}
              </button>
              {this.state.show && (
                <div className='language-dropdown'>
                  <button
                    className={
                      localStorage.getItem('_lng') === 'fi'
                        ? 'language-active'
                        : 'language-inactive'
                    }
                    onClick={() => {
                      this.changeLanguage('fi');
                      this.setState({ show: false });
                    }}
                  >
                    <Finland
                      style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '10px',
                      }}
                    />
                    {t('header.FI')}
                  </button>

                  <button
                    className={
                      localStorage.getItem('_lng') === 'en'
                        ? 'language-active'
                        : 'language-inactive'
                    }
                    onClick={() => {
                      this.changeLanguage('en');
                      this.setState({ show: false });
                    }}
                  >
                    <English
                      style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '10px',
                      }}
                    />
                    {t('header.EN')}
                  </button>
                  <button
                    className={
                      localStorage.getItem('_lng') === 'est'
                        ? 'language-active'
                        : 'language-inactive'
                    }
                    onClick={() => {
                      this.changeLanguage('est');
                      this.setState({ show: false });
                    }}
                  >
                    <Estonia
                      style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '10px',
                      }}
                    />
                    {t('header.EST')}
                  </button>
                </div>
              )}
            </nav> */}
          </div>
        </header>
        {/* {this.state.package === null && this.state.country_id !== 195 ? (
          <Banner>
            <div className='header-banner'>
              {t('header.bannerOne')}{' '}
              <a href='/myaccount/#membership'> {t('header.bannerTwo')}</a>{' '}
              {t('header.bannerThree')}{' '}
            </div>
          </Banner>
        ) : (
          ''
        )} */}
      </>
    );
  }
}

export default withTranslation()(Header);
