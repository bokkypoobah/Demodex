/*! 
  * portal-vue © Thorsten Lünborg, 2019 
  * 
  * Version: 2.1.7
  * 
  * LICENCE: MIT 
  * 
  * https://github.com/linusborg/portal-vue
  * 
 */(function(a,b){"object"==typeof exports&&"undefined"!=typeof module?b(exports,require("vue")):"function"==typeof define&&define.amd?define(["exports","vue"],b):b(a.PortalVue={},a.Vue)})(this,function(a,b){'use strict';var m=Math.round;function c(a){return c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},c(a)}function d(a){return e(a)||f(a)||g()}function e(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}}function f(a){if(Symbol.iterator in Object(a)||"[object Arguments]"===Object.prototype.toString.call(a))return Array.from(a)}function g(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function h(a){return Array.isArray(a)||"object"===c(a)?Object.freeze(a):a}function i(a){var b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:{};return a.reduce(function(a,c){var d=c.passengers[0],e="function"==typeof d?d(b):c.passengers;return a.concat(e)},[])}function j(a,c){return a.map(function(a,b){return[b,a]}).sort(function(d,a){return c(d[1],a[1])||d[0]-a[0]}).map(function(a){return a[1]})}function k(a,b){return b.reduce(function(b,c){return a.hasOwnProperty(c)&&(b[c]=a[c]),b},{})}function l(a){var b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:{};a.component(b.portalName||"Portal",u),a.component(b.portalTargetName||"PortalTarget",v),a.component(b.MountingPortalName||"MountingPortal",z)}b=b&&b.hasOwnProperty("default")?b["default"]:b;var n="undefined"!=typeof window,o={},p={},q={},r=b.extend({data:function(){return{transports:o,targets:p,sources:q,trackInstances:n}},methods:{open:function(a){if(n){var c=a.to,d=a.from,e=a.passengers,f=a.order,g=void 0===f?1/0:f;if(c&&d&&e){var i={to:c,from:d,passengers:h(e),order:g},k=Object.keys(this.transports);-1===k.indexOf(c)&&b.set(this.transports,c,[]);var l=this.$_getTransportIndex(i),m=this.transports[c].slice(0);-1===l?m.push(i):m[l]=i,this.transports[c]=j(m,function(c,a){return c.order-a.order})}}},close:function(a){var b=!!(1<arguments.length&&arguments[1]!==void 0)&&arguments[1],c=a.to,d=a.from;if(c&&(d||!1!==b)&&this.transports[c])if(b)this.transports[c]=[];else{var e=this.$_getTransportIndex(a);if(0<=e){var f=this.transports[c].slice(0);f.splice(e,1),this.transports[c]=f}}},registerTarget:function(a,b,c){n&&(this.trackInstances&&!c&&this.targets[a]&&console.warn("[portal-vue]: Target ".concat(a," already exists")),this.$set(this.targets,a,Object.freeze([b])))},unregisterTarget:function(a){this.$delete(this.targets,a)},registerSource:function(a,b,c){n&&(this.trackInstances&&!c&&this.sources[a]&&console.warn("[portal-vue]: source ".concat(a," already exists")),this.$set(this.sources,a,Object.freeze([b])))},unregisterSource:function(a){this.$delete(this.sources,a)},hasTarget:function(a){return!!(this.targets[a]&&this.targets[a][0])},hasSource:function(a){return!!(this.sources[a]&&this.sources[a][0])},hasContentFor:function(a){return!!this.transports[a]&&!!this.transports[a].length},$_getTransportIndex:function(a){var b=a.to,c=a.from;for(var d in this.transports[b])if(this.transports[b][d].from===c)return+d;return-1}}}),s=new r(o),t=1,u=b.extend({name:"portal",props:{disabled:{type:Boolean},name:{type:String,default:function(){return t++ +""}},order:{type:Number,default:0},slim:{type:Boolean},slotProps:{type:Object,default:function(){return{}}},tag:{type:String,default:"DIV"},to:{type:String,default:function(){return m(1e7*Math.random())+""}}},created:function(){var a=this;this.$nextTick(function(){s.registerSource(a.name,a)})},mounted:function(){this.disabled||this.sendUpdate()},updated:function(){this.disabled?this.clear():this.sendUpdate()},beforeDestroy:function(){s.unregisterSource(this.name),this.clear()},watch:{to:function(a,b){b&&b!==a&&this.clear(b),this.sendUpdate()}},methods:{clear:function(a){var b={from:this.name,to:a||this.to};s.close(b)},normalizeSlots:function(){return this.$scopedSlots.default?[this.$scopedSlots.default]:this.$slots.default},normalizeOwnChildren:function(a){return"function"==typeof a?a(this.slotProps):a},sendUpdate:function(){var a=this.normalizeSlots();if(a){var b={from:this.name,to:this.to,passengers:d(a),order:this.order};s.open(b)}else this.clear()}},render:function(a){var b=this.$slots.default||this.$scopedSlots.default||[],c=this.tag;return b&&this.disabled?1>=b.length&&this.slim?this.normalizeOwnChildren(b)[0]:a(c,[this.normalizeOwnChildren(b)]):this.slim?a():a(c,{class:{"v-portal":!0},style:{display:"none"},key:"v-portal-placeholder"})}}),v=b.extend({name:"portalTarget",props:{multiple:{type:Boolean,default:!1},name:{type:String,required:!0},slim:{type:Boolean,default:!1},slotProps:{type:Object,default:function(){return{}}},tag:{type:String,default:"div"},transition:{type:[String,Object,Function]}},data:function(){return{transports:s.transports,firstRender:!0}},created:function(){var a=this;this.$nextTick(function(){s.registerTarget(a.name,a)})},watch:{ownTransports:function(){this.$emit("change",0<this.children().length)},name:function(a,b){s.unregisterTarget(b),s.registerTarget(a,this)}},mounted:function(){var a=this;this.transition&&this.$nextTick(function(){a.firstRender=!1})},beforeDestroy:function(){s.unregisterTarget(this.name)},computed:{ownTransports:function(){var a=this.transports[this.name]||[];return this.multiple?a:0===a.length?[]:[a[a.length-1]]},passengers:function(){return i(this.ownTransports,this.slotProps)}},methods:{children:function(){return 0===this.passengers.length?this.$scopedSlots.default?this.$scopedSlots.default(this.slotProps):this.$slots.default||[]:this.passengers},noWrapper:function a(){var a=this.slim&&!this.transition;return a&&1<this.children().length&&console.warn("[portal-vue]: PortalTarget with `slim` option received more than one child element."),a}},render:function(a){var b=this.noWrapper(),c=this.children(),d=this.transition||this.tag;return b?c[0]:this.slim&&!d?a():a(d,{props:{tag:this.transition&&this.tag?this.tag:void 0},class:{"vue-portal-target":!0}},c)}}),w=0,x=["disabled","name","order","slim","slotProps","tag","to"],y=["multiple","transition"],z=b.extend({name:"MountingPortal",inheritAttrs:!1,props:{append:{type:[Boolean,String]},bail:{type:Boolean},mountTo:{type:String,required:!0},disabled:{type:Boolean},name:{type:String,default:function(){return"mounted_"+(w++ +"")}},order:{type:Number,default:0},slim:{type:Boolean},slotProps:{type:Object,default:function(){return{}}},tag:{type:String,default:"DIV"},to:{type:String,default:function(){return m(1e7*Math.random())+""}},multiple:{type:Boolean,default:!1},targetSlim:{type:Boolean},targetSlotProps:{type:Object,default:function(){return{}}},targetTag:{type:String,default:"div"},transition:{type:[String,Object,Function]}},created:function(){if("undefined"!=typeof document){var a=document.querySelector(this.mountTo);if(!a)return void console.error("[portal-vue]: Mount Point '".concat(this.mountTo,"' not found in document"));var b=this.$props;if(s.targets[b.name])return void(b.bail?console.warn("[portal-vue]: Target ".concat(b.name," is already mounted.\n        Aborting because 'bail: true' is set")):this.portalTarget=s.targets[b.name]);var c=b.append;if(c){var d="string"==typeof c?c:"DIV",e=document.createElement(d);a.appendChild(e),a=e}var f=k(this.$props,y);f.slim=this.targetSlim,f.tag=this.targetTag,f.slotProps=this.targetSlotProps,f.name=this.to,this.portalTarget=new v({el:a,parent:this.$parent||this,propsData:f})}},beforeDestroy:function(){var a=this.portalTarget;if(this.append){var b=a.$el;b.parentNode.removeChild(b)}a.$destroy()},render:function(a){if(!this.portalTarget)return console.warn("[portal-vue] Target wasn't mounted"),a();if(!this.$scopedSlots.manual){var b=k(this.$props,x);return a(u,{props:b,attrs:this.$attrs,on:this.$listeners,scopedSlots:this.$scopedSlots},this.$slots.default)}var c=this.$scopedSlots.manual({to:this.to});return Array.isArray(c)&&(c=c[0]),c?c:a()}});"undefined"!=typeof window&&window.Vue&&window.Vue===b&&window.Vue.use({install:l});a.default={install:l},a.Portal=u,a.PortalTarget=v,a.MountingPortal=z,a.Wormhole=s,Object.defineProperty(a,"__esModule",{value:!0})});