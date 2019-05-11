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
    }

    round(number, increment, offset) {
        return Math.ceil((number - offset) / increment) * increment + offset;
    }

    drag = ({ clientX }) => {
        const { initialMousePosition, initialPosition } = this.state;
        const { step, start, end, onDrag, ruler } = this.props;
        const rulerWidth = ruler.offsetWidth;
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
        const value = Number(((distance / 100) * percentage).toFixed(0));
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
                >
                    <div className="point">{currentValue + start}</div>
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
        start: PropTypes.number,
        end: PropTypes.number,
        step: PropTypes.number,
        onDrag: PropTypes.func,
        ruler: PropTypes.any
    };
}

export default Pointer;
