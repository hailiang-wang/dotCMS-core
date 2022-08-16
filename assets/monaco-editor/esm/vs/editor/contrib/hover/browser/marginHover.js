import*as dom from"../../../../base/browser/dom.js";import{asArray}from"../../../../base/common/arrays.js";import{isEmptyMarkdownString}from"../../../../base/common/htmlContent.js";import{Disposable,DisposableStore}from"../../../../base/common/lifecycle.js";import{MarkdownRenderer}from"../../markdownRenderer/browser/markdownRenderer.js";import{HoverOperation}from"./hoverOperation.js";import{NullOpenerService}from"../../../../platform/opener/common/opener.js";import{HoverWidget}from"../../../../base/browser/ui/hover/hoverWidget.js";const $=dom.$;export class MarginHoverWidget extends Disposable{constructor(editor,languageService,openerService=NullOpenerService){super(),this._renderDisposeables=this._register(new DisposableStore),this._editor=editor,this._isVisible=!1,this._messages=[],this._hover=this._register(new HoverWidget),this._hover.containerDomNode.classList.toggle("hidden",!this._isVisible),this._markdownRenderer=this._register(new MarkdownRenderer({editor:this._editor},languageService,openerService)),this._computer=new MarginHoverComputer(this._editor),this._hoverOperation=this._register(new HoverOperation(this._editor,this._computer)),this._register(this._hoverOperation.onResult((result=>{this._withResult(result.value)}))),this._register(this._editor.onDidChangeModelDecorations((()=>this._onModelDecorationsChanged()))),this._register(this._editor.onDidChangeConfiguration((e=>{e.hasChanged(44)&&this._updateFont()}))),this._editor.addOverlayWidget(this)}dispose(){this._editor.removeOverlayWidget(this),super.dispose()}getId(){return MarginHoverWidget.ID}getDomNode(){return this._hover.containerDomNode}getPosition(){return null}_updateFont(){Array.prototype.slice.call(this._hover.contentsDomNode.getElementsByClassName("code")).forEach((node=>this._editor.applyFontInfo(node)))}_onModelDecorationsChanged(){this._isVisible&&(this._hoverOperation.cancel(),this._hoverOperation.start(0))}startShowingAt(lineNumber){this._computer.lineNumber!==lineNumber&&(this._hoverOperation.cancel(),this.hide(),this._computer.lineNumber=lineNumber,this._hoverOperation.start(0))}hide(){this._computer.lineNumber=-1,this._hoverOperation.cancel(),this._isVisible&&(this._isVisible=!1,this._hover.containerDomNode.classList.toggle("hidden",!this._isVisible))}_withResult(result){this._messages=result,this._messages.length>0?this._renderMessages(this._computer.lineNumber,this._messages):this.hide()}_renderMessages(lineNumber,messages){this._renderDisposeables.clear();const fragment=document.createDocumentFragment();for(const msg of messages){const markdownHoverElement=$("div.hover-row.markdown-hover"),hoverContentsElement=dom.append(markdownHoverElement,$("div.hover-contents")),renderedContents=this._renderDisposeables.add(this._markdownRenderer.render(msg.value));hoverContentsElement.appendChild(renderedContents.element),fragment.appendChild(markdownHoverElement)}this._updateContents(fragment),this._showAt(lineNumber)}_updateContents(node){this._hover.contentsDomNode.textContent="",this._hover.contentsDomNode.appendChild(node),this._updateFont()}_showAt(lineNumber){this._isVisible||(this._isVisible=!0,this._hover.containerDomNode.classList.toggle("hidden",!this._isVisible));const editorLayout=this._editor.getLayoutInfo(),topForLineNumber=this._editor.getTopForLineNumber(lineNumber),editorScrollTop=this._editor.getScrollTop(),lineHeight=this._editor.getOption(59),top=topForLineNumber-editorScrollTop-(this._hover.containerDomNode.clientHeight-lineHeight)/2;this._hover.containerDomNode.style.left=`${editorLayout.glyphMarginLeft+editorLayout.glyphMarginWidth}px`,this._hover.containerDomNode.style.top=`${Math.max(Math.round(top),0)}px`}}MarginHoverWidget.ID="editor.contrib.modesGlyphHoverWidget";class MarginHoverComputer{constructor(_editor){this._editor=_editor,this._lineNumber=-1}get lineNumber(){return this._lineNumber}set lineNumber(value){this._lineNumber=value}computeSync(){const toHoverMessage=contents=>({value:contents}),lineDecorations=this._editor.getLineDecorations(this._lineNumber),result=[];if(!lineDecorations)return result;for(const d of lineDecorations){if(!d.options.glyphMarginClassName)continue;const hoverMessage=d.options.glyphMarginHoverMessage;hoverMessage&&!isEmptyMarkdownString(hoverMessage)&&result.push(...asArray(hoverMessage).map(toHoverMessage))}return result}}