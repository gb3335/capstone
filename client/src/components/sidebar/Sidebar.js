import React, { Component } from 'react';
import avatar from '../../image/avatar.jpg'
import bsuback from '../../image/bsuback.JPG'
import './Sidebar.css'

class Sidebar extends Component {
    state = {
        classname: "fa fa-caret-down rotate"
    }


    updateClass = () =>{
        const temp = this.state.classname;
        let classname;
        if(temp.length>23){
            classname="fa fa-caret-down rotate"
        }else{
            classname="fa fa-caret-down rotate down"
        }
        this.setState({classname})
     }

    render() { 
        return (
            <div>
                <div className="sidebar" style={ { backgroundImage: `url(${bsuback})` } }>
                    <div className="sidebar_transparent">
                    <nav className="sidebar_navigation">
                        <div className="sidebar_logo">
                            <a href="/">BulSU</a>
                        </div>
                        <div className="sidebar_user">
                            <div className="sidebar_user_image">
                                <img src={avatar} alt="Your Avatar"/>
                            </div>
                            <div className="sidebar_user_name">
                                <a href="/">Krishield Kyle</a>
                            </div>
                        </div>
                        
                        <div className="sidebar_navigation_items">
                            <ul>
                                <li><a href="/" className="parentA"><i className="fa fa-home pr-3"></i>
                                        <p>Home</p></a>
                                </li>
                                <li className="multimenus">
                                    <a onClick={this.updateClass} className="collapsed parentA" id="plagiarism" data-toggle="collapse" href="#checkPlagiarism" aria-expanded="false">
                                        <i className="fa fa-search pr-3"></i>
                                        <p className="pr-2">Check Plagiarism</p>
                                        <b id="rotate" className={this.state.classname}></b>
                                    </a>
                                    <div id="checkPlagiarism" className="collapse" aria-expanded="false">
                                        <ul className="submenus nav">
                                            <li><a href="/">Online Check</a></li>
                                            <li><a href="/">Local Check</a></li>
                                            <li><a href="/">Side by side</a></li>
                                        </ul>
                                    </div>
                                </li>
                                <li>
                                    <a href="/" className="parentA">
                                        <i className="fa fa-book pr-3"></i>
                                        <p>Documents</p>
                                    </a>
                                </li>
                                
                            </ul>
                        </div>
                    </nav>
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
                                <img src={avatar} alt="Your Avatar"/>
                            </div>
                        </div>
                        
                        <div className="sidebar_navigation_items_mini">
                            <ul>
                                <li><a href="/" className="parentA">
                                        <i className="fa fa-home pr-3"></i>
                                    </a>
                                </li>
                                <li className="multimenus_mini">
                                    <a className="collapsed parentA" href="#">
                                        <i className="fa fa-search pr-3"></i>
                                    </a>
                                    
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
 
export default Sidebar;