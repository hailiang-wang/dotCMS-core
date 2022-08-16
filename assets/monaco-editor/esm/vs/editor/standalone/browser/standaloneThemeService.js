import*as dom from"../../../base/browser/dom.js";import{Color}from"../../../base/common/color.js";import{Emitter}from"../../../base/common/event.js";import{TokenizationRegistry,TokenMetadata}from"../../common/languages.js";import{TokenTheme,generateTokensCSSForColorMap}from"../../common/languages/supports/tokenization.js";import{hc_black,vs,vs_dark}from"../common/themes.js";import{Registry}from"../../../platform/registry/common/platform.js";import{asCssVariableName,Extensions}from"../../../platform/theme/common/colorRegistry.js";import{Extensions as ThemingExtensions}from"../../../platform/theme/common/themeService.js";import{Disposable}from"../../../base/common/lifecycle.js";import{ColorScheme}from"../../../platform/theme/common/theme.js";import{getIconsStyleSheet,UnthemedProductIconTheme}from"../../../platform/theme/browser/iconsStyleSheet.js";const VS_THEME_NAME="vs",VS_DARK_THEME_NAME="vs-dark",HC_BLACK_THEME_NAME="hc-black",colorRegistry=Registry.as(Extensions.ColorContribution),themingRegistry=Registry.as(ThemingExtensions.ThemingContribution);class StandaloneTheme{constructor(name,standaloneThemeData){this.semanticHighlighting=!1,this.themeData=standaloneThemeData;const base=standaloneThemeData.base;name.length>0?(isBuiltinTheme(name)?this.id=name:this.id=base+" "+name,this.themeName=name):(this.id=base,this.themeName=base),this.colors=null,this.defaultColors=Object.create(null),this._tokenTheme=null}get base(){return this.themeData.base}notifyBaseUpdated(){this.themeData.inherit&&(this.colors=null,this._tokenTheme=null)}getColors(){if(!this.colors){const colors=new Map;for(let id in this.themeData.colors)colors.set(id,Color.fromHex(this.themeData.colors[id]));if(this.themeData.inherit){const baseData=getBuiltinRules(this.themeData.base);for(let id in baseData.colors)colors.has(id)||colors.set(id,Color.fromHex(baseData.colors[id]))}this.colors=colors}return this.colors}getColor(colorId,useDefault){const color=this.getColors().get(colorId);return color||(!1!==useDefault?this.getDefault(colorId):void 0)}getDefault(colorId){let color=this.defaultColors[colorId];return color||(color=colorRegistry.resolveDefaultColor(colorId,this),this.defaultColors[colorId]=color,color)}defines(colorId){return Object.prototype.hasOwnProperty.call(this.getColors(),colorId)}get type(){switch(this.base){case"vs":return ColorScheme.LIGHT;case"hc-black":return ColorScheme.HIGH_CONTRAST;default:return ColorScheme.DARK}}get tokenTheme(){if(!this._tokenTheme){let rules=[],encodedTokensColors=[];if(this.themeData.inherit){const baseData=getBuiltinRules(this.themeData.base);rules=baseData.rules,baseData.encodedTokensColors&&(encodedTokensColors=baseData.encodedTokensColors)}const editorForeground=this.themeData.colors["editor.foreground"],editorBackground=this.themeData.colors["editor.background"];if(editorForeground||editorBackground){const rule={token:""};editorForeground&&(rule.foreground=editorForeground),editorBackground&&(rule.background=editorBackground),rules.push(rule)}rules=rules.concat(this.themeData.rules),this.themeData.encodedTokensColors&&(encodedTokensColors=this.themeData.encodedTokensColors),this._tokenTheme=TokenTheme.createFromRawTokenTheme(rules,encodedTokensColors)}return this._tokenTheme}getTokenStyleMetadata(type,modifiers,modelLanguage){const metadata=this.tokenTheme._match([type].concat(modifiers).join(".")).metadata,foreground=TokenMetadata.getForeground(metadata),fontStyle=TokenMetadata.getFontStyle(metadata);return{foreground,italic:Boolean(1&fontStyle),bold:Boolean(2&fontStyle),underline:Boolean(4&fontStyle),strikethrough:Boolean(8&fontStyle)}}}function isBuiltinTheme(themeName){return"vs"===themeName||"vs-dark"===themeName||"hc-black"===themeName}function getBuiltinRules(builtinTheme){switch(builtinTheme){case"vs":return vs;case"vs-dark":return vs_dark;case"hc-black":return hc_black}}function newBuiltInTheme(builtinTheme){const themeData=getBuiltinRules(builtinTheme);return new StandaloneTheme(builtinTheme,themeData)}export class StandaloneThemeService extends Disposable{constructor(){super(),this._onColorThemeChange=this._register(new Emitter),this.onDidColorThemeChange=this._onColorThemeChange.event,this._onProductIconThemeChange=this._register(new Emitter),this.onDidProductIconThemeChange=this._onProductIconThemeChange.event,this._environment=Object.create(null),this._builtInProductIconTheme=new UnthemedProductIconTheme,this._autoDetectHighContrast=!0,this._knownThemes=new Map,this._knownThemes.set("vs",newBuiltInTheme("vs")),this._knownThemes.set("vs-dark",newBuiltInTheme("vs-dark")),this._knownThemes.set("hc-black",newBuiltInTheme("hc-black"));const iconsStyleSheet=getIconsStyleSheet(this);this._codiconCSS=iconsStyleSheet.getCSS(),this._themeCSS="",this._allCSS=`${this._codiconCSS}\n${this._themeCSS}`,this._globalStyleElement=null,this._styleElements=[],this._colorMapOverride=null,this.setTheme("vs"),iconsStyleSheet.onDidChange((()=>{this._codiconCSS=iconsStyleSheet.getCSS(),this._updateCSS()})),dom.addMatchMediaChangeListener("(forced-colors: active)",(()=>{this._updateActualTheme()}))}registerEditorContainer(domNode){return dom.isInShadowDOM(domNode)?this._registerShadowDomContainer(domNode):this._registerRegularEditorContainer()}_registerRegularEditorContainer(){return this._globalStyleElement||(this._globalStyleElement=dom.createStyleSheet(),this._globalStyleElement.className="monaco-colors",this._globalStyleElement.textContent=this._allCSS,this._styleElements.push(this._globalStyleElement)),Disposable.None}_registerShadowDomContainer(domNode){const styleElement=dom.createStyleSheet(domNode);return styleElement.className="monaco-colors",styleElement.textContent=this._allCSS,this._styleElements.push(styleElement),{dispose:()=>{for(let i=0;i<this._styleElements.length;i++)if(this._styleElements[i]===styleElement)return void this._styleElements.splice(i,1)}}}defineTheme(themeName,themeData){if(!/^[a-z0-9\-]+$/i.test(themeName))throw new Error("Illegal theme name!");if(!isBuiltinTheme(themeData.base)&&!isBuiltinTheme(themeName))throw new Error("Illegal theme base!");this._knownThemes.set(themeName,new StandaloneTheme(themeName,themeData)),isBuiltinTheme(themeName)&&this._knownThemes.forEach((theme=>{theme.base===themeName&&theme.notifyBaseUpdated()})),this._theme.themeName===themeName&&this.setTheme(themeName)}getColorTheme(){return this._theme}setColorMapOverride(colorMapOverride){this._colorMapOverride=colorMapOverride,this._updateThemeOrColorMap()}setTheme(themeName){let theme;theme=this._knownThemes.has(themeName)?this._knownThemes.get(themeName):this._knownThemes.get("vs"),this._desiredTheme=theme,this._updateActualTheme()}_updateActualTheme(){const theme=this._autoDetectHighContrast&&window.matchMedia("(forced-colors: active)").matches?this._knownThemes.get("hc-black"):this._desiredTheme;this._theme!==theme&&(this._theme=theme,this._updateThemeOrColorMap())}setAutoDetectHighContrast(autoDetectHighContrast){this._autoDetectHighContrast=autoDetectHighContrast,this._updateActualTheme()}_updateThemeOrColorMap(){const cssRules=[],hasRule={},ruleCollector={addRule:rule=>{hasRule[rule]||(cssRules.push(rule),hasRule[rule]=!0)}};themingRegistry.getThemingParticipants().forEach((p=>p(this._theme,ruleCollector,this._environment)));const colorVariables=[];for(const item of colorRegistry.getColors()){const color=this._theme.getColor(item.id,!0);color&&colorVariables.push(`${asCssVariableName(item.id)}: ${color.toString()};`)}ruleCollector.addRule(`.monaco-editor { ${colorVariables.join("\n")} }`);const colorMap=this._colorMapOverride||this._theme.tokenTheme.getColorMap();ruleCollector.addRule(generateTokensCSSForColorMap(colorMap)),this._themeCSS=cssRules.join("\n"),this._updateCSS(),TokenizationRegistry.setColorMap(colorMap),this._onColorThemeChange.fire(this._theme)}_updateCSS(){this._allCSS=`${this._codiconCSS}\n${this._themeCSS}`,this._styleElements.forEach((styleElement=>styleElement.textContent=this._allCSS))}getFileIconTheme(){return{hasFileIcons:!1,hasFolderIcons:!1,hidesExplorerArrows:!1}}getProductIconTheme(){return this._builtInProductIconTheme}}