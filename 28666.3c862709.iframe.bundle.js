"use strict";(self.webpackChunkdotcms_ui=self.webpackChunkdotcms_ui||[]).push([[28666,97322,44590],{"./node_modules/date-fns/locale/en-CA/_lib/formatDistance/index.js":(module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var formatDistanceLocale={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"a second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"a minute",other:"{{count}} minutes"},aboutXHours:{one:"about an hour",other:"about {{count}} hours"},xHours:{one:"an hour",other:"{{count}} hours"},xDays:{one:"a day",other:"{{count}} days"},aboutXWeeks:{one:"about a week",other:"about {{count}} weeks"},xWeeks:{one:"a week",other:"{{count}} weeks"},aboutXMonths:{one:"about a month",other:"about {{count}} months"},xMonths:{one:"a month",other:"{{count}} months"},aboutXYears:{one:"about a year",other:"about {{count}} years"},xYears:{one:"a year",other:"{{count}} years"},overXYears:{one:"over a year",other:"over {{count}} years"},almostXYears:{one:"almost a year",other:"almost {{count}} years"}},_default=function(token,count,options){var result,tokenValue=formatDistanceLocale[token];return result="string"==typeof tokenValue?tokenValue:1===count?tokenValue.one:tokenValue.other.replace("{{count}}",count.toString()),null!=options&&options.addSuffix?options.comparison&&options.comparison>0?"in "+result:result+" ago":result};exports.default=_default,module.exports=exports.default},"./node_modules/date-fns/locale/en-CA/_lib/formatLong/index.js":(module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__("./node_modules/date-fns/locale/_lib/buildFormatLongFn/index.js"));var _default={date:(0,_index.default)({formats:{full:"EEEE, MMMM do, yyyy",long:"MMMM do, yyyy",medium:"MMM d, yyyy",short:"yyyy-MM-dd"},defaultWidth:"full"}),time:(0,_index.default)({formats:{full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},defaultWidth:"full"}),dateTime:(0,_index.default)({formats:{full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},defaultWidth:"full"})};exports.default=_default,module.exports=exports.default},"./node_modules/date-fns/locale/en-CA/index.js":(module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/en-US/_lib/formatRelative/index.js")),_index2=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/en-US/_lib/localize/index.js")),_index3=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/en-US/_lib/match/index.js")),_index4=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/en-CA/_lib/formatDistance/index.js")),_index5=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/en-CA/_lib/formatLong/index.js"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var _default={code:"en-CA",formatDistance:_index4.default,formatLong:_index5.default,formatRelative:_index.default,localize:_index2.default,match:_index3.default,options:{weekStartsOn:0,firstWeekContainsDate:1}};exports.default=_default,module.exports=exports.default}}]);
//# sourceMappingURL=28666.3c862709.iframe.bundle.js.map