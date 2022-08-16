var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r};import{AbstractTree}from"./abstractTree.js";import{CompressibleObjectTreeModel}from"./compressedObjectTreeModel.js";import{ObjectTreeModel}from"./objectTreeModel.js";import{memoize}from"../../../common/decorators.js";import{Iterable}from"../../../common/iterator.js";export class ObjectTree extends AbstractTree{constructor(user,container,delegate,renderers,options={}){super(user,container,delegate,renderers,options),this.user=user}get onDidChangeCollapseState(){return this.model.onDidChangeCollapseState}setChildren(element,children=Iterable.empty(),options){this.model.setChildren(element,children,options)}rerender(element){void 0!==element?this.model.rerender(element):this.view.rerender()}hasElement(element){return this.model.has(element)}createModel(user,view,options){return new ObjectTreeModel(user,view,options)}}class CompressibleRenderer{constructor(_compressedTreeNodeProvider,renderer){this._compressedTreeNodeProvider=_compressedTreeNodeProvider,this.renderer=renderer,this.templateId=renderer.templateId,renderer.onDidChangeTwistieState&&(this.onDidChangeTwistieState=renderer.onDidChangeTwistieState)}get compressedTreeNodeProvider(){return this._compressedTreeNodeProvider()}renderTemplate(container){return{compressedTreeNode:void 0,data:this.renderer.renderTemplate(container)}}renderElement(node,index,templateData,height){const compressedTreeNode=this.compressedTreeNodeProvider.getCompressedTreeNode(node.element);1===compressedTreeNode.element.elements.length?(templateData.compressedTreeNode=void 0,this.renderer.renderElement(node,index,templateData.data,height)):(templateData.compressedTreeNode=compressedTreeNode,this.renderer.renderCompressedElements(compressedTreeNode,index,templateData.data,height))}disposeElement(node,index,templateData,height){templateData.compressedTreeNode?this.renderer.disposeCompressedElements&&this.renderer.disposeCompressedElements(templateData.compressedTreeNode,index,templateData.data,height):this.renderer.disposeElement&&this.renderer.disposeElement(node,index,templateData.data,height)}disposeTemplate(templateData){this.renderer.disposeTemplate(templateData.data)}renderTwistie(element,twistieElement){return!!this.renderer.renderTwistie&&this.renderer.renderTwistie(element,twistieElement)}}function asObjectTreeOptions(compressedTreeNodeProvider,options){return options&&Object.assign(Object.assign({},options),{keyboardNavigationLabelProvider:options.keyboardNavigationLabelProvider&&{getKeyboardNavigationLabel(e){let compressedTreeNode;try{compressedTreeNode=compressedTreeNodeProvider().getCompressedTreeNode(e)}catch(_a){return options.keyboardNavigationLabelProvider.getKeyboardNavigationLabel(e)}return 1===compressedTreeNode.element.elements.length?options.keyboardNavigationLabelProvider.getKeyboardNavigationLabel(e):options.keyboardNavigationLabelProvider.getCompressedNodeKeyboardNavigationLabel(compressedTreeNode.element.elements)}}})}__decorate([memoize],CompressibleRenderer.prototype,"compressedTreeNodeProvider",null);export class CompressibleObjectTree extends ObjectTree{constructor(user,container,delegate,renderers,options={}){const compressedTreeNodeProvider=()=>this;super(user,container,delegate,renderers.map((r=>new CompressibleRenderer(compressedTreeNodeProvider,r))),asObjectTreeOptions(compressedTreeNodeProvider,options))}setChildren(element,children=Iterable.empty(),options){this.model.setChildren(element,children,options)}createModel(user,view,options){return new CompressibleObjectTreeModel(user,view,options)}updateOptions(optionsUpdate={}){super.updateOptions(optionsUpdate),void 0!==optionsUpdate.compressionEnabled&&this.model.setCompressionEnabled(optionsUpdate.compressionEnabled)}getCompressedTreeNode(element=null){return this.model.getCompressedTreeNode(element)}}