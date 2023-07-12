import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
// import $ from "jquery";
import moment from 'moment';
import Spinner from 'react-bootstrap/Spinner';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class AgreementProposalModal extends Component {
  state = {
    message: '',
    messages: [],
    last_status: 0,
    message_err: false,
    sucess_msg: false,
    loading: false,
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // componentWillUnmount() {
  //   this.axiosCancelSource.cancel();
  // }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const token = await localStorage.getItem('token');

    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append('message', this.state.message);
    formdata.append('user_id', this.props.propsObj[0]);
    formdata.append('propID', this.props.propsObj[1]);
    formdata.append('client', this.props.propsObj[2]);
    formdata.append('table_name', this.props.propsObj[3]);
    // formdata.append('notifID', this.props.propsObj[4]);
    formdata.append('status', this.props.propsObj[5]);
    formdata.append('optional', this.props.propsObj[6]);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}/api/revisions/insert`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log(result);
        this.setState({ sucess_msg: true, message: '', loading: false });
        this.loadMessages(this.props.proposal_id, this.props.table);
        console.log(this.props.propsObj);
        // window.location.reload();
        //console.log("this.props", this.props);

        this.axiosCancelSource = axios.CancelToken.source();
        this.props.loadAgreements(this.axiosCancelSource);
        this.props.loadProposals(this.axiosCancelSource);
      })
      .catch((error) => {
        //console.log('error', error)
        this.setState({ message: '', loading: false });
        // window.location.reload();
      });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.proposal_id !== this.props.proposal_id) {
      this.loadMessages(this.props.proposal_id, this.props.table);
    }
  };

  loadMessages = (id, table) => {
    //console.log(`${url}/api/revisions/get/${id}/${table}`);
    console.log(id, table);
    const token = localStorage.getItem('token');
    axios
      .get(`${url}/api/revisions/get/${id}/${table}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        console.log('result', result.data.data);
        if (result.data?.data?.length > 0) {
          this.setState({
            messages: result.data?.data,
            last_status: result.data?.data[result.data.data.length - 1].status,
          });
        }
        if (result.data?.data?.length == 0) {
          this.setState({
            messages: [],
            last_status: 0,
          });
        }
        console.log(this.state.messages);
        // window.location.reload();
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  getdate = (date) => {
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
  };

  handleClearMessageData = () => {
    const textarea = document.getElementById('messageBox');
    if (textarea) {
      textarea.value = '';
    }
  };

  render() {
    //console.log("==============", this.state.loading);
    // //console.log("this.props.loadAgreements",this.props.loadAgreements  );
    console.log(this.state.messages, this.state.last_status);
    // //console.log("this.props",this.props);
    const { t, i18n, show, handleClose } = this.props;
    return (
      <Modal
        isOpen={show}
        toggle={() => handleClose()}
        className={'modalPropu'}
        centered
      >
        <ModalHeader toggle={() => handleClose()} className='modal-header'>
          {t('b_sidebar.agreement.View_message')}
        </ModalHeader>
        <ModalBody className='modal-body'>
          <div className='row'>
            <div className='col-md-11'>
              <div className='form-group '>
                {this.state.last_status === 4 ||
                this.state.last_status === 0 ||
                this.state.last_status === 1 ? (
                  <div>
                    <textarea
                      className='form-control'
                      id='messageBox'
                      placeholder={t('b_sidebar.agreement.message')}
                      name='message'
                      onChange={this.handleChange}
                    ></textarea>
                    <p style={{ color: '#eb516d ' }}>
                      {this.state.message_err === true
                        ? 'Message is required'
                        : null}
                    </p>
                    <div className='form-group'>
                      <button
                        type='button'
                        className='btn btn-light'
                        onClick={(e) => this.handleSubmit(e)}
                        // data-dismiss="modal"
                        // aria-label="Close"
                        style={{ background: '#efefef' }}
                      >
                        {this.state.loading ? (
                          <Spinner animation='border' role='status'>
                            <span className='sr-only'>Loading...</span>
                          </Spinner>
                        ) : (
                          ''
                        )}{' '}
                        {t('b_sidebar.agreement.Send')}
                      </button>
                    </div>
                  </div>
                ) : null}
                <div
                  className='scroller mt-5'
                  style={{ height: 262, margin: 0 }}
                >
                  <div className='detail-list'>
                    {this.state.messages.map(
                      ({ message, created_at, user_name, status, index }) => (
                        <dl className='d-flex' key={index}>
                          <dt className='flex-grow-0'>{user_name}</dt>
                          <dd>
                            <h5>
                              {this.props.table === 'pro_agreement'
                                ? t('b_sidebar.agreement.Agreement')
                                : t('b_sidebar.agreement.Proposal')}{' '}
                              <b>
                                {(status === 4
                                  ? t('b_sidebar.agreement.revised')
                                  : null) ||
                                  (status === 3
                                    ? t('b_sidebar.agreement.declined')
                                    : null) ||
                                  (status === 2
                                    ? t('b_sidebar.agreement.accepted')
                                    : null)}
                              </b>
                            </h5>
                            <p>{message}</p>
                            <span className='date'>
                              {this.getdate(created_at)}
                            </span>
                          </dd>
                        </dl>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default withTranslation()(AgreementProposalModal);
