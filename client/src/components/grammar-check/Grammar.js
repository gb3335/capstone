import React, { Component } from 'react'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable'

import {checkGrammar, clearError} from '../../actions/grammarActions';

import './Grammar.css'

class Grammar extends Component {
    constructor(){
        super()
        this.state = {
            html: "",
            original: "",
            matches: [],
            classes: [],
            id: "",
            output: {},
            top: 0,
            left: 0,
            display: "none",
            visible: false,
            broHeight: 0,
            broWidth: 0
        }
        this.menuRef = React.createRef();
        this.contentEditable = React.createRef();
        this.onGetValue = this.onGetValue.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.props.clearError();
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
      }
      
      componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
      }
      
      updateWindowDimensions() {
        this.setState({ broWidth: window.innerWidth, broHeight: window.innerHeight });
        
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
            this.setState({html: newhtml, matches})
        }
    }

    onCorrect = (e) => {
        let el = e.target;
        // console.log(this.menuRef.current)
        if(el.id){
            if(this.state.broWidth<963){
                this.setState({
                    id:el.id,
                    top: e.pageY+20,
                    left: e.pageX-150,
                    display: "table"
                })

            }else{
                this.setState({
                    id:el.id,
                    top: e.pageY+20,
                    left: e.pageX-340,
                    display: "table"
                })
            }
            
        }else{
            this.setState({
                id:"",
                top: 0,
                left: 0,
                display: "none"
            })

        }
    }

    onGetValue = (index) => {
        this.contentEditable.current.children[this.state.id].innerHTML = this.menuRef.current.children[index].innerHTML;
        this.contentEditable.current.children[this.state.id].className = "";
        this.contentEditable.current.children[this.state.id].id = "";
        this.setState({
            html: this.contentEditable.current.innerHTML,
            id:"",
            top: 0,
            left: 0,
            display: "none"
        })
    }

    onGrammarCheck = () => {
        let html = this.contentEditable.current.innerText;
        // html = html.replace(/\s+/g," ");
        this.setState({original:html})
        const input = {
            input: html
        }
        this.setState({id:""})
        this.props.checkGrammar(input);
    }

    handleChange = evt => {
        this.setState({html: evt.target.value});
    };


  render() {

    const {matches, id} = this.state
    let items;
    let message;
    if(id!==""){
        message = <li className="message" key={id}>{matches[id].message}</li>

        items = matches[id].replacements.map((replacement, index) =>(
            <li className="suggest" onClick={() => this.onGetValue(index)} key={index}>{replacement.value}</li>
        ))
    }
        
    
    const {loading} = this.props.grammar
    



    return (
      <div className="container">
        <div className="sourceResearch">
        
            <ul className="menu" style={{display: this.state.display, top: this.state.top, left: this.state.left}}>
                    {message}
                    <div className="suggestDiv" ref={this.menuRef}>
                        {items}
                    </div>
                
            </ul>
            
            <div className="sourceHeader">Grammar Checker</div>
            <div className="sourceContents is-invalid">
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
            {this.props.errors ? <p className="error">{this.props.errors.grammarInput}</p> : ""}
            {loading ? <button className="btn btn-primary btn-block btn-flat disabled">Checking Grammar...</button>
                    : <button onClick={this.onGrammarCheck} className="btn btn-primary btn-block btn-flat">Check Grammar</button>
            }
            
            {/* {JSON.stringify(this.state.output)} */}
        </div>
      </div>
    )
  }
}

Grammar.propTypes = {
    checkGrammar: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    grammar: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    errors : state.errors,
    grammar: state.grammar,
})


export default connect(mapStateToProps, {checkGrammar,clearError})(Grammar)