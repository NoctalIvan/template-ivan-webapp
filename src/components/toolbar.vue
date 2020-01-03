<template>
    <div class="toolbar">
        <v-navigation-drawer
            v-model="drawer"
            permanent
            persistent
            app
            class="primary app-drawer"
            dark
            width="220px">

            <!-- <img src="static/logo_white.png" style="width: 100%; padding: 30px 12px 27px"/> -->
            <h1 style="width: 100%; padding: 30px 12px 27px">DAP</h1>

            <v-list class="pt-0">
                <v-list-item :to="'/dashboard'">
                    <v-list-item-action >
                        <v-icon>mdi-view-dashboard-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="'/account'">
                    <v-list-item-action>
                        <v-icon>mdi-account</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Account</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    data () {
        return {
            drawer: this.$vuetify.breakpoint.lgAndUp
        }
    },
    computed: {
        
    }
}
</script>

<style lang="scss">
    .toolbar {
        .v-list__tile--active {
            background: white!important
        }
    }
</style>
