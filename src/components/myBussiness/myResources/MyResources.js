import React, { Component } from 'react';
import axios from 'axios';
import Header from '../../shared/Header';
import BussinessSidebar from '../../shared/BussinessSidebar';
import { Helper, url } from '../../../helper/helper';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Prompt } from 'react-router';
import SweetAlert from 'react-bootstrap-sweetalert';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import startsWith from 'lodash.startswith';
// import 'react-phone-number-input/style.css'
// import PhoneInput from 'react-phone-number-input'
import Breadcrumb from '../../shared/Breadcrumb';
import Sidebar from '../../shared/Sidebar';
import { getData } from '../../../helper/api';
class MyResources extends Component {
  state = {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    company: '',
    type: '',
    permission: 0,
    type_1: '',
    role: '',
    role_list: [],
    success: 0,
    loading: false,
    errors: null,
    email_unq: null,
    permissions: [],
    succes: false,
    loading_page: false,
    permission_id: '',
    redirect_page: false,
    phone_err: '',
    _user_type: localStorage.getItem('Login_user_role'),
  };

  componentDidMount = async (params) => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();
    this.loadAcc();
    this.myRef = React.createRef();
    this.loadData(this.axiosCancelSource);
    this.get_roles();
    this.loadPermission(this.axiosCancelSource);
    this.interval = setInterval(() => {
      this.checkallfields();
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
    this._isMounted = false;
    this.axiosCancelSource.cancel();
  }

  loadAcc = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/account`, token).then((result) => {
      if (result.data[0]) {
        const acc = result.data[0];
        this.setState({
          country_id: acc.address_country,
        });
      }
    });
  };

  selectCountry = (id) => {
    if (id === 72) {
      this.setState({
        country_code: 'fi',
      });
    } else if (id === 67) {
      this.setState({
        country_code: 'ee',
      });
    } else if (id === 195) {
      this.setState({
        country_code: 'es',
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.country_id !== this.state.country_id) {
      this.selectCountry(this.state.country_id);
    }
  }

  loadPermission = async (axiosCancelSource) => {
    const token = await localStorage.getItem('token');
    axios
      .get(`${url}/api/resourcePermission`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((response) => {
        //console.log("=======", response)
        if (this._isMounted) {
          this.setState({
            permissions: response.data.data,
          });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  get_roles = () => {
    // https://pro.flipkotipro.fi/flipkoti/public/api/roles

    const token = localStorage.getItem('token');
    axios
      .get(`${url}/api/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        //console.log("response---------------------" , response);
        this.setState({
          role_list: response.data,
        });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  loadData = async (axiosCancelSource) => {
    if (this.props.match.params.id) {
      const token = await localStorage.getItem('token');
      axios
        .get(`${url}/api/resource/${this.props.match.params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cancelToken: axiosCancelSource.token,
        })
        .then((response) => {
          //console.log("response" , response.data);

          //console.log("response" , response.data.role);
          if (this._isMounted) {
            const {
              first_name,
              last_name,
              phone,
              email,
              company,
              ur_resource_type,
              role,
              permission_id,
            } = response.data.data;
            this.setState({
              first_name: first_name,
              last_name: last_name,
              email: email,
              company: company,
              role: response.data.role,
              type: ur_resource_type,
              phone,
              permission: permission_id,
            });
          }
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            //console.log("Request canceled", err.message);
          } else {
            //console.log(err.response);
          }
        });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    data.set('first_name', this.state.first_name);
    data.set('last_name', this.state.last_name);
    data.set('phone', this.state.phone);
    data.set('email', this.state.email);
    data.set('company', this.state.company);
    data.set('type', this.state.type);
    data.set('role', this.state.role);

    // data.set("type_1", this.state.type_1);
    data.set('permission', '2');
    axios
      .post(`${url}/api/resources`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        //console.log("========", res);
        if (res.data.error_same_mail) {
          this.setState({
            email_unq: res.data.error_same_mail,
            loading: false,
          });
        } else {
          this.setState({
            success: 1,
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            company: '',
            type: '',
            phone_err: '',
            permission: '',
            loading: false,
            succes: 'Your Request have been submit succesfully',
            redirect_page: false,
          });
          this.myRef.current.scrollTo(0, 0);
        }
        // this.props.history.push("/resource-list");
      })
      .catch((err) => {
        this.setState({ loading: false });
        //console.log("err.response.status" , err.response.data.error.phone[0]);
        if (err.response.status === 401) {
          if (err.response.data.error.phone) {
            this.setState({
              phone_err: err.response.data.error.phone[0],
            });
          }
        }
        if (err.response.status === 406) {
          if (err.response.data.error.email) {
            this.setState({
              email_unq: err.response.data.error.email[0],
            });
          }
        }
        if (err.response.status === 406) {
          if (err.response.data.error.email) {
            this.setState({
              email_unq: err.response.data.error.email[0],
            });
          }
        }
        if (err.response.status === 500) {
          this.setState({ errors: 'Some Issue Occured' });
        }
        // this.setState({ success: 2 });
        this.myRef.current.scrollTo(0, 0);
      });
  };

  handleUpdate = async (event) => {
    event.preventDefault();
    this.setState({
      loading_page: true,
    });
    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const params = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      phone: this.state.phone,
      email: this.state.email,
      company: this.state.company,
      type: this.state.type,
      permission_id: this.state.permission,
    };

    axios
      .put(`${url}/api/resource/update/${this.props.match.params.id}`, null, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({
          first_name: '',
          loading: false,
          last_name: '',
          email: '',
          company: '',
          phone: '',
          succes: 'Your Request have been submit succesfully',
          redirect_page: false,
        });
        this.myRef.current.scrollTo(0, 0);
        // this.props.history.push("/resource-list");
      })
      .catch((err) => {
        if (err.response.status === 406) {
          if (err.response.data.error.email) {
            this.setState({
              email_unq: err.response.data.error.email[0],
            });
          }
        }
        this.setState({ loading: false });
      });
  };

  handleChange = (event) => {
    if (event.target.value !== '--Select--') {
      const { name, value } = event.target;
      this.setState({ [name]: value });
    }

    if (event.target.value === 'permission') {
      let confirmAction = window.confirm(
        'Are you sure you want to leave this page?'
      );
      if (confirmAction) {
        this.props.history.push('/permission');
      } else return;
    }
  };

  onConfirmError = () => {
    this.setState({
      server: false,
      validation: false,
      succes: false,
      redirect_page: false,
      state: '',
    });
    this.props.history.push('/resource-list');
  };

  checkallfields() {
    if (
      this.state.first_name ||
      this.state.last_name ||
      this.state.email ||
      this.state.company ||
      this.state.phone
    ) {
      this.setState({
        redirect_page: true,
      });
    } else {
      this.setState({
        redirect_page: false,
      });
    }
  }

  render() {
    const { t, i18n } = this.props;

    let alert, loading;
    if (this.state.loading === true) {
      loading = (
        <Spinner animation='border' role='status'>
          <span className='sr-only'> {t('projectManagment.Resources.Loading')} </span>
        </Spinner>
      );
    }
    if (this.state.success === 1) {
      alert = (
        <Alert variant='success' style={{ fontSize: '13px' }}>
          {this.props.match.params.id
            ? t('projectManagment.Resources.res_upd')
            : t('projectManagment.Resources.res_ins')}
        </Alert>
      );
    } else if (this.state.success === 2) {
      alert = (
        <Alert variant='danger' style={{ fontSize: '13px' }}>
          {Object.entries(this.state.errors).map(([key, value]) => {
            const stringData = value.reduce((result, item) => {
              return `${item} `;
            }, '');
            return stringData;
          })}
        </Alert>
      );
    }

    const { succes, phone_err } = this.state;
    //console.log(this.props.match.params.id   );
    const Login_user_role = localStorage.getItem('Login_user_role')
      ? localStorage.getItem('Login_user_role')
      : '';
    return (
      // <React.Fragment>
      //   <Prompt
      //     when={this.state.redirect_page}
      //     message={t("list_details.leave_page")}
      //   />
      <div>
        {/* <Header active={'bussiness'} /> */}
        <Breadcrumb>
          <Link
            to='/business-dashboard'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {t('projectManagment.Resources.heading')}
          </Link>
          <li className='breadcrumb-item active' aria-current='page'>
            {t('projectManagment.Resources.myResource')}
          </li>
        </Breadcrumb>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div ref={this.myRef} className='page-content'>
            {alert ? alert : null}

            {succes ? (
              <SweetAlert
                success
                closeOnClickOutside={true}
                title={t('projectManagment.Resources.SuccessPopup')}
                // title={t("list_details.success1")}
                onConfirm={this.onConfirmError}
              >
                {/* {t("list_details.success")} */}
              </SweetAlert>
            ) : (
              ''
            )}

            <div className='container-fluid'>
              <h3 className='head3' style={{ paddingBottom: '1%' }}>
                {t('projectManagment.Resources.create_resources')}
              </h3>

              <div className='card' style={{ maxWidth: '1120px' }}>
                <form
                  onSubmit={
                    this.props.match.params.id
                      ? this.handleUpdate
                      : this.handleSubmit
                  }
                >
                  <div className='card-body'>
                    <div className='mt-3'></div>
                    <div className='row'>
                      <div className='col-xl-4 col-lg-5 col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='first_name'>
                            {t('projectManagment.Resources.first_name')}
                          </label>
                          <input
                            id='first_name'
                            name='first_name'
                            onChange={this.handleChange}
                            className='form-control'
                            type='text'
                            autocomplete='off'
                            required
                            value={this.state.first_name}
                            autoFocus={true}
                          />
                        </div>
                      </div>
                      <div className='col-xl-4 col-lg-5 col-md-6 offset-xl-1'>
                        <div className='form-group'>
                          <label htmlFor='last_name'>
                            {t('projectManagment.Resources.last_name')}
                          </label>
                          <input
                            id='last_name'
                            name='last_name'
                            onChange={this.handleChange}
                            className='form-control'
                            type='text'
                            autocomplete='off'
                            required
                            value={this.state.last_name}
                          />
                        </div>
                      </div>
                      <div className='col-xl-4 col-lg-5 col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='email'>{t('projectManagment.Resources.email')}</label>
                          <input
                            id='email'
                            name='email'
                            onChange={this.handleChange}
                            className='form-control'
                            type='email'
                            required
                            value={this.state.email}
                            readOnly={this.props.match.params.id}
                          />
                          <p style={{ color: '#eb516d ', fontSize: '15px' }}>
                            {this.state.email_unq
                              ? t('projectManagment.Resources.email_unq')
                              : null}
                          </p>
                        </div>
                      </div>

                      {/* {Login_user_role === "company" ?
                        <> */}
                      <div className='col-xl-4 col-lg-5 col-md-6 offset-xl-1'>
                        <div className='form-group'>
                          <label htmlFor='type'>{t('projectManagment.Resources.Type')}</label>

                          <select
                            value={this.state.type}
                            name='type'
                            onChange={this.handleChange}
                            type='text'
                            id='type'
                            className='form-control'
                            readOnly={this.props.match.params.id}
                            disabled={this.props.match.params.id}
                            required
                          >
                            <option value='' hidden>
                              {' '}
                              {t('projectManagment.Resources.Select')}{' '}
                            </option>
                            {this.state._user_type === 'company' ? (
                              <option value='Employee'>
                                {' '}
                                {t('projectManagment.Resources.Employee')}{' '}
                              </option>
                            ) : (
                              ''
                            )}
                            <option value='Resource'>
                              {' '}
                              {t('projectManagment.Resources.Resource')}{' '}
                            </option>
                          </select>
                        </div>
                      </div>
                      {/* </>
                        : ""}
  */}
                      {/* <div className="col-xl-4 col-lg-5 col-md-6">
                          <div className="form-group">
                            <label htmlFor="type">{t("projectManagment.Resources.type")}</label>
                            <select
                              onChange={this.handleChange}
                              name="type"
                              id="type"
                              required
                              className="form-control"
                              value={this.state.type}
                            >
                              <option value="Sub Contractor"> {t("projectManagment.Resources.Sub_Contractor")}  </option>
                              <option value="Supplier">  {t("projectManagment.Resources.Supplier")}  </option>
                            </select>
                          </div>
                        </div> */}

                      <div className='col-xl-4 col-lg-5 col-md-6 '>
                        <div
                          className='form-group'
                          style={{ marginBottom: '0px' }}
                        >
                          <label htmlFor='company'>{t('projectManagment.Resources.phone')}</label>
                        </div>
                        <PhoneInput
                          country={this.state.country_code}
                          inputProps={{
                            name: 'phone',
                            // required: true,
                            // autoFocus: true
                          }}
                          enableAreaCodes={true}
                          defaultErrorMessage
                          // disableCountryCode={true}
                          countryCodeEditable={false}
                          enableSearch={true}
                          onChange={(phone) => this.setState({ phone })}
                          value={this.state.phone}
                        />

                        {phone_err ? (
                          <p style={{ color: 'red', fontSize: '15px' }}>
                            {' '}
                            {phone_err}{' '}
                          </p>
                        ) : (
                          ''
                        )}
                      </div>

                      {this.state.type === 'Resource' ? (
                        <div className='col-xl-4 col-lg-5 col-md-6 offset-xl-1'>
                          <div className='form-group'>
                            <label htmlFor='company'>
                              {t('projectManagment.Resources.company')}
                            </label>
                            <input
                              id='company'
                              name='company'
                              onChange={this.handleChange}
                              className='form-control'
                              type='text'
                              required
                              value={this.state.company}
                            />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}

                      {/* <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                            <div className="form-group">
                              <label htmlFor="type">
                                Type  
                              </label>
                              
                              <select
                                value={this.state.type }
                                name="type"
                                onChange={this.handleChange}
                                type="text"
                                id="type"
                                className="form-control" >
                                <option value="" hidden> --Select-- </option>
                                <option value="Employee"> Employee </option>
                                <option value="Resource"> Resource </option>

                              </select>
                            </div>
                          </div> */}

                      {this.state.type === 'Employee' ? (
                        <div className='col-xl-4 col-lg-5 col-md-6 offset-xl-1'>
                          <div className='form-group'>
                            <label htmlFor='role'>{t('projectManagment.Resources.Role')}</label>
                            <select
                              value={this.state.role}
                              onChange={this.handleChange}
                              name='role'
                              required
                              id='role'
                              className='form-control'
                              disabled={this.props.match.params.id}
                            >
                              <option value='' hidden>
                                {' '}
                                {t('projectManagment.Resources.Select')}{' '}
                              </option>
                              {this.state.role_list?.length > 0
                                ? this.state.role_list.map((list) => (
                                    <option value={list.id}>
                                      {list.display_name}
                                    </option>
                                  ))
                                : ''}
                              // <Link to='/permission'>Add new</Link>
                              <option
                                value='permission'
                                style={{ color: '#0790c9' }}
                              >
                                {t('projectManagment.Resources.customers1')}
                              </option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                      {Login_user_role === 'consumer' ? (
                        <input
                          className='form-control'
                          name='role'
                          id='role'
                          type='text'
                          required
                          readOnly
                          value={this.state.role}
                          onChange={this.handleChange}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    <p style={{ color: '#eb516d ' }}>
                      {this.state.errors ? this.state.errors : null}
                    </p>
                    <div>
                      <div className='form-group'>
                        <label className='d-none d-xl-block'>&nbsp;</label>
                        <div className='clear'></div>
                        {/* {loading ? (
                            loading
                          ) : ( */}
                        <button className='btn btn-success'>
                          {loading ? loading : ''}{' '}
                          {this.props.match.params.id
                            ? `${t('projectManagment.Resources.Update')}`
                            : `${t('projectManagment.Resources.Create')}`}
                        </button>
                        {/* )} */}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      // </React.Fragment>
    );
  }
}

export default withTranslation()(MyResources);
