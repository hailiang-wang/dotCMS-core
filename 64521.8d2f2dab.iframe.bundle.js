"use strict";(self.webpackChunkdotcms_ui=self.webpackChunkdotcms_ui||[]).push([[64521,43125,71045,84633,28413,31353],{"./node_modules/date-fns/locale/el/_lib/formatDistance/index.js":(module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var formatDistanceLocale={lessThanXSeconds:{one:"λιγότερο από ένα δευτερόλεπτο",other:"λιγότερο από {{count}} δευτερόλεπτα"},xSeconds:{one:"1 δευτερόλεπτο",other:"{{count}} δευτερόλεπτα"},halfAMinute:"μισό λεπτό",lessThanXMinutes:{one:"λιγότερο από ένα λεπτό",other:"λιγότερο από {{count}} λεπτά"},xMinutes:{one:"1 λεπτό",other:"{{count}} λεπτά"},aboutXHours:{one:"περίπου 1 ώρα",other:"περίπου {{count}} ώρες"},xHours:{one:"1 ώρα",other:"{{count}} ώρες"},xDays:{one:"1 ημέρα",other:"{{count}} ημέρες"},aboutXWeeks:{one:"περίπου 1 εβδομάδα",other:"περίπου {{count}} εβδομάδες"},xWeeks:{one:"1 εβδομάδα",other:"{{count}} εβδομάδες"},aboutXMonths:{one:"περίπου 1 μήνας",other:"περίπου {{count}} μήνες"},xMonths:{one:"1 μήνας",other:"{{count}} μήνες"},aboutXYears:{one:"περίπου 1 χρόνο",other:"περίπου {{count}} χρόνια"},xYears:{one:"1 χρόνο",other:"{{count}} χρόνια"},overXYears:{one:"πάνω από 1 χρόνο",other:"πάνω από {{count}} χρόνια"},almostXYears:{one:"περίπου 1 χρόνο",other:"περίπου {{count}} χρόνια"}},_default=function(token,count,options){var result,tokenValue=formatDistanceLocale[token];return result="string"==typeof tokenValue?tokenValue:1===count?tokenValue.one:tokenValue.other.replace("{{count}}",String(count)),null!=options&&options.addSuffix?options.comparison&&options.comparison>0?"σε "+result:result+" πριν":result};exports.default=_default,module.exports=exports.default},"./node_modules/date-fns/locale/el/_lib/formatLong/index.js":(module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__("./node_modules/date-fns/locale/_lib/buildFormatLongFn/index.js"));var _default={date:(0,_index.default)({formats:{full:"EEEE, d MMMM y",long:"d MMMM y",medium:"d MMM y",short:"d/M/yy"},defaultWidth:"full"}),time:(0,_index.default)({formats:{full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},defaultWidth:"full"}),dateTime:(0,_index.default)({formats:{full:"{{date}} - {{time}}",long:"{{date}} - {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},defaultWidth:"full"})};exports.default=_default,module.exports=exports.default},"./node_modules/date-fns/locale/el/_lib/formatRelative/index.js":(module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var formatRelativeLocale={lastWeek:function(date){return 6===date.getUTCDay()?"'το προηγούμενο' eeee 'στις' p":"'την προηγούμενη' eeee 'στις' p"},yesterday:"'χθες στις' p",today:"'σήμερα στις' p",tomorrow:"'αύριο στις' p",nextWeek:"eeee 'στις' p",other:"P"},_default=function(token,date){var format=formatRelativeLocale[token];return"function"==typeof format?format(date):format};exports.default=_default,module.exports=exports.default},"./node_modules/date-fns/locale/el/_lib/localize/index.js":(module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__("./node_modules/date-fns/locale/_lib/buildLocalizeFn/index.js"));var _default={ordinalNumber:function(dirtyNumber,options){var number=Number(dirtyNumber),unit=null==options?void 0:options.unit;return number+("year"===unit||"month"===unit?"ος":"week"===unit||"dayOfYear"===unit||"day"===unit||"hour"===unit||"date"===unit?"η":"ο")},era:(0,_index.default)({values:{narrow:["πΧ","μΧ"],abbreviated:["π.Χ.","μ.Χ."],wide:["προ Χριστού","μετά Χριστόν"]},defaultWidth:"wide"}),quarter:(0,_index.default)({values:{narrow:["1","2","3","4"],abbreviated:["Τ1","Τ2","Τ3","Τ4"],wide:["1ο τρίμηνο","2ο τρίμηνο","3ο τρίμηνο","4ο τρίμηνο"]},defaultWidth:"wide",argumentCallback:function(quarter){return quarter-1}}),month:(0,_index.default)({values:{narrow:["Ι","Φ","Μ","Α","Μ","Ι","Ι","Α","Σ","Ο","Ν","Δ"],abbreviated:["Ιαν","Φεβ","Μάρ","Απρ","Μάι","Ιούν","Ιούλ","Αύγ","Σεπ","Οκτ","Νοέ","Δεκ"],wide:["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"]},defaultWidth:"wide",formattingValues:{narrow:["Ι","Φ","Μ","Α","Μ","Ι","Ι","Α","Σ","Ο","Ν","Δ"],abbreviated:["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"],wide:["Ιανουαρίου","Φεβρουαρίου","Μαρτίου","Απριλίου","Μαΐου","Ιουνίου","Ιουλίου","Αυγούστου","Σεπτεμβρίου","Οκτωβρίου","Νοεμβρίου","Δεκεμβρίου"]},defaultFormattingWidth:"wide"}),day:(0,_index.default)({values:{narrow:["Κ","Δ","T","Τ","Π","Π","Σ"],short:["Κυ","Δε","Τρ","Τε","Πέ","Πα","Σά"],abbreviated:["Κυρ","Δευ","Τρί","Τετ","Πέμ","Παρ","Σάβ"],wide:["Κυριακή","Δευτέρα","Τρίτη","Τετάρτη","Πέμπτη","Παρασκευή","Σάββατο"]},defaultWidth:"wide"}),dayPeriod:(0,_index.default)({values:{narrow:{am:"πμ",pm:"μμ",midnight:"μεσάνυχτα",noon:"μεσημέρι",morning:"πρωί",afternoon:"απόγευμα",evening:"βράδυ",night:"νύχτα"},abbreviated:{am:"π.μ.",pm:"μ.μ.",midnight:"μεσάνυχτα",noon:"μεσημέρι",morning:"πρωί",afternoon:"απόγευμα",evening:"βράδυ",night:"νύχτα"},wide:{am:"π.μ.",pm:"μ.μ.",midnight:"μεσάνυχτα",noon:"μεσημέρι",morning:"πρωί",afternoon:"απόγευμα",evening:"βράδυ",night:"νύχτα"}},defaultWidth:"wide"})};exports.default=_default,module.exports=exports.default},"./node_modules/date-fns/locale/el/_lib/match/index.js":(module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/_lib/buildMatchFn/index.js"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var _default={ordinalNumber:(0,_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/_lib/buildMatchPatternFn/index.js")).default)({matchPattern:/^(\d+)(ος|η|ο)?/i,parsePattern:/\d+/i,valueCallback:function(value){return parseInt(value,10)}}),era:(0,_index.default)({matchPatterns:{narrow:/^(πΧ|μΧ)/i,abbreviated:/^(π\.?\s?χ\.?|π\.?\s?κ\.?\s?χ\.?|μ\.?\s?χ\.?|κ\.?\s?χ\.?)/i,wide:/^(προ Χριστο(ύ|υ)|πριν απ(ό|ο) την Κοιν(ή|η) Χρονολογ(ί|ι)α|μετ(ά|α) Χριστ(ό|ο)ν|Κοιν(ή|η) Χρονολογ(ί|ι)α)/i},defaultMatchWidth:"wide",parsePatterns:{any:[/^π/i,/^(μ|κ)/i]},defaultParseWidth:"any"}),quarter:(0,_index.default)({matchPatterns:{narrow:/^[1234]/i,abbreviated:/^τ[1234]/i,wide:/^[1234]ο? τρ(ί|ι)μηνο/i},defaultMatchWidth:"wide",parsePatterns:{any:[/1/i,/2/i,/3/i,/4/i]},defaultParseWidth:"any",valueCallback:function(index){return index+1}}),month:(0,_index.default)({matchPatterns:{narrow:/^[ιφμαμιιασονδ]/i,abbreviated:/^(ιαν|φεβ|μ[άα]ρ|απρ|μ[άα][ιΐ]|ιο[ύυ]ν|ιο[ύυ]λ|α[ύυ]γ|σεπ|οκτ|νο[έε]|δεκ)/i,wide:/^(μ[άα][ιΐ]|α[ύυ]γο[υύ]στ)(ος|ου)|(ιανου[άα]ρ|φεβρου[άα]ρ|μ[άα]ρτ|απρ[ίι]λ|ιο[ύυ]ν|ιο[ύυ]λ|σεπτ[έε]μβρ|οκτ[ώω]βρ|νο[έε]μβρ|δεκ[έε]μβρ)(ιος|ίου)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^ι/i,/^φ/i,/^μ/i,/^α/i,/^μ/i,/^ι/i,/^ι/i,/^α/i,/^σ/i,/^ο/i,/^ν/i,/^δ/i],any:[/^ια/i,/^φ/i,/^μ[άα]ρ/i,/^απ/i,/^μ[άα][ιΐ]/i,/^ιο[ύυ]ν/i,/^ιο[ύυ]λ/i,/^α[ύυ]/i,/^σ/i,/^ο/i,/^ν/i,/^δ/i]},defaultParseWidth:"any"}),day:(0,_index.default)({matchPatterns:{narrow:/^[κδτπσ]/i,short:/^(κυ|δε|τρ|τε|π[εέ]|π[αά]|σ[αά])/i,abbreviated:/^(κυρ|δευ|τρι|τετ|πεμ|παρ|σαβ)/i,wide:/^(κυριακ(ή|η)|δευτ(έ|ε)ρα|τρ(ί|ι)τη|τετ(ά|α)ρτη|π(έ|ε)μπτη|παρασκευ(ή|η)|σ(ά|α)ββατο)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^κ/i,/^δ/i,/^τ/i,/^τ/i,/^π/i,/^π/i,/^σ/i],any:[/^κ/i,/^δ/i,/^τρ/i,/^τε/i,/^π[εέ]/i,/^π[αά]/i,/^σ/i]},defaultParseWidth:"any"}),dayPeriod:(0,_index.default)({matchPatterns:{narrow:/^(πμ|μμ|μεσ(ά|α)νυχτα|μεσημ(έ|ε)ρι|πρω(ί|ι)|απ(ό|ο)γευμα|βρ(ά|α)δυ|ν(ύ|υ)χτα)/i,any:/^([πμ]\.?\s?μ\.?|μεσ(ά|α)νυχτα|μεσημ(έ|ε)ρι|πρω(ί|ι)|απ(ό|ο)γευμα|βρ(ά|α)δυ|ν(ύ|υ)χτα)/i},defaultMatchWidth:"any",parsePatterns:{any:{am:/^πμ|π\.\s?μ\./i,pm:/^μμ|μ\.\s?μ\./i,midnight:/^μεσάν/i,noon:/^μεσημ(έ|ε)/i,morning:/πρω(ί|ι)/i,afternoon:/απ(ό|ο)γευμα/i,evening:/βρ(ά|α)δυ/i,night:/ν(ύ|υ)χτα/i}},defaultParseWidth:"any"})};exports.default=_default,module.exports=exports.default},"./node_modules/date-fns/locale/el/index.js":(module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/el/_lib/formatDistance/index.js")),_index2=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/el/_lib/formatLong/index.js")),_index3=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/el/_lib/formatRelative/index.js")),_index4=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/el/_lib/localize/index.js")),_index5=_interopRequireDefault(__webpack_require__("./node_modules/date-fns/locale/el/_lib/match/index.js"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var _default={code:"el",formatDistance:_index.default,formatLong:_index2.default,formatRelative:_index3.default,localize:_index4.default,match:_index5.default,options:{weekStartsOn:1,firstWeekContainsDate:4}};exports.default=_default,module.exports=exports.default}}]);
//# sourceMappingURL=64521.8d2f2dab.iframe.bundle.js.map