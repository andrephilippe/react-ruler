import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/elementAt';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/timer';

export default function getDragObservables(domItem) {
    const preventDefault = event => {
        return event.preventDefault();
    };
    const mouseEventToCoordinate = mouseEvent => {
        preventDefault(mouseEvent);
        return { x: mouseEvent.clientX, y: mouseEvent.clientY };
    };
    const touchEventToCoordinate = touchEvent => {
        preventDefault(touchEvent);
        return {
            x: touchEvent.changedTouches[0].clientX,
            y: touchEvent.changedTouches[0].clientY
        };
    };

    let mouseDowns = Observable.fromEvent(domItem, 'mousedown').map(
        mouseEventToCoordinate
    );
    let mouseMoves = Observable.fromEvent(window, 'mousemove').map(
        mouseEventToCoordinate
    );
    let mouseUps = Observable.fromEvent(window, 'mouseup').map(
        mouseEventToCoordinate
    );

    let touchStarts = Observable.fromEvent(domItem, 'touchstart').map(
        touchEventToCoordinate
    );
    let touchMoves = Observable.fromEvent(domItem, 'touchmove').map(
        touchEventToCoordinate
    );
    let touchEnds = Observable.fromEvent(window, 'touchend').map(
        touchEventToCoordinate
    );
    let touchCancels = Observable.fromEvent(window, 'touchcancel').map(
        touchEventToCoordinate
    );

    let _starts = mouseDowns.merge(touchStarts);
    let _moves = mouseMoves.merge(touchMoves);
    let _ends = mouseUps.merge(touchEnds).merge(touchCancels);

    const HOLDING_PERIOD = 500; // milliseconds

    // Clicks: Take the start-end pairs only if no more than 3 move events happen in between, and the end event is within the holding period
    let clicks = _starts.concatMap(() =>
        _ends
            .first()
            .takeUntil(_moves.elementAt(3))
            .takeUntil(Observable.timer(HOLDING_PERIOD))
            .catch(() => Observable.empty())
    );

    // Holds: Take those starts where no end event and no more than 3 move event occurs during the holding period
    let holds = _starts.concatMap(dragStartEvent =>
        Observable.timer(HOLDING_PERIOD)
            .takeUntil(_moves.elementAt(3))
            .takeUntil(_ends)
            .map(() => ({ x: dragStartEvent.x, y: dragStartEvent.y }))
            .catch(() => Observable.empty())
    );

    // Move starts with direction: Pair the move start events with the 3rd subsequent move event,
    // but only if it happens during the holdign period and no end event happens in between
    let moveStartsWithDirection = _starts.concatMap(dragStartEvent =>
        _moves
            .takeUntil(_ends)
            .takeUntil(Observable.timer(HOLDING_PERIOD))
            .elementAt(3)
            .catch(() => Observable.empty())
            .map(dragEvent => {
                const intialDeltaX = dragEvent.x - dragStartEvent.x;
                const initialDeltaY = dragEvent.y - dragStartEvent.y;
                return {
                    x: dragStartEvent.x,
                    y: dragStartEvent.y,
                    intialDeltaX,
                    initialDeltaY
                };
            })
    );

    // Vertical move starts: Keep only those move start events where the 3rd subsequent move event is rather vertical than horizontal
    let verticalMoveStarts = moveStartsWithDirection.filter(
        dragStartEvent =>
            Math.abs(dragStartEvent.intialDeltaX) <
            Math.abs(dragStartEvent.initialDeltaY)
    );

    // Horizontal move starts: Keep only those move start events where the 3rd subsequent move event is rather horizontal than vertical
    let horizontalMoveStarts = moveStartsWithDirection.filter(
        dragStartEvent =>
            Math.abs(dragStartEvent.intialDeltaX) >=
            Math.abs(dragStartEvent.initialDeltaY)
    );

    // Take the moves until an end occurs
    const movesUntilEnds = dragStartEvent =>
        _moves.takeUntil(_ends).map(dragEvent => {
            const x = dragEvent.x - dragStartEvent.x;
            const y = dragEvent.y - dragStartEvent.y;
            return { x, y };
        });

    let verticalMoves = verticalMoveStarts.concatMap(movesUntilEnds);
    let horizontalMoves = horizontalMoveStarts.concatMap(movesUntilEnds);
    let dragMoves = holds.concatMap(movesUntilEnds);

    const fastMoveAtEnds = dragStartEvent =>
        _ends
            .first()
            .takeUntil(Observable.timer(HOLDING_PERIOD))
            .map(dragEndEvent => {
                const x = dragEndEvent.x - dragStartEvent.x;
                const y = dragEndEvent.y - dragStartEvent.y;
                return { x, y };
            });

    const lastMovesAtEnds = dragStartEvent =>
        _ends.first().map(dragEndEvent => {
            const x = dragEndEvent.x - dragStartEvent.x;
            const y = dragEndEvent.y - dragStartEvent.y;
            return { x, y };
        });

    // let ends = _starts.concatMap(lastMovesAtEnds);
    let verticalMoveEnds = verticalMoveStarts.concatMap(lastMovesAtEnds);
    let horizontalMoveEnds = horizontalMoveStarts.concatMap(lastMovesAtEnds);
    let dragMoveEnds = holds.concatMap(lastMovesAtEnds);
    let verticalSwipe = verticalMoveStarts.concatMap(fastMoveAtEnds);
    let horizontalSwipe = horizontalMoveStarts.concatMap(fastMoveAtEnds);

    return {
        clicks,
        holds,
        verticalMoveStarts,
        horizontalMoveStarts,
        verticalMoves,
        horizontalMoves,
        verticalMoveEnds,
        horizontalMoveEnds,
        dragMoves,
        dragMoveEnds,
        verticalSwipe,
        horizontalSwipe
    };
}
