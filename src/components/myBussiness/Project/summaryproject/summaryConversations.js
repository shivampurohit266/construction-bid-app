import React from 'react';
import { withTranslation } from 'react-i18next';
import './summaryConversations.css';
const SummaryConversations = ({ t, location }) => {
  return (
    <div className='card-body'>
      <h3 className='summary-chat-title'>Chats</h3>
      <div className='summary-chat-container'>
        <div className='summary-chat-date'>
          <div className='chat-date'>24 November 2023</div>
        </div>
        <div className='chat-box'>
          <div className='chat-box-text'>
            <div className='chat-box-name'>Kelmend</div>
            <p>
              Id ullamcorper euismod non tristique ultricies maecenas elementum
              consectetur. Quisque scelerisque facilisis tortor odio. Amet,
              venenatis sed habitasse feugia
            </p>
          </div>
          <div className='chat-box-time'>6:22 PM</div>
        </div>
        <div className='chat-box'>
          <div className='chat-box-text'>
            <div className='chat-box-name'>Marcus Aurelis</div>
            <p>
              Id ullamcorper euismod non tristique ultricies maecenas elementum
              consectetur. Quisque scelerisque facilisis tortor odio. Amet,
              venenatis sed habitasse feugia
            </p>
          </div>
          <div className='chat-box-time'>11:22 PM</div>
        </div>
        <div className='chat-box'>
          <div className='chat-box-text'>
            <div className='chat-box-name'>Constantine</div>
            <p>
              Massa sed est nunc malesuada lacus commodo. Nunc justo adipiscing
              ac a orci dignissim quam. Cum bibendum ornare egestas a, velit a.
              Pulvinar scelerisque nisl, libero massa nunc, sollicitudin ac. Eu
              praesent nunc, pharetra cras
            </p>
          </div>
          <div className='chat-box-time'>16:32 PM</div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(SummaryConversations);
