import*as strings from"../../../../base/common/strings.js";import{EditOperation}from"../../../common/core/editOperation.js";import{Position}from"../../../common/core/position.js";import{Range}from"../../../common/core/range.js";import{Selection}from"../../../common/core/selection.js";import{LanguageConfigurationRegistry}from"../../../common/languages/languageConfigurationRegistry.js";import{BlockCommentCommand}from"./blockCommentCommand.js";export class LineCommentCommand{constructor(languageConfigurationService,selection,tabSize,type,insertSpace,ignoreEmptyLines,ignoreFirstLine){this.languageConfigurationService=languageConfigurationService,this._selection=selection,this._tabSize=tabSize,this._type=type,this._insertSpace=insertSpace,this._selectionId=null,this._deltaColumn=0,this._moveEndPositionDown=!1,this._ignoreEmptyLines=ignoreEmptyLines,this._ignoreFirstLine=ignoreFirstLine||!1}static _gatherPreflightCommentStrings(model,startLineNumber,endLineNumber,languageConfigurationService){model.tokenizeIfCheap(startLineNumber);const languageId=model.getLanguageIdAtPosition(startLineNumber,1),config=languageConfigurationService.getLanguageConfiguration(languageId).comments,commentStr=config?config.lineCommentToken:null;if(!commentStr)return null;let lines=[];for(let i=0,lineCount=endLineNumber-startLineNumber+1;i<lineCount;i++)lines[i]={ignore:!1,commentStr,commentStrOffset:0,commentStrLength:commentStr.length};return lines}static _analyzeLines(type,insertSpace,model,lines,startLineNumber,ignoreEmptyLines,ignoreFirstLine,languageConfigurationService){let shouldRemoveComments,onlyWhitespaceLines=!0;shouldRemoveComments=0===type||1!==type;for(let i=0,lineCount=lines.length;i<lineCount;i++){const lineData=lines[i],lineNumber=startLineNumber+i;if(lineNumber===startLineNumber&&ignoreFirstLine){lineData.ignore=!0;continue}const lineContent=model.getLineContent(lineNumber),lineContentStartOffset=strings.firstNonWhitespaceIndex(lineContent);if(-1!==lineContentStartOffset){if(onlyWhitespaceLines=!1,lineData.ignore=!1,lineData.commentStrOffset=lineContentStartOffset,shouldRemoveComments&&!BlockCommentCommand._haystackHasNeedleAtOffset(lineContent,lineData.commentStr,lineContentStartOffset)&&(0===type?shouldRemoveComments=!1:1===type||(lineData.ignore=!0)),shouldRemoveComments&&insertSpace){const commentStrEndOffset=lineContentStartOffset+lineData.commentStrLength;commentStrEndOffset<lineContent.length&&32===lineContent.charCodeAt(commentStrEndOffset)&&(lineData.commentStrLength+=1)}}else lineData.ignore=ignoreEmptyLines,lineData.commentStrOffset=lineContent.length}if(0===type&&onlyWhitespaceLines){shouldRemoveComments=!1;for(let i=0,lineCount=lines.length;i<lineCount;i++)lines[i].ignore=!1}return{supported:!0,shouldRemoveComments,lines}}static _gatherPreflightData(type,insertSpace,model,startLineNumber,endLineNumber,ignoreEmptyLines,ignoreFirstLine,languageConfigurationService){const lines=LineCommentCommand._gatherPreflightCommentStrings(model,startLineNumber,endLineNumber,languageConfigurationService);return null===lines?{supported:!1}:LineCommentCommand._analyzeLines(type,insertSpace,model,lines,startLineNumber,ignoreEmptyLines,ignoreFirstLine,languageConfigurationService)}_executeLineComments(model,builder,data,s){let ops;data.shouldRemoveComments?ops=LineCommentCommand._createRemoveLineCommentsOperations(data.lines,s.startLineNumber):(LineCommentCommand._normalizeInsertionPoint(model,data.lines,s.startLineNumber,this._tabSize),ops=this._createAddLineCommentsOperations(data.lines,s.startLineNumber));const cursorPosition=new Position(s.positionLineNumber,s.positionColumn);for(let i=0,len=ops.length;i<len;i++)if(builder.addEditOperation(ops[i].range,ops[i].text),Range.isEmpty(ops[i].range)&&Range.getStartPosition(ops[i].range).equals(cursorPosition)){model.getLineContent(cursorPosition.lineNumber).length+1===cursorPosition.column&&(this._deltaColumn=(ops[i].text||"").length)}this._selectionId=builder.trackSelection(s)}_attemptRemoveBlockComment(model,s,startToken,endToken){let startLineNumber=s.startLineNumber,endLineNumber=s.endLineNumber,startTokenAllowedBeforeColumn=endToken.length+Math.max(model.getLineFirstNonWhitespaceColumn(s.startLineNumber),s.startColumn),startTokenIndex=model.getLineContent(startLineNumber).lastIndexOf(startToken,startTokenAllowedBeforeColumn-1),endTokenIndex=model.getLineContent(endLineNumber).indexOf(endToken,s.endColumn-1-startToken.length);return-1!==startTokenIndex&&-1===endTokenIndex&&(endTokenIndex=model.getLineContent(startLineNumber).indexOf(endToken,startTokenIndex+startToken.length),endLineNumber=startLineNumber),-1===startTokenIndex&&-1!==endTokenIndex&&(startTokenIndex=model.getLineContent(endLineNumber).lastIndexOf(startToken,endTokenIndex),startLineNumber=endLineNumber),!s.isEmpty()||-1!==startTokenIndex&&-1!==endTokenIndex||(startTokenIndex=model.getLineContent(startLineNumber).indexOf(startToken),-1!==startTokenIndex&&(endTokenIndex=model.getLineContent(startLineNumber).indexOf(endToken,startTokenIndex+startToken.length))),-1!==startTokenIndex&&32===model.getLineContent(startLineNumber).charCodeAt(startTokenIndex+startToken.length)&&(startToken+=" "),-1!==endTokenIndex&&32===model.getLineContent(endLineNumber).charCodeAt(endTokenIndex-1)&&(endToken=" "+endToken,endTokenIndex-=1),-1!==startTokenIndex&&-1!==endTokenIndex?BlockCommentCommand._createRemoveBlockCommentOperations(new Range(startLineNumber,startTokenIndex+startToken.length+1,endLineNumber,endTokenIndex+1),startToken,endToken):null}_executeBlockComment(model,builder,s){model.tokenizeIfCheap(s.startLineNumber);let languageId=model.getLanguageIdAtPosition(s.startLineNumber,1),config=LanguageConfigurationRegistry.getComments(languageId);if(!config||!config.blockCommentStartToken||!config.blockCommentEndToken)return;const startToken=config.blockCommentStartToken,endToken=config.blockCommentEndToken;let ops=this._attemptRemoveBlockComment(model,s,startToken,endToken);if(!ops){if(s.isEmpty()){const lineContent=model.getLineContent(s.startLineNumber);let firstNonWhitespaceIndex=strings.firstNonWhitespaceIndex(lineContent);-1===firstNonWhitespaceIndex&&(firstNonWhitespaceIndex=lineContent.length),ops=BlockCommentCommand._createAddBlockCommentOperations(new Range(s.startLineNumber,firstNonWhitespaceIndex+1,s.startLineNumber,lineContent.length+1),startToken,endToken,this._insertSpace)}else ops=BlockCommentCommand._createAddBlockCommentOperations(new Range(s.startLineNumber,model.getLineFirstNonWhitespaceColumn(s.startLineNumber),s.endLineNumber,model.getLineMaxColumn(s.endLineNumber)),startToken,endToken,this._insertSpace);1===ops.length&&(this._deltaColumn=startToken.length+1)}this._selectionId=builder.trackSelection(s);for(const op of ops)builder.addEditOperation(op.range,op.text)}getEditOperations(model,builder){let s=this._selection;if(this._moveEndPositionDown=!1,s.startLineNumber===s.endLineNumber&&this._ignoreFirstLine)return builder.addEditOperation(new Range(s.startLineNumber,model.getLineMaxColumn(s.startLineNumber),s.startLineNumber+1,1),s.startLineNumber===model.getLineCount()?"":"\n"),void(this._selectionId=builder.trackSelection(s));s.startLineNumber<s.endLineNumber&&1===s.endColumn&&(this._moveEndPositionDown=!0,s=s.setEndPosition(s.endLineNumber-1,model.getLineMaxColumn(s.endLineNumber-1)));const data=LineCommentCommand._gatherPreflightData(this._type,this._insertSpace,model,s.startLineNumber,s.endLineNumber,this._ignoreEmptyLines,this._ignoreFirstLine,this.languageConfigurationService);return data.supported?this._executeLineComments(model,builder,data,s):this._executeBlockComment(model,builder,s)}computeCursorState(model,helper){let result=helper.getTrackedSelection(this._selectionId);return this._moveEndPositionDown&&(result=result.setEndPosition(result.endLineNumber+1,1)),new Selection(result.selectionStartLineNumber,result.selectionStartColumn+this._deltaColumn,result.positionLineNumber,result.positionColumn+this._deltaColumn)}static _createRemoveLineCommentsOperations(lines,startLineNumber){let res=[];for(let i=0,len=lines.length;i<len;i++){const lineData=lines[i];lineData.ignore||res.push(EditOperation.delete(new Range(startLineNumber+i,lineData.commentStrOffset+1,startLineNumber+i,lineData.commentStrOffset+lineData.commentStrLength+1)))}return res}_createAddLineCommentsOperations(lines,startLineNumber){let res=[];const afterCommentStr=this._insertSpace?" ":"";for(let i=0,len=lines.length;i<len;i++){const lineData=lines[i];lineData.ignore||res.push(EditOperation.insert(new Position(startLineNumber+i,lineData.commentStrOffset+1),lineData.commentStr+afterCommentStr))}return res}static nextVisibleColumn(currentVisibleColumn,tabSize,isTab,columnSize){return isTab?currentVisibleColumn+(tabSize-currentVisibleColumn%tabSize):currentVisibleColumn+columnSize}static _normalizeInsertionPoint(model,lines,startLineNumber,tabSize){let j,lenJ,minVisibleColumn=1073741824;for(let i=0,len=lines.length;i<len;i++){if(lines[i].ignore)continue;const lineContent=model.getLineContent(startLineNumber+i);let currentVisibleColumn=0;for(let j=0,lenJ=lines[i].commentStrOffset;currentVisibleColumn<minVisibleColumn&&j<lenJ;j++)currentVisibleColumn=LineCommentCommand.nextVisibleColumn(currentVisibleColumn,tabSize,9===lineContent.charCodeAt(j),1);currentVisibleColumn<minVisibleColumn&&(minVisibleColumn=currentVisibleColumn)}minVisibleColumn=Math.floor(minVisibleColumn/tabSize)*tabSize;for(let i=0,len=lines.length;i<len;i++){if(lines[i].ignore)continue;const lineContent=model.getLineContent(startLineNumber+i);let currentVisibleColumn=0;for(j=0,lenJ=lines[i].commentStrOffset;currentVisibleColumn<minVisibleColumn&&j<lenJ;j++)currentVisibleColumn=LineCommentCommand.nextVisibleColumn(currentVisibleColumn,tabSize,9===lineContent.charCodeAt(j),1);lines[i].commentStrOffset=currentVisibleColumn>minVisibleColumn?j-1:j}}}