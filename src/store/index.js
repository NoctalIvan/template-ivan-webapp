import Vuex from 'vuex'

export default () => {
    return new Vuex.Store({
        state: {
            user: null
        },
        mutations: {
            setUser (state, user) {
                state.user = {...state.user, ...user}
            }
        }
    })
}