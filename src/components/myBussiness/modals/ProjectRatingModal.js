import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
import { getData, postDataWithToken } from '../../../helper/api';
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap';
import './StarRating.css';

class ProjectReviewRatingModal extends Component {
  state = {
    reason: '',
    rating: null,
    contractor_message: '',
    feedback: '',
    rating: 0,
    hover: 0,
  };

  setRating = (e) => {
    this.setState({
      rating: e,
    });
  };
  setHover = (e) => {
    this.setState({
      hover: e,
    });
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const token = await localStorage.getItem('token');
    console.log(this.props);
    const data = new FormData();
    data.set('project_id', this.props.projectId);
    data.set('reason', this.state.reason);
    data.set('ratings', this.state.rating);
    data.set('contractor_message', this.state.contractor_message);
    data.set('feedback', this.state.feedback);

    await postDataWithToken(`${url}/api/project/close_project`, data, token)
      .then((res) => {
        alert('Your feedback is submitted!');
        this.props.handleClose();
      })
      .catch((err) => {
        alert('Some error occured , try again');
      });
  };

  render() {
    const styleOne = {
      color: '#000',
      fontSize: '1.4rem',
      fontWeight: '500',
    };

    const { t, i18n, show, handleClose, projectId } = this.props;

    return (
      <Modal
        isOpen={show}
        toggle={() => handleClose()}
        className={'modalPropu'}
        centered
        style={{ width: '500px' }}
      >
        <ModalHeader toggle={() => handleClose()}>
          {t('marketplace.my_actions.rating.header')}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <label htmlFor='reason' style={styleOne}>
                {' '}
                {t('marketplace.my_actions.rating.titleOne')}{' '}
              </label>
              <input
                id='reason'
                className='form-control'
                type='text'
                name='reason'
                placeholder={t('marketplace.my_actions.rating.titleOneInput')}
                onChange={this.handleChange}
              />
            </div>
            <div className='form-group'>
              <label style={styleOne}>
                {' '}
                {t('marketplace.my_actions.rating.titleTwo')}
              </label>
              <div className='rating-stars'>
                <ul id='stars'>
                  <li className='star' title='Poor' data-value={1}>
                    <i
                      onClick={() => this.setRating(1)}
                      onMouseEnter={() => this.setHover(1)}
                      onMouseLeave={() => this.setHover(this.state.rating)}
                      className={
                        1 <=
                        ((this.state.rating && this.state.hover) ||
                          this.state.hover)
                          ? 'fa fa-star'
                          : 'fa fa-star-o'
                      }
                    />
                  </li>
                  <li title='Fair' data-value={2} className='star'>
                    <i
                      onClick={() => this.setRating(2)}
                      onMouseEnter={() => this.setHover(2)}
                      onMouseLeave={() => this.setHover(this.state.rating)}
                      className={
                        2 <=
                        ((this.state.rating && this.state.hover) ||
                          this.state.hover)
                          ? 'fa fa-star'
                          : 'fa fa-star-o'
                      }
                    />
                  </li>
                  <li className='star' title='Good' data-value={3}>
                    <i
                      onClick={() => this.setRating(3)}
                      onMouseEnter={() => this.setHover(3)}
                      onMouseLeave={() => this.setHover(this.state.rating)}
                      className={
                        3 <=
                        ((this.state.rating && this.state.hover) ||
                          this.state.hover)
                          ? 'fa fa-star'
                          : 'fa fa-star-o'
                      }
                    />
                  </li>
                  <li className='star' title='Excellent' data-value={4}>
                    <i
                      onClick={() => this.setRating(4)}
                      onMouseEnter={() => this.setHover(4)}
                      onMouseLeave={() => this.setHover(this.state.rating)}
                      className={
                        4 <=
                        ((this.state.rating && this.state.hover) ||
                          this.state.hover)
                          ? 'fa fa-star'
                          : 'fa fa-star-o'
                      }
                    />
                  </li>
                  <li className='star' title='WOW!!!' data-value={5}>
                    <i
                      onClick={() => this.setRating(5)}
                      onMouseEnter={() => this.setHover(5)}
                      onMouseLeave={() => this.setHover(this.state.rating)}
                      className={
                        5 <=
                        ((this.state.rating && this.state.hover) ||
                          this.state.hover)
                          ? 'fa fa-star'
                          : 'fa fa-star-o'
                      }
                    />
                  </li>
                </ul>
                <span className='count'>
                  <span>{this.state.rating}</span>/5
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
              <label htmlFor='message' style={styleOne}>
                {' '}
                {t('marketplace.my_actions.rating.titleThree')}
              </label>
              <input
                id='message'
                className='form-control'
                type='text'
                name='contractor_message'
                placeholder={t('marketplace.my_actions.rating.titleThreeInput')}
                onChange={this.handleChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='feedback' style={styleOne}>
                {t('marketplace.my_actions.rating.titleFour')}{' '}
              </label>
              <input
                id='feedback'
                className='form-control'
                type='text'
                name='feedback'
                placeholder={t('marketplace.my_actions.rating.titleFourInput')}
                onChange={this.handleChange}
              />
            </div>
            <button type='submit' className='btn btn-outline-secondary mt-3'>
              {t('marketplace.my_actions.rating.submit')}
            </button>
          </form>
        </ModalBody>
      </Modal>
    );
  }
}

export default withTranslation()(ProjectReviewRatingModal);
