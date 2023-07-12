import React, { useState, useEffect, useCallback } from 'react';
import { withTranslation } from 'react-i18next';
import Pagination from '../../pagination/pagination';
import Download from '../../../../images/download.svg';
import { dateFunc } from '../../../../helper/dateFunc/date';
import { url } from '../../../../helper/helper';
import './summaryOffer.css';
import './summaryReport.css';
const SummaryReports = ({ t, documents, report_url, plan }) => {
  const {
    task_attachment_url,
    task_time_audit_url,
    task_time_image_url,
    task_time_report_url,
    task_time_signature_url,
    project_report_images_url,
    projectreport,
    summarytasks,
    tasktime,
  } = plan || {};
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
  const reports =
    documents &&
    documents?.map((x, i) => (
      <tr key={i} style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
            <p className='table-cell-value'> {x?.pr_name}</p>
            <p className='table-cell-value'>
              {' '}
              {windowSize <= 479 ? x.status : ''}
            </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.report.report_name')}
            </p>
            <p className='table-cell-value'>{dateFunc(x.created_at, lang)}</p>
          </div>
        </td>

        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.date')}</p>
            <p className='table-cell-value'>
              <button
                onClick={(e) =>
                  window.open(`${report_url}${x.pr_id}_report.pdf`, '_blank')
                }
                type='button'
                className='btn btn-outline-dark revv-btn'
              >
                <img src={Download} />
              </button>
            </p>
          </div>
        </td>
      </tr>
    ));
  return (
    <div className='card-body'>
      {documents === undefined || !documents ? (
        <div>No data available</div>
      ) : (
        <>
          <h3>{t('projectManagment.Manage.work_report')}</h3>
          <table className='table custom-table-offer'>
            <thead>
              <tr>
                <th>{t('projectManagment.Manage.task_title')}</th>
                <th>{t('projectManagment.Manage.created_at')}</th>
                <th>{t('projectManagment.Manage.download')}</th>
              </tr>
            </thead>
            <tbody>{reports}</tbody>
          </table>
          <div>
            <h3 style={{ marginBottom: '2rem' }}>
              {t('projectManagment.Manage.attachment')}
            </h3>
            <div>
              <h5>{t('projectManagment.Manage.report_attachments')}</h5>
              <div className=' document__summary-report-attachment'>
                {projectreport?.map((report) => {
                  return report?.project_report?.map((repo) => {
                    return (
                      <div>
                        <img
                          src={project_report_images_url + repo?.prd_image}
                          style={{
                            width: '100px',
                            marginRight: '1rem',
                          }}
                        />
                        <div>
                          {repo ? dateFunc(repo?.created_at, lang) : ''}
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
            <div>
              <h5>{t('projectManagment.Manage.task_attachments')}</h5>
              <div className='document__summary-task-attachment'>
                {summarytasks?.map((attach) => {
                  if (attach) {
                    return (
                      attach?.attachment &&
                      JSON.parse(attach?.attachment)?.map((attachment) => {
                        return (
                          <div>
                            <img
                              src={task_attachment_url + attachment}
                              style={{
                                width: '100px',
                                marginRight: '1rem',
                              }}
                            />
                            <div>{dateFunc(attach?.created_at, lang)}</div>
                          </div>
                        );
                      })
                    );
                  }
                })}
              </div>
            </div>
            <div>
              <h5>{t('projectManagment.Manage.checkpoint_attachments')}</h5>
              <div className='document__summary-checkpoint-attachment'>
                {tasktime?.map((time) => (
                  <>
                    <div>
                      <img
                        src={task_time_signature_url + time?.signature}
                        alt=''
                        style={{
                          width: '100px',
                          marginRight: '1rem',
                          display: time?.signature === '' ? 'none' : '',
                        }}
                      />
                      <div>
                        {time?.signature
                          ? dateFunc(time?.created_at, lang)
                          : ''}
                      </div>
                    </div>
                    <div>
                      <img
                        src={task_time_report_url + time?.report}
                        alt=''
                        style={{
                          width: '100px',
                          marginRight: '1rem',
                          display: time?.report === '' ? 'none' : '',
                        }}
                      />
                      <div>
                        {time?.report ? dateFunc(time?.created_at, lang) : ''}
                      </div>
                    </div>
                    <div>
                      <img
                        src={task_time_image_url + time?.image}
                        alt=''
                        style={{
                          width: '100px',
                          marginRight: '1rem',
                          display: time?.image === '' ? 'none' : '',
                        }}
                      />
                      <div>
                        {time?.image ? dateFunc(time?.created_at, lang) : ''}
                      </div>
                    </div>
                    <div>
                      <img
                        src={task_time_audit_url + time?.audits}
                        alt=''
                        style={{
                          width: '100px',
                          marginRight: '1rem',
                          display: time?.audits === '' ? 'none' : '',
                        }}
                      />
                      <div>
                        {time?.audits ? dateFunc(time?.created_at, lang) : ''}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
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

export default withTranslation()(SummaryReports);
