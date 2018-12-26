import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Proptypes from 'prop-types'
import bsuback from '../../images/bsuback.JPG';
import {changePageTitle} from '../../actions/sidebarActions';
import './Sidebar.css'

class Sidebar extends Component {

    constructor() {
        super()
        this.state = {
           pageTitle: "",
           aria: "false",
           forcol: "collapse",
           rotate: "fa fa-caret-down rotate"
        }

        this.updateClass = this.updateClass.bind(this);
    }

    updateClass = () =>{
        const temp = this.state.rotate;
        let rotate;
        if(temp.length>23){
            rotate="fa fa-caret-down rotate"
        }else{
            rotate="fa fa-caret-down rotate down"
        }
        this.setState({rotate})
     }

     changeTitle = (title) => {
        this.props.changePageTitle(title);
     }

     onMouseEnter = () => {
        let aria = "true"
        let forcol = "collapse show"

        this.setState({aria, forcol})
     }

    onMouseLeave = () => {
        let aria = "false"
        let forcol = "collapse"

        this.setState({aria, forcol})
    }

    render() {

        const {isAuthenticated, user} = this.props.auth

        const guestLinks = (
            <nav className="sidebar_navigation">
                <div className="sidebar_logo">
                    <Link to="/" onClick={() => this.changeTitle("Welcome to our Website")}>BSU</Link>
                </div>
                <div className="sidebar_user">
                    <div className="sidebar_user_image">
                        <img src="/images/avatarGuest.png" alt="Your Avatar"/>
                    </div>
                    <div className="sidebar_user_name">
                        <Link to="/account">Guest</Link>
                    </div>
                </div>
                
                <div className="sidebar_navigation_items">
                    <ul>
                        <li><Link to="/dashboard" onClick={() => this.changeTitle("Dashboard")} className="parentA"><i className="fa fa-chart-line"></i>
                                <p>Dashboard</p></Link>
                        </li>
                        <li className="multimenus forlarge">
                            <a onClick={this.updateClass} className="parentA" id="plagiarism" data-toggle="collapse" href="#checkPlagiarism" aria-expanded="false">
                                <i className="fa fa-search"></i>
                                <p className="pr-2">Check Plagiarism</p>
                                <b id="rotate" className={this.state.rotate}></b>
                            </a>
                            
                            <div id="checkPlagiarism" className="collapse" aria-expanded="false">
                                <div className="csstriangle"/>
                                <ul className="submenus nav">
                                    <li><Link to="/onlinecheck" onClick={() => this.changeTitle("Check Plagiarism Online")} >Online Check</Link></li>
                                    <li><Link to="/localcheck" onClick={() => this.changeTitle("Check Plagiarism Locally")}>Local Check</Link></li>
                                    <li><Link to="/sidebyside" onClick={() => this.changeTitle("Check Plagiarism Side by Side")}>Side by side</Link></li>
                                </ul>
                            </div>
                        </li>
                        <li className="multimenus formini">
                            <a onClick={this.updateClass} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className="parentA" id="plagiarism" data-toggle="collapse" href="#checkPlagiarism" aria-expanded={this.state.aria}>
                                <i className="fa fa-search"></i>
                                <p className="pr-2">Check Plagiarism</p>
                                <b id="rotate" className={this.state.rotate}></b>
                            </a>
                            
                            <div id="checkPlagiarism" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className={this.state.forcol} aria-expanded="false">
                                <div className="csstriangle"/>
                                <ul className="submenus nav">
                                    <li><Link to="/onlinecheck" onClick={() => this.changeTitle("Check Plagiarism Online")} >Online Check</Link></li>
                                    <li><Link to="/localcheck" onClick={() => this.changeTitle("Check Plagiarism Locally")}>Local Check</Link></li>
                                    <li><Link to="/sidebyside" onClick={() => this.changeTitle("Check Plagiarism Side by Side")}>Side by side</Link></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <Link to="/documents" onClick={() => this.changeTitle("Documents")} className="parentA">
                                <i className="fa fa-book"></i>
                                <p>Documents</p>
                            </Link>
                        </li>
                        
                    </ul>
                </div>
            </nav>
        );

        const authLinks = (
            <nav className="sidebar_navigation">
                <div className="sidebar_logo">
                    <Link to="/" onClick={() => this.changeTitle("Welcome to our Website")}>BSU</Link>
                </div>
                <div className="sidebar_user">
                    <div className="sidebar_user_image">
                        <img src={user.avatar} alt="Your Avatar"/>
                    </div>
                    <div className="sidebar_user_name">
                        <Link to="/account">{user.firstName}</Link>
                    </div>
                </div>
                
                <div className="sidebar_navigation_items">
                    <ul>
                        <li><Link to="/dashboard" onClick={() => this.changeTitle("Dashboard")} className="parentA"><i className="fa fa-chart-line"></i>
                                <p>Dashboard</p></Link>
                        </li>
                        <li className="multimenus forlarge">
                            <a onClick={this.updateClass} className="parentA" id="plagiarism" data-toggle="collapse" href="#checkPlagiarism" aria-expanded="false">
                                <i className="fa fa-search"></i>
                                <p className="pr-2">Check Plagiarism</p>
                                <b id="rotate" className={this.state.rotate}></b>
                            </a>
                            
                            <div id="checkPlagiarism" className="collapse" aria-expanded="false">
                                <div className="csstriangle"/>
                                <ul className="submenus nav">
                                    <li><Link to="/onlinecheck" onClick={() => this.changeTitle("Check Plagiarism Online")} >Online Check</Link></li>
                                    <li><Link to="/localcheck" onClick={() => this.changeTitle("Check Plagiarism Locally")}>Local Check</Link></li>
                                    <li><Link to="/sidebyside" onClick={() => this.changeTitle("Check Plagiarism Side by Side")}>Side by side</Link></li>
                                </ul>
                            </div>
                        </li>
                        <li className="multimenus formini">
                            <a onClick={this.updateClass} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className="parentA" id="plagiarism" data-toggle="collapse" href="#checkPlagiarism" aria-expanded={this.state.aria}>
                                <i className="fa fa-search"></i>
                                <p className="pr-2">Check Plagiarism</p>
                                <b id="rotate" className={this.state.rotate}></b>
                            </a>
                            
                            <div id="checkPlagiarism" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className={this.state.forcol} aria-expanded="false">
                                <div className="csstriangle"/>
                                <ul className="submenus nav">
                                    <li><Link to="/onlinecheck" onClick={() => this.changeTitle("Check Plagiarism Online")} >Online Check</Link></li>
                                    <li><Link to="/localcheck" onClick={() => this.changeTitle("Check Plagiarism Locally")}>Local Check</Link></li>
                                    <li><Link to="/sidebyside" onClick={() => this.changeTitle("Check Plagiarism Side by Side")}>Side by side</Link></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <Link to="/documents" onClick={() => this.changeTitle("Documents")} className="parentA">
                                <i className="fa fa-book"></i>
                                <p>Documents</p>
                            </Link>
                        </li>
                        
                    </ul>
                </div>
            </nav>
        );

        return (
            <div>
                <div className="sidebar" style={ { backgroundImage: `url(${bsuback})` } }>
                    <div className="sidebar_transparent">
                        {isAuthenticated ? authLinks : guestLinks}
                    </div>
                </div>
                {/* MINI */}
                <div className="sidebar_mini" style={ { backgroundImage: `url(${bsuback})` } }>
                    <div className="sidebar_transparent_mini">
                    <nav className="sidebar_navigation">
                        <div className="sidebar_logo_mini">
                            <a href="/">BSU</a>
                        </div>
                        <div className="sidebar_user_mini">
                            <div className="sidebar_user_image_mini">
                                <img src="/images/default.jpg" alt="Your Avatar"/>
                            </div>
                        </div>
                        
                        <div className="sidebar_navigation_items_mini">
                            <ul>
                                <li><a href="/" className="parentA">
                                        <i className="fa fa-home pr-3"></i>
                                    </a>
                                </li>
                                <li className="multimenus_mini">
                                    <Link className="collapsed parentA" to="#">
                                        <i className="fa fa-search pr-3"></i>
                                    </Link>
                                    
                                        <ul className="submenus_mini nav">
                                            <li><a href="/">Online Check</a></li>
                                            <li><a href="/">Local Check</a></li>
                                            <li><a href="/">Side by side</a></li>
                                        </ul>

                                </li>
                                <li>
                                    <a href="/" className="parentA">
                                        <i className="fa fa-book pr-3"></i>
                                    </a>
                                </li>
                                
                            </ul>
                        </div>
                    </nav>
                    </div>
                </div>
            </div>
        );
    }
}

Sidebar.proptypes = {
    changePageTitle: Proptypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps,{changePageTitle})(Sidebar);