/*! For license information please see shell.contribution.js.LICENSE.txt */
import{registerLanguage}from"../_.contribution.js";registerLanguage({id:"shell",extensions:[".sh",".bash"],aliases:["Shell","sh"],loader:()=>import("./shell.js")});