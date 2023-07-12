import React from 'react';
import { withTranslation } from 'react-i18next';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import { Link } from 'react-router-dom';
import './PageNotFound.css';
const PageNotFound = ({ t, location }) => {
  return (
    <>
      {/* <Header /> */}

      <div className='main-content'>
        {/* <Sidebar dataFromParent={location.pathname} /> */}
        <main>
          <div id='notfound'>
            <div className='notfound'>
              <div className='notfound-404'>
                <h1>404</h1>
              </div>
              <h2>{t('error404.heading')}</h2>
              <p className='mb-5'>{t('error404.headingdescription')}</p>

              <Link to='/'>{t('error404.buttonbackhome')}</Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default withTranslation()(PageNotFound);
