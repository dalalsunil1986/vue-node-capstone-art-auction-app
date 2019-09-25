<template>
    <div>
        <v-expansion-panel style="box-shadow: none">
            <v-expansion-panel-content>
                <div slot="header" flat>Offers ({{data.length}})</div>
                <v-card flat class="p-2" style="max-height: 200px; overflow: auto">
                    <div class="p-2" v-for="(item, i) in data">
                        <span>{{time(item.time)}} <span class="float-right">$ {{item.bid}}</span></span>
                    </div>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </div>
</template>
<script>
    export default {
        props: ['data'],
        methods: {
            time(dt) {
                let date = new Date(dt)
                var options = {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: "numeric",
                    second: "numeric"
                }
                return date.toLocaleDateString('lt-LT', options)
            }
        }
    }
</script>

<style scoped>
    /* width */
    ::-webkit-scrollbar {
        width: 10px;
    }
    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #888;
    }
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
