import React, { useState, useEffect } from 'react';
import Header from '../../shared/Header';
import { Link } from 'react-router-dom';
import BussinessSidebar from '../../shared/BussinessSidebar';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import { url } from '../../../helper/helper';
import { getData } from '../../../helper/api';

import './permission.css';
import Breadcrumb from '../../shared/Breadcrumb';
import Sidebar from '../../shared/Sidebar';

const Permission = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    const token = await localStorage.getItem('token');
    const result = await getData(`${url}/api/role_list`, token);

    setData(result.data);
  };

  return (
    <>
      {/* <Header /> */}

      <Breadcrumb>
        <Link
          to='/business-dashboard'
          className='breadcrumb-item active'
          aria-current='page'
        >
          {'My Business'}
        </Link>
        <Link
          to='/permission'
          className='breadcrumb-item active'
          aria-current='page'
        >
          {'Permission'}
        </Link>
      </Breadcrumb>
      <div className='main-content'>
        <Sidebar dataFromParent={props.location.pathname} />
        <div className='page-content'>
          <h3 className='permission-title'>
            {props.t('permission.permission')}
            <Link className='ceva' to='/roles/create'>
              {props.t('b_sidebar.cus.customers1')}
            </Link>
          </h3>

          <div className='roles-card'>
            <div className='role-created'>
              <p>{props.t('account.Role')}</p>
              <p className='created_at'>
                {props.t('b_sidebar.roles.created_at')}
              </p>
            </div>
            <div className='roles-table'>
              {data &&
                data?.map((role) => {
                  console.log(role);
                  return (
                    <div
                      key={role.id}
                      className='roles-row'
                      style={
                        role.id % 2
                          ? {
                              backgroundColor: 'transparent',
                            }
                          : { backgroundColor: 'rgba(0,0,0,.05)' }
                      }
                    >
                      <Link
                        to={`/permission/${role.id}`}
                        className='permission-link'
                      >
                        {' '}
                        <p>{role.display_name}</p>
                      </Link>
                      <p>{role.created_at}</p>
                      {role.default_flag !== '1' ? (
                        <Link
                          className='roles-edit'
                          to='/roles/edit'
                          onClick={() =>
                            localStorage.setItem('RoleID', role.id)
                          }
                        >
                          {props.t('myproposal.Edit')}
                        </Link>
                      ) : (
                        ''
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(Permission);
