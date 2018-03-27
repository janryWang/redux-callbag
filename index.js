import mitt from 'mitt'

export default (...epicses) => {
	return (store) => {
		const emitter = mitt()
		const actions = (start, sink) => {
			if (start !== 0) return
			const handler = (ev) => sink(1, ev)
			sink(0, (t) => {
				if (t === 2) emitter.off('action', handler)
			})
			emitter.on('action', handler)
		}

		epicses.forEach((epics) => {
			if (typeof epics === 'function') {
				epics(actions, store)
			}
		})

		return (next) => {
			return (action) => {
				emitter.emit('action', action)
				return next(action)
			}
		}
	}
}
