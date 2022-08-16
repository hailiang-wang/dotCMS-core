import*as nls from"../../nls.js";import{isFirefox}from"../../base/browser/browser.js";import*as types from"../../base/common/types.js";import{status}from"../../base/browser/ui/aria/aria.js";import{Command,EditorCommand,registerEditorCommand,UndoCommand,RedoCommand,SelectAllCommand}from"./editorExtensions.js";import{ICodeEditorService}from"./services/codeEditorService.js";import{ColumnSelection}from"../common/cursor/cursorColumnSelection.js";import{CursorState}from"../common/cursorCommon.js";import{DeleteOperations}from"../common/cursor/cursorDeleteOperations.js";import{CursorMove as CursorMove_,CursorMoveCommands}from"../common/cursor/cursorMoveCommands.js";import{TypeOperations}from"../common/cursor/cursorTypeOperations.js";import{Position}from"../common/core/position.js";import{Range}from"../common/core/range.js";import{EditorContextKeys}from"../common/editorContextKeys.js";import{ContextKeyExpr}from"../../platform/contextkey/common/contextkey.js";import{KeybindingsRegistry}from"../../platform/keybinding/common/keybindingsRegistry.js";const CORE_WEIGHT=0;export class CoreEditorCommand extends EditorCommand{runEditorCommand(accessor,editor,args){const viewModel=editor._getViewModel();viewModel&&this.runCoreEditorCommand(viewModel,args||{})}}export var EditorScroll_;!function(EditorScroll_){EditorScroll_.description={description:"Scroll editor in the given direction",args:[{name:"Editor scroll argument object",description:"Property-value pairs that can be passed through this argument:\n\t\t\t\t\t* 'to': A mandatory direction value.\n\t\t\t\t\t\t```\n\t\t\t\t\t\t'up', 'down'\n\t\t\t\t\t\t```\n\t\t\t\t\t* 'by': Unit to move. Default is computed based on 'to' value.\n\t\t\t\t\t\t```\n\t\t\t\t\t\t'line', 'wrappedLine', 'page', 'halfPage'\n\t\t\t\t\t\t```\n\t\t\t\t\t* 'value': Number of units to move. Default is '1'.\n\t\t\t\t\t* 'revealCursor': If 'true' reveals the cursor if it is outside view port.\n\t\t\t\t",constraint:function(arg){if(!types.isObject(arg))return!1;const scrollArg=arg;return!!types.isString(scrollArg.to)&&(!(!types.isUndefined(scrollArg.by)&&!types.isString(scrollArg.by))&&(!(!types.isUndefined(scrollArg.value)&&!types.isNumber(scrollArg.value))&&!(!types.isUndefined(scrollArg.revealCursor)&&!types.isBoolean(scrollArg.revealCursor))))},schema:{type:"object",required:["to"],properties:{to:{type:"string",enum:["up","down"]},by:{type:"string",enum:["line","wrappedLine","page","halfPage"]},value:{type:"number",default:1},revealCursor:{type:"boolean"}}}}]},EditorScroll_.RawDirection={Up:"up",Down:"down"},EditorScroll_.RawUnit={Line:"line",WrappedLine:"wrappedLine",Page:"page",HalfPage:"halfPage"},EditorScroll_.parse=function parse(args){let direction,unit;switch(args.to){case EditorScroll_.RawDirection.Up:direction=1;break;case EditorScroll_.RawDirection.Down:direction=2;break;default:return null}switch(args.by){case EditorScroll_.RawUnit.Line:unit=1;break;case EditorScroll_.RawUnit.WrappedLine:unit=2;break;case EditorScroll_.RawUnit.Page:unit=3;break;case EditorScroll_.RawUnit.HalfPage:unit=4;break;default:unit=2}return{direction,unit,value:Math.floor(args.value||1),revealCursor:!!args.revealCursor,select:!!args.select}}}(EditorScroll_||(EditorScroll_={}));export var RevealLine_;!function(RevealLine_){RevealLine_.description={description:"Reveal the given line at the given logical position",args:[{name:"Reveal line argument object",description:"Property-value pairs that can be passed through this argument:\n\t\t\t\t\t* 'lineNumber': A mandatory line number value.\n\t\t\t\t\t* 'at': Logical position at which line has to be revealed.\n\t\t\t\t\t\t```\n\t\t\t\t\t\t'top', 'center', 'bottom'\n\t\t\t\t\t\t```\n\t\t\t\t",constraint:function(arg){if(!types.isObject(arg))return!1;const reveaLineArg=arg;return!(!types.isNumber(reveaLineArg.lineNumber)&&!types.isString(reveaLineArg.lineNumber))&&!(!types.isUndefined(reveaLineArg.at)&&!types.isString(reveaLineArg.at))},schema:{type:"object",required:["lineNumber"],properties:{lineNumber:{type:["number","string"]},at:{type:"string",enum:["top","center","bottom"]}}}}]},RevealLine_.RawAtArgument={Top:"top",Center:"center",Bottom:"bottom"}}(RevealLine_||(RevealLine_={}));class EditorOrNativeTextInputCommand{constructor(target){target.addImplementation(1e4,"code-editor",((accessor,args)=>{const focusedEditor=accessor.get(ICodeEditorService).getFocusedCodeEditor();return!(!focusedEditor||!focusedEditor.hasTextFocus())&&this._runEditorCommand(accessor,focusedEditor,args)})),target.addImplementation(1e3,"generic-dom-input-textarea",((accessor,args)=>{const activeElement=document.activeElement;return!!(activeElement&&["input","textarea"].indexOf(activeElement.tagName.toLowerCase())>=0)&&(this.runDOMCommand(),!0)})),target.addImplementation(0,"generic-dom",((accessor,args)=>{const activeEditor=accessor.get(ICodeEditorService).getActiveCodeEditor();return!!activeEditor&&(activeEditor.focus(),this._runEditorCommand(accessor,activeEditor,args))}))}_runEditorCommand(accessor,editor,args){const result=this.runEditorCommand(accessor,editor,args);return result||!0}}export var CoreNavigationCommands;!function(CoreNavigationCommands){class BaseMoveToCommand extends CoreEditorCommand{constructor(opts){super(opts),this._minimalReveal=opts.minimalReveal,this._inSelectionMode=opts.inSelectionMode}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement();viewModel.setCursorStates(args.source,3,[CursorMoveCommands.moveTo(viewModel,viewModel.getPrimaryCursorState(),this._inSelectionMode,args.position,args.viewPosition)])&&viewModel.revealPrimaryCursor(args.source,!0,this._minimalReveal)}}CoreNavigationCommands.MoveTo=registerEditorCommand(new BaseMoveToCommand({id:"_moveTo",minimalReveal:!0,inSelectionMode:!1,precondition:void 0})),CoreNavigationCommands.MoveToSelect=registerEditorCommand(new BaseMoveToCommand({id:"_moveToSelect",minimalReveal:!1,inSelectionMode:!0,precondition:void 0}));class ColumnSelectCommand extends CoreEditorCommand{runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement();const result=this._getColumnSelectResult(viewModel,viewModel.getPrimaryCursorState(),viewModel.getCursorColumnSelectData(),args);viewModel.setCursorStates(args.source,3,result.viewStates.map((viewState=>CursorState.fromViewState(viewState)))),viewModel.setCursorColumnSelectData({isReal:!0,fromViewLineNumber:result.fromLineNumber,fromViewVisualColumn:result.fromVisualColumn,toViewLineNumber:result.toLineNumber,toViewVisualColumn:result.toVisualColumn}),result.reversed?viewModel.revealTopMostCursor(args.source):viewModel.revealBottomMostCursor(args.source)}}CoreNavigationCommands.ColumnSelect=registerEditorCommand(new class extends ColumnSelectCommand{constructor(){super({id:"columnSelect",precondition:void 0})}_getColumnSelectResult(viewModel,primary,prevColumnSelectData,args){const validatedPosition=viewModel.model.validatePosition(args.position),validatedViewPosition=viewModel.coordinatesConverter.validateViewPosition(new Position(args.viewPosition.lineNumber,args.viewPosition.column),validatedPosition),fromViewLineNumber=args.doColumnSelect?prevColumnSelectData.fromViewLineNumber:validatedViewPosition.lineNumber,fromViewVisualColumn=args.doColumnSelect?prevColumnSelectData.fromViewVisualColumn:args.mouseColumn-1;return ColumnSelection.columnSelect(viewModel.cursorConfig,viewModel,fromViewLineNumber,fromViewVisualColumn,validatedViewPosition.lineNumber,args.mouseColumn-1)}}),CoreNavigationCommands.CursorColumnSelectLeft=registerEditorCommand(new class extends ColumnSelectCommand{constructor(){super({id:"cursorColumnSelectLeft",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:3599,linux:{primary:0}}})}_getColumnSelectResult(viewModel,primary,prevColumnSelectData,args){return ColumnSelection.columnSelectLeft(viewModel.cursorConfig,viewModel,prevColumnSelectData)}}),CoreNavigationCommands.CursorColumnSelectRight=registerEditorCommand(new class extends ColumnSelectCommand{constructor(){super({id:"cursorColumnSelectRight",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:3601,linux:{primary:0}}})}_getColumnSelectResult(viewModel,primary,prevColumnSelectData,args){return ColumnSelection.columnSelectRight(viewModel.cursorConfig,viewModel,prevColumnSelectData)}});class ColumnSelectUpCommand extends ColumnSelectCommand{constructor(opts){super(opts),this._isPaged=opts.isPaged}_getColumnSelectResult(viewModel,primary,prevColumnSelectData,args){return ColumnSelection.columnSelectUp(viewModel.cursorConfig,viewModel,prevColumnSelectData,this._isPaged)}}CoreNavigationCommands.CursorColumnSelectUp=registerEditorCommand(new ColumnSelectUpCommand({isPaged:!1,id:"cursorColumnSelectUp",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:3600,linux:{primary:0}}})),CoreNavigationCommands.CursorColumnSelectPageUp=registerEditorCommand(new ColumnSelectUpCommand({isPaged:!0,id:"cursorColumnSelectPageUp",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:3595,linux:{primary:0}}}));class ColumnSelectDownCommand extends ColumnSelectCommand{constructor(opts){super(opts),this._isPaged=opts.isPaged}_getColumnSelectResult(viewModel,primary,prevColumnSelectData,args){return ColumnSelection.columnSelectDown(viewModel.cursorConfig,viewModel,prevColumnSelectData,this._isPaged)}}CoreNavigationCommands.CursorColumnSelectDown=registerEditorCommand(new ColumnSelectDownCommand({isPaged:!1,id:"cursorColumnSelectDown",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:3602,linux:{primary:0}}})),CoreNavigationCommands.CursorColumnSelectPageDown=registerEditorCommand(new ColumnSelectDownCommand({isPaged:!0,id:"cursorColumnSelectPageDown",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:3596,linux:{primary:0}}}));class CursorMoveImpl extends CoreEditorCommand{constructor(){super({id:"cursorMove",precondition:void 0,description:CursorMove_.description})}runCoreEditorCommand(viewModel,args){const parsed=CursorMove_.parse(args);parsed&&this._runCursorMove(viewModel,args.source,parsed)}_runCursorMove(viewModel,source,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(source,3,CursorMoveImpl._move(viewModel,viewModel.getCursorStates(),args)),viewModel.revealPrimaryCursor(source,!0)}static _move(viewModel,cursors,args){const inSelectionMode=args.select,value=args.value;switch(args.direction){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 9:case 10:return CursorMoveCommands.simpleMove(viewModel,cursors,args.direction,inSelectionMode,value,args.unit);case 11:case 13:case 12:case 14:return CursorMoveCommands.viewportMove(viewModel,cursors,args.direction,inSelectionMode,value);default:return null}}}CoreNavigationCommands.CursorMoveImpl=CursorMoveImpl,CoreNavigationCommands.CursorMove=registerEditorCommand(new CursorMoveImpl);class CursorMoveBasedCommand extends CoreEditorCommand{constructor(opts){super(opts),this._staticArgs=opts.args}runCoreEditorCommand(viewModel,dynamicArgs){let args=this._staticArgs;-1===this._staticArgs.value&&(args={direction:this._staticArgs.direction,unit:this._staticArgs.unit,select:this._staticArgs.select,value:dynamicArgs.pageSize||viewModel.cursorConfig.pageSize}),viewModel.model.pushStackElement(),viewModel.setCursorStates(dynamicArgs.source,3,CursorMoveCommands.simpleMove(viewModel,viewModel.getCursorStates(),args.direction,args.select,args.value,args.unit)),viewModel.revealPrimaryCursor(dynamicArgs.source,!0)}}CoreNavigationCommands.CursorLeft=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:0,unit:0,select:!1,value:1},id:"cursorLeft",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:15,mac:{primary:15,secondary:[288]}}})),CoreNavigationCommands.CursorLeftSelect=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:0,unit:0,select:!0,value:1},id:"cursorLeftSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:1039}})),CoreNavigationCommands.CursorRight=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:1,unit:0,select:!1,value:1},id:"cursorRight",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:17,mac:{primary:17,secondary:[292]}}})),CoreNavigationCommands.CursorRightSelect=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:1,unit:0,select:!0,value:1},id:"cursorRightSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:1041}})),CoreNavigationCommands.CursorUp=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:2,unit:2,select:!1,value:1},id:"cursorUp",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:16,mac:{primary:16,secondary:[302]}}})),CoreNavigationCommands.CursorUpSelect=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:2,unit:2,select:!0,value:1},id:"cursorUpSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:1040,secondary:[3088],mac:{primary:1040},linux:{primary:1040}}})),CoreNavigationCommands.CursorPageUp=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:2,unit:2,select:!1,value:-1},id:"cursorPageUp",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:11}})),CoreNavigationCommands.CursorPageUpSelect=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:2,unit:2,select:!0,value:-1},id:"cursorPageUpSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:1035}})),CoreNavigationCommands.CursorDown=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:3,unit:2,select:!1,value:1},id:"cursorDown",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:18,mac:{primary:18,secondary:[300]}}})),CoreNavigationCommands.CursorDownSelect=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:3,unit:2,select:!0,value:1},id:"cursorDownSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:1042,secondary:[3090],mac:{primary:1042},linux:{primary:1042}}})),CoreNavigationCommands.CursorPageDown=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:3,unit:2,select:!1,value:-1},id:"cursorPageDown",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:12}})),CoreNavigationCommands.CursorPageDownSelect=registerEditorCommand(new CursorMoveBasedCommand({args:{direction:3,unit:2,select:!0,value:-1},id:"cursorPageDownSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:1036}})),CoreNavigationCommands.CreateCursor=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"createCursor",precondition:void 0})}runCoreEditorCommand(viewModel,args){let newState;newState=args.wholeLine?CursorMoveCommands.line(viewModel,viewModel.getPrimaryCursorState(),!1,args.position,args.viewPosition):CursorMoveCommands.moveTo(viewModel,viewModel.getPrimaryCursorState(),!1,args.position,args.viewPosition);const states=viewModel.getCursorStates();if(states.length>1){const newModelPosition=newState.modelState?newState.modelState.position:null,newViewPosition=newState.viewState?newState.viewState.position:null;for(let i=0,len=states.length;i<len;i++){const state=states[i];if((!newModelPosition||state.modelState.selection.containsPosition(newModelPosition))&&(!newViewPosition||state.viewState.selection.containsPosition(newViewPosition)))return states.splice(i,1),viewModel.model.pushStackElement(),void viewModel.setCursorStates(args.source,3,states)}}states.push(newState),viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,states)}}),CoreNavigationCommands.LastCursorMoveToSelect=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"_lastCursorMoveToSelect",precondition:void 0})}runCoreEditorCommand(viewModel,args){const lastAddedCursorIndex=viewModel.getLastAddedCursorIndex(),states=viewModel.getCursorStates(),newStates=states.slice(0);newStates[lastAddedCursorIndex]=CursorMoveCommands.moveTo(viewModel,states[lastAddedCursorIndex],!0,args.position,args.viewPosition),viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,newStates)}});class HomeCommand extends CoreEditorCommand{constructor(opts){super(opts),this._inSelectionMode=opts.inSelectionMode}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,CursorMoveCommands.moveToBeginningOfLine(viewModel,viewModel.getCursorStates(),this._inSelectionMode)),viewModel.revealPrimaryCursor(args.source,!0)}}CoreNavigationCommands.CursorHome=registerEditorCommand(new HomeCommand({inSelectionMode:!1,id:"cursorHome",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:14,mac:{primary:14,secondary:[2063]}}})),CoreNavigationCommands.CursorHomeSelect=registerEditorCommand(new HomeCommand({inSelectionMode:!0,id:"cursorHomeSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:1038,mac:{primary:1038,secondary:[3087]}}}));class LineStartCommand extends CoreEditorCommand{constructor(opts){super(opts),this._inSelectionMode=opts.inSelectionMode}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,this._exec(viewModel.getCursorStates())),viewModel.revealPrimaryCursor(args.source,!0)}_exec(cursors){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i],lineNumber=cursor.modelState.position.lineNumber;result[i]=CursorState.fromModelState(cursor.modelState.move(this._inSelectionMode,lineNumber,1,0))}return result}}CoreNavigationCommands.CursorLineStart=registerEditorCommand(new LineStartCommand({inSelectionMode:!1,id:"cursorLineStart",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:0,mac:{primary:287}}})),CoreNavigationCommands.CursorLineStartSelect=registerEditorCommand(new LineStartCommand({inSelectionMode:!0,id:"cursorLineStartSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:0,mac:{primary:1311}}}));class EndCommand extends CoreEditorCommand{constructor(opts){super(opts),this._inSelectionMode=opts.inSelectionMode}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,CursorMoveCommands.moveToEndOfLine(viewModel,viewModel.getCursorStates(),this._inSelectionMode,args.sticky||!1)),viewModel.revealPrimaryCursor(args.source,!0)}}CoreNavigationCommands.CursorEnd=registerEditorCommand(new EndCommand({inSelectionMode:!1,id:"cursorEnd",precondition:void 0,kbOpts:{args:{sticky:!1},weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:13,mac:{primary:13,secondary:[2065]}},description:{description:"Go to End",args:[{name:"args",schema:{type:"object",properties:{sticky:{description:nls.localize("stickydesc","Stick to the end even when going to longer lines"),type:"boolean",default:!1}}}}]}})),CoreNavigationCommands.CursorEndSelect=registerEditorCommand(new EndCommand({inSelectionMode:!0,id:"cursorEndSelect",precondition:void 0,kbOpts:{args:{sticky:!1},weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:1037,mac:{primary:1037,secondary:[3089]}},description:{description:"Select to End",args:[{name:"args",schema:{type:"object",properties:{sticky:{description:nls.localize("stickydesc","Stick to the end even when going to longer lines"),type:"boolean",default:!1}}}}]}}));class LineEndCommand extends CoreEditorCommand{constructor(opts){super(opts),this._inSelectionMode=opts.inSelectionMode}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,this._exec(viewModel,viewModel.getCursorStates())),viewModel.revealPrimaryCursor(args.source,!0)}_exec(viewModel,cursors){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i],lineNumber=cursor.modelState.position.lineNumber,maxColumn=viewModel.model.getLineMaxColumn(lineNumber);result[i]=CursorState.fromModelState(cursor.modelState.move(this._inSelectionMode,lineNumber,maxColumn,0))}return result}}CoreNavigationCommands.CursorLineEnd=registerEditorCommand(new LineEndCommand({inSelectionMode:!1,id:"cursorLineEnd",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:0,mac:{primary:291}}})),CoreNavigationCommands.CursorLineEndSelect=registerEditorCommand(new LineEndCommand({inSelectionMode:!0,id:"cursorLineEndSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:0,mac:{primary:1315}}}));class TopCommand extends CoreEditorCommand{constructor(opts){super(opts),this._inSelectionMode=opts.inSelectionMode}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,CursorMoveCommands.moveToBeginningOfBuffer(viewModel,viewModel.getCursorStates(),this._inSelectionMode)),viewModel.revealPrimaryCursor(args.source,!0)}}CoreNavigationCommands.CursorTop=registerEditorCommand(new TopCommand({inSelectionMode:!1,id:"cursorTop",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:2062,mac:{primary:2064}}})),CoreNavigationCommands.CursorTopSelect=registerEditorCommand(new TopCommand({inSelectionMode:!0,id:"cursorTopSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:3086,mac:{primary:3088}}}));class BottomCommand extends CoreEditorCommand{constructor(opts){super(opts),this._inSelectionMode=opts.inSelectionMode}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,CursorMoveCommands.moveToEndOfBuffer(viewModel,viewModel.getCursorStates(),this._inSelectionMode)),viewModel.revealPrimaryCursor(args.source,!0)}}CoreNavigationCommands.CursorBottom=registerEditorCommand(new BottomCommand({inSelectionMode:!1,id:"cursorBottom",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:2061,mac:{primary:2066}}})),CoreNavigationCommands.CursorBottomSelect=registerEditorCommand(new BottomCommand({inSelectionMode:!0,id:"cursorBottomSelect",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:3085,mac:{primary:3090}}}));class EditorScrollImpl extends CoreEditorCommand{constructor(){super({id:"editorScroll",precondition:void 0,description:EditorScroll_.description})}runCoreEditorCommand(viewModel,args){const parsed=EditorScroll_.parse(args);parsed&&this._runEditorScroll(viewModel,args.source,parsed)}_runEditorScroll(viewModel,source,args){const desiredScrollTop=this._computeDesiredScrollTop(viewModel,args);if(args.revealCursor){const desiredVisibleViewRange=viewModel.getCompletelyVisibleViewRangeAtScrollTop(desiredScrollTop);viewModel.setCursorStates(source,3,[CursorMoveCommands.findPositionInViewportIfOutside(viewModel,viewModel.getPrimaryCursorState(),desiredVisibleViewRange,args.select)])}viewModel.viewLayout.setScrollPosition({scrollTop:desiredScrollTop},0)}_computeDesiredScrollTop(viewModel,args){if(1===args.unit){const visibleViewRange=viewModel.getCompletelyVisibleViewRange(),visibleModelRange=viewModel.coordinatesConverter.convertViewRangeToModelRange(visibleViewRange);let desiredTopModelLineNumber;desiredTopModelLineNumber=1===args.direction?Math.max(1,visibleModelRange.startLineNumber-args.value):Math.min(viewModel.model.getLineCount(),visibleModelRange.startLineNumber+args.value);const viewPosition=viewModel.coordinatesConverter.convertModelPositionToViewPosition(new Position(desiredTopModelLineNumber,1));return viewModel.viewLayout.getVerticalOffsetForLineNumber(viewPosition.lineNumber)}let noOfLines;noOfLines=3===args.unit?viewModel.cursorConfig.pageSize*args.value:4===args.unit?Math.round(viewModel.cursorConfig.pageSize/2)*args.value:args.value;const deltaLines=(1===args.direction?-1:1)*noOfLines;return viewModel.viewLayout.getCurrentScrollTop()+deltaLines*viewModel.cursorConfig.lineHeight}}CoreNavigationCommands.EditorScrollImpl=EditorScrollImpl,CoreNavigationCommands.EditorScroll=registerEditorCommand(new EditorScrollImpl),CoreNavigationCommands.ScrollLineUp=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"scrollLineUp",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:2064,mac:{primary:267}}})}runCoreEditorCommand(viewModel,args){CoreNavigationCommands.EditorScroll._runEditorScroll(viewModel,args.source,{direction:1,unit:2,value:1,revealCursor:!1,select:!1})}}),CoreNavigationCommands.ScrollPageUp=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"scrollPageUp",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:2059,win:{primary:523},linux:{primary:523}}})}runCoreEditorCommand(viewModel,args){CoreNavigationCommands.EditorScroll._runEditorScroll(viewModel,args.source,{direction:1,unit:3,value:1,revealCursor:!1,select:!1})}}),CoreNavigationCommands.ScrollLineDown=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"scrollLineDown",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:2066,mac:{primary:268}}})}runCoreEditorCommand(viewModel,args){CoreNavigationCommands.EditorScroll._runEditorScroll(viewModel,args.source,{direction:2,unit:2,value:1,revealCursor:!1,select:!1})}}),CoreNavigationCommands.ScrollPageDown=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"scrollPageDown",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:2060,win:{primary:524},linux:{primary:524}}})}runCoreEditorCommand(viewModel,args){CoreNavigationCommands.EditorScroll._runEditorScroll(viewModel,args.source,{direction:2,unit:3,value:1,revealCursor:!1,select:!1})}});class WordCommand extends CoreEditorCommand{constructor(opts){super(opts),this._inSelectionMode=opts.inSelectionMode}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,[CursorMoveCommands.word(viewModel,viewModel.getPrimaryCursorState(),this._inSelectionMode,args.position)]),viewModel.revealPrimaryCursor(args.source,!0)}}CoreNavigationCommands.WordSelect=registerEditorCommand(new WordCommand({inSelectionMode:!1,id:"_wordSelect",precondition:void 0})),CoreNavigationCommands.WordSelectDrag=registerEditorCommand(new WordCommand({inSelectionMode:!0,id:"_wordSelectDrag",precondition:void 0})),CoreNavigationCommands.LastCursorWordSelect=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"lastCursorWordSelect",precondition:void 0})}runCoreEditorCommand(viewModel,args){const lastAddedCursorIndex=viewModel.getLastAddedCursorIndex(),states=viewModel.getCursorStates(),newStates=states.slice(0),lastAddedState=states[lastAddedCursorIndex];newStates[lastAddedCursorIndex]=CursorMoveCommands.word(viewModel,lastAddedState,lastAddedState.modelState.hasSelection(),args.position),viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,newStates)}});class LineCommand extends CoreEditorCommand{constructor(opts){super(opts),this._inSelectionMode=opts.inSelectionMode}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,[CursorMoveCommands.line(viewModel,viewModel.getPrimaryCursorState(),this._inSelectionMode,args.position,args.viewPosition)]),viewModel.revealPrimaryCursor(args.source,!1)}}CoreNavigationCommands.LineSelect=registerEditorCommand(new LineCommand({inSelectionMode:!1,id:"_lineSelect",precondition:void 0})),CoreNavigationCommands.LineSelectDrag=registerEditorCommand(new LineCommand({inSelectionMode:!0,id:"_lineSelectDrag",precondition:void 0}));class LastCursorLineCommand extends CoreEditorCommand{constructor(opts){super(opts),this._inSelectionMode=opts.inSelectionMode}runCoreEditorCommand(viewModel,args){const lastAddedCursorIndex=viewModel.getLastAddedCursorIndex(),states=viewModel.getCursorStates(),newStates=states.slice(0);newStates[lastAddedCursorIndex]=CursorMoveCommands.line(viewModel,states[lastAddedCursorIndex],this._inSelectionMode,args.position,args.viewPosition),viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,newStates)}}CoreNavigationCommands.LastCursorLineSelect=registerEditorCommand(new LastCursorLineCommand({inSelectionMode:!1,id:"lastCursorLineSelect",precondition:void 0})),CoreNavigationCommands.LastCursorLineSelectDrag=registerEditorCommand(new LastCursorLineCommand({inSelectionMode:!0,id:"lastCursorLineSelectDrag",precondition:void 0})),CoreNavigationCommands.CancelSelection=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"cancelSelection",precondition:EditorContextKeys.hasNonEmptySelection,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:9,secondary:[1033]}})}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,[CursorMoveCommands.cancelSelection(viewModel,viewModel.getPrimaryCursorState())]),viewModel.revealPrimaryCursor(args.source,!0)}}),CoreNavigationCommands.RemoveSecondaryCursors=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"removeSecondaryCursors",precondition:EditorContextKeys.hasMultipleSelections,kbOpts:{weight:1,kbExpr:EditorContextKeys.textInputFocus,primary:9,secondary:[1033]}})}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,[viewModel.getPrimaryCursorState()]),viewModel.revealPrimaryCursor(args.source,!0),status(nls.localize("removedCursor","Removed secondary cursors"))}}),CoreNavigationCommands.RevealLine=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"revealLine",precondition:void 0,description:RevealLine_.description})}runCoreEditorCommand(viewModel,args){const revealLineArg=args,lineNumberArg=revealLineArg.lineNumber||0;let lineNumber="number"==typeof lineNumberArg?lineNumberArg+1:parseInt(lineNumberArg)+1;lineNumber<1&&(lineNumber=1);const lineCount=viewModel.model.getLineCount();lineNumber>lineCount&&(lineNumber=lineCount);const range=new Range(lineNumber,1,lineNumber,viewModel.model.getLineMaxColumn(lineNumber));let revealAt=0;if(revealLineArg.at)switch(revealLineArg.at){case RevealLine_.RawAtArgument.Top:revealAt=3;break;case RevealLine_.RawAtArgument.Center:revealAt=1;break;case RevealLine_.RawAtArgument.Bottom:revealAt=4}const viewRange=viewModel.coordinatesConverter.convertModelRangeToViewRange(range);viewModel.revealRange(args.source,!1,viewRange,revealAt,0)}}),CoreNavigationCommands.SelectAll=new class extends EditorOrNativeTextInputCommand{constructor(){super(SelectAllCommand)}runDOMCommand(){isFirefox&&(document.activeElement.focus(),document.activeElement.select()),document.execCommand("selectAll")}runEditorCommand(accessor,editor,args){const viewModel=editor._getViewModel();viewModel&&this.runCoreEditorCommand(viewModel,args)}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates("keyboard",3,[CursorMoveCommands.selectAll(viewModel,viewModel.getPrimaryCursorState())])}},CoreNavigationCommands.SetSelection=registerEditorCommand(new class extends CoreEditorCommand{constructor(){super({id:"setSelection",precondition:void 0})}runCoreEditorCommand(viewModel,args){viewModel.model.pushStackElement(),viewModel.setCursorStates(args.source,3,[CursorState.fromModelSelection(args.selection)])}})}(CoreNavigationCommands||(CoreNavigationCommands={}));const columnSelectionCondition=ContextKeyExpr.and(EditorContextKeys.textInputFocus,EditorContextKeys.columnSelection);function registerColumnSelection(id,keybinding){KeybindingsRegistry.registerKeybindingRule({id,primary:keybinding,when:columnSelectionCondition,weight:1})}function registerCommand(command){return command.register(),command}registerColumnSelection(CoreNavigationCommands.CursorColumnSelectLeft.id,1039),registerColumnSelection(CoreNavigationCommands.CursorColumnSelectRight.id,1041),registerColumnSelection(CoreNavigationCommands.CursorColumnSelectUp.id,1040),registerColumnSelection(CoreNavigationCommands.CursorColumnSelectPageUp.id,1035),registerColumnSelection(CoreNavigationCommands.CursorColumnSelectDown.id,1042),registerColumnSelection(CoreNavigationCommands.CursorColumnSelectPageDown.id,1036);export var CoreEditingCommands;!function(CoreEditingCommands){class CoreEditingCommand extends EditorCommand{runEditorCommand(accessor,editor,args){const viewModel=editor._getViewModel();viewModel&&this.runCoreEditingCommand(editor,viewModel,args||{})}}CoreEditingCommands.CoreEditingCommand=CoreEditingCommand,CoreEditingCommands.LineBreakInsert=registerEditorCommand(new class extends CoreEditingCommand{constructor(){super({id:"lineBreakInsert",precondition:EditorContextKeys.writable,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:0,mac:{primary:301}}})}runCoreEditingCommand(editor,viewModel,args){editor.pushUndoStop(),editor.executeCommands(this.id,TypeOperations.lineBreakInsert(viewModel.cursorConfig,viewModel.model,viewModel.getCursorStates().map((s=>s.modelState.selection))))}}),CoreEditingCommands.Outdent=registerEditorCommand(new class extends CoreEditingCommand{constructor(){super({id:"outdent",precondition:EditorContextKeys.writable,kbOpts:{weight:0,kbExpr:ContextKeyExpr.and(EditorContextKeys.editorTextFocus,EditorContextKeys.tabDoesNotMoveFocus),primary:1026}})}runCoreEditingCommand(editor,viewModel,args){editor.pushUndoStop(),editor.executeCommands(this.id,TypeOperations.outdent(viewModel.cursorConfig,viewModel.model,viewModel.getCursorStates().map((s=>s.modelState.selection)))),editor.pushUndoStop()}}),CoreEditingCommands.Tab=registerEditorCommand(new class extends CoreEditingCommand{constructor(){super({id:"tab",precondition:EditorContextKeys.writable,kbOpts:{weight:0,kbExpr:ContextKeyExpr.and(EditorContextKeys.editorTextFocus,EditorContextKeys.tabDoesNotMoveFocus),primary:2}})}runCoreEditingCommand(editor,viewModel,args){editor.pushUndoStop(),editor.executeCommands(this.id,TypeOperations.tab(viewModel.cursorConfig,viewModel.model,viewModel.getCursorStates().map((s=>s.modelState.selection)))),editor.pushUndoStop()}}),CoreEditingCommands.DeleteLeft=registerEditorCommand(new class extends CoreEditingCommand{constructor(){super({id:"deleteLeft",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:1,secondary:[1025],mac:{primary:1,secondary:[1025,294,257]}}})}runCoreEditingCommand(editor,viewModel,args){const[shouldPushStackElementBefore,commands]=DeleteOperations.deleteLeft(viewModel.getPrevEditOperationType(),viewModel.cursorConfig,viewModel.model,viewModel.getCursorStates().map((s=>s.modelState.selection)),viewModel.getCursorAutoClosedCharacters());shouldPushStackElementBefore&&editor.pushUndoStop(),editor.executeCommands(this.id,commands),viewModel.setPrevEditOperationType(2)}}),CoreEditingCommands.DeleteRight=registerEditorCommand(new class extends CoreEditingCommand{constructor(){super({id:"deleteRight",precondition:void 0,kbOpts:{weight:0,kbExpr:EditorContextKeys.textInputFocus,primary:20,mac:{primary:20,secondary:[290,276]}}})}runCoreEditingCommand(editor,viewModel,args){const[shouldPushStackElementBefore,commands]=DeleteOperations.deleteRight(viewModel.getPrevEditOperationType(),viewModel.cursorConfig,viewModel.model,viewModel.getCursorStates().map((s=>s.modelState.selection)));shouldPushStackElementBefore&&editor.pushUndoStop(),editor.executeCommands(this.id,commands),viewModel.setPrevEditOperationType(3)}}),CoreEditingCommands.Undo=new class extends EditorOrNativeTextInputCommand{constructor(){super(UndoCommand)}runDOMCommand(){document.execCommand("undo")}runEditorCommand(accessor,editor,args){if(editor.hasModel()&&!0!==editor.getOption(81))return editor.getModel().undo()}},CoreEditingCommands.Redo=new class extends EditorOrNativeTextInputCommand{constructor(){super(RedoCommand)}runDOMCommand(){document.execCommand("redo")}runEditorCommand(accessor,editor,args){if(editor.hasModel()&&!0!==editor.getOption(81))return editor.getModel().redo()}}}(CoreEditingCommands||(CoreEditingCommands={}));class EditorHandlerCommand extends Command{constructor(id,handlerId,description){super({id,precondition:void 0,description}),this._handlerId=handlerId}runCommand(accessor,args){const editor=accessor.get(ICodeEditorService).getFocusedCodeEditor();editor&&editor.trigger("keyboard",this._handlerId,args)}}function registerOverwritableCommand(handlerId,description){registerCommand(new EditorHandlerCommand("default:"+handlerId,handlerId)),registerCommand(new EditorHandlerCommand(handlerId,handlerId,description))}registerOverwritableCommand("type",{description:"Type",args:[{name:"args",schema:{type:"object",required:["text"],properties:{text:{type:"string"}}}}]}),registerOverwritableCommand("replacePreviousChar"),registerOverwritableCommand("compositionType"),registerOverwritableCommand("compositionStart"),registerOverwritableCommand("compositionEnd"),registerOverwritableCommand("paste"),registerOverwritableCommand("cut");