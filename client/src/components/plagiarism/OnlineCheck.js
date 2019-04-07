import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'

import { Tesseract } from "tesseract.ts";

import {Spring, Transition, animated} from 'react-spring/renderprops';

import ResultStatistics from '../plagiarism-result/ResultStatistics'

import OnlineHighlightedResult from './OnlineHighlightedResult'

import Output from '../plagiarism-result/Output';
import './OnlineCheck.css'

import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

import {checkPlagiarismOnline , setPlagiarismOnlineShowDetails, setPlagiarismOnlineHideDetails ,createOnlinePlagiarismReport, setPlagiarismGenerateReportLoading} from '../../actions/onlinePlagiarismAction'

 
class OnlineCheck extends Component {
    constructor(){
        super()
        this.state = {
            q: "",
            output: "",
            disableClassname: "btn btn-primary btn-block btn-flat disabled",
            index: 0,
            words: [],
            errors: {},
            ocrProgress: ""
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
            
            let old = this.state.q.toString();
            // let q = old.join(' ');
            // q = q.replace(/\s+/g," ");
            const input = {
                q: old,
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
        this.props.setPlagiarismOnlineHideDetails();
    }

    
    componentDidMount(){
        if(this.props.onlinePlagiarism.original){
            this.setState({q: this.props.onlinePlagiarism.original})
        }
    }

    onClickGenerateReport = () => {
        const {output, original} = this.props.onlinePlagiarism;
        this.props.setPlagiarismGenerateReportLoading(true);
        const words = [];

        output.forEach((out) => {
            out.Index.forEach((index) => {
            let obj = JSON.parse(index);
            words.push(obj.Pattern)
            })
        })
        var uniqueItems = [...new Set(words)]

        const word = uniqueItems.join(' ');
        const name =
            this.props.auth.user.name.firstName +
            " " +
            this.props.auth.user.name.middleName +
            " " +
            this.props.auth.user.name.lastName;
  
        const input = {
          printedBy: name,
          pattern: original,
          word,
          from: "online",
          typeOfReport: "Plagiarism Check Result",
          subTypeOfReport: "Checked in the World Wide Web",
          output : this.props.onlinePlagiarism.output
        }
        this.props.createOnlinePlagiarismReport(input);
      }

      onOCR = e => {
        let files = e.target.files;
    
        Tesseract.recognize(files[0])
          .progress(data => {
            let dataProg = data.progress * 100;
            dataProg = dataProg.toString();
            dataProg = dataProg.substring(0, 5);
    
            this.setState({
              ocrProgress: data.status + " at " + dataProg + "%"
            });
          })
          .then(data => {
            this.setState({ q: data.text, ocrProgress:"" });
          })
          .catch(console.error);
      };

    


    render() { 
        const { errors } = this.props;
        const {output, loading , showDetails} = this.props.onlinePlagiarism;

        let outputItems;
        let resultItems;
        let highlightItems;

        if(loading){
            outputItems = (<div className="spinnerMainDiv">
                <p>{this.props.onlinePlagiarism.axiosProgress.tag}</p>
                <Progress
                    type="circle"
                    percent={this.props.onlinePlagiarism.axiosProgress.axiosProgress}
                    
                    /> 
                    {/* <Spinner /> */}
        </div>)
        }else{
            if (Object.keys(output).length > 0) {
                outputItems = (
                    <div className="outputdiv results">
                        <Output onClickShowDetails={this.onClickShowDetails} output={output} plagType="online"/>
                    </div>
                );
            } else {
                outputItems = <span>Nothing to Show</span>;
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
            

        const {generateReport, original} = this.props.onlinePlagiarism;
        const {ocrProgress} = this.state;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-8">
                    {ocrProgress !== ""? <div className="float-left"><button className="btn btn-light disabled mb-2" title="Use Image to Text"><i className="fas fa-file-image mr-1" />
                    Image to Text</button> <span className="pl-3" style={{ fontSize: "12px" }}>{ocrProgress}</span></div>
                    
                        : 
                        <div className="float-left"><label
                                to="#"
                                htmlFor="ocr"
                                className="btn btn-light"
                                title="Use Image to Text"
                                >
                                <i className="fas fa-file-image mr-1" />
                                    Image to Text
                            
                            </label>
                            <input  
                                type="file"
                                style={{
                                border: 0,
                                opacity: 0,
                                position: "absolute",
                                pointerEvents: "none",
                                }}
                                onChange={this.onOCR}
                                name="name"
                                id="ocr"
                                accept=".png, .jpg, .jpeg"
                                /> 
                        </div>}
                    { generateReport ? <button
                        className="btn btn-light mb-3 float-right disabled"
                        >
                        <i className="fas fa-flag text-danger" /> Generating Report...
                        </button>

                        : loading || original==="" || (Object.entries(output).length === 0 && output.constructor === Object) ? 
                        <button
                            className="btn btn-light mb-3 float-right disabled"
                        >
                            <i className="fas fa-flag text-danger" /> Generate Report
                        </button> 
                        :
                        <button
                        onClick={this.onClickGenerateReport}
                        className="btn btn-light mb-3 float-right"
                        >
                        <i className="fas fa-flag text-danger" /> Generate Report
                        </button>}
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
    setPlagiarismOnlineHideDetails : PropTypes.func.isRequired,
    setPlagiarismGenerateReportLoading : PropTypes.func.isRequired
}

const mapStateToProps = (state) =>({
    errors : state.errors,
    onlinePlagiarism: state.onlinePlagiarism,
    auth: state.auth
})
 
export default connect(mapStateToProps,{checkPlagiarismOnline,setPlagiarismOnlineShowDetails,setPlagiarismOnlineHideDetails, createOnlinePlagiarismReport,setPlagiarismGenerateReportLoading})(OnlineCheck);