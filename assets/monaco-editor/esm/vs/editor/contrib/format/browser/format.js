var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{alert}from"../../../../base/browser/ui/aria/aria.js";import{asArray,isNonEmptyArray}from"../../../../base/common/arrays.js";import{CancellationToken}from"../../../../base/common/cancellation.js";import{onUnexpectedExternalError}from"../../../../base/common/errors.js";import{Iterable}from"../../../../base/common/iterator.js";import{LinkedList}from"../../../../base/common/linkedList.js";import{assertType}from"../../../../base/common/types.js";import{URI}from"../../../../base/common/uri.js";import{EditorStateCancellationTokenSource,TextModelCancellationTokenSource}from"../../editorState/browser/editorState.js";import{isCodeEditor}from"../../../browser/editorBrowser.js";import{Position}from"../../../common/core/position.js";import{Range}from"../../../common/core/range.js";import{Selection}from"../../../common/core/selection.js";import{IEditorWorkerService}from"../../../common/services/editorWorker.js";import{ITextModelService}from"../../../common/services/resolverService.js";import{FormattingEdit}from"./formattingEdit.js";import*as nls from"../../../../nls.js";import{CommandsRegistry}from"../../../../platform/commands/common/commands.js";import{ExtensionIdentifier}from"../../../../platform/extensions/common/extensions.js";import{IInstantiationService}from"../../../../platform/instantiation/common/instantiation.js";import{ILanguageFeaturesService}from"../../../common/services/languageFeatures.js";export function alertFormattingEdits(edits){if(!(edits=edits.filter((edit=>edit.range))).length)return;let{range}=edits[0];for(let i=1;i<edits.length;i++)range=Range.plusRange(range,edits[i].range);const{startLineNumber,endLineNumber}=range;startLineNumber===endLineNumber?1===edits.length?alert(nls.localize("hint11","Made 1 formatting edit on line {0}",startLineNumber)):alert(nls.localize("hintn1","Made {0} formatting edits on line {1}",edits.length,startLineNumber)):1===edits.length?alert(nls.localize("hint1n","Made 1 formatting edit between lines {0} and {1}",startLineNumber,endLineNumber)):alert(nls.localize("hintnn","Made {0} formatting edits between lines {1} and {2}",edits.length,startLineNumber,endLineNumber))}export function getRealAndSyntheticDocumentFormattersOrdered(documentFormattingEditProvider,documentRangeFormattingEditProvider,model){const result=[],seen=new Set,docFormatter=documentFormattingEditProvider.ordered(model);for(const formatter of docFormatter)result.push(formatter),formatter.extensionId&&seen.add(ExtensionIdentifier.toKey(formatter.extensionId));const rangeFormatter=documentRangeFormattingEditProvider.ordered(model);for(const formatter of rangeFormatter){if(formatter.extensionId){if(seen.has(ExtensionIdentifier.toKey(formatter.extensionId)))continue;seen.add(ExtensionIdentifier.toKey(formatter.extensionId))}result.push({displayName:formatter.displayName,extensionId:formatter.extensionId,provideDocumentFormattingEdits:(model,options,token)=>formatter.provideDocumentRangeFormattingEdits(model,model.getFullModelRange(),options,token)})}return result}export class FormattingConflicts{static setFormatterSelector(selector){return{dispose:FormattingConflicts._selectors.unshift(selector)}}static select(formatter,document,mode){return __awaiter(this,void 0,void 0,(function*(){if(0===formatter.length)return;const selector=Iterable.first(FormattingConflicts._selectors);return selector?yield selector(formatter,document,mode):void 0}))}}FormattingConflicts._selectors=new LinkedList;export function formatDocumentRangesWithSelectedProvider(accessor,editorOrModel,rangeOrRanges,mode,progress,token){return __awaiter(this,void 0,void 0,(function*(){const instaService=accessor.get(IInstantiationService),{documentRangeFormattingEditProvider:documentRangeFormattingEditProviderRegistry}=accessor.get(ILanguageFeaturesService),model=isCodeEditor(editorOrModel)?editorOrModel.getModel():editorOrModel,provider=documentRangeFormattingEditProviderRegistry.ordered(model),selected=yield FormattingConflicts.select(provider,model,mode);selected&&(progress.report(selected),yield instaService.invokeFunction(formatDocumentRangesWithProvider,selected,editorOrModel,rangeOrRanges,token))}))}export function formatDocumentRangesWithProvider(accessor,provider,editorOrModel,rangeOrRanges,token){return __awaiter(this,void 0,void 0,(function*(){const workerService=accessor.get(IEditorWorkerService);let model,cts;isCodeEditor(editorOrModel)?(model=editorOrModel.getModel(),cts=new EditorStateCancellationTokenSource(editorOrModel,5,void 0,token)):(model=editorOrModel,cts=new TextModelCancellationTokenSource(editorOrModel,token));let ranges=[],len=0;for(let range of asArray(rangeOrRanges).sort(Range.compareRangesUsingStarts))len>0&&Range.areIntersectingOrTouching(ranges[len-1],range)?ranges[len-1]=Range.fromPositions(ranges[len-1].getStartPosition(),range.getEndPosition()):len=ranges.push(range);const computeEdits=range=>__awaiter(this,void 0,void 0,(function*(){return(yield provider.provideDocumentRangeFormattingEdits(model,range,model.getFormattingOptions(),cts.token))||[]})),hasIntersectingEdit=(a,b)=>{if(!a.length||!b.length)return!1;const mergedA=a.reduce(((acc,val)=>Range.plusRange(acc,val.range)),a[0].range);if(!b.some((x=>Range.intersectRanges(mergedA,x.range))))return!1;for(let edit of a)for(let otherEdit of b)if(Range.intersectRanges(edit.range,otherEdit.range))return!0;return!1},allEdits=[],rawEditsList=[];try{for(let range of ranges){if(cts.token.isCancellationRequested)return!0;rawEditsList.push(yield computeEdits(range))}for(let i=0;i<ranges.length;++i)for(let j=i+1;j<ranges.length;++j){if(cts.token.isCancellationRequested)return!0;if(hasIntersectingEdit(rawEditsList[i],rawEditsList[j])){const mergedRange=Range.plusRange(ranges[i],ranges[j]),edits=yield computeEdits(mergedRange);ranges.splice(j,1),ranges.splice(i,1),ranges.push(mergedRange),rawEditsList.splice(j,1),rawEditsList.splice(i,1),rawEditsList.push(edits),i=0,j=0}}for(let rawEdits of rawEditsList){if(cts.token.isCancellationRequested)return!0;const minimalEdits=yield workerService.computeMoreMinimalEdits(model.uri,rawEdits);minimalEdits&&allEdits.push(...minimalEdits)}}finally{cts.dispose()}if(0===allEdits.length)return!1;if(isCodeEditor(editorOrModel))FormattingEdit.execute(editorOrModel,allEdits,!0),alertFormattingEdits(allEdits),editorOrModel.revealPositionInCenterIfOutsideViewport(editorOrModel.getPosition(),1);else{const[{range}]=allEdits,initialSelection=new Selection(range.startLineNumber,range.startColumn,range.endLineNumber,range.endColumn);model.pushEditOperations([initialSelection],allEdits.map((edit=>({text:edit.text,range:Range.lift(edit.range),forceMoveMarkers:!0}))),(undoEdits=>{for(const{range}of undoEdits)if(Range.areIntersectingOrTouching(range,initialSelection))return[new Selection(range.startLineNumber,range.startColumn,range.endLineNumber,range.endColumn)];return null}))}return!0}))}export function formatDocumentWithSelectedProvider(accessor,editorOrModel,mode,progress,token){return __awaiter(this,void 0,void 0,(function*(){const instaService=accessor.get(IInstantiationService),languageFeaturesService=accessor.get(ILanguageFeaturesService),model=isCodeEditor(editorOrModel)?editorOrModel.getModel():editorOrModel,provider=getRealAndSyntheticDocumentFormattersOrdered(languageFeaturesService.documentFormattingEditProvider,languageFeaturesService.documentRangeFormattingEditProvider,model),selected=yield FormattingConflicts.select(provider,model,mode);selected&&(progress.report(selected),yield instaService.invokeFunction(formatDocumentWithProvider,selected,editorOrModel,mode,token))}))}export function formatDocumentWithProvider(accessor,provider,editorOrModel,mode,token){return __awaiter(this,void 0,void 0,(function*(){const workerService=accessor.get(IEditorWorkerService);let model,cts,edits;isCodeEditor(editorOrModel)?(model=editorOrModel.getModel(),cts=new EditorStateCancellationTokenSource(editorOrModel,5,void 0,token)):(model=editorOrModel,cts=new TextModelCancellationTokenSource(editorOrModel,token));try{const rawEdits=yield provider.provideDocumentFormattingEdits(model,model.getFormattingOptions(),cts.token);if(edits=yield workerService.computeMoreMinimalEdits(model.uri,rawEdits),cts.token.isCancellationRequested)return!0}finally{cts.dispose()}if(!edits||0===edits.length)return!1;if(isCodeEditor(editorOrModel))FormattingEdit.execute(editorOrModel,edits,2!==mode),2!==mode&&(alertFormattingEdits(edits),editorOrModel.revealPositionInCenterIfOutsideViewport(editorOrModel.getPosition(),1));else{const[{range}]=edits,initialSelection=new Selection(range.startLineNumber,range.startColumn,range.endLineNumber,range.endColumn);model.pushEditOperations([initialSelection],edits.map((edit=>({text:edit.text,range:Range.lift(edit.range),forceMoveMarkers:!0}))),(undoEdits=>{for(const{range}of undoEdits)if(Range.areIntersectingOrTouching(range,initialSelection))return[new Selection(range.startLineNumber,range.startColumn,range.endLineNumber,range.endColumn)];return null}))}return!0}))}export function getDocumentRangeFormattingEditsUntilResult(workerService,languageFeaturesService,model,range,options,token){return __awaiter(this,void 0,void 0,(function*(){const providers=languageFeaturesService.documentRangeFormattingEditProvider.ordered(model);for(const provider of providers){let rawEdits=yield Promise.resolve(provider.provideDocumentRangeFormattingEdits(model,range,options,token)).catch(onUnexpectedExternalError);if(isNonEmptyArray(rawEdits))return yield workerService.computeMoreMinimalEdits(model.uri,rawEdits)}}))}export function getDocumentFormattingEditsUntilResult(workerService,languageFeaturesService,model,options,token){return __awaiter(this,void 0,void 0,(function*(){const providers=getRealAndSyntheticDocumentFormattersOrdered(languageFeaturesService.documentFormattingEditProvider,languageFeaturesService.documentRangeFormattingEditProvider,model);for(const provider of providers){let rawEdits=yield Promise.resolve(provider.provideDocumentFormattingEdits(model,options,token)).catch(onUnexpectedExternalError);if(isNonEmptyArray(rawEdits))return yield workerService.computeMoreMinimalEdits(model.uri,rawEdits)}}))}export function getOnTypeFormattingEdits(workerService,languageFeaturesService,model,position,ch,options,token){const providers=languageFeaturesService.onTypeFormattingEditProvider.ordered(model);return 0===providers.length||providers[0].autoFormatTriggerCharacters.indexOf(ch)<0?Promise.resolve(void 0):Promise.resolve(providers[0].provideOnTypeFormattingEdits(model,position,ch,options,token)).catch(onUnexpectedExternalError).then((edits=>workerService.computeMoreMinimalEdits(model.uri,edits)))}CommandsRegistry.registerCommand("_executeFormatRangeProvider",(function(accessor,...args){return __awaiter(this,void 0,void 0,(function*(){const[resource,range,options]=args;assertType(URI.isUri(resource)),assertType(Range.isIRange(range));const resolverService=accessor.get(ITextModelService),workerService=accessor.get(IEditorWorkerService),languageFeaturesService=accessor.get(ILanguageFeaturesService),reference=yield resolverService.createModelReference(resource);try{return getDocumentRangeFormattingEditsUntilResult(workerService,languageFeaturesService,reference.object.textEditorModel,Range.lift(range),options,CancellationToken.None)}finally{reference.dispose()}}))})),CommandsRegistry.registerCommand("_executeFormatDocumentProvider",(function(accessor,...args){return __awaiter(this,void 0,void 0,(function*(){const[resource,options]=args;assertType(URI.isUri(resource));const resolverService=accessor.get(ITextModelService),workerService=accessor.get(IEditorWorkerService),languageFeaturesService=accessor.get(ILanguageFeaturesService),reference=yield resolverService.createModelReference(resource);try{return getDocumentFormattingEditsUntilResult(workerService,languageFeaturesService,reference.object.textEditorModel,options,CancellationToken.None)}finally{reference.dispose()}}))})),CommandsRegistry.registerCommand("_executeFormatOnTypeProvider",(function(accessor,...args){return __awaiter(this,void 0,void 0,(function*(){const[resource,position,ch,options]=args;assertType(URI.isUri(resource)),assertType(Position.isIPosition(position)),assertType("string"==typeof ch);const resolverService=accessor.get(ITextModelService),workerService=accessor.get(IEditorWorkerService),languageFeaturesService=accessor.get(ILanguageFeaturesService),reference=yield resolverService.createModelReference(resource);try{return getOnTypeFormattingEdits(workerService,languageFeaturesService,reference.object.textEditorModel,Position.lift(position),ch,options,CancellationToken.None)}finally{reference.dispose()}}))}));