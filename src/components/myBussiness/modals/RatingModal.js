import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
import { postDataWithToken } from '../../../helper/api';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class RatingModal extends Component {
  state = {
    reason: '',
    rating: null,
    message: '',
    feedback: '',
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const token = await localStorage.getItem('token');

    const data = new FormData();
    data.set('reason', this.state.reason);
    data.set('message', this.state.message);
    data.set('feedback', this.state.feedback);
    data.set('rating', this._rating.value);
    await postDataWithToken(`${url}/api/rating/create`, data, token)
      .then((res) => {
        alert('Saved!');
      })
      .catch((err) => {
        alert('Some error occured , try again');
      });
  };

  render() {
    const { t, i18n, show, handleClose } = this.props;
    return (
      <Modal
        isOpen={show}
        toggle={() => handleClose()}
        className={'modalPropu'}
        centered
      >
        <ModalHeader toggle={() => handleClose()}>
          {t('RatingModl.Information')}
        </ModalHeader>
        <ModalBody>
          <form>
            <div className='form-group'>
              <label htmlFor='reason'>
                {' '}
                {t('RatingModl.closing_project')}{' '}
              </label>
              <input
                id='reason'
                className='form-control'
                type='text'
                name='reason'
                placeholder
                onChange={this.handleChange}
              />
              {/*<small className="form-text text-muted">
                                        eg sub contractors, material supplier, team etc
                                    </small>*/}
            </div>
            <div className='form-group'>
              <label> {t('RatingModl.contractor')}</label>
              <div className='rating-stars'>
                <ul id='stars'>
                  <li className='star' title='Poor' data-value={1}>
                    <i className='icon-star-full' />
                  </li>
                  <li className='star' title='Fair' data-value={2}>
                    <i className='icon-star-full' />
                  </li>
                  <li className='star' title='Good' data-value={3}>
                    <i className='icon-star-full' />
                  </li>
                  <li className='star' title='Excellent' data-value={4}>
                    <i className='icon-star-full' />
                  </li>
                  <li className='star' title='WOW!!!' data-value={5}>
                    <i className='icon-star-full' />
                  </li>
                </ul>
                <span className='count'>
                  <span>0</span>/5
                  <input
                    type='hidden'
                    ref={(input) => {
                      this._rating = input;
                    }}
                    className='_rating'
                  />
                </span>
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='message'> {t('RatingModl.Message')}</label>
              <input
                id='message'
                className='form-control'
                type='text'
                name='message'
                placeholder
                onChange={this.handleChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='feedback'>
                {t('RatingModl.ProppU_experience')}{' '}
              </label>
              <input
                id='feedback'
                className='form-control'
                type='text'
                name='feedback'
                placeholder
                onChange={this.handleChange}
              />
            </div>
            <button
              type='submit'
              onClick={this.handleSubmit}
              className='btn btn-outline-secondary mt-3'
            >
              {t('RatingModl.Confirm')}
            </button>
          </form>
        </ModalBody>
      </Modal>
    );
  }
}

export default withTranslation()(RatingModal);
