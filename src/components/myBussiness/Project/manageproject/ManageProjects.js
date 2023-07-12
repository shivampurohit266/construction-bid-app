import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../shared/Breadcrumb';
import Sidebar from '../../../shared/Sidebar';
import './ManageProjects.css';
import Pagination from '../../../myBussiness/pagination/pagination';
import ThreeDots from '../../modals/ProjectReport/ThreeDots';
import { getData } from '../../../../helper/api';
import { url } from '../../../../helper/helper';
import { dateFunc } from '../../../../helper/dateFunc/date';
import ProjectRatingModal from '../../modals/ProjectRatingModal';
const ManageProjects = ({ t, location }) => {
  const lang = localStorage.getItem('_lng');
  const [myProject, setMyProject] = useState(true);
  const [myContract, setMyContract] = useState(false);
  const [createdByTeam, setCreateByTeam] = useState(false);
  const [assignedAsResource, setAssignedAsResource] = useState(false);
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [byTeam, setByTeam] = useState([]);
  const [asResource, setAsResource] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [windowSize, setWindowSize] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(20);
  const [totalPost, setTotalPost] = useState(0);
  const [isRatingModal, setIsRatingModal] = useState(false);
  const [project_id, setProject_id] = useState(0);
  const [totalPostMyproject, setTotalPostMyproject] = useState(0);
  const [totalPostMycontract, setTotalPostMycontract] = useState(0);
  const [totalPostCreatedbyteam, setTotalPostCreatedbyteam] = useState(0);
  const [totalPostAssigned_as_resources, setTotalPostAssigned_as_resources] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const boolean = [myProject, myContract, createdByTeam, assignedAsResource];
  const current_role = localStorage.getItem('Login_user_role');
  const id = localStorage.getItem('Login_user_id');
  const getProjects = async () => {
    const token = localStorage.getItem('token');
    await getData(
      `${url}/api/project/myproject?page=${currentPage}`,

      token
    ).then((result) => {
      setProjects(orderProjects(result?.data?.projects?.data));
      setTotalPostMyproject(result?.data?.projects?.total);
      if (myProject) {
        setTotalPost(result?.data?.projects?.total);
        setPostsPerPage(result?.data?.projects?.per_page);
      }
    });
  };

  const getContracts = async () => {
    const token = localStorage.getItem('token');
    await getData(
      `${url}/api/project/mycontract?page=${currentPage}`,
      token
    ).then((result) => {
      setContracts(orderProjects(result?.data?.projects?.data));
      setTotalPostMycontract(result?.data?.projects?.total);
      if (myContract) {
        setTotalPost(result?.data?.projects?.total);
        setPostsPerPage(result?.data?.projects?.per_page);
      }
    });
  };

  const handleRatingModal = (e) => {
    e.preventDefault();
    setIsRatingModal(!isRatingModal);
  };

  const viewRating = async (...args) => {
    setProject_id(args[0]);
  };

  const getByTeam = async () => {
    const token = localStorage.getItem('token');
    await getData(
      `${url}/api/project/createdbyteam?page=${currentPage}`,
      token
    ).then((result) => {
      setByTeam(orderProjects(result?.data?.projects?.data));
      setTotalPostCreatedbyteam(result?.data?.projects?.total);
      if (createdByTeam) {
        setTotalPost(result?.data?.projects?.total);
        setPostsPerPage(result?.data?.projects?.per_page);
      }
    });
  };

  const getAsResource = async () => {
    const token = localStorage.getItem('token');
    await getData(
      `${url}/api/project/assigned_as_resources?page=${currentPage}`,
      token
    ).then((result) => {
      setAsResource(orderProjects(result?.data?.projects?.data));
      setTotalPostAssigned_as_resources(result?.data?.projects?.total);
      if (assignedAsResource) {
        setTotalPost(result?.data?.projects?.total);
        setPostsPerPage(result?.data?.projects?.per_page);
      }
    });
  };

  const orderProjects = (projects) => {
    return projects?.sort(function (a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const handleChange1 = (e) => {
    setPostsPerPage(e.target.value);
    setCurrentPage(1);
  };

  const paginate = (number) => {
    setCurrentPage(number);
  };
  const checkState = (array) => {
    return array.find((arr) => arr === true);
  };

  const callAppropriateFunc = (tab) => {
    switch (tab) {
      case myProject === true:
        return projects;
    }
    switch (tab) {
      case myContract === true:
        return contracts;
    }
    switch (tab) {
      case createdByTeam === true:
        return byTeam;
    }
    switch (tab) {
      case assignedAsResource === true:
        return asResource;
    }
  };
  const dataByTab = callAppropriateFunc(checkState(boolean));

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentRecords = dataByTab?.slice(indexOfFirstPost, indexOfLastPost);
  const currentRecords = dataByTab;
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
    if (myProject) {
      getProjects();
    } else if (myContract) {
      getContracts();
    } else if (createdByTeam) {
      getByTeam();
    } else if (assignedAsResource) {
      getAsResource();
    }

    handleWindowResize();
  }, [
    myProject,
    myContract,
    createdByTeam,
    assignedAsResource,
    postsPerPage,
    currentPage,
  ]);

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
            <p className='table-cell-head'>
              {' '}
              {t('projectManagment.Manage.name')}
            </p>
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
              {t('projectManagment.Manage.client')}
            </p>
            <p className='table-cell-value'>
              {windowSize > 479 ? x.first_name + ' ' + x.last_name : ''}{' '}
            </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.date')}</p>
            <p className='table-cell-value'> {dateFunc(x.created_at, lang)}</p>
          </div>
        </td>

        <td data-label='Status: '>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.status')}</p>
            <p className='table-cell-value'>
              {
                <ThreeDots
                  id={x.id}
                  title={x.name}
                  myProject={myProject}
                  resourceId={x.client_id}
                  clientId={id}
                  myContract={myContract}
                  createdByTeam={createdByTeam}
                  assignedAsResource={assignedAsResource}
                  handleRatingModal={handleRatingModal}
                  viewRating={() => viewRating(x.id)}
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
          {t('projectManagment.Manage.manage')}
        </li>
      </Breadcrumb>
      <div className='main-content'>
        <Sidebar dataFromParent={window.location.pathname} />
        <div className='page-content'>
          <div className='content-header'>
            <h2 className='page-content-header'>Projects</h2>
            <div className='btn-group'>
              <Link className='create-project' to='/create-project'>
                {t('projectManagment.Create.create_project')}
              </Link>
            </div>
          </div>

          <div className='container-fluid'>
            <div className='myProjects-headings'>
              <div className='button-projects'>
                {current_role === 'company' ||
                (current_role !== 'resource' && current_role !== 'client') ? (
                  <button
                    onClick={() => {
                      setMyProject(true);
                      setMyContract(false);
                      setCreateByTeam(false);
                      setAssignedAsResource(false);
                      setTotalPost(totalPostMyproject);
                      setPostsPerPage(20);
                      setCurrentPage(1);
                    }}
                    className={myProject ? 'active' : ''}
                  >
                    {t('projectManagment.Manage.my_project')}
                  </button>
                ) : (
                  ''
                )}
              </div>
              <div
                style={{ display: current_role === 'company' ? '' : 'none' }}
                className='button-projects'
              >
                {current_role === 'company' ? (
                  <button
                    onClick={() => {
                      setMyProject(false);
                      setMyContract(true);
                      setCreateByTeam(false);
                      setAssignedAsResource(false);
                      setTotalPost(totalPostMycontract);
                      setPostsPerPage(20);
                      setCurrentPage(1);
                    }}
                    className={myContract ? 'active' : ''}
                  >
                    {t('projectManagment.Manage.my_contract')}
                  </button>
                ) : (
                  ''
                )}
              </div>

              <div
                style={{ display: current_role === 'company' ? '' : 'none' }}
                className='button-projects'
              >
                {current_role === 'company' ? (
                  <button
                    onClick={() => {
                      setMyProject(false);
                      setMyContract(false);
                      setCreateByTeam(true);
                      setAssignedAsResource(false);
                      setTotalPost(totalPostCreatedbyteam);
                      setPostsPerPage(20);
                      setCurrentPage(1);
                    }}
                    className={createdByTeam ? 'active' : ''}
                  >
                    {t('projectManagment.Manage.created_by_team')}
                  </button>
                ) : (
                  ''
                )}
              </div>
              <div className='button-projects'>
                {current_role === 'company' ||
                (current_role !== 'resource' && current_role !== 'client') ? (
                  <button
                    onClick={() => {
                      setMyProject(false);
                      setMyContract(false);
                      setCreateByTeam(false);
                      setAssignedAsResource(true);
                      setTotalPost(totalPostAssigned_as_resources);
                      setPostsPerPage(20);
                      setCurrentPage(1);
                    }}
                    className={assignedAsResource ? 'active' : ''}
                  >
                    {t('projectManagment.Manage.assigned_as_resource')}
                  </button>
                ) : (
                  ''
                )}
              </div>
            </div>
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
                          ? t('projectManagment.Manage.name')
                          : t('projectManagment.Manage.task_title')}
                      </th>
                      <th> {t('projectManagment.Manage.client')}</th>
                      <th> {t('projectManagment.Manage.created_at')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{reports}</tbody>
                </table>
                {totalPost > postsPerPage ? (
                  <div
                    className='row'
                    style={{
                      width: '100%',
                      marginLeft: '0px',
                      justifyContent: 'center',
                    }}
                  >
                    {/* <div className='col-md-6'>
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
                    </div> */}
                    <div className=''>
                      <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={totalPost}
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
      <ProjectRatingModal
        show={isRatingModal}
        handleClose={() => setIsRatingModal(false)}
        projectId={project_id}
      />
    </div>
  );
};

export default withTranslation()(ManageProjects);
