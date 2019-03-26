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
            html: "",
            original: "",
            output: {}
        }
        this.contentEditable = React.createRef();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.grammar.output !== this.props.grammar.output){
            const {matches} = nextProps.grammar.output.grammar.data;
            let newhtml = this.state.original;
            let spellFront = "<u className='spellingError'>"
            let spellBack = "</u>"
            let spelllen = 33;

            let grammarFront = "<u className='grammarsError'>"
            let grammarBack = "</u>"
            let grammarlen = 33

            let addflag=0;

            this.setState({output: nextProps.grammar.output})
            if(matches.length>0){
                matches.forEach(match => {
                    if(addflag===0){
                        if(match.shortMessage==="Spelling mistake"){
                            newhtml = [newhtml.slice(0, match.offset), spellFront, newhtml.slice(match.offset)].join('');
                            newhtml = [newhtml.slice(0, match.length+spellFront.length), spellBack, newhtml.slice(match.length+spellFront.length)].join('');
                            addflag=1;
                        }else{
                            newhtml = [newhtml.slice(0, match.offset), grammarFront, newhtml.slice(match.offset)].join('');
                            newhtml = [newhtml.slice(0, match.offset+match.length+grammarFront.length), grammarBack, newhtml.slice(match.offset+match.length+grammarFront.length)].join('');
                            addflag=1;
                        }
                    }else{
                        if(match.shortMessage==="Spelling mistake"){
                            newhtml = [newhtml.slice(0, match.offset+33), spellFront, newhtml.slice(match.offset+33)].join('');
                            newhtml = [newhtml.slice(0, match.offset+match.length+33+spellFront.length), spellBack, newhtml.slice(match.offset+match.length+33+spellFront.length)].join('');
                        }else{
                            newhtml = [newhtml.slice(0, match.offset+33), grammarFront, newhtml.slice(match.offset+33)].join('');
                            newhtml = [newhtml.slice(0, match.offset+match.length+33+grammarFront.length), grammarBack, newhtml.slice(match.offset+match.length+33+grammarFront.length)].join('');
                        }
                    }
                    
                });
                this.setState({html: newhtml})
            }
        }
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
            <div className="sourceContent">
                <ContentEditable
                    className="editableDiv"
                    innerRef={this.contentEditable}
                    html={this.state.html} // innerHTML of the editable div
                    disabled={false}       // use true to disable editing
                    onChange={this.handleChange} // handle innerHTML change
                    tagName='p'
                />
                
            </div>
            <button onClick={this.onGrammarCheck} className="btn btn-primary btn-block btn-flat">Check Grammar</button>
            {JSON.stringify(this.state.output)}
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