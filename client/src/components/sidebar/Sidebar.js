import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Proptypes from 'prop-types'
import {changePageTitle} from '../../actions/sidebarActions';
import './Sidebar.css'

class Sidebar extends Component {

    constructor() {
        super()
        this.state = {
           pageTitle: "",
           hide: false,
           sideclass: "sidebar ",
           aria: "false",
           forcol: "collapse minimenu",
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
        let forcol = "collapse minimenu show"

        this.setState({aria, forcol})
     }

    onMouseLeave = () => {
        let aria = "false"
        let forcol = "collapse minimenu"

        this.setState({aria, forcol})
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.sidebar.hide){
            const sideclass = "sidebar hide"
            this.setState({sideclass})
        }else{
            const sideclass = "sidebar"
            this.setState({sideclass})
        }
    }
    
    componentDidMount(){
        if(this.props.sidebar.hide){
            const sideclass = "sidebar hide"
            this.setState({sideclass})
        }else{
            const sideclass = "sidebar"
            this.setState({sideclass})
        }
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
                        <Link to="/login">Guest</Link>
                    </div>
                </div>
                
                <div className="sidebar_navigation_items">
                    <ul>
                        <li><Link to="/dashboard" onClick={() => this.changeTitle("Dashboard")} className="parentA"><i className="fa fa-chart-line"></i>
                                <p>Dashboard</p></Link>
                        </li>
                        <li><Link to="/colleges" onClick={() => this.changeTitle("Colleges")} className="parentA"><i className="fa fa-graduation-cap"></i>
                                <p>Colleges</p></Link>
                        </li>
                        <li>
                            <Link to="/documents" onClick={() => this.changeTitle("Documents")} className="parentA">
                                <i className="fa fa-book"></i>
                                <p>Documents</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/journals" onClick={() => this.changeTitle("Journals")} className="parentA">
                                <i className="fa fa-journal-whills"></i>
                                <p>Journals</p>
                            </Link>
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
                        <li><Link to="/colleges" onClick={() => this.changeTitle("Colleges")} className="parentA"><i className="fa fa-graduation-cap"></i>
                                <p>Colleges</p></Link>
                        </li>
                        <li>
                            <Link to="/documents" onClick={() => this.changeTitle("Documents")} className="parentA">
                                <i className="fa fa-book"></i>
                                <p>Documents</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/journals" onClick={() => this.changeTitle("Journals")} className="parentA">
                                <i className="fa fa-journal-whills"></i>
                                <p>Journals</p>
                            </Link>
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
                    </ul>
                </div>
            </nav>
        );

        return (
            <div>
                <div className={this.state.sideclass} style={ { backgroundImage: `url(/images/bsuback.JPG)` } }>
                    <div className="sidebar_transparent">
                        {isAuthenticated ? authLinks : guestLinks}
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
    auth: state.auth,
    sidebar: state.sidebar
});
export default connect(mapStateToProps,{changePageTitle})(Sidebar);