import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
import SweetAlert from 'react-bootstrap-sweetalert';
import Spinner from 'react-bootstrap/Spinner';
import $ from 'jquery';
import { postDataWithToken } from '../../../helper/api';

class SendInvoice extends Component {
  state = {
    email: '',
    success: false,
    warning: false,
    modal: '',
    Close: '',
    loading: false,
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    if (this.validate()) {
      this.setState({ loading: true, emailError: '' });
      event.preventDefault();
      const token = await localStorage.getItem('token');
      const data = new FormData();
      data.set('email', this.state.email);
      data.set('invoice', this.props.pdf);
      await postDataWithToken(`${url}/api/invoice/send`, data, token)
        .then((res) => {
          //console.log('res', res);
          if (res) {
            this.setState({
              success: true,
              emailError: '',
              email: '',
              modal: 'modal',
              Close: 'Close',
              loading: false,
            });

            this.props.loadResources();
          }
          // $("#send-invoice").removeClass("show");

          // window.location.reload();
        })
        .catch((err) => {
          this.setState({
            email: '',
            warning: true,
            modal: 'modal',
            emailError: '',
            Close: 'Close',
            loading: false,
          });

          this.props.loadResources();
        });
    }
  };

  validate() {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.email || reg.test(this.state.email) === false) {
      this.setState({ emailError: 'Email Field is Invalid' });
      return false;
    }
    return true;
  }

  onConfirmError = () => {
    this.setState({
      server: false,
      validation: false,
      success: false,
      warning: false,
      redirect_page: false,
    });
    this.remover();
  };
  remover = () => {
    this.setState({
      email: '',
      emailError: '',
    });
  };

  render() {
    // //console.log("this.props.pdf", this.props.loadResources);
    const { t, i18n } = this.props;
    const { success, warning } = this.state;
    return (
      <div>
        {success ? (
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

        {warning ? (
          <SweetAlert
            warning
            closeOnClickOutside={true}
            title={t('list_details.warning1')}
            onConfirm={this.onConfirmError}
          >
            {/* {t("list_details.success")} */}
            Internal Server Error
          </SweetAlert>
        ) : (
          ''
        )}
        <div
          className='modal fade'
          id='send-invoice'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='exampleModalLabel'
          data-backdrop='static'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-lg modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                {/* <h5 className="modal-title" id="exampleModalLabel">
              {t("b_sidebar.agreement.View_message")}  
              </h5> */}
                <button
                  id='close'
                  type='button'
                  className='close'
                  data-dismiss='modal'
                  aria-label='Close'
                  onClick={(e) => this.remover(e)}
                >
                  <span aria-hidden='true'>× </span>
                </button>
              </div>
              <div className='modal-body'>
                <div className='row'>
                  <div className='col-md-11'>
                    <div className='form-group mb-5'>
                      <div className='profile flex'>
                        <div className='content'>
                          <h4> {t('SendInvoice.email_Address')} </h4>
                        </div>
                      </div>
                    </div>
                    <div className='form-group '>
                      <input
                        className='form-control'
                        placeholder='Email'
                        name='email'
                        type='email'
                        onChange={this.handleChange}
                      />
                      {this.state.emailError ? (
                        <p style={{ color: 'red' }}>
                          {' '}
                          {this.state.emailError}{' '}
                        </p>
                      ) : (
                        ''
                      )}
                    </div>

                    <button
                      type='button'
                      onClick={this.handleSubmit}
                      className='btn btn-outline-dark mt-3'
                      disabled={this.state.loading}
                      // data-dismiss={this.state.modal ? this.state.modal : ""}
                      // aria-label={this.state.Close ? this.state.Close : ""}
                    >
                      {this.state.loading ? (
                        <Spinner animation='border' role='status'>
                          <span className='sr-only'>
                            {' '}
                            {t('success.Loading')}{' '}
                          </span>
                        </Spinner>
                      ) : (
                        ''
                      )}{' '}
                      {t('SendInvoice.Save')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(SendInvoice);
