import React from 'react';
import ReactDOM from 'react-dom';
import './FormBuilder.css';

class FormBuilder extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.defaultValues && Object.keys(nextProps.defaultValues).length) {
            return {
                ...nextProps.defaultValues
            }
        } else {
            // Assign default values of "" to our controlled input
            // If we don't do this, React will throw the error
            // that Input elements should not switch from uncontrolled to controlled 
            // or (vice versa)

            let initialState = nextProps.model.reduce((acc, m) => {
                acc[m.key] = m.value ? m.value : "";
                return acc;
            },{});
            return {
                ...initialState
            }
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        if (this.props.onSubmit) this.props.onSubmit(this.state);
    }

    onChange = (e, key,type="single") => {
        let items = this.state;
        if (type === "single") {
            items[key] = e.target.value;
            this.setState({
                [key]:e.target.value
            });  
        } else {
            // Array of values (e.g. checkbox): TODO: Optimization needed.
            let found = this.state[key] ?  
                            this.state[key].find ((d) => d === e.target.value) : false;
            
            if (found) {
                let data = this.state[key].filter((d) => {
                    return d !== found;
                });
                // items[key] = data;
                this.setState({
                    [key]: data
                });
            } else {
                // items[key] = [e.target.value, ...this.state[key]];
                this.setState({
                    [key]: [e.target.value, ...this.state[key]]
                });
            }
            // this.setState(
            //     items
            // );  
        }
    }


    renderForm = () => {
        let model = this.props.model;
        let defaultValues = this.props.defaultValues;
        
        let formUI = model.map((m) => {
            let key = m.key;
            let type = m.type || "text";
            let props = m.props || {};
            let name= m.name;
            let value = m.value;

            let target = key;  
            value = this.state[target];

            let input =  <input {...props}
                    className="form-input"
                    type={type}
                    key={key}
                    name={name}
                    value={value}
                    onChange={(e)=>{this.onChange(e, target)}}
                />;

            if (type == "radio") {
               input = m.options.map((o) => {
                   let checked = o.value == value;
                    return (
                        <React.Fragment key={'fr' + o.key}>
                            <input {...props}
                                    className="form-input"
                                    type={type}
                                    key={o.key}
                                    name={o.name}
                                    checked={checked}
                                    value={o.value}
                                    onChange={(e)=>{this.onChange(e, o.name)}}
                            />
                            <label key={"ll" +o.key }>{o.label}</label>
                        </React.Fragment>
                    );
               });
               input = <div className ="form-group-radio">{input}</div>;
            }

            if (type == "select") {
                input = m.options.map((o) => {
                    let checked = o.value == value;
                     return (
                            <option {...props}
                                className="form-input"
                                key={o.key}
                                value={o.value}
                                checked={checked}
                            >{o.value}</option>
                     );
                });
                input = <select value={value} onChange={(e)=>{this.onChange(e, m.key)}}>{input}</select>;
             }

             if (type == "checkbox") {
                input = m.options.map((o) => {
                    
                    //let checked = o.value == value;
                    let checked = false;
                    if (value && value.length > 0) {
                        checked = value.indexOf(o.value) > -1 ? true: false;
                    }
                     return (
                        <React.Fragment key={"cfr" + o.key}>
                            <input {...props}
                                className="form-input"
                                type={type}
                                key={o.key}
                                name={o.name}
                                checked={checked}
                                value={o.value}
                                onChange={(e)=>{this.onChange(e, m.key,"multiple")}}
                            />
                            <label key={"ll" +o.key }>{o.label}</label>
                        </React.Fragment>
                     );
                });

                input = <div className ="form-group-checkbox">{input}</div>;

             }
            
            return (
                <div key={'g' + key} className="form-group">
                    <label className="form-label"
                        key={"l" + key}
                        htmlFor={key}>
                        {m.label}
                    </label>
                    {input}
                </div>
            );
        });
        return formUI;
    }

    render () {
        let title = this.props.title || "Dynamic Form";

        return (
            <div className={this.props.className}>
                <h3 className="form-title">{title}</h3>
                <form className="dynamic-form" onSubmit={(e)=>{this.onSubmit(e)}}>
                    {this.renderForm()}
                    <div className="form-actions">
                        <button type="submit">submit</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default FormBuilder;