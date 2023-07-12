import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../shared/Breadcrumb';
import Sidebar from '../../../shared/Sidebar';
import './Archiveprojects.css';
import Pagination from '../../../myBussiness/pagination/pagination';
import ThreeDots from '../../modals/ProjectReport/ThreeDots';
import { getData } from '../../../../helper/api';
import { url } from '../../../../helper/helper';
import { dateFunc } from '../../../../helper/dateFunc/date';

const Archiveprojects = ({ t, location }) => {
  const [projects, setProjects] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [windowSize, setWindowSize] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [archiveprojects, setArchiveProjects] = useState(false);

  const current_role = localStorage.getItem('Login_user_role');

  const getProjects = async (page) => {
    const token = localStorage.getItem('token');
    await getData(
      `${url}/api/project/archiveproject
`,

      token
    ).then((result) => {
      setArchiveProjects(true);
      setProjects(orderProjects(result?.data?.projects?.data));
    });
  };

  const orderProjects = (projects) => {
    return projects?.sort(function (a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const handleChange1 = (e) => {
    setPostsPerPage(e.target.value);
  };

  const paginate = (number) => {
    setCurrentPage(number);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentRecords = projects?.slice(indexOfFirstPost, indexOfLastPost);

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
    getProjects();

    handleWindowResize();
  }, []);

  const filterProjects = (records) => {
    return records?.filter((project) =>
      project.key_name.toLowerCase().includes(searchField)
    );
  };
  const filteredProjects = useMemo(() => {
    return filterProjects(currentRecords);
  }, [currentRecords]);

  const reports =
    filteredProjects &&
    filteredProjects?.map((x, i) => (
      <tr key={i} style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
            <p className='table-cell-value'> {x.name}</p>
            <p className='table-cell-value'>
              {' '}
              {windowSize <= 479 ? x.first_name + ' ' + x.last_name : ''}
            </p>
          </div>
        </td>
        <td
          data-label='full-name'
          style={{ display: windowSize <= 479 ? 'none' : '' }}
        >
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.report.report_name')}
            </p>
            <p className='table-cell-value'>
              {windowSize > 479 ? x.first_name + ' ' + x.last_name : ''}{' '}
            </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.date')}</p>
            <p className='table-cell-value'> {dateFunc(x.created_at)}</p>
          </div>
        </td>

        <td data-label='Status: '>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.status')}</p>
            <p className='table-cell-value'>
              {
                <ThreeDots
                  id={x.id}
                  title={x.key_name}
                  archive={archiveprojects}
                />
              }
            </p>
          </div>
        </td>
      </tr>
    ));
  return (
    <div>
      <Breadcrumb>
        <Link
          to='/business-dashboard'
          className='breadcrumb-item active'
          aria-current='page'
        >
          {t('projectManagment.Manage.title')}
        </Link>
        <li className='breadcrumb-item active' aria-current='page'>
          {t('projectManagment.Archive.archive_projects')}
        </li>
      </Breadcrumb>
      <div className='main-content'>
        <Sidebar dataFromParent={window.location.pathname} />
        <div className='page-content'>
          <div className='content-header'>
            <h2 className='page-content-header'>
              {t('projectManagment.Archive.archive_projects')}
            </h2>
          </div>

          <div className='container-fluid'>
            <div className='myProfile-edit'></div>
            <div className='card'>
              <div className='card-body'>
                <input
                  type='text'
                  className='search-box'
                  placeholder={t('projectManagment.Manage.search_project')}
                  onChange={(e) => setSearchField(e.target.value)}
                />
                <table className='table custom-table-project'>
                  <thead>
                    <tr>
                      <th>
                        {windowSize > 479
                          ? t('projectManagment.Archive.name')
                          : t('projectManagment.Archive.title')}
                      </th>
                      <th>{t('projectManagment.Archive.client')}</th>
                      <th>{t('projectManagment.Archive.created')}</th>
                      {/* <th></th> */}
                    </tr>
                  </thead>
                  <tbody>{reports}</tbody>
                </table>
                {projects?.length > 10 ? (
                  <div
                    className='row'
                    style={{ width: '100%', marginLeft: '0px' }}
                  >
                    <div className='col-md-6'>
                      <h3 className='total_rec'> Show once </h3>
                      <select
                        value={postsPerPage}
                        id='dropdown_custom'
                        onChange={handleChange1}
                      >
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
                        totalPosts={projects?.length}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(Archiveprojects);
