import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';


import './Navbar.css'

const images = require.context('../../images', true);

 
class Navbar extends Component {
    render() { 
        let img_src = images(`./avatar.jpg`)
        const {pageTitle} = this.props.pageTitle;
        return (
            <nav className="navbar navbar-size">
                <div className="head-title">
                    <h3>{pageTitle}</h3>
                </div>
                <div className="navbar_items">
                    <ul className="nav">
                        <li>
                           <div> 
                               <img className="user_img" src={img_src} alt=""></img>
                                <p>Krishield Kyle</p>
                           </div>
                           <div id="userMenu"className="collapse" aria-expanded="false">

                           </div>
                        </li>
                        <li></li>
                        {/* <li>    
                            <Link to="/login"><i className="fa fa-key"></i> Login</Link>
                        </li> */}
                    </ul>
                    
                    
                </div>  
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    pageTitle: state.pageTitle
});
 
export default connect(mapStateToProps)(Navbar);