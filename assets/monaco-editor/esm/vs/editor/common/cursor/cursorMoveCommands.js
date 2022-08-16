import*as types from"../../../base/common/types.js";import{CursorState,SingleCursorState}from"../cursorCommon.js";import{MoveOperations}from"./cursorMoveOperations.js";import{WordOperations}from"./cursorWordOperations.js";import{Position}from"../core/position.js";import{Range}from"../core/range.js";export class CursorMoveCommands{static addCursorDown(viewModel,cursors,useLogicalLine){const result=[];let resultLen=0;for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[resultLen++]=new CursorState(cursor.modelState,cursor.viewState),result[resultLen++]=useLogicalLine?CursorState.fromModelState(MoveOperations.translateDown(viewModel.cursorConfig,viewModel.model,cursor.modelState)):CursorState.fromViewState(MoveOperations.translateDown(viewModel.cursorConfig,viewModel,cursor.viewState))}return result}static addCursorUp(viewModel,cursors,useLogicalLine){const result=[];let resultLen=0;for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[resultLen++]=new CursorState(cursor.modelState,cursor.viewState),result[resultLen++]=useLogicalLine?CursorState.fromModelState(MoveOperations.translateUp(viewModel.cursorConfig,viewModel.model,cursor.modelState)):CursorState.fromViewState(MoveOperations.translateUp(viewModel.cursorConfig,viewModel,cursor.viewState))}return result}static moveToBeginningOfLine(viewModel,cursors,inSelectionMode){let result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[i]=this._moveToLineStart(viewModel,cursor,inSelectionMode)}return result}static _moveToLineStart(viewModel,cursor,inSelectionMode){const currentViewStateColumn=cursor.viewState.position.column,isFirstLineOfWrappedLine=currentViewStateColumn===cursor.modelState.position.column,currentViewStatelineNumber=cursor.viewState.position.lineNumber,firstNonBlankColumn=viewModel.getLineFirstNonWhitespaceColumn(currentViewStatelineNumber);return isFirstLineOfWrappedLine||currentViewStateColumn===firstNonBlankColumn?this._moveToLineStartByModel(viewModel,cursor,inSelectionMode):this._moveToLineStartByView(viewModel,cursor,inSelectionMode)}static _moveToLineStartByView(viewModel,cursor,inSelectionMode){return CursorState.fromViewState(MoveOperations.moveToBeginningOfLine(viewModel.cursorConfig,viewModel,cursor.viewState,inSelectionMode))}static _moveToLineStartByModel(viewModel,cursor,inSelectionMode){return CursorState.fromModelState(MoveOperations.moveToBeginningOfLine(viewModel.cursorConfig,viewModel.model,cursor.modelState,inSelectionMode))}static moveToEndOfLine(viewModel,cursors,inSelectionMode,sticky){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[i]=this._moveToLineEnd(viewModel,cursor,inSelectionMode,sticky)}return result}static _moveToLineEnd(viewModel,cursor,inSelectionMode,sticky){const viewStatePosition=cursor.viewState.position,viewModelMaxColumn=viewModel.getLineMaxColumn(viewStatePosition.lineNumber),isEndOfViewLine=viewStatePosition.column===viewModelMaxColumn,modelStatePosition=cursor.modelState.position,modelMaxColumn=viewModel.model.getLineMaxColumn(modelStatePosition.lineNumber),isEndLineOfWrappedLine=viewModelMaxColumn-viewStatePosition.column==modelMaxColumn-modelStatePosition.column;return isEndOfViewLine||isEndLineOfWrappedLine?this._moveToLineEndByModel(viewModel,cursor,inSelectionMode,sticky):this._moveToLineEndByView(viewModel,cursor,inSelectionMode,sticky)}static _moveToLineEndByView(viewModel,cursor,inSelectionMode,sticky){return CursorState.fromViewState(MoveOperations.moveToEndOfLine(viewModel.cursorConfig,viewModel,cursor.viewState,inSelectionMode,sticky))}static _moveToLineEndByModel(viewModel,cursor,inSelectionMode,sticky){return CursorState.fromModelState(MoveOperations.moveToEndOfLine(viewModel.cursorConfig,viewModel.model,cursor.modelState,inSelectionMode,sticky))}static expandLineSelection(viewModel,cursors){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i],startLineNumber=cursor.modelState.selection.startLineNumber,lineCount=viewModel.model.getLineCount();let endColumn,endLineNumber=cursor.modelState.selection.endLineNumber;endLineNumber===lineCount?endColumn=viewModel.model.getLineMaxColumn(lineCount):(endLineNumber++,endColumn=1),result[i]=CursorState.fromModelState(new SingleCursorState(new Range(startLineNumber,1,startLineNumber,1),0,new Position(endLineNumber,endColumn),0))}return result}static moveToBeginningOfBuffer(viewModel,cursors,inSelectionMode){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[i]=CursorState.fromModelState(MoveOperations.moveToBeginningOfBuffer(viewModel.cursorConfig,viewModel.model,cursor.modelState,inSelectionMode))}return result}static moveToEndOfBuffer(viewModel,cursors,inSelectionMode){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[i]=CursorState.fromModelState(MoveOperations.moveToEndOfBuffer(viewModel.cursorConfig,viewModel.model,cursor.modelState,inSelectionMode))}return result}static selectAll(viewModel,cursor){const lineCount=viewModel.model.getLineCount(),maxColumn=viewModel.model.getLineMaxColumn(lineCount);return CursorState.fromModelState(new SingleCursorState(new Range(1,1,1,1),0,new Position(lineCount,maxColumn),0))}static line(viewModel,cursor,inSelectionMode,_position,_viewPosition){const position=viewModel.model.validatePosition(_position),viewPosition=_viewPosition?viewModel.coordinatesConverter.validateViewPosition(new Position(_viewPosition.lineNumber,_viewPosition.column),position):viewModel.coordinatesConverter.convertModelPositionToViewPosition(position);if(!inSelectionMode||!cursor.modelState.hasSelection()){const lineCount=viewModel.model.getLineCount();let selectToLineNumber=position.lineNumber+1,selectToColumn=1;return selectToLineNumber>lineCount&&(selectToLineNumber=lineCount,selectToColumn=viewModel.model.getLineMaxColumn(selectToLineNumber)),CursorState.fromModelState(new SingleCursorState(new Range(position.lineNumber,1,selectToLineNumber,selectToColumn),0,new Position(selectToLineNumber,selectToColumn),0))}const enteringLineNumber=cursor.modelState.selectionStart.getStartPosition().lineNumber;if(position.lineNumber<enteringLineNumber)return CursorState.fromViewState(cursor.viewState.move(cursor.modelState.hasSelection(),viewPosition.lineNumber,1,0));if(position.lineNumber>enteringLineNumber){const lineCount=viewModel.getLineCount();let selectToViewLineNumber=viewPosition.lineNumber+1,selectToViewColumn=1;return selectToViewLineNumber>lineCount&&(selectToViewLineNumber=lineCount,selectToViewColumn=viewModel.getLineMaxColumn(selectToViewLineNumber)),CursorState.fromViewState(cursor.viewState.move(cursor.modelState.hasSelection(),selectToViewLineNumber,selectToViewColumn,0))}{const endPositionOfSelectionStart=cursor.modelState.selectionStart.getEndPosition();return CursorState.fromModelState(cursor.modelState.move(cursor.modelState.hasSelection(),endPositionOfSelectionStart.lineNumber,endPositionOfSelectionStart.column,0))}}static word(viewModel,cursor,inSelectionMode,_position){const position=viewModel.model.validatePosition(_position);return CursorState.fromModelState(WordOperations.word(viewModel.cursorConfig,viewModel.model,cursor.modelState,inSelectionMode,position))}static cancelSelection(viewModel,cursor){if(!cursor.modelState.hasSelection())return new CursorState(cursor.modelState,cursor.viewState);const lineNumber=cursor.viewState.position.lineNumber,column=cursor.viewState.position.column;return CursorState.fromViewState(new SingleCursorState(new Range(lineNumber,column,lineNumber,column),0,new Position(lineNumber,column),0))}static moveTo(viewModel,cursor,inSelectionMode,_position,_viewPosition){const position=viewModel.model.validatePosition(_position),viewPosition=_viewPosition?viewModel.coordinatesConverter.validateViewPosition(new Position(_viewPosition.lineNumber,_viewPosition.column),position):viewModel.coordinatesConverter.convertModelPositionToViewPosition(position);return CursorState.fromViewState(cursor.viewState.move(inSelectionMode,viewPosition.lineNumber,viewPosition.column,0))}static simpleMove(viewModel,cursors,direction,inSelectionMode,value,unit){switch(direction){case 0:return 4===unit?this._moveHalfLineLeft(viewModel,cursors,inSelectionMode):this._moveLeft(viewModel,cursors,inSelectionMode,value);case 1:return 4===unit?this._moveHalfLineRight(viewModel,cursors,inSelectionMode):this._moveRight(viewModel,cursors,inSelectionMode,value);case 2:return 2===unit?this._moveUpByViewLines(viewModel,cursors,inSelectionMode,value):this._moveUpByModelLines(viewModel,cursors,inSelectionMode,value);case 3:return 2===unit?this._moveDownByViewLines(viewModel,cursors,inSelectionMode,value):this._moveDownByModelLines(viewModel,cursors,inSelectionMode,value);case 4:return 2===unit?cursors.map((cursor=>CursorState.fromViewState(MoveOperations.moveToPrevBlankLine(viewModel.cursorConfig,viewModel,cursor.viewState,inSelectionMode)))):cursors.map((cursor=>CursorState.fromModelState(MoveOperations.moveToPrevBlankLine(viewModel.cursorConfig,viewModel.model,cursor.modelState,inSelectionMode))));case 5:return 2===unit?cursors.map((cursor=>CursorState.fromViewState(MoveOperations.moveToNextBlankLine(viewModel.cursorConfig,viewModel,cursor.viewState,inSelectionMode)))):cursors.map((cursor=>CursorState.fromModelState(MoveOperations.moveToNextBlankLine(viewModel.cursorConfig,viewModel.model,cursor.modelState,inSelectionMode))));case 6:return this._moveToViewMinColumn(viewModel,cursors,inSelectionMode);case 7:return this._moveToViewFirstNonWhitespaceColumn(viewModel,cursors,inSelectionMode);case 8:return this._moveToViewCenterColumn(viewModel,cursors,inSelectionMode);case 9:return this._moveToViewMaxColumn(viewModel,cursors,inSelectionMode);case 10:return this._moveToViewLastNonWhitespaceColumn(viewModel,cursors,inSelectionMode);default:return null}}static viewportMove(viewModel,cursors,direction,inSelectionMode,value){const visibleViewRange=viewModel.getCompletelyVisibleViewRange(),visibleModelRange=viewModel.coordinatesConverter.convertViewRangeToModelRange(visibleViewRange);switch(direction){case 11:{const modelLineNumber=this._firstLineNumberInRange(viewModel.model,visibleModelRange,value),modelColumn=viewModel.model.getLineFirstNonWhitespaceColumn(modelLineNumber);return[this._moveToModelPosition(viewModel,cursors[0],inSelectionMode,modelLineNumber,modelColumn)]}case 13:{const modelLineNumber=this._lastLineNumberInRange(viewModel.model,visibleModelRange,value),modelColumn=viewModel.model.getLineFirstNonWhitespaceColumn(modelLineNumber);return[this._moveToModelPosition(viewModel,cursors[0],inSelectionMode,modelLineNumber,modelColumn)]}case 12:{const modelLineNumber=Math.round((visibleModelRange.startLineNumber+visibleModelRange.endLineNumber)/2),modelColumn=viewModel.model.getLineFirstNonWhitespaceColumn(modelLineNumber);return[this._moveToModelPosition(viewModel,cursors[0],inSelectionMode,modelLineNumber,modelColumn)]}case 14:{const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[i]=this.findPositionInViewportIfOutside(viewModel,cursor,visibleViewRange,inSelectionMode)}return result}default:return null}}static findPositionInViewportIfOutside(viewModel,cursor,visibleViewRange,inSelectionMode){const viewLineNumber=cursor.viewState.position.lineNumber;if(visibleViewRange.startLineNumber<=viewLineNumber&&viewLineNumber<=visibleViewRange.endLineNumber-1)return new CursorState(cursor.modelState,cursor.viewState);{let newViewLineNumber;newViewLineNumber=viewLineNumber>visibleViewRange.endLineNumber-1?visibleViewRange.endLineNumber-1:viewLineNumber<visibleViewRange.startLineNumber?visibleViewRange.startLineNumber:viewLineNumber;const position=MoveOperations.vertical(viewModel.cursorConfig,viewModel,viewLineNumber,cursor.viewState.position.column,cursor.viewState.leftoverVisibleColumns,newViewLineNumber,!1);return CursorState.fromViewState(cursor.viewState.move(inSelectionMode,position.lineNumber,position.column,position.leftoverVisibleColumns))}}static _firstLineNumberInRange(model,range,count){let startLineNumber=range.startLineNumber;return range.startColumn!==model.getLineMinColumn(startLineNumber)&&startLineNumber++,Math.min(range.endLineNumber,startLineNumber+count-1)}static _lastLineNumberInRange(model,range,count){let startLineNumber=range.startLineNumber;return range.startColumn!==model.getLineMinColumn(startLineNumber)&&startLineNumber++,Math.max(startLineNumber,range.endLineNumber-count+1)}static _moveLeft(viewModel,cursors,inSelectionMode,noOfColumns){return cursors.map((cursor=>CursorState.fromViewState(MoveOperations.moveLeft(viewModel.cursorConfig,viewModel,cursor.viewState,inSelectionMode,noOfColumns))))}static _moveHalfLineLeft(viewModel,cursors,inSelectionMode){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i],viewLineNumber=cursor.viewState.position.lineNumber,halfLine=Math.round(viewModel.getLineContent(viewLineNumber).length/2);result[i]=CursorState.fromViewState(MoveOperations.moveLeft(viewModel.cursorConfig,viewModel,cursor.viewState,inSelectionMode,halfLine))}return result}static _moveRight(viewModel,cursors,inSelectionMode,noOfColumns){return cursors.map((cursor=>CursorState.fromViewState(MoveOperations.moveRight(viewModel.cursorConfig,viewModel,cursor.viewState,inSelectionMode,noOfColumns))))}static _moveHalfLineRight(viewModel,cursors,inSelectionMode){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i],viewLineNumber=cursor.viewState.position.lineNumber,halfLine=Math.round(viewModel.getLineContent(viewLineNumber).length/2);result[i]=CursorState.fromViewState(MoveOperations.moveRight(viewModel.cursorConfig,viewModel,cursor.viewState,inSelectionMode,halfLine))}return result}static _moveDownByViewLines(viewModel,cursors,inSelectionMode,linesCount){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[i]=CursorState.fromViewState(MoveOperations.moveDown(viewModel.cursorConfig,viewModel,cursor.viewState,inSelectionMode,linesCount))}return result}static _moveDownByModelLines(viewModel,cursors,inSelectionMode,linesCount){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[i]=CursorState.fromModelState(MoveOperations.moveDown(viewModel.cursorConfig,viewModel.model,cursor.modelState,inSelectionMode,linesCount))}return result}static _moveUpByViewLines(viewModel,cursors,inSelectionMode,linesCount){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[i]=CursorState.fromViewState(MoveOperations.moveUp(viewModel.cursorConfig,viewModel,cursor.viewState,inSelectionMode,linesCount))}return result}static _moveUpByModelLines(viewModel,cursors,inSelectionMode,linesCount){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i];result[i]=CursorState.fromModelState(MoveOperations.moveUp(viewModel.cursorConfig,viewModel.model,cursor.modelState,inSelectionMode,linesCount))}return result}static _moveToViewPosition(viewModel,cursor,inSelectionMode,toViewLineNumber,toViewColumn){return CursorState.fromViewState(cursor.viewState.move(inSelectionMode,toViewLineNumber,toViewColumn,0))}static _moveToModelPosition(viewModel,cursor,inSelectionMode,toModelLineNumber,toModelColumn){return CursorState.fromModelState(cursor.modelState.move(inSelectionMode,toModelLineNumber,toModelColumn,0))}static _moveToViewMinColumn(viewModel,cursors,inSelectionMode){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i],viewLineNumber=cursor.viewState.position.lineNumber,viewColumn=viewModel.getLineMinColumn(viewLineNumber);result[i]=this._moveToViewPosition(viewModel,cursor,inSelectionMode,viewLineNumber,viewColumn)}return result}static _moveToViewFirstNonWhitespaceColumn(viewModel,cursors,inSelectionMode){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i],viewLineNumber=cursor.viewState.position.lineNumber,viewColumn=viewModel.getLineFirstNonWhitespaceColumn(viewLineNumber);result[i]=this._moveToViewPosition(viewModel,cursor,inSelectionMode,viewLineNumber,viewColumn)}return result}static _moveToViewCenterColumn(viewModel,cursors,inSelectionMode){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i],viewLineNumber=cursor.viewState.position.lineNumber,viewColumn=Math.round((viewModel.getLineMaxColumn(viewLineNumber)+viewModel.getLineMinColumn(viewLineNumber))/2);result[i]=this._moveToViewPosition(viewModel,cursor,inSelectionMode,viewLineNumber,viewColumn)}return result}static _moveToViewMaxColumn(viewModel,cursors,inSelectionMode){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i],viewLineNumber=cursor.viewState.position.lineNumber,viewColumn=viewModel.getLineMaxColumn(viewLineNumber);result[i]=this._moveToViewPosition(viewModel,cursor,inSelectionMode,viewLineNumber,viewColumn)}return result}static _moveToViewLastNonWhitespaceColumn(viewModel,cursors,inSelectionMode){const result=[];for(let i=0,len=cursors.length;i<len;i++){const cursor=cursors[i],viewLineNumber=cursor.viewState.position.lineNumber,viewColumn=viewModel.getLineLastNonWhitespaceColumn(viewLineNumber);result[i]=this._moveToViewPosition(viewModel,cursor,inSelectionMode,viewLineNumber,viewColumn)}return result}}export var CursorMove;!function(CursorMove){CursorMove.description={description:"Move cursor to a logical position in the view",args:[{name:"Cursor move argument object",description:"Property-value pairs that can be passed through this argument:\n\t\t\t\t\t* 'to': A mandatory logical position value providing where to move the cursor.\n\t\t\t\t\t\t```\n\t\t\t\t\t\t'left', 'right', 'up', 'down', 'prevBlankLine', 'nextBlankLine',\n\t\t\t\t\t\t'wrappedLineStart', 'wrappedLineEnd', 'wrappedLineColumnCenter'\n\t\t\t\t\t\t'wrappedLineFirstNonWhitespaceCharacter', 'wrappedLineLastNonWhitespaceCharacter'\n\t\t\t\t\t\t'viewPortTop', 'viewPortCenter', 'viewPortBottom', 'viewPortIfOutside'\n\t\t\t\t\t\t```\n\t\t\t\t\t* 'by': Unit to move. Default is computed based on 'to' value.\n\t\t\t\t\t\t```\n\t\t\t\t\t\t'line', 'wrappedLine', 'character', 'halfLine'\n\t\t\t\t\t\t```\n\t\t\t\t\t* 'value': Number of units to move. Default is '1'.\n\t\t\t\t\t* 'select': If 'true' makes the selection. Default is 'false'.\n\t\t\t\t",constraint:function(arg){if(!types.isObject(arg))return!1;const cursorMoveArg=arg;return!!types.isString(cursorMoveArg.to)&&(!(!types.isUndefined(cursorMoveArg.select)&&!types.isBoolean(cursorMoveArg.select))&&(!(!types.isUndefined(cursorMoveArg.by)&&!types.isString(cursorMoveArg.by))&&!(!types.isUndefined(cursorMoveArg.value)&&!types.isNumber(cursorMoveArg.value))))},schema:{type:"object",required:["to"],properties:{to:{type:"string",enum:["left","right","up","down","prevBlankLine","nextBlankLine","wrappedLineStart","wrappedLineEnd","wrappedLineColumnCenter","wrappedLineFirstNonWhitespaceCharacter","wrappedLineLastNonWhitespaceCharacter","viewPortTop","viewPortCenter","viewPortBottom","viewPortIfOutside"]},by:{type:"string",enum:["line","wrappedLine","character","halfLine"]},value:{type:"number",default:1},select:{type:"boolean",default:!1}}}}]},CursorMove.RawDirection={Left:"left",Right:"right",Up:"up",Down:"down",PrevBlankLine:"prevBlankLine",NextBlankLine:"nextBlankLine",WrappedLineStart:"wrappedLineStart",WrappedLineFirstNonWhitespaceCharacter:"wrappedLineFirstNonWhitespaceCharacter",WrappedLineColumnCenter:"wrappedLineColumnCenter",WrappedLineEnd:"wrappedLineEnd",WrappedLineLastNonWhitespaceCharacter:"wrappedLineLastNonWhitespaceCharacter",ViewPortTop:"viewPortTop",ViewPortCenter:"viewPortCenter",ViewPortBottom:"viewPortBottom",ViewPortIfOutside:"viewPortIfOutside"},CursorMove.RawUnit={Line:"line",WrappedLine:"wrappedLine",Character:"character",HalfLine:"halfLine"},CursorMove.parse=function parse(args){if(!args.to)return null;let direction;switch(args.to){case CursorMove.RawDirection.Left:direction=0;break;case CursorMove.RawDirection.Right:direction=1;break;case CursorMove.RawDirection.Up:direction=2;break;case CursorMove.RawDirection.Down:direction=3;break;case CursorMove.RawDirection.PrevBlankLine:direction=4;break;case CursorMove.RawDirection.NextBlankLine:direction=5;break;case CursorMove.RawDirection.WrappedLineStart:direction=6;break;case CursorMove.RawDirection.WrappedLineFirstNonWhitespaceCharacter:direction=7;break;case CursorMove.RawDirection.WrappedLineColumnCenter:direction=8;break;case CursorMove.RawDirection.WrappedLineEnd:direction=9;break;case CursorMove.RawDirection.WrappedLineLastNonWhitespaceCharacter:direction=10;break;case CursorMove.RawDirection.ViewPortTop:direction=11;break;case CursorMove.RawDirection.ViewPortBottom:direction=13;break;case CursorMove.RawDirection.ViewPortCenter:direction=12;break;case CursorMove.RawDirection.ViewPortIfOutside:direction=14;break;default:return null}let unit=0;switch(args.by){case CursorMove.RawUnit.Line:unit=1;break;case CursorMove.RawUnit.WrappedLine:unit=2;break;case CursorMove.RawUnit.Character:unit=3;break;case CursorMove.RawUnit.HalfLine:unit=4}return{direction,unit,select:!!args.select,value:args.value||1}}}(CursorMove||(CursorMove={}));