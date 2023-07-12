import React, { Component } from "react";
import { Link } from "react-router-dom";
import i18n from "../../locales/i18n";
import { Translation } from "react-i18next";
import $ from "jquery";
import Accordion from "react-bootstrap/Accordion";
import { Button } from "reactstrap";
import axios from "axios";
import { url } from "../../helper/helper";
import { withRouter } from "react-router";
import "./header.css";
import { getData } from "../../helper/api";
import reportSVG from "../../../src/Report.svg";
import resourceSVG from "../../../src/Resources.svg";
import templateSVG from "../../../src/Template.svg";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    i18n.changeLanguage(localStorage.getItem("_lng"));
    this.state = {
      loggedIn: true,
      count: 0,
      unread: 0,
      info: [],
      notif: [],
      isMarketPlace: true,
      isSubMenuOpen: false,
      isSubMenuOpenMaterial: false,
      isSubMenuOpenWork: false,
      isSubMenuOpenClient: false,
      isSubMenuOpenOffer: false,
      isSubMenuOpenQuotation: false,
      isSubMenuOpenContract: false,
      isSubMenuOpenInvoice: false,
      isSubMenuOpenResources: false,
      isSubMenuOpenReport: false,
      isSubMenuOpenTask: false,
      isMyBusiness: true,
      isProjectManage: true,
      Login_user_permissions: localStorage.getItem("Login_user_permissions")
        ? localStorage.getItem("Login_user_permissions")
        : [],
    };
  }

  componentDidMount = () => {
    $(".sidebar-toggle").click(function () {
      $(".main-content").toggleClass("show-sidebar");
    });
    $(".main-content").click(function (event) {
      var target = $(event.target);
      if (target.is(".main-content")) {
        $(this).removeClass("show-sidebar");
      }
    });

    // $(".sidebar .nav .nav-item .nav-link").click(function () {
    //   if (!$(this).parent().hasClass("open")) {
    //     $(".sidebar .nav .nav-item").removeClass("open");
    //     $(this).parent().addClass("open");
    //     $(".sidebar .nav .nav-item .sub-nav").slideUp();
    //     $(this).next().slideDown(".sub-nav");
    //     return;
    //   } else {
    //     $(".sidebar .nav .nav-item").removeClass("open");
    //     $(this).next().slideUp(".sub-nav");
    //   }
    // });

    $(document).ready(function () {
      // var winWidth = $(window).outerWidth();

      var content = $(".main-content");
      if (content.length) {
        var offsettop = Math.floor(content.offset().top);
        var contentOffset = "calc(100vh - " + offsettop + "px)";
        content.css("height", contentOffset);
      }

      function customScroll() {
        var $scrollable = $(".sidebar .nav"),
          $scrollbar = $(".sidebar .scroll"),
          height = $scrollable.outerHeight(true), // visible height
          scrollHeight = $scrollable.prop("scrollHeight"), // total height
          barHeight = (height * height) / scrollHeight; // Scrollbar height!

        var ua = navigator.userAgent;
        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
            ua
          )
        ) {
          $scrollable.css({
            margin: 0,
            width: "100%",
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
        $scrollable.on("scroll", function () {
          $scrollbar.css({
            top: ($scrollable.scrollTop() / height) * barHeight,
          });
        });
      }

      $(window).resize(function () {
        customScroll();
      });
      $(".sidebar .nav").on("scroll mouseout mouseover", function () {
        customScroll();
      });
      customScroll();
    });
  };

  loadToken = async () => {
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/prousers/token/user`, token)
      .then((result) => {
        this.setState({ pms_token: result.data.token });
        window.location.href = `${url}/pms/sso?token=${this.state.pms_token}`;
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  handleSubMenuToggle = (value) => {
    let stateValue = null;
    if (value === "isSubMenuOpenMaterial") {
      this.setState({
        isSubMenuOpen: "isSubMenuOpenMaterial",
      });
    } else if (value === "isSubMenuOpenOffer") {
      this.setState({
        ...this.state,
        isSubMenuOpen: "isSubMenuOpenOffer",
      });
    } else if (value === "isSubMenuOpenQuotation") {
      this.setState({
        ...this.state,
        isSubMenuOpen: "isSubMenuOpenQuotation",
      });
    } else if (value === "isSubMenuOpenClient") {
      this.setState({
        ...this.state,
        isSubMenuOpen: "isSubMenuOpenClient",
      });
    } else if (value === "isSubMenuOpenWork") {
      this.setState({
        ...this.state,
        isSubMenuOpen: "isSubMenuOpenWork",
      });
    } else if (value === "isSubMenuOpenContract") {
      this.setState({
        ...this.state,
        isSubMenuOpen: "isSubMenuOpenContract",
      });
    } else if (value === "isSubMenuOpenInvoice") {
      this.setState({
        ...this.state,
        isSubMenuOpen: "isSubMenuOpenInvoice",
      });
    } else if (value === "isSubMenuOpenResources") {
      this.setState({
        ...this.state,
        isSubMenuOpen: "isSubMenuOpenResources",
      });
    } else if (value === "isSubMenuOpenProjects") {
      this.setState({
        ...this.state,
        isSubMenuOpen: "isSubMenuOpenProjects",
      });
    } else if (value === "isSubMenuOpenReport") {
      this.setState({
        ...this.state,
        isSubMenuOpen: "isSubMenuOpenReport",
      });
    }
    // this.setState({
    //   ...this.state,
    //   [value]: !stateValue
    // })
  };

  render() {
    const { Login_user_permissions } = this.state;
    const { history } = this.props;
    // console.log(this.props.dataFromParent, Login_user_permissions);
    // //console.log("Login_user_permissions", JSON.parse(Login_user_permissions));
    const filter_marketplace_prodesk =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_prodesk"
          )
        : [];
    const filter_marketplace_feeds =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_feeds"
          )
        : [];
    const filter_marketplace_materials =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_materials"
          )
        : [];
    const filter_marketplace_materials_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_materials_create"
          )
        : [];
    const filter_marketplace_materials_details =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_materials_details"
          )
        : [];
    const filter_marketplace_work =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_work"
          )
        : [];
    const filter_marketplace_work_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_work_create"
          )
        : [];
    const filter_marketplace_work_details =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_work_details"
          )
        : [];
    const filter_marketplace_mycontact =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_mycontact"
          )
        : [];
    const filter_marketplace_mybids =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_mybids"
          )
        : [];
    const filter_marketplace_saved_jobs =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "marketplace_saved_jobs"
          )
        : [];

    const filter_mybusiness_prodesk =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_prodesk"
          )
        : [];
    const filter_My_Business_clients =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "My_Business_clients"
          )
        : [];
    const filter_mybusiness_clients_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_clients_create"
          )
        : [];

    const filter_mybusiness_proposal =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_proposal"
          )
        : [];
    const filter_mybusiness_proposal_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_proposal_create"
          )
        : [];
    const filter_mybusiness_proposal_template =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_proposal_template"
          )
        : [];
    const filter_mybusiness_agreement =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_agreement"
          )
        : [];
    const filter_mybusiness_agreement_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_agreement_create"
          )
        : [];
    const filter_mybusiness_project =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_project"
          )
        : [];
    const filter_mybusiness_invoice =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_invoice"
          )
        : [];
    const filter_mybusiness_invoice_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_invoice_create"
          )
        : [];
    const filter_mybusiness_resource =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_resource"
          )
        : [];
    const filter_mybusiness_resource_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_resource_create"
          )
        : [];
    const filter_mybusiness_report =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_project_create_report"
          )
        : [];
    const filter_mybusiness_report_create =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_project_archive_project"
          )
        : [];
    const filter_mybusiness_create_project =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_project_create"
          )
        : [];
    const filter_mybusiness_manage_project =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_project_archive_project"
          )
        : [];
    const filter_mybusiness_archive_project =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === "mybusiness_project_archive"
          )
        : [];
    // const filter_mybusiness_phase =
    //   Login_user_permissions.length > 0
    //     ? JSON.parse(Login_user_permissions)?.filter(
    //       (x) => x === "mybusiness_phase"
    //     )
    //     : [];
    // const filter_mybusiness_phase_create =
    //   Login_user_permissions.length > 0
    //     ? JSON.parse(Login_user_permissions)?.filter(
    //       (x) => x === "mybusiness_phase_create"
    //     )
    //     : [];
    const { location } = this.props;
    return (
      <div className="sidebar">
        <div className="wraper">
          <div className="scroll"></div>
          <ul className="nav flex-column sidebar-list">
            <li className={"nav-item parent-nav"}>
              <Translation>
                {(t) => (
                  <Link className={"nav-link"} to="/Dashboard">
                    <i className="icon-dashboard"></i>
                    <span className="pt-2">{t("header.Dashboard")}</span>
                  </Link>
                )}
              </Translation>
            </li>
            {filter_marketplace_prodesk.length > 0 ? (
              filter_marketplace_prodesk[0] === "marketplace_prodesk" ? (
                <li
                  className={
                    this.props.dataFromParent === "/index"
                      ? "nav-item parent-nav active"
                      : "nav-item parent-nav"
                  }
                >
                  <Translation>
                    {(t) => (
                      <div
                        onClick={() =>
                          this.setState({
                            ...this.state,
                            isMarketPlace: !this.state.isMarketPlace,
                          })
                        }
                        className="nav-link d-flex justify-content-between"
                      >
                        {t("header.MarketPlace")}
                        <Button className="sidebarExpandBtn">
                          {!this.state.isMarketPlace ? "+" : "-"}
                        </Button>
                      </div>
                    )}
                  </Translation>
                </li>
              ) : (
                ""
              )
            ) : (
              ""
            )}
            {this.state.isMarketPlace ? (
              <>
                {filter_marketplace_feeds[0] === "marketplace_feeds" ? (
                  <li
                    className={
                      this.props.dataFromParent === "/feeds"
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <Translation>
                      {(t) => (
                        <div
                          className="nav-link"
                          onClick={() => history.push("/feeds")}
                        >
                          <i className="icon-Feeds"></i>
                          <Translation>{(t) => t("sidebar.feeds")}</Translation>
                        </div>
                      )}
                    </Translation>
                  </li>
                ) : (
                  " "
                )}
                {filter_marketplace_materials.length > 0 ? (
                  filter_marketplace_materials[0] ===
                  "marketplace_materials" ? (
                    <li
                      onClick={() =>
                        this.handleSubMenuToggle(`isSubMenuOpenMaterial`)
                      }
                      className={
                        this.props.dataFromParent === "/create-material-list"
                          ? "nav-item active"
                          : this.props.dataFromParent === "/material-list"
                          ? "nav-item active"
                          : "nav-item"
                      }
                    >
                      <Translation>
                        {(t) => (
                          <div className="nav-link">
                            <i className="icon-materials"></i>
                            {t("index.materials")}
                          </div>
                        )}
                      </Translation>
                      <ul
                        className={
                          this.state.isSubMenuOpen ===
                            "isSubMenuOpenMaterial" ||
                          location.pathname === "/material-list" ||
                          location.pathname === "/create-material-list"
                            ? "show sub-nav"
                            : "sub-nav"
                        }
                      >
                        {filter_marketplace_materials_create.length > 0 ? (
                          filter_marketplace_materials_create[0] ===
                          "marketplace_materials_create" ? (
                            <li>
                              <Translation>
                                {(t) => (
                                  <Link to="/create-material-list">
                                    {t("sidebar.create_listing1")}
                                  </Link>
                                )}
                              </Translation>
                            </li>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {filter_marketplace_materials_details.length > 0 ? (
                          filter_marketplace_materials_details[0] ===
                          "marketplace_materials_details" ? (
                            <li>
                              <Translation>
                                {(t) => (
                                  <Link to="/material-list">
                                    <Translation>
                                      {(t) => t("sidebar.see_listing1")}
                                    </Translation>
                                  </Link>
                                )}
                              </Translation>
                            </li>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </ul>
                    </li>
                  ) : (
                    " "
                  )
                ) : (
                  ""
                )}
                {filter_marketplace_work.length > 0 ? (
                  filter_marketplace_work[0] === "marketplace_work" ? (
                    <li
                      onClick={() =>
                        this.handleSubMenuToggle(`isSubMenuOpenWork`)
                      }
                      className={
                        this.props.dataFromParent === "/create-work-list"
                          ? "nav-item active"
                          : this.props.dataFromParent === "/work-list"
                          ? "nav-item active"
                          : "nav-item"
                      }
                    >
                      <Translation>
                        {(t) => (
                          <a className="nav-link">
                            <i className="icon-work"></i>
                            <Translation>{(t) => t("index.work")}</Translation>
                          </a>
                        )}
                      </Translation>

                      <ul
                        className={
                          this.state.isSubMenuOpen === "isSubMenuOpenWork" ||
                          location.pathname === "/work-list" ||
                          location.pathname === "/create-work-list"
                            ? "show sub-nav"
                            : "sub-nav"
                        }
                      >
                        {filter_marketplace_work_create.length > 0 ? (
                          filter_marketplace_work_create[0] ===
                          "marketplace_work_create" ? (
                            <li>
                              <Translation>
                                {(t) => (
                                  <Link to="/create-work-list">
                                    <Translation>
                                      {(t) => t("sidebar.create_listing1")}
                                    </Translation>
                                  </Link>
                                )}
                              </Translation>
                            </li>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {filter_marketplace_work_details.length > 0 ? (
                          filter_marketplace_work_details[0] ===
                          "marketplace_work_details" ? (
                            <li>
                              <Translation>
                                {(t) => (
                                  <Link to="/work-list">
                                    <Translation>
                                      {(t) => t("sidebar.see_listing")}
                                    </Translation>
                                  </Link>
                                )}
                              </Translation>
                            </li>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </ul>
                    </li>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
                {filter_marketplace_mybids.length > 0 ? (
                  filter_marketplace_mybids[0] === "marketplace_mybids" ? (
                    <li
                      className={
                        this.props.dataFromParent === "/my-actions/listings"
                          ? "nav-item active"
                          : "nav-item"
                      }
                    >
                      <Translation>
                        {(t) => (
                          <Link className="nav-link" to="/my-actions/listings">
                            <i className="icon-My-bid"></i>
                            <Translation>{(t) => t("mybid.myBid")}</Translation>
                          </Link>
                        )}
                      </Translation>
                    </li>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
                {filter_marketplace_mycontact.length > 0 ? (
                  filter_marketplace_mycontact[0] ===
                  "marketplace_mycontact" ? (
                    <li
                      style={{ display: "none" }}
                      className={
                        this.props.dataFromParent === "/my-contracts"
                          ? "nav-item active"
                          : "nav-item"
                      }
                    >
                      <Translation>
                        {(t) => (
                          <Link className="nav-link" to="/my-contracts">
                            <i className="icon-mycontract"></i>
                            <Translation>
                              {(t) => t("index.contract")}
                            </Translation>
                          </Link>
                        )}
                      </Translation>
                    </li>
                  ) : (
                    ""
                  )
                ) : (
                  " "
                )}
                {filter_marketplace_saved_jobs.length > 0 ? (
                  filter_marketplace_saved_jobs[0] ===
                  "marketplace_saved_jobs" ? (
                    <li
                      className={
                        this.props.dataFromParent === "/saved"
                          ? "nav-item active"
                          : "nav-item"
                      }
                    >
                      <Translation>
                        {(t) => (
                          <Link className="nav-link" to="/saved">
                            <i className="icon-Favourite"></i>
                            <Translation>{(t) => t("index.jobs")}</Translation>
                          </Link>
                        )}
                      </Translation>
                    </li>
                  ) : (
                    ""
                  )
                ) : (
                  " "
                )}
              </>
            ) : null}

            {filter_mybusiness_prodesk[0] === "mybusiness_prodesk" ? (
              <li
                className={
                  this.props.dataFromParent === "/business-dashboard"
                    ? "nav-item parent-nav active"
                    : "nav-item parent-nav"
                }
              >
                <Translation>
                  {(t) => (
                    <div
                      onClick={() =>
                        this.setState({
                          ...this.state,
                          isMyBusiness: !this.state.isMyBusiness,
                        })
                      }
                      className="nav-link d-flex justify-content-between"
                    >
                      {t("header.MyBusiness")}
                      <Button className="sidebarExpandBtn">
                        {!this.state.isMyBusiness ? "+" : "-"}
                      </Button>
                    </div>
                  )}
                </Translation>
              </li>
            ) : (
              ""
            )}
            {this.state.isMyBusiness ? (
              <>
                {filter_My_Business_clients[0] === "My_Business_clients" &&
                filter_mybusiness_clients_create[0] ===
                  "mybusiness_clients_create" ? (
                  <li
                    onClick={() =>
                      this.handleSubMenuToggle(`isSubMenuOpenClient`)
                    }
                    className={
                      this.props.dataFromParent === "/mycustomers"
                        ? "nav-item active"
                        : this.props.dataFromParent === "/customers-list"
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <p className="nav-link">
                      <i className="icon-client"></i>
                      <Translation>
                        {(t) => t("b_sidebar.cus.customers_client")}
                      </Translation>
                    </p>
                    <ul
                      className={
                        this.state.isSubMenuOpen === "isSubMenuOpenClient" ||
                        location.pathname === "/customers-list" ||
                        location.pathname === "/mycustomers"
                          ? "show sub-nav"
                          : "sub-nav"
                      }
                    >
                      <li>
                        <Link to="/mycustomers">
                          <Translation>
                            {(t) => t("b_sidebar.cus.customers1")}
                          </Translation>
                        </Link>
                      </li>

                      {filter_mybusiness_clients_create[0] ===
                      "mybusiness_clients_create" ? (
                        <li>
                          <Link to="/customers-list">
                            <Translation>
                              {(t) => t("b_sidebar.cus.Customer_register")}
                            </Translation>
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}
                    </ul>
                  </li>
                ) : (
                  ""
                )}

                {filter_mybusiness_proposal[0] === "mybusiness_proposal" ? (
                  <li
                    onClick={() =>
                      this.handleSubMenuToggle(`isSubMenuOpenOffer`)
                    }
                    className={
                      this.props.dataFromParent === "/proposal-projectplanning"
                        ? "nav-item active"
                        : this.props.dataFromParent === "/myproposal" ||
                          this.props.dataFromParent ===
                            "/business-proposal-create" ||
                          this.props.dataFromParent === "/proposal-listing"
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <a className="nav-link">
                      <i className="icon-proposal"></i>
                      <Translation>
                        {(t) => t("b_sidebar.proposal.proposal")}
                      </Translation>
                    </a>

                    <ul
                      className={
                        this.state.isSubMenuOpen === "isSubMenuOpenOffer" ||
                        location.pathname === "/proposal-listing" ||
                        location.pathname === "/myproposal" ||
                        location.pathname === "/proposal-projectplanning"
                          ? "show sub-nav"
                          : "sub-nav"
                      }
                    >
                      {/* {filter_mybusiness_proposal_template[0] ===
                      "mybusiness_proposal_template" ? (
                        <li>
                          <Link to="/proposal-projectplanning">
                            <Translation>
                              {(t) => t("b_sidebar.proposal.template")}
                            </Translation>
                          </Link>
                        </li>
                      ) : (
                        ""
                      )} */}
                      {filter_mybusiness_proposal_create[0] ===
                      "mybusiness_proposal_create" ? (
                        <li>
                          <Link to="/myproposal">
                            <Translation>
                              {(t) => t("b_sidebar.proposal.create_propsoal")}
                            </Translation>
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}

                      <li>
                        <Link to="/proposal-listing">
                          <Translation>
                            {(t) => t("b_sidebar.proposal.create_manage")}
                          </Translation>
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  ""
                )}
                <li
                  onClick={() =>
                    this.handleSubMenuToggle(`isSubMenuOpenQuotation`)
                  }
                  className={
                    this.props.dataFromParent ===
                    "/proposal-projectplanning-new"
                      ? "nav-item active"
                      : this.props.dataFromParent ===
                        "/proposal-projectplanning-listing"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <a className="nav-link">
                    <img
                      src={templateSVG}
                      alt="templateSVG"
                      height="12px"
                      style={{ paddingRight: "16px" }}
                    />
                    <Translation>
                      {(t) => t("b_sidebar.proposal.template")}
                    </Translation>
                  </a>
                  <ul
                    className={
                      this.state.isSubMenuOpen === "isSubMenuOpenQuotation" ||
                      location.pathname ===
                        "/proposal-projectplanning-listing" ||
                      location.pathname === "/proposal-projectplanning-new"
                        ? "show sub-nav"
                        : "sub-nav"
                    }
                  >
                    <li>
                      <Link to="/proposal-projectplanning-new">
                        <Translation>
                          {(t) => t("b_sidebar.proposal.create_propsoal")}
                        </Translation>
                      </Link>
                    </li>

                    <li>
                      <Link to="/proposal-projectplanning-listing">
                        <Translation>
                          {(t) => t("b_sidebar.proposal.create_manage")}
                        </Translation>
                      </Link>
                    </li>
                  </ul>
                </li>
                {filter_mybusiness_agreement[0] === "mybusiness_agreement" ? (
                  <li
                    onClick={() =>
                      this.handleSubMenuToggle(`isSubMenuOpenContract`)
                    }
                    className={
                      this.props.dataFromParent === "/myagreement"
                        ? "nav-item active"
                        : this.props.dataFromParent === "/myagreement" ||
                          this.props.dataFromParent ===
                            "/business-agreement-create" ||
                          this.props.dataFromParent === "/agreement-listing"
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <a className="nav-link">
                      <i className="icon-agreeement"></i>
                      <Translation>
                        {(t) => t("b_sidebar.agreement.agreement")}
                      </Translation>
                    </a>
                    <ul
                      className={
                        this.state.isSubMenuOpen === "isSubMenuOpenContract" ||
                        location.pathname === "/agreement-listing" ||
                        location.pathname === "/myagreement"
                          ? "show sub-nav"
                          : "sub-nav"
                      }
                    >
                      {filter_mybusiness_agreement_create[0] ===
                      "mybusiness_agreement_create" ? (
                        <li>
                          <Link to="/myagreement">
                            <Translation>
                              {(t) => t("b_sidebar.cus.create_customers_a")}
                            </Translation>
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}

                      <li>
                        <Link to="/agreement-listing">
                          <Translation>
                            {(t) => t("b_sidebar.cus.agrement_s")}
                          </Translation>
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  ""
                )}

                {filter_mybusiness_invoice[0] === "mybusiness_invoice" &&
                filter_mybusiness_invoice_create[0] ===
                  "mybusiness_invoice_create" ? (
                  <li
                    onClick={() =>
                      this.handleSubMenuToggle("isSubMenuOpenInvoice")
                    }
                    className={
                      this.props.dataFromParent === "/invoice"
                        ? "nav-item active"
                        : this.props.dataFromParent === "/invoice-tabs" ||
                          this.props.dataFromParent === "/invoice" ||
                          this.props.dataFromParent === "/invoice-list"
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <a className="nav-link">
                      <i className="icon-invoice"></i>
                      <Translation>
                        {(t) => t("b_sidebar.invoice.invoice")}
                      </Translation>
                    </a>

                    <ul
                      className={
                        this.state.isSubMenuOpen === "isSubMenuOpenInvoice" ||
                        location.pathname === "/invoice-list" ||
                        location.pathname === "/invoice-tabs"
                          ? "show sub-nav"
                          : "sub-nav"
                      }
                    >
                      {filter_mybusiness_invoice_create[0] ===
                      "mybusiness_invoice_create" ? (
                        <li>
                          <Link to="/invoice-tabs">
                            <Translation>
                              {(t) => t("b_sidebar.cus.create_customers_a")}
                            </Translation>
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}
                      <li>
                        <Link to="/invoice-list">
                          <Translation>
                            {(t) => t("b_sidebar.cus.Manage2")}
                          </Translation>
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  ""
                )}
                {filter_mybusiness_report[0] ===
                "mybusiness_project_create_report" ? (
                  <li
                    onClick={() =>
                      this.handleSubMenuToggle("isSubMenuOpenReport")
                    }
                    className={
                      this.props.dataFromParent === "/create-report"
                        ? "nav-item active"
                        : this.props.dataFromParent === "/create-report" ||
                          this.props.dataFromParent ===
                            "/create-report/report-details" ||
                          this.props.dataFromParent === "/create-report"
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <a className="nav-link">
                      <img
                        src={reportSVG}
                        alt="reportSvg"
                        height="15px"
                        style={{ paddingRight: "16px" }}
                      />
                      <Translation>{(t) => t("sidebar.report")}</Translation>
                    </a>
                    <ul
                      className={
                        this.state.isSubMenuOpen === "isSubMenuOpenReport" ||
                        location.pathname === "/create-report/report-details" ||
                        location.pathname === "/create-report"
                          ? "show sub-nav"
                          : "sub-nav"
                      }
                    >
                      {filter_mybusiness_report_create[0] ===
                      "mybusiness_project_archive_project" ? (
                        <li>
                          <Link to="/create-report/report-details">
                            <Translation>
                              {(t) => t("b_sidebar.cus.create_customers_a")}
                            </Translation>
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}
                      <li>
                        <Link to="/report-listing">
                          <Translation>
                            {(t) => t("sidebar.manage")}
                          </Translation>
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  ""
                )}
              </>
            ) : null}

            {filter_mybusiness_prodesk[0] === "mybusiness_prodesk" ? (
              <li
                className={
                  this.props.dataFromParent === "/business-dashboard"
                    ? "nav-item parent-nav active"
                    : "nav-item parent-nav"
                }
              >
                <Translation>
                  {(t) => (
                    <div
                      onClick={() =>
                        this.setState({
                          ...this.state,
                          isProjectManage: !this.state.isProjectManage,
                        })
                      }
                      className="nav-link d-flex justify-content-between"
                    >
                      {t("header.ProjectManagement")}
                      <Button className="sidebarExpandBtn">
                        {!this.state.isProjectManage ? "+" : "-"}
                      </Button>
                    </div>
                  )}
                </Translation>
              </li>
            ) : (
              ""
            )}
            {this.state.isProjectManage ? (
              <>
                {filter_mybusiness_project[0] === "mybusiness_project" ? (
                  <li
                    onClick={() =>
                      this.handleSubMenuToggle(`isSubMenuOpenProjects`)
                    }
                    className={
                      this.props.dataFromParent === "/create-project"
                        ? "nav-item active"
                        : this.props.dataFromParent === "/manage-projects"
                        ? "nav-item active"
                        : this.props.dataFromParent === "/archive-projects"
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    {/* <div onClick={this.loadToken} className="nav-link"> */}
                    <p className="nav-link">
                      <i className="icon-Project"></i>
                      <Translation>
                        {(t) => t("b_sidebar.project.project")}
                      </Translation>
                    </p>
                    <ul
                      className={
                        this.state.isSubMenuOpen === "isSubMenuOpenProjects" ||
                        location.pathname === "/create-project" ||
                        location.pathname === "/manage-projects" ||
                        location.pathname === "/archive-projects"
                          ? "show sub-nav"
                          : "sub-nav"
                      }
                    >
                      <li>
                        <Link to="/create-project">
                          <Translation>
                            {(t) => t("b_sidebar.project.project_create")}
                          </Translation>
                        </Link>
                      </li>
                      <li>
                        <Link to="/manage-projects">
                          <Translation>
                            {(t) => t("b_sidebar.project.project_manage")}
                          </Translation>
                        </Link>
                      </li>
                      <li>
                        <Link to="/archive-projects">
                          <Translation>
                            {(t) => t("b_sidebar.project.project_archive")}
                          </Translation>
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  ""
                )}
                {filter_mybusiness_resource[0] === "mybusiness_resource" ? (
                  <li
                    onClick={() =>
                      this.handleSubMenuToggle(`isSubMenuOpenResources`)
                    }
                    className={
                      this.props.dataFromParent === "/myresources"
                        ? "nav-item active"
                        : this.props.dataFromParent === "/resource-list"
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <a className="nav-link">
                      {/* <i className="icon-work"></i> */}
                      <img
                        src={resourceSVG}
                        alt="resourceSVG"
                        height="15px"
                        style={{ paddingRight: "16px" }}
                      />
                      <Translation>
                        {(t) => t("b_sidebar.resources.resources")}
                      </Translation>
                    </a>

                    <ul
                      className={
                        this.state.isSubMenuOpen === "isSubMenuOpenResources" ||
                        location.pathname === "/resource-list" ||
                        location.pathname === "/myresources" ||
                        location.pathname === "/permission"
                          ? "show sub-nav"
                          : "sub-nav"
                      }
                    >
                      {filter_mybusiness_resource_create[0] ===
                      "mybusiness_resource_create" ? (
                        <li>
                          <Link to="/myresources">
                            <Translation>
                              {(t) => t("b_sidebar.cus.create_customers_a")}
                            </Translation>
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}
                      <li>
                        <Link to="/resource-list">
                          <Translation>
                            {(t) => t("b_sidebar.cus.Manage3")}
                          </Translation>
                        </Link>
                      </li>
                      <li>
                        <Link to="/permission">
                          <Translation>
                            {(t) => t("account.permission")}
                          </Translation>
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  ""
                )}
                {/* {filter_mybusiness_phase[0] === 'mybusiness_phase' ? (
                  <li
                    className={
                      this.props.dataFromParent === "/myphases"
                        ? "nav-item active"
                        : this.props.dataFromParent === "/phase-list"
                          ? "nav-item active"
                          : "nav-item"
                    }
                  >
                    <a className='nav-link'>
                      <i className='icon-Phase'></i>
                      <Translation>
                        {(t) => t('b_sidebar.phase.phases')}
                      </Translation>
                    </a>
                    <ul className='sub-nav'>
                      {filter_mybusiness_phase_create[0] ===
                        "mybusiness_phase_create" ? (
                        <li>
                          <Link to='/myphases'>
                            <Translation>
                              {(t) => t('b_sidebar.cus.create_customers_a')}
                            </Translation>
                          </Link>
                        </li>
                      ) : (
                        ''
                      )}
                      <li>
                        <Link to='/phase-list'>
                          <Translation>
                            {(t) => t('b_sidebar.cus.Manage4')}
                          </Translation>
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  ''
                )} */}
              </>
            ) : null}
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
