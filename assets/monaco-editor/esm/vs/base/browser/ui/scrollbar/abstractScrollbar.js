import*as dom from"../../dom.js";import{createFastDomNode}from"../../fastDomNode.js";import{GlobalMouseMoveMonitor,standardMouseMoveMerger}from"../../globalMouseMoveMonitor.js";import{ScrollbarArrow}from"./scrollbarArrow.js";import{ScrollbarVisibilityController}from"./scrollbarVisibilityController.js";import{Widget}from"../widget.js";import*as platform from"../../../common/platform.js";const MOUSE_DRAG_RESET_DISTANCE=140;export class AbstractScrollbar extends Widget{constructor(opts){super(),this._lazyRender=opts.lazyRender,this._host=opts.host,this._scrollable=opts.scrollable,this._scrollByPage=opts.scrollByPage,this._scrollbarState=opts.scrollbarState,this._visibilityController=this._register(new ScrollbarVisibilityController(opts.visibility,"visible scrollbar "+opts.extraScrollbarClassName,"invisible scrollbar "+opts.extraScrollbarClassName)),this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded()),this._mouseMoveMonitor=this._register(new GlobalMouseMoveMonitor),this._shouldRender=!0,this.domNode=createFastDomNode(document.createElement("div")),this.domNode.setAttribute("role","presentation"),this.domNode.setAttribute("aria-hidden","true"),this._visibilityController.setDomNode(this.domNode),this.domNode.setPosition("absolute"),this.onmousedown(this.domNode.domNode,(e=>this._domNodeMouseDown(e)))}_createArrow(opts){const arrow=this._register(new ScrollbarArrow(opts));this.domNode.domNode.appendChild(arrow.bgDomNode),this.domNode.domNode.appendChild(arrow.domNode)}_createSlider(top,left,width,height){this.slider=createFastDomNode(document.createElement("div")),this.slider.setClassName("slider"),this.slider.setPosition("absolute"),this.slider.setTop(top),this.slider.setLeft(left),"number"==typeof width&&this.slider.setWidth(width),"number"==typeof height&&this.slider.setHeight(height),this.slider.setLayerHinting(!0),this.slider.setContain("strict"),this.domNode.domNode.appendChild(this.slider.domNode),this.onmousedown(this.slider.domNode,(e=>{e.leftButton&&(e.preventDefault(),this._sliderMouseDown(e,(()=>{})))})),this.onclick(this.slider.domNode,(e=>{e.leftButton&&e.stopPropagation()}))}_onElementSize(visibleSize){return this._scrollbarState.setVisibleSize(visibleSize)&&(this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded()),this._shouldRender=!0,this._lazyRender||this.render()),this._shouldRender}_onElementScrollSize(elementScrollSize){return this._scrollbarState.setScrollSize(elementScrollSize)&&(this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded()),this._shouldRender=!0,this._lazyRender||this.render()),this._shouldRender}_onElementScrollPosition(elementScrollPosition){return this._scrollbarState.setScrollPosition(elementScrollPosition)&&(this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded()),this._shouldRender=!0,this._lazyRender||this.render()),this._shouldRender}beginReveal(){this._visibilityController.setShouldBeVisible(!0)}beginHide(){this._visibilityController.setShouldBeVisible(!1)}render(){this._shouldRender&&(this._shouldRender=!1,this._renderDomNode(this._scrollbarState.getRectangleLargeSize(),this._scrollbarState.getRectangleSmallSize()),this._updateSlider(this._scrollbarState.getSliderSize(),this._scrollbarState.getArrowSize()+this._scrollbarState.getSliderPosition()))}_domNodeMouseDown(e){e.target===this.domNode.domNode&&this._onMouseDown(e)}delegateMouseDown(e){const domTop=this.domNode.domNode.getClientRects()[0].top,sliderStart=domTop+this._scrollbarState.getSliderPosition(),sliderStop=domTop+this._scrollbarState.getSliderPosition()+this._scrollbarState.getSliderSize(),mousePos=this._sliderMousePosition(e);sliderStart<=mousePos&&mousePos<=sliderStop?e.leftButton&&(e.preventDefault(),this._sliderMouseDown(e,(()=>{}))):this._onMouseDown(e)}_onMouseDown(e){let offsetX,offsetY;if(e.target===this.domNode.domNode&&"number"==typeof e.browserEvent.offsetX&&"number"==typeof e.browserEvent.offsetY)offsetX=e.browserEvent.offsetX,offsetY=e.browserEvent.offsetY;else{const domNodePosition=dom.getDomNodePagePosition(this.domNode.domNode);offsetX=e.posx-domNodePosition.left,offsetY=e.posy-domNodePosition.top}const offset=this._mouseDownRelativePosition(offsetX,offsetY);this._setDesiredScrollPositionNow(this._scrollByPage?this._scrollbarState.getDesiredScrollPositionFromOffsetPaged(offset):this._scrollbarState.getDesiredScrollPositionFromOffset(offset)),e.leftButton&&(e.preventDefault(),this._sliderMouseDown(e,(()=>{})))}_sliderMouseDown(e,onDragFinished){const initialMousePosition=this._sliderMousePosition(e),initialMouseOrthogonalPosition=this._sliderOrthogonalMousePosition(e),initialScrollbarState=this._scrollbarState.clone();this.slider.toggleClassName("active",!0),this._mouseMoveMonitor.startMonitoring(e.target,e.buttons,standardMouseMoveMerger,(mouseMoveData=>{const mouseOrthogonalPosition=this._sliderOrthogonalMousePosition(mouseMoveData),mouseOrthogonalDelta=Math.abs(mouseOrthogonalPosition-initialMouseOrthogonalPosition);if(platform.isWindows&&mouseOrthogonalDelta>140)return void this._setDesiredScrollPositionNow(initialScrollbarState.getScrollPosition());const mouseDelta=this._sliderMousePosition(mouseMoveData)-initialMousePosition;this._setDesiredScrollPositionNow(initialScrollbarState.getDesiredScrollPositionFromDelta(mouseDelta))}),(()=>{this.slider.toggleClassName("active",!1),this._host.onDragEnd(),onDragFinished()})),this._host.onDragStart()}_setDesiredScrollPositionNow(_desiredScrollPosition){const desiredScrollPosition={};this.writeScrollPosition(desiredScrollPosition,_desiredScrollPosition),this._scrollable.setScrollPositionNow(desiredScrollPosition)}updateScrollbarSize(scrollbarSize){this._updateScrollbarSize(scrollbarSize),this._scrollbarState.setScrollbarSize(scrollbarSize),this._shouldRender=!0,this._lazyRender||this.render()}isNeeded(){return this._scrollbarState.isNeeded()}}