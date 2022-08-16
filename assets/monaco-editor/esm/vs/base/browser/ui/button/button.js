import{addDisposableListener,EventHelper,EventType,reset,trackFocus}from"../../dom.js";import{StandardKeyboardEvent}from"../../keyboardEvent.js";import{EventType as TouchEventType,Gesture}from"../../touch.js";import{renderLabelWithIcons}from"../iconLabel/iconLabels.js";import{Color}from"../../../common/color.js";import{Emitter}from"../../../common/event.js";import{Disposable}from"../../../common/lifecycle.js";import{mixin}from"../../../common/objects.js";import"./button.css";const defaultOptions={buttonBackground:Color.fromHex("#0E639C"),buttonHoverBackground:Color.fromHex("#006BB3"),buttonForeground:Color.white};export class Button extends Disposable{constructor(container,options){super(),this._onDidClick=this._register(new Emitter),this.options=options||Object.create(null),mixin(this.options,defaultOptions,!1),this.buttonForeground=this.options.buttonForeground,this.buttonBackground=this.options.buttonBackground,this.buttonHoverBackground=this.options.buttonHoverBackground,this.buttonSecondaryForeground=this.options.buttonSecondaryForeground,this.buttonSecondaryBackground=this.options.buttonSecondaryBackground,this.buttonSecondaryHoverBackground=this.options.buttonSecondaryHoverBackground,this.buttonBorder=this.options.buttonBorder,this._element=document.createElement("a"),this._element.classList.add("monaco-button"),this._element.tabIndex=0,this._element.setAttribute("role","button"),container.appendChild(this._element),this._register(Gesture.addTarget(this._element)),[EventType.CLICK,TouchEventType.Tap].forEach((eventType=>{this._register(addDisposableListener(this._element,eventType,(e=>{this.enabled?this._onDidClick.fire(e):EventHelper.stop(e)})))})),this._register(addDisposableListener(this._element,EventType.KEY_DOWN,(e=>{const event=new StandardKeyboardEvent(e);let eventHandled=!1;this.enabled&&(event.equals(3)||event.equals(10))?(this._onDidClick.fire(e),eventHandled=!0):event.equals(9)&&(this._element.blur(),eventHandled=!0),eventHandled&&EventHelper.stop(event,!0)}))),this._register(addDisposableListener(this._element,EventType.MOUSE_OVER,(e=>{this._element.classList.contains("disabled")||this.setHoverBackground()}))),this._register(addDisposableListener(this._element,EventType.MOUSE_OUT,(e=>{this.applyStyles()}))),this.focusTracker=this._register(trackFocus(this._element)),this._register(this.focusTracker.onDidFocus((()=>this.setHoverBackground()))),this._register(this.focusTracker.onDidBlur((()=>this.applyStyles()))),this.applyStyles()}get onDidClick(){return this._onDidClick.event}setHoverBackground(){let hoverBackground;hoverBackground=this.options.secondary?this.buttonSecondaryHoverBackground?this.buttonSecondaryHoverBackground.toString():null:this.buttonHoverBackground?this.buttonHoverBackground.toString():null,hoverBackground&&(this._element.style.backgroundColor=hoverBackground)}style(styles){this.buttonForeground=styles.buttonForeground,this.buttonBackground=styles.buttonBackground,this.buttonHoverBackground=styles.buttonHoverBackground,this.buttonSecondaryForeground=styles.buttonSecondaryForeground,this.buttonSecondaryBackground=styles.buttonSecondaryBackground,this.buttonSecondaryHoverBackground=styles.buttonSecondaryHoverBackground,this.buttonBorder=styles.buttonBorder,this.applyStyles()}applyStyles(){if(this._element){let background,foreground;this.options.secondary?(foreground=this.buttonSecondaryForeground?this.buttonSecondaryForeground.toString():"",background=this.buttonSecondaryBackground?this.buttonSecondaryBackground.toString():""):(foreground=this.buttonForeground?this.buttonForeground.toString():"",background=this.buttonBackground?this.buttonBackground.toString():"");const border=this.buttonBorder?this.buttonBorder.toString():"";this._element.style.color=foreground,this._element.style.backgroundColor=background,this._element.style.borderWidth=border?"1px":"",this._element.style.borderStyle=border?"solid":"",this._element.style.borderColor=border}}get element(){return this._element}set label(value){this._element.classList.add("monaco-text-button"),this.options.supportIcons?reset(this._element,...renderLabelWithIcons(value)):this._element.textContent=value,"string"==typeof this.options.title?this._element.title=this.options.title:this.options.title&&(this._element.title=value)}set enabled(value){value?(this._element.classList.remove("disabled"),this._element.setAttribute("aria-disabled",String(!1)),this._element.tabIndex=0):(this._element.classList.add("disabled"),this._element.setAttribute("aria-disabled",String(!0)))}get enabled(){return!this._element.classList.contains("disabled")}}