import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
// import $ from "jquery";
import moment from 'moment';
import Spinner from 'react-bootstrap/Spinner';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class TenderProposalModal extends Component {
  state = {
    message: '',
    messages: [],
    last_status: 0,
    message_err: false,
    sucess_msg: false,
    loading: false,
    user_id: 0,
  };
  orderMessages(messages) {
    return messages.sort(function (a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

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
    formdata.append('sender', this.props.propsObj[3]);
    formdata.append('receiver', this.props.propsObj[4]);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}/api/revisions/inserttendermessages`, requestOptions)
      .then((response) => {
        this.handleClearMessageData();
        response.json();
      })
      .then((result) => {
        this.setState({
          sucess_msg: true,
          message: '',
          loading: false,
          user_id: this.props.propsObj[2],
        });

        this.loadMessages(this.props.proposal_id, this.props.id);
      })
      .catch((error) => {
        this.setState({ message: '', loading: false });
      });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.proposal_id !== this.props.proposal_id ||
      prevProps.id !== this.props.id
    ) {
      this.loadMessages(this.props.proposal_id, this.props.id);
    }
  };

  loadMessages = (id, userId) => {
    console.log(id, userId);
    const token = localStorage.getItem('token');
    axios
      .get(`${url}/api/revisions/tendermessagesbyuser/${id}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data?.data?.length > 0) {
          this.setState({
            messages: result.data.data,
            last_status: result.data?.data[result.data.data.length - 1].status,
          });
        }

        if (result.data?.data?.length == 0) {
          this.setState({
            messages: [],
            last_status: 0,
          });
        }
      })
      .catch((err) => {});
  };

  getdate = (date) => {
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
  };

  handleClearMessageData = () => {
    const textarea = document.getElementById('messageBox');
    textarea.value = '';
  };

  render() {
    const { t, i18n, show, handleClose } = this.props;
    const data = this.orderMessages(this.state.messages);
    console.log(data);
    return (
      <Modal
        isOpen={show}
        toggle={() => handleClose()}
        className={'modalPropu'}
        centered
      >
        <ModalHeader
          toggle={() => handleClose()}
          className='d-flex justify-content-between'
        >
          <div className='modal-title'>
            {this.props.propsObj[5]}
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='row'>
            <div className='col-md-11'>
              <div className='form-group '>
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

                <div
                  className='scroller mt-5'
                  style={{ height: 262, margin: 0 }}
                >
                  <div className='detail-list'>
                    {data?.map(
                      ({ message, created_at, user_name, status, index }) => (
                        <dl className='d-flex' key={index}>
                          <dt className='flex-grow-0'>{user_name}</dt>
                          <dd>
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

export default withTranslation()(TenderProposalModal);
