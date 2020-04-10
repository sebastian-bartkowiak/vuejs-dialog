<template>
    <component :is="dialogView" :options="options" @close="close"></component>
</template>

<script>
    import {DIALOG_TYPES, ANIMATION_TYPES, CONFIRM_TYPES} from '../js/constants'

    export default {
        data: function () {
            return {
                show: true,
                closed: false,
                endedAnimations: []
            }
        },
        props: {
            options: {
                type: Object,
                required: true
            },
            escapeKeyClose: {
                type: Boolean,
                "default": false
            },
            registeredViews: {
                type: Object,
                'default': function () {
                    return {}
                }
            }
        },
        watch: {
            "escapeKeyClose": function(val){
                if(val === true){
                    this.cancelBtnDisabled ? this.proceed() : this.cancel()
                }
            },
            show(){
                this.options.promiseResolver({
                    success: false
                })
                this.$emit('close', this.options.id)
            }
        },
        computed: {
            loaderEnabled(){
                return !!this.options.loader
            },
            dialogView(){
                return this.registeredViews[this.options.view]
            },
            isHardConfirm () {
                return this.options.window === DIALOG_TYPES.CONFIRM &&
                    this.options.type === CONFIRM_TYPES.HARD
            },
            isPrompt () {
                return (this.options.window === DIALOG_TYPES.PROMPT)
            },
        },
        methods: {
            closeAtOutsideClick() {
              if (this.options.backdropClose === true) {
                  this.cancelBtnDisabled ? this.proceed() : this.cancel()
              }
            },
            proceed(){
                if (this.loaderEnabled) {
                    this.switchLoadingState(true)
                    this.options.promiseResolver({
                        success: true,
                        close: this.close,
                        loading: this.switchLoadingState
                    })
                } else {
                    this.options.promiseResolver({
                        success: true
                    })
                    this.close()
                }
            },
            cancel(){
                if (this.loading === true)
                    return
                this.close()
            },
            close(){
                this.show = false
                this.closed = true
            }
        },
        beforeDestroy(){
            if(this.closed === false){
                this.cancelBtnDisabled ? this.proceed() : this.cancel()
            }
        }
    }
</script>
