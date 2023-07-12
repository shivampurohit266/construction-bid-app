import React, { Component } from 'react';
import axios from 'axios';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { Helper, url } from '../../helper/helper';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import AllBids from './BidsComponents/Allbirds';
import Activebirds from './BidsComponents/Activebirds';
import Expiredbirds from './BidsComponents/Expiredbirds';
import Hiredbirds from './BidsComponents/Hiredbirds';
import Pendingbirds from './BidsComponents/Pendingbirds';
import './BidsComponents/bids.css';
import { getData } from '../../helper/api';

class Mybid extends Component {
  feeds_search = [];
  state = {
    feeds: [],
    status: '',
    search: '',
    proposal_submitted: false,
    loaded: false,
    left: null,
    right: null,
  };

  componentDidMount = () => {
    this.getBid();
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getBid = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/bid/bid-list`, token)
      .then((res) => {
        this.setState({
          getBid: res.data.data,
        });
        console.log(res.data.data);
      })
      .catch((err) => {
        //console.log("error", err)
      });
  };

  business = () => {
    this.props.history.push(`./myproposal`);
  };

  render() {
    const { t, i18n } = this.props;
    const { getBid } = this.state;

    let alert;
    if (this.state.proposal_submitted === true) {
      alert = (
        <Alert variant='success' style={{ fontSize: '13px' }}>
          {t('mybid.Proposal_Requested')}
        </Alert>
      );
    }

    return (
      <div>
        {/* <Header active={'market'} /> */}
        <div className='sidebar-toggle'></div>
        <nav aria-label='breadcrumb'>
          <ol className='breadcrumb'>
            <Link
              to='/feeds'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('header.marketplace')}
            </Link>
            <li className='breadcrumb-item active' aria-current='page'>
              {t('mybid.my_bids')}
            </li>
          </ol>
        </nav>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              {alert ? alert : null}
              <h3 className='head3'>{t('mybid.mybid')} </h3>

              <Tabs>
                <div className='card'>
                  <TabList>
                    <Tab> {t('mybid.All')} </Tab>
                    <Tab> {t('mybid.Active')} </Tab>
                    <Tab> {t('mybid.pending')} </Tab>
                    <Tab> {t('mybid.Expired')} </Tab>
                    <Tab> {t('mybid.Hired')} </Tab>
                  </TabList>
                </div>

                <TabPanel>
                  <AllBids
                    data={getBid}
                    onClick={this.getBid}
                    business={this.business}
                  />
                </TabPanel>
                <TabPanel>
                  <Activebirds data={getBid} onClick={this.getBid} />
                </TabPanel>
                <TabPanel>
                  <Pendingbirds data={getBid} onClick={this.getBid} />
                </TabPanel>
                <TabPanel>
                  <Expiredbirds data={getBid} onClick={this.getBid} />
                </TabPanel>
                <TabPanel>
                  <Hiredbirds data={getBid} onClick={this.getBid} />
                </TabPanel>
              </Tabs>

              {/* {this.state.loaded === false ? (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              ) : (
                  ''
                )} */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Mybid);
