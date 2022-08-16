import*as dom from"../../../../base/browser/dom.js";import{Sash}from"../../../../base/browser/ui/sash/sash.js";import{Color,RGBA}from"../../../../base/common/color.js";import{IdGenerator}from"../../../../base/common/idGenerator.js";import{DisposableStore}from"../../../../base/common/lifecycle.js";import*as objects from"../../../../base/common/objects.js";import"./zoneWidget.css";import{Range}from"../../../common/core/range.js";import{ModelDecorationOptions}from"../../../common/model/textModel.js";const defaultColor=new Color(new RGBA(0,122,204)),defaultOptions={showArrow:!0,showFrame:!0,className:"",frameColor:defaultColor,arrowColor:defaultColor,keepEditorSelection:!1},WIDGET_ID="vs.editor.contrib.zoneWidget";export class ViewZoneDelegate{constructor(domNode,afterLineNumber,afterColumn,heightInLines,onDomNodeTop,onComputedHeight){this.id="",this.domNode=domNode,this.afterLineNumber=afterLineNumber,this.afterColumn=afterColumn,this.heightInLines=heightInLines,this._onDomNodeTop=onDomNodeTop,this._onComputedHeight=onComputedHeight}onDomNodeTop(top){this._onDomNodeTop(top)}onComputedHeight(height){this._onComputedHeight(height)}}export class OverlayWidgetDelegate{constructor(id,domNode){this._id=id,this._domNode=domNode}getId(){return this._id}getDomNode(){return this._domNode}getPosition(){return null}}class Arrow{constructor(_editor){this._editor=_editor,this._ruleName=Arrow._IdGenerator.nextId(),this._decorations=[],this._color=null,this._height=-1}dispose(){this.hide(),dom.removeCSSRulesContainingSelector(this._ruleName)}set color(value){this._color!==value&&(this._color=value,this._updateStyle())}set height(value){this._height!==value&&(this._height=value,this._updateStyle())}_updateStyle(){dom.removeCSSRulesContainingSelector(this._ruleName),dom.createCSSRule(`.monaco-editor ${this._ruleName}`,`border-style: solid; border-color: transparent; border-bottom-color: ${this._color}; border-width: ${this._height}px; bottom: -${this._height}px; margin-left: -${this._height}px; `)}show(where){1===where.column&&(where={lineNumber:where.lineNumber,column:2}),this._decorations=this._editor.deltaDecorations(this._decorations,[{range:Range.fromPositions(where),options:{description:"zone-widget-arrow",className:this._ruleName,stickiness:1}}])}hide(){this._editor.deltaDecorations(this._decorations,[])}}Arrow._IdGenerator=new IdGenerator(".arrow-decoration-");export class ZoneWidget{constructor(editor,options={}){this._arrow=null,this._overlayWidget=null,this._resizeSash=null,this._positionMarkerId=[],this._viewZone=null,this._disposables=new DisposableStore,this.container=null,this._isShowing=!1,this.editor=editor,this.options=objects.deepClone(options),objects.mixin(this.options,defaultOptions,!1),this.domNode=document.createElement("div"),this.options.isAccessible||(this.domNode.setAttribute("aria-hidden","true"),this.domNode.setAttribute("role","presentation")),this._disposables.add(this.editor.onDidLayoutChange((info=>{const width=this._getWidth(info);this.domNode.style.width=width+"px",this.domNode.style.left=this._getLeft(info)+"px",this._onWidth(width)})))}dispose(){this._overlayWidget&&(this.editor.removeOverlayWidget(this._overlayWidget),this._overlayWidget=null),this._viewZone&&this.editor.changeViewZones((accessor=>{this._viewZone&&accessor.removeZone(this._viewZone.id),this._viewZone=null})),this.editor.deltaDecorations(this._positionMarkerId,[]),this._positionMarkerId=[],this._disposables.dispose()}create(){this.domNode.classList.add("zone-widget"),this.options.className&&this.domNode.classList.add(this.options.className),this.container=document.createElement("div"),this.container.classList.add("zone-widget-container"),this.domNode.appendChild(this.container),this.options.showArrow&&(this._arrow=new Arrow(this.editor),this._disposables.add(this._arrow)),this._fillContainer(this.container),this._initSash(),this._applyStyles()}style(styles){styles.frameColor&&(this.options.frameColor=styles.frameColor),styles.arrowColor&&(this.options.arrowColor=styles.arrowColor),this._applyStyles()}_applyStyles(){if(this.container&&this.options.frameColor){let frameColor=this.options.frameColor.toString();this.container.style.borderTopColor=frameColor,this.container.style.borderBottomColor=frameColor}if(this._arrow&&this.options.arrowColor){let arrowColor=this.options.arrowColor.toString();this._arrow.color=arrowColor}}_getWidth(info){return info.width-info.minimap.minimapWidth-info.verticalScrollbarWidth}_getLeft(info){return info.minimap.minimapWidth>0&&0===info.minimap.minimapLeft?info.minimap.minimapWidth:0}_onViewZoneTop(top){this.domNode.style.top=top+"px"}_onViewZoneHeight(height){if(this.domNode.style.height=`${height}px`,this.container){let containerHeight=height-this._decoratingElementsHeight();this.container.style.height=`${containerHeight}px`;const layoutInfo=this.editor.getLayoutInfo();this._doLayout(containerHeight,this._getWidth(layoutInfo))}this._resizeSash&&this._resizeSash.layout()}get position(){const[id]=this._positionMarkerId;if(!id)return;const model=this.editor.getModel();if(!model)return;const range=model.getDecorationRange(id);return range?range.getStartPosition():void 0}show(rangeOrPos,heightInLines){const range=Range.isIRange(rangeOrPos)?Range.lift(rangeOrPos):Range.fromPositions(rangeOrPos);this._isShowing=!0,this._showImpl(range,heightInLines),this._isShowing=!1,this._positionMarkerId=this.editor.deltaDecorations(this._positionMarkerId,[{range,options:ModelDecorationOptions.EMPTY}])}hide(){this._viewZone&&(this.editor.changeViewZones((accessor=>{this._viewZone&&accessor.removeZone(this._viewZone.id)})),this._viewZone=null),this._overlayWidget&&(this.editor.removeOverlayWidget(this._overlayWidget),this._overlayWidget=null),this._arrow&&this._arrow.hide()}_decoratingElementsHeight(){let lineHeight=this.editor.getOption(59),result=0;if(this.options.showArrow){result+=2*Math.round(lineHeight/3)}if(this.options.showFrame){result+=2*Math.round(lineHeight/9)}return result}_showImpl(where,heightInLines){const position=where.getStartPosition(),layoutInfo=this.editor.getLayoutInfo(),width=this._getWidth(layoutInfo);this.domNode.style.width=`${width}px`,this.domNode.style.left=this._getLeft(layoutInfo)+"px";const viewZoneDomNode=document.createElement("div");viewZoneDomNode.style.overflow="hidden";const lineHeight=this.editor.getOption(59),maxHeightInLines=Math.max(12,this.editor.getLayoutInfo().height/lineHeight*.8);heightInLines=Math.min(heightInLines,maxHeightInLines);let arrowHeight=0,frameThickness=0;if(this._arrow&&this.options.showArrow&&(arrowHeight=Math.round(lineHeight/3),this._arrow.height=arrowHeight,this._arrow.show(position)),this.options.showFrame&&(frameThickness=Math.round(lineHeight/9)),this.editor.changeViewZones((accessor=>{this._viewZone&&accessor.removeZone(this._viewZone.id),this._overlayWidget&&(this.editor.removeOverlayWidget(this._overlayWidget),this._overlayWidget=null),this.domNode.style.top="-1000px",this._viewZone=new ViewZoneDelegate(viewZoneDomNode,position.lineNumber,position.column,heightInLines,(top=>this._onViewZoneTop(top)),(height=>this._onViewZoneHeight(height))),this._viewZone.id=accessor.addZone(this._viewZone),this._overlayWidget=new OverlayWidgetDelegate(WIDGET_ID+this._viewZone.id,this.domNode),this.editor.addOverlayWidget(this._overlayWidget)})),this.container&&this.options.showFrame){const width=this.options.frameWidth?this.options.frameWidth:frameThickness;this.container.style.borderTopWidth=width+"px",this.container.style.borderBottomWidth=width+"px"}let containerHeight=heightInLines*lineHeight-this._decoratingElementsHeight();this.container&&(this.container.style.top=arrowHeight+"px",this.container.style.height=containerHeight+"px",this.container.style.overflow="hidden"),this._doLayout(containerHeight,width),this.options.keepEditorSelection||this.editor.setSelection(where);const model=this.editor.getModel();if(model){const revealLine=where.endLineNumber+1;revealLine<=model.getLineCount()?this.revealLine(revealLine,!1):this.revealLine(model.getLineCount(),!0)}}revealLine(lineNumber,isLastLine){isLastLine?this.editor.revealLineInCenter(lineNumber,0):this.editor.revealLine(lineNumber,0)}setCssClass(className,classToReplace){this.container&&(classToReplace&&this.container.classList.remove(classToReplace),this.container.classList.add(className))}_onWidth(widthInPixel){}_doLayout(heightInPixel,widthInPixel){}_relayout(newHeightInLines){this._viewZone&&this._viewZone.heightInLines!==newHeightInLines&&this.editor.changeViewZones((accessor=>{this._viewZone&&(this._viewZone.heightInLines=newHeightInLines,accessor.layoutZone(this._viewZone.id))}))}_initSash(){if(this._resizeSash)return;let data;this._resizeSash=this._disposables.add(new Sash(this.domNode,this,{orientation:1})),this.options.isResizeable||(this._resizeSash.state=0),this._disposables.add(this._resizeSash.onDidStart((e=>{this._viewZone&&(data={startY:e.startY,heightInLines:this._viewZone.heightInLines})}))),this._disposables.add(this._resizeSash.onDidEnd((()=>{data=void 0}))),this._disposables.add(this._resizeSash.onDidChange((evt=>{if(data){let lineDelta=(evt.currentY-data.startY)/this.editor.getOption(59),roundedLineDelta=lineDelta<0?Math.ceil(lineDelta):Math.floor(lineDelta),newHeightInLines=data.heightInLines+roundedLineDelta;newHeightInLines>5&&newHeightInLines<35&&this._relayout(newHeightInLines)}})))}getHorizontalSashLeft(){return 0}getHorizontalSashTop(){return(null===this.domNode.style.height?0:parseInt(this.domNode.style.height))-this._decoratingElementsHeight()/2}getHorizontalSashWidth(){const layoutInfo=this.editor.getLayoutInfo();return layoutInfo.width-layoutInfo.minimap.minimapWidth}}