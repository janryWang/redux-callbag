import mitt from "mitt"
import mapPromise from "callbag-map-promise"
import filter from "callbag-filter"

const isFn = val => typeof val === "function"

export const INIT_TYPE = "@REDUX_CALLBAG_INIT@"

export default (...epicses) => {
    return store => {
        const emitter = mitt()
        const actions = (start, sink) => {
            if (start !== 0) return
            const handler = ev => sink(1, ev)
            sink(0, (t, d) => {
                if (t === 2) {
                    emitter.off("action", handler)
                }
                if (t === 1) {
                    if (d && d.action) {
                        store.dispatch(d.action)
                    }
                }
            })
            emitter.on("action", handler)
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

export const mapFromPromise = mapPromise

export const select = (_type = INIT_TYPE) => source => {
    return filter(({ type }) => {
        return type === _type
    })(source)
}

const getPayload = d => (d && d.payload !== undefined ? d.payload : d)

export const mapSuccessTo = (actionType, fn) => source => {
    let talkback

    source(0, (t, d) => {
        if (t === 0) {
            talkback = d
        }

        if (t === 1) {
            talkback(1, {
                action: {
                    type: actionType,
                    payload: isFn(fn) ? fn(getPayload(d)) : getPayload(d)
                }
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

export const mapFailTo = (actionType, fn) => source => {
    let talkback

    source(0, (t, d) => {
        if (t === 0) {
            talkback = d
        }

        if (t === 2 && d !== undefined) {
            talkback(1, {
                action: {
                    type: actionType,
                    payload: isFn(fn) ? fn(getPayload(d)) : getPayload(d)
                }
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
