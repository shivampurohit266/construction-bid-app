import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../../shared/Sidebar';
import Breadcrumb from '../../../shared/Breadcrumb';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DetailTaskPanel from '../detailTaskPanel/DetailTaskPanel';
import Backdrop from '../detailTaskPanel/backdrop';
import BackdropTask from '../detailTaskPanel/backdropTask';
import { useParams } from 'react-router-dom';
import './TasksAndPlanning.css';
import { url } from '../../../../helper/helper';
import Pagination from '../../../myBussiness/pagination/pagination';
import QuickTaskPanel from '../detailTaskPanel/QuickTaskPanel';
import { getData, postDataWithToken } from '../../../../helper/api';
import TasksAndPlanningModal from './TasksAndPlanningModal';
import ReleaseModal from './ReleaseModal';
const TasksAndPlanning = ({ t, location, state }) => {
  console.log(location, state);
  const params = useParams();
  const [searchField, setSearchField] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [taskId, setTaskId] = useState(null);
  const [resource, setResource] = useState([]);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [sideDrawerOpenTask, setSideDrawerOpenTask] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalRelease, setIsOpenModalRelease] = useState(false);
  const [resourceId, setResourceId] = useState(0);
  const [type, setType] = useState('Work');
  const userId = localStorage.getItem('Login_user_id');
  const drawerToggle = (e) => {
    setTaskId(e);
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const backDropClickHandler = () => {
    setSideDrawerOpen(false);
  };
  const drawerToggleTask = () => {
    setSideDrawerOpen(!sideDrawerOpen);
    taskListing();
  };
  const backDropClickHnadlerTask = () => {
    setSideDrawerOpenTask(false);
  };

  const calcWidth = (value, estimation) => {
    console.log(value, estimation);
    const width = Math.round((value * 100) / estimation);

    return !isNaN(width) ? width : 0;
  };
  const getWidthPx = (value, estimation) => {
    const px = Math.round((calcWidth(value, estimation) * 75) / 100);
    return px;
  };

  const orderTasks = (tasks) => {
    return tasks?.sort(function (a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const logHours = (obj, id) => {
    return Object.keys(obj).map(function (key, index) {
      if (Number(key) === id) {
        return obj[key];
      }
    });
  };

  const taskListing = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/project/task_listing/${params.id}`, token).then(
      (result) => {
        const resource = result?.data?.resources?.map((res) => res.first_name);
        const resourceId = result?.data?.resources?.map(
          (res) => res.ur_user_id
        );
        setResource(result?.data?.resources);
        let data = result?.data?.project_task?.map((value) => {
          return {
            ...value,
            resource: resource,
            loggedHrs: logHours(result?.data?.project_task_hours, value.id),
          };
        });
        setResourceId(resourceId);
        setTaskList(orderTasks(data));
      }
    );
  };

  useEffect(() => {
    taskListing();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentRecords = taskList?.slice(indexOfFirstPost, indexOfLastPost);
  const filterTasks = (records) => {
    return records?.filter((task) =>
      task.task_name.toLowerCase().includes(searchField)
    );
  };
  const filteredTasks = useMemo(() => {
    return filterTasks(currentRecords);
  }, [currentRecords]);

  const paginate = (number) => {
    setCurrentPage(number);
  };

  const handleChange1 = (e) => {
    setPostsPerPage(e.target.value);
  };

  const tasks =
    filteredTasks &&
    filteredTasks?.map((x, i) => (
      <tr
        key={i}
        style={{
          background: i % 2 === 0 ? '#f3f3f3' : 'white',
        }}
        onClick={() => drawerToggle(x.id)}
      >
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
            <p className='table-cell-value'>{x.task_name}</p>
          </div>
        </td>

        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.report.date')}</p>
            <p
              className='table-cell-value'
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <div className='table-name'>{x.resource[0]?.substring(0, 1)}</div>{' '}
              {/* <div className='table-progress'> */}
              {/* <div
                className='progress-length'
                style={{
                  width: `${calcWidth(x.right)}px`,
                }}
              >
                <p className='progress-value'> {`${x.right}%`}</p>
              </div> */}
              <div className='show-container'>
                <div class='progress-task'>
                  <div className='progress-value-task'>{`${calcWidth(
                    x.loggedHrs?.filter((hrs) => hrs),
                    x.duration
                  )}%`}</div>
                  <div class='rounded-task'>
                    <div
                      class='progress-bar-task'
                      style={{
                        width: `${getWidthPx(
                          x.loggedHrs?.filter((hrs) => hrs),
                          x.duration
                        )}px`,
                      }}
                      aria-valuenow='0'
                      aria-valuemin='0'
                      aria-valuemax='100'
                    ></div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </p>
          </div>
        </td>
      </tr>
    ));
  let backdrop;
  if (sideDrawerOpen) {
    backdrop = <Backdrop close={backDropClickHandler} />;
  }
  // let backdropTwo;
  // if (sideDrawerOpenTask) {
  //   backdropTwo = <BackdropTask close={backDropClickHnadlerTask} />;
  // }

  return (
    <div>
      <Breadcrumb>
        <Link
          to='/business-dashboard'
          className='breadcrumb-item active'
          aria-current='page'
        >
          Project
        </Link>
        <li className='breadcrumb-item active' aria-current='page'>
          {params.title}
        </li>
      </Breadcrumb>
      <div className='main-content'>
        <Sidebar dataFromParent={window.location.pathname} />
        <DetailTaskPanel
          show={sideDrawerOpen}
          params={params}
          taskId={taskId}
          resource={resource}
          backdrop={backdrop}
          drawerToggleTask={drawerToggleTask}
        />
        {/* <QuickTaskPanel show={sideDrawerOpenTask} /> */}
        {backdrop}
        {/* {backdropTwo} */}
        <div className='page-content'>
          <div className='content-header-task'>
            <div>
              <h2 className='page-content-header'>{params.title}</h2>
              {(resourceId[0] === Number(userId) &&
                location?.state?.assignedAsResource === true) ||
              location?.state?.myProject === true ? (
                <button
                  className='btn-add-plan'
                  onClick={() => {
                    setIsOpenModal(true);
                  }}
                >
                  {t('projectManagment.Manage.add_plan')}
                </button>
              ) : (
                ''
              )}
            </div>

            <div className='btn-group'>
              <div className='task-input-box'>
                <input
                  type='text'
                  className='search-box-task'
                  placeholder={t('projectManagment.Manage.search_task')}
                  onChange={(e) => setSearchField(e.target.value)}
                />
              </div>
              <div className='btn-create-project'>
                <Link className='create-project-task' to='/create-project'>
                  {t('projectManagment.Create.create_project')}
                </Link>
              </div>
            </div>
          </div>

          <div className='container-fluid'>
            <div className='card'>
              <div className='card-body'>
                <h3> {t('projectManagment.Manage.task_list')}</h3>
                <table className='table tasks-and-planning'>
                  <tbody>{tasks}</tbody>
                </table>
                {(resourceId[0] === Number(userId) &&
                  location?.state?.myContract === true) ||
                (resourceId[0] === Number(userId) &&
                  location?.state?.createByTeam === true) ||
                (resourceId[0] === Number(userId) &&
                  location?.state?.assignedAsResource === true) ||
                location?.state?.myProject === true ? (
                  <div className='new-task-link'>
                    <button onClick={drawerToggle} className='btn-new-task'>
                      &#43; {t('projectManagment.Manage.create_new_task')}
                    </button>
                  </div>
                ) : (
                  ''
                )}
                <button
                  className='btn btn-primary p-1'
                  onClick={() => {
                    setIsOpenModalRelease(true);
                  }}
                >
                  Release Project
                </button>

                {taskList?.length > 10 ? (
                  <div
                    className='row'
                    style={{ width: '100%', marginLeft: '0px' }}
                  >
                    {/* <div className="col-md-6">
                      <h3 className="total_rec"> Show once </h3>
                      <select id="dropdown_custom" onChange={handleChange1}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="80">80</option>
                        <option value="100">100</option>
                      </select>
                    </div> */}
                    <div className='col-md-6'>
                      <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={taskList?.length}
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
          <TasksAndPlanningModal
            show={isOpenModal}
            handleClose={() => {
              setIsOpenModal(false);
              taskListing();
            }}
            onType={type}
          />
          <ReleaseModal
            show={isOpenModalRelease}
            handleClose={() => {
              setIsOpenModalRelease(false);
            }}
            resources={resource}
            projectId={params.id}
          />
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(TasksAndPlanning);
