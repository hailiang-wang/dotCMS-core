/*! For license information please see 32.6920fe91.iframe.bundle.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{"./dist/libs/dotcms-webcomponents/dist/esm/checkProp-286e406e.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return checkProp})),__webpack_require__.d(__webpack_exports__,"b",(function(){return dotParseDate}));__webpack_require__("./node_modules/core-js/modules/es.regexp.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.string.split.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.object.assign.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.array.is-array.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.array.from.js"),__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.function.bind.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.array.index-of.js"),__webpack_require__("./node_modules/core-js/modules/es.reflect.construct.js"),__webpack_require__("./node_modules/core-js/modules/es.map.js"),__webpack_require__("./node_modules/core-js/modules/es.object.create.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js");function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}function _possibleConstructorReturn(self,call){if(call&&("object"==typeof call||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}(self)}function _wrapNativeSuper(Class){var _cache="function"==typeof Map?new Map:void 0;return _wrapNativeSuper=function _wrapNativeSuper(Class){if(null===Class||!function _isNativeFunction(fn){return-1!==Function.toString.call(fn).indexOf("[native code]")}(Class))return Class;if("function"!=typeof Class)throw new TypeError("Super expression must either be null or a function");if(void 0!==_cache){if(_cache.has(Class))return _cache.get(Class);_cache.set(Class,Wrapper)}function Wrapper(){return _construct(Class,arguments,_getPrototypeOf(this).constructor)}return Wrapper.prototype=Object.create(Class.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(Wrapper,Class)},_wrapNativeSuper(Class)}function _construct(Parent,args,Class){return _construct=_isNativeReflectConstruct()?Reflect.construct.bind():function _construct(Parent,args,Class){var a=[null];a.push.apply(a,args);var instance=new(Function.bind.apply(Parent,a));return Class&&_setPrototypeOf(instance,Class.prototype),instance},_construct.apply(null,arguments)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function _setPrototypeOf(o,p){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){return o.__proto__=p,o},_setPrototypeOf(o,p)}function _getPrototypeOf(o){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_getPrototypeOf(o)}function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var DATE_REGEX=new RegExp("^\\d\\d\\d\\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])"),TIME_REGEX=new RegExp("^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])$");function dotValidateDate(date){return DATE_REGEX.test(date)?date:null}function dotValidateTime(time){return TIME_REGEX.test(time)?time:null}function dotParseDate(data){var _ref2=_slicedToArray(data?data.split(" "):"",2),dateOrTime=_ref2[0],time=_ref2[1];return{date:dotValidateDate(dateOrTime),time:dotValidateTime(time)||dotValidateTime(dateOrTime)}}var DotFieldPropError=function(_Error){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),Object.defineProperty(subClass,"prototype",{writable:!1}),superClass&&_setPrototypeOf(subClass,superClass)}(DotFieldPropError,_Error);var _super=function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return _possibleConstructorReturn(this,result)}}(DotFieldPropError);function DotFieldPropError(propInfo,expectedType){var _this;return function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,DotFieldPropError),(_this=_super.call(this,'Warning: Invalid prop "'+propInfo.name+'" of type "'+typeof propInfo.value+'" supplied to "'+propInfo.field.type+'" with the name "'+propInfo.field.name+'", expected "'+expectedType+'".\nDoc Reference: https://github.com/dotCMS/core-web/blob/master/projects/dotcms-field-elements/src/components/'+propInfo.field.type+"/readme.md")).propInfo=propInfo,_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(DotFieldPropError,[{key:"getProps",value:function getProps(){return Object.assign({},this.propInfo)}}]),DotFieldPropError}(_wrapNativeSuper(Error));function stringValidator(propInfo){if("string"!=typeof propInfo.value)throw new DotFieldPropError(propInfo,"string")}var PROP_VALIDATION_HANDLING={date:function dateValidator(propInfo){if(!dotValidateDate(propInfo.value.toString()))throw new DotFieldPropError(propInfo,"Date")},dateRange:function dateRangeValidator(propInfo){var _propInfo$value$toStr2=_slicedToArray(propInfo.value.toString().split(","),2),start=_propInfo$value$toStr2[0],end=_propInfo$value$toStr2[1];if(!dotValidateDate(start)||!dotValidateDate(end))throw new DotFieldPropError(propInfo,"Date");!function areRangeDatesValid(start,end,propInfo){if(start>end)throw new DotFieldPropError(propInfo,"Date")}(new Date(start),new Date(end),propInfo)},dateTime:function dateTimeValidator(propInfo){if("string"!=typeof propInfo.value)throw new DotFieldPropError(propInfo,"Date/Time");if(!function isValidDateSlot(dateSlot,rawData){return!!rawData&&(rawData.split(" ").length>1?function isValidFullDateSlot(dateSlot){return!!dateSlot.date&&!!dateSlot.time}(dateSlot):function isValidPartialDateSlot(dateSlot){return!!dateSlot.date||!!dateSlot.time}(dateSlot))}(dotParseDate(propInfo.value),propInfo.value))throw new DotFieldPropError(propInfo,"Date/Time")},number:function numberValidator(propInfo){if(isNaN(Number(propInfo.value)))throw new DotFieldPropError(propInfo,"Number")},options:stringValidator,regexCheck:function regexValidator(propInfo){try{RegExp(propInfo.value.toString())}catch(e){throw new DotFieldPropError(propInfo,"valid regular expression")}},step:stringValidator,string:stringValidator,time:function timeValidator(propInfo){if(!dotValidateTime(propInfo.value.toString()))throw new DotFieldPropError(propInfo,"Time")},type:stringValidator,accept:stringValidator},FIELDS_DEFAULT_VALUE={options:"",regexCheck:"",value:"",min:"",max:"",step:"",type:"text",accept:null};function checkProp(component,propertyName,validatorType){var proInfo=function getPropInfo(element,propertyName){return{value:element[propertyName],name:propertyName,field:{name:element.name,type:element.el.tagName.toLocaleLowerCase()}}}(component,propertyName);try{return function validateProp(propInfo,validatorType){propInfo.value&&PROP_VALIDATION_HANDLING[validatorType||propInfo.name](propInfo)}(proInfo,validatorType),component[propertyName]}catch(error){return console.warn(error.message),FIELDS_DEFAULT_VALUE[propertyName]}}},"./dist/libs/dotcms-webcomponents/dist/esm/dot-key-value.entry.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"dot_key_value",(function(){return DotKeyValueComponent}));__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.array.map.js"),__webpack_require__("./node_modules/core-js/modules/es.promise.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.array.filter.js"),__webpack_require__("./node_modules/core-js/modules/web.timers.js"),__webpack_require__("./node_modules/core-js/modules/es.array.some.js"),__webpack_require__("./node_modules/core-js/modules/es.array.concat.js"),__webpack_require__("./node_modules/core-js/modules/es.object.assign.js"),__webpack_require__("./node_modules/core-js/modules/es.function.bind.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js"),__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js"),__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js"),__webpack_require__("./node_modules/core-js/modules/es.object.create.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.array.for-each.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.array.reverse.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.array.is-array.js"),__webpack_require__("./node_modules/core-js/modules/es.array.from.js");var _index_27076004_js__WEBPACK_IMPORTED_MODULE_30__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/index-27076004.js"),_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/utils-0044bfa9.js"),_checkProp_286e406e_js__WEBPACK_IMPORTED_MODULE_32__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/checkProp-286e406e.js");function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _regeneratorRuntime(){_regeneratorRuntime=function _regeneratorRuntime(){return exports};var exports={},Op=Object.prototype,hasOwn=Op.hasOwnProperty,$Symbol="function"==typeof Symbol?Symbol:{},iteratorSymbol=$Symbol.iterator||"@@iterator",asyncIteratorSymbol=$Symbol.asyncIterator||"@@asyncIterator",toStringTagSymbol=$Symbol.toStringTag||"@@toStringTag";function define(obj,key,value){return Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}),obj[key]}try{define({},"")}catch(err){define=function define(obj,key,value){return obj[key]=value}}function wrap(innerFn,outerFn,self,tryLocsList){var protoGenerator=outerFn&&outerFn.prototype instanceof Generator?outerFn:Generator,generator=Object.create(protoGenerator.prototype),context=new Context(tryLocsList||[]);return generator._invoke=function(innerFn,self,context){var state="suspendedStart";return function(method,arg){if("executing"===state)throw new Error("Generator is already running");if("completed"===state){if("throw"===method)throw arg;return doneResult()}for(context.method=method,context.arg=arg;;){var delegate=context.delegate;if(delegate){var delegateResult=maybeInvokeDelegate(delegate,context);if(delegateResult){if(delegateResult===ContinueSentinel)continue;return delegateResult}}if("next"===context.method)context.sent=context._sent=context.arg;else if("throw"===context.method){if("suspendedStart"===state)throw state="completed",context.arg;context.dispatchException(context.arg)}else"return"===context.method&&context.abrupt("return",context.arg);state="executing";var record=tryCatch(innerFn,self,context);if("normal"===record.type){if(state=context.done?"completed":"suspendedYield",record.arg===ContinueSentinel)continue;return{value:record.arg,done:context.done}}"throw"===record.type&&(state="completed",context.method="throw",context.arg=record.arg)}}}(innerFn,self,context),generator}function tryCatch(fn,obj,arg){try{return{type:"normal",arg:fn.call(obj,arg)}}catch(err){return{type:"throw",arg:err}}}exports.wrap=wrap;var ContinueSentinel={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}var IteratorPrototype={};define(IteratorPrototype,iteratorSymbol,(function(){return this}));var getProto=Object.getPrototypeOf,NativeIteratorPrototype=getProto&&getProto(getProto(values([])));NativeIteratorPrototype&&NativeIteratorPrototype!==Op&&hasOwn.call(NativeIteratorPrototype,iteratorSymbol)&&(IteratorPrototype=NativeIteratorPrototype);var Gp=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(IteratorPrototype);function defineIteratorMethods(prototype){["next","throw","return"].forEach((function(method){define(prototype,method,(function(arg){return this._invoke(method,arg)}))}))}function AsyncIterator(generator,PromiseImpl){function invoke(method,arg,resolve,reject){var record=tryCatch(generator[method],generator,arg);if("throw"!==record.type){var result=record.arg,value=result.value;return value&&"object"==typeof value&&hasOwn.call(value,"__await")?PromiseImpl.resolve(value.__await).then((function(value){invoke("next",value,resolve,reject)}),(function(err){invoke("throw",err,resolve,reject)})):PromiseImpl.resolve(value).then((function(unwrapped){result.value=unwrapped,resolve(result)}),(function(error){return invoke("throw",error,resolve,reject)}))}reject(record.arg)}var previousPromise;this._invoke=function(method,arg){function callInvokeWithMethodAndArg(){return new PromiseImpl((function(resolve,reject){invoke(method,arg,resolve,reject)}))}return previousPromise=previousPromise?previousPromise.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):callInvokeWithMethodAndArg()}}function maybeInvokeDelegate(delegate,context){var method=delegate.iterator[context.method];if(void 0===method){if(context.delegate=null,"throw"===context.method){if(delegate.iterator.return&&(context.method="return",context.arg=void 0,maybeInvokeDelegate(delegate,context),"throw"===context.method))return ContinueSentinel;context.method="throw",context.arg=new TypeError("The iterator does not provide a 'throw' method")}return ContinueSentinel}var record=tryCatch(method,delegate.iterator,context.arg);if("throw"===record.type)return context.method="throw",context.arg=record.arg,context.delegate=null,ContinueSentinel;var info=record.arg;return info?info.done?(context[delegate.resultName]=info.value,context.next=delegate.nextLoc,"return"!==context.method&&(context.method="next",context.arg=void 0),context.delegate=null,ContinueSentinel):info:(context.method="throw",context.arg=new TypeError("iterator result is not an object"),context.delegate=null,ContinueSentinel)}function pushTryEntry(locs){var entry={tryLoc:locs[0]};1 in locs&&(entry.catchLoc=locs[1]),2 in locs&&(entry.finallyLoc=locs[2],entry.afterLoc=locs[3]),this.tryEntries.push(entry)}function resetTryEntry(entry){var record=entry.completion||{};record.type="normal",delete record.arg,entry.completion=record}function Context(tryLocsList){this.tryEntries=[{tryLoc:"root"}],tryLocsList.forEach(pushTryEntry,this),this.reset(!0)}function values(iterable){if(iterable){var iteratorMethod=iterable[iteratorSymbol];if(iteratorMethod)return iteratorMethod.call(iterable);if("function"==typeof iterable.next)return iterable;if(!isNaN(iterable.length)){var i=-1,next=function next(){for(;++i<iterable.length;)if(hasOwn.call(iterable,i))return next.value=iterable[i],next.done=!1,next;return next.value=void 0,next.done=!0,next};return next.next=next}}return{next:doneResult}}function doneResult(){return{value:void 0,done:!0}}return GeneratorFunction.prototype=GeneratorFunctionPrototype,define(Gp,"constructor",GeneratorFunctionPrototype),define(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName=define(GeneratorFunctionPrototype,toStringTagSymbol,"GeneratorFunction"),exports.isGeneratorFunction=function(genFun){var ctor="function"==typeof genFun&&genFun.constructor;return!!ctor&&(ctor===GeneratorFunction||"GeneratorFunction"===(ctor.displayName||ctor.name))},exports.mark=function(genFun){return Object.setPrototypeOf?Object.setPrototypeOf(genFun,GeneratorFunctionPrototype):(genFun.__proto__=GeneratorFunctionPrototype,define(genFun,toStringTagSymbol,"GeneratorFunction")),genFun.prototype=Object.create(Gp),genFun},exports.awrap=function(arg){return{__await:arg}},defineIteratorMethods(AsyncIterator.prototype),define(AsyncIterator.prototype,asyncIteratorSymbol,(function(){return this})),exports.AsyncIterator=AsyncIterator,exports.async=function(innerFn,outerFn,self,tryLocsList,PromiseImpl){void 0===PromiseImpl&&(PromiseImpl=Promise);var iter=new AsyncIterator(wrap(innerFn,outerFn,self,tryLocsList),PromiseImpl);return exports.isGeneratorFunction(outerFn)?iter:iter.next().then((function(result){return result.done?result.value:iter.next()}))},defineIteratorMethods(Gp),define(Gp,toStringTagSymbol,"Generator"),define(Gp,iteratorSymbol,(function(){return this})),define(Gp,"toString",(function(){return"[object Generator]"})),exports.keys=function(object){var keys=[];for(var key in object)keys.push(key);return keys.reverse(),function next(){for(;keys.length;){var key=keys.pop();if(key in object)return next.value=key,next.done=!1,next}return next.done=!0,next}},exports.values=values,Context.prototype={constructor:Context,reset:function reset(skipTempReset){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(resetTryEntry),!skipTempReset)for(var name in this)"t"===name.charAt(0)&&hasOwn.call(this,name)&&!isNaN(+name.slice(1))&&(this[name]=void 0)},stop:function stop(){this.done=!0;var rootRecord=this.tryEntries[0].completion;if("throw"===rootRecord.type)throw rootRecord.arg;return this.rval},dispatchException:function dispatchException(exception){if(this.done)throw exception;var context=this;function handle(loc,caught){return record.type="throw",record.arg=exception,context.next=loc,caught&&(context.method="next",context.arg=void 0),!!caught}for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i],record=entry.completion;if("root"===entry.tryLoc)return handle("end");if(entry.tryLoc<=this.prev){var hasCatch=hasOwn.call(entry,"catchLoc"),hasFinally=hasOwn.call(entry,"finallyLoc");if(hasCatch&&hasFinally){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0);if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}else if(hasCatch){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0)}else{if(!hasFinally)throw new Error("try statement without catch or finally");if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}}}},abrupt:function abrupt(type,arg){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc<=this.prev&&hasOwn.call(entry,"finallyLoc")&&this.prev<entry.finallyLoc){var finallyEntry=entry;break}}finallyEntry&&("break"===type||"continue"===type)&&finallyEntry.tryLoc<=arg&&arg<=finallyEntry.finallyLoc&&(finallyEntry=null);var record=finallyEntry?finallyEntry.completion:{};return record.type=type,record.arg=arg,finallyEntry?(this.method="next",this.next=finallyEntry.finallyLoc,ContinueSentinel):this.complete(record)},complete:function complete(record,afterLoc){if("throw"===record.type)throw record.arg;return"break"===record.type||"continue"===record.type?this.next=record.arg:"return"===record.type?(this.rval=this.arg=record.arg,this.method="return",this.next="end"):"normal"===record.type&&afterLoc&&(this.next=afterLoc),ContinueSentinel},finish:function finish(finallyLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.finallyLoc===finallyLoc)return this.complete(entry.completion,entry.afterLoc),resetTryEntry(entry),ContinueSentinel}},catch:function _catch(tryLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc===tryLoc){var record=entry.completion;if("throw"===record.type){var thrown=record.arg;resetTryEntry(entry)}return thrown}}throw new Error("illegal catch attempt")},delegateYield:function delegateYield(iterable,resultName,nextLoc){return this.delegate={iterator:values(iterable),resultName:resultName,nextLoc:nextLoc},"next"===this.method&&(this.arg=void 0),ContinueSentinel}},exports}function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}var mapToKeyValue=function mapToKeyValue(_ref){return{key:_ref.label,value:_ref.value}},DotKeyValueComponent=function(){function DotKeyValueComponent(hostRef){!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,DotKeyValueComponent),Object(_index_27076004_js__WEBPACK_IMPORTED_MODULE_30__.g)(this,hostRef),this.dotValueChange=Object(_index_27076004_js__WEBPACK_IMPORTED_MODULE_30__.c)(this,"dotValueChange",7),this.dotStatusChange=Object(_index_27076004_js__WEBPACK_IMPORTED_MODULE_30__.c)(this,"dotStatusChange",7),this.value="",this.name="",this.label="",this.hint="",this.required=!1,this.requiredMessage="This field is required",this.duplicatedKeyMessage="The key already exists",this.disabled=!1,this.uniqueKeys=!1,this.items=[]}var _reset;return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(DotKeyValueComponent,[{key:"valueWatch",value:function valueWatch(){this.value=Object(_checkProp_286e406e_js__WEBPACK_IMPORTED_MODULE_32__.a)(this,"value","string"),this.items=Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.f)(this.value).map(mapToKeyValue)}},{key:"reset",value:(_reset=function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}(_regeneratorRuntime().mark((function _callee(){return _regeneratorRuntime().wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:this.items=[],this.value="",this.status=Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.g)(this.isValid()),this.emitChanges();case 4:case"end":return _context.stop()}}),_callee,this)}))),function reset(){return _reset.apply(this,arguments)})},{key:"deleteItemHandler",value:function deleteItemHandler(event){event.stopImmediatePropagation(),this.items=this.items.filter((function(_item,index){return index!==event.detail})),this.errorExistingKey=!1,this.refreshStatus(),this.emitChanges()}},{key:"reorderItemsHandler",value:function reorderItemsHandler(event){var _this=this;event.stopImmediatePropagation(),this.items=[{key:" ",value:""}];for(var keys=document.querySelectorAll(".key-value-table-wc__key"),values=document.querySelectorAll(".key-value-table-wc__value"),keyValueRawData="",i=0,total=keys.length;i<total;i++)keyValueRawData+=keys[i].innerHTML+"|"+values[i].innerHTML+",";setTimeout((function(){_this.items=_toConsumableArray(Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.f)(keyValueRawData.substring(0,keyValueRawData.length-1)).map(mapToKeyValue)),_this.refreshStatus(),_this.emitChanges()}),100)}},{key:"addItemHandler",value:function addItemHandler(_ref2){var detail=_ref2.detail;this.refreshStatus(),this.errorExistingKey=this.items.some((function(item){return item.key===detail.key})),(this.uniqueKeys&&!this.errorExistingKey||!this.uniqueKeys)&&(this.items=[].concat(_toConsumableArray(this.items),[detail]),this.emitChanges())}},{key:"keyChangedHandler",value:function keyChangedHandler(){this.errorExistingKey&&(this.errorExistingKey=!1)}},{key:"componentWillLoad",value:function componentWillLoad(){this.validateProps(),this.setOriginalStatus(),this.emitStatusChange()}},{key:"render",value:function render(){var classes=Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.a)(this.status,this.isValid()&&!this.errorExistingKey,this.required);return Object(_index_27076004_js__WEBPACK_IMPORTED_MODULE_30__.e)(_index_27076004_js__WEBPACK_IMPORTED_MODULE_30__.a,{class:Object.assign({},classes)},Object(_index_27076004_js__WEBPACK_IMPORTED_MODULE_30__.e)("dot-label",{"aria-describedby":Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.h)(this.hint),tabIndex:this.hint?0:null,label:this.label,required:this.required,name:this.name},this.disabled?"":this.getKeyValueForm(),Object(_index_27076004_js__WEBPACK_IMPORTED_MODULE_30__.e)("key-value-table",{onClick:function onClick(e){e.preventDefault()},"button-label":this.listDeleteLabel,disabled:this.isDisabled(),items:this.items})),Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.c)(this.hint),Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.b)(this.showErrorMessage(),this.getErrorMessage()))}},{key:"getKeyValueForm",value:function getKeyValueForm(){return Object(_index_27076004_js__WEBPACK_IMPORTED_MODULE_30__.e)("key-value-form",{onLostFocus:this.blurHandler.bind(this),"add-button-label":this.formAddButtonLabel,disabled:this.isDisabled(),"empty-dropdown-option-label":this.whiteListEmptyOptionLabel,"key-label":this.formKeyLabel,"key-placeholder":this.formKeyPlaceholder,"value-label":this.formValueLabel,"value-placeholder":this.formValuePlaceholder,"white-list":this.whiteList})}},{key:"isDisabled",value:function isDisabled(){return this.disabled||null}},{key:"blurHandler",value:function blurHandler(){this.status.dotTouched||(this.status=Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.o)(this.status,{dotTouched:!0}),this.emitStatusChange())}},{key:"validateProps",value:function validateProps(){this.valueWatch()}},{key:"setOriginalStatus",value:function setOriginalStatus(){this.status=Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.g)(this.isValid())}},{key:"isValid",value:function isValid(){return!(this.required&&!this.items.length)}},{key:"showErrorMessage",value:function showErrorMessage(){return this.getErrorMessage()&&!this.status.dotPristine}},{key:"getErrorMessage",value:function getErrorMessage(){var errorMsg="";return this.errorExistingKey?errorMsg=this.duplicatedKeyMessage:this.isValid(),errorMsg}},{key:"refreshStatus",value:function refreshStatus(){this.status=Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.o)(this.status,{dotTouched:!0,dotPristine:!1,dotValid:this.isValid()})}},{key:"emitStatusChange",value:function emitStatusChange(){this.dotStatusChange.emit({name:this.name,status:this.status})}},{key:"emitValueChange",value:function emitValueChange(){var returnedValue=Object(_utils_0044bfa9_js__WEBPACK_IMPORTED_MODULE_31__.d)(this.items);this.dotValueChange.emit({name:this.name,value:returnedValue})}},{key:"emitChanges",value:function emitChanges(){this.emitStatusChange(),this.emitValueChange()}},{key:"el",get:function get(){return Object(_index_27076004_js__WEBPACK_IMPORTED_MODULE_30__.d)(this)}}],[{key:"watchers",get:function get(){return{value:["valueWatch"]}}}]),DotKeyValueComponent}();DotKeyValueComponent.style=""},"./dist/libs/dotcms-webcomponents/dist/esm/utils-0044bfa9.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return getClassNames})),__webpack_require__.d(__webpack_exports__,"b",(function(){return getTagError})),__webpack_require__.d(__webpack_exports__,"c",(function(){return getTagHint})),__webpack_require__.d(__webpack_exports__,"d",(function(){return getStringFromDotKeyArray})),__webpack_require__.d(__webpack_exports__,"e",(function(){return isStringType})),__webpack_require__.d(__webpack_exports__,"f",(function(){return getDotOptionsFromFieldValue})),__webpack_require__.d(__webpack_exports__,"g",(function(){return getOriginalStatus})),__webpack_require__.d(__webpack_exports__,"h",(function(){return getHintId})),__webpack_require__.d(__webpack_exports__,"i",(function(){return isFileAllowed})),__webpack_require__.d(__webpack_exports__,"j",(function(){return getErrorClass})),__webpack_require__.d(__webpack_exports__,"k",(function(){return getId})),__webpack_require__.d(__webpack_exports__,"l",(function(){return isValidURL})),__webpack_require__.d(__webpack_exports__,"m",(function(){return getLabelId})),__webpack_require__.d(__webpack_exports__,"n",(function(){return nextTick})),__webpack_require__.d(__webpack_exports__,"o",(function(){return updateStatus}));__webpack_require__("./node_modules/core-js/modules/es.string.replace.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"),__webpack_require__("./node_modules/core-js/modules/es.array.map.js"),__webpack_require__("./node_modules/core-js/modules/es.array.filter.js"),__webpack_require__("./node_modules/core-js/modules/es.string.split.js"),__webpack_require__("./node_modules/core-js/modules/es.array.join.js"),__webpack_require__("./node_modules/core-js/modules/es.object.assign.js"),__webpack_require__("./node_modules/core-js/modules/web.url.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.find.js"),__webpack_require__("./node_modules/core-js/modules/es.array.includes.js"),__webpack_require__("./node_modules/core-js/modules/es.string.includes.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.array.is-array.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.array.from.js");var _index_27076004_js__WEBPACK_IMPORTED_MODULE_24__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/index-27076004.js");function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function nextTick(fn){var id=window.requestAnimationFrame((function(){fn&&fn(),window.cancelAnimationFrame(id)}))}function getClassNames(status,isValid,required){return{"dot-valid":isValid,"dot-invalid":!isValid,"dot-pristine":status.dotPristine,"dot-dirty":!status.dotPristine,"dot-touched":status.dotTouched,"dot-untouched":!status.dotTouched,"dot-required":required}}function isStringType(val){return"string"==typeof val&&!!val}function getDotOptionsFromFieldValue(rawString){return isStringType(rawString)&&function isKeyPipeValueFormatValid(rawString){for(var regex=/([^|,]*)\|([^|,]*)/,items=rawString.split(","),valid=!0,i=0,total=items.length;i<total;i++)if(!regex.test(items[i])){valid=!1;break}return valid}(rawString=rawString.replace(/(?:\\[rn]|[\r\n]+)+/g,","))?rawString.split(",").filter((function(item){return!!item.length})).map((function(item){var _item$split2=_slicedToArray(item.split("|"),2);return{label:_item$split2[0],value:_item$split2[1]}})):[]}function getErrorClass(valid){return valid?void 0:"dot-field__error"}function getHintId(name){var value=slugify(name);return value?"hint-"+value:void 0}function getId(name){var value=slugify(name);return name?"dot-"+slugify(value):void 0}function getLabelId(name){var value=slugify(name);return value?"label-"+value:void 0}function getOriginalStatus(isValid){return{dotValid:void 0===isValid||isValid,dotTouched:!1,dotPristine:!0}}function getStringFromDotKeyArray(values){return values.map((function(item){return item.key+"|"+item.value})).join(",")}function updateStatus(state,change){return Object.assign(Object.assign({},state),change)}function getTagError(show,message){return show&&isStringType(message)?Object(_index_27076004_js__WEBPACK_IMPORTED_MODULE_24__.e)("span",{class:"dot-field__error-message"},message):null}function getTagHint(hint){return isStringType(hint)?Object(_index_27076004_js__WEBPACK_IMPORTED_MODULE_24__.e)("span",{class:"dot-field__hint",id:getHintId(hint)},hint):null}function isValidURL(url){try{return!!new URL(url)}catch(e){return!1}}function isFileAllowed(name,type,allowedExtensions){if(""===allowedExtensions)return!0;var fileExt=function getFileExtension(filename){return/(?:\.([^.]+))?$/.exec(filename)[1]}(name);return!!allowedExtensions.split(",").find((function(allowedExt){if("*"===allowedExt)return!0;if(allowedExt.includes("/*")){var extType=allowedExt.split("/*").filter(Boolean).join("");return type.includes(extType)}return allowedExt.includes(fileExt)}))}function slugify(text){return text?text.toString().toLowerCase().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,""):null}}}]);
//# sourceMappingURL=32.6920fe91.iframe.bundle.js.map