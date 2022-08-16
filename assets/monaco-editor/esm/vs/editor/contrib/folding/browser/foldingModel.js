import{Emitter}from"../../../../base/common/event.js";import{FoldingRegions}from"./foldingRanges.js";export class FoldingModel{constructor(textModel,decorationProvider){this._updateEventEmitter=new Emitter,this.onDidChange=this._updateEventEmitter.event,this._textModel=textModel,this._decorationProvider=decorationProvider,this._regions=new FoldingRegions(new Uint32Array(0),new Uint32Array(0)),this._editorDecorationIds=[],this._isInitialized=!1}get regions(){return this._regions}get textModel(){return this._textModel}get isInitialized(){return this._isInitialized}toggleCollapseState(toggledRegions){if(!toggledRegions.length)return;toggledRegions=toggledRegions.sort(((r1,r2)=>r1.regionIndex-r2.regionIndex));const processed={};this._decorationProvider.changeDecorations((accessor=>{let k=0,dirtyRegionEndLine=-1,lastHiddenLine=-1;const updateDecorationsUntil=index=>{for(;k<index;){const endLineNumber=this._regions.getEndLineNumber(k),isCollapsed=this._regions.isCollapsed(k);endLineNumber<=dirtyRegionEndLine&&accessor.changeDecorationOptions(this._editorDecorationIds[k],this._decorationProvider.getDecorationOption(isCollapsed,endLineNumber<=lastHiddenLine)),isCollapsed&&endLineNumber>lastHiddenLine&&(lastHiddenLine=endLineNumber),k++}};for(let region of toggledRegions){let index=region.regionIndex,editorDecorationId=this._editorDecorationIds[index];if(editorDecorationId&&!processed[editorDecorationId]){processed[editorDecorationId]=!0,updateDecorationsUntil(index);let newCollapseState=!this._regions.isCollapsed(index);this._regions.setCollapsed(index,newCollapseState),dirtyRegionEndLine=Math.max(dirtyRegionEndLine,this._regions.getEndLineNumber(index))}}updateDecorationsUntil(this._regions.length)})),this._updateEventEmitter.fire({model:this,collapseStateChanged:toggledRegions})}update(newRegions,blockedLineNumers=[]){let newEditorDecorations=[],lastHiddenLine=-1,initRange=(index,isCollapsed)=>{const startLineNumber=newRegions.getStartLineNumber(index),endLineNumber=newRegions.getEndLineNumber(index);isCollapsed||(isCollapsed=newRegions.isCollapsed(index)),isCollapsed&&((startLineNumber,endLineNumber)=>{for(let blockedLineNumber of blockedLineNumers)if(startLineNumber<blockedLineNumber&&blockedLineNumber<=endLineNumber)return!0;return!1})(startLineNumber,endLineNumber)&&(isCollapsed=!1),newRegions.setCollapsed(index,isCollapsed);const maxColumn=this._textModel.getLineMaxColumn(startLineNumber),decorationRange={startLineNumber,startColumn:Math.max(maxColumn-1,1),endLineNumber:startLineNumber,endColumn:maxColumn};newEditorDecorations.push({range:decorationRange,options:this._decorationProvider.getDecorationOption(isCollapsed,endLineNumber<=lastHiddenLine)}),isCollapsed&&endLineNumber>lastHiddenLine&&(lastHiddenLine=endLineNumber)},i=0,nextCollapsed=()=>{for(;i<this._regions.length;){let isCollapsed=this._regions.isCollapsed(i);if(i++,isCollapsed)return i-1}return-1},k=0,collapsedIndex=nextCollapsed();for(;-1!==collapsedIndex&&k<newRegions.length;){let decRange=this._textModel.getDecorationRange(this._editorDecorationIds[collapsedIndex]);if(decRange){let collapsedStartLineNumber=decRange.startLineNumber;if(decRange.startColumn===Math.max(decRange.endColumn-1,1)&&this._textModel.getLineMaxColumn(collapsedStartLineNumber)===decRange.endColumn)for(;k<newRegions.length;){let startLineNumber=newRegions.getStartLineNumber(k);if(!(collapsedStartLineNumber>=startLineNumber))break;initRange(k,collapsedStartLineNumber===startLineNumber),k++}}collapsedIndex=nextCollapsed()}for(;k<newRegions.length;)initRange(k,!1),k++;this._editorDecorationIds=this._decorationProvider.deltaDecorations(this._editorDecorationIds,newEditorDecorations),this._regions=newRegions,this._isInitialized=!0,this._updateEventEmitter.fire({model:this})}getMemento(){let collapsedRanges=[];for(let i=0;i<this._regions.length;i++)if(this._regions.isCollapsed(i)){let range=this._textModel.getDecorationRange(this._editorDecorationIds[i]);if(range){let startLineNumber=range.startLineNumber,endLineNumber=range.endLineNumber+this._regions.getEndLineNumber(i)-this._regions.getStartLineNumber(i);collapsedRanges.push({startLineNumber,endLineNumber})}}if(collapsedRanges.length>0)return collapsedRanges}applyMemento(state){if(!Array.isArray(state))return;let toToogle=[];for(let range of state){let region=this.getRegionAtLine(range.startLineNumber);region&&!region.isCollapsed&&toToogle.push(region)}this.toggleCollapseState(toToogle)}dispose(){this._decorationProvider.deltaDecorations(this._editorDecorationIds,[])}getAllRegionsAtLine(lineNumber,filter){let result=[];if(this._regions){let index=this._regions.findRange(lineNumber),level=1;for(;index>=0;){let current=this._regions.toRegion(index);filter&&!filter(current,level)||result.push(current),level++,index=current.parentIndex}}return result}getRegionAtLine(lineNumber){if(this._regions){let index=this._regions.findRange(lineNumber);if(index>=0)return this._regions.toRegion(index)}return null}getRegionsInside(region,filter){let result=[],index=region?region.regionIndex+1:0,endLineNumber=region?region.endLineNumber:Number.MAX_VALUE;if(filter&&2===filter.length){const levelStack=[];for(let i=index,len=this._regions.length;i<len;i++){let current=this._regions.toRegion(i);if(!(this._regions.getStartLineNumber(i)<endLineNumber))break;for(;levelStack.length>0&&!current.containedBy(levelStack[levelStack.length-1]);)levelStack.pop();levelStack.push(current),filter(current,levelStack.length)&&result.push(current)}}else for(let i=index,len=this._regions.length;i<len;i++){let current=this._regions.toRegion(i);if(!(this._regions.getStartLineNumber(i)<endLineNumber))break;filter&&!filter(current)||result.push(current)}return result}}export function toggleCollapseState(foldingModel,levels,lineNumbers){let toToggle=[];for(let lineNumber of lineNumbers){let region=foldingModel.getRegionAtLine(lineNumber);if(region){const doCollapse=!region.isCollapsed;if(toToggle.push(region),levels>1){let regionsInside=foldingModel.getRegionsInside(region,((r,level)=>r.isCollapsed!==doCollapse&&level<levels));toToggle.push(...regionsInside)}}}foldingModel.toggleCollapseState(toToggle)}export function setCollapseStateLevelsDown(foldingModel,doCollapse,levels=Number.MAX_VALUE,lineNumbers){let toToggle=[];if(lineNumbers&&lineNumbers.length>0)for(let lineNumber of lineNumbers){let region=foldingModel.getRegionAtLine(lineNumber);if(region&&(region.isCollapsed!==doCollapse&&toToggle.push(region),levels>1)){let regionsInside=foldingModel.getRegionsInside(region,((r,level)=>r.isCollapsed!==doCollapse&&level<levels));toToggle.push(...regionsInside)}}else{let regionsInside=foldingModel.getRegionsInside(null,((r,level)=>r.isCollapsed!==doCollapse&&level<levels));toToggle.push(...regionsInside)}foldingModel.toggleCollapseState(toToggle)}export function setCollapseStateLevelsUp(foldingModel,doCollapse,levels,lineNumbers){let toToggle=[];for(let lineNumber of lineNumbers){let regions=foldingModel.getAllRegionsAtLine(lineNumber,((region,level)=>region.isCollapsed!==doCollapse&&level<=levels));toToggle.push(...regions)}foldingModel.toggleCollapseState(toToggle)}export function setCollapseStateUp(foldingModel,doCollapse,lineNumbers){let toToggle=[];for(let lineNumber of lineNumbers){let regions=foldingModel.getAllRegionsAtLine(lineNumber,(region=>region.isCollapsed!==doCollapse));regions.length>0&&toToggle.push(regions[0])}foldingModel.toggleCollapseState(toToggle)}export function setCollapseStateAtLevel(foldingModel,foldLevel,doCollapse,blockedLineNumbers){let toToggle=foldingModel.getRegionsInside(null,((region,level)=>level===foldLevel&&region.isCollapsed!==doCollapse&&!blockedLineNumbers.some((line=>region.containsLine(line)))));foldingModel.toggleCollapseState(toToggle)}export function setCollapseStateForRest(foldingModel,doCollapse,blockedLineNumbers){let filteredRegions=[];for(let lineNumber of blockedLineNumbers){const regions=foldingModel.getAllRegionsAtLine(lineNumber,void 0);regions.length>0&&filteredRegions.push(regions[0])}let toToggle=foldingModel.getRegionsInside(null,(region=>filteredRegions.every((filteredRegion=>!filteredRegion.containedBy(region)&&!region.containedBy(filteredRegion)))&&region.isCollapsed!==doCollapse));foldingModel.toggleCollapseState(toToggle)}export function setCollapseStateForMatchingLines(foldingModel,regExp,doCollapse){let editorModel=foldingModel.textModel,regions=foldingModel.regions,toToggle=[];for(let i=regions.length-1;i>=0;i--)if(doCollapse!==regions.isCollapsed(i)){let startLineNumber=regions.getStartLineNumber(i);regExp.test(editorModel.getLineContent(startLineNumber))&&toToggle.push(regions.toRegion(i))}foldingModel.toggleCollapseState(toToggle)}export function setCollapseStateForType(foldingModel,type,doCollapse){let regions=foldingModel.regions,toToggle=[];for(let i=regions.length-1;i>=0;i--)doCollapse!==regions.isCollapsed(i)&&type===regions.getType(i)&&toToggle.push(regions.toRegion(i));foldingModel.toggleCollapseState(toToggle)}export function getParentFoldLine(lineNumber,foldingModel){let startLineNumber=null,foldingRegion=foldingModel.getRegionAtLine(lineNumber);if(null!==foldingRegion&&(startLineNumber=foldingRegion.startLineNumber,lineNumber===startLineNumber)){let parentFoldingIdx=foldingRegion.parentIndex;startLineNumber=-1!==parentFoldingIdx?foldingModel.regions.getStartLineNumber(parentFoldingIdx):null}return startLineNumber}export function getPreviousFoldLine(lineNumber,foldingModel){let foldingRegion=foldingModel.getRegionAtLine(lineNumber);if(null!==foldingRegion&&foldingRegion.startLineNumber===lineNumber){if(lineNumber!==foldingRegion.startLineNumber)return foldingRegion.startLineNumber;{let expectedParentIndex=foldingRegion.parentIndex,minLineNumber=0;for(-1!==expectedParentIndex&&(minLineNumber=foldingModel.regions.getStartLineNumber(foldingRegion.parentIndex));null!==foldingRegion;){if(!(foldingRegion.regionIndex>0))return null;if(foldingRegion=foldingModel.regions.toRegion(foldingRegion.regionIndex-1),foldingRegion.startLineNumber<=minLineNumber)return null;if(foldingRegion.parentIndex===expectedParentIndex)return foldingRegion.startLineNumber}}}else if(foldingModel.regions.length>0)for(foldingRegion=foldingModel.regions.toRegion(foldingModel.regions.length-1);null!==foldingRegion;){if(foldingRegion.startLineNumber<lineNumber)return foldingRegion.startLineNumber;foldingRegion=foldingRegion.regionIndex>0?foldingModel.regions.toRegion(foldingRegion.regionIndex-1):null}return null}export function getNextFoldLine(lineNumber,foldingModel){let foldingRegion=foldingModel.getRegionAtLine(lineNumber);if(null!==foldingRegion&&foldingRegion.startLineNumber===lineNumber){let expectedParentIndex=foldingRegion.parentIndex,maxLineNumber=0;if(-1!==expectedParentIndex)maxLineNumber=foldingModel.regions.getEndLineNumber(foldingRegion.parentIndex);else{if(0===foldingModel.regions.length)return null;maxLineNumber=foldingModel.regions.getEndLineNumber(foldingModel.regions.length-1)}for(;null!==foldingRegion;){if(!(foldingRegion.regionIndex<foldingModel.regions.length))return null;if(foldingRegion=foldingModel.regions.toRegion(foldingRegion.regionIndex+1),foldingRegion.startLineNumber>=maxLineNumber)return null;if(foldingRegion.parentIndex===expectedParentIndex)return foldingRegion.startLineNumber}}else if(foldingModel.regions.length>0)for(foldingRegion=foldingModel.regions.toRegion(0);null!==foldingRegion;){if(foldingRegion.startLineNumber>lineNumber)return foldingRegion.startLineNumber;foldingRegion=foldingRegion.regionIndex<foldingModel.regions.length?foldingModel.regions.toRegion(foldingRegion.regionIndex+1):null}return null}