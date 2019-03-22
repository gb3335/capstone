import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import {removeStopwords} from 'stopword';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'

import {Spring, Transition, animated} from 'react-spring/renderprops';

import ResultStatistics from '../plagiarism-result/ResultStatistics'

import OnlineHighlightedResult from './OnlineHighlightedResult'

import Output from '../plagiarism-result/Output';
import './OnlineCheck.css'

import {checkPlagiarismOnline , setPlagiarismOnlineShowDetails, setPlagiarismOnlineHideDetails ,createOnlinePlagiarismReport} from '../../actions/onlinePlagiarismAction'

 
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

    onClickGenerateReport = () => {
        const name =
            this.props.auth.user.firstName +
            " " +
            this.props.auth.user.middleName +
            " " +
            this.props.auth.user.lastName;
  
        const input = {
          printedBy: name,
          typeOfReport: "Check Plagiarism Report",
          subTypeOfReport: "Checked in the World Wide Web",
          output : this.props.onlinePlagiarism.output
        }
        this.props.createOnlinePlagiarismReport(input);
      }

    


    render() { 
        const { errors } = this.props;
        const {output, loading , showDetails} = this.props.onlinePlagiarism;

        let outputItems;
        let resultItems;
        let highlightItems;

        if(loading){
            outputItems = (<div className="spinnerMainDiv">
            <div className="spinner">
            <Spinner />
            </div>
        </div>)
        }else{
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
                    <Transition native 
                                items={!loading}
                                from={{opacity:0}}
                                enter={{opacity:1}}
                                leave={{opacity:0}}
                    >
                    {show => show && (props => (
                        <animated.div style={props}>
                            <Spring from={{ opacity: 0}}
                                to={{ opacity: 1}}
                                config={{delay:100, duration:800}}
                                >{props => (
                                    <div style={props}>
                                        <div className="sourceResearch">
                                            <div className="sourceHeader">Results
                                                <div className="spacer"/>
                                                <button onClick={this.onClickHideDetails} className="close">x</button>
                                            </div>
                                            <div className="sourceContent">
                                                <OnlineHighlightedResult words={this.state.words} pattern={this.state.q}/>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Spring>
                        </animated.div>
                    ))}
                    </Transition>
                    
                )
            }else{
                highlightItems = (<div className="sourceResearch">
                {Object.entries(this.props.onlinePlagiarism.output).length !== 0 && this.props.onlinePlagiarism.output.constructor !== Object ? 
                <Transition native 
                            items={!loading}
                            from={{opacity:0}}
                            enter={{opacity:1}}
                            leave={{opacity:0}}
                            >
                        {show => show && (props =>(
                            <animated.div style={props}>
                                <Spring from={{ opacity: 0}}
                                to={{ opacity: 1}}
                                config={{delay:100, duration:800}}
                                >{props => (
                                    <div style={props}>
                                        <div className="sourceHeader">Online Result Statistics</div>
                                        <div className="sourceContent">
                                            <Spring from={{ opacity: 0}}
                                                    to={{  opacity: 1}}
                                                    config={{delay:500, duration:800}}>
                                                    {props2 =>(
                                                        <div style={props2}>
                                                            <ResultStatistics output={output}/>
                                                        </div>
                                                    )}
                                            </Spring>
                                        </div>
                                    </div>)
                                }
                                </Spring>
                            </animated.div>
                        )

                        )}

                </Transition>
                : ""}
                    <Spring from={{ opacity: 0}}
                            to={{ opacity: 1}}
                            config={{delay:100, duration:800}}>
                            {props => (
                                <div style={props}>
                                    <div className="sourceHeader">Check Plagiarism Online</div>
                                    <form onSubmit={this.onSubmit}>
                                        <TextAreaFieldGroup 
                                            placeholder="Search Something here"
                                            name="q"
                                            onChange={this.onChange}
                                            rows="10"
                                            value={this.state.q}
                                            maxLength="2500"
                                            minLength="100"
                                            error={errors.q}
                                            extraClass="onlineTextarea"
                                        />
                                        {/* <textarea onChange={this.onChange} classname="form-control" name="q"></textarea> */}
                                        <button type="submit" className={this.props.onlinePlagiarism.buttonDisable ? this.state.disableClassname : "btn btn-primary btn-block btn-flat"}>{this.props.onlinePlagiarism.buttonDisable ? "Checking for plagiarism..." : "Check"}</button>
                                    </form>
                                </div>
                            )}
                    </Spring>
                </div>)
            }
            

        
        
        return (
            <div className="container-fluid">
            <div className="row">
              <div className="col-md-8">
                <button
                onClick={this.onClickGenerateReport}
                  className="btn btn-light mb-3 float-right"
                >
                  <i className="fas fa-flag text-danger" /> Generate Report
                </button>
              </div>
            </div>
                <div className="row">
                    <div className="col-md-8">
                        {highlightItems}
                    </div>
                    <div className="col-md-4">
                    <div className="container-fluid">
                        <div className="sourceHeader">Result List</div>
                            <Spring
                                    from={{ opacity: 0}}
                                    to={{  opacity: 1}}
                                    config={{delay:1000, duration:1000}}
                                >{props =>(
                                    <div style={props}>
                                        {outputItems}
                                    </div>
                                )}
                            </Spring>
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
    auth: PropTypes.object.isRequired,
    setPlagiarismOnlineShowDetails : PropTypes.func.isRequired,
    setPlagiarismOnlineHideDetails : PropTypes.func.isRequired
}

const mapStateToProps = (state) =>({
    errors : state.errors,
    onlinePlagiarism: state.onlinePlagiarism,
    auth: state.auth
})
 
export default connect(mapStateToProps,{checkPlagiarismOnline,setPlagiarismOnlineShowDetails,setPlagiarismOnlineHideDetails, createOnlinePlagiarismReport})(OnlineCheck);