var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{IContextKeyService,RawContextKey}from"../../../../platform/contextkey/common/contextkey.js";let WordContextKey=class WordContextKey{constructor(_editor,contextKeyService){this._editor=_editor,this._enabled=!1,this._ckAtEnd=WordContextKey.AtEnd.bindTo(contextKeyService),this._configListener=this._editor.onDidChangeConfiguration((e=>e.hasChanged(111)&&this._update())),this._update()}dispose(){var _a;this._configListener.dispose(),null===(_a=this._selectionListener)||void 0===_a||_a.dispose(),this._ckAtEnd.reset()}_update(){const enabled="on"===this._editor.getOption(111);if(this._enabled!==enabled)if(this._enabled=enabled,this._enabled){const checkForWordEnd=()=>{if(!this._editor.hasModel())return void this._ckAtEnd.set(!1);const model=this._editor.getModel(),selection=this._editor.getSelection(),word=model.getWordAtPosition(selection.getStartPosition());word?this._ckAtEnd.set(word.endColumn===selection.getStartPosition().column):this._ckAtEnd.set(!1)};this._selectionListener=this._editor.onDidChangeCursorSelection(checkForWordEnd),checkForWordEnd()}else this._selectionListener&&(this._ckAtEnd.reset(),this._selectionListener.dispose(),this._selectionListener=void 0)}};WordContextKey.AtEnd=new RawContextKey("atEndOfWord",!1),WordContextKey=__decorate([__param(1,IContextKeyService)],WordContextKey);export{WordContextKey};