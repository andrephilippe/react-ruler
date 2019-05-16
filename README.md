# rc-ruler

> Ruler component for React

# Why

![设计稿](./src/assets/ui.png "设计稿")

*为了实现上面的设计，折腾了一个这样的轮子。*

### 效果如下
![效果](./src/assets/result.png "效果")

* 仅支持PC端
* 支持拖拽、点击来选择相应的值
* 可以和Ant-Design的Form结合
* 依赖rxjs处理事件(按需加载)



## Install

```bash
npm install rc-ruler --save
```

## Usage

``` js
import Ruler from 'rc-ruler/dist';
import 'rc-ruler/dist/index.css';
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

<Ruler
   value={value}
   onDrag={this.handleDragChange}
   onDragEnd={this.handleDragEnd}
   onDragStart={this.handleDragStart}
   start={20}
   end={99}
   step={2}
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
