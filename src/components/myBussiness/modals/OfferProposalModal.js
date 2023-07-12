import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
// import $ from "jquery";
import moment from 'moment';
import Spinner from 'react-bootstrap/Spinner';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class OfferProposalModal extends Component {
  state = {
    message: '',
    messages: [],
    last_status: 0,
    message_err: false,
    sucess_msg: false,
    loading: false,
    user_id: 0,
  };

  // componentDidMount = () => {
  //   this.setState({
  //     messages: this.props.messages,
  //   });
  //   //this.loadMessages(this.props.proposal_id, this.props.table);
  // };

  // componentDidUpdate = (prevProps, prevState) => {
  //   if (prevProps.messages !== this.props.messages)
  //     this.setState({
  //       messages: this.props.messages,
  //     });
  // };

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
    formdata.append('table_name', this.props.propsObj[3]);
    formdata.append('status', this.props.propsObj[5]);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}/api/revisions/chat`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          sucess_msg: true,
          message: '',
          loading: false,
          user_id: this.props.propsObj[2],
        });

        this.loadMessages(this.props.proposal_id, this.props.table);
      })
      .catch((error) => {
        this.setState({ message: '', loading: false });
      });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.proposal_id !== this.props.proposal_id) {
      this.loadMessages(this.props.proposal_id, this.props.table);
    }
  };

  orderMessages(messages) {
    return messages.sort(function (a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }

  loadMessages = (id, table) => {
    console.log(id, table);
    const token = localStorage.getItem('token');
    axios
      .get(`${url}/api/revisions/get/${id}/${table}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log('result', result.data.data);
        if (result.data?.data?.length > 0) {
          this.setState({
            messages: result.data.data,

            //messages: result?.data?.data.filter(
            //(message) => message.client === this.state.user_id
            //),
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
    this.props.handleClose();
  };

  render() {
    const { t, i18n } = this.props;
    const data = this.orderMessages(this.state.messages);
    const { show, handleClose } = this.props;
    return (
      <Modal
        isOpen={show}
        toggle={() => handleClose()}
        className={'modalPropu'}
        centered
      >
        <ModalHeader toggle={() => handleClose()}>
          {t('myBusiness.offer.listing.View_message')}
        </ModalHeader>
        <ModalBody>
          <div className='row'>
            <div className='col-md-12'>
              <div>
                <div className='form-group '>
                  <textarea
                    className='form-control'
                    id='messageBox'
                    placeholder={t('myBusiness.offer.listing.message_popup')}
                    name='message'
                    onChange={this.handleChange}
                  ></textarea>
                  {this.state.message_err === true ? (
                    <p style={{ color: '#eb516d ' }}>"Message is required"</p>
                  ) : null}
                  <button
                    type='button'
                    className='btn btn-light mt-3'
                    style={{ background: '#efefef' }}
                    onClick={(e) => this.handleSubmit(e)}
                  >
                    {this.state.loading ? (
                      <Spinner animation='border' role='status'>
                        <span className='sr-only'>Loading...</span>
                      </Spinner>
                    ) : (
                      ''
                    )}{' '}
                    {t('myBusiness.offer.listing.Send')}
                  </button>
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

export default withTranslation()(OfferProposalModal);
