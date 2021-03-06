import React, { Component } from 'react';
import { Form } from 'antd';
import Ruler from './components/ruler';
import RulerInput from './container/RulerInput';
import logo from './assets/logo.svg';
import 'antd/dist/antd.css';

const FormItem = Form.Item;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    handleDragChange = value => {
        this.setState({ value });
    };

    handleDragEnd = value => {
        console.log(`drag end: ${value}`);
    };

    handleDragStart = value => {
        console.log(`drag start: ${value}`);
    };

    render() {
        const { value } = this.state;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">
                        Welcome to React Ruler Component
                    </h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to
                    reload.
                </p>
                <div className="content">
                    <h3>Ruler {value}</h3>
                    <div className="custom-ruler">
                        <Ruler
                            startValue={10}
                            start={0}
                            end={20}
                            step={1}
                            renderValue={value => `${value}%`}
                            className="ruler"
                            onDrag={this.handleDragChange}
                            onDragEnd={this.handleDragEnd}
                            onDragStart={this.handleDragStart}
                        />
                    </div> 
                    <div className="form-ruler">
                        <h3>Antd Form</h3>
                        <Form>
                            <FormItem>
                                {getFieldDecorator('score', {
                                    initialValue: 13,
                                    rules: [{ type: 'number' }]
                                })(<RulerInput start={10} end={19} step={1} />)}
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(App);
