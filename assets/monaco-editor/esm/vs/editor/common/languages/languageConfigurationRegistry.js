var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{Emitter}from"../../../base/common/event.js";import{Disposable,toDisposable}from"../../../base/common/lifecycle.js";import*as strings from"../../../base/common/strings.js";import{DEFAULT_WORD_REGEXP,ensureValidWordDefinition}from"../core/wordHelper.js";import{IndentAction,AutoClosingPairs}from"./languageConfiguration.js";import{createScopedLineTokens}from"./supports.js";import{CharacterPairSupport}from"./supports/characterPair.js";import{BracketElectricCharacterSupport}from"./supports/electricCharacter.js";import{IndentRulesSupport}from"./supports/indentRules.js";import{OnEnterSupport}from"./supports/onEnter.js";import{RichEditBrackets}from"./supports/richEditBrackets.js";import{createDecorator}from"../../../platform/instantiation/common/instantiation.js";import{IConfigurationService}from"../../../platform/configuration/common/configuration.js";import{ILanguageService}from"./language.js";import{registerSingleton}from"../../../platform/instantiation/common/extensions.js";export class LanguageConfigurationServiceChangeEvent{constructor(languageId){this.languageId=languageId}affects(languageId){return!this.languageId||this.languageId===languageId}}export const ILanguageConfigurationService=createDecorator("languageConfigurationService");let LanguageConfigurationService=class LanguageConfigurationService extends Disposable{constructor(configurationService,languageService){super(),this.configurationService=configurationService,this.languageService=languageService,this.onDidChangeEmitter=this._register(new Emitter),this.onDidChange=this.onDidChangeEmitter.event,this.configurations=new Map;const languageConfigKeys=new Set(Object.values(customizedLanguageConfigKeys));this._register(this.configurationService.onDidChangeConfiguration((e=>{const globalConfigChanged=e.change.keys.some((k=>languageConfigKeys.has(k))),localConfigChanged=e.change.overrides.filter((([overrideLangName,keys])=>keys.some((k=>languageConfigKeys.has(k))))).map((([overrideLangName])=>overrideLangName));if(globalConfigChanged)this.configurations.clear(),this.onDidChangeEmitter.fire(new LanguageConfigurationServiceChangeEvent(void 0));else for(const languageId of localConfigChanged)this.languageService.isRegisteredLanguageId(languageId)&&(this.configurations.delete(languageId),this.onDidChangeEmitter.fire(new LanguageConfigurationServiceChangeEvent(languageId)))}))),this._register(LanguageConfigurationRegistry.onDidChange((e=>{this.configurations.delete(e.languageId),this.onDidChangeEmitter.fire(new LanguageConfigurationServiceChangeEvent(e.languageId))})))}getLanguageConfiguration(languageId){let result=this.configurations.get(languageId);return result||(result=computeConfig(languageId,this.configurationService,this.languageService),this.configurations.set(languageId,result)),result}};LanguageConfigurationService=__decorate([__param(0,IConfigurationService),__param(1,ILanguageService)],LanguageConfigurationService);export{LanguageConfigurationService};function computeConfig(languageId,configurationService,languageService){let languageConfig=LanguageConfigurationRegistry.getLanguageConfiguration(languageId);if(!languageConfig){if(!languageService.isRegisteredLanguageId(languageId))throw new Error(`Language id "${languageId}" is not configured nor known`);languageConfig=new ResolvedLanguageConfiguration(languageId,{})}const customizedConfig=getCustomizedLanguageConfig(languageConfig.languageId,configurationService),data=combineLanguageConfigurations([languageConfig.underlyingConfig,customizedConfig]);return new ResolvedLanguageConfiguration(languageConfig.languageId,data)}const customizedLanguageConfigKeys={brackets:"editor.language.brackets",colorizedBracketPairs:"editor.language.colorizedBracketPairs"};function getCustomizedLanguageConfig(languageId,configurationService){const brackets=configurationService.getValue(customizedLanguageConfigKeys.brackets,{overrideIdentifier:languageId}),colorizedBracketPairs=configurationService.getValue(customizedLanguageConfigKeys.colorizedBracketPairs,{overrideIdentifier:languageId});return{brackets:validateBracketPairs(brackets),colorizedBracketPairs:validateBracketPairs(colorizedBracketPairs)}}function validateBracketPairs(data){if(Array.isArray(data))return data.map((pair=>{if(Array.isArray(pair)&&2===pair.length)return[pair[0],pair[1]]})).filter((p=>!!p))}export class LanguageConfigurationChangeEvent{constructor(languageId){this.languageId=languageId}}export class LanguageConfigurationRegistryImpl{constructor(){this._entries=new Map,this._onDidChange=new Emitter,this.onDidChange=this._onDidChange.event}register(languageId,configuration,priority=0){let entries=this._entries.get(languageId);entries||(entries=new ComposedLanguageConfiguration(languageId),this._entries.set(languageId,entries));const disposable=entries.register(configuration,priority);return this._onDidChange.fire(new LanguageConfigurationChangeEvent(languageId)),toDisposable((()=>{disposable.dispose(),this._onDidChange.fire(new LanguageConfigurationChangeEvent(languageId))}))}getLanguageConfiguration(languageId){const entries=this._entries.get(languageId);return(null==entries?void 0:entries.getResolvedConfiguration())||null}getComments(languageId){const value=this.getLanguageConfiguration(languageId);return value&&value.comments||null}getIndentRulesSupport(languageId){const value=this.getLanguageConfiguration(languageId);return value&&value.indentRulesSupport||null}getPrecedingValidLine(model,lineNumber,indentRulesSupport){const languageId=model.getLanguageIdAtPosition(lineNumber,0);if(lineNumber>1){let lastLineNumber,resultLineNumber=-1;for(lastLineNumber=lineNumber-1;lastLineNumber>=1;lastLineNumber--){if(model.getLanguageIdAtPosition(lastLineNumber,0)!==languageId)return resultLineNumber;const text=model.getLineContent(lastLineNumber);if(!indentRulesSupport.shouldIgnore(text)&&!/^\s+$/.test(text)&&""!==text)return lastLineNumber;resultLineNumber=lastLineNumber}}return-1}getInheritIndentForLine(autoIndent,model,lineNumber,honorIntentialIndent=!0){if(autoIndent<4)return null;const indentRulesSupport=this.getIndentRulesSupport(model.getLanguageId());if(!indentRulesSupport)return null;if(lineNumber<=1)return{indentation:"",action:null};const precedingUnIgnoredLine=this.getPrecedingValidLine(model,lineNumber,indentRulesSupport);if(precedingUnIgnoredLine<0)return null;if(precedingUnIgnoredLine<1)return{indentation:"",action:null};const precedingUnIgnoredLineContent=model.getLineContent(precedingUnIgnoredLine);if(indentRulesSupport.shouldIncrease(precedingUnIgnoredLineContent)||indentRulesSupport.shouldIndentNextLine(precedingUnIgnoredLineContent))return{indentation:strings.getLeadingWhitespace(precedingUnIgnoredLineContent),action:IndentAction.Indent,line:precedingUnIgnoredLine};if(indentRulesSupport.shouldDecrease(precedingUnIgnoredLineContent))return{indentation:strings.getLeadingWhitespace(precedingUnIgnoredLineContent),action:null,line:precedingUnIgnoredLine};{if(1===precedingUnIgnoredLine)return{indentation:strings.getLeadingWhitespace(model.getLineContent(precedingUnIgnoredLine)),action:null,line:precedingUnIgnoredLine};const previousLine=precedingUnIgnoredLine-1,previousLineIndentMetadata=indentRulesSupport.getIndentMetadata(model.getLineContent(previousLine));if(!(3&previousLineIndentMetadata)&&4&previousLineIndentMetadata){let stopLine=0;for(let i=previousLine-1;i>0;i--)if(!indentRulesSupport.shouldIndentNextLine(model.getLineContent(i))){stopLine=i;break}return{indentation:strings.getLeadingWhitespace(model.getLineContent(stopLine+1)),action:null,line:stopLine+1}}if(honorIntentialIndent)return{indentation:strings.getLeadingWhitespace(model.getLineContent(precedingUnIgnoredLine)),action:null,line:precedingUnIgnoredLine};for(let i=precedingUnIgnoredLine;i>0;i--){const lineContent=model.getLineContent(i);if(indentRulesSupport.shouldIncrease(lineContent))return{indentation:strings.getLeadingWhitespace(lineContent),action:IndentAction.Indent,line:i};if(indentRulesSupport.shouldIndentNextLine(lineContent)){let stopLine=0;for(let j=i-1;j>0;j--)if(!indentRulesSupport.shouldIndentNextLine(model.getLineContent(i))){stopLine=j;break}return{indentation:strings.getLeadingWhitespace(model.getLineContent(stopLine+1)),action:null,line:stopLine+1}}if(indentRulesSupport.shouldDecrease(lineContent))return{indentation:strings.getLeadingWhitespace(lineContent),action:null,line:i}}return{indentation:strings.getLeadingWhitespace(model.getLineContent(1)),action:null,line:1}}}getGoodIndentForLine(autoIndent,virtualModel,languageId,lineNumber,indentConverter){if(autoIndent<4)return null;const richEditSupport=this.getLanguageConfiguration(languageId);if(!richEditSupport)return null;const indentRulesSupport=this.getIndentRulesSupport(languageId);if(!indentRulesSupport)return null;const indent=this.getInheritIndentForLine(autoIndent,virtualModel,lineNumber),lineContent=virtualModel.getLineContent(lineNumber);if(indent){const inheritLine=indent.line;if(void 0!==inheritLine){const enterResult=richEditSupport.onEnter(autoIndent,"",virtualModel.getLineContent(inheritLine),"");if(enterResult){let indentation=strings.getLeadingWhitespace(virtualModel.getLineContent(inheritLine));return enterResult.removeText&&(indentation=indentation.substring(0,indentation.length-enterResult.removeText)),enterResult.indentAction===IndentAction.Indent||enterResult.indentAction===IndentAction.IndentOutdent?indentation=indentConverter.shiftIndent(indentation):enterResult.indentAction===IndentAction.Outdent&&(indentation=indentConverter.unshiftIndent(indentation)),indentRulesSupport.shouldDecrease(lineContent)&&(indentation=indentConverter.unshiftIndent(indentation)),enterResult.appendText&&(indentation+=enterResult.appendText),strings.getLeadingWhitespace(indentation)}}return indentRulesSupport.shouldDecrease(lineContent)?indent.action===IndentAction.Indent?indent.indentation:indentConverter.unshiftIndent(indent.indentation):indent.action===IndentAction.Indent?indentConverter.shiftIndent(indent.indentation):indent.indentation}return null}getIndentForEnter(autoIndent,model,range,indentConverter){if(autoIndent<4)return null;model.forceTokenization(range.startLineNumber);const lineTokens=model.getLineTokens(range.startLineNumber),scopedLineTokens=createScopedLineTokens(lineTokens,range.startColumn-1),scopedLineText=scopedLineTokens.getLineContent();let beforeEnterText,afterEnterText,embeddedLanguage=!1;if(scopedLineTokens.firstCharOffset>0&&lineTokens.getLanguageId(0)!==scopedLineTokens.languageId?(embeddedLanguage=!0,beforeEnterText=scopedLineText.substr(0,range.startColumn-1-scopedLineTokens.firstCharOffset)):beforeEnterText=lineTokens.getLineContent().substring(0,range.startColumn-1),range.isEmpty())afterEnterText=scopedLineText.substr(range.startColumn-1-scopedLineTokens.firstCharOffset);else{afterEnterText=this.getScopedLineTokens(model,range.endLineNumber,range.endColumn).getLineContent().substr(range.endColumn-1-scopedLineTokens.firstCharOffset)}const indentRulesSupport=this.getIndentRulesSupport(scopedLineTokens.languageId);if(!indentRulesSupport)return null;const beforeEnterResult=beforeEnterText,beforeEnterIndent=strings.getLeadingWhitespace(beforeEnterText),virtualModel={getLineTokens:lineNumber=>model.getLineTokens(lineNumber),getLanguageId:()=>model.getLanguageId(),getLanguageIdAtPosition:(lineNumber,column)=>model.getLanguageIdAtPosition(lineNumber,column),getLineContent:lineNumber=>lineNumber===range.startLineNumber?beforeEnterResult:model.getLineContent(lineNumber)},currentLineIndent=strings.getLeadingWhitespace(lineTokens.getLineContent()),afterEnterAction=this.getInheritIndentForLine(autoIndent,virtualModel,range.startLineNumber+1);if(!afterEnterAction){const beforeEnter=embeddedLanguage?currentLineIndent:beforeEnterIndent;return{beforeEnter,afterEnter:beforeEnter}}let afterEnterIndent=embeddedLanguage?currentLineIndent:afterEnterAction.indentation;return afterEnterAction.action===IndentAction.Indent&&(afterEnterIndent=indentConverter.shiftIndent(afterEnterIndent)),indentRulesSupport.shouldDecrease(afterEnterText)&&(afterEnterIndent=indentConverter.unshiftIndent(afterEnterIndent)),{beforeEnter:embeddedLanguage?currentLineIndent:beforeEnterIndent,afterEnter:afterEnterIndent}}getIndentActionForType(autoIndent,model,range,ch,indentConverter){if(autoIndent<4)return null;const scopedLineTokens=this.getScopedLineTokens(model,range.startLineNumber,range.startColumn);if(scopedLineTokens.firstCharOffset)return null;const indentRulesSupport=this.getIndentRulesSupport(scopedLineTokens.languageId);if(!indentRulesSupport)return null;const scopedLineText=scopedLineTokens.getLineContent(),beforeTypeText=scopedLineText.substr(0,range.startColumn-1-scopedLineTokens.firstCharOffset);let afterTypeText;if(range.isEmpty())afterTypeText=scopedLineText.substr(range.startColumn-1-scopedLineTokens.firstCharOffset);else{afterTypeText=this.getScopedLineTokens(model,range.endLineNumber,range.endColumn).getLineContent().substr(range.endColumn-1-scopedLineTokens.firstCharOffset)}if(!indentRulesSupport.shouldDecrease(beforeTypeText+afterTypeText)&&indentRulesSupport.shouldDecrease(beforeTypeText+ch+afterTypeText)){const r=this.getInheritIndentForLine(autoIndent,model,range.startLineNumber,!1);if(!r)return null;let indentation=r.indentation;return r.action!==IndentAction.Indent&&(indentation=indentConverter.unshiftIndent(indentation)),indentation}return null}getIndentMetadata(model,lineNumber){const indentRulesSupport=this.getIndentRulesSupport(model.getLanguageId());return indentRulesSupport?lineNumber<1||lineNumber>model.getLineCount()?null:indentRulesSupport.getIndentMetadata(model.getLineContent(lineNumber)):null}getEnterAction(autoIndent,model,range){const scopedLineTokens=this.getScopedLineTokens(model,range.startLineNumber,range.startColumn),richEditSupport=this.getLanguageConfiguration(scopedLineTokens.languageId);if(!richEditSupport)return null;const scopedLineText=scopedLineTokens.getLineContent(),beforeEnterText=scopedLineText.substr(0,range.startColumn-1-scopedLineTokens.firstCharOffset);let afterEnterText;if(range.isEmpty())afterEnterText=scopedLineText.substr(range.startColumn-1-scopedLineTokens.firstCharOffset);else{afterEnterText=this.getScopedLineTokens(model,range.endLineNumber,range.endColumn).getLineContent().substr(range.endColumn-1-scopedLineTokens.firstCharOffset)}let previousLineText="";if(range.startLineNumber>1&&0===scopedLineTokens.firstCharOffset){const oneLineAboveScopedLineTokens=this.getScopedLineTokens(model,range.startLineNumber-1);oneLineAboveScopedLineTokens.languageId===scopedLineTokens.languageId&&(previousLineText=oneLineAboveScopedLineTokens.getLineContent())}const enterResult=richEditSupport.onEnter(autoIndent,previousLineText,beforeEnterText,afterEnterText);if(!enterResult)return null;const indentAction=enterResult.indentAction;let appendText=enterResult.appendText;const removeText=enterResult.removeText||0;appendText?indentAction===IndentAction.Indent&&(appendText="\t"+appendText):appendText=indentAction===IndentAction.Indent||indentAction===IndentAction.IndentOutdent?"\t":"";let indentation=this.getIndentationAtPosition(model,range.startLineNumber,range.startColumn);return removeText&&(indentation=indentation.substring(0,indentation.length-removeText)),{indentAction,appendText,removeText,indentation}}getIndentationAtPosition(model,lineNumber,column){const lineText=model.getLineContent(lineNumber);let indentation=strings.getLeadingWhitespace(lineText);return indentation.length>column-1&&(indentation=indentation.substring(0,column-1)),indentation}getScopedLineTokens(model,lineNumber,columnNumber){model.forceTokenization(lineNumber);const lineTokens=model.getLineTokens(lineNumber),column=void 0===columnNumber?model.getLineMaxColumn(lineNumber)-1:columnNumber-1;return createScopedLineTokens(lineTokens,column)}}export const LanguageConfigurationRegistry=new LanguageConfigurationRegistryImpl;class ComposedLanguageConfiguration{constructor(languageId){this.languageId=languageId,this._resolved=null,this._entries=[],this._order=0,this._resolved=null}register(configuration,priority){const entry=new LanguageConfigurationContribution(configuration,priority,++this._order);return this._entries.push(entry),this._resolved=null,toDisposable((()=>{for(let i=0;i<this._entries.length;i++)if(this._entries[i]===entry){this._entries.splice(i,1),this._resolved=null;break}}))}getResolvedConfiguration(){if(!this._resolved){const config=this._resolve();config&&(this._resolved=new ResolvedLanguageConfiguration(this.languageId,config))}return this._resolved}_resolve(){return 0===this._entries.length?null:(this._entries.sort(LanguageConfigurationContribution.cmp),combineLanguageConfigurations(this._entries.map((e=>e.configuration))))}}function combineLanguageConfigurations(configs){let result={comments:void 0,brackets:void 0,wordPattern:void 0,indentationRules:void 0,onEnterRules:void 0,autoClosingPairs:void 0,surroundingPairs:void 0,autoCloseBefore:void 0,folding:void 0,colorizedBracketPairs:void 0,__electricCharacterSupport:void 0};for(const entry of configs)result={comments:entry.comments||result.comments,brackets:entry.brackets||result.brackets,wordPattern:entry.wordPattern||result.wordPattern,indentationRules:entry.indentationRules||result.indentationRules,onEnterRules:entry.onEnterRules||result.onEnterRules,autoClosingPairs:entry.autoClosingPairs||result.autoClosingPairs,surroundingPairs:entry.surroundingPairs||result.surroundingPairs,autoCloseBefore:entry.autoCloseBefore||result.autoCloseBefore,folding:entry.folding||result.folding,colorizedBracketPairs:entry.colorizedBracketPairs||result.colorizedBracketPairs,__electricCharacterSupport:entry.__electricCharacterSupport||result.__electricCharacterSupport};return result}class LanguageConfigurationContribution{constructor(configuration,priority,order){this.configuration=configuration,this.priority=priority,this.order=order}static cmp(a,b){return a.priority===b.priority?a.order-b.order:a.priority-b.priority}}export class ResolvedLanguageConfiguration{constructor(languageId,underlyingConfig){this.languageId=languageId,this.underlyingConfig=underlyingConfig,this._brackets=null,this._electricCharacter=null,this._onEnterSupport=this.underlyingConfig.brackets||this.underlyingConfig.indentationRules||this.underlyingConfig.onEnterRules?new OnEnterSupport(this.underlyingConfig):null,this.comments=ResolvedLanguageConfiguration._handleComments(this.underlyingConfig),this.characterPair=new CharacterPairSupport(this.underlyingConfig),this.wordDefinition=this.underlyingConfig.wordPattern||DEFAULT_WORD_REGEXP,this.indentationRules=this.underlyingConfig.indentationRules,this.underlyingConfig.indentationRules?this.indentRulesSupport=new IndentRulesSupport(this.underlyingConfig.indentationRules):this.indentRulesSupport=null,this.foldingRules=this.underlyingConfig.folding||{}}getWordDefinition(){return ensureValidWordDefinition(this.wordDefinition)}get brackets(){return!this._brackets&&this.underlyingConfig.brackets&&(this._brackets=new RichEditBrackets(this.languageId,this.underlyingConfig.brackets)),this._brackets}get electricCharacter(){return this._electricCharacter||(this._electricCharacter=new BracketElectricCharacterSupport(this.brackets)),this._electricCharacter}onEnter(autoIndent,previousLineText,beforeEnterText,afterEnterText){return this._onEnterSupport?this._onEnterSupport.onEnter(autoIndent,previousLineText,beforeEnterText,afterEnterText):null}getAutoClosingPairs(){return new AutoClosingPairs(this.characterPair.getAutoClosingPairs())}getAutoCloseBeforeSet(){return this.characterPair.getAutoCloseBeforeSet()}getSurroundingPairs(){return this.characterPair.getSurroundingPairs()}static _handleComments(conf){const commentRule=conf.comments;if(!commentRule)return null;const comments={};if(commentRule.lineComment&&(comments.lineCommentToken=commentRule.lineComment),commentRule.blockComment){const[blockStart,blockEnd]=commentRule.blockComment;comments.blockCommentStartToken=blockStart,comments.blockCommentEndToken=blockEnd}return comments}}registerSingleton(ILanguageConfigurationService,LanguageConfigurationService);