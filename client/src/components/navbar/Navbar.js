import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';


import './Navbar.css'
import ToggleButton from '../sidebar/ToggleButton'


const images = require.context('../../images', true);

 
class Navbar extends Component {
    render() { 
        let img_src = images(`./avatar.jpg`)
        const {pageTitle} = this.props.pageTitle;
        return (
            <nav className="navbar navbar-size">
                <div><ToggleButton/></div>
                <div className="head-title d-none d-lg-block">
                    <Link to="/">{pageTitle}</Link>
                </div>
                <div className="spacer"/>
                <div className="navbar_items" id="pangcol" aria-expanded="true">
                    <ul className="mainUL">
                        <li className="mainLI">
                           <a className="collapsed account_button" id="account" data-toggle="collapse" href="#userMenu" aria-expanded="false"> 
                               <img className="user_img" src={img_src} alt=""></img>
                                <p>Krishield Kyle</p>
                           </a>
                           <div id="userMenu"className="collapse" aria-expanded="false">
                                <ul className="account_submenus">
                                    <li><a href="#">Account Setting</a></li>
                                    <li>qwer</li>
                                    <li>qwer</li>
                                    <li>qwer</li>
                                </ul>
                           </div>
                        </li>
                        <li className="mainLI"><a href="#" className="normalA">qweqwe</a></li>
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