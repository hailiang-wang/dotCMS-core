import*as dom from"../../dom.js";import{UILabelProvider}from"../../../common/keybindingLabels.js";import{equals}from"../../../common/objects.js";import"./keybindingLabel.css";import{localize}from"../../../../nls.js";const $=dom.$;export class KeybindingLabel{constructor(container,os,options){this.os=os,this.keyElements=new Set,this.options=options||Object.create(null),this.labelBackground=this.options.keybindingLabelBackground,this.labelForeground=this.options.keybindingLabelForeground,this.labelBorder=this.options.keybindingLabelBorder,this.labelBottomBorder=this.options.keybindingLabelBottomBorder,this.labelShadow=this.options.keybindingLabelShadow,this.domNode=dom.append(container,$(".monaco-keybinding")),this.didEverRender=!1,container.appendChild(this.domNode)}get element(){return this.domNode}set(keybinding,matches){this.didEverRender&&this.keybinding===keybinding&&KeybindingLabel.areSame(this.matches,matches)||(this.keybinding=keybinding,this.matches=matches,this.render())}render(){if(this.clear(),this.keybinding){let[firstPart,chordPart]=this.keybinding.getParts();firstPart&&this.renderPart(this.domNode,firstPart,this.matches?this.matches.firstPart:null),chordPart&&(dom.append(this.domNode,$("span.monaco-keybinding-key-chord-separator",void 0," ")),this.renderPart(this.domNode,chordPart,this.matches?this.matches.chordPart:null)),this.domNode.title=this.keybinding.getAriaLabel()||""}else this.options&&this.options.renderUnboundKeybindings&&this.renderUnbound(this.domNode);this.applyStyles(),this.didEverRender=!0}clear(){dom.clearNode(this.domNode),this.keyElements.clear()}renderPart(parent,part,match){const modifierLabels=UILabelProvider.modifierLabels[this.os];part.ctrlKey&&this.renderKey(parent,modifierLabels.ctrlKey,Boolean(null==match?void 0:match.ctrlKey),modifierLabels.separator),part.shiftKey&&this.renderKey(parent,modifierLabels.shiftKey,Boolean(null==match?void 0:match.shiftKey),modifierLabels.separator),part.altKey&&this.renderKey(parent,modifierLabels.altKey,Boolean(null==match?void 0:match.altKey),modifierLabels.separator),part.metaKey&&this.renderKey(parent,modifierLabels.metaKey,Boolean(null==match?void 0:match.metaKey),modifierLabels.separator);const keyLabel=part.keyLabel;keyLabel&&this.renderKey(parent,keyLabel,Boolean(null==match?void 0:match.keyCode),"")}renderKey(parent,label,highlight,separator){dom.append(parent,this.createKeyElement(label,highlight?".highlight":"")),separator&&dom.append(parent,$("span.monaco-keybinding-key-separator",void 0,separator))}renderUnbound(parent){dom.append(parent,this.createKeyElement(localize("unbound","Unbound")))}createKeyElement(label,extraClass=""){const keyElement=$("span.monaco-keybinding-key"+extraClass,void 0,label);return this.keyElements.add(keyElement),keyElement}style(styles){this.labelBackground=styles.keybindingLabelBackground,this.labelForeground=styles.keybindingLabelForeground,this.labelBorder=styles.keybindingLabelBorder,this.labelBottomBorder=styles.keybindingLabelBottomBorder,this.labelShadow=styles.keybindingLabelShadow,this.applyStyles()}applyStyles(){var _a;if(this.element){for(const keyElement of this.keyElements)this.labelBackground&&(keyElement.style.backgroundColor=null===(_a=this.labelBackground)||void 0===_a?void 0:_a.toString()),this.labelBorder&&(keyElement.style.borderColor=this.labelBorder.toString()),this.labelBottomBorder&&(keyElement.style.borderBottomColor=this.labelBottomBorder.toString()),this.labelShadow&&(keyElement.style.boxShadow=`inset 0 -1px 0 ${this.labelShadow}`);this.labelForeground&&(this.element.style.color=this.labelForeground.toString())}}static areSame(a,b){return a===b||!a&&!b||!!a&&!!b&&equals(a.firstPart,b.firstPart)&&equals(a.chordPart,b.chordPart)}}