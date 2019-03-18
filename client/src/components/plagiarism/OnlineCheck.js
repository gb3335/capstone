import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import {removeStopwords} from 'stopword';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'

import ResultStatistics from '../plagiarism-result/ResultStatistics'

import OnlineHighlightedResult from './OnlineHighlightedResult'

import Output from '../plagiarism-result/Output';
import './OnlineCheck.css'

import {checkPlagiarismOnline , setPlagiarismOnlineShowDetails, setPlagiarismOnlineHideDetails} from '../../actions/onlinePlagiarismAction'

 
class OnlineCheck extends Component {
    constructor(){
        super()
        this.state = {
            q: "",
            output: "",
            disableClassname: "btn btn-primary btn-block btn-flat disabled",
            index: 0,
            words: [],
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClickShowDetails = this.onClickShowDetails.bind(this);
        this.onClickHideDetails = this.onClickHideDetails.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();
        if(!this.props.onlinePlagiarism.buttonDisable){
            
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
    }

    onClickShowDetails(index){
        const {output} = this.props.onlinePlagiarism;
        let words=[];
        output[index].Index.forEach(word => {
            let obj = JSON.parse(word);

            words.push.apply(words,obj.Pattern.split(' '))
        })

        this.setState({index, words})
        this.props.setPlagiarismOnlineShowDetails();
    }

    onClickHideDetails = () =>{
        console.log("wer")
        this.props.setPlagiarismOnlineHideDetails();
      }

    
    componentDidMount(){
        if(this.props.onlinePlagiarism.original){
            this.setState({q: this.props.onlinePlagiarism.original})
        }
    }

    


    render() { 
        const { errors } = this.props;
        const {output, loading , showDetails} = this.props.onlinePlagiarism;

        let outputItems;
        let resultItems;
        let highlightItems;

        if(loading || output===[]){
            resultItems = (<div className="row">
            <div className="col-md-12">
              <Spinner />
            </div>
          </div>)

            outputItems = (<div className="spinnerMainDiv">
            <div className="spinner">
              <Spinner />
            </div>
          </div>)
        }else{
            resultItems=<ResultStatistics output={output}/>
            
            

            if (Object.keys(output).length > 0) {
                outputItems = (
                    <div className="outputdiv results">
                        <Output onClickShowDetails={this.onClickShowDetails} output={output} plagType="online"/>
                    </div>
                );
            } else {
                outputItems = <span>No output</span>;
            }
        }

        if(showDetails){
            highlightItems = (

                <div className="sourceResearch">
                    <div className="sourceHeader">Results
                        <div className="spacer"/>
                        <button onClick={this.onClickHideDetails} className="close">x</button>
                    </div>
                    <div className="sourceContent">
                        <OnlineHighlightedResult words={this.state.words} pattern={this.state.q}/>
                    </div>
                </div>
                
            )
        }
        else{
            highlightItems = (<div className="sourceResearch">
            <div className="sourceHeader">Result Statistics</div>
            <div className="sourceContent">
                {resultItems}
            </div>
            <div className="sourceHeader">Check Plagiarism Online</div>
            <form onSubmit={this.onSubmit}>
                <TextAreaFieldGroup 
                    placeholder="Search Something here"
                    name="q"
                    onChange={this.onChange}
                    rows="10"
                    value={this.state.q}
                    error={errors.q}
                    extraClass="onlineTextarea"
                />
                {/* <textarea onChange={this.onChange} classname="form-control" name="q"></textarea> */}
                <button type="submit" className={this.props.onlinePlagiarism.buttonDisable ? this.state.disableClassname : "btn btn-primary btn-block btn-flat"}>{this.props.onlinePlagiarism.buttonDisable ? "Checking for plagiarism..." : "Check"}</button>
            </form>
        </div>)
        }

        
        
        return (
            <div className="container-fluid">
            <div className="row">
              <div className="col-md-8">
                <Link
                  to={``}
                  className="btn btn-light mb-3 float-right"
                >
                  <i className="fas fa-flag text-danger" /> Generate Report
                </Link>
              </div>
            </div>
                <div className="row">
                    <div className="col-md-8">
                        {highlightItems}
                    </div>
                    <div className="col-md-4">
                    <div className="container-fluid">
                        <div className="sourceHeader">Result List</div>
                            {outputItems}
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

OnlineCheck.propTypes = {
    checkPlagiarismOnline: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    setPlagiarismOnlineShowDetails : PropTypes.func.isRequired,
    setPlagiarismOnlineHideDetails : PropTypes.func.isRequired
}

const mapStateToProps = (state) =>({
    errors : state.errors,
    onlinePlagiarism: state.onlinePlagiarism
})
 
export default connect(mapStateToProps,{checkPlagiarismOnline,setPlagiarismOnlineShowDetails,setPlagiarismOnlineHideDetails})(OnlineCheck);