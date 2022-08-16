/*! For license information please see r.js.LICENSE.txt */
define("vs/basic-languages/r/r",["require"],(require=>(()=>{var __defProp=Object.defineProperty,__getOwnPropDesc=Object.getOwnPropertyDescriptor,__getOwnPropNames=Object.getOwnPropertyNames,__hasOwnProp=Object.prototype.hasOwnProperty,__toCommonJS=(cache=>(module,temp)=>cache&&cache.get(module)||(temp=((target,module,copyDefault,desc)=>{if(module&&"object"==typeof module||"function"==typeof module)for(let key of __getOwnPropNames(module))__hasOwnProp.call(target,key)||!copyDefault&&"default"===key||__defProp(target,key,{get:()=>module[key],enumerable:!(desc=__getOwnPropDesc(module,key))||desc.enumerable});return target})(__defProp({},"__esModule",{value:!0}),module,1),cache&&cache.set(module,temp),temp))("undefined"!=typeof WeakMap?new WeakMap:0),r_exports={};((target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0})})(r_exports,{conf:()=>conf,language:()=>language});var conf={comments:{lineComment:"#"},brackets:[["{","}"],["[","]"],["(",")"]],autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'}],surroundingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'}]},language={defaultToken:"",tokenPostfix:".r",roxygen:["@alias","@aliases","@assignee","@author","@backref","@callGraph","@callGraphDepth","@callGraphPrimitives","@concept","@describeIn","@description","@details","@docType","@encoding","@evalNamespace","@evalRd","@example","@examples","@export","@exportClass","@exportMethod","@exportPattern","@family","@field","@formals","@format","@import","@importClassesFrom","@importFrom","@importMethodsFrom","@include","@inherit","@inheritDotParams","@inheritParams","@inheritSection","@keywords","@md","@method","@name","@noMd","@noRd","@note","@param","@rawNamespace","@rawRd","@rdname","@references","@return","@S3method","@section","@seealso","@setClass","@slot","@source","@template","@templateVar","@title","@TODO","@usage","@useDynLib"],constants:["NULL","FALSE","TRUE","NA","Inf","NaN","NA_integer_","NA_real_","NA_complex_","NA_character_","T","F","LETTERS","letters","month.abb","month.name","pi","R.version.string"],keywords:["break","next","return","if","else","for","in","repeat","while","array","category","character","complex","double","function","integer","list","logical","matrix","numeric","vector","data.frame","factor","library","require","attach","detach","source"],special:["\\n","\\r","\\t","\\b","\\a","\\f","\\v","\\'",'\\"',"\\\\"],brackets:[{open:"{",close:"}",token:"delimiter.curly"},{open:"[",close:"]",token:"delimiter.bracket"},{open:"(",close:")",token:"delimiter.parenthesis"}],tokenizer:{root:[{include:"@numbers"},{include:"@strings"},[/[{}\[\]()]/,"@brackets"],{include:"@operators"},[/#'$/,"comment.doc"],[/#'/,"comment.doc","@roxygen"],[/(^#.*$)/,"comment"],[/\s+/,"white"],[/[,:;]/,"delimiter"],[/@[a-zA-Z]\w*/,"tag"],[/[a-zA-Z]\w*/,{cases:{"@keywords":"keyword","@constants":"constant","@default":"identifier"}}]],roxygen:[[/@\w+/,{cases:{"@roxygen":"tag","@eos":{token:"comment.doc",next:"@pop"},"@default":"comment.doc"}}],[/\s+/,{cases:{"@eos":{token:"comment.doc",next:"@pop"},"@default":"comment.doc"}}],[/.*/,{token:"comment.doc",next:"@pop"}]],numbers:[[/0[xX][0-9a-fA-F]+/,"number.hex"],[/-?(\d*\.)?\d+([eE][+\-]?\d+)?/,"number"]],operators:[[/<{1,2}-/,"operator"],[/->{1,2}/,"operator"],[/%[^%\s]+%/,"operator"],[/\*\*/,"operator"],[/%%/,"operator"],[/&&/,"operator"],[/\|\|/,"operator"],[/<</,"operator"],[/>>/,"operator"],[/[-+=&|!<>^~*/:$]/,"operator"]],strings:[[/'/,"string.escape","@stringBody"],[/"/,"string.escape","@dblStringBody"]],stringBody:[[/\\./,{cases:{"@special":"string","@default":"error-token"}}],[/'/,"string.escape","@popall"],[/./,"string"]],dblStringBody:[[/\\./,{cases:{"@special":"string","@default":"error-token"}}],[/"/,"string.escape","@popall"],[/./,"string"]]}};return __toCommonJS(r_exports)})()));