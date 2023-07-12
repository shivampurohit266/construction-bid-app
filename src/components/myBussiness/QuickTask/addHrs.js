import React, { useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Files from 'react-files';
import Datetime from 'react-datetime';
import { withTranslation } from 'react-i18next';
import File from '../../../images/file-icon.png';
import moment from 'moment';

const AddHrs = ({ t }) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [estimation, setEstimation] = useState({
    name: '',
    description: '',
    hours: null,
    attachment: [],
    date: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    hours: null,
    attachment: [],
    date: '',
  });
  const { name, description, hours, attachment, date } = estimation;
  const onFilesChange = (files) => {
    setEstimation({
      ...estimation,
      attachment: files,
    });
    setLoaded(50);

    if (loaded <= 100) {
      setTimeout(setLoaded(100), 2000); // wait 2 seconds, then reset to false
    }
  };

  const onFilesError = (error, file) => {
    setErrors({
      ...errors,
      attachment: error.message,
    });
  };
  const Remove_img = () => {
    setEstimation({
      ...estimation,
      attachment: '',
    });
    setLoaded(0);
  };

  const handleKeyDownCus = (evt) => {
    if (['Enter'].includes(evt.key)) {
      evt.preventDefault();
    }
  };

  const inputPropsDate = {
    onKeyDown: handleKeyDownCus,
    placeholder: 'DD-MM-YYYY',
  };

  const valid = (current) => {
    let yesterday = moment().subtract(1, 'day');
    if (current) {
      return current.isAfter(yesterday);
    }
  };

  return (
    <>
      <div
        className='project-rigthbar'
        style={{ maxWidth: '360px', display: 'block' }}
      >
        <form className='fk-pro-add_task_time'>
          <h1 className='head1'>Task : muu</h1>
          <h1 className='head1' style={{ marginTop: '20px' }}>
            Add Time
          </h1>
          <br />
          <div className='form-group'>
            <label>Description</label>
            <textarea
              className='form-control'
              name='description'
              id='description'
              placeholder='Description'
            ></textarea>
          </div>
          <div className='form-group'>
            <label>Hours</label>
            <input
              className='form-control'
              type='number'
              name='hours'
              id='hours'
              placeholder='Hours'
            />
          </div>
          <div className='form-group imageDiv'>
            <label>Image</label>
            {/* <div className='clear'></div>
            <input
              className='form-control'
              type='file'
              name='image'
              id='image'
            />*/}
            <div className='form-group'>
              <div className='file-select'>
                <Files
                  className='files-dropzone'
                  onChange={(e) => onFilesChange(e)}
                  onError={(e) => onFilesError(e)}
                  accepts={[
                    'image/gif',
                    '.doc ',
                    '.docx',
                    'image/jpeg',
                    'image/png',
                    'image/jpg',
                    '.svg',
                    '.pdf',
                  ]}
                  multiple
                  maxFileSize={10000000}
                  minFileSize={10}
                  clickable
                >
                  <label htmlFor='attachment'>
                    {attachment.length <= 0 ? (
                      <img src={File} alt='...' />
                    ) : (
                      attachment.map((url, i) => (
                        <div key={i}>
                          <img
                            style={{
                              height: '100px',
                            }}
                            src={
                              attachment.length <= 0 ? File : url.preview.url
                            }
                            alt='...'
                          />
                        </div>
                      ))
                    )}
                    <span className='status'>
                      {' '}
                      {t('marketplace.feeds.list_details.Upload_status')}{' '}
                    </span>
                    <ProgressBar
                      now={loaded}
                      style={{ marginBottom: '1rem' }}
                    />
                    <small className='form-text text-muted'>
                      {t('marketplace.feeds.list_details.ext')}
                    </small>
                  </label>
                </Files>
              </div>
              <p style={{ color: '#eb516d', fontSize: '15px' }}>
                {/* {this.state.img_name ? this.state.img_name : ""} */}
                {errors.attachment ? errors.attachment : ''}
              </p>
              {estimation.attachment ? (
                <button
                  type='button'
                  onClick={Remove_img}
                  className='btn btn-danger'
                >
                  {t('marketplace.feeds.list_details.Remove')}
                </button>
              ) : (
                ''
              )}
            </div>
          </div>

          <div className='form-group'>
            <label>Date</label>
            <div className='clear'></div>
            {/* <input
              className='form-control'
              type='text'
              name='date'
              id='date'
              autocomplete='off'
              placeholder='Date'
            /> */}
            <div className='start-date'>
              <Datetime
                onChange={(e) =>
                  setEstimation({
                    ...estimation,
                    date: e,
                  })
                }
                isValidDate={valid}
                name='start_date'
                dateFormat='DD-MM-YYYY'
                value={date}
                timeFormat={false}
                // type="date"
                locale={`${
                  localStorage.getItem('_lng') === 'fi' ? 'fr-fi' : 'en-US'
                } `}
                inputProps={inputPropsDate}
              />
            </div>
          </div>
          <div className='form-group'>
            <a
              className='btn btn-danger btn-sm cancel_button'
              href='https://appv2.proppu.com/proppu/public/pms/dashboard'
            >
              Cancel
            </a>
            <button
              className='btn btn-success btn-sm pull-right float-right btn-primary mb-sm-0 mb-3'
              type='submit'
              id='submit_btn'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default withTranslation()(AddHrs);
