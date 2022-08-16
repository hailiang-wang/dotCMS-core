/*! For license information please see monaco.contribution.js.LICENSE.txt */
import"../../editor/editor.api.js";var __defProp=Object.defineProperty,__getOwnPropDesc=Object.getOwnPropertyDescriptor,__getOwnPropNames=Object.getOwnPropertyNames,__hasOwnProp=Object.prototype.hasOwnProperty,__reExport=(target,module,copyDefault,desc)=>{if(module&&"object"==typeof module||"function"==typeof module)for(let key of __getOwnPropNames(module))__hasOwnProp.call(target,key)||!copyDefault&&"default"===key||__defProp(target,key,{get:()=>module[key],enumerable:!(desc=__getOwnPropDesc(module,key))||desc.enumerable});return target},monaco_editor_core_exports={};__reExport(monaco_editor_core_exports,monaco_editor_core_star);import*as monaco_editor_core_star from"../../editor/editor.api.js";var LanguageServiceDefaultsImpl=class{_onDidChange=new monaco_editor_core_exports.Emitter;_options;_modeConfiguration;_languageId;constructor(languageId,options,modeConfiguration){this._languageId=languageId,this.setOptions(options),this.setModeConfiguration(modeConfiguration)}get onDidChange(){return this._onDidChange.event}get languageId(){return this._languageId}get modeConfiguration(){return this._modeConfiguration}get diagnosticsOptions(){return this.options}get options(){return this._options}setOptions(options){this._options=options||Object.create(null),this._onDidChange.fire(this)}setDiagnosticsOptions(options){this.setOptions(options)}setModeConfiguration(modeConfiguration){this._modeConfiguration=modeConfiguration||Object.create(null),this._onDidChange.fire(this)}},optionsDefault={validate:!0,lint:{compatibleVendorPrefixes:"ignore",vendorPrefix:"warning",duplicateProperties:"warning",emptyRules:"warning",importStatement:"ignore",boxModel:"ignore",universalSelector:"ignore",zeroUnits:"ignore",fontFaceProperties:"warning",hexColorLength:"error",argumentsInColorFunction:"error",unknownProperties:"warning",ieHack:"ignore",unknownVendorSpecificProperties:"ignore",propertyIgnoredDueToDisplay:"warning",important:"ignore",float:"ignore",idSelector:"ignore"},data:{useDefaultDataProvider:!0}},modeConfigurationDefault={completionItems:!0,hovers:!0,documentSymbols:!0,definitions:!0,references:!0,documentHighlights:!0,rename:!0,colors:!0,foldingRanges:!0,diagnostics:!0,selectionRanges:!0},cssDefaults=new LanguageServiceDefaultsImpl("css",optionsDefault,modeConfigurationDefault),scssDefaults=new LanguageServiceDefaultsImpl("scss",optionsDefault,modeConfigurationDefault),lessDefaults=new LanguageServiceDefaultsImpl("less",optionsDefault,modeConfigurationDefault);function getMode(){return import("./cssMode.js")}monaco_editor_core_exports.languages.css={cssDefaults,lessDefaults,scssDefaults},monaco_editor_core_exports.languages.onLanguage("less",(()=>{getMode().then((mode=>mode.setupMode(lessDefaults)))})),monaco_editor_core_exports.languages.onLanguage("scss",(()=>{getMode().then((mode=>mode.setupMode(scssDefaults)))})),monaco_editor_core_exports.languages.onLanguage("css",(()=>{getMode().then((mode=>mode.setupMode(cssDefaults)))}));export{cssDefaults,lessDefaults,scssDefaults};