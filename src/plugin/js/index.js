'use strict'

import Promise from 'promise-polyfill'
import DialogComponent from '../components/dialog.vue'
import { DIALOG_TYPES, DEFAULT_OPTIONS } from './constants'
import Directives from './directives'
import { mergeObjs } from './utilities'

const registeredViews = {}

let Plugin = function (Vue, globalOptions = {}) {
	this.Vue = Vue
	this.mounted = false
	this.$root = {} // The root component
	this.registeredViews = {} // Custom components
	this.globalOptions = mergeObjs(DEFAULT_OPTIONS, globalOptions)
}

Plugin.prototype.mountIfNotMounted = function () {
	if (this.mounted === true) {
		return
	}

	this.$root = (() => {
		let DialogConstructor = this.Vue.extend(DialogComponent)
		let node = document.createElement('div')
		document.querySelector('body').appendChild(node)

		let Vm = new DialogConstructor()

		Vm.registeredViews = this.registeredComponents()

		return Vm.$mount(node)
	})()

	this.mounted = true
}

Plugin.prototype.registeredComponents = function () {
	return registeredViews
}

Plugin.prototype.registerComponent = function (name, definition) {
	if (this.mounted) {
		this.destroy()
	}

	// registeredViews[name] = this.Vue.extend(definition)
	registeredViews[name] = definition
}

Plugin.prototype.destroy = function () {
	if (this.mounted === true) {
		this.$root.forceCloseAll()

		let elem = this.$root.$el
		this.$root.$destroy()
		this.$root.$off()
		elem.remove()
		this.mounted = false
	}
}

Plugin.prototype.closeByCustomId = function (customId) {
	if (this.mounted === true) {
		return this.$root.closeCustomId(customId)
	}
	return false
}

Plugin.prototype.getLastCustomId = function () {
	if (this.mounted === true) {
		return this.$root.getLastCustomId()
	}
	return undefined
}

Plugin.prototype.getOpenCount = function () {
	if (this.mounted === true) {
		return this.$root.getOpenCount()
	}
	return {
		'alert': 0,
		'confirm': 0,
		'prompt': 0,
		'event': 0,
		'total': 0
	}
}

Plugin.prototype.alert = function (message = null, options = {}) {
	message && (options.message = message)
	return this.open(DIALOG_TYPES.ALERT, options)
}

Plugin.prototype.prompt = function (message = null, options = {}) {
	message && (options.message = message)
	return this.open(DIALOG_TYPES.PROMPT, options)
}

Plugin.prototype.confirm = function (message = null, options = {}) {
	message && (options.message = message)
	return this.open(DIALOG_TYPES.CONFIRM, options)
}

Plugin.prototype.event = function (message = null, options = {}) {
	message && (options.message = message)
	if(typeof options.eventData !== 'undefined' && typeof options.eventData.button_url !== 'undefined') options.cancelText = $trans('Dismiss')
	return this.open(DIALOG_TYPES.EVENT, options)
}

Plugin.prototype.open = function (type, localOptions = {}) {
	this.mountIfNotMounted()
	return new Promise((resolve, reject) => {
		localOptions.id = 'dialog.' + Date.now()
		if(typeof localOptions.customId !== 'undefined'){
			localOptions.customId = type + '_' + localOptions.customId
		}
		else{
			localOptions.customId = 'static_' + type + '_' + localOptions.id
		}
		localOptions.window = type
		localOptions.promiseResolver = resolve
		localOptions.promiseRejecter = reject
		
		this.$root.commit(mergeObjs(this.globalOptions, localOptions))
	})
}

Plugin.install = function (Vue, options) {
	let DirectivesObj = new Directives(Vue)

	Vue.directive('confirm', DirectivesObj.confirmDefinition)

	Vue.dialog = new Plugin(Vue, options)

	Object.defineProperties(Vue.prototype, {
		$dialog: {
			get () {
				return Vue.dialog
			}
		}
	})
}

export default Plugin
