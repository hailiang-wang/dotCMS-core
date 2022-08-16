import*as dom from"../../../../base/browser/dom.js";import{renderLabelWithIcons}from"../../../../base/browser/ui/iconLabel/iconLabels.js";import"./codelensWidget.css";import{Range}from"../../../common/core/range.js";import{ModelDecorationOptions}from"../../../common/model/textModel.js";class CodeLensViewZone{constructor(afterLineNumber,heightInPx,onHeight){this.afterColumn=1073741824,this.afterLineNumber=afterLineNumber,this.heightInPx=heightInPx,this._onHeight=onHeight,this.suppressMouseDown=!0,this.domNode=document.createElement("div")}onComputedHeight(height){void 0===this._lastHeight?this._lastHeight=height:this._lastHeight!==height&&(this._lastHeight=height,this._onHeight())}isVisible(){return 0!==this._lastHeight&&this.domNode.hasAttribute("monaco-visible-view-zone")}}class CodeLensContentWidget{constructor(editor,className,line){this.allowEditorOverflow=!1,this.suppressMouseDown=!0,this._commands=new Map,this._isEmpty=!0,this._editor=editor,this._id="codelens.widget-"+CodeLensContentWidget._idPool++,this.updatePosition(line),this._domNode=document.createElement("span"),this._domNode.className=`codelens-decoration ${className}`}withCommands(lenses,animate){this._commands.clear();let children=[],hasSymbol=!1;for(let i=0;i<lenses.length;i++){const lens=lenses[i];if(lens&&(hasSymbol=!0,lens.command)){const title=renderLabelWithIcons(lens.command.title.trim());lens.command.id?(children.push(dom.$("a",{id:String(i),title:lens.command.tooltip},...title)),this._commands.set(String(i),lens.command)):children.push(dom.$("span",{title:lens.command.tooltip},...title)),i+1<lenses.length&&children.push(dom.$("span",void 0," | "))}}hasSymbol?(dom.reset(this._domNode,...children),this._isEmpty&&animate&&this._domNode.classList.add("fadein"),this._isEmpty=!1):dom.reset(this._domNode,dom.$("span",void 0,"no commands"))}getCommand(link){return link.parentElement===this._domNode?this._commands.get(link.id):void 0}getId(){return this._id}getDomNode(){return this._domNode}updatePosition(line){const column=this._editor.getModel().getLineFirstNonWhitespaceColumn(line);this._widgetPosition={position:{lineNumber:line,column},preference:[1]}}getPosition(){return this._widgetPosition||null}}CodeLensContentWidget._idPool=0;export class CodeLensHelper{constructor(){this._removeDecorations=[],this._addDecorations=[],this._addDecorationsCallbacks=[]}addDecoration(decoration,callback){this._addDecorations.push(decoration),this._addDecorationsCallbacks.push(callback)}removeDecoration(decorationId){this._removeDecorations.push(decorationId)}commit(changeAccessor){let resultingDecorations=changeAccessor.deltaDecorations(this._removeDecorations,this._addDecorations);for(let i=0,len=resultingDecorations.length;i<len;i++)this._addDecorationsCallbacks[i](resultingDecorations[i])}}export class CodeLensWidget{constructor(data,editor,className,helper,viewZoneChangeAccessor,heightInPx,updateCallback){let range;this._isDisposed=!1,this._editor=editor,this._className=className,this._data=data,this._decorationIds=[];let lenses=[];this._data.forEach(((codeLensData,i)=>{codeLensData.symbol.command&&lenses.push(codeLensData.symbol),helper.addDecoration({range:codeLensData.symbol.range,options:ModelDecorationOptions.EMPTY},(id=>this._decorationIds[i]=id)),range=range?Range.plusRange(range,codeLensData.symbol.range):Range.lift(codeLensData.symbol.range)})),this._viewZone=new CodeLensViewZone(range.startLineNumber-1,heightInPx,updateCallback),this._viewZoneId=viewZoneChangeAccessor.addZone(this._viewZone),lenses.length>0&&(this._createContentWidgetIfNecessary(),this._contentWidget.withCommands(lenses,!1))}_createContentWidgetIfNecessary(){this._contentWidget?this._editor.layoutContentWidget(this._contentWidget):(this._contentWidget=new CodeLensContentWidget(this._editor,this._className,this._viewZone.afterLineNumber+1),this._editor.addContentWidget(this._contentWidget))}dispose(helper,viewZoneChangeAccessor){this._decorationIds.forEach(helper.removeDecoration,helper),this._decorationIds=[],viewZoneChangeAccessor&&viewZoneChangeAccessor.removeZone(this._viewZoneId),this._contentWidget&&(this._editor.removeContentWidget(this._contentWidget),this._contentWidget=void 0),this._isDisposed=!0}isDisposed(){return this._isDisposed}isValid(){return this._decorationIds.some(((id,i)=>{const range=this._editor.getModel().getDecorationRange(id),symbol=this._data[i].symbol;return!(!range||Range.isEmpty(symbol.range)!==range.isEmpty())}))}updateCodeLensSymbols(data,helper){this._decorationIds.forEach(helper.removeDecoration,helper),this._decorationIds=[],this._data=data,this._data.forEach(((codeLensData,i)=>{helper.addDecoration({range:codeLensData.symbol.range,options:ModelDecorationOptions.EMPTY},(id=>this._decorationIds[i]=id))}))}updateHeight(height,viewZoneChangeAccessor){this._viewZone.heightInPx=height,viewZoneChangeAccessor.layoutZone(this._viewZoneId),this._contentWidget&&this._editor.layoutContentWidget(this._contentWidget)}computeIfNecessary(model){if(!this._viewZone.isVisible())return null;for(let i=0;i<this._decorationIds.length;i++){const range=model.getDecorationRange(this._decorationIds[i]);range&&(this._data[i].symbol.range=range)}return this._data}updateCommands(symbols){this._createContentWidgetIfNecessary(),this._contentWidget.withCommands(symbols,!0);for(let i=0;i<this._data.length;i++){const resolved=symbols[i];if(resolved){const{symbol}=this._data[i];symbol.command=resolved.command||symbol.command}}}getCommand(link){var _a;return null===(_a=this._contentWidget)||void 0===_a?void 0:_a.getCommand(link)}getLineNumber(){const range=this._editor.getModel().getDecorationRange(this._decorationIds[0]);return range?range.startLineNumber:-1}update(viewZoneChangeAccessor){if(this.isValid()){const range=this._editor.getModel().getDecorationRange(this._decorationIds[0]);range&&(this._viewZone.afterLineNumber=range.startLineNumber-1,viewZoneChangeAccessor.layoutZone(this._viewZoneId),this._contentWidget&&(this._contentWidget.updatePosition(range.startLineNumber),this._editor.layoutContentWidget(this._contentWidget)))}}}