"use strict";(self.webpackChunkdotcms_ui=self.webpackChunkdotcms_ui||[]).push([[833],{"./dist/libs/dotcms-webcomponents/dist/esm/key-value-form_2.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{key_value_form:()=>DotKeyValueComponent,key_value_table:()=>KeyValueTableComponent});__webpack_require__("./node_modules/core-js/modules/es.object.assign.js"),__webpack_require__("./node_modules/core-js/modules/es.function.bind.js"),__webpack_require__("./node_modules/core-js/modules/es.object.keys.js"),__webpack_require__("./node_modules/core-js/modules/es.array.map.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.array.for-each.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.array.is-array.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js");var _index_27076004_js__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/index-27076004.js");function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}var DEFAULT_VALUE={key:"",value:""},DotKeyValueComponent=function(){function DotKeyValueComponent(hostRef){_classCallCheck(this,DotKeyValueComponent),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.r)(this,hostRef),this.add=(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.c)(this,"add",7),this.keyChanged=(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.c)(this,"keyChanged",7),this.lostFocus=(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.c)(this,"lostFocus",7),this.disabled=!1,this.addButtonLabel="Add",this.keyPlaceholder="",this.valuePlaceholder="",this.keyLabel="Key",this.valueLabel="Value",this.emptyDropdownOptionLabel="Pick an option",this.whiteList="",this.inputs=Object.assign({},DEFAULT_VALUE),this.selectedWhiteListKey="",this.whiteListArray={}}return _createClass(DotKeyValueComponent,[{key:"selectedWhiteListKeyWatch",value:function selectedWhiteListKeyWatch(){}},{key:"componentWillLoad",value:function componentWillLoad(){this.whiteListArray=this.whiteList.length?JSON.parse(this.whiteList):""}},{key:"render",value:function render(){var buttonDisabled=this.isButtonDisabled();return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("form",{onSubmit:this.addKey.bind(this)},(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("table",null,(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("tbody",null,(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("tr",null,(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-form__key"},(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("label",null,this.keyLabel)),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-form__value"},(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("label",null,this.valueLabel)),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-form__action"})),0===Object.keys(this.whiteListArray).length?this.getKeyValueForm(buttonDisabled):this.getWhiteListForm(buttonDisabled))))}},{key:"getKeyValueForm",value:function getKeyValueForm(buttonDisabled){var _this=this;return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("tr",null,(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-form__key"},(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("input",{disabled:this.disabled,name:"key",onBlur:function onBlur(e){return _this.lostFocus.emit(e)},onInput:function onInput(event){return _this.setValue(event)},placeholder:this.keyPlaceholder,type:"text",value:this.inputs.key})),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-form__value"},(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("input",{disabled:this.disabled,name:"value",onBlur:function onBlur(e){return _this.lostFocus.emit(e)},onInput:function onInput(event){return _this.setValue(event)},placeholder:this.valuePlaceholder,type:"text",value:this.inputs.value})),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-form__action"},(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("button",{class:"key-value-form__save__button",type:"submit",disabled:buttonDisabled},this.addButtonLabel)))}},{key:"getWhiteListForm",value:function getWhiteListForm(buttonDisabled){return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("tr",null,(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-form__key"},this.getWhiteListKeysDropdown()),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-form__value"},this.selectedWhiteListKey?this.getWhiteListValueControl():null),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-form__action"},(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("button",{class:"key-value-form__save__button",type:"submit",disabled:buttonDisabled},this.addButtonLabel)))}},{key:"getWhiteListValueControl",value:function getWhiteListValueControl(){var _this2=this;return this.whiteListArray[this.selectedWhiteListKey].length?this.getWhiteListValuesDropdown():(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("input",{disabled:this.disabled,name:"value",onBlur:function onBlur(e){return _this2.lostFocus.emit(e)},onInput:function onInput(event){return _this2.setValue(event)},placeholder:this.valuePlaceholder,type:"text",value:this.inputs.value})}},{key:"getWhiteListKeysDropdown",value:function getWhiteListKeysDropdown(){var _this3=this;return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("select",{disabled:this.disabled,name:"key",onChange:function onChange(event){return _this3.changeWhiteListKey(event)}},(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("option",{value:""},this.emptyDropdownOptionLabel),Object.keys(this.whiteListArray).map((function(key){return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("option",{value:key},key)})))}},{key:"getWhiteListValuesDropdown",value:function getWhiteListValuesDropdown(){var _this4=this;return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("select",{disabled:this.disabled,name:"value",onChange:function onChange(event){return _this4.changeWhiteListValue(event)}},(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("option",{value:""},this.emptyDropdownOptionLabel),this.whiteListArray[this.selectedWhiteListKey].map((function(item){return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("option",{value:item},item)})))}},{key:"changeWhiteListKey",value:function changeWhiteListKey(event){event.stopImmediatePropagation(),this.clearForm();var target=event.target;this.selectedWhiteListKey=target.value,this.setValue(event)}},{key:"changeWhiteListValue",value:function changeWhiteListValue(event){event.stopImmediatePropagation(),this.setValue(event)}},{key:"isButtonDisabled",value:function isButtonDisabled(){return!this.isFormValid()||this.disabled||null}},{key:"isFormValid",value:function isFormValid(){return!(!this.inputs.key.length||!this.inputs.value.length)}},{key:"setValue",value:function setValue(event){var _Object$assign;event.stopImmediatePropagation();var target=event.target;"key"===target.name&&this.keyChanged.emit(target.value.toString()),this.inputs=Object.assign(Object.assign({},this.inputs),((_Object$assign={})[target.name]=target.value.toString(),_Object$assign))}},{key:"addKey",value:function addKey(event){event.preventDefault(),event.stopImmediatePropagation(),this.inputs.key&&this.inputs.value&&(this.add.emit(this.inputs),this.clearForm(),this.focusKeyInputField())}},{key:"clearForm",value:function clearForm(){this.inputs=Object.assign({},DEFAULT_VALUE)}},{key:"focusKeyInputField",value:function focusKeyInputField(){this.el.querySelector('[name="key"]').focus()}},{key:"el",get:function get(){return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.g)(this)}}],[{key:"watchers",get:function get(){return{selectedWhiteListKey:["selectedWhiteListKeyWatch"]}}}]),DotKeyValueComponent}();DotKeyValueComponent.style="key-value-form form label{align-items:center;display:flex;flex-grow:1}key-value-form form table{width:100%}key-value-form form table input{width:100%}key-value-form form .key-value-table-form__key{width:45%}key-value-form form .key-value-table-form__value{width:45%}key-value-form form .key-value-table-form__action{text-align:right;width:10%}";var KeyValueTableComponent=function(){function KeyValueTableComponent(hostRef){_classCallCheck(this,KeyValueTableComponent),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.r)(this,hostRef),this.delete=(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.c)(this,"delete",7),this.reorder=(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.c)(this,"reorder",7),this.items=[],this.disabled=!1,this.buttonLabel="Delete",this.emptyMessage="No values",this.dragSrcEl=null}return _createClass(KeyValueTableComponent,[{key:"render",value:function render(){return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("table",null,(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("tbody",null,this.renderRows(this.items)))}},{key:"componentDidLoad",value:function componentDidLoad(){this.bindDraggableEvents()}},{key:"componentDidUpdate",value:function componentDidUpdate(){this.bindDraggableEvents()}},{key:"bindDraggableEvents",value:function bindDraggableEvents(){var _this5=this;this.disabled||document.querySelectorAll("key-value-table tr").forEach((function(row){row.setAttribute("draggable","true"),row.removeEventListener("dragstart",_this5.handleDragStart.bind(_this5),!1),row.removeEventListener("dragenter",_this5.handleDragEnter,!1),row.removeEventListener("dragover",_this5.handleDragOver.bind(_this5),!1),row.removeEventListener("dragleave",_this5.handleDragLeave,!1),row.removeEventListener("drop",_this5.handleDrop.bind(_this5),!1),row.removeEventListener("dragend",_this5.handleDragEnd.bind(_this5),!1),row.addEventListener("dragstart",_this5.handleDragStart.bind(_this5),!1),row.addEventListener("dragenter",_this5.handleDragEnter,!1),row.addEventListener("dragover",_this5.handleDragOver.bind(_this5),!1),row.addEventListener("dragleave",_this5.handleDragLeave,!1),row.addEventListener("drop",_this5.handleDrop.bind(_this5),!1),row.addEventListener("dragend",_this5.handleDragEnd.bind(_this5),!1)}))}},{key:"removeElementById",value:function removeElementById(elemId){document.getElementById(elemId).remove()}},{key:"isPlaceholderInDOM",value:function isPlaceholderInDOM(){return!!document.getElementById("dotKeyValuePlaceholder")}},{key:"isCursorOnUpperSide",value:function isCursorOnUpperSide(cursor,_ref){var top=_ref.top,bottom=_ref.bottom;return cursor.y-top<(bottom-top)/2}},{key:"setPlaceholder",value:function setPlaceholder(){var placeholder=document.createElement("tr");return placeholder.id="dotKeyValuePlaceholder",placeholder.classList.add("key-value-table-wc__placeholder-transit"),placeholder}},{key:"insertBeforeElement",value:function insertBeforeElement(newElem,element){element.parentNode.insertBefore(newElem,element)}},{key:"insertAfterElement",value:function insertAfterElement(newElem,element){element.parentNode.insertBefore(newElem,element.nextSibling)}},{key:"handleDragStart",value:function handleDragStart(e){this.dragSrcEl=e.target}},{key:"handleDragOver",value:function handleDragOver(e){if(e.preventDefault&&e.preventDefault(),this.dragSrcEl!=e.target){var contentlet=e.target.closest("tr"),contentletPlaceholder=this.setPlaceholder();this.isPlaceholderInDOM()&&this.removeElementById("dotKeyValuePlaceholder"),this.isCursorOnUpperSide(e,contentlet.getBoundingClientRect())?this.insertBeforeElement(contentletPlaceholder,contentlet):this.insertAfterElement(contentletPlaceholder,contentlet)}return!1}},{key:"handleDragEnter",value:function handleDragEnter(e){e.target.classList.add("over")}},{key:"handleDragLeave",value:function handleDragLeave(e){e.target.classList.remove("over")}},{key:"handleDrop",value:function handleDrop(e){return e.stopPropagation&&e.stopPropagation(),this.dragSrcEl!=e.target&&document.getElementById("dotKeyValuePlaceholder").insertAdjacentElement("afterend",this.dragSrcEl),!1}},{key:"handleDragEnd",value:function handleDragEnd(){document.querySelectorAll("key-value-table tr").forEach((function(row){row.classList.remove("over")}));try{this.removeElementById("dotKeyValuePlaceholder")}catch(e){}this.reorder.emit()}},{key:"onDelete",value:function onDelete(index){this.delete.emit(index)}},{key:"getRow",value:function getRow(item,index){var label=this.buttonLabel+" "+item.key+", "+item.value;return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("tr",null,(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-wc__key"},item.key),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-wc__value"},item.value),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",{class:"key-value-table-wc__action"},this.disabled?"":this.getDeleteButton(label,index)))}},{key:"getDeleteButton",value:function getDeleteButton(label,index){var _this6=this;return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("button",{"aria-label":label,onClick:function onClick(){return _this6.onDelete(index)},class:"dot-key-value__delete-button"},this.buttonLabel)}},{key:"renderRows",value:function renderRows(items){var _this7=this;return this.isValidItems(items)?items.map((function(item,index){return _this7.getRow(item,index)})):this.getEmptyRow()}},{key:"getEmptyRow",value:function getEmptyRow(){return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("tr",null,(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_12__.h)("td",null,this.emptyMessage))}},{key:"isValidItems",value:function isValidItems(items){return Array.isArray(items)&&!!items.length}}]),KeyValueTableComponent}();KeyValueTableComponent.style="key-value-table table{width:100%}key-value-table table td{line-height:3rem}key-value-table .key-value-table-wc__key{width:45%}key-value-table .key-value-table-wc__value{width:45%}key-value-table .key-value-table-wc__action{text-align:right;width:10%}key-value-table .key-value-table-wc__placeholder-transit{border-bottom:1px solid}"}}]);
//# sourceMappingURL=833.e11cb7f8.iframe.bundle.js.map