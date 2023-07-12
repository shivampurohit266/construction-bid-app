import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../shared/Header';
import './MyActions.css';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Sidebar from '../../shared/Sidebar';
import axios from 'axios';
import { url } from '../../../helper/helper';
import { ReactComponent as Trash } from '../../../images/trash.svg';
import TenderProposalModal from '../../myBussiness/modals/TenderProposalModal';
import Spinner from 'react-bootstrap/Spinner';
import Agreement from './agreement/Agreement';
import Proposal from './proposal/Proposal';
import Decline from '../listingdetails/Modals/Decline';
import Pagination from '../../myBussiness/pagination/pagination';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import Mybids from '../Mybids';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  postDataWithToken,
  getData,
  modifyDataWithToken,
} from '../../../helper/api';

import { dateFunc } from '../../../helper/dateFunc/date';

const MyActions = ({ t, location }) => {
  const params = useParams();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [offerOrRequest, setOfferOrRequest] = useState('');
  const [matOrWork, setMatOrWork] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [myActionsMyContracts, setMyActionsMyContracts] = useState(true);
  const [proposal, setProposal] = useState(false);
  const [myBids, setMyBids] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [bids, setBids] = useState([]);
  const [proposal_submitted, setProposal_submited] = useState(false);
  const [id, setId] = useState({});
  const [arg, setArg] = useState([]);
  const [lng, setLng] = useState('');
  const [notif, setNotif] = useState([]);
  const [count, setCount] = useState([]);
  const [unread, setUnread] = useState(0);
  const [bidUserId, setbidUserId] = useState(null);

  let source = axios.CancelToken.source();

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWidrawModal, setShowWidrawModal] = useState(false);

  const [postsPerPage, setPostsPerPage] = useState(10);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const listingsLength = contracts ? contracts.length : '';
  const bidsLength = bids ? bids.length : '';
  // pagination for my listing
  const currentRecords = contracts?.slice(indexOfFirstPost, indexOfLastPost);

  //pagination for my bids
  const currentBidRecords = bids?.slice(indexOfFirstPost, indexOfLastPost);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const lng = localStorage.getItem('_lng');
    setLng(lng);
  }, []);

  const getBid = async () => {
    const data = new FormData();

    data.set('tender_type', offerOrRequest);
    data.set('tender_category_type', matOrWork);

    const result = await postDataWithToken(
      `${url}/api/bid/bid-list-new`,
      data,
      token
    );
    if (data !== undefined) {
      setBids(result?.data?.data?.data);
    }
  };
  const getId = (userid, id) => {
    setShowWidrawModal(!showWidrawModal);
    setId({
      u_id: userid,
      ID: id,
    });
  };

  const loadNotif = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/getBidsNotif`, token)
      .then((response) => {
        console.log(response);
        setNotif(
          response.data.data.filter(
            (res) => res.notification_type === 'tender_message'
          )
        );
        setCount(
          response.data.data
            // .filter((res) => res.notification_type === 'tender_message')
            .map((res) => res.notification_bid_id)
        );
      })
      .catch((err) => {
        if (err?.response?.status >= 400 && err?.response?.status <= 499) {
          localStorage.clear();
          console.log(err);
        }
        if (axios.isCancel(err)) {
        }
      });
  };

  // const loadUnreadNotif = async () => {
  //   const token = localStorage.getItem('token');
  //   await getData(`${url}/api/notification/unread`, token)
  //     .then((response) => {
  //       setUnread(response.data.data);
  //     })
  //     .catch((err) => {
  //       if (axios.isCancel(err)) {
  //       }
  //     });
  //   setTimeout(() => {
  //     loadUnreadNotif();
  //   }, 20000);
  // };

  const readNotif = async (arg0, arg1, arg2) => {
    const token = localStorage.getItem('token');
    await getData(
      `${url}/api/notification/read_messages/${arg0}/${arg1}/${arg2}`,

      token
    )
      .then((res) => {
        console.log(res);
        loadNotif();
      })
      .catch(() => {});
  };

  // const loadNotif = () => {
  //   const token = localStorage.getItem('token');
  //   var myHeaders = new Headers();
  //   myHeaders.append('Authorization', `Bearer ${token}`);

  //   var requestOptions = {
  //     method: 'GET',
  //     headers: myHeaders,
  //     redirect: 'follow',
  //   };

  //   fetch(`${url}/api/contracts`, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       if (result.data) {
  //         setMyListings(result.data);

  //         setLoading(false);
  //       } else {
  //       }
  //     })
  //     .catch((error) => {});
  // };
  const handleStatus = async (id, status) => {
    //const token = await localStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${url}/api/contracts/status/${id}/${status}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //loadNotif(source);
        window.location.reload();
        if (status == 3) {
          NotificationManager.success(
            'Proposal Request Status updated success'
          );
        }
        if (status == 4) {
          NotificationManager.success('Cancel Status updated success');
        }
        setProposal_submited({ proposal_submitted: true });
      })
      .catch((error) => {
        //console.log('error', error)
      });
  };

  useEffect(() => {
    sendFilters();
  }, [type, offerOrRequest, matOrWork]);
  console.log(type, offerOrRequest, matOrWork);
  const sendFilters = async () => {
    const data = new FormData();

    data.set('tender_type', offerOrRequest);
    data.set('tender_category_type', matOrWork);

    const response = await postDataWithToken(
      `${url}/api/contracts_new`,
      data,
      token
    );
    try {
      if (response !== 'undefined') {
        setContracts(response?.data.data.data);
        //setPostsPerPage(Number(response?.data.data.per_page));
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filterContracts = () => {
    if (contracts && contracts.length) {
      const filteredListings = contracts.filter(
        (contract) => contract.listing_type === 'Contract Listing'
      );

      //filterListings no duplicate listings
      const filteredListingsNoDuplicate = [];
      filteredListings.forEach((listing) => {
        if (!filteredListingsNoDuplicate.includes(listing)) {
          filteredListingsNoDuplicate.push(listing);
        }
      });

      setMyListings(filteredListingsNoDuplicate);
    }
  };

  const handleChange1 = (e) => {
    setPostsPerPage(e.target.value);
  };
  const paginate = (number) => {
    setCurrentPage(number);
  };

  const viewProposal = async (...args) => {
    setArg(args);
    setIsModalOpen(!isModalOpen);
  };

  const ProposalFunc = () => {
    return <Proposal />;
  };
  const AgreementFunc = () => {
    return <Agreement />;
  };
  useEffect(() => {
    if (params.id === 'listings') {
      filterContracts();
      setMyBids(false);
      setMyActionsMyContracts(true);
      setAgreement(false);
      setProposal(false);
    } else if (params.id === 'bids') {
      setMyBids(true);
      setMyActionsMyContracts(false);
      setAgreement(false);
      setProposal(false);
      getBid();
      loadNotif();
    } else if (params.id === 'offers') {
      setMyBids(false);
      setMyActionsMyContracts(false);
      setAgreement(false);
      setProposal(true);
      ProposalFunc();
    } else if (params.id === 'contracts') {
      setMyBids(false);
      setMyActionsMyContracts(false);
      setAgreement(true);
      setProposal(false);
      AgreementFunc();
    }
  }, [params.id, myActionsMyContracts, myBids, contracts]);
  return (
    <>
      {/* <Header /> */}
      <Breadcrumb>
        <Link
          to='/feeds'
          className='breadcrumb-item active'
          aria-current='page'
        >
          {t('header.marketplace')}
        </Link>
        <li className='breadcrumb-item active' aria-current='page'>
          {t('mybid.myBid')}
        </li>
      </Breadcrumb>
      <div className='main-content'>
        <Sidebar dataFromParent={location.pathname} />
        <div className='page-content'>
          <div className='container-fluid'>
            <div className='myActions-headings'>
              <Link to='/my-actions/listings'>
                <button
                  onClick={() => {
                    setAgreement(false);
                    setProposal(false);
                    setMyActionsMyContracts(true);
                    setMyBids(false);
                  }}
                  className={myActionsMyContracts ? 'active' : ''}
                >
                  {t('mycustomer.My_listings')}
                </button>
              </Link>
              <Link to='/my-actions/bids'>
                <button
                  onClick={() => {
                    setAgreement(false);
                    setProposal(false);
                    setMyActionsMyContracts(false);
                    setMyBids(true);
                  }}
                  className={myBids ? 'active' : ''}
                >
                  {t('my_contracts.My_Bids')}
                </button>
              </Link>
              <Link to='/my-actions/offers'>
                <button
                  onClick={() => {
                    setProposal(true);
                    setAgreement(false);
                    setMyActionsMyContracts(false);
                    setMyBids(false);
                  }}
                  className={proposal ? 'active' : ''}
                >
                  {t('marketplace.feeds.allOffers')}
                </button>
              </Link>
              <Link to='/my-actions/contracts'>
                <button
                  onClick={() => {
                    setAgreement(true);
                    setMyActionsMyContracts(false);
                    setProposal(false);
                    setMyBids(false);
                  }}
                  className={agreement ? 'active' : ''}
                >
                  {t('b_sidebar.agreement.Agreement')}
                </button>
              </Link>
            </div>
            {myActionsMyContracts || myBids ? (
              <>
                <div className='card'>
                  <div className='card-body'>
                    <div className='myActions-search'>
                      <h3 className='head3'>
                        {t('myagreement.searchFilters')}
                      </h3>

                      <div className='row'>
                        <div className='col-lg-4 col-md-1'>
                          <label>{t('myagreement.categoryOne')}</label>

                          <select
                            onChange={(e) => setOfferOrRequest(e.target.value)}
                          >
                            <option value=''>{t('mybid.All')}</option>
                            <option value='Offer'>{t('mybid.Offer')}</option>
                            <option value='Request'>
                              {t('mybid.Request')}
                            </option>
                          </select>
                        </div>
                        <div className='col-lg-4 col-md-1'>
                          <label>{t('myagreement.categoryTwo')}</label>

                          <select
                            onChange={(e) => setMatOrWork(e.target.value)}
                          >
                            <option value=''>{t('mybid.All')}</option>
                            <option value='Material'>
                              {t('mybid.Material')}
                            </option>
                            <option value='Work'>{t('my_bid.Work')}</option>
                          </select>
                        </div>
                        <div
                          className='col-lg-4 col-md-1'
                          style={{ display: 'none' }}
                        >
                          <label>Status</label>
                          <select>
                            <option value=''>All</option>
                            <option value='Posted'>Posted</option>
                            <option value='Evaluation'>Evaluation</option>
                            <option value='Bid accepted'>Bid accepted</option>
                            <option value='Offer received'>
                              Offer received
                            </option>
                            <option value='Offer accepted'>
                              Offer accepted
                            </option>
                            <option value='Contract received'>
                              Contract received
                            </option>
                            <option value='Contract done'>Contract done</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {agreement && <Agreement />}
            {proposal && <Proposal />}
            {myActionsMyContracts || myBids ? (
              <div className='card'>
                <div className='card-body' style={{ overflow: 'auto' }}>
                  {loading === true ? (
                    <Spinner animation='border' role='status'>
                      <span className='sr-only'>Loading...</span>
                    </Spinner>
                  ) : (
                    <table className='table custom-table'>
                      {myActionsMyContracts ? (
                        <thead>
                          <tr>
                            <th>{t('myproposal.name')}</th>
                            <th>{t('myagreement.updated_on')}</th>
                            <th>{t('account.status')}</th>
                            <th width='20%'>{t('myproposal.action')}</th>
                          </tr>
                        </thead>
                      ) : (
                        <thead>
                          <tr>
                            <th>{t('myproposal.name')}</th>
                            <th>{t('myagreement.updated_on')}</th>
                            <th>{t('account.status')}</th>
                            <th>{t('myproposal.action')}</th>
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {currentRecords &&
                          myActionsMyContracts &&
                          currentRecords.map((mat, index) => {
                            return (
                              <tr
                                key={index}
                                className={
                                  mat.tb_status === 2
                                    ? 'each-listing-inactive-2'
                                    : 'each-listing-2'
                                }
                                style={
                                  index % 2
                                    ? { backgroundColor: 'transparent' }
                                    : { backgroundColor: 'rgb(243, 243, 243)' }
                                }
                              >
                                <td
                                  data-label='Title'
                                  className='listing-title'
                                >
                                  <div className='table-cell'>
                                    <p className='table-cell-head'>
                                      {t('myproposal.name')}
                                    </p>
                                    <p className='table-cell-value'>
                                      <Link
                                        to={`/listing-detail/${mat.tender_id}`}
                                      >
                                        {' '}
                                        {mat.tender_title}
                                      </Link>

                                      <p>
                                        {mat.tender_category_type === 'Work'
                                          ? t('marketplace.feeds.Work')
                                          : t(
                                              'marketplace.feeds.Material'
                                            )}{' '}
                                        {mat.tender_type === 'Offer'
                                          ? t('marketplace.feeds.Offer')
                                          : t('marketplace.feeds.Request')}
                                      </p>
                                    </p>
                                  </div>
                                </td>

                                <td
                                  data-label='Date'
                                  style={{
                                    verticalAlign: 'middle',
                                  }}
                                >
                                  <div className='table-cell'>
                                    <p className='table-cell-head'>
                                      {t('myagreement.updated_on')}
                                    </p>
                                    <p className='table-cell-value'>
                                      {dateFunc(mat.created_at, lng)}
                                    </p>
                                  </div>
                                </td>
                                <td
                                  className='each-listing-status'
                                  data-label='Status'
                                  style={{
                                    verticalAlign: 'middle',
                                  }}
                                >
                                  <div className='table-cell'>
                                    <p className='table-cell-head'>
                                      {t('account.status')}
                                    </p>
                                    <p className='table-cell-value'>
                                      {mat.tender_status === 0
                                        ? `${t('myagreement.evaluation')}`
                                        : mat.tender_status === 1
                                        ? `${t('myagreement.evaluation')}`
                                        : mat.tender_status === 2
                                        ? `${t('mybid.Declined')}`
                                        : mat.tender_status === 3
                                        ? `${t('mybid.proposal_send')}`
                                        : mat.tender_status === 4
                                        ? `${t('mybid.Accepted')}`
                                        : mat.tender_status === 6
                                        ? `${t('mybid.Ongoing')}`
                                        : mat.tender_status === 8
                                        ? `${t('mybid.Accepted')}`
                                        : mat.tender_status === 5
                                        ? `${t('my_contracts.Cancel')}`
                                        : null}
                                    </p>
                                  </div>
                                </td>
                                <td
                                  data-label='Action'
                                  style={{
                                    // padding: '10px 15px',
                                    verticalAlign: 'middle',
                                  }}
                                >
                                  <div className='table-cell'>
                                    <p className='table-cell-head'>
                                      {t('myproposal.action')}
                                    </p>
                                    <p className='table-cell-value'>
                                      {mat.tender_type === 'Offer' &&
                                      mat.tender_status <= 1 ? (
                                        <Link
                                          to={`/listing-detail/${mat.tb_tender_id}`}
                                          className='btn btn-gray mt-3'
                                        >
                                          {t('myagreement.review')}
                                        </Link>
                                      ) : mat.tender_type === 'Request' &&
                                        mat.tender_status <= 1 ? (
                                        <Link
                                          to={`/listing-detail/${mat.tb_tender_id}`}
                                          className='btn btn-gray mt-3'
                                        >
                                          {t('myagreement.review')}
                                        </Link>
                                      ) : mat.created_by_type !== 'Employee' ? (
                                        <div
                                          className='col-lg-4'
                                          style={{
                                            maxWidth: '100%',
                                          }}
                                        >
                                          {mat.tender_type !== 'Offer' ? (
                                            <>
                                              {mat.bid_status !== 3 ||
                                              mat.bid_status === 1 ? (
                                                mat.sender_isLogged &&
                                                mat.bid_status !== 2 &&
                                                mat.sender_isLogged &&
                                                mat.tender_status !== 5 &&
                                                mat.sender_isLogged &&
                                                mat.tender_status !== 6 ? (
                                                  <button
                                                    href='#'
                                                    onClick={() =>
                                                      handleStatus(
                                                        mat.notification_bid_id,
                                                        3
                                                      )
                                                    }
                                                    className='btn btn-outline-dark mt-3 mr-5'
                                                  >
                                                    {t(
                                                      'my_contracts.request_proposal'
                                                    )}
                                                  </button>
                                                ) : null
                                              ) : null}
                                            </>
                                          ) : mat.bid_status === 1 ? (
                                            <Link
                                              className='btn btn-primary button_bid custom'
                                              to={{
                                                pathname: `/business-proposal-create/${mat.notification_bid_id}/${mat.notification_user_id}`,
                                              }}
                                            >
                                              {t(
                                                'my_contracts.submit_proposal'
                                              )}
                                            </Link>
                                          ) : (
                                            ''
                                          )}

                                          {mat.tender_status === 5 ||
                                          mat.bid_status === 2 ? null : (
                                            <button
                                              href='#'
                                              onClick={() =>
                                                handleStatus(
                                                  mat.notification_bid_id,
                                                  4
                                                )
                                              }
                                              className='btn btn-gray mt-3'
                                            >
                                              {t('my_contracts.cancel')}
                                            </button>
                                          )}
                                        </div>
                                      ) : (
                                        ''
                                      )}

                                      {/* <button
                                    onClick={() =>
                                      viewProposal(
                                        proposals?.proposal_notif
                                          ?.notification_sender_id,
                                        proposals?.proposal_notif
                                          ?.notification_bid_id,
                                        proposals?.proposal_notif
                                          ?.notification_user_id,
                                        proposals?.proposal_notif
                                          ?.notification_table_name,
                                        proposals?.proposal_notif?.notification_id,
                                        proposals?.proposal_id,
                                        4
                                      )
                                    }
                                    data-toggle='modal'
                                    data-target='#agreement-proposal'
                                    type='button'
                                    className='btn btn-outline-dark revv-btn'
                                    style={{ margin: '1rem' }}
                                  >
                                    {t('myproposal.Revise_notes')}
                                  </button>

                                  <AgreementProposalModal
                                    propsObj={arg}
                                    proposal_id={proposalid}
                                    table={'pro_proposal'}
                                    page_url={location.pathname}
                                    loadAgreements={getProposal}
                                  /> */}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                        {currentBidRecords &&
                          myBids &&
                          currentBidRecords.map((bid, index) => {
                            const found = notif?.find(
                              (notif) =>
                                notif?.notification_sender_id ===
                                bid.tender_user_id
                            );

                            const {
                              notification_sender_id,
                              notification_bid_id,
                              notification_type,
                            } = found || {};

                            return (
                              <tr
                                key={bid.tb_id}
                                className='each-listing-2'
                                style={
                                  (index + 1) % 2
                                    ? {
                                        backgroundColor: 'rgb(243, 243, 243)',
                                      }
                                    : {
                                        backgroundColor: 'transparent',
                                      }
                                }
                              >
                                <td className='title' data-label='Title'>
                                  <div className='table-cell'>
                                    <p className='table-cell-head'>
                                      {t('myproposal.name')}
                                    </p>
                                    <p className='table-cell-value'>
                                      <Link to={`/Biddetails/${bid.tb_id}`}>
                                        {' '}
                                        {bid.tender_title}
                                      </Link>
                                      <p>
                                        {bid.tender_category_type === 'Work'
                                          ? t('marketplace.feeds.Work')
                                          : t(
                                              'marketplace.feeds.Material'
                                            )}{' '}
                                        {bid.tender_type === 'Offer'
                                          ? t('marketplace.feeds.Offer')
                                          : t('marketplace.feeds.Request')}
                                      </p>
                                    </p>
                                  </div>
                                </td>
                                <td
                                  data-label='Date'
                                  style={{ verticalAlign: 'middle' }}
                                >
                                  <div className='table-cell'>
                                    <p className='table-cell-head'>
                                      {t('myagreement.updated_on')}
                                    </p>
                                    <p className='table-cell-value'>
                                      {dateFunc(bid.created_at, lng)}
                                    </p>
                                  </div>
                                </td>

                                <td
                                  className='each-listing-status'
                                  data-label='Status'
                                  style={{ verticalAlign: 'middle' }}
                                >
                                  <div className='table-cell'>
                                    <p className='table-cell-head'>
                                      {t('account.status')}
                                    </p>
                                    <p className='table-cell-value'>
                                      {bid.tb_status === 0
                                        ? `${t('mybid.evaluation')}`
                                        : bid.tb_status === 1 ||
                                          (bid.tb_status === 3 &&
                                            bid.tender_status === 8)
                                        ? `${t('mybid.Accepted')}`
                                        : bid.tb_status === 2
                                        ? `${t('mybid.Declined')}`
                                        : bid.tb_status === 4
                                        ? `${t('mybid.proposal_Cancel')}`
                                        : bid.tb_status === 6
                                        ? `${t('mybid.Ongoing')}`
                                        : bid.tender_status === 8
                                        ? `${t('mybid.Accepted')}`
                                        : bid.tb_status === 3
                                        ? `${t('mybid.Accepted')}`
                                        : null}
                                    </p>
                                  </div>
                                </td>

                                <td
                                  style={{
                                    whiteSpace: 'nowrap',
                                    verticalAlign: 'middle',
                                  }}
                                  data-label='Action'
                                >
                                  <div className='table-cell'>
                                    <p className='table-cell-head'>
                                      {t('myproposal.action')}
                                    </p>
                                    <p className='table-cell-value'>
                                      {bid.tb_status === 3 &&
                                      bid.tb_status !== 6 &&
                                      !bid.sender_isLogged ? (
                                        <Link
                                          className='btn btn-primary button_bid'
                                          to={{
                                            pathname: `/business-proposal-create/${bid.tb_id}/${bid.tender_user_id}`,
                                          }}
                                        >
                                          {t('my_contracts.submit_proposal')}
                                        </Link>
                                      ) : bid.tb_status !== 2 &&
                                        bid.tb_status !== 4 ? (
                                        <>
                                          <a
                                            onClick={() =>
                                              getId(
                                                bid.tb_tender_id,
                                                bid.tb_user_id
                                              )
                                            }
                                            className='btn btn-secondary button_bid'
                                            // data-toggle='modal'
                                            // data-target='#decline'
                                          >
                                            {t('mybid.Withdraw')}
                                          </a>
                                        </>
                                      ) : null}

                                      <button
                                        onClick={() => {
                                          viewProposal(
                                            bid.tb_user_id,
                                            bid.tb_tender_id,
                                            bid.tender_user_id,
                                            bid.tb_user_id,
                                            bid.tender_user_id,
                                            bid.tender_type === 'Offer'
                                              ? t('marketplace.feeds.Offer')
                                              : t('marketplace.feeds.Request')
                                          );
                                          readNotif(
                                            notification_type,
                                            bid.tender_user_id,
                                            bid.tb_tender_id
                                          );
                                        }}
                                        id={bid.tb_user_id}
                                        type='button'
                                        className={
                                          notif?.find(
                                            (notif) =>
                                              notif.notification_user_id ===
                                                bid.tb_user_id &&
                                              notif.notification_bid_id ===
                                                bid.tb_tender_id
                                          )?.notification_sender_id ===
                                          bid.tender_user_id
                                            ? 'btn btn-outline-success revv-btn notification-badges'
                                            : 'btn btn-outline-dark revv-btn'
                                        }
                                        style={{ margin: '1rem' }}
                                      >
                                        {t('myproposal.Revise_notes')}
                                        <li
                                          data-badge={
                                            count.filter(
                                              (x) => x === bid.tender_id
                                            ).length
                                          }
                                        ></li>
                                      </button>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>

                      {/* {myActionsMyContracts && currentRecords.length > 0 ? (
                        <div className='container mt-5'>
                          <Pagination
                            nPages={nPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                          />
                        </div>
                      ) : (
                        ''
                      )}
                      {myBids && currentBidRecords.length > 0 ? (
                        <div className='container mt-5'>
                          <Pagination
                            nPages={nBidPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                          />
                        </div>
                      ) : (
                        ''
                      )} */}
                    </table>
                  )}
                  {myActionsMyContracts && listingsLength > 10 ? (
                    <div
                      className='row'
                      style={{ width: '100%', marginLeft: '0px' }}
                    >
                      <div className='col-md-6'>
                        <h3 className='total_rec'> Show once </h3>
                        <select id='dropdown_custom' onChange={handleChange1}>
                          <option value='10'>10</option>
                          <option value='20'>20</option>
                          <option value='40'>40</option>
                          <option value='80'>80</option>
                          <option value='100'>100</option>
                        </select>
                      </div>
                      <div className='col-md-6'>
                        <Pagination
                          postsPerPage={postsPerPage}
                          totalPosts={listingsLength}
                          paginate={paginate}
                          currentPage={currentPage}
                        />
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  {myBids && bidsLength > 10 ? (
                    <div
                      className='row'
                      style={{ width: '100%', marginLeft: '0px' }}
                    >
                      <div className='col-md-6'>
                        <h3 className='total_rec'> Show once </h3>
                        <select id='dropdown_custom' onChange={handleChange1}>
                          <option value='10'>10</option>
                          <option value='20'>20</option>
                          <option value='40'>40</option>
                          <option value='80'>80</option>
                          <option value='100'>100</option>
                        </select>
                      </div>
                      <div className='col-md-6'>
                        <Pagination
                          postsPerPage={postsPerPage}
                          totalPosts={bidsLength}
                          paginate={paginate}
                          currentPage={currentPage}
                        />
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <TenderProposalModal
        propsObj={arg}
        proposal_id={arg[1]}
        show={isModalOpen}
        handleClose={() => {
          setIsModalOpen(false);
        }}
        loadTenders={getBid}
        id={arg[2]}
      />
      <Decline
        userId={id.ID}
        show={showWidrawModal}
        handleClose={() => setShowWidrawModal(false)}
        id={id.u_id}
      />
    </>
  );
};

export default withTranslation()(MyActions);
