# redux-callbag

> Redux middleware for action side effects with [callbag](https://github.com/callbag/callbag)
>
> You may not need redux-saga/redux-observable



## Install

```
npm install --save  redux-callbag
```

## Usage

```
import { createStore,applyMiddleware } from 'redux'
import {pipe,filter,forEach,map} from 'callbag-basics'
import createCallbagMiddleware from 'redux-callbag'

function todos(state = [], action) {
    switch (action.type) {
      case 'ADD_TODO':
        return state.concat([action.payload])
      case 'REMOVE_TODO':
        return []
      case 'ADD_SOMETHING':
        return state.concat([action.payload])
      default:
        return state
    }
}

function addTodo(payload){
    return {
        type:'ADD_TODO',
        payload
    }
}

function addSomething(payload){
    return {
        type:'ADD_SOMETHING',
        payload
    }
}

function removeTodo(){
    return {
        type:'REMOVE_TODO'
    }
}

const typeOf =(_type)=>{
    return ({type})=>{
        return type === _type
    }
}

const store = createStore(
    todos,
    ['Hello world'],
    applyMiddleware(
        createCallbagMiddleware((actions,store)=>{

            
            actions |>
                filter(typeOf('ADD_SOMETHING')) |>
                forEach(({payload})=>{
                    console.log('log:'+payload)
                })
        

        
            actions |>
                filter(typeOf('ADD_TODO')) |>
                forEach(({payload})=>{
                    setTimeout(()=>{
                        store.dispatch(addSomething(payload+'  23333333'))
                    })
                    
                })
            
            // this is not pipeline syntax usecase
            // pipe(
            //     actions,
            //     filter(typeOf('ADD_SOMETHING')),
            //     forEach(({payload})=>{
            //         console.log('log:'+payload)
            //     })
            // )

            // pipe(
            //     actions,
            //     filter(typeOf('ADD_TODO')),
            //     forEach(({payload})=>{
            //         setTimeout(()=>{
            //             store.dispatch(addSomething(payload+'  23333333'))
            //         })
                    
            //     })
            // )

            
        })
    )
)

store.dispatch(addTodo('Hello redux'))
store.dispatch(addSomething('This will not add numbers'))

store.subscribe(()=>{
    console.log(store.getState())
})



```

### LICENSE

The MIT License (MIT)

Copyright (c) 2018 JanryWang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.