import React from 'react';
import PropTypes from 'prop-types';

class Pointer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPosition: 0,
            initialMousePosition: 0,
            position: 0,
            currentValue: 0
        };
        this.pointer = React.createRef();
    }

    round(number, increment, offset) {
        return Math.ceil((number - offset) / increment) * increment + offset;
    }

    drag = e => {
        const { initialMousePosition, initialPosition } = this.state;
        const { step, start, end, onDrag, ruler } = this.props;
        const rulerWidth = ruler.offsetWidth;
        const distance = end - start;
        const diff =
            (e.clientX ? e.clientX : e.touches[0].clientX) -
            initialMousePosition;
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
        const value = Number(((distance / 100) * percentage).toFixed(0));
        this.setState(
            {
                position,
                currentValue: value
            },
            () => {
                if (onDrag) {
                    () => onDrag(value);
                }
            }
        );
    };

    addMouseListener = e => {
        const { onDragStart } = this.props;
        const { position, currentValue } = this.state;
        this.setState(
            { initialMousePosition: e.clientX, initialPosition: position },
            () => {
                window.addEventListener('mousemove', this.drag);
                window.addEventListener('mouseup', this.removeMouseListener);
                if (onDragStart) {
                    onDragStart(currentValue);
                }
            }
        );
    };

    addTouchListener = e => {
        const { onDragStart } = this.props;
        const { position, currentValue } = this.state;
        this.setState(
            {
                initialMousePosition: e.touches[0].clientX,
                initialPosition: position
            },
            () => {
                window.addEventListener('touchmove', this.drag);
                window.addEventListener('touchend', this.removeTouchListener);
                if (onDragStart) {
                    onDragStart(currentValue);
                }
            }
        );
    };

    removeMouseListener = () => {
        const { onDragEnd } = this.props;
        const { currentValue } = this.state;
        window.removeEventListener('mousemove', this.drag);
        window.removeEventListener('mouseup', this.removeMouseListener);
        if (onDragEnd) {
            onDragEnd(currentValue);
        }
    };

    removeTouchListener = () => {
        const { onDragEnd } = this.props;
        const { currentValue } = this.state;
        window.removeEventListener('touchmove', this.drag);
        window.removeEventListener('touchend', this.removeTouchListener);
        if (onDragEnd) {
            onDragEnd(currentValue);
        }
    };

    renderValue(value) {
        const { renderValue } = this.props;
        if (renderValue) {
            return renderValue(value);
        }
        return value;
    }

    render() {
        const { position, currentValue } = this.state;
        const { start } = this.props;
        return (
            <div className="ruler-drag">
                <div
                    className="ruler-point"
                    style={{
                        left: `${position}px`
                    }}
                    onMouseDown={this.addMouseListener}
                    onTouchStart={this.addTouchListener}
                >
                    <div
                        className="point"
                        ref={this.pointer}
                        style={{
                            left: `-${
                                this.pointer.current
                                    ? this.pointer.current.offsetWidth / 2 - 1
                                    : 23
                            }px`
                        }}
                    >
                        {this.renderValue(currentValue + start)}
                    </div>
                    <div className="ruler-line" />
                </div>
            </div>
        );
    }

    componentDidMount() {
        const { startValue, start, end, ruler } = this.props;
        if (startValue) {
            const distance = end - start;
            const percentage = (startValue * 100) / distance;
            const rulerWidth = ruler.offsetWidth;
            const rulerPercentage = (rulerWidth / 100) * percentage;
            this.drag({ clientX: rulerPercentage });
        }
    }

    static propTypes = {
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        ruler: PropTypes.any.isRequired,
        renderValue: PropTypes.func,
        onDrag: PropTypes.func,
        onDragEnd: PropTypes.func,
        onDragStart: PropTypes.func
    };
}

export default Pointer;
