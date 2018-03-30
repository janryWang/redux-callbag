import { createStore, applyMiddleware } from "redux"
import { pipe, filter, forEach, map } from "callbag-basics"
import createCallbagMiddleware, {
    select,
    mapFromPromise,
    mapSuccessTo,
    mapFailTo
} from "./src"
import delay from 'callbag-delay'

const  todos = (state = [], action)=> {
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

const addTodo = (payload)=> {
    return {
        type: "ADD_TODO",
        payload
    }
}

const addSomething = (payload)=> {
    return {
        type: "ADD_SOMETHING",
        payload
    }
}

const removeTodo = ()=> {
    return {
        type: "REMOVE_TODO"
    }
}



const store = createStore(
    todos,
    ["Hello world"],
    applyMiddleware(
        createCallbagMiddleware((actions, store) => {
            actions
                |> select("ADD_SOMETHING")
                |> delay(1000)
                |> forEach(({ payload }) => {
                    console.log("log:" + payload)
                })

            actions
                |> select("ADD_TODO")
                |> delay(1000)
                |> mapSuccessTo("ADD_SOMETHING",(payload)=>payload + "  23333333")
        })
    )
)

store.dispatch(addTodo("Hello redux"))
store.dispatch(addSomething("This will not add numbers"))

console.log(store.getState())

store.subscribe(()=>{
    console.log(store.getState())
})
