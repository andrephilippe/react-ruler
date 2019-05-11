import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Pointer from './pointer';
import './index.less';

class Ruler extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    renderRuler = () => {
        const { start, end, step } = this.props;
        const stepWidth = (100 * step) / (end - start);
        let ruleDom = [];
        let ruleDiv;
        for (let i = start; i < end + step; i += step) {
            if (i % 10 === 0 || i === end || (step === 1 && i % 5 === 0)) {
                ruleDiv = (
                    <div
                        key={i}
                        className="rule-mark"
                        style={
                            i === end + 1 || i === end
                                ? {}
                                : { width: `${stepWidth}%` }
                        }
                    >
                        <div className="line-text">
                            {i === end + 1 ? end : i}
                        </div>
                        <div className="line" />
                    </div>
                );
            } else {
                ruleDiv = (
                    <span
                        key={i}
                        className="line"
                        style={{ width: `${stepWidth}%` }}
                    />
                );
            }
            ruleDom.push(ruleDiv);
        }
        return ruleDom;
    };

    render() {
        const { loading } = this.state;
        return (
            <div className="react-ruler-wrapper">
                <div className="ruler-container">
                    <div
                        className="ruler-wrapper"
                        ref={list => {
                            this.ruler = list;
                        }}
                    >
                        <div className="ruler-list">{this.renderRuler()}</div>
                        {!loading ? (
                            <Pointer {...this.props} ruler={this.ruler} />
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        setTimeout(() => this.setState({ loading: false }), 500);
    }

    static propTypes = {
        startValue: PropTypes.number,
        start: PropTypes.number,
        end: PropTypes.number,
        step: PropTypes.number,
        onDrag: PropTypes.func,
        className: PropTypes.string
    };

    static defaultProps = {
        step: 1
    };
}

export default Ruler;
