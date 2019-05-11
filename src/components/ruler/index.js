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
        this.startPercentage = 0;
        this.containerWidth = 0;
        this.state = {
            initialPosition: 0,
            initialPercentage: 0,
            percentage: 0.0,
            offsetWidth: 0
        };
    }

    componentDidMount() {
        // this.registerDragListener();
        this.transform();
    }

    componentWillReceiveProps(nextProps) {
        const { start, end } = this.props;
        if ('value' in nextProps) {
            let value = nextProps.value;
            if (value < start) {
                value = start;
            } else if (value > end) {
                value = end;
            }
            this.transform(value);
        }
    }

    transform = offsetWidth => {
        const { start, end, value } = this.props;
        const left = offsetWidth || value;
        const percentage = (left - start) / (end - start);
        this.setState({ percentage: Math.max(percentage, 0.0001) });
    };

    tranformScore = dragVal => {
        const { start, end, onDrag } = this.props;
        let value = Math.round(
            ((end - start) * dragVal) / this.containerWidth + start
        );
        if (value < start) {
            value = start;
        } else if (value > end) {
            value = end;
        }
        this.setState({ value });
        onDrag(value);
    };

    registerDragListener = () => {
        const { point, ruler } = this;

        const width = ruler.offsetWidth;
        this.containerWidth = width;

        const dragObserver = gestureObserver(point);

        const dragStart = ({ x }) => {
            this.startPercentage = this.state.percentage;

            this.onDragStart(x);
        };

        const dragMoves = ({ x }) => {
            let currPercentage = this.startPercentage + x / width;

            if (currPercentage > 0.99) {
                currPercentage = 0.9999;
            }

            this.setState(
                {
                    percentage: Math.max(currPercentage, 0.0001),
                    offsetWidth: currPercentage * width
                },
                () => this.onDrag(this.state.offsetWidth)
            );
        };

        const dragEnds = () => {
            this.startPercentage = 0;
            this.onDragEnd(this.state.percentage);
        };

        dragObserver.horizontalMoveStarts.forEach(dragStart);

        dragObserver.holds.forEach(dragStart);

        dragObserver.dragMoves.forEach(dragMoves);

        dragObserver.dragMoveEnds.forEach(dragEnds);

        dragObserver.horizontalMoves.forEach(dragMoves);

        dragObserver.horizontalMoveEnds.forEach(dragEnds);

        const barClickObserver = gestureObserver(ruler);

        const barClick = ({ x }) => {
            const wrapperLeft = ruler.getBoundingClientRect().left;
            let currPercentage = (x - wrapperLeft) / width;
            console.log(x - wrapperLeft);
            if (currPercentage < 0) currPercentage = 0.0001;
            this.setState(
                {
                    percentage: currPercentage,
                    offsetWidth: currPercentage * width
                },
                () => this.onDrag(this.state.offsetWidth)
            );
        };

        barClickObserver.clicks.forEach(barClick);
    };

    onDragStart = x => {};

    onDrag = x => {
        this.tranformScore(x);
    };

    onDragEnd = x => {};

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

    mouseListener = e => {
        const { initialPosition, initialPercentage } = this.state;
        const { ruler } = this;
        const width = ruler.offsetWidth;
        const diff = e.clientX - initialPosition;
        let currPercentage = initialPercentage + (100 / width) * (0.01 * diff);
        console.log((100 / width) * (0.01 * diff));
        if (currPercentage > 0.99) {
            currPercentage = 0.9999;
        }

        if (currPercentage < 0) {
            currPercentage = 0.0001;
        }

        this.setState({
            percentage: currPercentage
        });
    };

    addMouseListener = e => {
        const { percentage } = this.state;
        this.setState(
            { initialPosition: e.clientX, initialPercentage: percentage },
            () => window.addEventListener('mousemove', this.mouseListener)
        );
    };

    removeMouseListener = () => {
        window.removeEventListener('mousemove', this.mouseListener);
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
                                onMouseUp={this.removeMouseListener}
                                onMouseLeave={this.removeMouseListener}
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
