const hasOwnProperty=Object.prototype.hasOwnProperty;export function forEach(from,callback){for(let key in from)if(hasOwnProperty.call(from,key)){if(!1===callback({key,value:from[key]},(function(){delete from[key]})))return}}export class SetMap{constructor(){this.map=new Map}add(key,value){let values=this.map.get(key);values||(values=new Set,this.map.set(key,values)),values.add(value)}delete(key,value){const values=this.map.get(key);values&&(values.delete(value),0===values.size&&this.map.delete(key))}forEach(key,fn){const values=this.map.get(key);values&&values.forEach(fn)}}