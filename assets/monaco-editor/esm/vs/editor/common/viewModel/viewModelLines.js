import*as arrays from"../../../base/common/arrays.js";import{Position}from"../core/position.js";import{Range}from"../core/range.js";import{IndentGuide,IndentGuideHorizontalLine}from"../textModelGuides.js";import{ModelDecorationOptions}from"../model/textModel.js";import{LineInjectedText}from"../textModelEvents.js";import*as viewEvents from"../viewEvents.js";import{createModelLineProjection}from"./modelLineProjection.js";import{ConstantTimePrefixSumComputer}from"../model/prefixSumComputer.js";import{ViewLineData}from"../viewModel.js";export class ViewModelLinesFromProjectedModel{constructor(editorId,model,domLineBreaksComputerFactory,monospaceLineBreaksComputerFactory,fontInfo,tabSize,wrappingStrategy,wrappingColumn,wrappingIndent){this._editorId=editorId,this.model=model,this._validModelVersionId=-1,this._domLineBreaksComputerFactory=domLineBreaksComputerFactory,this._monospaceLineBreaksComputerFactory=monospaceLineBreaksComputerFactory,this.fontInfo=fontInfo,this.tabSize=tabSize,this.wrappingStrategy=wrappingStrategy,this.wrappingColumn=wrappingColumn,this.wrappingIndent=wrappingIndent,this._constructLines(!0,null)}dispose(){this.hiddenAreasDecorationIds=this.model.deltaDecorations(this.hiddenAreasDecorationIds,[])}createCoordinatesConverter(){return new CoordinatesConverter(this)}_constructLines(resetHiddenAreas,previousLineBreaks){this.modelLineProjections=[],resetHiddenAreas&&(this.hiddenAreasDecorationIds=this.model.deltaDecorations(this.hiddenAreasDecorationIds,[]));const linesContent=this.model.getLinesContent(),injectedTextDecorations=this.model.getInjectedTextDecorations(this._editorId),lineCount=linesContent.length,lineBreaksComputer=this.createLineBreaksComputer(),injectedTextQueue=new arrays.ArrayQueue(LineInjectedText.fromDecorations(injectedTextDecorations));for(let i=0;i<lineCount;i++){const lineInjectedText=injectedTextQueue.takeWhile((t=>t.lineNumber===i+1));lineBreaksComputer.addRequest(linesContent[i],lineInjectedText,previousLineBreaks?previousLineBreaks[i]:null)}const linesBreaks=lineBreaksComputer.finalize(),values=[],hiddenAreas=this.hiddenAreasDecorationIds.map((areaId=>this.model.getDecorationRange(areaId))).sort(Range.compareRangesUsingStarts);let hiddenAreaStart=1,hiddenAreaEnd=0,hiddenAreaIdx=-1,nextLineNumberToUpdateHiddenArea=hiddenAreaIdx+1<hiddenAreas.length?hiddenAreaEnd+1:lineCount+2;for(let i=0;i<lineCount;i++){const lineNumber=i+1;lineNumber===nextLineNumberToUpdateHiddenArea&&(hiddenAreaIdx++,hiddenAreaStart=hiddenAreas[hiddenAreaIdx].startLineNumber,hiddenAreaEnd=hiddenAreas[hiddenAreaIdx].endLineNumber,nextLineNumberToUpdateHiddenArea=hiddenAreaIdx+1<hiddenAreas.length?hiddenAreaEnd+1:lineCount+2);const isInHiddenArea=lineNumber>=hiddenAreaStart&&lineNumber<=hiddenAreaEnd,line=createModelLineProjection(linesBreaks[i],!isInHiddenArea);values[i]=line.getViewLineCount(),this.modelLineProjections[i]=line}this._validModelVersionId=this.model.getVersionId(),this.projectedModelLineLineCounts=new ConstantTimePrefixSumComputer(values)}getHiddenAreas(){return this.hiddenAreasDecorationIds.map((decId=>this.model.getDecorationRange(decId)))}setHiddenAreas(_ranges){const newRanges=normalizeLineRanges(_ranges.map((r=>this.model.validateRange(r)))),oldRanges=this.hiddenAreasDecorationIds.map((areaId=>this.model.getDecorationRange(areaId))).sort(Range.compareRangesUsingStarts);if(newRanges.length===oldRanges.length){let hasDifference=!1;for(let i=0;i<newRanges.length;i++)if(!newRanges[i].equalsRange(oldRanges[i])){hasDifference=!0;break}if(!hasDifference)return!1}const newDecorations=newRanges.map((r=>({range:r,options:ModelDecorationOptions.EMPTY})));this.hiddenAreasDecorationIds=this.model.deltaDecorations(this.hiddenAreasDecorationIds,newDecorations);const hiddenAreas=newRanges;let hiddenAreaStart=1,hiddenAreaEnd=0,hiddenAreaIdx=-1,nextLineNumberToUpdateHiddenArea=hiddenAreaIdx+1<hiddenAreas.length?hiddenAreaEnd+1:this.modelLineProjections.length+2,hasVisibleLine=!1;for(let i=0;i<this.modelLineProjections.length;i++){const lineNumber=i+1;lineNumber===nextLineNumberToUpdateHiddenArea&&(hiddenAreaIdx++,hiddenAreaStart=hiddenAreas[hiddenAreaIdx].startLineNumber,hiddenAreaEnd=hiddenAreas[hiddenAreaIdx].endLineNumber,nextLineNumberToUpdateHiddenArea=hiddenAreaIdx+1<hiddenAreas.length?hiddenAreaEnd+1:this.modelLineProjections.length+2);let lineChanged=!1;if(lineNumber>=hiddenAreaStart&&lineNumber<=hiddenAreaEnd?this.modelLineProjections[i].isVisible()&&(this.modelLineProjections[i]=this.modelLineProjections[i].setVisible(!1),lineChanged=!0):(hasVisibleLine=!0,this.modelLineProjections[i].isVisible()||(this.modelLineProjections[i]=this.modelLineProjections[i].setVisible(!0),lineChanged=!0)),lineChanged){const newOutputLineCount=this.modelLineProjections[i].getViewLineCount();this.projectedModelLineLineCounts.setValue(i,newOutputLineCount)}}return hasVisibleLine||this.setHiddenAreas([]),!0}modelPositionIsVisible(modelLineNumber,_modelColumn){return!(modelLineNumber<1||modelLineNumber>this.modelLineProjections.length)&&this.modelLineProjections[modelLineNumber-1].isVisible()}getModelLineViewLineCount(modelLineNumber){return modelLineNumber<1||modelLineNumber>this.modelLineProjections.length?1:this.modelLineProjections[modelLineNumber-1].getViewLineCount()}setTabSize(newTabSize){return this.tabSize!==newTabSize&&(this.tabSize=newTabSize,this._constructLines(!1,null),!0)}setWrappingSettings(fontInfo,wrappingStrategy,wrappingColumn,wrappingIndent){const equalFontInfo=this.fontInfo.equals(fontInfo),equalWrappingStrategy=this.wrappingStrategy===wrappingStrategy,equalWrappingColumn=this.wrappingColumn===wrappingColumn,equalWrappingIndent=this.wrappingIndent===wrappingIndent;if(equalFontInfo&&equalWrappingStrategy&&equalWrappingColumn&&equalWrappingIndent)return!1;const onlyWrappingColumnChanged=equalFontInfo&&equalWrappingStrategy&&!equalWrappingColumn&&equalWrappingIndent;this.fontInfo=fontInfo,this.wrappingStrategy=wrappingStrategy,this.wrappingColumn=wrappingColumn,this.wrappingIndent=wrappingIndent;let previousLineBreaks=null;if(onlyWrappingColumnChanged){previousLineBreaks=[];for(let i=0,len=this.modelLineProjections.length;i<len;i++)previousLineBreaks[i]=this.modelLineProjections[i].getProjectionData()}return this._constructLines(!1,previousLineBreaks),!0}createLineBreaksComputer(){return("advanced"===this.wrappingStrategy?this._domLineBreaksComputerFactory:this._monospaceLineBreaksComputerFactory).createLineBreaksComputer(this.fontInfo,this.tabSize,this.wrappingColumn,this.wrappingIndent)}onModelFlushed(){this._constructLines(!0,null)}onModelLinesDeleted(versionId,fromLineNumber,toLineNumber){if(!versionId||versionId<=this._validModelVersionId)return null;const outputFromLineNumber=1===fromLineNumber?1:this.projectedModelLineLineCounts.getPrefixSum(fromLineNumber-1)+1,outputToLineNumber=this.projectedModelLineLineCounts.getPrefixSum(toLineNumber);return this.modelLineProjections.splice(fromLineNumber-1,toLineNumber-fromLineNumber+1),this.projectedModelLineLineCounts.removeValues(fromLineNumber-1,toLineNumber-fromLineNumber+1),new viewEvents.ViewLinesDeletedEvent(outputFromLineNumber,outputToLineNumber)}onModelLinesInserted(versionId,fromLineNumber,_toLineNumber,lineBreaks){if(!versionId||versionId<=this._validModelVersionId)return null;const isInHiddenArea=fromLineNumber>2&&!this.modelLineProjections[fromLineNumber-2].isVisible(),outputFromLineNumber=1===fromLineNumber?1:this.projectedModelLineLineCounts.getPrefixSum(fromLineNumber-1)+1;let totalOutputLineCount=0;const insertLines=[],insertPrefixSumValues=[];for(let i=0,len=lineBreaks.length;i<len;i++){const line=createModelLineProjection(lineBreaks[i],!isInHiddenArea);insertLines.push(line);const outputLineCount=line.getViewLineCount();totalOutputLineCount+=outputLineCount,insertPrefixSumValues[i]=outputLineCount}return this.modelLineProjections=this.modelLineProjections.slice(0,fromLineNumber-1).concat(insertLines).concat(this.modelLineProjections.slice(fromLineNumber-1)),this.projectedModelLineLineCounts.insertValues(fromLineNumber-1,insertPrefixSumValues),new viewEvents.ViewLinesInsertedEvent(outputFromLineNumber,outputFromLineNumber+totalOutputLineCount-1)}onModelLineChanged(versionId,lineNumber,lineBreakData){if(null!==versionId&&versionId<=this._validModelVersionId)return[!1,null,null,null];const lineIndex=lineNumber-1,oldOutputLineCount=this.modelLineProjections[lineIndex].getViewLineCount(),isVisible=this.modelLineProjections[lineIndex].isVisible(),line=createModelLineProjection(lineBreakData,isVisible);this.modelLineProjections[lineIndex]=line;const newOutputLineCount=this.modelLineProjections[lineIndex].getViewLineCount();let lineMappingChanged=!1,changeFrom=0,changeTo=-1,insertFrom=0,insertTo=-1,deleteFrom=0,deleteTo=-1;oldOutputLineCount>newOutputLineCount?(changeFrom=this.projectedModelLineLineCounts.getPrefixSum(lineNumber-1)+1,changeTo=changeFrom+newOutputLineCount-1,deleteFrom=changeTo+1,deleteTo=deleteFrom+(oldOutputLineCount-newOutputLineCount)-1,lineMappingChanged=!0):oldOutputLineCount<newOutputLineCount?(changeFrom=this.projectedModelLineLineCounts.getPrefixSum(lineNumber-1)+1,changeTo=changeFrom+oldOutputLineCount-1,insertFrom=changeTo+1,insertTo=insertFrom+(newOutputLineCount-oldOutputLineCount)-1,lineMappingChanged=!0):(changeFrom=this.projectedModelLineLineCounts.getPrefixSum(lineNumber-1)+1,changeTo=changeFrom+newOutputLineCount-1),this.projectedModelLineLineCounts.setValue(lineIndex,newOutputLineCount);return[lineMappingChanged,changeFrom<=changeTo?new viewEvents.ViewLinesChangedEvent(changeFrom,changeTo):null,insertFrom<=insertTo?new viewEvents.ViewLinesInsertedEvent(insertFrom,insertTo):null,deleteFrom<=deleteTo?new viewEvents.ViewLinesDeletedEvent(deleteFrom,deleteTo):null]}acceptVersionId(versionId){this._validModelVersionId=versionId,1!==this.modelLineProjections.length||this.modelLineProjections[0].isVisible()||this.setHiddenAreas([])}getViewLineCount(){return this.projectedModelLineLineCounts.getTotalSum()}_toValidViewLineNumber(viewLineNumber){if(viewLineNumber<1)return 1;const viewLineCount=this.getViewLineCount();return viewLineNumber>viewLineCount?viewLineCount:0|viewLineNumber}getActiveIndentGuide(viewLineNumber,minLineNumber,maxLineNumber){viewLineNumber=this._toValidViewLineNumber(viewLineNumber),minLineNumber=this._toValidViewLineNumber(minLineNumber),maxLineNumber=this._toValidViewLineNumber(maxLineNumber);const modelPosition=this.convertViewPositionToModelPosition(viewLineNumber,this.getViewLineMinColumn(viewLineNumber)),modelMinPosition=this.convertViewPositionToModelPosition(minLineNumber,this.getViewLineMinColumn(minLineNumber)),modelMaxPosition=this.convertViewPositionToModelPosition(maxLineNumber,this.getViewLineMinColumn(maxLineNumber)),result=this.model.guides.getActiveIndentGuide(modelPosition.lineNumber,modelMinPosition.lineNumber,modelMaxPosition.lineNumber),viewStartPosition=this.convertModelPositionToViewPosition(result.startLineNumber,1),viewEndPosition=this.convertModelPositionToViewPosition(result.endLineNumber,this.model.getLineMaxColumn(result.endLineNumber));return{startLineNumber:viewStartPosition.lineNumber,endLineNumber:viewEndPosition.lineNumber,indent:result.indent}}getViewLineInfo(viewLineNumber){viewLineNumber=this._toValidViewLineNumber(viewLineNumber);const r=this.projectedModelLineLineCounts.getIndexOf(viewLineNumber-1),lineIndex=r.index,remainder=r.remainder;return new ViewLineInfo(lineIndex+1,remainder)}getMinColumnOfViewLine(viewLineInfo){return this.modelLineProjections[viewLineInfo.modelLineNumber-1].getViewLineMinColumn(this.model,viewLineInfo.modelLineNumber,viewLineInfo.modelLineWrappedLineIdx)}getModelStartPositionOfViewLine(viewLineInfo){const line=this.modelLineProjections[viewLineInfo.modelLineNumber-1],minViewColumn=line.getViewLineMinColumn(this.model,viewLineInfo.modelLineNumber,viewLineInfo.modelLineWrappedLineIdx),column=line.getModelColumnOfViewPosition(viewLineInfo.modelLineWrappedLineIdx,minViewColumn);return new Position(viewLineInfo.modelLineNumber,column)}getModelEndPositionOfViewLine(viewLineInfo){const line=this.modelLineProjections[viewLineInfo.modelLineNumber-1],maxViewColumn=line.getViewLineMaxColumn(this.model,viewLineInfo.modelLineNumber,viewLineInfo.modelLineWrappedLineIdx),column=line.getModelColumnOfViewPosition(viewLineInfo.modelLineWrappedLineIdx,maxViewColumn);return new Position(viewLineInfo.modelLineNumber,column)}getViewLineInfosGroupedByModelRanges(viewStartLineNumber,viewEndLineNumber){const startViewLine=this.getViewLineInfo(viewStartLineNumber),endViewLine=this.getViewLineInfo(viewEndLineNumber),result=new Array;let lastVisibleModelPos=this.getModelStartPositionOfViewLine(startViewLine),viewLines=new Array;for(let curModelLine=startViewLine.modelLineNumber;curModelLine<=endViewLine.modelLineNumber;curModelLine++){const line=this.modelLineProjections[curModelLine-1];if(line.isVisible()){const startOffset=curModelLine===startViewLine.modelLineNumber?startViewLine.modelLineWrappedLineIdx:0,endOffset=curModelLine===endViewLine.modelLineNumber?endViewLine.modelLineWrappedLineIdx+1:line.getViewLineCount();for(let i=startOffset;i<endOffset;i++)viewLines.push(new ViewLineInfo(curModelLine,i))}if(!line.isVisible()&&lastVisibleModelPos){const lastVisibleModelPos2=new Position(curModelLine-1,this.model.getLineMaxColumn(curModelLine-1)+1),modelRange=Range.fromPositions(lastVisibleModelPos,lastVisibleModelPos2);result.push(new ViewLineInfoGroupedByModelRange(modelRange,viewLines)),viewLines=[],lastVisibleModelPos=null}else line.isVisible()&&!lastVisibleModelPos&&(lastVisibleModelPos=new Position(curModelLine,1))}if(lastVisibleModelPos){const modelRange=Range.fromPositions(lastVisibleModelPos,this.getModelEndPositionOfViewLine(endViewLine));result.push(new ViewLineInfoGroupedByModelRange(modelRange,viewLines))}return result}getViewLinesBracketGuides(viewStartLineNumber,viewEndLineNumber,activeViewPosition,options){const modelActivePosition=activeViewPosition?this.convertViewPositionToModelPosition(activeViewPosition.lineNumber,activeViewPosition.column):null,resultPerViewLine=[];for(const group of this.getViewLineInfosGroupedByModelRanges(viewStartLineNumber,viewEndLineNumber)){const modelRangeStartLineNumber=group.modelRange.startLineNumber,bracketGuidesPerModelLine=this.model.guides.getLinesBracketGuides(modelRangeStartLineNumber,group.modelRange.endLineNumber,modelActivePosition,options);for(const viewLineInfo of group.viewLines)if(viewLineInfo.isWrappedLineContinuation&&1===this.getMinColumnOfViewLine(viewLineInfo))resultPerViewLine.push([]);else{let bracketGuides=bracketGuidesPerModelLine[viewLineInfo.modelLineNumber-modelRangeStartLineNumber];bracketGuides=bracketGuides.map((g=>g.horizontalLine?new IndentGuide(g.visibleColumn,g.className,new IndentGuideHorizontalLine(g.horizontalLine.top,this.convertModelPositionToViewPosition(viewLineInfo.modelLineNumber,g.horizontalLine.endColumn).column)):g)),resultPerViewLine.push(bracketGuides)}}return resultPerViewLine}getViewLinesIndentGuides(viewStartLineNumber,viewEndLineNumber){viewStartLineNumber=this._toValidViewLineNumber(viewStartLineNumber),viewEndLineNumber=this._toValidViewLineNumber(viewEndLineNumber);const modelStart=this.convertViewPositionToModelPosition(viewStartLineNumber,this.getViewLineMinColumn(viewStartLineNumber)),modelEnd=this.convertViewPositionToModelPosition(viewEndLineNumber,this.getViewLineMaxColumn(viewEndLineNumber));let result=[];const resultRepeatCount=[],resultRepeatOption=[],modelStartLineIndex=modelStart.lineNumber-1,modelEndLineIndex=modelEnd.lineNumber-1;let reqStart=null;for(let modelLineIndex=modelStartLineIndex;modelLineIndex<=modelEndLineIndex;modelLineIndex++){const line=this.modelLineProjections[modelLineIndex];if(line.isVisible()){const viewLineStartIndex=line.getViewLineNumberOfModelPosition(0,modelLineIndex===modelStartLineIndex?modelStart.column:1),viewLineEndIndex=line.getViewLineNumberOfModelPosition(0,this.model.getLineMaxColumn(modelLineIndex+1)),count=viewLineEndIndex-viewLineStartIndex+1;let option=0;count>1&&1===line.getViewLineMinColumn(this.model,modelLineIndex+1,viewLineEndIndex)&&(option=0===viewLineStartIndex?1:2),resultRepeatCount.push(count),resultRepeatOption.push(option),null===reqStart&&(reqStart=new Position(modelLineIndex+1,0))}else null!==reqStart&&(result=result.concat(this.model.guides.getLinesIndentGuides(reqStart.lineNumber,modelLineIndex)),reqStart=null)}null!==reqStart&&(result=result.concat(this.model.guides.getLinesIndentGuides(reqStart.lineNumber,modelEnd.lineNumber)),reqStart=null);const viewLineCount=viewEndLineNumber-viewStartLineNumber+1,viewIndents=new Array(viewLineCount);let currIndex=0;for(let i=0,len=result.length;i<len;i++){let value=result[i];const count=Math.min(viewLineCount-currIndex,resultRepeatCount[i]),option=resultRepeatOption[i];let blockAtIndex;blockAtIndex=2===option?0:1===option?1:count;for(let j=0;j<count;j++)j===blockAtIndex&&(value=0),viewIndents[currIndex++]=value}return viewIndents}getViewLineContent(viewLineNumber){const info=this.getViewLineInfo(viewLineNumber);return this.modelLineProjections[info.modelLineNumber-1].getViewLineContent(this.model,info.modelLineNumber,info.modelLineWrappedLineIdx)}getViewLineLength(viewLineNumber){const info=this.getViewLineInfo(viewLineNumber);return this.modelLineProjections[info.modelLineNumber-1].getViewLineLength(this.model,info.modelLineNumber,info.modelLineWrappedLineIdx)}getViewLineMinColumn(viewLineNumber){const info=this.getViewLineInfo(viewLineNumber);return this.modelLineProjections[info.modelLineNumber-1].getViewLineMinColumn(this.model,info.modelLineNumber,info.modelLineWrappedLineIdx)}getViewLineMaxColumn(viewLineNumber){const info=this.getViewLineInfo(viewLineNumber);return this.modelLineProjections[info.modelLineNumber-1].getViewLineMaxColumn(this.model,info.modelLineNumber,info.modelLineWrappedLineIdx)}getViewLineData(viewLineNumber){const info=this.getViewLineInfo(viewLineNumber);return this.modelLineProjections[info.modelLineNumber-1].getViewLineData(this.model,info.modelLineNumber,info.modelLineWrappedLineIdx)}getViewLinesData(viewStartLineNumber,viewEndLineNumber,needed){viewStartLineNumber=this._toValidViewLineNumber(viewStartLineNumber),viewEndLineNumber=this._toValidViewLineNumber(viewEndLineNumber);const start=this.projectedModelLineLineCounts.getIndexOf(viewStartLineNumber-1);let viewLineNumber=viewStartLineNumber;const startModelLineIndex=start.index,startRemainder=start.remainder,result=[];for(let modelLineIndex=startModelLineIndex,len=this.model.getLineCount();modelLineIndex<len;modelLineIndex++){const line=this.modelLineProjections[modelLineIndex];if(!line.isVisible())continue;const fromViewLineIndex=modelLineIndex===startModelLineIndex?startRemainder:0;let remainingViewLineCount=line.getViewLineCount()-fromViewLineIndex,lastLine=!1;if(viewLineNumber+remainingViewLineCount>viewEndLineNumber&&(lastLine=!0,remainingViewLineCount=viewEndLineNumber-viewLineNumber+1),line.getViewLinesData(this.model,modelLineIndex+1,fromViewLineIndex,remainingViewLineCount,viewLineNumber-viewStartLineNumber,needed,result),viewLineNumber+=remainingViewLineCount,lastLine)break}return result}validateViewPosition(viewLineNumber,viewColumn,expectedModelPosition){viewLineNumber=this._toValidViewLineNumber(viewLineNumber);const r=this.projectedModelLineLineCounts.getIndexOf(viewLineNumber-1),lineIndex=r.index,remainder=r.remainder,line=this.modelLineProjections[lineIndex],minColumn=line.getViewLineMinColumn(this.model,lineIndex+1,remainder),maxColumn=line.getViewLineMaxColumn(this.model,lineIndex+1,remainder);viewColumn<minColumn&&(viewColumn=minColumn),viewColumn>maxColumn&&(viewColumn=maxColumn);const computedModelColumn=line.getModelColumnOfViewPosition(remainder,viewColumn);return this.model.validatePosition(new Position(lineIndex+1,computedModelColumn)).equals(expectedModelPosition)?new Position(viewLineNumber,viewColumn):this.convertModelPositionToViewPosition(expectedModelPosition.lineNumber,expectedModelPosition.column)}validateViewRange(viewRange,expectedModelRange){const validViewStart=this.validateViewPosition(viewRange.startLineNumber,viewRange.startColumn,expectedModelRange.getStartPosition()),validViewEnd=this.validateViewPosition(viewRange.endLineNumber,viewRange.endColumn,expectedModelRange.getEndPosition());return new Range(validViewStart.lineNumber,validViewStart.column,validViewEnd.lineNumber,validViewEnd.column)}convertViewPositionToModelPosition(viewLineNumber,viewColumn){const info=this.getViewLineInfo(viewLineNumber),inputColumn=this.modelLineProjections[info.modelLineNumber-1].getModelColumnOfViewPosition(info.modelLineWrappedLineIdx,viewColumn);return this.model.validatePosition(new Position(info.modelLineNumber,inputColumn))}convertViewRangeToModelRange(viewRange){const start=this.convertViewPositionToModelPosition(viewRange.startLineNumber,viewRange.startColumn),end=this.convertViewPositionToModelPosition(viewRange.endLineNumber,viewRange.endColumn);return new Range(start.lineNumber,start.column,end.lineNumber,end.column)}convertModelPositionToViewPosition(_modelLineNumber,_modelColumn,affinity=2){const validPosition=this.model.validatePosition(new Position(_modelLineNumber,_modelColumn)),inputLineNumber=validPosition.lineNumber,inputColumn=validPosition.column;let lineIndex=inputLineNumber-1,lineIndexChanged=!1;for(;lineIndex>0&&!this.modelLineProjections[lineIndex].isVisible();)lineIndex--,lineIndexChanged=!0;if(0===lineIndex&&!this.modelLineProjections[lineIndex].isVisible())return new Position(1,1);const deltaLineNumber=1+this.projectedModelLineLineCounts.getPrefixSum(lineIndex);let r;return r=lineIndexChanged?this.modelLineProjections[lineIndex].getViewPositionOfModelPosition(deltaLineNumber,this.model.getLineMaxColumn(lineIndex+1),affinity):this.modelLineProjections[inputLineNumber-1].getViewPositionOfModelPosition(deltaLineNumber,inputColumn,affinity),r}convertModelRangeToViewRange(modelRange,affinity=0){if(modelRange.isEmpty()){const start=this.convertModelPositionToViewPosition(modelRange.startLineNumber,modelRange.startColumn,affinity);return Range.fromPositions(start)}{const start=this.convertModelPositionToViewPosition(modelRange.startLineNumber,modelRange.startColumn,1),end=this.convertModelPositionToViewPosition(modelRange.endLineNumber,modelRange.endColumn,0);return new Range(start.lineNumber,start.column,end.lineNumber,end.column)}}getViewLineNumberOfModelPosition(modelLineNumber,modelColumn){let lineIndex=modelLineNumber-1;if(this.modelLineProjections[lineIndex].isVisible()){const deltaLineNumber=1+this.projectedModelLineLineCounts.getPrefixSum(lineIndex);return this.modelLineProjections[lineIndex].getViewLineNumberOfModelPosition(deltaLineNumber,modelColumn)}for(;lineIndex>0&&!this.modelLineProjections[lineIndex].isVisible();)lineIndex--;if(0===lineIndex&&!this.modelLineProjections[lineIndex].isVisible())return 1;const deltaLineNumber=1+this.projectedModelLineLineCounts.getPrefixSum(lineIndex);return this.modelLineProjections[lineIndex].getViewLineNumberOfModelPosition(deltaLineNumber,this.model.getLineMaxColumn(lineIndex+1))}getDecorationsInRange(range,ownerId,filterOutValidation){const modelStart=this.convertViewPositionToModelPosition(range.startLineNumber,range.startColumn),modelEnd=this.convertViewPositionToModelPosition(range.endLineNumber,range.endColumn);if(modelEnd.lineNumber-modelStart.lineNumber<=range.endLineNumber-range.startLineNumber)return this.model.getDecorationsInRange(new Range(modelStart.lineNumber,1,modelEnd.lineNumber,modelEnd.column),ownerId,filterOutValidation);let result=[];const modelStartLineIndex=modelStart.lineNumber-1,modelEndLineIndex=modelEnd.lineNumber-1;let reqStart=null;for(let modelLineIndex=modelStartLineIndex;modelLineIndex<=modelEndLineIndex;modelLineIndex++){if(this.modelLineProjections[modelLineIndex].isVisible())null===reqStart&&(reqStart=new Position(modelLineIndex+1,modelLineIndex===modelStartLineIndex?modelStart.column:1));else if(null!==reqStart){const maxLineColumn=this.model.getLineMaxColumn(modelLineIndex);result=result.concat(this.model.getDecorationsInRange(new Range(reqStart.lineNumber,reqStart.column,modelLineIndex,maxLineColumn),ownerId,filterOutValidation)),reqStart=null}}null!==reqStart&&(result=result.concat(this.model.getDecorationsInRange(new Range(reqStart.lineNumber,reqStart.column,modelEnd.lineNumber,modelEnd.column),ownerId,filterOutValidation)),reqStart=null),result.sort(((a,b)=>{const res=Range.compareRangesUsingStarts(a.range,b.range);return 0===res?a.id<b.id?-1:a.id>b.id?1:0:res}));let finalResult=[],finalResultLen=0,prevDecId=null;for(const dec of result){const decId=dec.id;prevDecId!==decId&&(prevDecId=decId,finalResult[finalResultLen++]=dec)}return finalResult}getInjectedTextAt(position){const info=this.getViewLineInfo(position.lineNumber);return this.modelLineProjections[info.modelLineNumber-1].getInjectedTextAt(info.modelLineWrappedLineIdx,position.column)}normalizePosition(position,affinity){const info=this.getViewLineInfo(position.lineNumber);return this.modelLineProjections[info.modelLineNumber-1].normalizePosition(info.modelLineWrappedLineIdx,position,affinity)}getLineIndentColumn(lineNumber){const info=this.getViewLineInfo(lineNumber);return 0===info.modelLineWrappedLineIdx?this.model.getLineIndentColumn(info.modelLineNumber):0}}function normalizeLineRanges(ranges){if(0===ranges.length)return[];const sortedRanges=ranges.slice();sortedRanges.sort(Range.compareRangesUsingStarts);const result=[];let currentRangeStart=sortedRanges[0].startLineNumber,currentRangeEnd=sortedRanges[0].endLineNumber;for(let i=1,len=sortedRanges.length;i<len;i++){const range=sortedRanges[i];range.startLineNumber>currentRangeEnd+1?(result.push(new Range(currentRangeStart,1,currentRangeEnd,1)),currentRangeStart=range.startLineNumber,currentRangeEnd=range.endLineNumber):range.endLineNumber>currentRangeEnd&&(currentRangeEnd=range.endLineNumber)}return result.push(new Range(currentRangeStart,1,currentRangeEnd,1)),result}class ViewLineInfo{constructor(modelLineNumber,modelLineWrappedLineIdx){this.modelLineNumber=modelLineNumber,this.modelLineWrappedLineIdx=modelLineWrappedLineIdx}get isWrappedLineContinuation(){return this.modelLineWrappedLineIdx>0}}class ViewLineInfoGroupedByModelRange{constructor(modelRange,viewLines){this.modelRange=modelRange,this.viewLines=viewLines}}class CoordinatesConverter{constructor(lines){this._lines=lines}convertViewPositionToModelPosition(viewPosition){return this._lines.convertViewPositionToModelPosition(viewPosition.lineNumber,viewPosition.column)}convertViewRangeToModelRange(viewRange){return this._lines.convertViewRangeToModelRange(viewRange)}validateViewPosition(viewPosition,expectedModelPosition){return this._lines.validateViewPosition(viewPosition.lineNumber,viewPosition.column,expectedModelPosition)}validateViewRange(viewRange,expectedModelRange){return this._lines.validateViewRange(viewRange,expectedModelRange)}convertModelPositionToViewPosition(modelPosition,affinity){return this._lines.convertModelPositionToViewPosition(modelPosition.lineNumber,modelPosition.column,affinity)}convertModelRangeToViewRange(modelRange,affinity){return this._lines.convertModelRangeToViewRange(modelRange,affinity)}modelPositionIsVisible(modelPosition){return this._lines.modelPositionIsVisible(modelPosition.lineNumber,modelPosition.column)}getModelLineViewLineCount(modelLineNumber){return this._lines.getModelLineViewLineCount(modelLineNumber)}getViewLineNumberOfModelPosition(modelLineNumber,modelColumn){return this._lines.getViewLineNumberOfModelPosition(modelLineNumber,modelColumn)}}export class ViewModelLinesFromModelAsIs{constructor(model){this.model=model}dispose(){}createCoordinatesConverter(){return new IdentityCoordinatesConverter(this)}getHiddenAreas(){return[]}setHiddenAreas(_ranges){return!1}setTabSize(_newTabSize){return!1}setWrappingSettings(_fontInfo,_wrappingStrategy,_wrappingColumn,_wrappingIndent){return!1}createLineBreaksComputer(){const result=[];return{addRequest:(lineText,injectedText,previousLineBreakData)=>{result.push(null)},finalize:()=>result}}onModelFlushed(){}onModelLinesDeleted(_versionId,fromLineNumber,toLineNumber){return new viewEvents.ViewLinesDeletedEvent(fromLineNumber,toLineNumber)}onModelLinesInserted(_versionId,fromLineNumber,toLineNumber,lineBreaks){return new viewEvents.ViewLinesInsertedEvent(fromLineNumber,toLineNumber)}onModelLineChanged(_versionId,lineNumber,lineBreakData){return[!1,new viewEvents.ViewLinesChangedEvent(lineNumber,lineNumber),null,null]}acceptVersionId(_versionId){}getViewLineCount(){return this.model.getLineCount()}getActiveIndentGuide(viewLineNumber,_minLineNumber,_maxLineNumber){return{startLineNumber:viewLineNumber,endLineNumber:viewLineNumber,indent:0}}getViewLinesBracketGuides(startLineNumber,endLineNumber,activePosition){return new Array(endLineNumber-startLineNumber+1).fill([])}getViewLinesIndentGuides(viewStartLineNumber,viewEndLineNumber){const viewLineCount=viewEndLineNumber-viewStartLineNumber+1,result=new Array(viewLineCount);for(let i=0;i<viewLineCount;i++)result[i]=0;return result}getViewLineContent(viewLineNumber){return this.model.getLineContent(viewLineNumber)}getViewLineLength(viewLineNumber){return this.model.getLineLength(viewLineNumber)}getViewLineMinColumn(viewLineNumber){return this.model.getLineMinColumn(viewLineNumber)}getViewLineMaxColumn(viewLineNumber){return this.model.getLineMaxColumn(viewLineNumber)}getViewLineData(viewLineNumber){const lineTokens=this.model.getLineTokens(viewLineNumber),lineContent=lineTokens.getLineContent();return new ViewLineData(lineContent,!1,1,lineContent.length+1,0,lineTokens.inflate(),null)}getViewLinesData(viewStartLineNumber,viewEndLineNumber,needed){const lineCount=this.model.getLineCount();viewStartLineNumber=Math.min(Math.max(1,viewStartLineNumber),lineCount),viewEndLineNumber=Math.min(Math.max(1,viewEndLineNumber),lineCount);const result=[];for(let lineNumber=viewStartLineNumber;lineNumber<=viewEndLineNumber;lineNumber++){const idx=lineNumber-viewStartLineNumber;result[idx]=needed[idx]?this.getViewLineData(lineNumber):null}return result}getDecorationsInRange(range,ownerId,filterOutValidation){return this.model.getDecorationsInRange(range,ownerId,filterOutValidation)}normalizePosition(position,affinity){return this.model.normalizePosition(position,affinity)}getLineIndentColumn(lineNumber){return this.model.getLineIndentColumn(lineNumber)}getInjectedTextAt(position){return null}}class IdentityCoordinatesConverter{constructor(lines){this._lines=lines}_validPosition(pos){return this._lines.model.validatePosition(pos)}_validRange(range){return this._lines.model.validateRange(range)}convertViewPositionToModelPosition(viewPosition){return this._validPosition(viewPosition)}convertViewRangeToModelRange(viewRange){return this._validRange(viewRange)}validateViewPosition(_viewPosition,expectedModelPosition){return this._validPosition(expectedModelPosition)}validateViewRange(_viewRange,expectedModelRange){return this._validRange(expectedModelRange)}convertModelPositionToViewPosition(modelPosition){return this._validPosition(modelPosition)}convertModelRangeToViewRange(modelRange){return this._validRange(modelRange)}modelPositionIsVisible(modelPosition){const lineCount=this._lines.model.getLineCount();return!(modelPosition.lineNumber<1||modelPosition.lineNumber>lineCount)}getModelLineViewLineCount(modelLineNumber){return 1}getViewLineNumberOfModelPosition(modelLineNumber,modelColumn){return modelLineNumber}}