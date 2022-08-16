import{DragAndDropData,StaticDND}from"../../dnd.js";import{$,addDisposableListener,append,clearNode,createStyleSheet,getDomNodePagePosition,hasParentWithClass}from"../../dom.js";import{DomEmitter}from"../../event.js";import{StandardKeyboardEvent}from"../../keyboardEvent.js";import{ElementsDragAndDropData}from"../list/listView.js";import{DefaultKeyboardNavigationDelegate,isInputElement,isMonacoEditor,List,MouseController}from"../list/listWidget.js";import{getVisibleState,isFilterResult}from"./indexTreeModel.js";import{TreeMouseEventTarget}from"./tree.js";import{distinct,equals,range}from"../../../common/arrays.js";import{disposableTimeout}from"../../../common/async.js";import{Codicon}from"../../../common/codicons.js";import{SetMap}from"../../../common/collections.js";import{Emitter,Event,EventBufferer,Relay}from"../../../common/event.js";import{fuzzyScore,FuzzyScore}from"../../../common/filters.js";import{Disposable,DisposableStore,dispose,toDisposable}from"../../../common/lifecycle.js";import{clamp}from"../../../common/numbers.js";import{isMacintosh}from"../../../common/platform.js";import"./media/tree.css";import{localize}from"../../../../nls.js";class TreeElementsDragAndDropData extends ElementsDragAndDropData{constructor(data){super(data.elements.map((node=>node.element))),this.data=data}}function asTreeDragAndDropData(data){return data instanceof ElementsDragAndDropData?new TreeElementsDragAndDropData(data):data}class TreeNodeListDragAndDrop{constructor(modelProvider,dnd){this.modelProvider=modelProvider,this.dnd=dnd,this.autoExpandDisposable=Disposable.None}getDragURI(node){return this.dnd.getDragURI(node.element)}getDragLabel(nodes,originalEvent){if(this.dnd.getDragLabel)return this.dnd.getDragLabel(nodes.map((node=>node.element)),originalEvent)}onDragStart(data,originalEvent){this.dnd.onDragStart&&this.dnd.onDragStart(asTreeDragAndDropData(data),originalEvent)}onDragOver(data,targetNode,targetIndex,originalEvent,raw=!0){const result=this.dnd.onDragOver(asTreeDragAndDropData(data),targetNode&&targetNode.element,targetIndex,originalEvent),didChangeAutoExpandNode=this.autoExpandNode!==targetNode;if(didChangeAutoExpandNode&&(this.autoExpandDisposable.dispose(),this.autoExpandNode=targetNode),void 0===targetNode)return result;if(didChangeAutoExpandNode&&"boolean"!=typeof result&&result.autoExpand&&(this.autoExpandDisposable=disposableTimeout((()=>{const model=this.modelProvider(),ref=model.getNodeLocation(targetNode);model.isCollapsed(ref)&&model.setCollapsed(ref,!1),this.autoExpandNode=void 0}),500)),"boolean"==typeof result||!result.accept||void 0===result.bubble||result.feedback){if(!raw){return{accept:"boolean"==typeof result?result:result.accept,effect:"boolean"==typeof result?void 0:result.effect,feedback:[targetIndex]}}return result}if(1===result.bubble){const model=this.modelProvider(),ref=model.getNodeLocation(targetNode),parentRef=model.getParentNodeLocation(ref),parentNode=model.getNode(parentRef),parentIndex=parentRef&&model.getListIndex(parentRef);return this.onDragOver(data,parentNode,parentIndex,originalEvent,!1)}const model=this.modelProvider(),ref=model.getNodeLocation(targetNode),start=model.getListIndex(ref),length=model.getListRenderCount(ref);return Object.assign(Object.assign({},result),{feedback:range(start,start+length)})}drop(data,targetNode,targetIndex,originalEvent){this.autoExpandDisposable.dispose(),this.autoExpandNode=void 0,this.dnd.drop(asTreeDragAndDropData(data),targetNode&&targetNode.element,targetIndex,originalEvent)}onDragEnd(originalEvent){this.dnd.onDragEnd&&this.dnd.onDragEnd(originalEvent)}}function asListOptions(modelProvider,options){return options&&Object.assign(Object.assign({},options),{identityProvider:options.identityProvider&&{getId:el=>options.identityProvider.getId(el.element)},dnd:options.dnd&&new TreeNodeListDragAndDrop(modelProvider,options.dnd),multipleSelectionController:options.multipleSelectionController&&{isSelectionSingleChangeEvent:e=>options.multipleSelectionController.isSelectionSingleChangeEvent(Object.assign(Object.assign({},e),{element:e.element})),isSelectionRangeChangeEvent:e=>options.multipleSelectionController.isSelectionRangeChangeEvent(Object.assign(Object.assign({},e),{element:e.element}))},accessibilityProvider:options.accessibilityProvider&&Object.assign(Object.assign({},options.accessibilityProvider),{getSetSize(node){const model=modelProvider(),ref=model.getNodeLocation(node),parentRef=model.getParentNodeLocation(ref);return model.getNode(parentRef).visibleChildrenCount},getPosInSet:node=>node.visibleChildIndex+1,isChecked:options.accessibilityProvider&&options.accessibilityProvider.isChecked?node=>options.accessibilityProvider.isChecked(node.element):void 0,getRole:options.accessibilityProvider&&options.accessibilityProvider.getRole?node=>options.accessibilityProvider.getRole(node.element):()=>"treeitem",getAriaLabel:e=>options.accessibilityProvider.getAriaLabel(e.element),getWidgetAriaLabel:()=>options.accessibilityProvider.getWidgetAriaLabel(),getWidgetRole:options.accessibilityProvider&&options.accessibilityProvider.getWidgetRole?()=>options.accessibilityProvider.getWidgetRole():()=>"tree",getAriaLevel:options.accessibilityProvider&&options.accessibilityProvider.getAriaLevel?node=>options.accessibilityProvider.getAriaLevel(node.element):node=>node.depth,getActiveDescendantId:options.accessibilityProvider.getActiveDescendantId&&(node=>options.accessibilityProvider.getActiveDescendantId(node.element))}),keyboardNavigationLabelProvider:options.keyboardNavigationLabelProvider&&Object.assign(Object.assign({},options.keyboardNavigationLabelProvider),{getKeyboardNavigationLabel:node=>options.keyboardNavigationLabelProvider.getKeyboardNavigationLabel(node.element)}),enableKeyboardNavigation:options.simpleKeyboardNavigation})}export class ComposedTreeDelegate{constructor(delegate){this.delegate=delegate}getHeight(element){return this.delegate.getHeight(element.element)}getTemplateId(element){return this.delegate.getTemplateId(element.element)}hasDynamicHeight(element){return!!this.delegate.hasDynamicHeight&&this.delegate.hasDynamicHeight(element.element)}setDynamicHeight(element,height){this.delegate.setDynamicHeight&&this.delegate.setDynamicHeight(element.element,height)}}export var RenderIndentGuides;!function(RenderIndentGuides){RenderIndentGuides.None="none",RenderIndentGuides.OnHover="onHover",RenderIndentGuides.Always="always"}(RenderIndentGuides||(RenderIndentGuides={}));class EventCollection{constructor(onDidChange,_elements=[]){this._elements=_elements,this.onDidChange=Event.forEach(onDidChange,(elements=>this._elements=elements))}get elements(){return this._elements}}class TreeRenderer{constructor(renderer,modelProvider,onDidChangeCollapseState,activeNodes,options={}){this.renderer=renderer,this.modelProvider=modelProvider,this.activeNodes=activeNodes,this.renderedElements=new Map,this.renderedNodes=new Map,this.indent=TreeRenderer.DefaultIndent,this.hideTwistiesOfChildlessElements=!1,this.shouldRenderIndentGuides=!1,this.renderedIndentGuides=new SetMap,this.activeIndentNodes=new Set,this.indentGuidesDisposable=Disposable.None,this.disposables=new DisposableStore,this.templateId=renderer.templateId,this.updateOptions(options),Event.map(onDidChangeCollapseState,(e=>e.node))(this.onDidChangeNodeTwistieState,this,this.disposables),renderer.onDidChangeTwistieState&&renderer.onDidChangeTwistieState(this.onDidChangeTwistieState,this,this.disposables)}updateOptions(options={}){if(void 0!==options.indent&&(this.indent=clamp(options.indent,0,40)),void 0!==options.renderIndentGuides){const shouldRenderIndentGuides=options.renderIndentGuides!==RenderIndentGuides.None;if(shouldRenderIndentGuides!==this.shouldRenderIndentGuides&&(this.shouldRenderIndentGuides=shouldRenderIndentGuides,this.indentGuidesDisposable.dispose(),shouldRenderIndentGuides)){const disposables=new DisposableStore;this.activeNodes.onDidChange(this._onDidChangeActiveNodes,this,disposables),this.indentGuidesDisposable=disposables,this._onDidChangeActiveNodes(this.activeNodes.elements)}}void 0!==options.hideTwistiesOfChildlessElements&&(this.hideTwistiesOfChildlessElements=options.hideTwistiesOfChildlessElements)}renderTemplate(container){const el=append(container,$(".monaco-tl-row")),indent=append(el,$(".monaco-tl-indent")),twistie=append(el,$(".monaco-tl-twistie")),contents=append(el,$(".monaco-tl-contents")),templateData=this.renderer.renderTemplate(contents);return{container,indent,twistie,indentGuidesDisposable:Disposable.None,templateData}}renderElement(node,index,templateData,height){"number"==typeof height&&(this.renderedNodes.set(node,{templateData,height}),this.renderedElements.set(node.element,node));const indent=TreeRenderer.DefaultIndent+(node.depth-1)*this.indent;templateData.twistie.style.paddingLeft=`${indent}px`,templateData.indent.style.width=indent+this.indent-16+"px",this.renderTwistie(node,templateData),"number"==typeof height&&this.renderIndentGuides(node,templateData),this.renderer.renderElement(node,index,templateData.templateData,height)}disposeElement(node,index,templateData,height){templateData.indentGuidesDisposable.dispose(),this.renderer.disposeElement&&this.renderer.disposeElement(node,index,templateData.templateData,height),"number"==typeof height&&(this.renderedNodes.delete(node),this.renderedElements.delete(node.element))}disposeTemplate(templateData){this.renderer.disposeTemplate(templateData.templateData)}onDidChangeTwistieState(element){const node=this.renderedElements.get(element);node&&this.onDidChangeNodeTwistieState(node)}onDidChangeNodeTwistieState(node){const data=this.renderedNodes.get(node);data&&(this.renderTwistie(node,data.templateData),this._onDidChangeActiveNodes(this.activeNodes.elements),this.renderIndentGuides(node,data.templateData))}renderTwistie(node,templateData){templateData.twistie.classList.remove(...Codicon.treeItemExpanded.classNamesArray);let twistieRendered=!1;this.renderer.renderTwistie&&(twistieRendered=this.renderer.renderTwistie(node.element,templateData.twistie)),node.collapsible&&(!this.hideTwistiesOfChildlessElements||node.visibleChildrenCount>0)?(twistieRendered||templateData.twistie.classList.add(...Codicon.treeItemExpanded.classNamesArray),templateData.twistie.classList.add("collapsible"),templateData.twistie.classList.toggle("collapsed",node.collapsed)):templateData.twistie.classList.remove("collapsible","collapsed"),node.collapsible?templateData.container.setAttribute("aria-expanded",String(!node.collapsed)):templateData.container.removeAttribute("aria-expanded")}renderIndentGuides(target,templateData){if(clearNode(templateData.indent),templateData.indentGuidesDisposable.dispose(),!this.shouldRenderIndentGuides)return;const disposableStore=new DisposableStore,model=this.modelProvider();let node=target;for(;;){const ref=model.getNodeLocation(node),parentRef=model.getParentNodeLocation(ref);if(!parentRef)break;const parent=model.getNode(parentRef),guide=$(".indent-guide",{style:`width: ${this.indent}px`});this.activeIndentNodes.has(parent)&&guide.classList.add("active"),0===templateData.indent.childElementCount?templateData.indent.appendChild(guide):templateData.indent.insertBefore(guide,templateData.indent.firstElementChild),this.renderedIndentGuides.add(parent,guide),disposableStore.add(toDisposable((()=>this.renderedIndentGuides.delete(parent,guide)))),node=parent}templateData.indentGuidesDisposable=disposableStore}_onDidChangeActiveNodes(nodes){if(!this.shouldRenderIndentGuides)return;const set=new Set,model=this.modelProvider();nodes.forEach((node=>{const ref=model.getNodeLocation(node);try{const parentRef=model.getParentNodeLocation(ref);node.collapsible&&node.children.length>0&&!node.collapsed?set.add(node):parentRef&&set.add(model.getNode(parentRef))}catch(_a){}})),this.activeIndentNodes.forEach((node=>{set.has(node)||this.renderedIndentGuides.forEach(node,(line=>line.classList.remove("active")))})),set.forEach((node=>{this.activeIndentNodes.has(node)||this.renderedIndentGuides.forEach(node,(line=>line.classList.add("active")))})),this.activeIndentNodes=set}dispose(){this.renderedNodes.clear(),this.renderedElements.clear(),this.indentGuidesDisposable.dispose(),dispose(this.disposables)}}TreeRenderer.DefaultIndent=8;class TypeFilter{constructor(tree,keyboardNavigationLabelProvider,_filter){this.tree=tree,this.keyboardNavigationLabelProvider=keyboardNavigationLabelProvider,this._filter=_filter,this._totalCount=0,this._matchCount=0,this._pattern="",this._lowercasePattern="",this.disposables=new DisposableStore,tree.onWillRefilter(this.reset,this,this.disposables)}get totalCount(){return this._totalCount}get matchCount(){return this._matchCount}set pattern(pattern){this._pattern=pattern,this._lowercasePattern=pattern.toLowerCase()}filter(element,parentVisibility){if(this._filter){const result=this._filter.filter(element,parentVisibility);if(this.tree.options.simpleKeyboardNavigation)return result;let visibility;if(visibility="boolean"==typeof result?result?1:0:isFilterResult(result)?getVisibleState(result.visibility):result,0===visibility)return!1}if(this._totalCount++,this.tree.options.simpleKeyboardNavigation||!this._pattern)return this._matchCount++,{data:FuzzyScore.Default,visibility:!0};const label=this.keyboardNavigationLabelProvider.getKeyboardNavigationLabel(element),labels=Array.isArray(label)?label:[label];for(const l of labels){const labelStr=l&&l.toString();if(void 0===labelStr)return{data:FuzzyScore.Default,visibility:!0};const score=fuzzyScore(this._pattern,this._lowercasePattern,0,labelStr,labelStr.toLowerCase(),0,!0);if(score)return this._matchCount++,1===labels.length?{data:score,visibility:!0}:{data:{label:labelStr,score},visibility:!0}}return this.tree.options.filterOnType?2:{data:FuzzyScore.Default,visibility:!0}}reset(){this._totalCount=0,this._matchCount=0}dispose(){dispose(this.disposables)}}class TypeFilterController{constructor(tree,model,view,filter,keyboardNavigationDelegate){this.tree=tree,this.view=view,this.filter=filter,this.keyboardNavigationDelegate=keyboardNavigationDelegate,this._enabled=!1,this._pattern="",this._empty=!1,this._onDidChangeEmptyState=new Emitter,this.positionClassName="ne",this.automaticKeyboardNavigation=!0,this.triggered=!1,this._onDidChangePattern=new Emitter,this.enabledDisposables=new DisposableStore,this.disposables=new DisposableStore,this.domNode=$(`.monaco-list-type-filter.${this.positionClassName}`),this.domNode.draggable=!0,this.disposables.add(addDisposableListener(this.domNode,"dragstart",(()=>this.onDragStart()))),this.messageDomNode=append(view.getHTMLElement(),$(".monaco-list-type-filter-message")),this.labelDomNode=append(this.domNode,$("span.label"));const controls=append(this.domNode,$(".controls"));this._filterOnType=!!tree.options.filterOnType,this.filterOnTypeDomNode=append(controls,$("input.filter")),this.filterOnTypeDomNode.type="checkbox",this.filterOnTypeDomNode.checked=this._filterOnType,this.filterOnTypeDomNode.tabIndex=-1,this.updateFilterOnTypeTitleAndIcon(),this.disposables.add(addDisposableListener(this.filterOnTypeDomNode,"input",(()=>this.onDidChangeFilterOnType()))),this.clearDomNode=append(controls,$("button.clear"+Codicon.treeFilterClear.cssSelector)),this.clearDomNode.tabIndex=-1,this.clearDomNode.title=localize("clear","Clear"),this.keyboardNavigationEventFilter=tree.options.keyboardNavigationEventFilter,model.onDidSplice(this.onDidSpliceModel,this,this.disposables),this.updateOptions(tree.options)}get enabled(){return this._enabled}get pattern(){return this._pattern}get filterOnType(){return this._filterOnType}updateOptions(options){options.simpleKeyboardNavigation?this.disable():this.enable(),void 0!==options.filterOnType&&(this._filterOnType=!!options.filterOnType,this.filterOnTypeDomNode.checked=this._filterOnType,this.updateFilterOnTypeTitleAndIcon()),void 0!==options.automaticKeyboardNavigation&&(this.automaticKeyboardNavigation=options.automaticKeyboardNavigation),this.tree.refilter(),this.render(),this.automaticKeyboardNavigation||this.onEventOrInput("")}enable(){if(this._enabled)return;const onRawKeyDown=this.enabledDisposables.add(new DomEmitter(this.view.getHTMLElement(),"keydown")),onKeyDown=Event.chain(onRawKeyDown.event).filter((e=>!isInputElement(e.target)||e.target===this.filterOnTypeDomNode)).filter((e=>"Dead"!==e.key&&!/^Media/.test(e.key))).map((e=>new StandardKeyboardEvent(e))).filter(this.keyboardNavigationEventFilter||(()=>!0)).filter((()=>this.automaticKeyboardNavigation||this.triggered)).filter((e=>this.keyboardNavigationDelegate.mightProducePrintableCharacter(e)&&!(18===e.keyCode||16===e.keyCode||15===e.keyCode||17===e.keyCode)||(this.pattern.length>0||this.triggered)&&(9===e.keyCode||1===e.keyCode)&&!e.altKey&&!e.ctrlKey&&!e.metaKey||1===e.keyCode&&(isMacintosh?e.altKey&&!e.metaKey:e.ctrlKey)&&!e.shiftKey)).forEach((e=>{e.stopPropagation(),e.preventDefault()})).event,onClearClick=this.enabledDisposables.add(new DomEmitter(this.clearDomNode,"click"));Event.chain(Event.any(onKeyDown,onClearClick.event)).event(this.onEventOrInput,this,this.enabledDisposables),this.filter.pattern="",this.tree.refilter(),this.render(),this._enabled=!0,this.triggered=!1}disable(){this._enabled&&(this.domNode.remove(),this.enabledDisposables.clear(),this.tree.refilter(),this.render(),this._enabled=!1,this.triggered=!1)}onEventOrInput(e){"string"==typeof e?this.onInput(e):e instanceof MouseEvent||9===e.keyCode||1===e.keyCode&&(isMacintosh?e.altKey:e.ctrlKey)?this.onInput(""):1===e.keyCode?this.onInput(0===this.pattern.length?"":this.pattern.substr(0,this.pattern.length-1)):this.onInput(this.pattern+e.browserEvent.key)}onInput(pattern){const container=this.view.getHTMLElement();pattern&&!this.domNode.parentElement?container.append(this.domNode):!pattern&&this.domNode.parentElement&&(this.domNode.remove(),this.tree.domFocus()),this._pattern=pattern,this._onDidChangePattern.fire(pattern),this.filter.pattern=pattern,this.tree.refilter(),pattern&&this.tree.focusNext(0,!0,void 0,(node=>!FuzzyScore.isDefault(node.filterData)));const focus=this.tree.getFocus();if(focus.length>0){const element=focus[0];null===this.tree.getRelativeTop(element)&&this.tree.reveal(element,.5)}this.render(),pattern||(this.triggered=!1)}onDragStart(){const container=this.view.getHTMLElement(),{left}=getDomNodePagePosition(container),containerWidth=container.clientWidth,midContainerWidth=containerWidth/2,width=this.domNode.clientWidth,disposables=new DisposableStore;let positionClassName=this.positionClassName;const updatePosition=()=>{switch(positionClassName){case"nw":this.domNode.style.top="4px",this.domNode.style.left="4px";break;case"ne":this.domNode.style.top="4px",this.domNode.style.left=containerWidth-width-6+"px"}},onDragEnd=()=>{this.positionClassName=positionClassName,this.domNode.className=`monaco-list-type-filter ${this.positionClassName}`,this.domNode.style.top="",this.domNode.style.left="",dispose(disposables)};updatePosition(),this.domNode.classList.remove(positionClassName),this.domNode.classList.add("dragging"),disposables.add(toDisposable((()=>this.domNode.classList.remove("dragging")))),disposables.add(addDisposableListener(document,"dragover",(e=>(event=>{event.preventDefault();const x=event.clientX-left;event.dataTransfer&&(event.dataTransfer.dropEffect="none"),positionClassName=x<midContainerWidth?"nw":"ne",updatePosition()})(e)))),disposables.add(addDisposableListener(this.domNode,"dragend",(()=>onDragEnd()))),StaticDND.CurrentDragAndDropData=new DragAndDropData("vscode-ui"),disposables.add(toDisposable((()=>StaticDND.CurrentDragAndDropData=void 0)))}onDidSpliceModel(){this._enabled&&0!==this.pattern.length&&(this.tree.refilter(),this.render())}onDidChangeFilterOnType(){this.tree.updateOptions({filterOnType:this.filterOnTypeDomNode.checked}),this.tree.refilter(),this.tree.domFocus(),this.render(),this.updateFilterOnTypeTitleAndIcon()}updateFilterOnTypeTitleAndIcon(){this.filterOnType?(this.filterOnTypeDomNode.classList.remove(...Codicon.treeFilterOnTypeOff.classNamesArray),this.filterOnTypeDomNode.classList.add(...Codicon.treeFilterOnTypeOn.classNamesArray),this.filterOnTypeDomNode.title=localize("disable filter on type","Disable Filter on Type")):(this.filterOnTypeDomNode.classList.remove(...Codicon.treeFilterOnTypeOn.classNamesArray),this.filterOnTypeDomNode.classList.add(...Codicon.treeFilterOnTypeOff.classNamesArray),this.filterOnTypeDomNode.title=localize("enable filter on type","Enable Filter on Type"))}render(){const noMatches=this.filter.totalCount>0&&0===this.filter.matchCount;this.pattern&&this.tree.options.filterOnType&&noMatches?(this.messageDomNode.textContent=localize("empty","No elements found"),this._empty=!0):(this.messageDomNode.innerText="",this._empty=!1),this.domNode.classList.toggle("no-matches",noMatches),this.domNode.title=localize("found","Matched {0} out of {1} elements",this.filter.matchCount,this.filter.totalCount),this.labelDomNode.textContent=this.pattern.length>16?"…"+this.pattern.substr(this.pattern.length-16):this.pattern,this._onDidChangeEmptyState.fire(this._empty)}shouldAllowFocus(node){return!(this.enabled&&this.pattern&&!this.filterOnType)||(this.filter.totalCount>0&&this.filter.matchCount<=1||!FuzzyScore.isDefault(node.filterData))}dispose(){this._enabled&&(this.domNode.remove(),this.enabledDisposables.dispose(),this._enabled=!1,this.triggered=!1),this._onDidChangePattern.dispose(),dispose(this.disposables)}}function asTreeMouseEvent(event){let target=TreeMouseEventTarget.Unknown;return hasParentWithClass(event.browserEvent.target,"monaco-tl-twistie","monaco-tl-row")?target=TreeMouseEventTarget.Twistie:hasParentWithClass(event.browserEvent.target,"monaco-tl-contents","monaco-tl-row")&&(target=TreeMouseEventTarget.Element),{browserEvent:event.browserEvent,element:event.element?event.element.element:null,target}}function dfs(node,fn){fn(node),node.children.forEach((child=>dfs(child,fn)))}class Trait{constructor(getFirstViewElementWithTrait,identityProvider){this.getFirstViewElementWithTrait=getFirstViewElementWithTrait,this.identityProvider=identityProvider,this.nodes=[],this._onDidChange=new Emitter,this.onDidChange=this._onDidChange.event}get nodeSet(){return this._nodeSet||(this._nodeSet=this.createNodeSet()),this._nodeSet}set(nodes,browserEvent){!(null==browserEvent?void 0:browserEvent.__forceEvent)&&equals(this.nodes,nodes)||this._set(nodes,!1,browserEvent)}_set(nodes,silent,browserEvent){if(this.nodes=[...nodes],this.elements=void 0,this._nodeSet=void 0,!silent){const that=this;this._onDidChange.fire({get elements(){return that.get()},browserEvent})}}get(){return this.elements||(this.elements=this.nodes.map((node=>node.element))),[...this.elements]}getNodes(){return this.nodes}has(node){return this.nodeSet.has(node)}onDidModelSplice({insertedNodes,deletedNodes}){if(!this.identityProvider){const set=this.createNodeSet(),visit=node=>set.delete(node);return deletedNodes.forEach((node=>dfs(node,visit))),void this.set([...set.values()])}const deletedNodesIdSet=new Set,deletedNodesVisitor=node=>deletedNodesIdSet.add(this.identityProvider.getId(node.element).toString());deletedNodes.forEach((node=>dfs(node,deletedNodesVisitor)));const insertedNodesMap=new Map,insertedNodesVisitor=node=>insertedNodesMap.set(this.identityProvider.getId(node.element).toString(),node);insertedNodes.forEach((node=>dfs(node,insertedNodesVisitor)));const nodes=[];for(const node of this.nodes){const id=this.identityProvider.getId(node.element).toString();if(deletedNodesIdSet.has(id)){const insertedNode=insertedNodesMap.get(id);insertedNode&&nodes.push(insertedNode)}else nodes.push(node)}if(this.nodes.length>0&&0===nodes.length){const node=this.getFirstViewElementWithTrait();node&&nodes.push(node)}this._set(nodes,!0)}createNodeSet(){const set=new Set;for(const node of this.nodes)set.add(node);return set}}class TreeNodeListMouseController extends MouseController{constructor(list,tree){super(list),this.tree=tree}onViewPointer(e){if(isInputElement(e.browserEvent.target)||isMonacoEditor(e.browserEvent.target))return;const node=e.element;if(!node)return super.onViewPointer(e);if(this.isSelectionRangeChangeEvent(e)||this.isSelectionSingleChangeEvent(e))return super.onViewPointer(e);const target=e.browserEvent.target,onTwistie=target.classList.contains("monaco-tl-twistie")||target.classList.contains("monaco-icon-label")&&target.classList.contains("folder-icon")&&e.browserEvent.offsetX<16;let expandOnlyOnTwistieClick=!1;if(expandOnlyOnTwistieClick="function"==typeof this.tree.expandOnlyOnTwistieClick?this.tree.expandOnlyOnTwistieClick(node.element):!!this.tree.expandOnlyOnTwistieClick,expandOnlyOnTwistieClick&&!onTwistie&&2!==e.browserEvent.detail)return super.onViewPointer(e);if(!this.tree.expandOnDoubleClick&&2===e.browserEvent.detail)return super.onViewPointer(e);if(node.collapsible){const model=this.tree.model,location=model.getNodeLocation(node),recursive=e.browserEvent.altKey;if(this.tree.setFocus([location]),model.setCollapsed(location,void 0,recursive),expandOnlyOnTwistieClick&&onTwistie)return}super.onViewPointer(e)}onDoubleClick(e){!e.browserEvent.target.classList.contains("monaco-tl-twistie")&&this.tree.expandOnDoubleClick&&super.onDoubleClick(e)}}class TreeNodeList extends List{constructor(user,container,virtualDelegate,renderers,focusTrait,selectionTrait,anchorTrait,options){super(user,container,virtualDelegate,renderers,options),this.focusTrait=focusTrait,this.selectionTrait=selectionTrait,this.anchorTrait=anchorTrait}createMouseController(options){return new TreeNodeListMouseController(this,options.tree)}splice(start,deleteCount,elements=[]){if(super.splice(start,deleteCount,elements),0===elements.length)return;const additionalFocus=[],additionalSelection=[];let anchor;elements.forEach(((node,index)=>{this.focusTrait.has(node)&&additionalFocus.push(start+index),this.selectionTrait.has(node)&&additionalSelection.push(start+index),this.anchorTrait.has(node)&&(anchor=start+index)})),additionalFocus.length>0&&super.setFocus(distinct([...super.getFocus(),...additionalFocus])),additionalSelection.length>0&&super.setSelection(distinct([...super.getSelection(),...additionalSelection])),"number"==typeof anchor&&super.setAnchor(anchor)}setFocus(indexes,browserEvent,fromAPI=!1){super.setFocus(indexes,browserEvent),fromAPI||this.focusTrait.set(indexes.map((i=>this.element(i))),browserEvent)}setSelection(indexes,browserEvent,fromAPI=!1){super.setSelection(indexes,browserEvent),fromAPI||this.selectionTrait.set(indexes.map((i=>this.element(i))),browserEvent)}setAnchor(index,fromAPI=!1){super.setAnchor(index),fromAPI||(void 0===index?this.anchorTrait.set([]):this.anchorTrait.set([this.element(index)]))}}export class AbstractTree{constructor(_user,container,delegate,renderers,_options={}){this._user=_user,this._options=_options,this.eventBufferer=new EventBufferer,this.disposables=new DisposableStore,this._onWillRefilter=new Emitter,this.onWillRefilter=this._onWillRefilter.event,this._onDidUpdateOptions=new Emitter;const treeDelegate=new ComposedTreeDelegate(delegate),onDidChangeCollapseStateRelay=new Relay,onDidChangeActiveNodes=new Relay,activeNodes=new EventCollection(onDidChangeActiveNodes.event);this.renderers=renderers.map((r=>new TreeRenderer(r,(()=>this.model),onDidChangeCollapseStateRelay.event,activeNodes,_options)));for(let r of this.renderers)this.disposables.add(r);let filter;_options.keyboardNavigationLabelProvider&&(filter=new TypeFilter(this,_options.keyboardNavigationLabelProvider,_options.filter),_options=Object.assign(Object.assign({},_options),{filter}),this.disposables.add(filter)),this.focus=new Trait((()=>this.view.getFocusedElements()[0]),_options.identityProvider),this.selection=new Trait((()=>this.view.getSelectedElements()[0]),_options.identityProvider),this.anchor=new Trait((()=>this.view.getAnchorElement()),_options.identityProvider),this.view=new TreeNodeList(_user,container,treeDelegate,this.renderers,this.focus,this.selection,this.anchor,Object.assign(Object.assign({},asListOptions((()=>this.model),_options)),{tree:this})),this.model=this.createModel(_user,this.view,_options),onDidChangeCollapseStateRelay.input=this.model.onDidChangeCollapseState;const onDidModelSplice=Event.forEach(this.model.onDidSplice,(e=>{this.eventBufferer.bufferEvents((()=>{this.focus.onDidModelSplice(e),this.selection.onDidModelSplice(e)}))}));if(onDidModelSplice((()=>null),null,this.disposables),onDidChangeActiveNodes.input=Event.chain(Event.any(onDidModelSplice,this.focus.onDidChange,this.selection.onDidChange)).debounce((()=>null),0).map((()=>{const set=new Set;for(const node of this.focus.getNodes())set.add(node);for(const node of this.selection.getNodes())set.add(node);return[...set.values()]})).event,!1!==_options.keyboardSupport){const onKeyDown=Event.chain(this.view.onKeyDown).filter((e=>!isInputElement(e.target))).map((e=>new StandardKeyboardEvent(e)));onKeyDown.filter((e=>15===e.keyCode)).on(this.onLeftArrow,this,this.disposables),onKeyDown.filter((e=>17===e.keyCode)).on(this.onRightArrow,this,this.disposables),onKeyDown.filter((e=>10===e.keyCode)).on(this.onSpace,this,this.disposables)}if(_options.keyboardNavigationLabelProvider){const delegate=_options.keyboardNavigationDelegate||DefaultKeyboardNavigationDelegate;this.typeFilterController=new TypeFilterController(this,this.model,this.view,filter,delegate),this.focusNavigationFilter=node=>this.typeFilterController.shouldAllowFocus(node),this.disposables.add(this.typeFilterController)}this.styleElement=createStyleSheet(this.view.getHTMLElement()),this.getHTMLElement().classList.toggle("always",this._options.renderIndentGuides===RenderIndentGuides.Always)}get onDidChangeFocus(){return this.eventBufferer.wrapEvent(this.focus.onDidChange)}get onDidChangeSelection(){return this.eventBufferer.wrapEvent(this.selection.onDidChange)}get onMouseDblClick(){return Event.map(this.view.onMouseDblClick,asTreeMouseEvent)}get onPointer(){return Event.map(this.view.onPointer,asTreeMouseEvent)}get onDidFocus(){return this.view.onDidFocus}get onDidChangeModel(){return Event.signal(this.model.onDidSplice)}get onDidChangeCollapseState(){return this.model.onDidChangeCollapseState}get expandOnDoubleClick(){return void 0===this._options.expandOnDoubleClick||this._options.expandOnDoubleClick}get expandOnlyOnTwistieClick(){return void 0===this._options.expandOnlyOnTwistieClick||this._options.expandOnlyOnTwistieClick}get onDidDispose(){return this.view.onDidDispose}updateOptions(optionsUpdate={}){this._options=Object.assign(Object.assign({},this._options),optionsUpdate);for(const renderer of this.renderers)renderer.updateOptions(optionsUpdate);this.view.updateOptions(Object.assign(Object.assign({},this._options),{enableKeyboardNavigation:this._options.simpleKeyboardNavigation})),this.typeFilterController&&this.typeFilterController.updateOptions(this._options),this._onDidUpdateOptions.fire(this._options),this.getHTMLElement().classList.toggle("always",this._options.renderIndentGuides===RenderIndentGuides.Always)}get options(){return this._options}getHTMLElement(){return this.view.getHTMLElement()}get scrollTop(){return this.view.scrollTop}set scrollTop(scrollTop){this.view.scrollTop=scrollTop}domFocus(){this.view.domFocus()}layout(height,width){this.view.layout(height,width)}style(styles){const suffix=`.${this.view.domId}`,content=[];styles.treeIndentGuidesStroke&&(content.push(`.monaco-list${suffix}:hover .monaco-tl-indent > .indent-guide, .monaco-list${suffix}.always .monaco-tl-indent > .indent-guide  { border-color: ${styles.treeIndentGuidesStroke.transparent(.4)}; }`),content.push(`.monaco-list${suffix} .monaco-tl-indent > .indent-guide.active { border-color: ${styles.treeIndentGuidesStroke}; }`)),this.styleElement.textContent=content.join("\n"),this.view.style(styles)}getParentElement(location){const parentRef=this.model.getParentNodeLocation(location);return this.model.getNode(parentRef).element}getFirstElementChild(location){return this.model.getFirstElementChild(location)}getNode(location){return this.model.getNode(location)}collapse(location,recursive=!1){return this.model.setCollapsed(location,!0,recursive)}expand(location,recursive=!1){return this.model.setCollapsed(location,!1,recursive)}isCollapsible(location){return this.model.isCollapsible(location)}setCollapsible(location,collapsible){return this.model.setCollapsible(location,collapsible)}isCollapsed(location){return this.model.isCollapsed(location)}refilter(){this._onWillRefilter.fire(void 0),this.model.refilter()}setSelection(elements,browserEvent){const nodes=elements.map((e=>this.model.getNode(e)));this.selection.set(nodes,browserEvent);const indexes=elements.map((e=>this.model.getListIndex(e))).filter((i=>i>-1));this.view.setSelection(indexes,browserEvent,!0)}getSelection(){return this.selection.get()}setFocus(elements,browserEvent){const nodes=elements.map((e=>this.model.getNode(e)));this.focus.set(nodes,browserEvent);const indexes=elements.map((e=>this.model.getListIndex(e))).filter((i=>i>-1));this.view.setFocus(indexes,browserEvent,!0)}focusNext(n=1,loop=!1,browserEvent,filter=this.focusNavigationFilter){this.view.focusNext(n,loop,browserEvent,filter)}getFocus(){return this.focus.get()}reveal(location,relativeTop){this.model.expandTo(location);const index=this.model.getListIndex(location);-1!==index&&this.view.reveal(index,relativeTop)}getRelativeTop(location){const index=this.model.getListIndex(location);return-1===index?null:this.view.getRelativeTop(index)}onLeftArrow(e){e.preventDefault(),e.stopPropagation();const nodes=this.view.getFocusedElements();if(0===nodes.length)return;const node=nodes[0],location=this.model.getNodeLocation(node);if(!this.model.setCollapsed(location,!0)){const parentLocation=this.model.getParentNodeLocation(location);if(!parentLocation)return;const parentListIndex=this.model.getListIndex(parentLocation);this.view.reveal(parentListIndex),this.view.setFocus([parentListIndex])}}onRightArrow(e){e.preventDefault(),e.stopPropagation();const nodes=this.view.getFocusedElements();if(0===nodes.length)return;const node=nodes[0],location=this.model.getNodeLocation(node);if(!this.model.setCollapsed(location,!1)){if(!node.children.some((child=>child.visible)))return;const[focusedIndex]=this.view.getFocus(),firstChildIndex=focusedIndex+1;this.view.reveal(firstChildIndex),this.view.setFocus([firstChildIndex])}}onSpace(e){e.preventDefault(),e.stopPropagation();const nodes=this.view.getFocusedElements();if(0===nodes.length)return;const node=nodes[0],location=this.model.getNodeLocation(node),recursive=e.browserEvent.altKey;this.model.setCollapsed(location,void 0,recursive)}dispose(){dispose(this.disposables),this.view.dispose()}}