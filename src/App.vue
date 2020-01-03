<template>
    <div id="app" :class="{withToolbar: hasToolbar}">
        <v-app>
            <Toolbar v-if="hasToolbar"/>
            <div class="app-content fill-height">
                <!-- loader -->
                <div v-if="loading" class="loader-screen">
                    <h2>Chargement en cours ...</h2>
                    <v-progress-circular indeterminate color="#1992c2"></v-progress-circular>
                </div>

                <div v-else>
                    <router-view/>
                </div>
            </div>
        </v-app>
    </div>
</template>

<script>
import Toolbar from './components/toolbar.vue'
import axios from 'axios'
import conf from './../conf'

export default {
    name: 'App',
    components: {Toolbar},
    data() {
        return {
            loading: false
        }
    },
    computed: {
        hasToolbar() {
            return this.$route.path !== '/'
        }
    },
    async mounted() {
        const token = localStorage.getItem('token')
        if(token) {
            this.loading = true

            // get "me"
            try {
                const res = await axios.get(`${conf.apiUrl}/user/me`, {headers: {
                    token
                }})

                this.$store.commit('setUser', res.data)
                localStorage.setItem('token', res.data.token)
                this.loading = false
                if(this.$route.path === '/') {
                    this.$router.push('/dashboard')
                }
            } catch (error) {
                localStorage.removeItem('token')
                this.loading = false
                this.$router.push('/')
            }
        }
    }
}
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background: white;

    &.withToolbar {
        .app-content {
            padding-left: 220px;
        }
    }

    .loader-screen {
        width: 100%;
        height: 100%;
        background: white;
        color: #1992c2;
        padding-top: 31px;

        h2 {
            margin-bottom: 16px
        }
    }
}
</style>
