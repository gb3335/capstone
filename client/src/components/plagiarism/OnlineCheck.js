import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import './OnlineCheck.css'

import {checkPlagiarismOnline} from '../../actions/plagiarismAction'

 
class OnlineCheck extends Component {
    constructor(){
        super()
        this.state = {
            q: "",
            output: "",
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();

        const input = {
            q:this.state.q
        }
        this.props.checkPlagiarismOnline(input);
    }

    componentWillReceiveProps(nextProps){
        let output="";
        const items = nextProps.plagiarism.output.data.items;
        items.forEach(function(item, index){
            output+=`<p>Link ${index+1}: <a href="${item.link}">${item.link}</a></p>`
            output+=`<p>${item.htmlSnippet}</p>`
        })
        this.setState({output})
        
    }


    render() { 
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 border">
                        <form onSubmit={this.onSubmit}>
                            <textarea onChange={this.onChange} name="q"></textarea>
                            <button type="submit" className="btn btn-primary btn-block btn-flat">Check</button>
                        </form>
                        
                    </div>
                    <div className="col-md-4 border">
                        <div className="outputdiv">
                            <span>{ReactHtmlParser(this.state.output)}</span>
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
}

OnlineCheck.propTypes = {
    checkPlagiarismOnline: PropTypes.func.isRequired
}

const mapStateToProps = (state) =>({
    errors : state.errors,
    plagiarism: state.plagiarism
})
 
export default connect(mapStateToProps,{checkPlagiarismOnline})(OnlineCheck);