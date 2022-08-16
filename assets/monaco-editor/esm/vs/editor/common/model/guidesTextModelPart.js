import{ArrayQueue,findLast}from"../../../base/common/arrays.js";import*as strings from"../../../base/common/strings.js";import{CursorColumns}from"../core/cursorColumns.js";import{Range}from"../core/range.js";import{TextModelPart}from"./textModelPart.js";import{computeIndentLevel}from"./utils.js";import{HorizontalGuidesState,IndentGuide,IndentGuideHorizontalLine}from"../textModelGuides.js";export class GuidesTextModelPart extends TextModelPart{constructor(textModel,languageConfigurationService){super(),this.textModel=textModel,this.languageConfigurationService=languageConfigurationService}getLanguageConfiguration(languageId){return this.languageConfigurationService.getLanguageConfiguration(languageId)}_computeIndentLevel(lineIndex){return computeIndentLevel(this.textModel.getLineContent(lineIndex+1),this.textModel.getOptions().tabSize)}getActiveIndentGuide(lineNumber,minLineNumber,maxLineNumber){this.assertNotDisposed();const lineCount=this.textModel.getLineCount();if(lineNumber<1||lineNumber>lineCount)throw new Error("Illegal value for lineNumber");const foldingRules=this.getLanguageConfiguration(this.textModel.getLanguageId()).foldingRules,offSide=Boolean(foldingRules&&foldingRules.offSide);let up_aboveContentLineIndex=-2,up_aboveContentLineIndent=-1,up_belowContentLineIndex=-2,up_belowContentLineIndent=-1;const up_resolveIndents=lineNumber=>{if(-1!==up_aboveContentLineIndex&&(-2===up_aboveContentLineIndex||up_aboveContentLineIndex>lineNumber-1)){up_aboveContentLineIndex=-1,up_aboveContentLineIndent=-1;for(let lineIndex=lineNumber-2;lineIndex>=0;lineIndex--){const indent=this._computeIndentLevel(lineIndex);if(indent>=0){up_aboveContentLineIndex=lineIndex,up_aboveContentLineIndent=indent;break}}}if(-2===up_belowContentLineIndex){up_belowContentLineIndex=-1,up_belowContentLineIndent=-1;for(let lineIndex=lineNumber;lineIndex<lineCount;lineIndex++){const indent=this._computeIndentLevel(lineIndex);if(indent>=0){up_belowContentLineIndex=lineIndex,up_belowContentLineIndent=indent;break}}}};let down_aboveContentLineIndex=-2,down_aboveContentLineIndent=-1,down_belowContentLineIndex=-2,down_belowContentLineIndent=-1;const down_resolveIndents=lineNumber=>{if(-2===down_aboveContentLineIndex){down_aboveContentLineIndex=-1,down_aboveContentLineIndent=-1;for(let lineIndex=lineNumber-2;lineIndex>=0;lineIndex--){const indent=this._computeIndentLevel(lineIndex);if(indent>=0){down_aboveContentLineIndex=lineIndex,down_aboveContentLineIndent=indent;break}}}if(-1!==down_belowContentLineIndex&&(-2===down_belowContentLineIndex||down_belowContentLineIndex<lineNumber-1)){down_belowContentLineIndex=-1,down_belowContentLineIndent=-1;for(let lineIndex=lineNumber;lineIndex<lineCount;lineIndex++){const indent=this._computeIndentLevel(lineIndex);if(indent>=0){down_belowContentLineIndex=lineIndex,down_belowContentLineIndent=indent;break}}}};let startLineNumber=0,goUp=!0,endLineNumber=0,goDown=!0,indent=0,initialIndent=0;for(let distance=0;goUp||goDown;distance++){const upLineNumber=lineNumber-distance,downLineNumber=lineNumber+distance;distance>1&&(upLineNumber<1||upLineNumber<minLineNumber)&&(goUp=!1),distance>1&&(downLineNumber>lineCount||downLineNumber>maxLineNumber)&&(goDown=!1),distance>5e4&&(goUp=!1,goDown=!1);let upLineIndentLevel=-1;if(goUp&&upLineNumber>=1){const currentIndent=this._computeIndentLevel(upLineNumber-1);currentIndent>=0?(up_belowContentLineIndex=upLineNumber-1,up_belowContentLineIndent=currentIndent,upLineIndentLevel=Math.ceil(currentIndent/this.textModel.getOptions().indentSize)):(up_resolveIndents(upLineNumber),upLineIndentLevel=this._getIndentLevelForWhitespaceLine(offSide,up_aboveContentLineIndent,up_belowContentLineIndent))}let downLineIndentLevel=-1;if(goDown&&downLineNumber<=lineCount){const currentIndent=this._computeIndentLevel(downLineNumber-1);currentIndent>=0?(down_aboveContentLineIndex=downLineNumber-1,down_aboveContentLineIndent=currentIndent,downLineIndentLevel=Math.ceil(currentIndent/this.textModel.getOptions().indentSize)):(down_resolveIndents(downLineNumber),downLineIndentLevel=this._getIndentLevelForWhitespaceLine(offSide,down_aboveContentLineIndent,down_belowContentLineIndent))}if(0!==distance){if(1===distance){if(downLineNumber<=lineCount&&downLineIndentLevel>=0&&initialIndent+1===downLineIndentLevel){goUp=!1,startLineNumber=downLineNumber,endLineNumber=downLineNumber,indent=downLineIndentLevel;continue}if(upLineNumber>=1&&upLineIndentLevel>=0&&upLineIndentLevel-1===initialIndent){goDown=!1,startLineNumber=upLineNumber,endLineNumber=upLineNumber,indent=upLineIndentLevel;continue}if(startLineNumber=lineNumber,endLineNumber=lineNumber,indent=initialIndent,0===indent)return{startLineNumber,endLineNumber,indent}}goUp&&(upLineIndentLevel>=indent?startLineNumber=upLineNumber:goUp=!1),goDown&&(downLineIndentLevel>=indent?endLineNumber=downLineNumber:goDown=!1)}else initialIndent=upLineIndentLevel}return{startLineNumber,endLineNumber,indent}}getLinesBracketGuides(startLineNumber,endLineNumber,activePosition,options){var _a,_b,_c,_d,_e;const result=[],bracketPairs=this.textModel.bracketPairs.getBracketPairsInRangeWithMinIndentation(new Range(startLineNumber,1,endLineNumber,this.textModel.getLineMaxColumn(endLineNumber)));let activeBracketPairRange;if(activePosition&&bracketPairs.length>0){const bracketsContainingActivePosition=startLineNumber<=activePosition.lineNumber&&activePosition.lineNumber<=endLineNumber?bracketPairs.filter((bp=>Range.strictContainsPosition(bp.range,activePosition))):this.textModel.bracketPairs.getBracketPairsInRange(Range.fromPositions(activePosition));activeBracketPairRange=null===(_a=findLast(bracketsContainingActivePosition,(i=>i.range.startLineNumber!==i.range.endLineNumber)))||void 0===_a?void 0:_a.range}const queue=new ArrayQueue(bracketPairs),activeGuides=new Array,nextGuides=new Array,colorProvider=new BracketPairGuidesClassNames;for(let lineNumber=startLineNumber;lineNumber<=endLineNumber;lineNumber++){let guides=new Array;nextGuides.length>0&&(guides=guides.concat(nextGuides),nextGuides.length=0),result.push(guides);for(const pair of queue.takeWhile((b=>b.openingBracketRange.startLineNumber<=lineNumber))||[]){if(pair.range.startLineNumber===pair.range.endLineNumber)continue;const guideVisibleColumn=Math.min(this.getVisibleColumnFromPosition(pair.openingBracketRange.getStartPosition()),this.getVisibleColumnFromPosition(null!==(_c=null===(_b=pair.closingBracketRange)||void 0===_b?void 0:_b.getStartPosition())&&void 0!==_c?_c:pair.range.getEndPosition()),pair.minVisibleColumnIndentation+1);let renderHorizontalEndLineAtTheBottom=!1;if(pair.closingBracketRange){strings.firstNonWhitespaceIndex(this.textModel.getLineContent(pair.closingBracketRange.startLineNumber))<pair.closingBracketRange.startColumn-1&&(renderHorizontalEndLineAtTheBottom=!0)}const start=pair.openingBracketRange.getStartPosition(),end=null!==(_e=null===(_d=pair.closingBracketRange)||void 0===_d?void 0:_d.getStartPosition())&&void 0!==_e?_e:pair.range.getEndPosition();void 0===pair.closingBracketRange?activeGuides[pair.nestingLevel]=null:activeGuides[pair.nestingLevel]={nestingLevel:pair.nestingLevel,guideVisibleColumn,start,visibleStartColumn:this.getVisibleColumnFromPosition(start),end,visibleEndColumn:this.getVisibleColumnFromPosition(end),bracketPair:pair,renderHorizontalEndLineAtTheBottom}}for(const line of activeGuides){if(!line)continue;const isActive=activeBracketPairRange&&line.bracketPair.range.equalsRange(activeBracketPairRange),className=colorProvider.getInlineClassNameOfLevel(line.nestingLevel)+(options.highlightActive&&isActive?" "+colorProvider.activeClassName:"");(isActive&&options.horizontalGuides!==HorizontalGuidesState.Disabled||options.includeInactive&&options.horizontalGuides===HorizontalGuidesState.Enabled)&&(line.start.lineNumber===lineNumber&&line.guideVisibleColumn<line.visibleStartColumn&&guides.push(new IndentGuide(line.guideVisibleColumn,className,new IndentGuideHorizontalLine(!1,line.start.column))),line.end.lineNumber===lineNumber+1&&line.guideVisibleColumn<line.visibleEndColumn&&nextGuides.push(new IndentGuide(line.guideVisibleColumn,className,new IndentGuideHorizontalLine(!line.renderHorizontalEndLineAtTheBottom,line.end.column))))}let lastVisibleColumnCount=Number.MAX_SAFE_INTEGER;for(let i=activeGuides.length-1;i>=0;i--){const line=activeGuides[i];if(!line)continue;const isActive=options.highlightActive&&activeBracketPairRange&&line.bracketPair.range.equalsRange(activeBracketPairRange),className=colorProvider.getInlineClassNameOfLevel(line.nestingLevel)+(isActive?" "+colorProvider.activeClassName:"");(isActive||options.includeInactive)&&line.renderHorizontalEndLineAtTheBottom&&line.end.lineNumber===lineNumber+1&&nextGuides.push(new IndentGuide(line.guideVisibleColumn,className,null)),line.end.lineNumber<=lineNumber||line.start.lineNumber>=lineNumber||(line.guideVisibleColumn>=lastVisibleColumnCount&&!isActive||(lastVisibleColumnCount=line.guideVisibleColumn,(isActive||options.includeInactive)&&guides.push(new IndentGuide(line.guideVisibleColumn,className,null))))}guides.sort(((a,b)=>a.visibleColumn-b.visibleColumn))}return result}getVisibleColumnFromPosition(position){return CursorColumns.visibleColumnFromColumn(this.textModel.getLineContent(position.lineNumber),position.column,this.textModel.getOptions().tabSize)+1}getLinesIndentGuides(startLineNumber,endLineNumber){this.assertNotDisposed();const lineCount=this.textModel.getLineCount();if(startLineNumber<1||startLineNumber>lineCount)throw new Error("Illegal value for startLineNumber");if(endLineNumber<1||endLineNumber>lineCount)throw new Error("Illegal value for endLineNumber");const options=this.textModel.getOptions(),foldingRules=this.getLanguageConfiguration(this.textModel.getLanguageId()).foldingRules,offSide=Boolean(foldingRules&&foldingRules.offSide),result=new Array(endLineNumber-startLineNumber+1);let aboveContentLineIndex=-2,aboveContentLineIndent=-1,belowContentLineIndex=-2,belowContentLineIndent=-1;for(let lineNumber=startLineNumber;lineNumber<=endLineNumber;lineNumber++){const resultIndex=lineNumber-startLineNumber,currentIndent=this._computeIndentLevel(lineNumber-1);if(currentIndent>=0)aboveContentLineIndex=lineNumber-1,aboveContentLineIndent=currentIndent,result[resultIndex]=Math.ceil(currentIndent/options.indentSize);else{if(-2===aboveContentLineIndex){aboveContentLineIndex=-1,aboveContentLineIndent=-1;for(let lineIndex=lineNumber-2;lineIndex>=0;lineIndex--){const indent=this._computeIndentLevel(lineIndex);if(indent>=0){aboveContentLineIndex=lineIndex,aboveContentLineIndent=indent;break}}}if(-1!==belowContentLineIndex&&(-2===belowContentLineIndex||belowContentLineIndex<lineNumber-1)){belowContentLineIndex=-1,belowContentLineIndent=-1;for(let lineIndex=lineNumber;lineIndex<lineCount;lineIndex++){const indent=this._computeIndentLevel(lineIndex);if(indent>=0){belowContentLineIndex=lineIndex,belowContentLineIndent=indent;break}}}result[resultIndex]=this._getIndentLevelForWhitespaceLine(offSide,aboveContentLineIndent,belowContentLineIndent)}}return result}_getIndentLevelForWhitespaceLine(offSide,aboveContentLineIndent,belowContentLineIndent){const options=this.textModel.getOptions();return-1===aboveContentLineIndent||-1===belowContentLineIndent?0:aboveContentLineIndent<belowContentLineIndent?1+Math.floor(aboveContentLineIndent/options.indentSize):aboveContentLineIndent===belowContentLineIndent||offSide?Math.ceil(belowContentLineIndent/options.indentSize):1+Math.floor(belowContentLineIndent/options.indentSize)}}export class BracketPairGuidesClassNames{constructor(){this.activeClassName="indent-active"}getInlineClassNameOfLevel(level){return"bracket-indent-guide lvl-"+level%30}}