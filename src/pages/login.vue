<template>
    <v-container fluid fill-height style="margin-top: 20vh">
        <v-layout align-center justify-center>
            <v-flex xs12 sm8>
                <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                    <v-toolbar-title style="height: 100%">
                        <h1>DAP</h1>
                        <!-- <img src="static/logo_white.png" style="height: 70%; margin-top: 3%"/> -->
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                        icon
                        large
                        href="https://leadAssistant.io"
                        target="_blank">
                        <v-icon large>mdi-anchor</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text v-if="!subscribeMode" style="position: relative">
                    <v-form>
                    <v-text-field prepend-icon="mdi-mail" name="mail" label="Adresse mail" type="text"
                        v-model="mail"/>
                    <v-text-field 
                        prepend-icon="mdi-lock" 
                        name="pass" 
                        label="Mot de passe" 
                        :append-icon="isPassVisible ? 'mdi-eye' : 'mdi-eye-off'" 
                        @click:append="() => isPassVisible = !isPassVisible"
                        id="password" 
                        :type="isPassVisible ? 'input' : 'password'"
                        v-model="pass"/>
                    <a href="mailto:hello@leadassistant.io">
                        <v-btn small text color="grey" style="position: absolute; bottom: 0; right: 0; font-size: 12px;">Mot de passe oublié</v-btn>
                    </a>
                    </v-form>
                    <div class="red--text" v-show="error">{{error}}</div>
                </v-card-text>
                <v-card-text v-else>
                    <v-form>
                    <v-text-field prepend-icon="mdi-mail" name="mail" label="Adresse mail" type="text"
                        v-model="mail"/>
                    <v-text-field 
                        prepend-icon="mdi-lock" 
                        name="pass" 
                        label="Mot de passe" 
                        :append-icon="isPassVisible ? 'mdi-eye' : 'mdi-eye-off'" 
                        @click:append="() => isPassVisible = !isPassVisible"
                        id="password" 
                        :type="isPassVisible ? 'input' : 'password'"
                        v-model="pass"/>
                    <v-text-field 
                        prepend-icon="mdi-lock" 
                        name="pass" 
                        label="Mot de passe (vérification)" 
                        :append-icon="isPassVisible ? 'mdi-eye' : 'mdi-eye-off'" 
                        @click:append="() => isPassVisible = !isPassVisible"
                        id="password2" 
                        :type="isPassVisible ? 'input' : 'password'"
                        v-model="pass2"/>
                    </v-form>
                    <div class="red--text" v-show="error">{{error}}</div>
                </v-card-text>

                <v-card-actions v-if="!subscribeMode">
                    <v-spacer></v-spacer>
                    <v-btn text color="grey" @click="setSubscribeMode(true)">
                        s'inscrire
                    </v-btn>
                    <v-btn :disabled="!canLogin" color="primary" @click="onLogin">
                        <span v-if="!loading">se connecter</span>
                        <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
                    </v-btn>
                </v-card-actions>
                <v-card-actions v-else>
                    <v-spacer></v-spacer>
                    <v-btn text color="grey" @click="setSubscribeMode(false)">
                        se connecter
                    </v-btn>
                    <v-btn :disabled="!canSubscribe" color="primary" @click="onSubscribe">
                        <span v-if="!loading">s'inscrire</span>
                        <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import conf from './../../conf'
import emailValidator from 'email-validator'

export default {
    data() {
        return {
            loading: false,
            error: null,
            mail: '',
            pass: '',
            pass2: '',
            subscribeMode: false,
            isPassVisible: false
        }
    },
    computed: {
        canLogin() {
            return !this.loading && 
                this.mail.length > 0 && 
                this.pass.length > 0
        },
        canSubscribe() {
            return !this.loading
        }
    },
    methods: {
        setSubscribeMode(val) {
            this.subscribeMode = val
            this.error = null
        },
        async onLogin() {
            this.loading = true
            
            if(!this.mail || !this.pass) {
                this.error = 'Merci de remplir tous les champs'
                this.loading = false
                return
            }

            try {
                const res = await axios.post(`${conf.apiUrl}/user/login`, {
                    mail: this.mail,
                    pass: this.pass
                })

                this.error = null
                this.$store.commit('setUser', res.data)
                localStorage.setItem('token', res.data.token)
                document.cookie = `token=${res.data.token}`
                
                this.$router.push('/dashboard')
            } catch (error) {
                if(error.response && error.response.status === 409) {
                    this.error = 'Un compte existe déjà avec cette adresse mail'
                } else if(error.response && error.response.status === 403) {
                    this.error = 'Combinaison mail / mot de passe invalide'
                } else {
                    this.error = 'Erreur inconnue'
                }
            } finally {
                this.loading = false
            }
        },
        async onSubscribe() {
            this.loading = true
            
            if(!this.mail || !this.pass || !this.pass2) {
                this.error = 'Merci de remplir tous les champs'
                this.loading = false
                return
            }

            if(this.pass !== this.pass2) {
                this.error = 'Ces deux mots de passe ne correspondent pas'
                this.loading = false
                return
            }

            if(!emailValidator.validate(this.mail)) {
                this.error = 'Adresse mail invalide'
                this.loading = false
                return
            }

            if(this.pass.length < 6) {
                this.error = 'Mot de passe trop court - 6 caractères minimum'
                this.loading = false
                return
            }

            try {
                await axios.post(`${conf.apiUrl}/user`, {
                    mail: this.mail,
                    pass: this.pass
                })

                this.onLogin()
            } catch (error) {
                if(error.response && error.response.status === 409) {
                    this.error = 'Un compte existe déjà avec cette adresse mail'
                } else {
                    this.error = 'Erreur inconnue'
                }

                this.loading = false
            }
        }
    }
}
</script>
