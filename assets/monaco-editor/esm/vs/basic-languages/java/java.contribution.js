/*! For license information please see java.contribution.js.LICENSE.txt */
import{registerLanguage}from"../_.contribution.js";registerLanguage({id:"java",extensions:[".java",".jav"],aliases:["Java","java"],mimetypes:["text/x-java-source","text/x-java"],loader:()=>import("./java.js")});