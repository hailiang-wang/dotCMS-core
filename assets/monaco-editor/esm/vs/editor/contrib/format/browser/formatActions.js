var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{isNonEmptyArray}from"../../../../base/common/arrays.js";import{CancellationToken,CancellationTokenSource}from"../../../../base/common/cancellation.js";import{onUnexpectedError}from"../../../../base/common/errors.js";import{KeyChord}from"../../../../base/common/keyCodes.js";import{DisposableStore}from"../../../../base/common/lifecycle.js";import{EditorAction,registerEditorAction,registerEditorContribution}from"../../../browser/editorExtensions.js";import{ICodeEditorService}from"../../../browser/services/codeEditorService.js";import{CharacterSet}from"../../../common/core/characterClassifier.js";import{Range}from"../../../common/core/range.js";import{EditorContextKeys}from"../../../common/editorContextKeys.js";import{IEditorWorkerService}from"../../../common/services/editorWorker.js";import{ILanguageFeaturesService}from"../../../common/services/languageFeatures.js";import{alertFormattingEdits,formatDocumentRangesWithSelectedProvider,formatDocumentWithSelectedProvider,getOnTypeFormattingEdits}from"./format.js";import{FormattingEdit}from"./formattingEdit.js";import*as nls from"../../../../nls.js";import{CommandsRegistry,ICommandService}from"../../../../platform/commands/common/commands.js";import{ContextKeyExpr}from"../../../../platform/contextkey/common/contextkey.js";import{IInstantiationService}from"../../../../platform/instantiation/common/instantiation.js";import{IEditorProgressService,Progress}from"../../../../platform/progress/common/progress.js";let FormatOnType=class FormatOnType{constructor(_editor,_languageFeaturesService,_workerService){this._editor=_editor,this._languageFeaturesService=_languageFeaturesService,this._workerService=_workerService,this._disposables=new DisposableStore,this._sessionDisposables=new DisposableStore,this._disposables.add(_languageFeaturesService.onTypeFormattingEditProvider.onDidChange(this._update,this)),this._disposables.add(_editor.onDidChangeModel((()=>this._update()))),this._disposables.add(_editor.onDidChangeModelLanguage((()=>this._update()))),this._disposables.add(_editor.onDidChangeConfiguration((e=>{e.hasChanged(49)&&this._update()})))}dispose(){this._disposables.dispose(),this._sessionDisposables.dispose()}_update(){if(this._sessionDisposables.clear(),!this._editor.getOption(49))return;if(!this._editor.hasModel())return;const model=this._editor.getModel(),[support]=this._languageFeaturesService.onTypeFormattingEditProvider.ordered(model);if(!support||!support.autoFormatTriggerCharacters)return;let triggerChars=new CharacterSet;for(let ch of support.autoFormatTriggerCharacters)triggerChars.add(ch.charCodeAt(0));this._sessionDisposables.add(this._editor.onDidType((text=>{let lastCharCode=text.charCodeAt(text.length-1);triggerChars.has(lastCharCode)&&this._trigger(String.fromCharCode(lastCharCode))})))}_trigger(ch){if(!this._editor.hasModel())return;if(this._editor.getSelections().length>1||!this._editor.getSelection().isEmpty())return;const model=this._editor.getModel(),position=this._editor.getPosition(),cts=new CancellationTokenSource,unbind=this._editor.onDidChangeModelContent((e=>{if(e.isFlush)return cts.cancel(),void unbind.dispose();for(let i=0,len=e.changes.length;i<len;i++){if(e.changes[i].range.endLineNumber<=position.lineNumber)return cts.cancel(),void unbind.dispose()}}));getOnTypeFormattingEdits(this._workerService,this._languageFeaturesService,model,position,ch,model.getFormattingOptions(),cts.token).then((edits=>{cts.token.isCancellationRequested||isNonEmptyArray(edits)&&(FormattingEdit.execute(this._editor,edits,!0),alertFormattingEdits(edits))})).finally((()=>{unbind.dispose()}))}};FormatOnType.ID="editor.contrib.autoFormat",FormatOnType=__decorate([__param(1,ILanguageFeaturesService),__param(2,IEditorWorkerService)],FormatOnType);let FormatOnPaste=class FormatOnPaste{constructor(editor,_languageFeaturesService,_instantiationService){this.editor=editor,this._languageFeaturesService=_languageFeaturesService,this._instantiationService=_instantiationService,this._callOnDispose=new DisposableStore,this._callOnModel=new DisposableStore,this._callOnDispose.add(editor.onDidChangeConfiguration((()=>this._update()))),this._callOnDispose.add(editor.onDidChangeModel((()=>this._update()))),this._callOnDispose.add(editor.onDidChangeModelLanguage((()=>this._update()))),this._callOnDispose.add(_languageFeaturesService.documentRangeFormattingEditProvider.onDidChange(this._update,this))}dispose(){this._callOnDispose.dispose(),this._callOnModel.dispose()}_update(){this._callOnModel.clear(),this.editor.getOption(48)&&this.editor.hasModel()&&this._languageFeaturesService.documentRangeFormattingEditProvider.has(this.editor.getModel())&&this._callOnModel.add(this.editor.onDidPaste((({range})=>this._trigger(range))))}_trigger(range){this.editor.hasModel()&&(this.editor.getSelections().length>1||this._instantiationService.invokeFunction(formatDocumentRangesWithSelectedProvider,this.editor,range,2,Progress.None,CancellationToken.None).catch(onUnexpectedError))}};FormatOnPaste.ID="editor.contrib.formatOnPaste",FormatOnPaste=__decorate([__param(1,ILanguageFeaturesService),__param(2,IInstantiationService)],FormatOnPaste);class FormatDocumentAction extends EditorAction{constructor(){super({id:"editor.action.formatDocument",label:nls.localize("formatDocument.label","Format Document"),alias:"Format Document",precondition:ContextKeyExpr.and(EditorContextKeys.notInCompositeEditor,EditorContextKeys.writable,EditorContextKeys.hasDocumentFormattingProvider),kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:1572,linux:{primary:3111},weight:100},contextMenuOpts:{group:"1_modification",order:1.3}})}run(accessor,editor){return __awaiter(this,void 0,void 0,(function*(){if(editor.hasModel()){const instaService=accessor.get(IInstantiationService),progressService=accessor.get(IEditorProgressService);yield progressService.showWhile(instaService.invokeFunction(formatDocumentWithSelectedProvider,editor,1,Progress.None,CancellationToken.None),250)}}))}}class FormatSelectionAction extends EditorAction{constructor(){super({id:"editor.action.formatSelection",label:nls.localize("formatSelection.label","Format Selection"),alias:"Format Selection",precondition:ContextKeyExpr.and(EditorContextKeys.writable,EditorContextKeys.hasDocumentSelectionFormattingProvider),kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2084),weight:100},contextMenuOpts:{when:EditorContextKeys.hasNonEmptySelection,group:"1_modification",order:1.31}})}run(accessor,editor){return __awaiter(this,void 0,void 0,(function*(){if(!editor.hasModel())return;const instaService=accessor.get(IInstantiationService),model=editor.getModel(),ranges=editor.getSelections().map((range=>range.isEmpty()?new Range(range.startLineNumber,1,range.startLineNumber,model.getLineMaxColumn(range.startLineNumber)):range)),progressService=accessor.get(IEditorProgressService);yield progressService.showWhile(instaService.invokeFunction(formatDocumentRangesWithSelectedProvider,editor,ranges,1,Progress.None,CancellationToken.None),250)}))}}registerEditorContribution(FormatOnType.ID,FormatOnType),registerEditorContribution(FormatOnPaste.ID,FormatOnPaste),registerEditorAction(FormatDocumentAction),registerEditorAction(FormatSelectionAction),CommandsRegistry.registerCommand("editor.action.format",(accessor=>__awaiter(void 0,void 0,void 0,(function*(){const editor=accessor.get(ICodeEditorService).getFocusedCodeEditor();if(!editor||!editor.hasModel())return;const commandService=accessor.get(ICommandService);editor.getSelection().isEmpty()?yield commandService.executeCommand("editor.action.formatDocument"):yield commandService.executeCommand("editor.action.formatSelection")}))));