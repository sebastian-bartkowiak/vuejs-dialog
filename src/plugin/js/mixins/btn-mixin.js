/**
 * Created by Emmy on 3/5/2018.
 */

import { DIALOG_TYPES, CONFIRM_TYPES } from '../constants'

export default {
	computed: {
		cancelBtnDisabled () {
			return (this.options.window === DIALOG_TYPES.ALERT || (this.options.window === DIALOG_TYPES.EVENT && (this.options.eventData === null || typeof this.options.eventData === 'undefined' || typeof this.options.eventData.button_url === 'undefined')))
		},
		okBtnDisabled () {
			return (this.options.window === DIALOG_TYPES.CONFIRM) &&
                (this.options.type === CONFIRM_TYPES.HARD) &&
                (this.input !== this.options.verification)
		},
		leftBtnEnabled () {
			return (this.cancelBtnDisabled === false) || (this.options.reverse === true)
		},
		rightBtnEnabled () {
			return (this.cancelBtnDisabled === false) || (this.options.reverse === false)
		},
		leftBtnFocus () {
			return !this.isHardConfirm && (this.options.reverse === true)
		},
		rightBtnFocus () {
			return !this.isHardConfirm && (this.options.reverse === false)
		},
		leftBtnText () {
			return this.options.reverse ? this.options.okText : this.options.cancelText
		},
		rightBtnText () {
			return this.options.reverse ? this.options.cancelText : this.options.okText
		}
	}
}
