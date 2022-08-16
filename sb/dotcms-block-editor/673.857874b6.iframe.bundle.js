/*! For license information please see 673.857874b6.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkdotcms_ui=self.webpackChunkdotcms_ui||[]).push([[673],{"./dist/libs/dotcms-webcomponents/dist/esm/dot-select-button.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{dot_select_button:()=>DotSelectButton});__webpack_require__("./node_modules/core-js/modules/es.reflect.construct.js"),__webpack_require__("./node_modules/core-js/modules/es.object.create.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.function.bind.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.array.map.js");var _templateObject,_templateObject2,_templateObject3,_index_27076004_js__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/index-27076004.js"),_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/lit-element-b7983af7.js"),_ripple_handlers_a755b978_js__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/ripple-handlers-a755b978.js");__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/style-map-4448c8d1.js");function _taggedTemplateLiteralLoose(strings,raw){return raw||(raw=strings.slice(0)),strings.raw=raw,strings}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),Object.defineProperty(subClass,"prototype",{writable:!1}),superClass&&_setPrototypeOf(subClass,superClass)}function _setPrototypeOf(o,p){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){return o.__proto__=p,o},_setPrototypeOf(o,p)}function _createSuper(Derived){var hasNativeReflectConstruct=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return _possibleConstructorReturn(this,result)}}function _possibleConstructorReturn(self,call){if(call&&("object"==typeof call||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}(self)}function _getPrototypeOf(o){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_getPrototypeOf(o)}var IconButtonBase=function(_LitElement){_inherits(IconButtonBase,_LitElement);var _super=_createSuper(IconButtonBase);function IconButtonBase(){var _this;return _classCallCheck(this,IconButtonBase),(_this=_super.apply(this,arguments)).disabled=!1,_this.icon="",_this.label="",_this.shouldRenderRipple=!1,_this.rippleHandlers=new _ripple_handlers_a755b978_js__WEBPACK_IMPORTED_MODULE_10__.R((function(){return _this.shouldRenderRipple=!0,_this.ripple})),_this}return _createClass(IconButtonBase,[{key:"renderRipple",value:function renderRipple(){return this.shouldRenderRipple?(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.h)(_templateObject||(_templateObject=_taggedTemplateLiteralLoose(['\n            <mwc-ripple\n                .disabled="','"\n                unbounded>\n            </mwc-ripple>'])),this.disabled):""}},{key:"focus",value:function focus(){var buttonElement=this.buttonElement;buttonElement&&(this.rippleHandlers.startFocus(),buttonElement.focus())}},{key:"blur",value:function blur(){var buttonElement=this.buttonElement;buttonElement&&(this.rippleHandlers.endFocus(),buttonElement.blur())}},{key:"render",value:function render(){return(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.h)(_templateObject2||(_templateObject2=_taggedTemplateLiteralLoose(['<button\n        class="mdc-icon-button"\n        aria-label="','"\n        ?disabled="','"\n        @focus="','"\n        @blur="','"\n        @mousedown="','"\n        @mouseenter="','"\n        @mouseleave="','"\n        @touchstart="','"\n        @touchend="','"\n        @touchcancel="','">\n      ','\n    <i class="material-icons">','</i>\n    <span class="default-slot-container">\n        <slot></slot>\n    </span>\n  </button>'])),this.label||this.icon,this.disabled,this.handleRippleFocus,this.handleRippleBlur,this.handleRippleMouseDown,this.handleRippleMouseEnter,this.handleRippleMouseLeave,this.handleRippleTouchStart,this.handleRippleDeactivate,this.handleRippleDeactivate,this.renderRipple(),this.icon)}},{key:"handleRippleMouseDown",value:function handleRippleMouseDown(event){var _this2=this;window.addEventListener("mouseup",(function onUp(){window.removeEventListener("mouseup",onUp),_this2.handleRippleDeactivate()})),this.rippleHandlers.startPress(event)}},{key:"handleRippleTouchStart",value:function handleRippleTouchStart(event){this.rippleHandlers.startPress(event)}},{key:"handleRippleDeactivate",value:function handleRippleDeactivate(){this.rippleHandlers.endPress()}},{key:"handleRippleMouseEnter",value:function handleRippleMouseEnter(){this.rippleHandlers.startHover()}},{key:"handleRippleMouseLeave",value:function handleRippleMouseLeave(){this.rippleHandlers.endHover()}},{key:"handleRippleFocus",value:function handleRippleFocus(){this.rippleHandlers.startFocus()}},{key:"handleRippleBlur",value:function handleRippleBlur(){this.rippleHandlers.endFocus()}}]),IconButtonBase}(_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.L);(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__._)([(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.p)({type:Boolean,reflect:!0})],IconButtonBase.prototype,"disabled",void 0),(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__._)([(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.p)({type:String})],IconButtonBase.prototype,"icon",void 0),(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__._)([(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.p)({type:String})],IconButtonBase.prototype,"label",void 0),(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__._)([(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.q)("button")],IconButtonBase.prototype,"buttonElement",void 0),(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__._)([(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.a)("mwc-ripple")],IconButtonBase.prototype,"ripple",void 0),(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__._)([(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.i)()],IconButtonBase.prototype,"shouldRenderRipple",void 0),(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__._)([(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.e)({passive:!0})],IconButtonBase.prototype,"handleRippleMouseDown",null),(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__._)([(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.e)({passive:!0})],IconButtonBase.prototype,"handleRippleTouchStart",null);var style=(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.c)(_templateObject3||(_templateObject3=_taggedTemplateLiteralLoose(['.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:transparent;fill:currentColor;color:inherit;font-size:24px;text-decoration:none;cursor:pointer;user-select:none;width:48px;height:48px;padding:12px}.mdc-icon-button svg,.mdc-icon-button img{width:24px;height:24px}.mdc-icon-button:disabled{color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38))}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}:host{display:inline-block;outline:none;--mdc-ripple-color: currentcolor;-webkit-tap-highlight-color:transparent}:host([disabled]){pointer-events:none}:host,.mdc-icon-button{vertical-align:top}.mdc-icon-button{width:var(--mdc-icon-button-size, 48px);height:var(--mdc-icon-button-size, 48px);padding:calc( (var(--mdc-icon-button-size, 48px) - var(--mdc-icon-size, 24px)) / 2 )}.mdc-icon-button>i{position:absolute;top:0;padding-top:inherit}.mdc-icon-button i,.mdc-icon-button svg,.mdc-icon-button img,.mdc-icon-button ::slotted(*){display:block;width:var(--mdc-icon-size, 24px);height:var(--mdc-icon-size, 24px)}']))),IconButton=function(_IconButtonBase){_inherits(IconButton,_IconButtonBase);var _super2=_createSuper(IconButton);function IconButton(){return _classCallCheck(this,IconButton),_super2.apply(this,arguments)}return _createClass(IconButton)}(IconButtonBase);IconButton.styles=style,IconButton=(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__._)([(0,_lit_element_b7983af7_js__WEBPACK_IMPORTED_MODULE_9__.b)("mwc-icon-button")],IconButton);var DotSelectButton=function(){function DotSelectButton(hostRef){_classCallCheck(this,DotSelectButton),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_8__.r)(this,hostRef),this.selected=(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_8__.c)(this,"selected",7),this.value="",this.options=[]}return _createClass(DotSelectButton,[{key:"render",value:function render(){var _this3=this;return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_8__.h)(_index_27076004_js__WEBPACK_IMPORTED_MODULE_8__.H,null,this.options.map((function(option){var active=option.label.toLocaleLowerCase()===_this3.value.toLocaleLowerCase();return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_8__.h)("mwc-icon-button",{class:{active},icon:option.icon,label:option.label,disabled:option.disabled,onClick:function onClick(){_this3.setSelected(option)}})})))}},{key:"setSelected",value:function setSelected(option){this.value=option.label,this.selected.emit(option.label.toLocaleLowerCase())}}]),DotSelectButton}();DotSelectButton.style=".active{color:var(--color-main);pointer-events:none}"}}]);
//# sourceMappingURL=673.857874b6.iframe.bundle.js.map