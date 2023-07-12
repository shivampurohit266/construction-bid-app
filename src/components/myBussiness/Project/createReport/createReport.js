import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../../../shared/Header';
import BussinessSidebar from '../../../shared/BussinessSidebar';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import { url, urlPDF } from '../../../../helper/helper';
import { ReactComponent as ThreeDots } from '../../../../images/3-dots-horizontal.svg';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './createReport.css';
import ThreeDotsModal from '../../modals/ProjectReport/ThreeDots';
import Sidebar from '../../../shared/Sidebar';
import { postDataWithToken } from '../../../../helper/api';
import { dateFunc } from '../../../../helper/dateFunc/date';
import SendInvoice from '../../modals/SendInvoice';
import Pagination from '../../pagination/pagination';
import { getData } from '../../../../helper/api';

import EmailModal from '../../modals/EmailModal';
const CreateReport = ({ t, location }) => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [selected, setSelected] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [email, setEmail] = useState('');

  const [id, setId] = useState(0);
  const ref = useRef(null);
  const token = localStorage.getItem('token');
  const lng = localStorage.getItem('_lng');
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (show && ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener('click', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('click', checkIfClickedOutside);
    };
  }, [show]);

  // debounce function for getRecords function
  const debounce = (func, delay) => {
    let inDebounce;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };

  // get records function
  const getRecords = useCallback(
    debounce((search) => {
      postDataWithToken(
        `${url}/api/project_report/list`,
        {
          search: search,
        },
        token
      )
        .then((res) => {
          console.log(res.data.data);
          setRecords(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500),
    []
  );

  const loadDrafts = async () => {
    await postDataWithToken(
      `${url}/api/project_report/draft_listing`,
      null,
      token
    )
      .then((res) => {
        console.log(res);
        setDrafts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getRecords(search);
  }, [search]);

  useEffect(() => {
    getRecords();
    loadDrafts();
  }, []);

  const handleChange1 = (e) => {
    setPostsPerPage(e.target.value);
  };

  const updteVlue = () => {
    setPostsPerPage(10);
  };

  const paginate = (number) => {
    setCurrentPage(number);
  };

  const sendId = (id) => {
    setId(id);
  };

  const sendPDF = async (id) => {
    await postDataWithToken(
      `${url}/images/project_report/pdf/${id}_report.pdf`,
      null,
      token
    )
      .then((result) => {
        window.open(
          `${url}/images/project_report/pdf/${id}_report.pdf`,
          '_blank'
        );
        console.log(result);
        //setEmail(result.data);
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  let proposalsList1 =
    typeof drafts !== 'string'
      ? drafts?.filter((val) => {
          if (search == null) return val;
          else if (val.pr_name.toLowerCase().includes(search.toLowerCase()))
            return val;
        })
      : [];

  const currentPosts1 = proposalsList1?.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
  const length1 = proposalsList1 ? proposalsList1.length : '0';

  const draft_map = currentPosts1?.map((x, i) => (
    <tr key={i} style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}>
      <td>
        <div className='table-cell'>
          <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
          <p className='table-cell-value'># {x.pr_id}</p>
        </div>
      </td>
      <td>
        <div className='table-cell'>
          <p className='table-cell-head'>{t('myBusiness.report.report_name')}</p>
          <p className='table-cell-value'>{x.pr_name} </p>
        </div>
      </td>

      <td>
        <div className='table-cell'>
          <p className='table-cell-head'>{t('myBusiness.report.date')}</p>
          <p className='table-cell-value'> {dateFunc(x.created_at, lng)}</p>
        </div>
      </td>
      <td data-label='Status: '>
        <div className='table-cell'>
          <p className='table-cell-head'>{t('myBusiness.report.status')}</p>
          <p className='table-cell-value'>
            {' '}
            {x.pr_status === 0
              ? `${t('myBusiness.report.draft')}`
              : x.pr_status === 1
              ? `${t('myBusiness.report.save')}`
              : null}
          </p>
        </div>
      </td>

      <td>
        <div className='table-cell'>
          <p className='table-cell-head'>{t('myBusiness.report.action')}</p>
          <p className='table-cell-value'>
            <div
              className='actn-btn'
              // style={{
              //   display: 'flex',
              //   justifyContent: 'space-between',
              // }}
            >
              <button
                onClick={(e) =>
                  window.open(
                    `${url}/images/project_report/pdf/${x.pr_id}_report.pdf`,
                    '_blank'
                  )
                }
                type='button'
                className='btn btn-outline-dark mt-3 pdf-bt'
                style={{ marginRight: '20px' }}
              >
                <i className='fa fa-download fa-2x' aria-hidden='true'></i>{' '}
                &nbsp;&nbsp;
                <i className='fa fa-print fa-2x	' aria-hidden='true'></i>
              </button>
              <button
                className='btn btn-light'
                data-toggle='modal'
                data-target='#email-report'
              >
                {' '}
                <i className='icon-attachment'></i> {t('myBusiness.report.send')}
              </button>

              <Link
                className='create-report'
                to={`/create-report/edit/${x.pr_id}`}
              >
                {t('myBusiness.report.edit')}
              </Link>
            </div>
          </p>
        </div>
      </td>
    </tr>
  ));

  let proposalsList =
    typeof records !== 'string'
      ? records?.filter((val) => {
          if (search == null) return val;
          else if (val.pr_name.toLowerCase().includes(search.toLowerCase()))
            return val;
        })
      : [];

  const currentPosts = proposalsList?.slice(indexOfFirstPost, indexOfLastPost);
  const length = proposalsList ? proposalsList.length : '0';

  const reports = currentPosts?.map((x, i) => (
    <tr key={i} style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}>
      <td>
        <div className='table-cell'>
          <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
          <p className='table-cell-value'># {x.pr_id}</p>
        </div>
      </td>
      <td>
        <div className='table-cell'>
          <p className='table-cell-head'>{t('myBusiness.report.report_name')}</p>
          <p className='table-cell-value'>{x.pr_name} </p>
        </div>
      </td>
      <td>
        <div className='table-cell'>
          <p className='table-cell-head'>{t('myBusiness.report.date')}</p>
          <p className='table-cell-value'> {dateFunc(x.created_at, lng)}</p>
        </div>
      </td>

      <td data-label='Status: '>
        <div className='table-cell'>
          <p className='table-cell-head'>{t('myBusiness.report.status')}</p>
          <p className='table-cell-value'>
            {' '}
            {x.pr_status === 0
              ? `${t('myBusiness.report.draft')}`
              : x.pr_status === 1
              ? `${t('myBusiness.report.save')}`
              : null}
          </p>
        </div>
      </td>

      <td>
        <div className='table-cell'>
          <p className='table-cell-head'>{t('myBusiness.report.action')}</p>
          <p className='table-cell-value'>
            <div
              className='actn-btn'
              // style={{
              //   display: 'flex',
              //   justifyContent: 'space-between',
              // }}
            >
              <button
                onClick={
                  (e) =>
                    window.open(
                      `${url}/images/project_report/pdf/${x.pr_id}_report.pdf`,
                      '_blank'
                    )
                  //() => sendPDF(x.pr_id)
                }
                type='button'
                className='btn btn-outline-dark mt-3 pdf-bt'
                style={{ marginRight: '20px' }}
              >
                <i className='fa fa-download fa-2x' aria-hidden='true'></i>{' '}
                &nbsp;&nbsp;
                <i className='fa fa-print fa-2x	' aria-hidden='true'></i>
              </button>
              <button
                onClick={() => sendId(x.pr_id)}
                className='btn btn-light'
                data-toggle='modal'
                data-target='#email-report'
              >
                {' '}
                <i className='icon-attachment'></i> {t('myBusiness.report.send')}
              </button>

              <Link
                className='create-report'
                to={`/create-report/edit/${x.pr_id}`}
                style={{ marginLeft: '10px' }}
              >
                {t('myBusiness.report.edit')}
              </Link>
            </div>
          </p>
        </div>
      </td>
    </tr>
  ));

  return (
    <>
      {/* <Header /> */}
      <div className='sidebar-toggle'></div>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <Link
            to='/business-dashboard'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {t('myBusiness.report.my_bussiness')}
          </Link>
          <Link
            to='/roles/create'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {t('myBusiness.report.create')}
          </Link>
        </ol>
      </nav>
      <div className='main-content'>
        <Sidebar dataFromParent={location.pathname} />
        <div className='page-content'>
          <Tabs>
            <div className='card' style={{ margin: '0 1.2rem' }}>
              <div className='card custome_tabs_agre'>
                <div className='row'>
                  <div className='col-sm-12 col-md-6'>
                    <TabList>
                      <Tab onClick={(e) => updteVlue()}>
                        {' '}
                        {t('myBusiness.report.reportListings')}{' '}
                      </Tab>
                      <Tab onClick={(e) => updteVlue()}>
                        {' '}
                        {t('myBusiness.report.draft')}{' '}
                      </Tab>
                    </TabList>
                  </div>

                  <div className='col-sm-12 col-md-6'>
                    <div className='filter'>
                      <div className='row align-items-center'>
                        {/* <div className="col-lg-4 col-md-6"> */}
                        <div className='col-sm-6 form-group '>
                          <label htmlFor='name'>
                            {t('myBusiness.report.reportName')}
                          </label>
                          <input
                            id='name'
                            type='search'
                            className='form-control'
                            onChange={(e) => setSearch(e.target.value)}
                            //value={search}
                          />
                        </div>
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <TabPanel>
              <div className='card' style={{ margin: '2rem 1.2rem 0 1.2rem' }}>
                <div className='card-header'>
                  <h2 className='head2'>{t('myBusiness.report.reportListings')}</h2>

                  <div className='btn-group'>
                    <Link
                      className='create-report'
                      to='/create-report/report-details'
                    >
                      {t('myBusiness.report.report')}
                    </Link>
                  </div>
                </div>
                <div className='card-body'>
                  <div className='table-responsive'>
                    <table className='table custom-table'>
                      <thead>
                        <tr>
                          <th>{t('myBusiness.report.id')}</th>
                          <th>{t('myBusiness.report.report_name')}</th>
                          <th>{t('myBusiness.report.date')}</th>
                          <th>{t('myBusiness.report.status')}</th>
                          <th>{t('myBusiness.report.action')}</th>
                        </tr>
                      </thead>
                      <tbody>{reports}</tbody>
                    </table>
                    {length > 10 && proposalsList.length >= 10 ? (
                      <div className='row' style={{ width: '100%' }}>
                        {/* <div className="col-md-4" >
                              <h3 className="total_rec"> Total {length}  </h3>
                            </div> */}
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
                            totalPosts={length}
                            paginate={paginate}
                            currentPage={currentPage}
                          />
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <EmailModal id={id} />
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className='card' style={{ margin: '2rem 1.2rem 0 1.2rem' }}>
                <div className='card-header'>
                  <h2 className='head2'>{t('myBusiness.report.reportListings')}</h2>

                  <div className='btn-group'>
                    <Link
                      className='create-report'
                      to='/create-report/report-details'
                    >
                      {t('myBusiness.report.report')}
                    </Link>
                  </div>
                </div>
                <div className='card-body'>
                  <div className='table-responsive'>
                    <table className='table custom-table'>
                      <thead>
                        <tr>
                          <th>{t('myBusiness.report.id')}</th>
                          <th>{t('myBusiness.report.report_name')}</th>
                          <th>{t('myBusiness.report.date')}</th>
                          <th>{t('myBusiness.report.status')}</th>
                          <th>{t('myBusiness.report.action')}</th>
                        </tr>
                      </thead>
                      <tbody>{draft_map}</tbody>
                    </table>
                    {length1 > 10 && proposalsList.length >= 10 ? (
                      <div className='row' style={{ width: '100%' }}>
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
                            totalPosts={length}
                            paginate={paginate}
                            currentPage={currentPage}
                          />
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <EmailModal />
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(CreateReport);
