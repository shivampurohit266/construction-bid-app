import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
class DeleteModal extends Component {
  render() {
    const { t, i18n, deleteAccount } = this.props;
    const { show, handleClose } = this.props;
    return (
      <Modal
        isOpen={show}
        toggle={() => handleClose()}
        className={'modalPropu preview-modal'}
        centered
      >
        <ModalHeader toggle={() => handleClose()}></ModalHeader>
        <ModalBody>
          <h4 style={{ textAlign: 'center' }}>
            {' '}
            {t('account.confirmDelete')}{' '}
          </h4>

          <div className='modal-body'>
            <div className='row'>
              <div className='col-md-11'>
                <div className='form-group mb-5'>
                  <div className='profile flex'>
                    <div
                      className='content'
                      style={{ textAlign: 'center' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <button className='btn btn-danger' onClick={deleteAccount}>
                {t('account.deleteAccount')}
              </button>
              <button
                className='btn btn-gray'
                id='close'
                type='button'
                data-dismiss='modal'
                aria-label='Close'
                onClick={() => handleClose()}
              >
                {t('account.cancel')}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default withTranslation()(DeleteModal);
