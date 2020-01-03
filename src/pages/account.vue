<template>
    <div v-if="$store.state.user">
        <v-btn text color="red" @click="onLogout">Logout</v-btn>
    </div>
</template>

<script>
export default {
    components: {},
    computed: {
        user() {
            return this.$store.state.user
        }
    },
    methods: {
        onLogout() {
            localStorage.removeItem('token')
            this.$router.push('/')
        }
    }
}
</script>

<style lang="scss">
    .inputlink {
        text-decoration: none!important;
        cursor: pointer!important;
        * {
            cursor: pointer!important;
        }
    }
</style>