import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../helper/helper';
import { withTranslation } from 'react-i18next';
import $ from 'jquery';
import { getData } from '../../helper/api';

class BussinessSidebar extends Component {
  state = {
    pms_token: null,
    Login_user_permissions: localStorage.getItem('Login_user_permissions')
      ? localStorage.getItem('Login_user_permissions')
      : [],
  };

  componentDidMount = () => {
    $('.sidebar-toggle').click(function () {
      $('.main-content').toggleClass('show-sidebar');
    });
    $('.main-content').click(function (event) {
      var target = $(event.target);
      if (target.is('.main-content')) {
        $(this).removeClass('show-sidebar');
      }
    });
    $('.sidebar .nav .nav-item .nav-link').click(function () {
      if (!$(this).parent().hasClass('open')) {
        $('.sidebar .nav .nav-item').removeClass('open');
        $(this).parent().addClass('open');
        $('.sidebar .nav .nav-item .sub-nav').slideUp();
        $(this).next().slideDown('.sub-nav');
        return;
      } else {
        $('.sidebar .nav .nav-item').removeClass('open');
        $(this).next().slideUp('.sub-nav');
      }
    });

    $(document).ready(function () {
      // var winWidth = $(window).outerWidth();

      var content = $('.main-content');
      if (content.length) {
        var offsettop = Math.floor(content.offset().top);
        var contentOffset = 'calc(100vh - ' + offsettop + 'px)';
        content.css('height', contentOffset);
      }

      function customScroll() {
        var $scrollable = $('.sidebar .nav'),
          $scrollbar = $('.sidebar .scroll'),
          height = $scrollable.outerHeight(true), // visible height
          scrollHeight = $scrollable.prop('scrollHeight'), // total height
          barHeight = (height * height) / scrollHeight; // Scrollbar height!

        var ua = navigator.userAgent;
        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
            ua
          )
        ) {
          $scrollable.css({
            margin: 0,
            width: '100%',
          });
        }

        $scrollbar.height(barHeight);

        var scrollableht = Math.round($scrollable.height());
        var scrollbarht = Math.round($scrollbar.height());

        if (scrollableht <= scrollbarht) {
          $scrollbar.hide();
        } else {
          $scrollbar.show();
        }

        // Element scroll:
        $scrollable.on('scroll', function () {
          $scrollbar.css({
            top: ($scrollable.scrollTop() / height) * barHeight,
          });
        });
      }

      $(window).resize(function () {
        customScroll();
      });
      $('.sidebar .nav').on('scroll mouseout mouseover', function () {
        customScroll();
      });
      customScroll();
    });
  };

  loadToken = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/prousers/token/user`, token)
      .then((result) => {
        this.setState({ pms_token: result.data.token });
        window.location.href = `${url}/pms/sso?token=${this.state.pms_token}`;
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  render() {
    const { t } = this.props;

    const { Login_user_permissions } = this.state;
    console.log(Login_user_permissions);
    const filter_mybusiness_prodesk =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_prodesk'
          )
        : [];
    const filter_My_Business_clients =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'My_Business_clients'
          )
        : [];
    const filter_mybusiness_clients_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_clients_create'
          )
        : [];

    const filter_mybusiness_proposal =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_proposal'
          )
        : [];
    const filter_mybusiness_proposal_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_proposal_create'
          )
        : [];
    const filter_mybusiness_proposal_template =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_proposal_template'
          )
        : [];
    const filter_mybusiness_agreement =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_agreement'
          )
        : [];
    const filter_mybusiness_agreement_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_agreement_create'
          )
        : [];
    const filter_mybusiness_project =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_project'
          )
        : [];
    const filter_mybusiness_invoice =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_invoice'
          )
        : [];
    const filter_mybusiness_invoice_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_invoice_create'
          )
        : [];
    const filter_mybusiness_resource =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_resource'
          )
        : [];
    const filter_mybusiness_resource_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_resource_create'
          )
        : [];
    const filter_mybusiness_phase =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_phase'
          )
        : [];
    const filter_mybusiness_phase_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'mybusiness_phase_create'
          )
        : [];

    const filter_mybusiness_roles =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'my_business_roles'
          )
        : [];

    const filter_mybusiness_create_report =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'my_business_project_create_report'
          )
        : [];
    return (
      <div className='sidebar'>
        <div className='wraper'>
          <div className='scroll'></div>
          <ul className='nav flex-column'>
            {filter_mybusiness_prodesk[0] === 'mybusiness_prodesk' ? (
              <li
                className={
                  this.props.dataFromParent === '/business-dashboard'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <Link className='nav-link' to='/business-dashboard'>
                  <i className='icon-dashboard'></i>
                  {t('sidebar.pro_desk')}
                </Link>
              </li>
            ) : (
              ''
            )}

            {filter_My_Business_clients[0] === 'My_Business_clients' ? (
              <li
                className={
                  this.props.dataFromParent === '/mycustomers'
                    ? 'nav-item active'
                    : this.props.dataFromParent === '/customers-list'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <p className='nav-link'>
                  <i className='icon-client'></i>
                  {t('b_sidebar.cus.customers_client')}
                </p>
                <ul className='sub-nav'>
                  {/* {filter_mybusiness_clients_create[0] === "mybusiness_clients_create" ? */}
                  <li>
                    <Link to='/mycustomers'>
                      {t('b_sidebar.cus.customers1')}
                    </Link>
                  </li>
                  {/* : ''} */}

                  {filter_mybusiness_clients_create[0] ===
                  'mybusiness_clients_create' ? (
                    <li>
                      <Link to='/customers-list'>
                        {t('b_sidebar.cus.Customer_register')}
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
              </li>
            ) : (
              ''
            )}

            {filter_mybusiness_proposal[0] === 'mybusiness_proposal' ? (
              <li
                className={
                  this.props.dataFromParent === '/proposal-projectplanning'
                    ? 'nav-item active'
                    : this.props.dataFromParent === '/myproposal' ||
                      this.props.dataFromParent ===
                        '/business-proposal-create' ||
                      this.props.dataFromParent === '/proposal-listing'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <a className='nav-link'>
                  <i className='icon-proposal'></i>
                  {t('b_sidebar.proposal.proposal')}
                </a>
                <ul className='sub-nav'>
                  {filter_mybusiness_proposal_template[0] ===
                  'mybusiness_proposal_template' ? (
                    <li>
                      <Link to='/proposal-projectplanning'>
                        {t('b_sidebar.proposal.template')}
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}
                  {filter_mybusiness_proposal_create[0] ===
                  'mybusiness_proposal_create' ? (
                    <li>
                      <Link to='/myproposal'>
                        {t('b_sidebar.proposal.create_propsoal')}
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}

                  <li>
                    <Link to='/proposal-listing'>
                      {t('b_sidebar.proposal.create_manage')}
                    </Link>
                  </li>
                </ul>
              </li>
            ) : (
              ''
            )}
            {filter_mybusiness_agreement[0] === 'mybusiness_agreement' ? (
              <li
                className={
                  this.props.dataFromParent === '/myagreement'
                    ? 'nav-item active'
                    : this.props.dataFromParent === '/myagreement' ||
                      this.props.dataFromParent ===
                        '/business-agreement-create' ||
                      this.props.dataFromParent === '/agreement-listing'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <a className='nav-link'>
                  <i className='icon-agreeement'></i>
                  {t('b_sidebar.agreement.agreement')}
                </a>
                <ul className='sub-nav'>
                  {filter_mybusiness_agreement_create[0] ===
                  'mybusiness_agreement_create' ? (
                    <li>
                      <Link to='/myagreement'>
                        {t('b_sidebar.cus.create_customers_a')}
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}

                  <li>
                    <Link to='/agreement-listing'>
                      {t('b_sidebar.cus.agrement_s')}
                    </Link>
                  </li>
                </ul>
              </li>
            ) : (
              ''
            )}

            {filter_mybusiness_project[0] === 'mybusiness_project' ? (
              <li
                className={
                  this.props.dataFromParent === '/saved'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <div onClick={this.loadToken} className='nav-link'>
                  <i className='icon-Project'></i>
                  {t('b_sidebar.project.project')}
                </div>
              </li>
            ) : (
              ''
            )}

            {filter_mybusiness_invoice[0] === 'mybusiness_invoice' ? (
              <li
                className={
                  this.props.dataFromParent === '/invoice'
                    ? 'nav-item active'
                    : this.props.dataFromParent === '/invoice-tabs' ||
                      this.props.dataFromParent === '/invoice' ||
                      this.props.dataFromParent === '/invoice-list'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <a className='nav-link'>
                  <i className='icon-invoice'></i>
                  {t('b_sidebar.invoice.invoice')}
                </a>
                <ul className='sub-nav'>
                  {filter_mybusiness_invoice_create[0] ===
                  'mybusiness_invoice_create' ? (
                    <li>
                      <Link to='/invoice-tabs'>
                        {t('b_sidebar.cus.create_customers_a')}
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}
                  <li>
                    <Link to='/invoice-list'>{t('b_sidebar.cus.Manage2')}</Link>
                  </li>
                </ul>
              </li>
            ) : (
              ''
            )}

            {/* <li
              className={
                this.props.dataFromParent === "/saved"
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <Link className="nav-link" to="/business-dashboard">
                <i className="icon-chat"></i>
                {t("b_sidebar.messaging.messaging")}
              </Link>
            </li> */}
            {filter_mybusiness_resource[0] === 'mybusiness_resource' ? (
              <li
                className={
                  this.props.dataFromParent === '/myresources'
                    ? 'nav-item active'
                    : this.props.dataFromParent === '/resource-list'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <a className='nav-link'>
                  <i className='icon-work'></i>
                  {t('b_sidebar.resources.resources')}
                </a>
                <ul className='sub-nav'>
                  {filter_mybusiness_resource_create[0] ===
                  'mybusiness_resource_create' ? (
                    <li>
                      <Link to='/myresources'>
                        {t('b_sidebar.cus.create_customers_a')}
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}
                  <li>
                    <Link to='/resource-list'>
                      {t('b_sidebar.cus.Manage3')}
                    </Link>
                  </li>
                  <li>
                    <Link to='/permission'>{t('account.permission')}</Link>
                  </li>
                </ul>
              </li>
            ) : (
              ''
            )}
            {filter_mybusiness_phase[0] === 'mybusiness_phase' ? (
              <li
                className={
                  this.props.dataFromParent === '/myphases'
                    ? 'nav-item active'
                    : this.props.dataFromParent === '/phase-list'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <a className='nav-link'>
                  <i className='icon-Phase'></i>
                  {t('b_sidebar.phase.phases')}
                </a>
                <ul className='sub-nav'>
                  {filter_mybusiness_phase_create[0] ===
                  'mybusiness_phase_create' ? (
                    <li>
                      <Link to='/myphases'>
                        {t('b_sidebar.cus.create_customers_a')}
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}
                  <li>
                    <Link to='/phase-list'>{t('b_sidebar.cus.Manage4')}</Link>
                  </li>
                </ul>
              </li>
            ) : (
              ''
            )}
          </ul>
        </div>
      </div>
    );
  }
}

//  Phases commented out for now by Mihai because they are not needed at the moment

export default withTranslation()(BussinessSidebar);
