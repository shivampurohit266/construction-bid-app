import React, { useState, useEffect, useCallback } from 'react';
import { withTranslation } from 'react-i18next';
import Pagination from '../../pagination/pagination';
import { url } from '../../../../helper/helper';
import Download from '../../../../images/download.svg';
import { dateFunc } from '../../../../helper/dateFunc/date';
import './summaryOffer.css';
const SummaryOffer = ({ t, proposal }) => {
  console.log(proposal);
  const lang = localStorage.getItem('_lng');
  const [windowSize, setWindowSize] = useState(0);
  const handleWindowResize = useCallback((event) => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);
  useEffect(() => {
    handleWindowResize();
  }, []);

  const data = [proposal];

  const reports = data?.map((x, i) => {
    return (
      <tr key={i} style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
            <p className='table-cell-value'> {x?.proposal_names}</p>
            <p className='table-cell-value'>
              {' '}
              {windowSize <= 479
                ? x?.proposal_status === 0
                  ? `${t('myproposal.Draft')}`
                  : x?.proposal_status === 1
                  ? `${t('myproposal.Send1')}`
                  : x?.proposal_status === 2
                  ? `${t('myproposal.Accepted')}`
                  : x?.proposal_status === 3
                  ? `${t('myproposal.Declined')}`
                  : x?.proposal_status === 4
                  ? `${t('myproposal.Revision')}`
                  : x?.proposal_status === 5
                  ? `${t('myproposal.Accepted')}`
                  : null
                : ''}
            </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.report.report_name')}
            </p>
            <p className='table-cell-value'>{dateFunc(x?.created_at, lang)}</p>
          </div>
        </td>

        <td style={{ display: windowSize <= 479 ? 'none' : '' }}>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.status')}</p>
            <p className='table-cell-value'>
              {' '}
              {x?.proposal_status === 0
                ? `${t('myproposal.Draft')}`
                : x?.proposal_status === 1
                ? `${t('myproposal.Send1')}`
                : x?.proposal_status === 2
                ? `${t('myproposal.Accepted')}`
                : x?.proposal_status === 3
                ? `${t('myproposal.Declined')}`
                : x?.proposal_status === 4
                ? `${t('myproposal.Revision')}`
                : x?.proposal_status === 5
                ? `${t('myproposal.Accepted')}`
                : null}
            </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.date')}</p>
            <p className='table-cell-value'>
              <button
                onClick={(e) =>
                  window.open(
                    `${url}/images/marketplace/proposal/pdf/${x.proposal_pdf}`,
                    '_blank'
                  )
                }
                type='button'
                className='btn btn-outline-dark mb-3 pdf-bt d-flex align-items-center'
              >
                <img src={Download} />
              </button>
            </p>
          </div>
        </td>
      </tr>
    );
  });
  return (
    <div className='card-body'>
      {proposal === undefined || !proposal ? (
        <div>No data available</div>
      ) : (
        <>
          <h3> {t('projectManagment.Manage.offer')}</h3>
          <table className='table custom-table-offer'>
            <thead>
              <tr>
                <th> {t('projectManagment.Manage.task_title')}</th>
                <th> {t('projectManagment.Manage.created_at')}</th>
                <th style={{ display: windowSize <= 479 ? 'none' : '' }}>
                  {t('projectManagment.Manage.status')}
                </th>
                <th> {t('projectManagment.Manage.download')}</th>
              </tr>
            </thead>
            <tbody>{reports}</tbody>
          </table>
          {5 > 10 ? (
            <div className='row' style={{ width: '100%', marginLeft: '0px' }}>
              <div className='col-md-6'>
                <h3 className='total_rec'> Show once </h3>
                <select id='dropdown_custom' onChange={''}>
                  <option value='10'>10</option>
                  <option value='20'>20</option>
                  <option value='40'>40</option>
                  <option value='80'>80</option>
                  <option value='100'>100</option>
                </select>
              </div>
              <div className='col-md-6'>
                <Pagination
                // postsPerPage={postsPerPage}
                // totalPosts={dataByTab.length}
                // paginate={paginate}
                // currentPage={currentPage}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </>
      )}
    </div>
  );
};

export default withTranslation()(SummaryOffer);
