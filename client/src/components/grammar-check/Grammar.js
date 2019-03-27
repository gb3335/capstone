import React, { Component } from 'react'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable'
import stripHtml from "string-strip-html";

import {checkGrammar} from '../../actions/grammarActions';

import './Grammar.css'

class Grammar extends Component {
    constructor(){
        super()
        this.state = {
            html: "<u class='spellingError'>wer</u>",
            original: "",
            output: {}
        }
        this.contentEditable = React.createRef();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.grammar.output !== this.props.grammar.output){
            const {matches} = nextProps.grammar.output.grammar.data;
            let newhtml = this.state.original;
            let spellFront = "<u class='spellingError'"
            let spellBack = "</u>"

            let grammarFront = "<u class='grammarsError'"
            let grammarBack = "</u>"

            newhtml = newhtml.split('');
            

            this.setState({output: nextProps.grammar.output})
            if(matches.length>0){
                matches.forEach((match,index) => {
                    if(match.shortMessage==="Spelling mistake"){
                        newhtml[match.offset] = `${spellFront} id='${index}'>${newhtml[match.offset]}`;
                        newhtml[match.offset+match.length-1] = newhtml[match.offset+match.length-1]+spellBack;
                    }else{
                        newhtml[match.offset] = `${grammarFront} id='${index}'>${newhtml[match.offset]}`;
                        newhtml[match.offset+match.length-1] = newhtml[match.offset+match.length-1]+grammarBack;
                    }
                    
                    
                });
            }
            newhtml = newhtml.join('');
            this.setState({html: newhtml})
        }
    }

    onCorrect = (e) => {
        let el = e.target;
        const {matches} = this.props.grammar.output.grammar.data;
        // while (el && el !== e.currentTarget && el.className !== "spellingError") {
        //     el = el.parentNode;
        // }

        console.log(el.id)

        // if (el && el.className === "spellingError") {
        //     //this.setState(({clicks}) => ({clicks: clicks + 1}));
        //     console.log(123)
        // }
    }

    onGrammarCheck = () => {
        let html = stripHtml(this.state.html);
        html = html.replace(/\s+/g," ");
        this.setState({original:html})
        const input = {
            input: html
        }

        this.props.checkGrammar(input);
    }

    handleChange = evt => {
        this.setState({html: evt.target.value});
    };

  render() {
    return (
      <div className="container">
        <div className="sourceResearch">
            <div className="sourceHeader">Check Grammar</div>
            <div className="sourceContents">
                <ContentEditable
                    spellCheck="false"
                    className="editableDiv"
                    innerRef={this.contentEditable}
                    html={this.state.html} // innerHTML of the editable div
                    disabled={false}       // use true to disable editing
                    onChange={this.handleChange} // handle innerHTML change
                    tagName='p'
                    onClick={this.onCorrect}
                />
                
            </div>
            <button onClick={this.onGrammarCheck} className="btn btn-primary btn-block btn-flat">Check Grammar</button>
            {/* {JSON.stringify(this.state.output)} */}
        </div>
      </div>
    )
  }
}

Grammar.propTypes = {
    checkGrammar: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    grammar: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    errors : state.errors,
    grammar: state.grammar,
})


export default connect(mapStateToProps, {checkGrammar})(Grammar)