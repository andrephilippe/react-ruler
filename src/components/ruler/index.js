import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gestureObserver from '../../utils/gesture';
import './index.less';

class Ruler extends PureComponent {
    static propTypes = {
        value: PropTypes.number,
        start: PropTypes.number,
        end: PropTypes.number,
        step: PropTypes.number,
        onDrag: PropTypes.func,
        className: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            initialPosition: 0,
            initialPercentage: 0,
            percentage: 0.0
        };
    }

    round(number, increment, offset) {
        return Math.ceil((number - offset) / increment) * increment + offset;
    }

    addMouseListener = e => {
        const { percentage } = this.state;
        this.setState(
            { initialPosition: e.clientX, initialPercentage: percentage },
            () => {
                window.addEventListener('mousemove', this.mouseListener);
                window.addEventListener('mouseup', this.removeMouseListener);
            }
        );
    };

    removeMouseListener = () => {
        window.removeEventListener('mousemove', this.mouseListener);
        window.removeEventListener('mouseup', this.removeMouseListener);
    };

    mouseListener = e => {
        const { initialPosition, initialPercentage } = this.state;
        const { step, start, end } = this.props;
        const width = this.ruler.offsetWidth;
        const distance = end - start;
        const diff = e.clientX - initialPosition;
        let currPercentage =
            initialPercentage + (distance / width) * (0.01 * diff);

        if (currPercentage > 0.99) {
            currPercentage = 0.9999;
        }

        if (currPercentage < 0) {
            currPercentage = 0.0;
        }

        this.setState({
            percentage:
                this.round(currPercentage * distance, step, 0) / distance
        });
    };

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
        const { percentage } = this.state;
        const { start, value } = this.props;
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
                        <div
                            className="ruler-drag"
                            style={{
                                transform: `scaleX(${percentage})`
                            }}
                        >
                            <div
                                className="ruler-point"
                                ref={ref => {
                                    this.point = ref;
                                }}
                                style={{
                                    transform: `scaleX(${1 / percentage})`
                                }}
                                onMouseDown={this.addMouseListener}
                            >
                                <div className="point">{value || start}</div>
                                <div className="ruler-line" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Ruler;
