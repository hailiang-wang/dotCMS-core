import{LRUCache}from"./map.js";import*as strings from"./strings.js";export function or(...filter){return function(word,wordToMatchAgainst){for(let i=0,len=filter.length;i<len;i++){const match=filter[i](word,wordToMatchAgainst);if(match)return match}return null}}export const matchesStrictPrefix=_matchesPrefix.bind(void 0,!1);export const matchesPrefix=_matchesPrefix.bind(void 0,!0);function _matchesPrefix(ignoreCase,word,wordToMatchAgainst){if(!wordToMatchAgainst||wordToMatchAgainst.length<word.length)return null;let matches;return matches=ignoreCase?strings.startsWithIgnoreCase(wordToMatchAgainst,word):0===wordToMatchAgainst.indexOf(word),matches?word.length>0?[{start:0,end:word.length}]:[]:null}export function matchesContiguousSubString(word,wordToMatchAgainst){const index=wordToMatchAgainst.toLowerCase().indexOf(word.toLowerCase());return-1===index?null:[{start:index,end:index+word.length}]}export function matchesSubString(word,wordToMatchAgainst){return _matchesSubString(word.toLowerCase(),wordToMatchAgainst.toLowerCase(),0,0)}function _matchesSubString(word,wordToMatchAgainst,i,j){if(i===word.length)return[];if(j===wordToMatchAgainst.length)return null;if(word[i]===wordToMatchAgainst[j]){let result=null;return(result=_matchesSubString(word,wordToMatchAgainst,i+1,j+1))?join({start:j,end:j+1},result):null}return _matchesSubString(word,wordToMatchAgainst,i,j+1)}function isLower(code){return 97<=code&&code<=122}export function isUpper(code){return 65<=code&&code<=90}function isNumber(code){return 48<=code&&code<=57}function isWhitespace(code){return 32===code||9===code||10===code||13===code}const wordSeparators=new Set;function isWordSeparator(code){return isWhitespace(code)||wordSeparators.has(code)}function charactersMatch(codeA,codeB){return codeA===codeB||isWordSeparator(codeA)&&isWordSeparator(codeB)}function isAlphanumeric(code){return isLower(code)||isUpper(code)||isNumber(code)}function join(head,tail){return 0===tail.length?tail=[head]:head.end===tail[0].start?tail[0].start=head.start:tail.unshift(head),tail}function nextAnchor(camelCaseWord,start){for(let i=start;i<camelCaseWord.length;i++){const c=camelCaseWord.charCodeAt(i);if(isUpper(c)||isNumber(c)||i>0&&!isAlphanumeric(camelCaseWord.charCodeAt(i-1)))return i}return camelCaseWord.length}function _matchesCamelCase(word,camelCaseWord,i,j){if(i===word.length)return[];if(j===camelCaseWord.length)return null;if(word[i]!==camelCaseWord[j].toLowerCase())return null;{let result=null,nextUpperIndex=j+1;for(result=_matchesCamelCase(word,camelCaseWord,i+1,j+1);!result&&(nextUpperIndex=nextAnchor(camelCaseWord,nextUpperIndex))<camelCaseWord.length;)result=_matchesCamelCase(word,camelCaseWord,i+1,nextUpperIndex),nextUpperIndex++;return null===result?null:join({start:j,end:j+1},result)}}function analyzeCamelCaseWord(word){let upper=0,lower=0,alpha=0,numeric=0,code=0;for(let i=0;i<word.length;i++)code=word.charCodeAt(i),isUpper(code)&&upper++,isLower(code)&&lower++,isAlphanumeric(code)&&alpha++,isNumber(code)&&numeric++;return{upperPercent:upper/word.length,lowerPercent:lower/word.length,alphaPercent:alpha/word.length,numericPercent:numeric/word.length}}function isUpperCaseWord(analysis){const{upperPercent,lowerPercent}=analysis;return 0===lowerPercent&&upperPercent>.6}function isCamelCaseWord(analysis){const{upperPercent,lowerPercent,alphaPercent,numericPercent}=analysis;return lowerPercent>.2&&upperPercent<.8&&alphaPercent>.6&&numericPercent<.2}function isCamelCasePattern(word){let upper=0,lower=0,code=0,whitespace=0;for(let i=0;i<word.length;i++)code=word.charCodeAt(i),isUpper(code)&&upper++,isLower(code)&&lower++,isWhitespace(code)&&whitespace++;return 0!==upper&&0!==lower||0!==whitespace?upper<=5:word.length<=30}"()[]{}<>`'\"-/;:,.?!".split("").forEach((s=>wordSeparators.add(s.charCodeAt(0))));export function matchesCamelCase(word,camelCaseWord){if(!camelCaseWord)return null;if(0===(camelCaseWord=camelCaseWord.trim()).length)return null;if(!isCamelCasePattern(word))return null;if(camelCaseWord.length>60)return null;const analysis=analyzeCamelCaseWord(camelCaseWord);if(!isCamelCaseWord(analysis)){if(!isUpperCaseWord(analysis))return null;camelCaseWord=camelCaseWord.toLowerCase()}let result=null,i=0;for(word=word.toLowerCase();i<camelCaseWord.length&&null===(result=_matchesCamelCase(word,camelCaseWord,0,i));)i=nextAnchor(camelCaseWord,i+1);return result}export function matchesWords(word,target,contiguous=!1){if(!target||0===target.length)return null;let result=null,i=0;for(word=word.toLowerCase(),target=target.toLowerCase();i<target.length&&null===(result=_matchesWords(word,target,0,i,contiguous));)i=nextWord(target,i+1);return result}function _matchesWords(word,target,i,j,contiguous){if(i===word.length)return[];if(j===target.length)return null;if(charactersMatch(word.charCodeAt(i),target.charCodeAt(j))){let result=null,nextWordIndex=j+1;if(result=_matchesWords(word,target,i+1,j+1,contiguous),!contiguous)for(;!result&&(nextWordIndex=nextWord(target,nextWordIndex))<target.length;)result=_matchesWords(word,target,i+1,nextWordIndex,contiguous),nextWordIndex++;return null===result?null:join({start:j,end:j+1},result)}return null}function nextWord(word,start){for(let i=start;i<word.length;i++)if(isWordSeparator(word.charCodeAt(i))||i>0&&isWordSeparator(word.charCodeAt(i-1)))return i;return word.length}const fuzzyContiguousFilter=or(matchesPrefix,matchesCamelCase,matchesContiguousSubString),fuzzySeparateFilter=or(matchesPrefix,matchesCamelCase,matchesSubString),fuzzyRegExpCache=new LRUCache(1e4);export function matchesFuzzy(word,wordToMatchAgainst,enableSeparateSubstringMatching=!1){if("string"!=typeof word||"string"!=typeof wordToMatchAgainst)return null;let regexp=fuzzyRegExpCache.get(word);regexp||(regexp=new RegExp(strings.convertSimple2RegExpPattern(word),"i"),fuzzyRegExpCache.set(word,regexp));const match=regexp.exec(wordToMatchAgainst);return match?[{start:match.index,end:match.index+match[0].length}]:enableSeparateSubstringMatching?fuzzySeparateFilter(word,wordToMatchAgainst):fuzzyContiguousFilter(word,wordToMatchAgainst)}export function anyScore(pattern,lowPattern,patternPos,word,lowWord,wordPos){const max=Math.min(13,pattern.length);for(;patternPos<max;patternPos++){const result=fuzzyScore(pattern,lowPattern,patternPos,word,lowWord,wordPos,!1);if(result)return result}return[0,wordPos]}export function createMatches(score){if(void 0===score)return[];const res=[],wordPos=score[1];for(let i=score.length-1;i>1;i--){const pos=score[i]+wordPos,last=res[res.length-1];last&&last.end===pos?last.end=pos+1:res.push({start:pos,end:pos+1})}return res}const _maxLen=128;function initTable(){const table=[],row=[];for(let i=0;i<=128;i++)row[i]=0;for(let i=0;i<=128;i++)table.push(row.slice(0));return table}function initArr(maxLen){const row=[];for(let i=0;i<=maxLen;i++)row[i]=0;return row}const _minWordMatchPos=initArr(256),_maxWordMatchPos=initArr(256),_diag=initTable(),_table=initTable(),_arrows=initTable(),_debug=!1;function printTable(table,pattern,patternLen,word,wordLen){function pad(s,n,pad=" "){for(;s.length<n;)s=pad+s;return s}let ret=` |   |${word.split("").map((c=>pad(c,3))).join("|")}\n`;for(let i=0;i<=patternLen;i++)ret+=0===i?" |":`${pattern[i-1]}|`,ret+=table[i].slice(0,wordLen+1).map((n=>pad(n.toString(),3))).join("|")+"\n";return ret}function printTables(pattern,patternStart,word,wordStart){pattern=pattern.substr(patternStart),word=word.substr(wordStart),console.log(printTable(_table,pattern,pattern.length,word,word.length)),console.log(printTable(_arrows,pattern,pattern.length,word,word.length)),console.log(printTable(_diag,pattern,pattern.length,word,word.length))}function isSeparatorAtPos(value,index){if(index<0||index>=value.length)return!1;const code=value.codePointAt(index);switch(code){case 95:case 45:case 46:case 32:case 47:case 92:case 39:case 34:case 58:case 36:case 60:case 40:case 91:return!0;case void 0:return!1;default:return!!strings.isEmojiImprecise(code)}}function isWhitespaceAtPos(value,index){if(index<0||index>=value.length)return!1;switch(value.charCodeAt(index)){case 32:case 9:return!0;default:return!1}}function isUpperCaseAtPos(pos,word,wordLow){return word[pos]!==wordLow[pos]}export function isPatternInWord(patternLow,patternPos,patternLen,wordLow,wordPos,wordLen,fillMinWordPosArr=!1){for(;patternPos<patternLen&&wordPos<wordLen;)patternLow[patternPos]===wordLow[wordPos]&&(fillMinWordPosArr&&(_minWordMatchPos[patternPos]=wordPos),patternPos+=1),wordPos+=1;return patternPos===patternLen}export var FuzzyScore;!function(FuzzyScore){FuzzyScore.Default=[-100,0],FuzzyScore.isDefault=function isDefault(score){return!score||2===score.length&&-100===score[0]&&0===score[1]}}(FuzzyScore||(FuzzyScore={}));export function fuzzyScore(pattern,patternLow,patternStart,word,wordLow,wordStart,firstMatchCanBeWeak){const patternLen=pattern.length>128?128:pattern.length,wordLen=word.length>128?128:word.length;if(patternStart>=patternLen||wordStart>=wordLen||patternLen-patternStart>wordLen-wordStart)return;if(!isPatternInWord(patternLow,patternStart,patternLen,wordLow,wordStart,wordLen,!0))return;_fillInMaxWordMatchPos(patternLen,wordLen,patternStart,wordStart,patternLow,wordLow);let row=1,column=1,patternPos=patternStart,wordPos=wordStart;const hasStrongFirstMatch=[!1];for(row=1,patternPos=patternStart;patternPos<patternLen;row++,patternPos++){const minWordMatchPos=_minWordMatchPos[patternPos],maxWordMatchPos=_maxWordMatchPos[patternPos],nextMaxWordMatchPos=patternPos+1<patternLen?_maxWordMatchPos[patternPos+1]:wordLen;for(column=minWordMatchPos-wordStart+1,wordPos=minWordMatchPos;wordPos<nextMaxWordMatchPos;column++,wordPos++){let score=Number.MIN_SAFE_INTEGER,canComeDiag=!1;wordPos<=maxWordMatchPos&&(score=_doScore(pattern,patternLow,patternPos,patternStart,word,wordLow,wordPos,wordLen,wordStart,0===_diag[row-1][column-1],hasStrongFirstMatch));let diagScore=0;score!==Number.MAX_SAFE_INTEGER&&(canComeDiag=!0,diagScore=score+_table[row-1][column-1]);const canComeLeft=wordPos>minWordMatchPos,leftScore=canComeLeft?_table[row][column-1]+(_diag[row][column-1]>0?-5:0):0,canComeLeftLeft=wordPos>minWordMatchPos+1&&_diag[row][column-1]>0,leftLeftScore=canComeLeftLeft?_table[row][column-2]+(_diag[row][column-2]>0?-5:0):0;if(canComeLeftLeft&&(!canComeLeft||leftLeftScore>=leftScore)&&(!canComeDiag||leftLeftScore>=diagScore))_table[row][column]=leftLeftScore,_arrows[row][column]=3,_diag[row][column]=0;else if(canComeLeft&&(!canComeDiag||leftScore>=diagScore))_table[row][column]=leftScore,_arrows[row][column]=2,_diag[row][column]=0;else{if(!canComeDiag)throw new Error("not possible");_table[row][column]=diagScore,_arrows[row][column]=1,_diag[row][column]=_diag[row-1][column-1]+1}}}if(!hasStrongFirstMatch[0]&&!firstMatchCanBeWeak)return;row--,column--;const result=[_table[row][column],wordStart];let backwardsDiagLength=0,maxMatchColumn=0;for(;row>=1;){let diagColumn=column;do{const arrow=_arrows[row][diagColumn];if(3===arrow)diagColumn-=2;else{if(2!==arrow)break;diagColumn-=1}}while(diagColumn>=1);backwardsDiagLength>1&&patternLow[patternStart+row-1]===wordLow[wordStart+column-1]&&!isUpperCaseAtPos(diagColumn+wordStart-1,word,wordLow)&&backwardsDiagLength+1>_diag[row][diagColumn]&&(diagColumn=column),diagColumn===column?backwardsDiagLength++:backwardsDiagLength=1,maxMatchColumn||(maxMatchColumn=diagColumn),row--,column=diagColumn-1,result.push(column)}wordLen===patternLen&&(result[0]+=2);const skippedCharsCount=maxMatchColumn-patternLen;return result[0]-=skippedCharsCount,result}function _fillInMaxWordMatchPos(patternLen,wordLen,patternStart,wordStart,patternLow,wordLow){let patternPos=patternLen-1,wordPos=wordLen-1;for(;patternPos>=patternStart&&wordPos>=wordStart;)patternLow[patternPos]===wordLow[wordPos]&&(_maxWordMatchPos[patternPos]=wordPos,patternPos--),wordPos--}function _doScore(pattern,patternLow,patternPos,patternStart,word,wordLow,wordPos,wordLen,wordStart,newMatchStart,outFirstMatchStrong){if(patternLow[patternPos]!==wordLow[wordPos])return Number.MIN_SAFE_INTEGER;let score=1,isGapLocation=!1;return wordPos===patternPos-patternStart?score=pattern[patternPos]===word[wordPos]?7:5:!isUpperCaseAtPos(wordPos,word,wordLow)||0!==wordPos&&isUpperCaseAtPos(wordPos-1,word,wordLow)?!isSeparatorAtPos(wordLow,wordPos)||0!==wordPos&&isSeparatorAtPos(wordLow,wordPos-1)?(isSeparatorAtPos(wordLow,wordPos-1)||isWhitespaceAtPos(wordLow,wordPos-1))&&(score=5,isGapLocation=!0):score=5:(score=pattern[patternPos]===word[wordPos]?7:5,isGapLocation=!0),score>1&&patternPos===patternStart&&(outFirstMatchStrong[0]=!0),isGapLocation||(isGapLocation=isUpperCaseAtPos(wordPos,word,wordLow)||isSeparatorAtPos(wordLow,wordPos-1)||isWhitespaceAtPos(wordLow,wordPos-1)),patternPos===patternStart?wordPos>wordStart&&(score-=isGapLocation?3:5):score+=newMatchStart?isGapLocation?2:0:isGapLocation?0:1,wordPos+1===wordLen&&(score-=isGapLocation?3:5),score}export function fuzzyScoreGracefulAggressive(pattern,lowPattern,patternPos,word,lowWord,wordPos,firstMatchCanBeWeak){return fuzzyScoreWithPermutations(pattern,lowPattern,patternPos,word,lowWord,wordPos,!0,firstMatchCanBeWeak)}function fuzzyScoreWithPermutations(pattern,lowPattern,patternPos,word,lowWord,wordPos,aggressive,firstMatchCanBeWeak){let top=fuzzyScore(pattern,lowPattern,patternPos,word,lowWord,wordPos,firstMatchCanBeWeak);if(top&&!aggressive)return top;if(pattern.length>=3){const tries=Math.min(7,pattern.length-1);for(let movingPatternPos=patternPos+1;movingPatternPos<tries;movingPatternPos++){const newPattern=nextTypoPermutation(pattern,movingPatternPos);if(newPattern){const candidate=fuzzyScore(newPattern,newPattern.toLowerCase(),patternPos,word,lowWord,wordPos,firstMatchCanBeWeak);candidate&&(candidate[0]-=3,(!top||candidate[0]>top[0])&&(top=candidate))}}}return top}function nextTypoPermutation(pattern,patternPos){if(patternPos+1>=pattern.length)return;const swap1=pattern[patternPos],swap2=pattern[patternPos+1];return swap1!==swap2?pattern.slice(0,patternPos)+swap2+swap1+pattern.slice(patternPos+2):void 0}