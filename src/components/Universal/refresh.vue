<template>
    <div>
        <q-btn color="indigo" icon="refresh" round size="md" @click="refreshData" /> 
    </div>
</template>
<script>
export default {
    name:"refresh",
    data() {
        return {
        }
    },
    methods: {
        refreshData(){
            this.$store.commit("warehouse/getRegisters");
            this.$store.commit("warehouse/getUsers");
        }
    },
}
</script>