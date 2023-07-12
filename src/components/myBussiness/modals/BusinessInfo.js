import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
// import { Translation } from "react-i18next";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { withTranslation } from 'react-i18next';
import img from '../../../images/DefaultImg.png';
// import $ from 'jquery';
import Files from 'react-files';

class BusinessInfo extends Component {
  state = {
    logo: '',
    logo_preview: null,
    first_name: '',
    last_name: '',
    company_id: '',
    company_website: '',
    address: '',
    email: '',
    phone: '',
    zip: '',
    lang: localStorage.getItem('_lng'),
    info: [],
    success: Boolean,
    errors: [],
    first_name_err: false,
    last_name_err: false,
    address_err: false,
    email_err: false,
    phone_err: false,
    zip_err: false,
    img_id: false,
    lang_err: false,
    company_id_err: false,
    company_website_err: false,
    country_id: '',
    country_code: '',
  };

  componentDidMount = () => {
    // /business-agreement-create
    // if (this.props.match.url !== "/business-agreement-create") {
    this.loadData();
    this.myRefTerms = React.createRef();
    this.selectCountry(this.state.country_id);
    // }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.country_id !== this.state.country_id) {
      this.selectCountry(this.state.country_id);
    }
  }
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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

  loadData = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${url}/api/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (
      data[0].company_logo !== 'null' ||
      data[0].company_logo !== 'undefined'
    ) {
      this.setState({
        img_id: true,
      });
    }
    this.setState({
      info: data[0],
      logo_preview:
        data[0].company_logo === 'null' || data[0].company_logo === undefined
          ? ''
          : data[0].company_logo,
      first_name:
        data[0].first_name === 'null' || data[0].first_name === 'undefined'
          ? ''
          : data[0].first_name,
      last_name:
        data[0].last_name === 'null' || data[0].last_name == 'undefined'
          ? ''
          : data[0].last_name,
      company_id: data[0].company_id
        ? data[0].company_id
        : '_' + Math.random().toString(36).substr(2, 9),
      address:
        data[0].address === 'null' || data[0].address === 'undefined'
          ? ''
          : data[0].address,
      email:
        data[0].email === 'null' || data[0].email === 'undefined'
          ? ''
          : data[0].email,
      phone: data[0].phone,
      country_id: data[0].address_country,
      zip:
        data[0].zip === 'null' || data[0].zip === 'undefined'
          ? ''
          : data[0].zip,

      company_website:
        data[0].company_website === 'null' ||
        data[0].company_website == 'undefined'
          ? ''
          : data.company_website,
    });
    // //console.log(" data.company_website ",  data.company_website )
    this.props.onInfo(this.state.info);
  };

  onFilesChange = (files) => {
    this.setState({ logo: null, img_id: false });
    if (files[0]) {
      this.setState({
        logo: files[0],
        logo_preview: URL.createObjectURL(files[0]),
        // img_id: true
      });
      if (this.state.loaded <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError = (error, file) => {
    //console.log(file, 'error code ' + error.code + ': ' + error.message)
  };

  // handleChange1 = (event) => {
  //   this.setState({ logo: null, img_id: false });
  //   if (
  //     event.target.files[0]?.name.split(".").pop() === "jpeg" ||
  //     event.target.files[0]?.name.split(".").pop() === "png" ||
  //     event.target.files[0]?.name.split(".").pop() === "jpg" ||
  //     event.target.files[0]?.name.split(".").pop() === "gif" ||
  //     event.target.files[0]?.name.split(".").pop() === "svg"
  //   ) {
  //     this.setState({
  //       logo: event.target.files[0],
  //       logo_preview: URL.createObjectURL(event.target.files[0]),
  //     });
  //   } else {
  //     this.setState({ logo: null, img_id: true });
  //     alert("File type not supported");
  //   }
  // };

  handleSubmit = async (event) => {
    event.preventDefault();
    if (this.state.first_name === '') {
      return this.setState({ first_name_err: true });
    } else {
      this.setState({ first_name_err: false });
    }
    if (this.state.last_name === '') {
      return this.setState({ last_name_err: true });
    } else {
      this.setState({ last_name_err: false });
    }
    if (this.state.address === '') {
      return this.setState({ address_err: true });
    } else {
      this.setState({ address_err: false });
    }
    if (this.state.email === '') {
      return this.setState({ email_err: true });
    } else {
      this.setState({ email_err: false });
    }
    if (this.state.phone === '') {
      return this.setState({ phone_err: true });
    } else {
      this.setState({ phone_err: false });
    }
    if (this.state.zip === '') {
      return this.setState({ zip_err: true });
    } else {
      this.setState({ zip_err: false });
    }
    if (this.state.company_id === '') {
      return this.setState({ company_id_err: true });
    } else {
      this.setState({ company_id_err: false });
    }
    if (this.state.lang === '') {
      return this.setState({ lang_err: true });
    } else {
      this.setState({ lang_err: false });
    }
    if (this.state.company_website === '') {
      return this.setState({ company_website_err: true });
    } else {
      this.setState({ company_website_err: false });
    }
    const data = new FormData();
    // if (this.state.logo == null ) {
    data.set('company_logo', this.state.logo);
    // }

    data.set('first_name', this.state.first_name);
    data.set('last_name', this.state.last_name);
    data.set('address', this.state.address);
    data.set('email', this.state.email);
    data.set('phone', this.state.phone);
    data.set('zip', this.state.zip);
    data.set('company_id', this.state.company_id);
    data.set('company_website', this.state.company_website);
    data.set('lang', this.state.lang);
    // data.set("password", this.state.password);
    // data.set("old_password", this.state.old_password);

    const token = await localStorage.getItem('token');
    axios
      .post(`${url}/api/storeDetails`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        // alert("Updated");
        window.location.reload();
      })
      .catch((err) => {
        window.location.reload();
      });
  };

  remove_log = () => {
    this.setState({
      logo_preview: '',
    });
  };

  render() {
    // //console.log("this.state.logo_preview", this.state.logo_preview);
    const { t } = this.props;
    return (
      <div>
        <div
          className='modal fade'
          id='edit-info'
          data-backdrop='static'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='editInfoModalLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-lg modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='editInfoModalLabel'>
                  {t('businessinfo.Edit_Business')}
                </h5>
                <button
                  onClick={this.loadData}
                  type='button'
                  className='close'
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <form onSubmit={this.handleSubmit}>
                  <div className='form-group' style={{ width: '30%' }}>
                    <div className='file-select file-sel inline'>
                      {/* <input
                        onChange={this.handleChange1}
                        type="file"
                        id="attachment1"
                      /> */}
                      <Files
                        className='files-dropzone'
                        onChange={(e) => this.onFilesChange(e)}
                        onError={(e) => this.onFilesError(e)}
                        accepts={[
                          'image/gif',
                          'image/jpeg',
                          'image/png',
                          'image/jpg',
                          '.svg',
                        ]}
                        multiple={false}
                        // maxFileSize={3145757}
                        minFileSize={10}
                        clickable
                      >
                        {/* <div className="selected-img" style={{ display: "none" }}>
                        <img src={this.state.logo_preview} alt="" />
                        <span> {t("businessinfo.remove")} </span>
                      </div> */}
                        <label htmlFor='attachment1'>
                          <img
                            src={
                              this.state.logo_preview === null ||
                              this.state.logo_preview == ''
                                ? img
                                : this.state.img_id &&
                                  this.state.logo_preview !== ''
                                ? url +
                                  '/images/marketplace/company_logo/' +
                                  this.state.logo_preview
                                : this.state.logo_preview
                                ? this.state.logo_preview
                                : 'wertyuio'
                            }
                            alt=''
                          />
                          <span className='status'>
                            {' '}
                            {t('businessinfo.company_logo')}{' '}
                          </span>
                        </label>
                      </Files>
                      {this.state.logo_preview !== null &&
                      this.state.logo_preview !== '' ? (
                        <span
                          className='selected-img danger_log'
                          onClick={this.remove_log}
                        >
                          {' '}
                          {t('businessinfo.remove')}{' '}
                        </span>
                      ) : (
                        ''
                      )}
                      {/* <span className="danger_log" onClick={this.remove_log}> {t("businessinfo.remove")} </span> */}
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label htmlFor='f-name'>
                          {' '}
                          {t('businessinfo.First_Name')}{' '}
                        </label>
                        <input
                          id='f-name'
                          onChange={this.handleChange}
                          name='first_name'
                          className='form-control'
                          type='text'
                          required
                          value={this.state.first_name}
                        />
                        <p style={{ color: '#eb516d ' }}>
                          {this.state.first_name_err === true
                            ? 'First name is required'
                            : null}
                        </p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label htmlFor='l-name'>
                          {' '}
                          {t('businessinfo.Last_Name')}{' '}
                        </label>
                        <input
                          id='l-name'
                          onChange={this.handleChange}
                          name='last_name'
                          className='form-control'
                          type='text'
                          required
                          value={this.state.last_name}
                        />
                        <p style={{ color: '#eb516d ' }}>
                          {this.state.last_name_err === true
                            ? 'Last name is required'
                            : null}
                        </p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label htmlFor='address'>
                          {' '}
                          {t('businessinfo.Address')}{' '}
                        </label>
                        <input
                          id='address'
                          onChange={this.handleChange}
                          name='address'
                          className='form-control'
                          type='text'
                          required
                          value={this.state.address ?? ''}
                        />
                        <p style={{ color: '#eb516d ' }}>
                          {this.state.address_err === true
                            ? 'Address is required'
                            : null}
                        </p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label htmlFor='zip'>{t('businessinfo.Zip')}</label>
                        <input
                          id='zip'
                          onChange={this.handleChange}
                          name='zip'
                          className='form-control'
                          type='text'
                          required
                          value={this.state.zip ?? ''}
                        />
                        <p style={{ color: '#eb516d ' }}>
                          {this.state.zip_err === true
                            ? 'Zip code is required'
                            : null}
                        </p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      {/* <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                          id="phone"
                          onChange={this.handleChange}
                          name="phone"
                          className="form-control"
                          type="text"
                          value={this.state.phone}
                        />
                      </div> */}

                      <label htmlFor='phone' className='phone_no'>
                        {' '}
                        {t('businessinfo.Phone')}{' '}
                      </label>
                      <PhoneInput
                        country={this.state.country_code}
                        enableAreaCodes={true}
                        countryCodeEditable={false}
                        onChange={(phone) => this.setState({ phone })}
                        value={this.state.phone}
                      />
                      <p style={{ color: '#eb516d ' }}>
                        {this.state.phone_err === true
                          ? 'Phone number is required'
                          : null}
                      </p>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label htmlFor='email'>
                          {' '}
                          {t('businessinfo.Email')}{' '}
                        </label>
                        <div className='form-control lab'>
                          <div className='disabled_fields'>
                            {this.state.email}
                          </div>
                        </div>
                        {/* <input
                          id="email"
                          onChange={this.handleChange}
                          name="email"
                          className="form-control"
                          type="email"
                          value={this.state.email}
                          disabled="disabled"
                        /> */}
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="company_id"> {t("businessinfo.Customer_ID")} </label>
                        <div className="form-control lab">
                          <div className="disabled_fields">{this.state.company_id}</div>
                        </div>
                         
                      </div>
                    </div> */}

                    <div className='col-md-12'>
                      <div className='form-group'>
                        <label htmlFor='company_website'>
                          {' '}
                          {t('businessinfo.Customer_Website')}{' '}
                        </label>
                        <input
                          name='company_website'
                          onChange={this.handleChange}
                          id='company_website'
                          value={this.state.company_website ?? ''}
                          className='form-control'
                          type='url'
                          required
                        />
                        <p style={{ color: '#eb516d ' }}>
                          {this.state.company_website_err === true
                            ? 'Company website is required'
                            : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button type='submit' className='btn btn-primary mt-3'>
                    {t('businessinfo.Submit')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(BusinessInfo);
