# rc-ruler-slider

> Slider component for React 

![alt text](https://i.imgur.com/MI2pqB1.png)

## Install

```bash
npm install rc-ruler-slider --save
```

## Usage

``` js
import Ruler from 'rc-ruler-slider/dist';
import 'rc-ruler-slider/dist/index.css';
```

``` js
handleDragChange = (value) => {
   console.log(value);
}

handleDragEnd = (value) => {
   console.log(value);
}

handleDragStart = (value) => {
   console.log(value);
}

handleRenderValue = (value) => {
   return `${value}%`;
}

<Ruler
   startValue={50}
   onDrag={this.handleDragChange}
   onDragEnd={this.handleDragEnd}
   onDragStart={this.handleDragStart}
   renderValue={this.handleRenderValue)
   start={0}
   end={90}
   step={1}
/>
```

## Proptypes

```js
   propTypes: {

      // current value
      value: PropTypes.number,

      // start value
      start: PropTypes.number,

      // end value
      end: PropTypes.number,

      // step of drag
      step: PropTypes.number,

      // handle drag function
      onDrag: PropTypes.func,
      
      // handle drag end function
      onDragEnd: PropTypes.func,
      
      // handle drag start function
      onDragStart: PropTypes.func,

      // class of component
      className: PropTypes.string,
   }
```


## License

[MIT][mit-license]

[mit-license]: ./LICENSE
