import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import Header from '../../shared/Header';
import BussinessSidebar from '../../shared/BussinessSidebar';
import Alert from 'react-bootstrap/Alert';
import { withTranslation } from 'react-i18next';
import { Prompt } from 'react-router';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import Spinner from 'react-bootstrap/Spinner';
import Sidebar from '../../shared/Sidebar';
import { getData, postDataWithToken } from '../../../helper/api';

class Phase extends Component {
  state = {
    area_name: '',
    _area_id: 0,
    _area_work_id: 0,
    area: [],
    area_work: '',
    area_phase: '',
    success: 0,
    errors: [],
    succes: false,
    succes1: false,
    redirect_page: false,
    loading_phase: false,
    loading_Area_Work: false,
  };

  componentDidMount = () => {
    this.myRef = React.createRef();
    this.loadPhaseList();
    if (this.props.match.params.id) {
      this.loadPhaseEdit();
    }
    this.interval = setInterval(() => {
      this.checkallfields();
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleChange = (e) => {
    if (e.target.value == '--Select--' || e.target.value == ' --Valitse-- ') {
      const { name, value } = e.target;
      this.setState({ [name]: '' });
    } else {
      const { name, value } = e.target;
      this.setState({ [name]: value });
    }
    // if (this.state.area_phase != "--Valitse--" || this.state.area_phase != "--Select--") {
    //   data.set("aw_area_id", this.state.area_phase);
    // }
  };

  onConfirmError = () => {
    this.setState({
      server: false,
      validation: false,
      succes: false,
      redirect_page: false,
    });
    this.props.history.push('/phase-list');
  };

  onConfirmError1 = () => {
    this.setState({
      server: false,
      validation: false,
      succes1: false,
      redirect_page: false,
    });
    // this.props.history.push("/phase-list");
  };

  loadPhaseEdit = async () => {
    const token = await localStorage.getItem('token');
    await getData(
      `${url}/api/phase/work_edit/${this.props.match.params.id}`,
      token
    )
      .then((result) => {
        const { area_id, area_identifier, aw_id, aw_identifier } =
          result.data.data[0];

        this.setState({
          area_name: area_identifier,
          _area_id: area_id,
          area_phase: area_id,
          _area_work_id: aw_id,
          area_work: aw_identifier,
        });
      })
      .catch((err) => {
        alert('Error occured please login again');
      });
  };

  loadPhaseList = async () => {
    const token = await localStorage.getItem('token');
    let lang = localStorage.getItem('_lng');
    await getData(`${url}/api/phase/list/${lang}`, token)
      .then((result) => {
        this.setState({ area: result.data.data });
      })
      .catch((err) => {
        alert('Error occured please login again');
      });
  };

  handleAreaSubmit = async (e) => {
    this.setState({
      loading_phase: true,
    });

    e.preventDefault();
    const token = await localStorage.getItem('token');

    const data = new FormData();
    data.set('area_name', this.state.area_name);
    await postDataWithToken(`${url}/api/phase/area`, data, token)
      .then((res) => {
        this.setState({
          success: 1,
          area_name: '',
          loading_phase: false,
          redirect_page: false,
          succes1: ' Your Request have been submit succesfully',
        });
        this.myRef.current.scrollTo(0, 0);
        this.loadPhaseList();
      })
      .catch((err) => {
        Object.entries(err.response.data.error).map((val) =>
          this.setState({ errors: err.response.data.error })
        );
        // Object.entries(err.response.data.error).map((val, i) => {
        //   this.setState({ errors: err.response.data.error });
        // });
        this.setState({ success: 2, loading_phase: false });
        this.myRef.current.scrollTo(0, 0);
      });
    this.setState({
      redirect_page: false,
    });
  };

  handleAreaUpdate = async (e) => {
    e.preventDefault();
    this.setState({
      loading_phase: true,
    });
    const token = await localStorage.getItem('token');

    const params = {
      area_identifier: this.state.area_name,
    };

    axios
      .put(`${url}/api/phase/area_update/${this.state._area_id}`, null, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          success: 1,
          loading_phase: false,
          succes1: 'Your Request have been submit succesfully',
        });
        this.myRef.current.scrollTo(0, 0);
        this.loadPhaseList();
      })
      .catch((err) => {
        Object.entries(err.response.data.error).map((val) =>
          this.setState({ errors: err.response.data.error })
        );
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // });
        this.setState({ success: 2, loading_phase: false });
        this.myRef.current.scrollTo(0, 0);
      });
  };

  handleAreaPhaseSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      loading_Area_Work: true,
    });
    const token = await localStorage.getItem('token');
    const data = new FormData();

    data.set('aw_area_id', this.state.area_phase);
    data.set('aw_identifier', this.state.area_work);
    await postDataWithToken(`${url}/api/phase/work`, data, token)
      .then((res) => {
        this.setState({
          success: 1,
          loading_Area_Work: false,
          area_phase: '',
          area_work: '',
          succes: 'Your Request have been submit succesfully',
        });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        Object.entries(err.response?.data.error).map((val) =>
          this.setState({ errors: err.response.data.error })
        );
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // });
        this.setState({ success: 2, loading_Area_Work: false });
        this.myRef.current.scrollTo(0, 0);
      });
  };

  handleAreaPhaseUpdate = async (e) => {
    e.preventDefault();
    this.setState({
      loading_Area_Work: true,
    });
    const token = await localStorage.getItem('token');

    const params = {
      aw_identifier: this.state.area_work,
    };

    axios
      .put(`${url}/api/phase/work_update/${this.state._area_work_id}`, null, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          success: 1,
          loading_Area_Work: false,
          succes: 'Your Request have been submit succesfully',
        });
        this.myRef.current.scrollTo(0, 0);
        this.loadPhaseList();
      })
      .catch((err) => {
        Object.entries(err.response.data.error).map((val) =>
          this.setState({ errors: err.response.data.error })
        );
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // });
        this.setState({ success: 2, loading_Area_Work: false });
        this.myRef.current.scrollTo(0, 0);
      });
  };

  checkallfields() {
    if (this.state.area_name || this.state.area_phase || this.state.area_work) {
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
    const { t } = this.props;
    let alert;
    if (this.state.success === 1) {
      alert = (
        <Alert variant='success' style={{ fontSize: '13px' }}>
          {this.props.match.params.id
            ? t('success.phase_upd')
            : t('success.phase_ins')}
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

    const { succes, succes1, loading_phase } = this.state;
    return (
      // <React.Fragment>
      //   <Prompt
      //     when={this.state.redirect_page}
      //     message={t("list_details.leave_page")}
      //     cancelText={"Do not Continue"}
      //   />
      <div>
        {/* <Header active={'bussiness'} /> */}
        <div className='sidebar-toggle'></div>
        <nav aria-label='breadcrumb'>
          <ol className='breadcrumb'>
            <Link
              to='/business-dashboard'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('mycustomer.heading')}
            </Link>
            <Link
              to='/phase-list'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('phase.phase')}
            </Link>
            <li className='breadcrumb-item active' aria-current='page'>
              {t('c_material_list.listing.create')}
            </li>
          </ol>
        </nav>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div ref={this.myRef} className='page-content'>
            {alert ? alert : null}

            {succes ? (
              <SweetAlert
                success
                closeOnClickOutside={true}
                title={t('login.SuccessPopup')}
                // title={t("list_details.success1")}
                onConfirm={this.onConfirmError}
              >
                {/* {t("list_details.success")} */}
              </SweetAlert>
            ) : (
              ''
            )}

            {succes1 ? (
              <SweetAlert
                success
                closeOnClickOutside={true}
                title={t('login.SuccessPopup')}
                // title={t("list_details.success2")}
                onConfirm={this.onConfirmError1}
              >
                {/* {t("list_details.success_2")} */}
              </SweetAlert>
            ) : (
              ''
            )}

            <div className='container-fluid'>
              <h3 className='head3'>{t('phase.create_phase')} </h3>
              <div className='card' style={{ maxWidth: '1120px' }}>
                <form
                  onSubmit={
                    this.props.match.params.id
                      ? this.handleAreaUpdate
                      : this.handleAreaSubmit
                  }
                >
                  <div className='card-body'>
                    <div className='mt-3'></div>
                    <div className='row'>
                      <div className='col-xl-4 col-lg-5 col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='area_name'>
                            {t('phase.area_name')}
                          </label>
                          <input
                            id='area_name'
                            name='area_name'
                            value={this.state.area_name}
                            onChange={this.handleChange}
                            className='form-control'
                            type='text'
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className='form-group'>
                        <label className='d-none d-xl-block'>&nbsp;</label>
                        <div className='clear'></div>
                        <button className='btn btn-success'>
                          {' '}
                          {this.state.loading_phase ? (
                            <>
                              {' '}
                              <Spinner animation='border' role='status'>
                                <span className='sr-only'>
                                  {' '}
                                  {t('invoice.Loading')}{' '}
                                </span>
                              </Spinner>
                            </>
                          ) : (
                            ''
                          )}{' '}
                          {t('phase.Create')}{' '}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <h3 className='head3'>{t('phase.create_area_work')}</h3>
              <div className='card' style={{ maxWidth: '1120px' }}>
                <form
                  onSubmit={
                    this.props.match.params.id
                      ? this.handleAreaPhaseUpdate
                      : this.handleAreaPhaseSubmit
                  }
                >
                  <div className='card-body'>
                    <div className='mt-3'></div>
                    <div className='row'>
                      <div className='col-xl-4 col-lg-5 col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='area'>{t('phase.area_name')}</label>
                          <select
                            onChange={this.handleChange}
                            name='area_phase'
                            value={this.state.area_phase}
                            className='form-control'
                            required
                          >
                            <option> {t('phase.Select')} </option>
                            {typeof this.state.area !== 'undefined'
                              ? this.state.area.map(
                                  ({ area_id, area_identifier }, index) => (
                                    <option key={index} value={area_id}>
                                      {area_identifier}
                                    </option>
                                  )
                                )
                              : null}
                          </select>
                        </div>
                      </div>
                      <div className='col-xl-4 col-lg-5 col-md-6 offset-xl-1'>
                        <div className='form-group'>
                          <label htmlFor='area_work'>
                            {t('phase.work_area')}
                          </label>
                          <input
                            id='area_work'
                            name='area_work'
                            value={this.state.area_work}
                            onChange={this.handleChange}
                            className='form-control'
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className='form-group'>
                        <label className='d-none d-xl-block'>&nbsp;</label>
                        <div className='clear'></div>
                        <button className='btn btn-success'>
                          {this.state.loading_Area_Work ? (
                            <>
                              {' '}
                              <Spinner animation='border' role='status'>
                                <span className='sr-only'>
                                  {' '}
                                  {t('invoice.Loading')}{' '}
                                </span>
                              </Spinner>
                            </>
                          ) : (
                            ''
                          )}
                          {t('phase.Create')}
                        </button>
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

export default withTranslation()(Phase);
