import React from 'react';
import './threeDots.css';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ThreeDotsModal = ({
  t,
  id,
  title,
  myProject,
  myContract,
  createdByTeam,
  assignedAsResource,
  handleRatingModal,
  viewRating,
  archive,
  resourceId,
  clientId,
  projectId,
}) => {
  console.log(resourceId, clientId, archive, title);
  return (
    <>
      <div class='dropdown'>
        <a
          class='dropdown-toggle no-arrow'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          <i class='icon-dots-three-vertical'></i>
        </a>
        <div class='dropdown-menu' x-placement='bottom-start'>
          <Link
            class='dropdown-item'
            style={{ display: archive === true ? 'none' : '' }}
            to={{
              pathname: `/tasks-and-planning/${id}/${title}`,
              state: {
                myProject: myProject,
                myContract: myContract,
                createdByTeam: createdByTeam,
                assignedAsResource: assignedAsResource,
              },
            }}
          >
            {t('projectManagment.Manage.planning')}
          </Link>
          <Link
            class='dropdown-item'
            style={{ display: archive === true ? 'none' : '' }}
            to={`/tasks-and-planning/${id}/${title}`}
          >
            {t('projectManagment.Manage.progress')}
          </Link>
          <Link
            class='dropdown-item deleteProject'
            to={{
              pathname: `/summary-project/${id}`,
              state: {
                title: title,
              },
            }}
          >
            {t('projectManagment.Manage.summary')}
          </Link>

          <Link
            class='dropdown-item'
            style={{
              display:
                archive === true ||
                (resourceId === Number(clientId) && assignedAsResource === true)
                  ? 'none'
                  : '',
            }}
            onClick={(e) => {
              handleRatingModal(e);
              viewRating(projectId);
            }}
          >
            {t('projectManagment.Manage.close')}
          </Link>
          <Link
            class='dropdown-item chat_project'
            style={{ display: archive === true ? 'none' : '' }}
            data-id='2'
            to={`/pms/messages/${id}/${title}`}
          >
            {t('projectManagment.Manage.chat')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(ThreeDotsModal);
