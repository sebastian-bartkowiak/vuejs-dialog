<template>
    <div>
        <dialog-window v-for="dialog in dialogsARR"
                       :options="dialog"
                       :key="dialog.id"
                       :escapeKeyClose="dialog.escapeKeyClose"
                       :registeredViews="registeredViews"
                       @close="destroyDialog">
        </dialog-window>
    </div>
</template>

<script>
    import DialogWindow from './dialog-window.vue'
    import {firstIndex} from '../js/utilities'

    export default {
        data: function () {
            return {
                dialogsARR: [],
                registeredViews: {}
            }
        },
        watch: {
            'dialogsARR': {
                handler (dialogs) {
                    let clsName = 'dg-open'
                    const body = document.getElementsByTagName('body')[0]

                    if (!body) {
                        return
                    }

                    if (dialogs.length && !body.classList.contains(clsName)) {
                        //body.classList.add(clsName)
                    } else if (!dialogs.length && body.classList.contains(clsName)) {
                        body.classList.remove(clsName)
                    }
                }
            }
        },
        methods: {
            commit(data){
                this.dialogsARR.push(data)
            },
            forceCloseAll() {
                this.dialogsARR.forEach((d, idx) => this.$delete(this.dialogsARR, idx))
            },
            destroyDialog(dialogId){
                let dialogIndex = firstIndex(this.dialogsARR, dialogId, 'id')

                if (dialogIndex !== -1) {
                    this.$delete(this.dialogsARR, dialogIndex)
                }
            },
            closeCustomId(customId){
                let dialogIndex = firstIndex(this.dialogsARR, customId, 'customId')

                if (dialogIndex !== -1) {
                    this.dialogsARR[dialogIndex].promiseRejecter({graceful: true})
                    this.$delete(this.dialogsARR, dialogIndex)
                    return true
                }
                return false
            }
        },
        components: {DialogWindow}
    }
</script>