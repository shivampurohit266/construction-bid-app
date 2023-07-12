import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Header from '../../../../shared/Header';
import BussinessSidebar from '../../../../shared/BussinessSidebar';
import { url } from '../../../../../helper/helper';

import './ReportData.css';
import Sidebar from '../../../../shared/Sidebar';
import { getData, postDataWithToken } from '../../../../../helper/api';

const ReportData = ({ t, location }) => {
  const [reportData, setReportData] = useState({});

  const { id } = useParams();

  useEffect(() => {
    getData(`${url}/api/project_report/report_data/view_pdf/${id}`).then(
      (res) => console.log(res)
    );
  }, []);

  useEffect(() => {
    getData(`${url}/api/project_report/report_data/${id}`).then((res) =>
      setReportData(res.data.project_report)
    );
  }, []);

  const sendReport = async (e) => {
    e.preventDefault();
    await postDataWithToken(`${url}/api/project_report/report_data/create`, {
      prd_data: '',
      prd_image: '',
    }).then((res) => console.log(res));
  };

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
            {t('b_sidebar.create_report.create')}
          </Link>
        </ol>
      </nav>
      <div className='main-content'>
        <Sidebar dataFromParent={location.pathname} />
        <div className='page-content'>
          <h3 className='report-data-title'>
            {' '}
            {t('b_sidebar.create_report.create')}
          </h3>
          <a
            href={`${url}/pms/project_report/report/view/${id}`}
            className='report-data-view'
          >
            View Report
          </a>

          <form className='report-data' onSubmit={sendReport}>
            <h4>Add Report</h4>

            <p>File</p>
            <div className='report-data-file'>
              <label>
                <input type='file' />
              </label>
            </div>
            <label className='report-data-description'>
              <p>Description</p>
              <textarea placeholder='Description'></textarea>
            </label>
            <button type='submit'>Save</button>
          </form>
          <div className='report-data-image'>
            <img src='' alt='' />
            <p>{reportData && reportData.updated_at}</p>
            <p>
              {reportData && reportData.pr_status === 'active'
                ? 'Work in progress'
                : 'Done'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(ReportData);
