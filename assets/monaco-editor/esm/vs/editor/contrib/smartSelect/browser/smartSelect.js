var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import*as arrays from"../../../../base/common/arrays.js";import{CancellationToken}from"../../../../base/common/cancellation.js";import{onUnexpectedExternalError}from"../../../../base/common/errors.js";import{EditorAction,registerEditorAction,registerEditorContribution}from"../../../browser/editorExtensions.js";import{Position}from"../../../common/core/position.js";import{Range}from"../../../common/core/range.js";import{Selection}from"../../../common/core/selection.js";import{EditorContextKeys}from"../../../common/editorContextKeys.js";import{BracketSelectionRangeProvider}from"./bracketSelections.js";import{WordSelectionRangeProvider}from"./wordSelections.js";import*as nls from"../../../../nls.js";import{MenuId}from"../../../../platform/actions/common/actions.js";import{CommandsRegistry}from"../../../../platform/commands/common/commands.js";import{ILanguageFeaturesService}from"../../../common/services/languageFeatures.js";import{ITextModelService}from"../../../common/services/resolverService.js";import{assertType}from"../../../../base/common/types.js";import{URI}from"../../../../base/common/uri.js";class SelectionRanges{constructor(index,ranges){this.index=index,this.ranges=ranges}mov(fwd){let index=this.index+(fwd?1:-1);if(index<0||index>=this.ranges.length)return this;const res=new SelectionRanges(index,this.ranges);return res.ranges[index].equalsRange(this.ranges[this.index])?res.mov(fwd):res}}let SmartSelectController=class SmartSelectController{constructor(_editor,_languageFeaturesService){this._editor=_editor,this._languageFeaturesService=_languageFeaturesService,this._ignoreSelection=!1}static get(editor){return editor.getContribution(SmartSelectController.ID)}dispose(){var _a;null===(_a=this._selectionListener)||void 0===_a||_a.dispose()}run(forward){return __awaiter(this,void 0,void 0,(function*(){if(!this._editor.hasModel())return;const selections=this._editor.getSelections(),model=this._editor.getModel();if(this._state||(yield provideSelectionRanges(this._languageFeaturesService.selectionRangeProvider,model,selections.map((s=>s.getPosition())),this._editor.getOption(102),CancellationToken.None).then((ranges=>{var _a;if(arrays.isNonEmptyArray(ranges)&&ranges.length===selections.length&&this._editor.hasModel()&&arrays.equals(this._editor.getSelections(),selections,((a,b)=>a.equalsSelection(b)))){for(let i=0;i<ranges.length;i++)ranges[i]=ranges[i].filter((range=>range.containsPosition(selections[i].getStartPosition())&&range.containsPosition(selections[i].getEndPosition()))),ranges[i].unshift(selections[i]);this._state=ranges.map((ranges=>new SelectionRanges(0,ranges))),null===(_a=this._selectionListener)||void 0===_a||_a.dispose(),this._selectionListener=this._editor.onDidChangeCursorPosition((()=>{var _a;this._ignoreSelection||(null===(_a=this._selectionListener)||void 0===_a||_a.dispose(),this._state=void 0)}))}}))),!this._state)return;this._state=this._state.map((state=>state.mov(forward)));const newSelections=this._state.map((state=>Selection.fromPositions(state.ranges[state.index].getStartPosition(),state.ranges[state.index].getEndPosition())));this._ignoreSelection=!0;try{this._editor.setSelections(newSelections)}finally{this._ignoreSelection=!1}}))}};SmartSelectController.ID="editor.contrib.smartSelectController",SmartSelectController=__decorate([__param(1,ILanguageFeaturesService)],SmartSelectController);class AbstractSmartSelect extends EditorAction{constructor(forward,opts){super(opts),this._forward=forward}run(_accessor,editor){return __awaiter(this,void 0,void 0,(function*(){let controller=SmartSelectController.get(editor);controller&&(yield controller.run(this._forward))}))}}class GrowSelectionAction extends AbstractSmartSelect{constructor(){super(!0,{id:"editor.action.smartSelect.expand",label:nls.localize("smartSelect.expand","Expand Selection"),alias:"Expand Selection",precondition:void 0,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:1553,mac:{primary:3345,secondary:[1297]},weight:100},menuOpts:{menuId:MenuId.MenubarSelectionMenu,group:"1_basic",title:nls.localize({key:"miSmartSelectGrow",comment:["&& denotes a mnemonic"]},"&&Expand Selection"),order:2}})}}CommandsRegistry.registerCommandAlias("editor.action.smartSelect.grow","editor.action.smartSelect.expand");class ShrinkSelectionAction extends AbstractSmartSelect{constructor(){super(!1,{id:"editor.action.smartSelect.shrink",label:nls.localize("smartSelect.shrink","Shrink Selection"),alias:"Shrink Selection",precondition:void 0,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:1551,mac:{primary:3343,secondary:[1295]},weight:100},menuOpts:{menuId:MenuId.MenubarSelectionMenu,group:"1_basic",title:nls.localize({key:"miSmartSelectShrink",comment:["&& denotes a mnemonic"]},"&&Shrink Selection"),order:3}})}}registerEditorContribution(SmartSelectController.ID,SmartSelectController),registerEditorAction(GrowSelectionAction),registerEditorAction(ShrinkSelectionAction);export function provideSelectionRanges(registry,model,positions,options,token){return __awaiter(this,void 0,void 0,(function*(){const providers=registry.all(model).concat(new WordSelectionRangeProvider);1===providers.length&&providers.unshift(new BracketSelectionRangeProvider);let work=[],allRawRanges=[];for(const provider of providers)work.push(Promise.resolve(provider.provideSelectionRanges(model,positions,token)).then((allProviderRanges=>{if(arrays.isNonEmptyArray(allProviderRanges)&&allProviderRanges.length===positions.length)for(let i=0;i<positions.length;i++){allRawRanges[i]||(allRawRanges[i]=[]);for(const oneProviderRanges of allProviderRanges[i])Range.isIRange(oneProviderRanges.range)&&Range.containsPosition(oneProviderRanges.range,positions[i])&&allRawRanges[i].push(Range.lift(oneProviderRanges.range))}}),onUnexpectedExternalError));return yield Promise.all(work),allRawRanges.map((oneRawRanges=>{if(0===oneRawRanges.length)return[];oneRawRanges.sort(((a,b)=>Position.isBefore(a.getStartPosition(),b.getStartPosition())?1:Position.isBefore(b.getStartPosition(),a.getStartPosition())||Position.isBefore(a.getEndPosition(),b.getEndPosition())?-1:Position.isBefore(b.getEndPosition(),a.getEndPosition())?1:0));let last,oneRanges=[];for(const range of oneRawRanges)(!last||Range.containsRange(range,last)&&!Range.equalsRange(range,last))&&(oneRanges.push(range),last=range);if(!options.selectLeadingAndTrailingWhitespace)return oneRanges;let oneRangesWithTrivia=[oneRanges[0]];for(let i=1;i<oneRanges.length;i++){const prev=oneRanges[i-1],cur=oneRanges[i];if(cur.startLineNumber!==prev.startLineNumber||cur.endLineNumber!==prev.endLineNumber){const rangeNoWhitespace=new Range(prev.startLineNumber,model.getLineFirstNonWhitespaceColumn(prev.startLineNumber),prev.endLineNumber,model.getLineLastNonWhitespaceColumn(prev.endLineNumber));rangeNoWhitespace.containsRange(prev)&&!rangeNoWhitespace.equalsRange(prev)&&cur.containsRange(rangeNoWhitespace)&&!cur.equalsRange(rangeNoWhitespace)&&oneRangesWithTrivia.push(rangeNoWhitespace);const rangeFull=new Range(prev.startLineNumber,1,prev.endLineNumber,model.getLineMaxColumn(prev.endLineNumber));rangeFull.containsRange(prev)&&!rangeFull.equalsRange(rangeNoWhitespace)&&cur.containsRange(rangeFull)&&!cur.equalsRange(rangeFull)&&oneRangesWithTrivia.push(rangeFull)}oneRangesWithTrivia.push(cur)}return oneRangesWithTrivia}))}))}CommandsRegistry.registerCommand("_executeSelectionRangeProvider",(function(accessor,...args){return __awaiter(this,void 0,void 0,(function*(){const[resource,positions]=args;assertType(URI.isUri(resource));const registry=accessor.get(ILanguageFeaturesService).selectionRangeProvider,reference=yield accessor.get(ITextModelService).createModelReference(resource);try{return provideSelectionRanges(registry,reference.object.textEditorModel,positions,{selectLeadingAndTrailingWhitespace:!0},CancellationToken.None)}finally{reference.dispose()}}))}));