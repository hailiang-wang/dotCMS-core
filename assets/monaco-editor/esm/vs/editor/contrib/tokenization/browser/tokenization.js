import{StopWatch}from"../../../../base/common/stopwatch.js";import{EditorAction,registerEditorAction}from"../../../browser/editorExtensions.js";import*as nls from"../../../../nls.js";class ForceRetokenizeAction extends EditorAction{constructor(){super({id:"editor.action.forceRetokenize",label:nls.localize("forceRetokenize","Developer: Force Retokenize"),alias:"Developer: Force Retokenize",precondition:void 0})}run(accessor,editor){if(!editor.hasModel())return;const model=editor.getModel();model.resetTokenization();const sw=new StopWatch(!0);model.forceTokenization(model.getLineCount()),sw.stop(),console.log(`tokenization took ${sw.elapsed()}`)}}registerEditorAction(ForceRetokenizeAction);