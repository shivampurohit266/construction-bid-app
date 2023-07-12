import React, { Component } from 'react';
import { useState } from 'react';
import QuickTask from '../createquicktask/quickTask';
import CreateFromAggrement from '../createfromaggrement/CreateFromAggrement';
import CreateFromScratch from '../createfromscratch/CreateFromScratch';
import './Tabs.css';
import { withTranslation } from 'react-i18next';
function Tabs({ t }) {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <>
      <div className='content-header-tabs' style={{ maxWidth: '745px' }}>
        <div className='button-container'>
          <button
            className={toggleState === 1 ? 'active' : ''}
            onClick={() => toggleTab(1)}
          >
            {t('projectManagment.Create.scratch')}
          </button>
          <button
            className={toggleState === 2 ? 'active' : ''}
            onClick={() => toggleTab(2)}
          >
            {t('projectManagment.Create.quick_task')}
          </button>
          <button
            className={toggleState === 3 ? 'active' : ''}
            onClick={() => toggleTab(3)}
          >
            {t('projectManagment.Create.agreement')}
          </button>
        </div>
      </div>
      <div className='container-fluid'>
        {toggleState === 1 ? (
          <CreateFromScratch />
        ) : toggleState === 2 ? (
          <QuickTask />
        ) : toggleState === 3 ? (
          <CreateFromAggrement />
        ) : null}
      </div>
    </>
  );
}

export default withTranslation()(Tabs);
