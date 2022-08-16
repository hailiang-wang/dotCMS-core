var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{CancellationToken}from"../../../../base/common/cancellation.js";import{onUnexpectedExternalError}from"../../../../base/common/errors.js";import{registerModelAndPositionCommand}from"../../../browser/editorExtensions.js";import{ReferencesModel}from"./referencesModel.js";import{ILanguageFeaturesService}from"../../../common/services/languageFeatures.js";function getLocationLinks(model,position,registry,provide){const promises=registry.ordered(model).map((provider=>Promise.resolve(provide(provider,model,position)).then(void 0,(err=>{onUnexpectedExternalError(err)}))));return Promise.all(promises).then((values=>{const result=[];for(let value of values)Array.isArray(value)?result.push(...value):value&&result.push(value);return result}))}export function getDefinitionsAtPosition(registry,model,position,token){return getLocationLinks(model,position,registry,((provider,model,position)=>provider.provideDefinition(model,position,token)))}export function getDeclarationsAtPosition(registry,model,position,token){return getLocationLinks(model,position,registry,((provider,model,position)=>provider.provideDeclaration(model,position,token)))}export function getImplementationsAtPosition(registry,model,position,token){return getLocationLinks(model,position,registry,((provider,model,position)=>provider.provideImplementation(model,position,token)))}export function getTypeDefinitionsAtPosition(registry,model,position,token){return getLocationLinks(model,position,registry,((provider,model,position)=>provider.provideTypeDefinition(model,position,token)))}export function getReferencesAtPosition(registry,model,position,compact,token){return getLocationLinks(model,position,registry,((provider,model,position)=>__awaiter(this,void 0,void 0,(function*(){const result=yield provider.provideReferences(model,position,{includeDeclaration:!0},token);if(!compact||!result||2!==result.length)return result;const resultWithoutDeclaration=yield provider.provideReferences(model,position,{includeDeclaration:!1},token);return resultWithoutDeclaration&&1===resultWithoutDeclaration.length?resultWithoutDeclaration:result}))))}function _sortedAndDeduped(callback){return __awaiter(this,void 0,void 0,(function*(){const rawLinks=yield callback(),model=new ReferencesModel(rawLinks,""),modelLinks=model.references.map((ref=>ref.link));return model.dispose(),modelLinks}))}registerModelAndPositionCommand("_executeDefinitionProvider",((accessor,model,position)=>{const promise=getDefinitionsAtPosition(accessor.get(ILanguageFeaturesService).definitionProvider,model,position,CancellationToken.None);return _sortedAndDeduped((()=>promise))})),registerModelAndPositionCommand("_executeTypeDefinitionProvider",((accessor,model,position)=>{const promise=getTypeDefinitionsAtPosition(accessor.get(ILanguageFeaturesService).typeDefinitionProvider,model,position,CancellationToken.None);return _sortedAndDeduped((()=>promise))})),registerModelAndPositionCommand("_executeDeclarationProvider",((accessor,model,position)=>{const promise=getDeclarationsAtPosition(accessor.get(ILanguageFeaturesService).declarationProvider,model,position,CancellationToken.None);return _sortedAndDeduped((()=>promise))})),registerModelAndPositionCommand("_executeReferenceProvider",((accessor,model,position)=>{const promise=getReferencesAtPosition(accessor.get(ILanguageFeaturesService).referenceProvider,model,position,!1,CancellationToken.None);return _sortedAndDeduped((()=>promise))})),registerModelAndPositionCommand("_executeImplementationProvider",((accessor,model,position)=>{const promise=getImplementationsAtPosition(accessor.get(ILanguageFeaturesService).implementationProvider,model,position,CancellationToken.None);return _sortedAndDeduped((()=>promise))}));