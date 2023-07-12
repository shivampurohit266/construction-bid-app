import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../shared/Breadcrumb';
import Sidebar from '../../../shared/Sidebar';
import Tabs from './tab/Tabs';

const CreateProject = ({ t, location }) => {
  return (
    <div>
      {/* <Header active={'bussiness'} /> */}
      <Breadcrumb>
        <Link
          to='/business-dashboard'
          className='breadcrumb-item active'
          aria-current='page'
        >
          {/* {t('projectManagment.Resources.heading')} */}
          {t('projectManagment.Manage.title')}
        </Link>
        <li className='breadcrumb-item active' aria-current='page'>
          {/* {t('projectManagment.Resources.myResource')} */}
          {t('projectManagment.Create.create_project')}
        </li>
      </Breadcrumb>
      <div className='main-content'>
        <Sidebar dataFromParent={window.location.pathname} />
        <div className='page-content'>
          <Tabs />
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(CreateProject);
