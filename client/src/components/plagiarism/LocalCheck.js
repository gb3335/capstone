import React, { Component } from 'react'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'

import { Tesseract } from "tesseract.ts";

import {Spring, Transition, animated} from 'react-spring/renderprops';

import ResultStatistics from '../plagiarism-result/ResultStatistics'

import Output from '../plagiarism-result/Output';
import './LocalCheck.css'


import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

import OnlineHighlightedResult from './OnlineHighlightedResult'

import {checkPlagiarismLocal , setPlagiarismRawLocalShowDetails, setPlagiarismRawLocalHideDetails ,createRawLocalPlagiarismReport, setPlagiarismGenerateReportLoading} from '../../actions/localRawPlagiarismActions'


class LocalCheck extends Component {

    constructor(){
        super()
        this.state = {
            q: "",
            output: "",
            disableClassname: "btn btn-primary btn-block btn-flat disabled",
            id: 0,
            words: [],
            errors: {},
            option: 1,
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
        if(!this.props.localRawPlagiarism.buttonDisable){
            
            let old = this.state.q.toString();
            // let q = old.join(' ');
            // q = q.replace(/\s+/g," ");
            let abstract = true;
            if(this.props.auth.isAuthenticated){
                abstract = false;
            }
            const input = {
                q: old,
                original: this.state.q,
                raw: true,
                option: this.state.option,
                abstract,
                researches: this.props.research.researches,
                journals: this.props.journal.journals
            }
            // console.log(input)
            
            this.props.checkPlagiarismLocal(input);
        }
    }

    onClickShowDetails(id){
        
        const {output} = this.props.localRawPlagiarism;
        let newob = output.find(obj => obj.Document.Text.Id === id);
        let words=[];

        newob.Index.forEach(word => {
            let obj = JSON.parse(word);

            words.push.apply(words,obj.Pattern.split(' '))
        })

        this.setState({id, words}, ()=>{
            this.props.setPlagiarismRawLocalShowDetails();
        })
       
        
    }

    onClickHideDetails = () =>{
        this.props.setPlagiarismRawLocalHideDetails();
    }

    
    componentDidMount(){
        if(this.props.localRawPlagiarism.original){
            this.setState({q: this.props.localRawPlagiarism.original})
        }
        if(this.props.localRawPlagiarism.option>0){
            this.setState({option: this.props.localRawPlagiarism.option})
        }
        
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.localRawPlagiarism.option>0){
            this.setState({option: nextProps.localRawPlagiarism.option})
        }
        
    }

    onClickGenerateReport = () => {
        const {output, original} = this.props.localRawPlagiarism;
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

        let subTypeOfReport = "Checked in the System Database";
            if (!this.props.auth.isAuthenticated) {
              subTypeOfReport = "Checked in the System Database (ABSTRACT)"
            }
  
        const input = {
          printedBy: name,
          pattern: original,
          word,
          typeOfReport: "Plagiarism Check Result",
          subTypeOfReport,
          from: "local",
          output : this.props.localRawPlagiarism.output
        }
        this.props.createRawLocalPlagiarismReport(input);
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

    optSelect = option => {
        this.setState({option})
    }

  render() {
    const { errors } = this.props;
    const {output, loading , showDetails} = this.props.localRawPlagiarism;
    const {isAuthenticated} = this.props.auth;

    let outputItems;
    let highlightItems;

    if(loading){
        outputItems = (<div className="spinnerMainDiv">
            <p>{this.props.localRawPlagiarism.axiosProgress.tag}</p>
            <Progress
                type="circle"
                percent={this.props.localRawPlagiarism.axiosProgress.axiosProgress}
                
                /> 
                {/* <Spinner /> */}
    </div>)
    }else{
        if (Object.keys(output).length > 0) {
            outputItems = (
                <div className="outputdiv results">
                    <Output onClickShowDetails={this.onClickShowDetails} output={output} plagType="local"/>
                </div>
            );
        } else {
            outputItems = <span>Nothing to Show</span>;
        }
    }

    let options="";
    if(isAuthenticated){
        options = (
            <div>
                <div className="sourceHeader">Select Your Target</div>
                <div className="sourceContent pr-1">
                    {loading ? <div className="optionContent">
                        <button className={this.state.option === 1? "optBtnActive mr-2 ml-2 optBtn" : "mr-2 ml-2 optBtn"}>Researches</button>
                        <button className={this.state.option === 2? "optBtnActive mr-2 ml-2 optBtn" : "mr-2 ml-2 optBtn"}>Journals</button>
                    </div> : <div className="optionContent">
                        <button onClick={() => this.optSelect(1)} className={this.state.option === 1? "optBtnActive mr-2 ml-2 optBtn" : "mr-2 ml-2 optBtn"}>Researches</button>
                        <button onClick={() => this.optSelect(2)} className={this.state.option === 2? "optBtnActive mr-2 ml-2 optBtn" : "mr-2 ml-2 optBtn"}>Journals</button>
                    </div> }
                   
                </div>
            </div>
            
        )
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
        {Object.entries(this.props.localRawPlagiarism.output).length !== 0 && this.props.localRawPlagiarism.output.constructor !== Object ? 
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
                                <div className="sourceHeader">Local Result Statistics</div>
                                <div className="sourceContent">
                                    <Spring from={{ opacity: 0}}
                                            to={{  opacity: 1}}
                                            config={{delay:500, duration:800}}>
                                            {props2 =>(
                                                <div style={props2}>
                                                    <ResultStatistics height={230} output={output}/>
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
                            {options}
                            <div className="sourceHeader">Check Plagiarism Local</div>
                            <form onSubmit={this.onSubmit}>
                                <TextAreaFieldGroup 
                                    placeholder="Search Something here"
                                    name="q"
                                    onChange={this.onChange}
                                    rows="10"
                                    value={this.state.q}
                                    maxLength="10000"
                                    minLength="200"
                                    error={errors.q}
                                    extraClass="onlineTextarea"
                                />
                                {this.props.errors.errors ? <p className="text-danger">{this.props.errors.errors.noResearchForPlagiarism}</p> : ""}
                                {/* <textarea onChange={this.onChange} classname="form-control" name="q"></textarea> */}
                                {
                                    this.props.localPlagiarism.globalLoading.loading && this.props.localPlagiarism.globalLoading.number!==3 ? 
                                    <p>Plagiarism scan is currently in progress, please wait...</p>
                                    :(<button type="submit" className={this.props.localRawPlagiarism.buttonDisable ? this.state.disableClassname : "btn btn-primary btn-block btn-flat"}>{this.props.localRawPlagiarism.buttonDisable ? "Checking for plagiarism..." : "Check"}</button>)  
                                }

                                
                            </form>
                        </div>
                    )}
            </Spring>
        </div>)
    }

    const {generateReport, original} = this.props.localRawPlagiarism;
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
    )
  }
}

LocalCheck.propTypes = {
    errors: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    localRawPlagiarism : PropTypes.object.isRequired,
    localPlagiarism : PropTypes.object.isRequired,
    research: PropTypes.object.isRequired,
    checkPlagiarismLocal : PropTypes.func.isRequired,
    setPlagiarismRawLocalShowDetails : PropTypes.func.isRequired, 
    setPlagiarismRawLocalHideDetails : PropTypes.func.isRequired ,
    createRawLocalPlagiarismReport : PropTypes.func.isRequired, 
    setPlagiarismGenerateReportLoading : PropTypes.func.isRequired
}   

const mapStateToProps = (state) =>({
    errors : state.errors,
    localRawPlagiarism: state.localRawPlagiarism,
    localPlagiarism: state.localPlagiarism,
    research: state.research,
    journal: state.journal,
    auth: state.auth
})



export default connect(mapStateToProps,{checkPlagiarismLocal , setPlagiarismRawLocalShowDetails, setPlagiarismRawLocalHideDetails ,createRawLocalPlagiarismReport, setPlagiarismGenerateReportLoading})(LocalCheck)