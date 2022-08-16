var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{binarySearch,isFalsyOrEmpty}from"../../../../base/common/arrays.js";import{Range}from"../../../common/core/range.js";import{BracketSelectionRangeProvider}from"../../smartSelect/browser/bracketSelections.js";export class WordDistance{static create(service,editor){return __awaiter(this,void 0,void 0,(function*(){if(!editor.getOption(106).localityBonus)return WordDistance.None;if(!editor.hasModel())return WordDistance.None;const model=editor.getModel(),position=editor.getPosition();if(!service.canComputeWordRanges(model.uri))return WordDistance.None;const[ranges]=yield(new BracketSelectionRangeProvider).provideSelectionRanges(model,[position]);if(0===ranges.length)return WordDistance.None;const wordRanges=yield service.computeWordRanges(model.uri,ranges[0].range);if(!wordRanges)return WordDistance.None;const wordUntilPos=model.getWordUntilPosition(position);return delete wordRanges[wordUntilPos.word],new class extends WordDistance{distance(anchor,item){if(!position.equals(editor.getPosition()))return 0;if(17===item.kind)return 2<<20;let word="string"==typeof item.label?item.label:item.label.label,wordLines=wordRanges[word];if(isFalsyOrEmpty(wordLines))return 2<<20;let idx=binarySearch(wordLines,Range.fromPositions(anchor),Range.compareRangesUsingStarts),bestWordRange=idx>=0?wordLines[idx]:wordLines[Math.max(0,~idx-1)],blockDistance=ranges.length;for(const range of ranges){if(!Range.containsRange(range.range,bestWordRange))break;blockDistance-=1}return blockDistance}}}))}}WordDistance.None=new class extends WordDistance{distance(){return 0}};