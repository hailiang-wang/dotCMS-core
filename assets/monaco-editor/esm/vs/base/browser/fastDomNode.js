export class FastDomNode{constructor(domNode){this.domNode=domNode,this._maxWidth=-1,this._width=-1,this._height=-1,this._top=-1,this._left=-1,this._bottom=-1,this._right=-1,this._fontFamily="",this._fontWeight="",this._fontSize=-1,this._fontStyle="",this._fontFeatureSettings="",this._textDecoration="",this._lineHeight=-1,this._letterSpacing=-100,this._className="",this._display="",this._position="",this._visibility="",this._color="",this._backgroundColor="",this._layerHint=!1,this._contain="none",this._boxShadow=""}setMaxWidth(maxWidth){this._maxWidth!==maxWidth&&(this._maxWidth=maxWidth,this.domNode.style.maxWidth=this._maxWidth+"px")}setWidth(width){this._width!==width&&(this._width=width,this.domNode.style.width=this._width+"px")}setHeight(height){this._height!==height&&(this._height=height,this.domNode.style.height=this._height+"px")}setTop(top){this._top!==top&&(this._top=top,this.domNode.style.top=this._top+"px")}unsetTop(){-1!==this._top&&(this._top=-1,this.domNode.style.top="")}setLeft(left){this._left!==left&&(this._left=left,this.domNode.style.left=this._left+"px")}setBottom(bottom){this._bottom!==bottom&&(this._bottom=bottom,this.domNode.style.bottom=this._bottom+"px")}setRight(right){this._right!==right&&(this._right=right,this.domNode.style.right=this._right+"px")}setFontFamily(fontFamily){this._fontFamily!==fontFamily&&(this._fontFamily=fontFamily,this.domNode.style.fontFamily=this._fontFamily)}setFontWeight(fontWeight){this._fontWeight!==fontWeight&&(this._fontWeight=fontWeight,this.domNode.style.fontWeight=this._fontWeight)}setFontSize(fontSize){this._fontSize!==fontSize&&(this._fontSize=fontSize,this.domNode.style.fontSize=this._fontSize+"px")}setFontStyle(fontStyle){this._fontStyle!==fontStyle&&(this._fontStyle=fontStyle,this.domNode.style.fontStyle=this._fontStyle)}setFontFeatureSettings(fontFeatureSettings){this._fontFeatureSettings!==fontFeatureSettings&&(this._fontFeatureSettings=fontFeatureSettings,this.domNode.style.fontFeatureSettings=this._fontFeatureSettings)}setTextDecoration(textDecoration){this._textDecoration!==textDecoration&&(this._textDecoration=textDecoration,this.domNode.style.textDecoration=this._textDecoration)}setLineHeight(lineHeight){this._lineHeight!==lineHeight&&(this._lineHeight=lineHeight,this.domNode.style.lineHeight=this._lineHeight+"px")}setLetterSpacing(letterSpacing){this._letterSpacing!==letterSpacing&&(this._letterSpacing=letterSpacing,this.domNode.style.letterSpacing=this._letterSpacing+"px")}setClassName(className){this._className!==className&&(this._className=className,this.domNode.className=this._className)}toggleClassName(className,shouldHaveIt){this.domNode.classList.toggle(className,shouldHaveIt),this._className=this.domNode.className}setDisplay(display){this._display!==display&&(this._display=display,this.domNode.style.display=this._display)}setPosition(position){this._position!==position&&(this._position=position,this.domNode.style.position=this._position)}setVisibility(visibility){this._visibility!==visibility&&(this._visibility=visibility,this.domNode.style.visibility=this._visibility)}setColor(color){this._color!==color&&(this._color=color,this.domNode.style.color=this._color)}setBackgroundColor(backgroundColor){this._backgroundColor!==backgroundColor&&(this._backgroundColor=backgroundColor,this.domNode.style.backgroundColor=this._backgroundColor)}setLayerHinting(layerHint){this._layerHint!==layerHint&&(this._layerHint=layerHint,this.domNode.style.transform=this._layerHint?"translate3d(0px, 0px, 0px)":"")}setBoxShadow(boxShadow){this._boxShadow!==boxShadow&&(this._boxShadow=boxShadow,this.domNode.style.boxShadow=boxShadow)}setContain(contain){this._contain!==contain&&(this._contain=contain,this.domNode.style.contain=this._contain)}setAttribute(name,value){this.domNode.setAttribute(name,value)}removeAttribute(name){this.domNode.removeAttribute(name)}appendChild(child){this.domNode.appendChild(child.domNode)}removeChild(child){this.domNode.removeChild(child.domNode)}}export function createFastDomNode(domNode){return new FastDomNode(domNode)}