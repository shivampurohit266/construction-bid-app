import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { url } from '../../../helper/helper';
import './permission.css';
import Sidebar from '../../shared/Sidebar';
import { getData, postDataWithToken } from '../../../helper/api';
let perms = [];
const SelectPermission = (props) => {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { id } = useParams();
  const myRef = useRef();

  const getId = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/permission_by_role/${id}`, token)
      .then((res) => {
        const nums = res?.data?.permission_role.map((num) => num);
        const selectedRoles = Array.from(new Set(nums));
        let data2 = res?.data?.permission_list.map((value) => {
          return {
            ...value,
            status: selectedRoles.includes(value.id),
          };
        });
        for (const single of data2) {
          if (single.status === true) {
            perms.push(single.id);
          }
        }

        setData(data2);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheckboxChange = (e) => {
    const check = perms.includes(e);
    if (check === true) {
      const index = perms.indexOf(e);

      if (index > -1) {
        perms.splice(index, 1);
      }
    } else {
      perms.push(e);
    }

    const newState = data.map((obj) => {
      if (obj.id === e) {
        return { ...obj, status: !obj.status };
      }
      return obj;
    });

    setData(newState);
  };

  const smoothScroll = (e, scroll) => {
    if (scroll === 'top') {
      myRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else return;
  };

  const savePerm = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('role_id', id);
    for (const key of Object.keys(perms)) {
      if (perms[key] !== null) {
        formData.append('name[]', perms[key]);
      }
    }
    await postDataWithToken(
      `${url}/api/savepermission_list_api`,
      formData,
      token
    )
      .then((res) => {
        console.log(res);

        if (res.status === 200) {
          setShowAlert(!showAlert);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getId();
  }, []);

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
            {'My Business'}
          </Link>
          <Link
            to='/permission'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {'Permission'}
          </Link>
        </ol>
      </nav>
      <div className='main-content'>
        <Sidebar dataFromParent={props.location.pathname} />
        <div className='page-content'>
          {showAlert ? (
            <div className='permission-success'>
              Permissions Assigned succesfully{' '}
              <button onClick={() => setShowAlert(!showAlert)}>X</button>
            </div>
          ) : (
            ''
          )}

          <h3 className='permission-title' ref={myRef}>
            {props.t('permission.permission')}
          </h3>

          <div className='permission-body'>
            <p className='permission-subtitle'>
              {' '}
              {props.t('permission.permission')}
            </p>
            <div className='permission-table'>
              {data &&
                data?.map((perm) => {
                  const { id, status } = perm;

                  return (
                    <label className='permission-label' key={id}>
                      {perm.name}
                      <input
                        checked={status}
                        type='checkbox'
                        id={id}
                        name={`${id}`}
                        onClick={() => {
                          handleCheckboxChange(id);
                        }}
                      />
                    </label>
                  );
                })}
            </div>
            <button
              className='permission-save-btn'
              onClick={(e) => {
                smoothScroll(e, 'top');
                savePerm();
              }}
              // onClick={(e) => smoothScroll(e, "top")}
            >
              {props.t('permission.save_permission')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(SelectPermission);
