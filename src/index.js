import mitt from "mitt"
import mapPromise from "callbag-map-promise"
import filter from "callbag-filter"
import share from "callbag-share"

const isFn = val => typeof val === "function"
const getPayload = d => (d && d.payload !== undefined ? d.payload : d)

export const INIT_TYPE = "@REDUX_CALLBAG_INIT@"

export default (...epicses) => {
    return store => {
        const emitter = mitt()
        const actions = share((start, sink) => {
            if (start !== 0) return
            const handler = ev => sink(1, ev)
            sink(0, (t, d) => {
                if (t === 2) {
                    emitter.off("action", handler)
                }
            })
            emitter.on("action", handler)
        })

        actions.select = (...types) => source => {
            if (types.length == 0) types = [INIT_TYPE]
            return filter(({ type }) => {
                return types.some(_type => {
                    if (_type == "INIT") _type = INIT_TYPE
                    return _type == type
                })
            })(source)
        }

        actions.mapPromise = mapPromise

        actions.mapSuccessTo = (actionType, fn) => source => {
            let talkback

            source(0, (t, d) => {
                if (t === 0) {
                    talkback = d
                }

                if (t === 1) {
                    store.dispatch({
                        type: actionType,
                        payload: isFn(fn) ? fn(getPayload(d)) : getPayload(d)
                    })
                }
            })

            return (t, sink) => {
                if (t !== 0) return
                source(0, (t, d) => {
                    sink(t, d)
                })
            }
        }

        actions.mapFailTo = (actionType, fn) => source => {
            let talkback

            source(0, (t, d) => {
                if (t === 0) {
                    talkback = d
                }

                if (t === 2 && d !== undefined) {
                    store.dispatch({
                        type: actionType,
                        payload: isFn(fn) ? fn(getPayload(d)) : getPayload(d)
                    })
                }
            })

            return (t, sink) => {
                if (t !== 0) return
                source(0, (t, d) => {
                    sink(t, d)
                })
            }
        }

        epicses.forEach(epics => {
            if (typeof epics === "function") {
                epics(actions, store)
            }
        })

        emitter.emit("action", {
            type: INIT_TYPE
        })

        return next => {
            return action => {
                emitter.emit("action", action)
                return next(action)
            }
        }
    }
}
