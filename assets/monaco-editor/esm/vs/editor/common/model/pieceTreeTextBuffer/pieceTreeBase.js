import{Position}from"../../core/position.js";import{Range}from"../../core/range.js";import{FindMatch}from"../../model.js";import{SENTINEL,TreeNode,fixInsert,leftest,rbDelete,righttest,updateTreeMetadata}from"./rbTreeBase.js";import{Searcher,createFindMatch,isValidMatch}from"../textModelSearch.js";export const AverageBufferSize=65535;export function createUintArray(arr){let r;return r=arr[arr.length-1]<65536?new Uint16Array(arr.length):new Uint32Array(arr.length),r.set(arr,0),r}export class LineStarts{constructor(lineStarts,cr,lf,crlf,isBasicASCII){this.lineStarts=lineStarts,this.cr=cr,this.lf=lf,this.crlf=crlf,this.isBasicASCII=isBasicASCII}}export function createLineStartsFast(str,readonly=!0){const r=[0];let rLength=1;for(let i=0,len=str.length;i<len;i++){const chr=str.charCodeAt(i);13===chr?i+1<len&&10===str.charCodeAt(i+1)?(r[rLength++]=i+2,i++):r[rLength++]=i+1:10===chr&&(r[rLength++]=i+1)}return readonly?createUintArray(r):r}export function createLineStarts(r,str){r.length=0,r[0]=0;let rLength=1,cr=0,lf=0,crlf=0,isBasicASCII=!0;for(let i=0,len=str.length;i<len;i++){const chr=str.charCodeAt(i);13===chr?i+1<len&&10===str.charCodeAt(i+1)?(crlf++,r[rLength++]=i+2,i++):(cr++,r[rLength++]=i+1):10===chr?(lf++,r[rLength++]=i+1):isBasicASCII&&9!==chr&&(chr<32||chr>126)&&(isBasicASCII=!1)}const result=new LineStarts(createUintArray(r),cr,lf,crlf,isBasicASCII);return r.length=0,result}export class Piece{constructor(bufferIndex,start,end,lineFeedCnt,length){this.bufferIndex=bufferIndex,this.start=start,this.end=end,this.lineFeedCnt=lineFeedCnt,this.length=length}}export class StringBuffer{constructor(buffer,lineStarts){this.buffer=buffer,this.lineStarts=lineStarts}}class PieceTreeSnapshot{constructor(tree,BOM){this._pieces=[],this._tree=tree,this._BOM=BOM,this._index=0,tree.root!==SENTINEL&&tree.iterate(tree.root,(node=>(node!==SENTINEL&&this._pieces.push(node.piece),!0)))}read(){return 0===this._pieces.length?0===this._index?(this._index++,this._BOM):null:this._index>this._pieces.length-1?null:0===this._index?this._BOM+this._tree.getPieceContent(this._pieces[this._index++]):this._tree.getPieceContent(this._pieces[this._index++])}}class PieceTreeSearchCache{constructor(limit){this._limit=limit,this._cache=[]}get(offset){for(let i=this._cache.length-1;i>=0;i--){const nodePos=this._cache[i];if(nodePos.nodeStartOffset<=offset&&nodePos.nodeStartOffset+nodePos.node.piece.length>=offset)return nodePos}return null}get2(lineNumber){for(let i=this._cache.length-1;i>=0;i--){const nodePos=this._cache[i];if(nodePos.nodeStartLineNumber&&nodePos.nodeStartLineNumber<lineNumber&&nodePos.nodeStartLineNumber+nodePos.node.piece.lineFeedCnt>=lineNumber)return nodePos}return null}set(nodePosition){this._cache.length>=this._limit&&this._cache.shift(),this._cache.push(nodePosition)}validate(offset){let hasInvalidVal=!1;const tmp=this._cache;for(let i=0;i<tmp.length;i++){const nodePos=tmp[i];(null===nodePos.node.parent||nodePos.nodeStartOffset>=offset)&&(tmp[i]=null,hasInvalidVal=!0)}if(hasInvalidVal){const newArr=[];for(const entry of tmp)null!==entry&&newArr.push(entry);this._cache=newArr}}}export class PieceTreeBase{constructor(chunks,eol,eolNormalized){this.create(chunks,eol,eolNormalized)}create(chunks,eol,eolNormalized){this._buffers=[new StringBuffer("",[0])],this._lastChangeBufferPos={line:0,column:0},this.root=SENTINEL,this._lineCnt=1,this._length=0,this._EOL=eol,this._EOLLength=eol.length,this._EOLNormalized=eolNormalized;let lastNode=null;for(let i=0,len=chunks.length;i<len;i++)if(chunks[i].buffer.length>0){chunks[i].lineStarts||(chunks[i].lineStarts=createLineStartsFast(chunks[i].buffer));const piece=new Piece(i+1,{line:0,column:0},{line:chunks[i].lineStarts.length-1,column:chunks[i].buffer.length-chunks[i].lineStarts[chunks[i].lineStarts.length-1]},chunks[i].lineStarts.length-1,chunks[i].buffer.length);this._buffers.push(chunks[i]),lastNode=this.rbInsertRight(lastNode,piece)}this._searchCache=new PieceTreeSearchCache(1),this._lastVisitedLine={lineNumber:0,value:""},this.computeBufferMetadata()}normalizeEOL(eol){const min=65535-Math.floor(21845),max=2*min;let tempChunk="",tempChunkLen=0;const chunks=[];if(this.iterate(this.root,(node=>{const str=this.getNodeContent(node),len=str.length;if(tempChunkLen<=min||tempChunkLen+len<max)return tempChunk+=str,tempChunkLen+=len,!0;const text=tempChunk.replace(/\r\n|\r|\n/g,eol);return chunks.push(new StringBuffer(text,createLineStartsFast(text))),tempChunk=str,tempChunkLen=len,!0})),tempChunkLen>0){const text=tempChunk.replace(/\r\n|\r|\n/g,eol);chunks.push(new StringBuffer(text,createLineStartsFast(text)))}this.create(chunks,eol,!0)}getEOL(){return this._EOL}setEOL(newEOL){this._EOL=newEOL,this._EOLLength=this._EOL.length,this.normalizeEOL(newEOL)}createSnapshot(BOM){return new PieceTreeSnapshot(this,BOM)}getOffsetAt(lineNumber,column){let leftLen=0,x=this.root;for(;x!==SENTINEL;)if(x.left!==SENTINEL&&x.lf_left+1>=lineNumber)x=x.left;else{if(x.lf_left+x.piece.lineFeedCnt+1>=lineNumber){leftLen+=x.size_left;return leftLen+(this.getAccumulatedValue(x,lineNumber-x.lf_left-2)+column-1)}lineNumber-=x.lf_left+x.piece.lineFeedCnt,leftLen+=x.size_left+x.piece.length,x=x.right}return leftLen}getPositionAt(offset){offset=Math.floor(offset),offset=Math.max(0,offset);let x=this.root,lfCnt=0;const originalOffset=offset;for(;x!==SENTINEL;)if(0!==x.size_left&&x.size_left>=offset)x=x.left;else{if(x.size_left+x.piece.length>=offset){const out=this.getIndexOf(x,offset-x.size_left);if(lfCnt+=x.lf_left+out.index,0===out.index){const lineStartOffset=this.getOffsetAt(lfCnt+1,1);return new Position(lfCnt+1,originalOffset-lineStartOffset+1)}return new Position(lfCnt+1,out.remainder+1)}if(offset-=x.size_left+x.piece.length,lfCnt+=x.lf_left+x.piece.lineFeedCnt,x.right===SENTINEL){const lineStartOffset=this.getOffsetAt(lfCnt+1,1);return new Position(lfCnt+1,originalOffset-offset-lineStartOffset+1)}x=x.right}return new Position(1,1)}getValueInRange(range,eol){if(range.startLineNumber===range.endLineNumber&&range.startColumn===range.endColumn)return"";const startPosition=this.nodeAt2(range.startLineNumber,range.startColumn),endPosition=this.nodeAt2(range.endLineNumber,range.endColumn),value=this.getValueInRange2(startPosition,endPosition);return eol?eol===this._EOL&&this._EOLNormalized&&eol===this.getEOL()&&this._EOLNormalized?value:value.replace(/\r\n|\r|\n/g,eol):value}getValueInRange2(startPosition,endPosition){if(startPosition.node===endPosition.node){const node=startPosition.node,buffer=this._buffers[node.piece.bufferIndex].buffer,startOffset=this.offsetInBuffer(node.piece.bufferIndex,node.piece.start);return buffer.substring(startOffset+startPosition.remainder,startOffset+endPosition.remainder)}let x=startPosition.node;const buffer=this._buffers[x.piece.bufferIndex].buffer,startOffset=this.offsetInBuffer(x.piece.bufferIndex,x.piece.start);let ret=buffer.substring(startOffset+startPosition.remainder,startOffset+x.piece.length);for(x=x.next();x!==SENTINEL;){const buffer=this._buffers[x.piece.bufferIndex].buffer,startOffset=this.offsetInBuffer(x.piece.bufferIndex,x.piece.start);if(x===endPosition.node){ret+=buffer.substring(startOffset,startOffset+endPosition.remainder);break}ret+=buffer.substr(startOffset,x.piece.length),x=x.next()}return ret}getLinesContent(){const lines=[];let linesLength=0,currentLine="",danglingCR=!1;return this.iterate(this.root,(node=>{if(node===SENTINEL)return!0;const piece=node.piece;let pieceLength=piece.length;if(0===pieceLength)return!0;const buffer=this._buffers[piece.bufferIndex].buffer,lineStarts=this._buffers[piece.bufferIndex].lineStarts,pieceStartLine=piece.start.line,pieceEndLine=piece.end.line;let pieceStartOffset=lineStarts[pieceStartLine]+piece.start.column;if(danglingCR&&(10===buffer.charCodeAt(pieceStartOffset)&&(pieceStartOffset++,pieceLength--),lines[linesLength++]=currentLine,currentLine="",danglingCR=!1,0===pieceLength))return!0;if(pieceStartLine===pieceEndLine)return this._EOLNormalized||13!==buffer.charCodeAt(pieceStartOffset+pieceLength-1)?currentLine+=buffer.substr(pieceStartOffset,pieceLength):(danglingCR=!0,currentLine+=buffer.substr(pieceStartOffset,pieceLength-1)),!0;currentLine+=this._EOLNormalized?buffer.substring(pieceStartOffset,Math.max(pieceStartOffset,lineStarts[pieceStartLine+1]-this._EOLLength)):buffer.substring(pieceStartOffset,lineStarts[pieceStartLine+1]).replace(/(\r\n|\r|\n)$/,""),lines[linesLength++]=currentLine;for(let line=pieceStartLine+1;line<pieceEndLine;line++)currentLine=this._EOLNormalized?buffer.substring(lineStarts[line],lineStarts[line+1]-this._EOLLength):buffer.substring(lineStarts[line],lineStarts[line+1]).replace(/(\r\n|\r|\n)$/,""),lines[linesLength++]=currentLine;return this._EOLNormalized||13!==buffer.charCodeAt(lineStarts[pieceEndLine]+piece.end.column-1)?currentLine=buffer.substr(lineStarts[pieceEndLine],piece.end.column):(danglingCR=!0,0===piece.end.column?linesLength--:currentLine=buffer.substr(lineStarts[pieceEndLine],piece.end.column-1)),!0})),danglingCR&&(lines[linesLength++]=currentLine,currentLine=""),lines[linesLength++]=currentLine,lines}getLength(){return this._length}getLineCount(){return this._lineCnt}getLineContent(lineNumber){return this._lastVisitedLine.lineNumber===lineNumber||(this._lastVisitedLine.lineNumber=lineNumber,lineNumber===this._lineCnt?this._lastVisitedLine.value=this.getLineRawContent(lineNumber):this._EOLNormalized?this._lastVisitedLine.value=this.getLineRawContent(lineNumber,this._EOLLength):this._lastVisitedLine.value=this.getLineRawContent(lineNumber).replace(/(\r\n|\r|\n)$/,"")),this._lastVisitedLine.value}_getCharCode(nodePos){if(nodePos.remainder===nodePos.node.piece.length){const matchingNode=nodePos.node.next();if(!matchingNode)return 0;const buffer=this._buffers[matchingNode.piece.bufferIndex],startOffset=this.offsetInBuffer(matchingNode.piece.bufferIndex,matchingNode.piece.start);return buffer.buffer.charCodeAt(startOffset)}{const buffer=this._buffers[nodePos.node.piece.bufferIndex],targetOffset=this.offsetInBuffer(nodePos.node.piece.bufferIndex,nodePos.node.piece.start)+nodePos.remainder;return buffer.buffer.charCodeAt(targetOffset)}}getLineCharCode(lineNumber,index){const nodePos=this.nodeAt2(lineNumber,index+1);return this._getCharCode(nodePos)}getLineLength(lineNumber){if(lineNumber===this.getLineCount()){const startOffset=this.getOffsetAt(lineNumber,1);return this.getLength()-startOffset}return this.getOffsetAt(lineNumber+1,1)-this.getOffsetAt(lineNumber,1)-this._EOLLength}findMatchesInNode(node,searcher,startLineNumber,startColumn,startCursor,endCursor,searchData,captureMatches,limitResultCount,resultLen,result){const buffer=this._buffers[node.piece.bufferIndex],startOffsetInBuffer=this.offsetInBuffer(node.piece.bufferIndex,node.piece.start),start=this.offsetInBuffer(node.piece.bufferIndex,startCursor),end=this.offsetInBuffer(node.piece.bufferIndex,endCursor);let m;const ret={line:0,column:0};let searchText,offsetInBuffer;searcher._wordSeparators?(searchText=buffer.buffer.substring(start,end),offsetInBuffer=offset=>offset+start,searcher.reset(0)):(searchText=buffer.buffer,offsetInBuffer=offset=>offset,searcher.reset(start));do{if(m=searcher.next(searchText),m){if(offsetInBuffer(m.index)>=end)return resultLen;this.positionInBuffer(node,offsetInBuffer(m.index)-startOffsetInBuffer,ret);const lineFeedCnt=this.getLineFeedCnt(node.piece.bufferIndex,startCursor,ret),retStartColumn=ret.line===startCursor.line?ret.column-startCursor.column+startColumn:ret.column+1,retEndColumn=retStartColumn+m[0].length;if(result[resultLen++]=createFindMatch(new Range(startLineNumber+lineFeedCnt,retStartColumn,startLineNumber+lineFeedCnt,retEndColumn),m,captureMatches),offsetInBuffer(m.index)+m[0].length>=end)return resultLen;if(resultLen>=limitResultCount)return resultLen}}while(m);return resultLen}findMatchesLineByLine(searchRange,searchData,captureMatches,limitResultCount){const result=[];let resultLen=0;const searcher=new Searcher(searchData.wordSeparators,searchData.regex);let startPosition=this.nodeAt2(searchRange.startLineNumber,searchRange.startColumn);if(null===startPosition)return[];const endPosition=this.nodeAt2(searchRange.endLineNumber,searchRange.endColumn);if(null===endPosition)return[];let start=this.positionInBuffer(startPosition.node,startPosition.remainder);const end=this.positionInBuffer(endPosition.node,endPosition.remainder);if(startPosition.node===endPosition.node)return this.findMatchesInNode(startPosition.node,searcher,searchRange.startLineNumber,searchRange.startColumn,start,end,searchData,captureMatches,limitResultCount,resultLen,result),result;let startLineNumber=searchRange.startLineNumber,currentNode=startPosition.node;for(;currentNode!==endPosition.node;){const lineBreakCnt=this.getLineFeedCnt(currentNode.piece.bufferIndex,start,currentNode.piece.end);if(lineBreakCnt>=1){const lineStarts=this._buffers[currentNode.piece.bufferIndex].lineStarts,startOffsetInBuffer=this.offsetInBuffer(currentNode.piece.bufferIndex,currentNode.piece.start),nextLineStartOffset=lineStarts[start.line+lineBreakCnt],startColumn=startLineNumber===searchRange.startLineNumber?searchRange.startColumn:1;if(resultLen=this.findMatchesInNode(currentNode,searcher,startLineNumber,startColumn,start,this.positionInBuffer(currentNode,nextLineStartOffset-startOffsetInBuffer),searchData,captureMatches,limitResultCount,resultLen,result),resultLen>=limitResultCount)return result;startLineNumber+=lineBreakCnt}const startColumn=startLineNumber===searchRange.startLineNumber?searchRange.startColumn-1:0;if(startLineNumber===searchRange.endLineNumber){const text=this.getLineContent(startLineNumber).substring(startColumn,searchRange.endColumn-1);return resultLen=this._findMatchesInLine(searchData,searcher,text,searchRange.endLineNumber,startColumn,resultLen,result,captureMatches,limitResultCount),result}if(resultLen=this._findMatchesInLine(searchData,searcher,this.getLineContent(startLineNumber).substr(startColumn),startLineNumber,startColumn,resultLen,result,captureMatches,limitResultCount),resultLen>=limitResultCount)return result;startLineNumber++,startPosition=this.nodeAt2(startLineNumber,1),currentNode=startPosition.node,start=this.positionInBuffer(startPosition.node,startPosition.remainder)}if(startLineNumber===searchRange.endLineNumber){const startColumn=startLineNumber===searchRange.startLineNumber?searchRange.startColumn-1:0,text=this.getLineContent(startLineNumber).substring(startColumn,searchRange.endColumn-1);return resultLen=this._findMatchesInLine(searchData,searcher,text,searchRange.endLineNumber,startColumn,resultLen,result,captureMatches,limitResultCount),result}const startColumn=startLineNumber===searchRange.startLineNumber?searchRange.startColumn:1;return resultLen=this.findMatchesInNode(endPosition.node,searcher,startLineNumber,startColumn,start,end,searchData,captureMatches,limitResultCount,resultLen,result),result}_findMatchesInLine(searchData,searcher,text,lineNumber,deltaOffset,resultLen,result,captureMatches,limitResultCount){const wordSeparators=searchData.wordSeparators;if(!captureMatches&&searchData.simpleSearch){const searchString=searchData.simpleSearch,searchStringLen=searchString.length,textLength=text.length;let lastMatchIndex=-searchStringLen;for(;-1!==(lastMatchIndex=text.indexOf(searchString,lastMatchIndex+searchStringLen));)if((!wordSeparators||isValidMatch(wordSeparators,text,textLength,lastMatchIndex,searchStringLen))&&(result[resultLen++]=new FindMatch(new Range(lineNumber,lastMatchIndex+1+deltaOffset,lineNumber,lastMatchIndex+1+searchStringLen+deltaOffset),null),resultLen>=limitResultCount))return resultLen;return resultLen}let m;searcher.reset(0);do{if(m=searcher.next(text),m&&(result[resultLen++]=createFindMatch(new Range(lineNumber,m.index+1+deltaOffset,lineNumber,m.index+1+m[0].length+deltaOffset),m,captureMatches),resultLen>=limitResultCount))return resultLen}while(m);return resultLen}insert(offset,value,eolNormalized=!1){if(this._EOLNormalized=this._EOLNormalized&&eolNormalized,this._lastVisitedLine.lineNumber=0,this._lastVisitedLine.value="",this.root!==SENTINEL){const{node,remainder,nodeStartOffset}=this.nodeAt(offset),piece=node.piece,bufferIndex=piece.bufferIndex,insertPosInBuffer=this.positionInBuffer(node,remainder);if(0===node.piece.bufferIndex&&piece.end.line===this._lastChangeBufferPos.line&&piece.end.column===this._lastChangeBufferPos.column&&nodeStartOffset+piece.length===offset&&value.length<65535)return this.appendToNode(node,value),void this.computeBufferMetadata();if(nodeStartOffset===offset)this.insertContentToNodeLeft(value,node),this._searchCache.validate(offset);else if(nodeStartOffset+node.piece.length>offset){const nodesToDel=[];let newRightPiece=new Piece(piece.bufferIndex,insertPosInBuffer,piece.end,this.getLineFeedCnt(piece.bufferIndex,insertPosInBuffer,piece.end),this.offsetInBuffer(bufferIndex,piece.end)-this.offsetInBuffer(bufferIndex,insertPosInBuffer));if(this.shouldCheckCRLF()&&this.endWithCR(value)){if(10===this.nodeCharCodeAt(node,remainder)){const newStart={line:newRightPiece.start.line+1,column:0};newRightPiece=new Piece(newRightPiece.bufferIndex,newStart,newRightPiece.end,this.getLineFeedCnt(newRightPiece.bufferIndex,newStart,newRightPiece.end),newRightPiece.length-1),value+="\n"}}if(this.shouldCheckCRLF()&&this.startWithLF(value)){if(13===this.nodeCharCodeAt(node,remainder-1)){const previousPos=this.positionInBuffer(node,remainder-1);this.deleteNodeTail(node,previousPos),value="\r"+value,0===node.piece.length&&nodesToDel.push(node)}else this.deleteNodeTail(node,insertPosInBuffer)}else this.deleteNodeTail(node,insertPosInBuffer);const newPieces=this.createNewPieces(value);newRightPiece.length>0&&this.rbInsertRight(node,newRightPiece);let tmpNode=node;for(let k=0;k<newPieces.length;k++)tmpNode=this.rbInsertRight(tmpNode,newPieces[k]);this.deleteNodes(nodesToDel)}else this.insertContentToNodeRight(value,node)}else{const pieces=this.createNewPieces(value);let node=this.rbInsertLeft(null,pieces[0]);for(let k=1;k<pieces.length;k++)node=this.rbInsertRight(node,pieces[k])}this.computeBufferMetadata()}delete(offset,cnt){if(this._lastVisitedLine.lineNumber=0,this._lastVisitedLine.value="",cnt<=0||this.root===SENTINEL)return;const startPosition=this.nodeAt(offset),endPosition=this.nodeAt(offset+cnt),startNode=startPosition.node,endNode=endPosition.node;if(startNode===endNode){const startSplitPosInBuffer=this.positionInBuffer(startNode,startPosition.remainder),endSplitPosInBuffer=this.positionInBuffer(startNode,endPosition.remainder);if(startPosition.nodeStartOffset===offset){if(cnt===startNode.piece.length){const next=startNode.next();return rbDelete(this,startNode),this.validateCRLFWithPrevNode(next),void this.computeBufferMetadata()}return this.deleteNodeHead(startNode,endSplitPosInBuffer),this._searchCache.validate(offset),this.validateCRLFWithPrevNode(startNode),void this.computeBufferMetadata()}return startPosition.nodeStartOffset+startNode.piece.length===offset+cnt?(this.deleteNodeTail(startNode,startSplitPosInBuffer),this.validateCRLFWithNextNode(startNode),void this.computeBufferMetadata()):(this.shrinkNode(startNode,startSplitPosInBuffer,endSplitPosInBuffer),void this.computeBufferMetadata())}const nodesToDel=[],startSplitPosInBuffer=this.positionInBuffer(startNode,startPosition.remainder);this.deleteNodeTail(startNode,startSplitPosInBuffer),this._searchCache.validate(offset),0===startNode.piece.length&&nodesToDel.push(startNode);const endSplitPosInBuffer=this.positionInBuffer(endNode,endPosition.remainder);this.deleteNodeHead(endNode,endSplitPosInBuffer),0===endNode.piece.length&&nodesToDel.push(endNode);for(let node=startNode.next();node!==SENTINEL&&node!==endNode;node=node.next())nodesToDel.push(node);const prev=0===startNode.piece.length?startNode.prev():startNode;this.deleteNodes(nodesToDel),this.validateCRLFWithNextNode(prev),this.computeBufferMetadata()}insertContentToNodeLeft(value,node){const nodesToDel=[];if(this.shouldCheckCRLF()&&this.endWithCR(value)&&this.startWithLF(node)){const piece=node.piece,newStart={line:piece.start.line+1,column:0},nPiece=new Piece(piece.bufferIndex,newStart,piece.end,this.getLineFeedCnt(piece.bufferIndex,newStart,piece.end),piece.length-1);node.piece=nPiece,value+="\n",updateTreeMetadata(this,node,-1,-1),0===node.piece.length&&nodesToDel.push(node)}const newPieces=this.createNewPieces(value);let newNode=this.rbInsertLeft(node,newPieces[newPieces.length-1]);for(let k=newPieces.length-2;k>=0;k--)newNode=this.rbInsertLeft(newNode,newPieces[k]);this.validateCRLFWithPrevNode(newNode),this.deleteNodes(nodesToDel)}insertContentToNodeRight(value,node){this.adjustCarriageReturnFromNext(value,node)&&(value+="\n");const newPieces=this.createNewPieces(value),newNode=this.rbInsertRight(node,newPieces[0]);let tmpNode=newNode;for(let k=1;k<newPieces.length;k++)tmpNode=this.rbInsertRight(tmpNode,newPieces[k]);this.validateCRLFWithPrevNode(newNode)}positionInBuffer(node,remainder,ret){const piece=node.piece,bufferIndex=node.piece.bufferIndex,lineStarts=this._buffers[bufferIndex].lineStarts,offset=lineStarts[piece.start.line]+piece.start.column+remainder;let low=piece.start.line,high=piece.end.line,mid=0,midStop=0,midStart=0;for(;low<=high&&(mid=low+(high-low)/2|0,midStart=lineStarts[mid],mid!==high);)if(midStop=lineStarts[mid+1],offset<midStart)high=mid-1;else{if(!(offset>=midStop))break;low=mid+1}return ret?(ret.line=mid,ret.column=offset-midStart,null):{line:mid,column:offset-midStart}}getLineFeedCnt(bufferIndex,start,end){if(0===end.column)return end.line-start.line;const lineStarts=this._buffers[bufferIndex].lineStarts;if(end.line===lineStarts.length-1)return end.line-start.line;const nextLineStartOffset=lineStarts[end.line+1],endOffset=lineStarts[end.line]+end.column;if(nextLineStartOffset>endOffset+1)return end.line-start.line;const previousCharOffset=endOffset-1;return 13===this._buffers[bufferIndex].buffer.charCodeAt(previousCharOffset)?end.line-start.line+1:end.line-start.line}offsetInBuffer(bufferIndex,cursor){return this._buffers[bufferIndex].lineStarts[cursor.line]+cursor.column}deleteNodes(nodes){for(let i=0;i<nodes.length;i++)rbDelete(this,nodes[i])}createNewPieces(text){if(text.length>65535){const newPieces=[];for(;text.length>65535;){const lastChar=text.charCodeAt(65534);let splitText;13===lastChar||lastChar>=55296&&lastChar<=56319?(splitText=text.substring(0,65534),text=text.substring(65534)):(splitText=text.substring(0,65535),text=text.substring(65535));const lineStarts=createLineStartsFast(splitText);newPieces.push(new Piece(this._buffers.length,{line:0,column:0},{line:lineStarts.length-1,column:splitText.length-lineStarts[lineStarts.length-1]},lineStarts.length-1,splitText.length)),this._buffers.push(new StringBuffer(splitText,lineStarts))}const lineStarts=createLineStartsFast(text);return newPieces.push(new Piece(this._buffers.length,{line:0,column:0},{line:lineStarts.length-1,column:text.length-lineStarts[lineStarts.length-1]},lineStarts.length-1,text.length)),this._buffers.push(new StringBuffer(text,lineStarts)),newPieces}let startOffset=this._buffers[0].buffer.length;const lineStarts=createLineStartsFast(text,!1);let start=this._lastChangeBufferPos;if(this._buffers[0].lineStarts[this._buffers[0].lineStarts.length-1]===startOffset&&0!==startOffset&&this.startWithLF(text)&&this.endWithCR(this._buffers[0].buffer)){this._lastChangeBufferPos={line:this._lastChangeBufferPos.line,column:this._lastChangeBufferPos.column+1},start=this._lastChangeBufferPos;for(let i=0;i<lineStarts.length;i++)lineStarts[i]+=startOffset+1;this._buffers[0].lineStarts=this._buffers[0].lineStarts.concat(lineStarts.slice(1)),this._buffers[0].buffer+="_"+text,startOffset+=1}else{if(0!==startOffset)for(let i=0;i<lineStarts.length;i++)lineStarts[i]+=startOffset;this._buffers[0].lineStarts=this._buffers[0].lineStarts.concat(lineStarts.slice(1)),this._buffers[0].buffer+=text}const endOffset=this._buffers[0].buffer.length,endIndex=this._buffers[0].lineStarts.length-1,endPos={line:endIndex,column:endOffset-this._buffers[0].lineStarts[endIndex]},newPiece=new Piece(0,start,endPos,this.getLineFeedCnt(0,start,endPos),endOffset-startOffset);return this._lastChangeBufferPos=endPos,[newPiece]}getLineRawContent(lineNumber,endOffset=0){let x=this.root,ret="";const cache=this._searchCache.get2(lineNumber);if(cache){x=cache.node;const prevAccumulatedValue=this.getAccumulatedValue(x,lineNumber-cache.nodeStartLineNumber-1),buffer=this._buffers[x.piece.bufferIndex].buffer,startOffset=this.offsetInBuffer(x.piece.bufferIndex,x.piece.start);if(cache.nodeStartLineNumber+x.piece.lineFeedCnt!==lineNumber){const accumulatedValue=this.getAccumulatedValue(x,lineNumber-cache.nodeStartLineNumber);return buffer.substring(startOffset+prevAccumulatedValue,startOffset+accumulatedValue-endOffset)}ret=buffer.substring(startOffset+prevAccumulatedValue,startOffset+x.piece.length)}else{let nodeStartOffset=0;const originalLineNumber=lineNumber;for(;x!==SENTINEL;)if(x.left!==SENTINEL&&x.lf_left>=lineNumber-1)x=x.left;else{if(x.lf_left+x.piece.lineFeedCnt>lineNumber-1){const prevAccumulatedValue=this.getAccumulatedValue(x,lineNumber-x.lf_left-2),accumulatedValue=this.getAccumulatedValue(x,lineNumber-x.lf_left-1),buffer=this._buffers[x.piece.bufferIndex].buffer,startOffset=this.offsetInBuffer(x.piece.bufferIndex,x.piece.start);return nodeStartOffset+=x.size_left,this._searchCache.set({node:x,nodeStartOffset,nodeStartLineNumber:originalLineNumber-(lineNumber-1-x.lf_left)}),buffer.substring(startOffset+prevAccumulatedValue,startOffset+accumulatedValue-endOffset)}if(x.lf_left+x.piece.lineFeedCnt===lineNumber-1){const prevAccumulatedValue=this.getAccumulatedValue(x,lineNumber-x.lf_left-2),buffer=this._buffers[x.piece.bufferIndex].buffer,startOffset=this.offsetInBuffer(x.piece.bufferIndex,x.piece.start);ret=buffer.substring(startOffset+prevAccumulatedValue,startOffset+x.piece.length);break}lineNumber-=x.lf_left+x.piece.lineFeedCnt,nodeStartOffset+=x.size_left+x.piece.length,x=x.right}}for(x=x.next();x!==SENTINEL;){const buffer=this._buffers[x.piece.bufferIndex].buffer;if(x.piece.lineFeedCnt>0){const accumulatedValue=this.getAccumulatedValue(x,0),startOffset=this.offsetInBuffer(x.piece.bufferIndex,x.piece.start);return ret+=buffer.substring(startOffset,startOffset+accumulatedValue-endOffset),ret}{const startOffset=this.offsetInBuffer(x.piece.bufferIndex,x.piece.start);ret+=buffer.substr(startOffset,x.piece.length)}x=x.next()}return ret}computeBufferMetadata(){let x=this.root,lfCnt=1,len=0;for(;x!==SENTINEL;)lfCnt+=x.lf_left+x.piece.lineFeedCnt,len+=x.size_left+x.piece.length,x=x.right;this._lineCnt=lfCnt,this._length=len,this._searchCache.validate(this._length)}getIndexOf(node,accumulatedValue){const piece=node.piece,pos=this.positionInBuffer(node,accumulatedValue),lineCnt=pos.line-piece.start.line;if(this.offsetInBuffer(piece.bufferIndex,piece.end)-this.offsetInBuffer(piece.bufferIndex,piece.start)===accumulatedValue){const realLineCnt=this.getLineFeedCnt(node.piece.bufferIndex,piece.start,pos);if(realLineCnt!==lineCnt)return{index:realLineCnt,remainder:0}}return{index:lineCnt,remainder:pos.column}}getAccumulatedValue(node,index){if(index<0)return 0;const piece=node.piece,lineStarts=this._buffers[piece.bufferIndex].lineStarts,expectedLineStartIndex=piece.start.line+index+1;return expectedLineStartIndex>piece.end.line?lineStarts[piece.end.line]+piece.end.column-lineStarts[piece.start.line]-piece.start.column:lineStarts[expectedLineStartIndex]-lineStarts[piece.start.line]-piece.start.column}deleteNodeTail(node,pos){const piece=node.piece,originalLFCnt=piece.lineFeedCnt,originalEndOffset=this.offsetInBuffer(piece.bufferIndex,piece.end),newEnd=pos,newEndOffset=this.offsetInBuffer(piece.bufferIndex,newEnd),newLineFeedCnt=this.getLineFeedCnt(piece.bufferIndex,piece.start,newEnd),lf_delta=newLineFeedCnt-originalLFCnt,size_delta=newEndOffset-originalEndOffset,newLength=piece.length+size_delta;node.piece=new Piece(piece.bufferIndex,piece.start,newEnd,newLineFeedCnt,newLength),updateTreeMetadata(this,node,size_delta,lf_delta)}deleteNodeHead(node,pos){const piece=node.piece,originalLFCnt=piece.lineFeedCnt,originalStartOffset=this.offsetInBuffer(piece.bufferIndex,piece.start),newStart=pos,newLineFeedCnt=this.getLineFeedCnt(piece.bufferIndex,newStart,piece.end),lf_delta=newLineFeedCnt-originalLFCnt,size_delta=originalStartOffset-this.offsetInBuffer(piece.bufferIndex,newStart),newLength=piece.length+size_delta;node.piece=new Piece(piece.bufferIndex,newStart,piece.end,newLineFeedCnt,newLength),updateTreeMetadata(this,node,size_delta,lf_delta)}shrinkNode(node,start,end){const piece=node.piece,originalStartPos=piece.start,originalEndPos=piece.end,oldLength=piece.length,oldLFCnt=piece.lineFeedCnt,newEnd=start,newLineFeedCnt=this.getLineFeedCnt(piece.bufferIndex,piece.start,newEnd),newLength=this.offsetInBuffer(piece.bufferIndex,start)-this.offsetInBuffer(piece.bufferIndex,originalStartPos);node.piece=new Piece(piece.bufferIndex,piece.start,newEnd,newLineFeedCnt,newLength),updateTreeMetadata(this,node,newLength-oldLength,newLineFeedCnt-oldLFCnt);const newPiece=new Piece(piece.bufferIndex,end,originalEndPos,this.getLineFeedCnt(piece.bufferIndex,end,originalEndPos),this.offsetInBuffer(piece.bufferIndex,originalEndPos)-this.offsetInBuffer(piece.bufferIndex,end)),newNode=this.rbInsertRight(node,newPiece);this.validateCRLFWithPrevNode(newNode)}appendToNode(node,value){this.adjustCarriageReturnFromNext(value,node)&&(value+="\n");const hitCRLF=this.shouldCheckCRLF()&&this.startWithLF(value)&&this.endWithCR(node),startOffset=this._buffers[0].buffer.length;this._buffers[0].buffer+=value;const lineStarts=createLineStartsFast(value,!1);for(let i=0;i<lineStarts.length;i++)lineStarts[i]+=startOffset;if(hitCRLF){const prevStartOffset=this._buffers[0].lineStarts[this._buffers[0].lineStarts.length-2];this._buffers[0].lineStarts.pop(),this._lastChangeBufferPos={line:this._lastChangeBufferPos.line-1,column:startOffset-prevStartOffset}}this._buffers[0].lineStarts=this._buffers[0].lineStarts.concat(lineStarts.slice(1));const endIndex=this._buffers[0].lineStarts.length-1,newEnd={line:endIndex,column:this._buffers[0].buffer.length-this._buffers[0].lineStarts[endIndex]},newLength=node.piece.length+value.length,oldLineFeedCnt=node.piece.lineFeedCnt,newLineFeedCnt=this.getLineFeedCnt(0,node.piece.start,newEnd),lf_delta=newLineFeedCnt-oldLineFeedCnt;node.piece=new Piece(node.piece.bufferIndex,node.piece.start,newEnd,newLineFeedCnt,newLength),this._lastChangeBufferPos=newEnd,updateTreeMetadata(this,node,value.length,lf_delta)}nodeAt(offset){let x=this.root;const cache=this._searchCache.get(offset);if(cache)return{node:cache.node,nodeStartOffset:cache.nodeStartOffset,remainder:offset-cache.nodeStartOffset};let nodeStartOffset=0;for(;x!==SENTINEL;)if(x.size_left>offset)x=x.left;else{if(x.size_left+x.piece.length>=offset){nodeStartOffset+=x.size_left;const ret={node:x,remainder:offset-x.size_left,nodeStartOffset};return this._searchCache.set(ret),ret}offset-=x.size_left+x.piece.length,nodeStartOffset+=x.size_left+x.piece.length,x=x.right}return null}nodeAt2(lineNumber,column){let x=this.root,nodeStartOffset=0;for(;x!==SENTINEL;)if(x.left!==SENTINEL&&x.lf_left>=lineNumber-1)x=x.left;else{if(x.lf_left+x.piece.lineFeedCnt>lineNumber-1){const prevAccumualtedValue=this.getAccumulatedValue(x,lineNumber-x.lf_left-2),accumulatedValue=this.getAccumulatedValue(x,lineNumber-x.lf_left-1);return nodeStartOffset+=x.size_left,{node:x,remainder:Math.min(prevAccumualtedValue+column-1,accumulatedValue),nodeStartOffset}}if(x.lf_left+x.piece.lineFeedCnt===lineNumber-1){const prevAccumualtedValue=this.getAccumulatedValue(x,lineNumber-x.lf_left-2);if(prevAccumualtedValue+column-1<=x.piece.length)return{node:x,remainder:prevAccumualtedValue+column-1,nodeStartOffset};column-=x.piece.length-prevAccumualtedValue;break}lineNumber-=x.lf_left+x.piece.lineFeedCnt,nodeStartOffset+=x.size_left+x.piece.length,x=x.right}for(x=x.next();x!==SENTINEL;){if(x.piece.lineFeedCnt>0){const accumulatedValue=this.getAccumulatedValue(x,0),nodeStartOffset=this.offsetOfNode(x);return{node:x,remainder:Math.min(column-1,accumulatedValue),nodeStartOffset}}if(x.piece.length>=column-1){return{node:x,remainder:column-1,nodeStartOffset:this.offsetOfNode(x)}}column-=x.piece.length,x=x.next()}return null}nodeCharCodeAt(node,offset){if(node.piece.lineFeedCnt<1)return-1;const buffer=this._buffers[node.piece.bufferIndex],newOffset=this.offsetInBuffer(node.piece.bufferIndex,node.piece.start)+offset;return buffer.buffer.charCodeAt(newOffset)}offsetOfNode(node){if(!node)return 0;let pos=node.size_left;for(;node!==this.root;)node.parent.right===node&&(pos+=node.parent.size_left+node.parent.piece.length),node=node.parent;return pos}shouldCheckCRLF(){return!(this._EOLNormalized&&"\n"===this._EOL)}startWithLF(val){if("string"==typeof val)return 10===val.charCodeAt(0);if(val===SENTINEL||0===val.piece.lineFeedCnt)return!1;const piece=val.piece,lineStarts=this._buffers[piece.bufferIndex].lineStarts,line=piece.start.line,startOffset=lineStarts[line]+piece.start.column;if(line===lineStarts.length-1)return!1;return!(lineStarts[line+1]>startOffset+1)&&10===this._buffers[piece.bufferIndex].buffer.charCodeAt(startOffset)}endWithCR(val){return"string"==typeof val?13===val.charCodeAt(val.length-1):val!==SENTINEL&&0!==val.piece.lineFeedCnt&&13===this.nodeCharCodeAt(val,val.piece.length-1)}validateCRLFWithPrevNode(nextNode){if(this.shouldCheckCRLF()&&this.startWithLF(nextNode)){const node=nextNode.prev();this.endWithCR(node)&&this.fixCRLF(node,nextNode)}}validateCRLFWithNextNode(node){if(this.shouldCheckCRLF()&&this.endWithCR(node)){const nextNode=node.next();this.startWithLF(nextNode)&&this.fixCRLF(node,nextNode)}}fixCRLF(prev,next){const nodesToDel=[],lineStarts=this._buffers[prev.piece.bufferIndex].lineStarts;let newEnd;newEnd=0===prev.piece.end.column?{line:prev.piece.end.line-1,column:lineStarts[prev.piece.end.line]-lineStarts[prev.piece.end.line-1]-1}:{line:prev.piece.end.line,column:prev.piece.end.column-1};const prevNewLength=prev.piece.length-1,prevNewLFCnt=prev.piece.lineFeedCnt-1;prev.piece=new Piece(prev.piece.bufferIndex,prev.piece.start,newEnd,prevNewLFCnt,prevNewLength),updateTreeMetadata(this,prev,-1,-1),0===prev.piece.length&&nodesToDel.push(prev);const newStart={line:next.piece.start.line+1,column:0},newLength=next.piece.length-1,newLineFeedCnt=this.getLineFeedCnt(next.piece.bufferIndex,newStart,next.piece.end);next.piece=new Piece(next.piece.bufferIndex,newStart,next.piece.end,newLineFeedCnt,newLength),updateTreeMetadata(this,next,-1,-1),0===next.piece.length&&nodesToDel.push(next);const pieces=this.createNewPieces("\r\n");this.rbInsertRight(prev,pieces[0]);for(let i=0;i<nodesToDel.length;i++)rbDelete(this,nodesToDel[i])}adjustCarriageReturnFromNext(value,node){if(this.shouldCheckCRLF()&&this.endWithCR(value)){const nextNode=node.next();if(this.startWithLF(nextNode)){if(value+="\n",1===nextNode.piece.length)rbDelete(this,nextNode);else{const piece=nextNode.piece,newStart={line:piece.start.line+1,column:0},newLength=piece.length-1,newLineFeedCnt=this.getLineFeedCnt(piece.bufferIndex,newStart,piece.end);nextNode.piece=new Piece(piece.bufferIndex,newStart,piece.end,newLineFeedCnt,newLength),updateTreeMetadata(this,nextNode,-1,-1)}return!0}}return!1}iterate(node,callback){if(node===SENTINEL)return callback(SENTINEL);const leftRet=this.iterate(node.left,callback);return leftRet?callback(node)&&this.iterate(node.right,callback):leftRet}getNodeContent(node){if(node===SENTINEL)return"";const buffer=this._buffers[node.piece.bufferIndex];let currentContent;const piece=node.piece,startOffset=this.offsetInBuffer(piece.bufferIndex,piece.start),endOffset=this.offsetInBuffer(piece.bufferIndex,piece.end);return currentContent=buffer.buffer.substring(startOffset,endOffset),currentContent}getPieceContent(piece){const buffer=this._buffers[piece.bufferIndex],startOffset=this.offsetInBuffer(piece.bufferIndex,piece.start),endOffset=this.offsetInBuffer(piece.bufferIndex,piece.end);return buffer.buffer.substring(startOffset,endOffset)}rbInsertRight(node,p){const z=new TreeNode(p,1);z.left=SENTINEL,z.right=SENTINEL,z.parent=SENTINEL,z.size_left=0,z.lf_left=0;if(this.root===SENTINEL)this.root=z,z.color=0;else if(node.right===SENTINEL)node.right=z,z.parent=node;else{const nextNode=leftest(node.right);nextNode.left=z,z.parent=nextNode}return fixInsert(this,z),z}rbInsertLeft(node,p){const z=new TreeNode(p,1);if(z.left=SENTINEL,z.right=SENTINEL,z.parent=SENTINEL,z.size_left=0,z.lf_left=0,this.root===SENTINEL)this.root=z,z.color=0;else if(node.left===SENTINEL)node.left=z,z.parent=node;else{const prevNode=righttest(node.left);prevNode.right=z,z.parent=prevNode}return fixInsert(this,z),z}}