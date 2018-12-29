import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import {removeStopwords} from 'stopword';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import './OnlineCheck.css'

import {checkPlagiarismOnline} from '../../actions/onlinePlagiarismAction'

 
class OnlineCheck extends Component {
    constructor(){
        super()
        this.state = {
            q: "",
            output: "",
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();
        let old = this.state.q.toString().split(' ');
        old = removeStopwords(old)
        const q = old.join(' ');
        const input = {
            q,
            original: this.state.q
        }
        // console.log(input)
        this.props.checkPlagiarismOnline(input);
    }

    componentWillReceiveProps(nextProps){
        this.setState({q: nextProps.onlinePlagiarism.original})
        let output="";
        if(nextProps.onlinePlagiarism.output.onlinePlagiarism && nextProps.onlinePlagiarism.output.onlinePlagiarism.data && nextProps.onlinePlagiarism.output.onlinePlagiarism.data.items){
            const items = nextProps.onlinePlagiarism.output.onlinePlagiarism.data.items;
            items.forEach(function(item, index){
                output+=`<p>Link ${index+1}: <a target="_blank" href="${item.link}">${item.link}</a></p>`
                output+=`<p>${item.htmlSnippet}</p>`
            })
        }else{
            output="Nothing to show!"   
        }
        
        this.setState({output})
        
    }

    componentDidMount(){
        this.setState({q: this.props.onlinePlagiarism.original})
        let output="";
        if(this.props.onlinePlagiarism.output.onlinePlagiarism && this.props.onlinePlagiarism.output.onlinePlagiarism.data && this.props.onlinePlagiarism.output.onlinePlagiarism.data.items){
            const items = this.props.onlinePlagiarism.output.onlinePlagiarism.data.items;
            items.forEach(function(item, index){
                output+=`<p>Link ${index+1}: <a target="_blank" href="${item.link}">${item.link}</a></p>`
                output+=`<p>${item.htmlSnippet}</p>`
            })
        }else{
            output="Nothing to show!"   
        }
        
        this.setState({output})
        
    }

    render() { 
        const { errors } = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 p-2">
                        <form onSubmit={this.onSubmit}>
                            <TextAreaFieldGroup 
                                placeholder="Search Something here"
                                name="q"
                                onChange={this.onChange}
                                rows="25"
                                value={this.state.q}
                                error={errors.q}
                                extraClass="onlineTextarea"
                            />
                            {/* <textarea onChange={this.onChange} classname="form-control" name="q"></textarea> */}
                            <button type="submit" className="btn btn-primary btn-block btn-flat">Check</button>
                        </form>
                        
                    </div>
                    <div className="col-md-4 p-2">
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
    checkPlagiarismOnline: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) =>({
    errors : state.errors,
    onlinePlagiarism: state.onlinePlagiarism
})
 
export default connect(mapStateToProps,{checkPlagiarismOnline})(OnlineCheck);