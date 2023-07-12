import React, { useState, useEffect, useCallback, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { dateFunc } from '../../../../helper/dateFunc/date';
import './summaryProjectProgress.css';

const AccordionItem = ({ isExpanded, time, id, plan, getAssignee }) => {
  const lang = localStorage.getItem('_lng');
  return (
    <>
      {time?.map((info) => {
        return (
          <>
            {info?.time?.map((time, i) => {
              if (time?.project_task_id === id) {
                const {
                  description,
                  created_at,
                  hours,
                  signature,
                  report,
                  image,
                  audits,
                } = time || {};
                const {
                  task_time_signature_url,
                  task_time_report_url,
                  task_time_image_url,
                  task_time_audit_url,
                  task_attachment_url,
                } = plan || {};
                return (
                  <div className='accord-box' style={{ width: '100%' }}>
                    <div className='accord-heading'>
                      <div className='accord__container'></div>
                    </div>
                    {isExpanded ? (
                      <div
                        className='task-hours-details'
                        style={{
                          background: i % 2 === 0 ? '#f3f3f3' : 'white',
                        }}
                      >
                        <div>Task name: {info?.task_name}</div>
                        <div>Task created: {dateFunc(created_at, lang)}</div>
                        <div>
                          Assignee: {getAssignee(Number(info?.assignee_to))}
                        </div>
                        <div>Comment: {description}</div>
                        <div>Logged hours: {hours}</div>
                        <div>
                          <img
                            src={task_time_signature_url + signature}
                            alt=''
                            style={{
                              width: '100px',
                              marginRight: '1rem',
                              display: !signature ? 'none' : '',
                            }}
                          />
                          <img
                            src={task_time_report_url + report}
                            alt=''
                            style={{
                              width: '100px',
                              marginRight: '1rem',
                              display: !report ? 'none' : '',
                            }}
                          />
                          <img
                            src={task_time_image_url + image}
                            alt=''
                            style={{
                              width: '100px',
                              marginRight: '1rem',
                              display: !image ? 'none' : '',
                            }}
                          />
                          <img
                            src={task_time_audit_url + audits}
                            alt=''
                            style={{
                              width: '100px',
                              display: !audits ? 'none' : '',
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          {info?.attachment &&
                            JSON.parse(info?.attachment).map((attach) => (
                              <div>
                                <img
                                  src={task_attachment_url + attach}
                                  alt=''
                                  style={{
                                    width: '100px',
                                    marginRight: '1rem',
                                  }}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              }
            })}
          </>
        );
      })}
    </>
  );
};

const SummaryProjectProgress = ({ t, location, progress, plan }) => {
  const [time, setTime] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [windowSize, setWindowSize] = useState(0);
  const [estimation, setEstimation] = useState(
    () => progress && progress?.map((duration) => duration.duration)
  );

  const [loggedHrs, setLoggedHrs] = useState(() =>
    progress?.map((duration) => duration.time)
  );

  const concatLoggedHrs = (array) => {
    console.log(array);
    if (array) {
      return array?.map((nested) => {
        return nested?.map(function (element) {
          return time.push(element);
        });
      });
    }
  };

  const timLogged = Array.from(new Set(time));
  const totalLogged = (duration) => {
    console.log(duration);
    return duration?.reduce((total, amount) => {
      return total + amount;
    }, 0);
  };

  const totalEstimation = (duration) => {
    if (duration) {
      return duration?.reduce((total, amount) => {
        return total + amount;
      }, 0);
    }
  };

  const openHrs = (a, b) => {
    return a - b;
  };
  const getAssignee = (assignee) => {
    return plan?.user?.resources?.map((resource) => {
      if (resource.ur_id === assignee) {
        return resource.first_name + ' ' + resource.last_name;
      }
    });
  };
  const getReporter = (reporter) => {
    return plan?.user?.resources?.map((resource) => {
      if (resource.ur_resource_id === reporter) {
        return resource.first_name + ' ' + resource.last_name;
      }
    });
  };

  const calcWidth = (value, estimation) => {
    const width = Math.round((value * 100) / estimation);

    return !isNaN(width) ? width : 0;
  };
  const getWidthPx = (value, estimation) => {
    const px = Math.round((calcWidth(value, estimation) * 75) / 100);
    return px;
  };

  const getHours = (hours) => {
    return hours?.map((time) => {
      return time.hours;
    });
  };

  const totalLoggedHrs = (hours) => {
    return getHours(hours)?.reduce((total, amount) => {
      return total + amount;
    }, 0);
  };

  // let length = [];
  // let items = loggedHrs?.map((hrs) => {
  //   length.push(hrs.length);
  // });

  // const arrayLength = (length) => {
  //   return length?.reduce((total, amount) => {
  //     return total + amount;
  //   }, 0);
  // };

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
    concatLoggedHrs(loggedHrs);
  }, []);

  const ref = useRef(null);

  const handleClick = () => {
    if (isExpanded !== true) {
      return ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tasks =
    progress &&
    progress?.map((x, i) => (
      <>
        <tr
          key={i}
          style={{
            background: i % 2 === 0 ? '#f3f3f3' : 'white',
            cursor: 'pointer',
          }}
          onClick={() => {
            setIsExpanded(!isExpanded);
            handleClick();
            setTaskId(x.id);
          }}
        >
          <td>
            <div className='table-cell'>
              <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
              <p className='table-cell-value'>{x.task_name}</p>
              <p className='table-cell-value'>
                {windowSize <= 650 ? 'Assignee: ' : ''}
                {windowSize <= 650 ? getAssignee(Number(x?.assignee_to)) : ''}
              </p>
            </div>
          </td>
          <td style={{ display: windowSize <= 650 ? 'none' : '' }}>
            <div className='table-cell'>
              <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
              <p className='table-cell-value'>
                {getAssignee(Number(x.assignee_to))}
              </p>
            </div>
          </td>
          <td style={{ display: windowSize <= 650 ? 'none' : '' }}>
            <div className='table-cell'>
              <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
              <p className='table-cell-value'>{getReporter(x?.report_to)}</p>
            </div>
          </td>
          <td>
            <div className='table-cell'>
              <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
              <p className='table-cell-value'>{x?.duration} hrs</p>
              <p
                className='table-cell-value'
                style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  lineHeight: '13px',
                  letterSpacing: '0em',
                  textAlign: 'left',
                }}
              >
                {windowSize <= 650 ? 'Reporter: ' : ''}{' '}
                {windowSize <= 650 ? getReporter(x?.report_to) : ''}
              </p>
            </div>
          </td>
          <td>
            <div className='table-cell'>
              <p className='table-cell-head'>{t('myBusiness.report.id')}</p>
              <p className='table-cell-value'>{totalLoggedHrs(x?.time)} hrs</p>
            </div>
          </td>
          <td>
            <div className='table-cell'>
              <p className='table-cell-head'>{t('myBusiness.report.date')}</p>
              <p className='table-cell-value'>
                {windowSize <= 650 ? (
                  `${calcWidth(totalLoggedHrs(x.time), x.duration)}%`
                ) : (
                  <div className='show-container'>
                    <div class='progress-task'>
                      <div className='progress-value-task'>
                        {`${calcWidth(totalLoggedHrs(x.time), x.duration)}%`}
                      </div>
                      <div class='rounded-task'>
                        <div
                          class='progress-bar-task'
                          style={{
                            width: `${getWidthPx(
                              totalLoggedHrs(x.time),
                              x.duration
                            )}px`,
                          }}
                          aria-valuenow='0'
                          aria-valuemin='0'
                          aria-valuemax='100'
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </p>
              <p>
                {' '}
                {windowSize <= 650
                  ? taskId === x.id && isExpanded
                    ? '-'
                    : '+'
                  : ''}
              </p>
            </div>
          </td>
          <td style={{ display: windowSize <= 650 ? 'none' : '' }}>
            {taskId === x.id && isExpanded ? '-' : '+'}
          </td>
        </tr>
      </>
    ));

  return (
    <div className='card-body'>
      {progress === undefined || !progress ? (
        <div>No data available</div>
      ) : (
        <>
          <h2 className='body-title'>
            {' '}
            {t('projectManagment.Manage.progress_list')}
          </h2>
          <section className='progress-hrs'>
            <div className='calc-hrs'>
              <div className='title'>
                {' '}
                {t('projectManagment.Manage.total_worked_hours')}
              </div>
              <div className='subtitle'>
                {totalLogged(timLogged.map((time) => time.hours))} hrs
              </div>
            </div>
            <div className='calc-hrs'>
              <div className='title'>
                {t('projectManagment.Manage.open_work_hours')}
              </div>
              <div className='subtitle'>
                {openHrs(
                  totalEstimation(estimation),
                  totalLogged(timLogged.map((time) => time.hours))
                )}{' '}
                hrs
              </div>
            </div>
            <div className='calc-hrs'>
              <div className='title'>
                {t('projectManagment.Manage.totel_original_estimation')}
              </div>
              <div className='subtitle'>{totalEstimation(estimation)} hrs</div>
            </div>
          </section>

          <section>
            <h3>{t('projectManagment.Manage.task_list')}</h3>
            <table className='table custom-table-project-progress'>
              <thead>
                <tr>
                  <th>{t('projectManagment.Create.task_name')}</th>
                  <th style={{ display: windowSize <= 650 ? 'none' : '' }}>
                    {t('projectManagment.Manage.assignee')}
                  </th>
                  <th style={{ display: windowSize <= 650 ? 'none' : '' }}>
                    {t('projectManagment.Manage.reporter')}
                  </th>
                  <th>{t('projectManagment.Manage.estimation')}</th>
                  <th>{t('projectManagment.Manage.log')}</th>
                  <th>{t('projectManagment.Manage.progress_list')}</th>
                </tr>
              </thead>
              <tbody>{tasks}</tbody>
            </table>
            <div ref={ref}>
              <AccordionItem
                isExpanded={isExpanded}
                time={progress}
                id={taskId}
                plan={plan}
                getAssignee={getAssignee}
              />
            </div>
          </section>
          {/* <section>
        <div className='work-material-container-progress'>
          <div className='work-list-progress'>
            <div className='work-title'>Work List</div>
            <div className='work-listings'>
              <div className='item'>Asbestikartoitus</div>
              <div className='item'> Purkutyöt/demolition</div>
              <div className='item'> Kosteusmittaus</div>
              <div className='item'> Jätteen kierrätys ja kuljetus</div>
              <div className='item'> Lattialämmitysasennus</div>
              <div className='item'> Vedeneristys asennus</div>
              <div className='item'>Paksuusmittaus</div>
            </div>
          </div>
        </div>
      </section> */}
        </>
      )}
    </div>
  );
};

export default withTranslation()(SummaryProjectProgress);
