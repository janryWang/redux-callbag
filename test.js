import { createStore, applyMiddleware } from "redux"
import { pipe, filter, forEach, map } from "callbag-basics"
import createCallbagMiddleware from "./index"

function todos(state = [], action) {
    switch (action.type) {
        case "ADD_TODO":
            return state.concat([action.payload])
        case "REMOVE_TODO":
            return []
        case "ADD_SOMETHING":
            return state.concat([action.payload])
        default:
            return state
    }
}

function addTodo(payload) {
    return {
        type: "ADD_TODO",
        payload
    }
}

function addSomething(payload) {
    return {
        type: "ADD_SOMETHING",
        payload
    }
}

function removeTodo() {
    return {
        type: "REMOVE_TODO"
    }
}

const typeOf = _type => {
    return ({ type }) => {
        return type === _type
    }
}

const store = createStore(
    todos,
    ["Hello world"],
    applyMiddleware(
        createCallbagMiddleware((actions, store) => {
            actions
                |> filter(typeOf("ADD_SOMETHING"))
                |> forEach(({ payload }) => {
                    console.log("log:" + payload)
                })

            actions
                |> filter(typeOf("ADD_TODO"))
                |> forEach(({ payload }) => {
                    setTimeout(() => {
                        store.dispatch(addSomething(payload + "  23333333"))
                    })
                })

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

store.dispatch(addTodo("Hello redux"))
store.dispatch(addSomething("This will not add numbers"))

store.subscribe(() => {
    console.log(store.getState())
})
