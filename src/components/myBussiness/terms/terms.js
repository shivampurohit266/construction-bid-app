import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import { Link } from "react-router-dom";

class terms extends Component {
    render() {
        const { t } = this.props;
        return (
            <div>
                <div>
                    {/* <Header active={"bussiness"} /> */}
                    <div className="sidebar-toggle"></div>

                    <div className="col-md-2">

                    </div>
                    <div className="col-md-8 parag card" style={{ textAlign: "left" }}>
                        <div className="card-body" style={{ borderBottom: "1px solid lightgray" }}>

                            <p> A paragraph is a self-contained unit of discourse in writing dealing with a particular point or idea. A paragraph consists of one or more sentences. Though not required by the syntax of any language, paragraphs are usually an expected part of formal writing, used to organize longer prose. </p>
                        </div>
                    </div>

                    <div className="col-md-2">

                    </div>
                </div>
            </div>
        )
    }
}


export default withTranslation()(terms);