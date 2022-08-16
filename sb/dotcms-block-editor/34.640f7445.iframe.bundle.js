/*! For license information please see 34.640f7445.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkdotcms_ui=self.webpackChunkdotcms_ui||[]).push([[34],{"./dist/libs/dotcms-webcomponents/dist/esm/dot-autocomplete_2.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{dot_autocomplete:()=>DotAutocompleteComponent,dot_chip:()=>DotChipComponent});__webpack_require__("./node_modules/core-js/modules/es.object.keys.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.array.filter.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js"),__webpack_require__("./node_modules/core-js/modules/es.array.for-each.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-properties.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.is-array.js"),__webpack_require__("./node_modules/core-js/modules/es.array.from.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.string.replace.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"),__webpack_require__("./node_modules/core-js/modules/es.array.join.js"),__webpack_require__("./node_modules/core-js/modules/es.array.map.js"),__webpack_require__("./node_modules/core-js/modules/es.array.index-of.js"),__webpack_require__("./node_modules/core-js/modules/es.promise.js"),__webpack_require__("./node_modules/core-js/modules/es.string.split.js"),__webpack_require__("./node_modules/core-js/modules/es.array.concat.js"),__webpack_require__("./node_modules/core-js/modules/es.string.match.js"),__webpack_require__("./node_modules/core-js/modules/web.timers.js"),__webpack_require__("./node_modules/core-js/modules/es.string.search.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.function.bind.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js"),__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js"),__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js"),__webpack_require__("./node_modules/core-js/modules/es.object.create.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.array.reverse.js");var _index_27076004_js__WEBPACK_IMPORTED_MODULE_40__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/index-27076004.js");function _regeneratorRuntime(){_regeneratorRuntime=function _regeneratorRuntime(){return exports};var exports={},Op=Object.prototype,hasOwn=Op.hasOwnProperty,$Symbol="function"==typeof Symbol?Symbol:{},iteratorSymbol=$Symbol.iterator||"@@iterator",asyncIteratorSymbol=$Symbol.asyncIterator||"@@asyncIterator",toStringTagSymbol=$Symbol.toStringTag||"@@toStringTag";function define(obj,key,value){return Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}),obj[key]}try{define({},"")}catch(err){define=function define(obj,key,value){return obj[key]=value}}function wrap(innerFn,outerFn,self,tryLocsList){var protoGenerator=outerFn&&outerFn.prototype instanceof Generator?outerFn:Generator,generator=Object.create(protoGenerator.prototype),context=new Context(tryLocsList||[]);return generator._invoke=function(innerFn,self,context){var state="suspendedStart";return function(method,arg){if("executing"===state)throw new Error("Generator is already running");if("completed"===state){if("throw"===method)throw arg;return doneResult()}for(context.method=method,context.arg=arg;;){var delegate=context.delegate;if(delegate){var delegateResult=maybeInvokeDelegate(delegate,context);if(delegateResult){if(delegateResult===ContinueSentinel)continue;return delegateResult}}if("next"===context.method)context.sent=context._sent=context.arg;else if("throw"===context.method){if("suspendedStart"===state)throw state="completed",context.arg;context.dispatchException(context.arg)}else"return"===context.method&&context.abrupt("return",context.arg);state="executing";var record=tryCatch(innerFn,self,context);if("normal"===record.type){if(state=context.done?"completed":"suspendedYield",record.arg===ContinueSentinel)continue;return{value:record.arg,done:context.done}}"throw"===record.type&&(state="completed",context.method="throw",context.arg=record.arg)}}}(innerFn,self,context),generator}function tryCatch(fn,obj,arg){try{return{type:"normal",arg:fn.call(obj,arg)}}catch(err){return{type:"throw",arg:err}}}exports.wrap=wrap;var ContinueSentinel={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}var IteratorPrototype={};define(IteratorPrototype,iteratorSymbol,(function(){return this}));var getProto=Object.getPrototypeOf,NativeIteratorPrototype=getProto&&getProto(getProto(values([])));NativeIteratorPrototype&&NativeIteratorPrototype!==Op&&hasOwn.call(NativeIteratorPrototype,iteratorSymbol)&&(IteratorPrototype=NativeIteratorPrototype);var Gp=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(IteratorPrototype);function defineIteratorMethods(prototype){["next","throw","return"].forEach((function(method){define(prototype,method,(function(arg){return this._invoke(method,arg)}))}))}function AsyncIterator(generator,PromiseImpl){function invoke(method,arg,resolve,reject){var record=tryCatch(generator[method],generator,arg);if("throw"!==record.type){var result=record.arg,value=result.value;return value&&"object"==typeof value&&hasOwn.call(value,"__await")?PromiseImpl.resolve(value.__await).then((function(value){invoke("next",value,resolve,reject)}),(function(err){invoke("throw",err,resolve,reject)})):PromiseImpl.resolve(value).then((function(unwrapped){result.value=unwrapped,resolve(result)}),(function(error){return invoke("throw",error,resolve,reject)}))}reject(record.arg)}var previousPromise;this._invoke=function(method,arg){function callInvokeWithMethodAndArg(){return new PromiseImpl((function(resolve,reject){invoke(method,arg,resolve,reject)}))}return previousPromise=previousPromise?previousPromise.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):callInvokeWithMethodAndArg()}}function maybeInvokeDelegate(delegate,context){var method=delegate.iterator[context.method];if(void 0===method){if(context.delegate=null,"throw"===context.method){if(delegate.iterator.return&&(context.method="return",context.arg=void 0,maybeInvokeDelegate(delegate,context),"throw"===context.method))return ContinueSentinel;context.method="throw",context.arg=new TypeError("The iterator does not provide a 'throw' method")}return ContinueSentinel}var record=tryCatch(method,delegate.iterator,context.arg);if("throw"===record.type)return context.method="throw",context.arg=record.arg,context.delegate=null,ContinueSentinel;var info=record.arg;return info?info.done?(context[delegate.resultName]=info.value,context.next=delegate.nextLoc,"return"!==context.method&&(context.method="next",context.arg=void 0),context.delegate=null,ContinueSentinel):info:(context.method="throw",context.arg=new TypeError("iterator result is not an object"),context.delegate=null,ContinueSentinel)}function pushTryEntry(locs){var entry={tryLoc:locs[0]};1 in locs&&(entry.catchLoc=locs[1]),2 in locs&&(entry.finallyLoc=locs[2],entry.afterLoc=locs[3]),this.tryEntries.push(entry)}function resetTryEntry(entry){var record=entry.completion||{};record.type="normal",delete record.arg,entry.completion=record}function Context(tryLocsList){this.tryEntries=[{tryLoc:"root"}],tryLocsList.forEach(pushTryEntry,this),this.reset(!0)}function values(iterable){if(iterable){var iteratorMethod=iterable[iteratorSymbol];if(iteratorMethod)return iteratorMethod.call(iterable);if("function"==typeof iterable.next)return iterable;if(!isNaN(iterable.length)){var i=-1,next=function next(){for(;++i<iterable.length;)if(hasOwn.call(iterable,i))return next.value=iterable[i],next.done=!1,next;return next.value=void 0,next.done=!0,next};return next.next=next}}return{next:doneResult}}function doneResult(){return{value:void 0,done:!0}}return GeneratorFunction.prototype=GeneratorFunctionPrototype,define(Gp,"constructor",GeneratorFunctionPrototype),define(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName=define(GeneratorFunctionPrototype,toStringTagSymbol,"GeneratorFunction"),exports.isGeneratorFunction=function(genFun){var ctor="function"==typeof genFun&&genFun.constructor;return!!ctor&&(ctor===GeneratorFunction||"GeneratorFunction"===(ctor.displayName||ctor.name))},exports.mark=function(genFun){return Object.setPrototypeOf?Object.setPrototypeOf(genFun,GeneratorFunctionPrototype):(genFun.__proto__=GeneratorFunctionPrototype,define(genFun,toStringTagSymbol,"GeneratorFunction")),genFun.prototype=Object.create(Gp),genFun},exports.awrap=function(arg){return{__await:arg}},defineIteratorMethods(AsyncIterator.prototype),define(AsyncIterator.prototype,asyncIteratorSymbol,(function(){return this})),exports.AsyncIterator=AsyncIterator,exports.async=function(innerFn,outerFn,self,tryLocsList,PromiseImpl){void 0===PromiseImpl&&(PromiseImpl=Promise);var iter=new AsyncIterator(wrap(innerFn,outerFn,self,tryLocsList),PromiseImpl);return exports.isGeneratorFunction(outerFn)?iter:iter.next().then((function(result){return result.done?result.value:iter.next()}))},defineIteratorMethods(Gp),define(Gp,toStringTagSymbol,"Generator"),define(Gp,iteratorSymbol,(function(){return this})),define(Gp,"toString",(function(){return"[object Generator]"})),exports.keys=function(object){var keys=[];for(var key in object)keys.push(key);return keys.reverse(),function next(){for(;keys.length;){var key=keys.pop();if(key in object)return next.value=key,next.done=!1,next}return next.done=!0,next}},exports.values=values,Context.prototype={constructor:Context,reset:function reset(skipTempReset){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(resetTryEntry),!skipTempReset)for(var name in this)"t"===name.charAt(0)&&hasOwn.call(this,name)&&!isNaN(+name.slice(1))&&(this[name]=void 0)},stop:function stop(){this.done=!0;var rootRecord=this.tryEntries[0].completion;if("throw"===rootRecord.type)throw rootRecord.arg;return this.rval},dispatchException:function dispatchException(exception){if(this.done)throw exception;var context=this;function handle(loc,caught){return record.type="throw",record.arg=exception,context.next=loc,caught&&(context.method="next",context.arg=void 0),!!caught}for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i],record=entry.completion;if("root"===entry.tryLoc)return handle("end");if(entry.tryLoc<=this.prev){var hasCatch=hasOwn.call(entry,"catchLoc"),hasFinally=hasOwn.call(entry,"finallyLoc");if(hasCatch&&hasFinally){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0);if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}else if(hasCatch){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0)}else{if(!hasFinally)throw new Error("try statement without catch or finally");if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}}}},abrupt:function abrupt(type,arg){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc<=this.prev&&hasOwn.call(entry,"finallyLoc")&&this.prev<entry.finallyLoc){var finallyEntry=entry;break}}finallyEntry&&("break"===type||"continue"===type)&&finallyEntry.tryLoc<=arg&&arg<=finallyEntry.finallyLoc&&(finallyEntry=null);var record=finallyEntry?finallyEntry.completion:{};return record.type=type,record.arg=arg,finallyEntry?(this.method="next",this.next=finallyEntry.finallyLoc,ContinueSentinel):this.complete(record)},complete:function complete(record,afterLoc){if("throw"===record.type)throw record.arg;return"break"===record.type||"continue"===record.type?this.next=record.arg:"return"===record.type?(this.rval=this.arg=record.arg,this.method="return",this.next="end"):"normal"===record.type&&afterLoc&&(this.next=afterLoc),ContinueSentinel},finish:function finish(finallyLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.finallyLoc===finallyLoc)return this.complete(entry.completion,entry.afterLoc),resetTryEntry(entry),ContinueSentinel}},catch:function _catch(tryLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc===tryLoc){var record=entry.completion;if("throw"===record.type){var thrown=record.arg;resetTryEntry(entry)}return thrown}}throw new Error("illegal catch attempt")},delegateYield:function delegateYield(iterable,resultName,nextLoc){return this.delegate={iterator:values(iterable),resultName,nextLoc},"next"===this.method&&(this.arg=void 0),ContinueSentinel}},exports}function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}var autoComplete_min=function createCommonjsModule(fn,basedir,module){return fn(module={path:basedir,exports:{},require:function require(path,base){return function commonjsRequire(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}()}},module.exports),module.exports}((function(module,exports){var t;t=function t(){function e(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function t(t){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?e(Object(i),!0).forEach((function(e){r(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):e(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e){return function(e){if(Array.isArray(e))return s(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||o(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){if(e){if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var u=function u(e){return"string"==typeof e?document.querySelector(e):e()},a=function a(e,t){var n="string"==typeof e?document.createElement(e):e;for(var r in t){var i=t[r];if("inside"===r)i.append(n);else if("dest"===r)u(i[0]).insertAdjacentElement(i[1],n);else if("around"===r){var o=i;o.parentNode.insertBefore(n,o),n.append(o),null!=o.getAttribute("autofocus")&&o.focus()}else r in n?n[r]=i:n.setAttribute(r,i)}return n},c=function c(e,t){return e=String(e).toLowerCase(),t?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").normalize("NFC"):e},l=function l(e,n){return a("mark",t({innerHTML:e},"string"==typeof n&&{class:n})).outerHTML},f=function f(e,t){t.input.dispatchEvent(new CustomEvent(e,{bubbles:!0,detail:t.feedback,cancelable:!0}))},p=function p(e,t,n){var r=n||{},i=r.mode,o=r.diacritics,s=r.highlight,u=c(t,o);if(t=String(t),e=c(e,o),"loose"===i){var a=(e=e.replace(/ /g,"")).length,f=0,p=Array.from(t).map((function(t,n){return f<a&&u[n]===e[f]&&(t=s?l(t,s):t,f++),t})).join("");if(f===a)return p}else{var d=u.indexOf(e);if(~d)return e=t.substring(d,d+e.length),s?t.replace(e,l(e,s)):t}},d=function d(e,t){return new Promise((function(n,r){var i;return(i=e.data).cache&&i.store?n():new Promise((function(e,n){return"function"==typeof i.src?i.src(t).then(e,n):e(i.src)})).then((function(t){try{return e.feedback=i.store=t,f("response",e),n()}catch(e){return r(e)}}),r)}))},h=function h(e,t){var n=t.data,r=t.searchEngine,i=[];n.store.forEach((function(s,u){var a=function a(n){var o=n?s[n]:s,u="function"==typeof r?r(e,o):p(e,o,{mode:r,diacritics:t.diacritics,highlight:t.resultItem.highlight});if(u){var a={match:u,value:s};n&&(a.key=n),i.push(a)}};if(n.keys){var c,l=function(e,t){var _n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!_n){if(Array.isArray(e)||(_n=o(e))){_n&&(e=_n);var r=0,i=function i(){};return{s:i,n:function n(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function e(_e){throw _e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,u=!0,a=!1;return{s:function s(){_n=_n.call(e)},n:function n(){var e=_n.next();return u=e.done,e},e:function e(_e2){a=!0,s=_e2},f:function f(){try{u||null==_n.return||_n.return()}finally{if(a)throw s}}}}(n.keys);try{for(l.s();!(c=l.n()).done;)a(c.value)}catch(e){l.e(e)}finally{l.f()}}else a()})),n.filter&&(i=n.filter(i));var s=i.slice(0,t.resultsList.maxResults);t.feedback={query:e,matches:i,results:s},f("results",t)},m="aria-expanded",b="aria-activedescendant",y="aria-selected",v=function v(e,n){e.feedback.selection=t({index:n},e.feedback.results[n])},g=function g(e){e.isOpen||((e.wrapper||e.input).setAttribute(m,!0),e.list.removeAttribute("hidden"),e.isOpen=!0,f("open",e))},w=function w(e){e.isOpen&&((e.wrapper||e.input).setAttribute(m,!1),e.input.setAttribute(b,""),e.list.setAttribute("hidden",""),e.isOpen=!1,f("close",e))},O=function O(e,t){var n=t.resultItem,r=t.list.getElementsByTagName(n.tag),o=!!n.selected&&n.selected.split(" ");if(t.isOpen&&r.length){var s,u,a=t.cursor;e>=r.length&&(e=0),e<0&&(e=r.length-1),t.cursor=e,a>-1&&(r[a].removeAttribute(y),o&&(u=r[a].classList).remove.apply(u,i(o))),r[e].setAttribute(y,!0),o&&(s=r[e].classList).add.apply(s,i(o)),t.input.setAttribute(b,r[t.cursor].id),t.list.scrollTop=r[e].offsetTop-t.list.clientHeight+r[e].clientHeight+5,t.feedback.cursor=t.cursor,v(t,e),f("navigate",t)}},A=function A(e){O(e.cursor+1,e)},k=function k(e){O(e.cursor-1,e)},L=function L(e,t,n){(n=n>=0?n:e.cursor)<0||(e.feedback.event=t,v(e,n),f("selection",e),w(e))};function j(e,n){var r=this;return new Promise((function(i,o){var s,u;return s=n||((u=e.input)instanceof HTMLInputElement||u instanceof HTMLTextAreaElement?u.value:u.innerHTML),function(e,t,n){return t?t(e):e.length>=n}(s=e.query?e.query(s):s,e.trigger,e.threshold)?d(e,s).then((function(n){try{return e.feedback instanceof Error?i():(h(s,e),e.resultsList&&function(e){var n=e.resultsList,r=e.list,i=e.resultItem,o=e.feedback,s=o.matches,u=o.results;if(e.cursor=-1,r.innerHTML="",s.length||n.noResults){var c=new DocumentFragment;u.forEach((function(e,n){var r=a(i.tag,t({id:"".concat(i.id,"_").concat(n),role:"option",innerHTML:e.match,inside:c},i.class&&{class:i.class}));i.element&&i.element(r,e)})),r.append(c),n.element&&n.element(r,o),g(e)}else w(e)}(e),c.call(r))}catch(e){return o(e)}}),o):(w(e),c.call(r));function c(){return i()}}))}var S=function S(e,t){for(var n in e)for(var r in e[n])t(n,r)};function E(e){var n=this;return new Promise((function(r,i){var o,s,u;if(o=e.placeHolder,u={role:"combobox","aria-owns":(s=e.resultsList).id,"aria-haspopup":!0,"aria-expanded":!1},a(e.input,t(t({"aria-controls":s.id,"aria-autocomplete":"both"},o&&{placeholder:o}),!e.wrapper&&t({},u))),e.wrapper&&(e.wrapper=a("div",t({around:e.input,class:e.name+"_wrapper"},u))),s&&(e.list=a(s.tag,t({dest:[s.destination,s.position],id:s.id,role:"listbox",hidden:"hidden"},s.class&&{class:s.class}))),function T(e){var n,r,i,o=e.events,s=(n=function n(){return j(e)},r=e.debounce,function(){clearTimeout(i),i=setTimeout((function(){return n()}),r)}),u=e.events=t({input:t({},o&&o.input)},e.resultsList&&{list:o?t({},o.list):{}}),a={input:{input:function input(){s()},keydown:function keydown(t){!function(e,t){switch(e.keyCode){case 40:case 38:e.preventDefault(),40===e.keyCode?A(t):k(t);break;case 13:t.submit||e.preventDefault(),t.cursor>=0&&L(t,e);break;case 9:t.resultsList.tabSelect&&t.cursor>=0&&L(t,e);break;case 27:t.input.value="",w(t)}}(t,e)},blur:function blur(){w(e)}},list:{mousedown:function mousedown(e){e.preventDefault()},click:function click(t){!function(e,t){var n=t.resultItem.tag.toUpperCase(),r=Array.from(t.list.querySelectorAll(n)),i=e.target.closest(n);i&&i.nodeName===n&&L(t,e,r.indexOf(i))}(t,e)}}};S(a,(function(t,n){(e.resultsList||"input"===n)&&(u[t][n]||(u[t][n]=a[t][n]))})),S(u,(function(t,n){e[t].addEventListener(n,u[t][n])}))}(e),e.data.cache)return d(e).then((function(e){try{return c.call(n)}catch(e){return i(e)}}),i);function c(){return f("init",e),r()}return c.call(n)}))}function x(e){var t=e.prototype;t.init=function(){E(this)},t.start=function(e){j(this,e)},t.unInit=function(){if(this.wrapper){var e=this.wrapper.parentNode;e.insertBefore(this.input,this.wrapper),e.removeChild(this.wrapper)}var t;S((t=this).events,(function(e,n){t[e].removeEventListener(n,t.events[e][n])}))},t.open=function(){g(this)},t.close=function(){w(this)},t.goTo=function(e){O(e,this)},t.next=function(){A(this)},t.previous=function(){k(this)},t.select=function(e){L(this,null,e)},t.search=function(e,t,n){return p(e,t,n)}}return function e(t){this.options=t,this.id=e.instances=(e.instances||0)+1,this.name="autoComplete",this.wrapper=1,this.threshold=1,this.debounce=0,this.resultsList={position:"afterend",tag:"ul",maxResults:5},this.resultItem={tag:"li"},function(e){var t=e.name,r=e.options,i=e.resultsList,o=e.resultItem;for(var s in r)if("object"===n(r[s]))for(var a in e[s]||(e[s]={}),r[s])e[s][a]=r[s][a];else e[s]=r[s];e.selector=e.selector||"#"+t,i.destination=i.destination||e.selector,i.id=i.id||t+"_list_"+e.id,o.id=o.id||t+"_result",e.input=u(e.selector)}(this),x.call(this,e),E(this)}},module.exports=t()})),DotAutocompleteComponent=function(){function DotAutocompleteComponent(hostRef){_classCallCheck(this,DotAutocompleteComponent),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.r)(this,hostRef),this.selection=(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.c)(this,"selection",7),this.enter=(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.c)(this,"enter",7),this.lostFocus=(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.c)(this,"lostFocus",7),this.disabled=!1,this.placeholder="",this.threshold=0,this.maxResults=0,this.debounce=300,this.data=null,this.id="autoComplete"+(new Date).getTime(),this.enteredSuggestionList=!1,this.keyEvent={ArrowDown:this.enteredList.bind(this),ArrowUp:this.enteredList.bind(this),Enter:this.emitEnter.bind(this),Escape:this.clean.bind(this)}}var _getData;return _createClass(DotAutocompleteComponent,[{key:"componentDidLoad",value:function componentDidLoad(){this.data&&this.initAutocomplete()}},{key:"render",value:function render(){var _this=this;return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.h)("input",{autoComplete:"off",disabled:this.disabled||null,id:this.id,onBlur:function onBlur(event){return _this.handleBlur(event)},onKeyDown:function onKeyDown(event){return _this.handleKeyDown(event)},placeholder:this.placeholder||null})}},{key:"watchThreshold",value:function watchThreshold(){this.initAutocomplete()}},{key:"watchData",value:function watchData(){this.initAutocomplete()}},{key:"watchMaxResults",value:function watchMaxResults(){this.initAutocomplete()}},{key:"handleKeyDown",value:function handleKeyDown(event){var value=this.getInputElement().value;value&&this.keyEvent[event.key]&&(event.preventDefault(),this.keyEvent[event.key](value))}},{key:"handleBlur",value:function handleBlur(event){var _this2=this;event.preventDefault(),setTimeout((function(){document.activeElement.parentElement!==_this2.getResultList()&&(_this2.clean(),_this2.lostFocus.emit(event))}),0)}},{key:"clean",value:function clean(){this.getInputElement().value="",this.cleanOptions(),this.enteredSuggestionList=!1}},{key:"cleanOptions",value:function cleanOptions(){this.getResultList().innerHTML=""}},{key:"enteredList",value:function enteredList(){this.enteredSuggestionList=!this.getResultList().attributes.hidden}},{key:"emitEnter",value:function emitEnter(select){select&&!this.enteredSuggestionList&&this.enter.emit(select),this.clean()}},{key:"getInputElement",value:function getInputElement(){return this.el.querySelector("#"+this.id)}},{key:"initAutocomplete",value:function initAutocomplete(){var _src,_this3=this;this.clearList(),new autoComplete_min({data:{src:(_src=_asyncToGenerator(_regeneratorRuntime().mark((function _callee(){return _regeneratorRuntime().wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:return _context.abrupt("return",_this3.getData());case 1:case"end":return _context.stop()}}),_callee)}))),function src(){return _src.apply(this,arguments)})},selector:"#"+this.id,threshold:this.threshold,searchEngine:"strict",debounce:this.debounce,resultsList:{destination:this.getInputElement.bind(this),id:"list_"+this.id,position:"afterend",noResults:!1},resultItem:{highlight:!0,selected:"autoComplete_highlighted"},events:{input:{selection:function selection(event){event.preventDefault(),_this3.focusOnInput(),_this3.clean()}}}})}},{key:"clearList",value:function clearList(){var list=this.getResultList();list&&list.remove()}},{key:"focusOnInput",value:function focusOnInput(){this.getInputElement().focus()}},{key:"getResultList",value:function getResultList(){return this.el.querySelector("#"+this.getResultListId())}},{key:"getResultListId",value:function getResultListId(){return"list_"+this.id}},{key:"getData",value:(_getData=_asyncToGenerator(_regeneratorRuntime().mark((function _callee2(){var autocomplete,data;return _regeneratorRuntime().wrap((function _callee2$(_context2){for(;;)switch(_context2.prev=_context2.next){case 0:if((autocomplete=this.getInputElement()).setAttribute("placeholder","Loading..."),"function"!=typeof this.data){_context2.next=8;break}return _context2.next=5,this.data();case 5:_context2.t0=_context2.sent,_context2.next=9;break;case 8:_context2.t0=[];case 9:return data=_context2.t0,autocomplete.setAttribute("placeholder",this.placeholder||""),_context2.abrupt("return",data);case 12:case"end":return _context2.stop()}}),_callee2,this)}))),function getData(){return _getData.apply(this,arguments)})},{key:"el",get:function get(){return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.g)(this)}}],[{key:"watchers",get:function get(){return{threshold:["watchThreshold"],data:["watchData"],maxResults:["watchMaxResults"]}}}]),DotAutocompleteComponent}();DotAutocompleteComponent.style="dot-autocomplete input{box-sizing:border-box;width:200px}dot-autocomplete ul{background-color:#fff;list-style:none;margin:0;max-height:300px;overflow:auto;padding:0;position:absolute;width:200px}dot-autocomplete ul li{background-color:#fff;border-top:0;border:solid 1px #ccc;box-sizing:border-box;cursor:pointer;padding:0.25rem}dot-autocomplete ul li:first-child{border-top:solid 1px #ccc}dot-autocomplete ul li:focus{background-color:lightyellow;outline:0}dot-autocomplete ul li.autoComplete_highlighted{font-weight:bold}";var DotChipComponent=function(){function DotChipComponent(hostRef){_classCallCheck(this,DotChipComponent),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.r)(this,hostRef),this.remove=(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.c)(this,"remove",7),this.label="",this.deleteLabel="Delete",this.disabled=!1}return _createClass(DotChipComponent,[{key:"render",value:function render(){var _this4=this,label=this.label?this.deleteLabel+" "+this.label:null;return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.h)(_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.H,null,(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.h)("span",null,this.label),(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.h)("button",{type:"button","aria-label":label,disabled:this.disabled,onClick:function onClick(){return _this4.remove.emit(_this4.label)}},this.deleteLabel))}},{key:"el",get:function get(){return(0,_index_27076004_js__WEBPACK_IMPORTED_MODULE_40__.g)(this)}}]),DotChipComponent}();DotChipComponent.style="dot-chip span{margin-right:0.25rem}dot-chip button{cursor:pointer}"}}]);
//# sourceMappingURL=34.640f7445.iframe.bundle.js.map