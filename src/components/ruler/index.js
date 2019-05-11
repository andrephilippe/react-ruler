import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.less';

class Ruler extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            initialPosition: 0,
            initialMousePosition: 0,
            position: 0,
            currentValue: 0
        };
    }

    round(number, increment, offset) {
        return Math.ceil((number - offset) / increment) * increment + offset;
    }

    drag = ({ clientX }) => {
        const { initialMousePosition, initialPosition } = this.state;
        const { step, start, end, onDrag } = this.props;
        const rulerWidth = this.ruler.offsetWidth;
        const distance = end - start;
        const diff = clientX - initialMousePosition;
        let position = this.round(
            initialPosition + diff,
            (rulerWidth * step) / (end - start),
            0
        );
        if (position > rulerWidth) {
            position = rulerWidth;
        }
        if (position < 0) {
            position = 0;
        }
        const percentage = (position * 100) / rulerWidth;
        const value = ((distance / 100) * percentage).toFixed(0);
        this.setState(
            {
                position,
                currentValue: value
            },
            () => onDrag(value)
        );
    };

    addMouseListener = e => {
        const { position } = this.state;
        this.setState(
            { initialMousePosition: e.clientX, initialPosition: position },
            () => {
                window.addEventListener('mousemove', this.drag);
                window.addEventListener('mouseup', this.removeMouseListener);
            }
        );
    };

    removeMouseListener = () => {
        window.removeEventListener('mousemove', this.drag);
        window.removeEventListener('mouseup', this.removeMouseListener);
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
        const { position, currentValue } = this.state;
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
                        <div className="ruler-drag">
                            <div
                                className="ruler-point"
                                style={{
                                    left: `${position}px`
                                }}
                                onMouseDown={this.addMouseListener}
                            >
                                <div className="point">{currentValue}</div>
                                <div className="ruler-line" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const { startValue, start, end } = this.props;
        if (startValue) {
            const distance = end - start;
            const percentage = (startValue * 100) / distance;
            const rulerWidth = this.ruler.offsetWidth;
            const rulerPercentage = (rulerWidth / 100) * percentage;
            this.drag({ clientX: rulerPercentage });
        }
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
