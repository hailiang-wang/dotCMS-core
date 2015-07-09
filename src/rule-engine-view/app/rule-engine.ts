import XDebug from 'debug';
let log = XDebug('RuleEngineView.RuleEngineComponent');


import {bootstrap, For, If} from 'angular2/angular2';

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {FormBuilder, Validators, ControlGroup} from 'angular2/forms';

import jsonp from 'jsonp'

import {Core, ServerManager, EntityMeta} from '../../coreweb/index.js'
import {RuleEngineAPI, ruleRepo, ruleGroupRepo, Rule, RuleGroup, RuleStore, actions} from '../../rule-engine/index.js';

import "bootstrap/css/bootstrap.css!";
import "./styles/rule-engine.css!";
import "./styles/theme-dark.css!";

import ruleEngineTemplate from './rule-engine.tpl.html!text'
import ruleTemplate from './rule.tpl.html!text'
import ruleActionTemplate from './rule-action.tpl.html!text'
import conditionGroupTemplate from './condition-group.tpl.html!text'
import conditionTemplate from './condition.tpl.html!text'

let count = 0;
@Component({
  selector: 'rule-condition',
  properties: {
    "conditionMeta": "condition-meta"
  }
})
@View({
  template: conditionTemplate,
  directives: [If, For]
})
class ConditionComponent {
  idCount:number;
  _conditionMeta:any;
  condition:any;
  conditionValue:string;
  conditionlet:any;
  conditionlets:Array;


  constructor() {
    this.idCount = count;
    log('Creating ConditionComponent: ', count++)
    this.conditionlets = []
    conditionletsPromise.then((result)=>{
      this.conditionlets = conditionletsAry
    })
    this.condition = {}
    this.conditionValue = ''
    this.conditionlet = {}

  }

  onChange(snapshot){
    log(this.idCount, " Condition's type is ", this.condition);
    this.condition = snapshot.val()
    this.conditionlet = conditionletsMap.get(this.condition.conditionlet)
    this.conditionValue = this.getComparisonValue()
  }


  set conditionMeta(conditionMeta) {
    log(this.idCount, " Setting conditionMeta: ", conditionMeta.key())
    this._conditionMeta = conditionMeta
    conditionMeta.once('value', this.onChange.bind(this))
  }

  get conditionMeta() {
    return this._conditionMeta;
  }

  setConditionlet(condtitionletId){
    log('Setting conditionlet id to: ', condtitionletId)
    this.condition.conditionlet = condtitionletId
    this.conditionlet =  conditionletsMap.get(this.condition.conditionlet)
    this.updateCondition()
  }

  setComparison(comparisonId){
    log('Setting conditionlet comparison id to: ', comparisonId)
    this.condition.comparison = comparisonId
    this.updateCondition()

  }

  getComparisonValueKey(){
    let key = null
    let keys = Object.keys(this.condition.values)
    if(keys.length){
      key = keys[0]
    }
    return key
  }

  getComparisonValue(){
    let value = ''
    let key = this.getComparisonValueKey()
    if(key) {
      value = this.condition.values[key].value
    }
    return value
  }

  setComparisonValue(newValue){
    let key = this.getComparisonValueKey() || 'aFakeId'
    this.condition.values[key] = {id:key, priority: 10, value: newValue}
    this.updateCondition()
  }

  removeCondition() {
    //ClauseActionCreators.removeClause(this._clause)
  }

  toggleOperator() {
    //ClauseActionCreators.toggleOperator(this._clause)
  }

  updateCondition() {
    log('Updating Condition: ', this.condition)
    this.conditionMeta.set(this.condition)
  }

}


@Component({
  selector: 'condition-group',
  properties: {
    "rule": "rule",
    "groupSnap": "group-snap"
  }
})
@View({
  template: conditionGroupTemplate,
  directives: [ConditionComponent, If, For]
})
class ConditionGroupComponent {
  _groupSnap:any;
  group:any;
  rule:any;
  groupCollapsed:boolean;
  conditions:Array;

  constructor() {
    log('Creating ConditionGroupComponent')
    this.groupCollapsed = false
    this.conditions = []
  }

  set groupSnap(groupSnap) {
    log('Setting ConditionGroup snapshot: ', groupSnap.key())
    this._groupSnap = groupSnap
    this.group = groupSnap.val()
    this.conditions = this.getConditions()
  }

  get groupSnap() {
    return this._groupSnap;
  }

  getConditions() {
    let referenceSnaps = []
    let conditionMetas = []
    this.groupSnap.child('conditions').forEach((childSnap) => {
      let key = childSnap.key()
      let childMeta = childSnap['entityMeta']
      referenceSnaps.push(key) // the snap value is 'true', as this is a reference.
      conditionMetas.push(new EntityMeta('/api/v1/sites/48190c8c-42c4-46af-8d1a-0cd5db894797/ruleengine/conditions/' + key))
    })
    return conditionMetas
  }

  addCondition() {
    log('Adding condition to ConditionsGroup')
    let condition = {
      priority: 10,

      name: "Condition. " + new Date().toISOString(),
      rule: this.rule.key,
      conditionlet: 'UsersCountryConditionlet',
      comparison: 'Is',
      operator: 'AND',
      values: {
        a: {
          id: 'a',
          value: 'US',
          priority: 10
        }
      }
    }
    let condRoot:EntityMeta = new EntityMeta('/api/v1/sites/48190c8c-42c4-46af-8d1a-0cd5db894797/ruleengine/conditions')

    condRoot.push(condition).then((result) => {
      this.group.conditions = this.group.conditions || {}
      this.group.conditions[result.key()] = true
      this.updateGroup()
    }).catch((e) => {
      log(e)
    })
  }

  toggleOperator() {
    this.group.operator = this.group.operator === "AND" ? "OR" : "AND"
    this.updateGroup()
  }

  updateGroup() {
    log('Updating ConditionsGroup')
    this.groupSnap.ref().set(this.group)
  }

}


@Component({
  selector: 'rule-action',
  properties: {
    "actionSnap": "action-snap",
    "ruleAction": "rule-action",
    "index": "index"
  }
})
@View({
  template: ruleActionTemplate,
  directives: [If, For],
})
class RuleActionComponent {
  _actionSnap:any;
  ruleAction:any;
  index:number;

  constructor() {
  }

  get actionSnap():any {
    return this._actionSnap;
  }

  set actionSnap(actionSnap:any) {
    this._actionSnap = actionSnap
    this.ruleAction = actionSnap.val();
  }


  saveChanges() {
    //RuleActionActionCreators.updateRuleAction(this._ruleAction)
  }

  onChange(action) {
  }

  removeRuleAction() {
    //RuleActionActionCreators.removeRuleAction(this._ruleAction.$key)
  }
}


@Component({
  selector: 'rule',
  properties: {
    "ruleSnap": "rule-snap"
  },
  injectables: [
    FormBuilder
  ]
})
@View({
  template: ruleTemplate,
  directives: [ConditionGroupComponent, If, For]
})
class RuleComponent {
  rule:any;
  _ruleSnap:any;
  collapsed:boolean;
  fireOnDropDownExpanded:boolean;
  ruleGroups:Array;

  constructor() {
    log('Creating RuleComponent')
    this.collapsed = true
    this.fireOnDropDownExpanded = false
    this.ruleGroups = []
  }

  set ruleSnap(ruleSnap:any) {
    log('Setting Rule snapshot')
    this._ruleSnap = ruleSnap
    this.rule = ruleSnap.val()
    this.ruleGroups = []
    this.ruleSnap.child('conditionGroups').forEach((childSnap) => {
      this.ruleGroups.push(childSnap)
    })
  }

  get ruleSnap():any {
    return this._ruleSnap
  }
  //
  //getRuleGroups() {
  //  let groupSnaps = []
  //  this.ruleSnap.child('conditionGroups').forEach((childSnap) => {
  //    groupSnaps.push(childSnap)
  //  })
  //  return groupSnaps
  //}


  setFireOn(value:string) {
    this.rule.fireOn = value
    this.fireOnDropDownExpanded = false
    this.updateRule()
  }

  setRuleName(name:string) {
    this.rule.name = name
    this.updateRule()
  }

  addGroup() {
    let group = {
      priority: 10,
      operator: 'OR'
    }

    this.ruleSnap.ref().child('conditiongroups').push(group).then((snapshot) => {
      let group = snapshot['val']()
      this.rule.conditionGroups[snapshot.key()] = group
      group.conditions = group.conditions || {}
      this.updateRule()
    }).catch((e) => {
      log(e)
    })
  }

  addRuleAction() {
    let action = {
      name: "CoreWeb created this action: " + new Date().toISOString(),
      priority: 10,
      actionlet: 'Set user variable'
    }
  }


  removeRule() {
    this.ruleSnap.ref().remove().then((x) => {
      actions.update(x)
    }).catch((e) => {
      log("Not yay :~(: ", e)
      throw e
    })
  }

  updateRule() {
    log('Updating Rule')
    this.ruleSnap.ref().set(this.rule)
  }

}


@Component({
  selector: 'rule-engine'
})
@View({
  template: ruleEngineTemplate,
  directives: [For, RuleComponent, If]
})
class RuleEngine {
  rules:Array;
  baseUrl:string;
  rulesRef:EntityMeta;

  constructor() {
    log('Creating RuleEngine component.')
    this.rules = []
    this.baseUrl = ServerManager.baseUrl;
    this.rulesRef = new EntityMeta('/api/v1/sites/48190c8c-42c4-46af-8d1a-0cd5db894797/rules')
    this.onChange()
    RuleStore.addChangeListener(this.onChange.bind(this))
  }

  updateBaseUrl(value) {
    let oldUrl = ServerManager.baseUrl
    ServerManager.baseUrl = value;
    this.baseUrl = value;
    this.testBaseUrl(value).catch((e => {
      alert("Error using provided Base Url. Check the development console.");
      log("Error using provided Base Url: ", e)
      this.baseUrl = oldUrl;
      ServerManager.baseUrl = oldUrl
      throw e
    }))

  }

  onChange(event = null) {
    log("RuleEngine change event: ", event)
    this.rulesRef.once('value', (rulesSnap) => {
      this.rules = []
      if (rulesSnap && rulesSnap.forEach) {
        rulesSnap.forEach((ruleSnap) => {
          this.rules.push(ruleSnap)
        })
      }
      else {
        throw rulesSnap
      }
    })
  }

  addRule() {
    log("Adding Rule")
    let testRule = new Rule();
    testRule.name = "CoreWeb created this rule. " + new Date().toISOString()
    testRule.enabled = true
    testRule.priority = 10
    testRule.fireOn = "EVERY_PAGE"
    testRule.shortCircuit = false
    testRule.conditionGroups = {}
    testRule.actions = {}
    this.rulesRef.push(testRule).then((ruleRef) => this.onChange())
  }

  testBaseUrl(baseUrl) {
    return new Promise((resolve, reject) => {
      RuleStore.init();
    })
  }
}

var conditionletsAry = []
var conditionletsMap = new Map()

var conditionletsPromise;
var actionletsAry = []
let initConditionlets = function () {
  let conditionletsRef:EntityMeta = new EntityMeta('/api/v1/system/conditionlets')
  conditionletsPromise = new Promise((resolve, reject) => {
    conditionletsRef.once('value').then((snap) => {
      let conditionlets = snap['val']()
      let results = (Object.keys(conditionlets).map((key) => {
        conditionletsMap.set(key, conditionlets[key])
        return conditionlets[key]
      }))

      Array.prototype.push.apply(conditionletsAry,results);
      resolve(snap);
    })
  });
}

export function main() {
  log("Bootstrapping rules engine")
  initConditionlets()
  return bootstrap(RuleEngine);
}
