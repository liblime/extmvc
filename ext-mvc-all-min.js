ExtMVC=Ext.extend(Ext.util.Observable,{version:"0.5b1",constructor:function(){ExtMVC.superclass.constructor.apply(this,arguments);this.addEvents("environment-changed");this.getEnvSettings=this.getCurrentEnvironmentSettings},currentEnvironment:"production",environments:{production:{}},setCurrentEnvironment:function(A){if(this.getEnvironmentSettings(A)){this.currentEnvironment=A;this.fireEvent("environment-changed",A,this.getEnvironmentSettings(A))}},getCurrentEnvironment:function(){return ExtMVC.currentEnvironment},getCurrentEnvironmentSettings:function(){return this.getEnvironmentSettings(this.getCurrentEnvironment())},addEnvironmentSettings:function(B,A){ExtMVC.environments[B]=ExtMVC.environments[B]||{};Ext.apply(ExtMVC.environments[B],A)},getEnvironmentSettings:function(A){A=A||ExtMVC.environment;return ExtMVC.environments[A]}});ExtMVC=new ExtMVC();Ext.ns("ExtMVC.Model","ExtMVC.plugin","ExtMVC.view","ExtMVC.view.scaffold");ExtMVC.Inflector={Inflections:{plural:[[(/(quiz)$/i),"$1zes"],[(/^(ox)$/i),"$1en"],[(/([m|l])ouse$/i),"$1ice"],[(/(matr|vert|ind)ix|ex$/i),"$1ices"],[(/(x|ch|ss|sh)$/i),"$1es"],[(/([^aeiouy]|qu)y$/i),"$1ies"],[(/(hive)$/i),"$1s"],[(/(?:([^f])fe|([lr])f)$/i),"$1$2ves"],[(/sis$/i),"ses"],[(/([ti])um$/i),"$1a"],[(/(buffal|tomat)o$/i),"$1oes"],[(/(bu)s$/i),"$1ses"],[(/(alias|status)$/i),"$1es"],[(/(octop|vir)us$/i),"$1i"],[(/(ax|test)is$/i),"$1es"],[(/s$/i),"s"],[(/$/),"s"]],singular:[[(/(quiz)zes$/i),"$1"],[(/(matr)ices$/i),"$1ix"],[(/(vert|ind)ices$/i),"$1ex"],[(/^(ox)en/i),"$1"],[(/(alias|status)es$/i),"$1"],[(/(octop|vir)i$/i),"$1us"],[(/(cris|ax|test)es$/i),"$1is"],[(/(shoe)s$/i),"$1"],[(/(o)es$/i),"$1"],[(/(bus)es$/i),"$1"],[(/([m|l])ice$/i),"$1ouse"],[(/(x|ch|ss|sh)es$/i),"$1"],[(/(m)ovies$/i),"$1ovie"],[(/(s)eries$/i),"$1eries"],[(/([^aeiouy]|qu)ies$/i),"$1y"],[(/([lr])ves$/i),"$1f"],[(/(tive)s$/i),"$1"],[(/(hive)s$/i),"$1"],[(/([^f])ves$/i),"$1fe"],[(/(^analy)ses$/i),"$1sis"],[(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i),"$1$2sis"],[(/([ti])a$/i),"$1um"],[(/(n)ews$/i),"$1ews"],[(/s$/i),""]],irregular:[["move","moves"],["sex","sexes"],["child","children"],["man","men"],["person","people"]],uncountable:["sheep","fish","series","species","money","rice","information","equipment"]},ordinalize:function(A){if(11<=parseInt(A,10)%100&&parseInt(A,10)%100<=13){return A+"th"}else{switch(parseInt(A,10)%10){case 1:return A+"st";case 2:return A+"nd";case 3:return A+"rd";default:return A+"th"}}},pluralize:function(C){var E=ExtMVC.Inflector.uncountableOrIrregular(C);if(E){return E}for(var A=0;A<ExtMVC.Inflector.Inflections.plural.length;A++){var B=ExtMVC.Inflector.Inflections.plural[A][0];var D=ExtMVC.Inflector.Inflections.plural[A][1];if(B.test(C)){return C.replace(B,D)}}return C},singularize:function(C){var E=ExtMVC.Inflector.uncountableOrIrregular(C);if(E){return E}for(var A=0;A<ExtMVC.Inflector.Inflections.singular.length;A++){var B=ExtMVC.Inflector.Inflections.singular[A][0];var D=ExtMVC.Inflector.Inflections.singular[A][1];if(B.test(C)){return C.replace(B,D)}}return C},uncountableOrIrregular:function(E){for(var C=0;C<ExtMVC.Inflector.Inflections.uncountable.length;C++){var B=ExtMVC.Inflector.Inflections.uncountable[C];if(E.toLowerCase==B){return B}}for(var C=0;C<ExtMVC.Inflector.Inflections.irregular.length;C++){var D=ExtMVC.Inflector.Inflections.irregular[C][0];var A=ExtMVC.Inflector.Inflections.irregular[C][1];if((E.toLowerCase==D)||(E==A)){return A}}return false}};Array.prototype.toSentence=function(A){A=A||"and";var C="";if(this.length<=1){C=this[0]}else{var B=this.slice(0,this.length-1);C=String.format("{0} {1} {2}",B.join(", "),A,this[this.length-1])}return C};String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.substr(1).toLowerCase()};String.prototype.titleize=function(){return this.replace(/\w\S*/g,function(A){return A.charAt(0).toUpperCase()+A.substr(1).toLowerCase()})};String.prototype.camelize=function(){return this.replace(/_/g," ").titleize().replace(/ /g,"")};String.prototype.underscore=function(){return this.replace(/([A-Z])/g,"_$1").toLowerCase().replace(/ /g,"_").replace(/^_/,"")};String.prototype.singularize=function(){return ExtMVC.Inflector.singularize(this)};String.prototype.pluralize=function(){return ExtMVC.Inflector.pluralize(this)};String.prototype.escapeHTML=function(){return this.replace(/&/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;")};String.prototype.toCurrency=function(H){if(typeof(H)=="undefined"){var H="$"}var B=this.split(".")[0],F=this.split(".")[1];var A=Math.floor(B.length/3);var E=B.length%3,G=E;var C=E==0?[]:[B.substr(0,E)];for(var D=0;D<A;D++){C.push(B.substr(E+(D*3),3))}B=H+C.join(",");return F?String.format("{0}.{1}",B,F):B};ExtMVC.Router=function(){};ExtMVC.Router.prototype={mappings:[],namedRoutes:{},connect:function(B,C){var A=new ExtMVC.Route(B,C);this.mappings.push(A);return A},name:function(A,B,C){this.namedRoutes[A]=this.connect(B,C)},root:function(A){var A=A||{};this.connect("",Ext.applyIf(A,{action:"index"}))},resources:function(A,I){if(arguments[1]&&typeof(arguments[1])=="string"){var H=arguments[arguments.length-1];var B=(typeof(H)=="object")?H:{};for(var C=0;C<arguments.length;C++){if(!(H===arguments[C]&&typeof(H)=="object")){this.resources(arguments[C],B)}}return}var G=String.format("{0}_path",A.pluralize());var E=String.format("new_{0}_path",A.singularize());var F=String.format("{0}_path",A.singularize());var D=String.format("edit_{0}_path",A.singularize());this.name(G,A,Ext.apply({},{controller:A,action:"index"}));this.name(E,A+"/new",Ext.apply({},{controller:A,action:"new"}));this.name(F,A+"/:id",Ext.apply({},{controller:A,action:"show",conditions:{":id":"[0-9]+"}}));this.name(D,A+"/:id/edit",Ext.apply({},{controller:A,action:"edit",conditions:{":id":"[0-9]+"}}))},redirectTo:function(){var A=this.urlFor.apply(this,arguments);if(A){Ext.History.add(A);return true}else{return false}},linkTo:function(B,A){var A=A||{};var C=this.urlFor(B);if(C){return Ext.applyIf(A,{url:C,cls:[B.controller,B.action,B.id].join("-").replace("--","-").replace(/-$/,""),text:this.constructDefaultLinkToName(B,A),handler:function(){Ext.History.add(C)}})}else{throw new Error("No match for that url specification")}},constructDefaultLinkToName:function(B,A){if(!B||!B.controller||!B.action){return""}var A=A||{};Ext.applyIf(A,{singularName:B.controller.singularize()});var C=B.action.titleize();if(C=="Index"){return"Show "+B.controller.titleize()}else{return C+" "+A.singularName.titleize()}},recognise:function(C){for(var D=0;D<this.mappings.length;D++){var A=this.mappings[D];var B=A.matchesFor(C);if(B){return B}}return false},urlFor:function(D,B){var A;if(typeof(D)=="string"){if(A=this.namedRoutes[D]){var B=B||{};if(typeof(B)=="number"){B={id:B}}if(B.data&&B.data.id){B={id:B.data.id}}return A.urlForNamed(B)}}else{for(var E=0;E<this.mappings.length;E++){A=this.mappings[E];var C=A.urlFor(D);if(C){return C}}}return false},withOptions:function(B,A){var B=B||{};var D=this;var C={};C.prototype=this;Ext.apply(C,{connect:function(E,F){var F=F||{};Ext.applyIf(F,B);D.connect.call(D,E,F)},name:function(E,F,G){var G=G||{};Ext.applyIf(G,B);D.name.call(D,E,F,G)}});A.call(this,C)}};ExtMVC.Router.defineRoutes=function(A){A.connect(":controller/:action");A.connect(":controller/:action/:id")};ExtMVC.Route=function(C,A){this.mappingString=C;this.options=A||{};this.paramMatchingRegex=new RegExp(/:([0-9A-Za-z\_]*)/g);this.paramsInMatchString=this.mappingString.match(this.paramMatchingRegex)||[];this.paramsInStringWithOptions=[];this.conditions=this.options.conditions||{};if(this.options.conditions){delete this.options.conditions}for(var B=0;B<this.paramsInMatchString.length;B++){this.paramsInStringWithOptions.push(this.paramsInMatchString[B])}for(var D in A){this.paramsInStringWithOptions.push(":"+D)}this.matcherRegex=this.convertToUsableRegex(C)};ExtMVC.Route.prototype={recognises:function(A){return this.matcherRegex.test(A)},matchesFor:function(B){if(!this.recognises(B)){return false}var E={};var D=this.paramsInMatchString;var A=B.match(this.matcherRegex);A.shift();for(var C=D.length-1;C>=0;C--){E[D[C].replace(":","")]=A[C]}for(option in this.options){E[option]=this.options[option]}return E},urlForNamed:function(A){var A=A||{};return this.urlFor(Ext.applyIf(A,this.options))},urlFor:function(C){var B=this.mappingString;for(var F in C){if(C[F]&&this.options[F]&&C[F]!=this.options[F]){return false}}var E=[];for(var F in C){E.push(":"+F)}E=E.sort();var A=this.paramsInStringWithOptions.sort();if(A.length!=E.length){return false}for(var D=0;D<E.length;D++){if(E[D]!=A[D]){return false}}for(var F in C){B=B.replace(":"+F,C[F])}return B},convertToUsableRegex:function(A){var E=this.paramsInMatchString;for(var B=E.length-1;B>=0;B--){var C=this.conditions[E[B]];var D=String.format("({0})",C||"[a-zA-Z0-9_,]+");A=A.replace(new RegExp(E[B]),D)}return new RegExp("^"+A+"$")}};ExtMVC.Controller=function(B){var B=B||{};Ext.applyIf(B,{autoRegisterViews:true});ExtMVC.Controller.superclass.constructor.call(this,B);try{this.os=ExtMVC.OS.getOS()}catch(C){}this.views={};this.runningViews={};this.actions={};this.addEvents("init","beforedefaultaction");if(B.autoRegisterViews&&B.viewsPackage){for(var A in B.viewsPackage){this.registerView(A.toLowerCase(),B.viewsPackage[A])}}this.fireEvent("init",this)};Ext.extend(ExtMVC.Controller,Ext.util.Observable,{registerView:function(B,A){this.views[B]=A},registerViews:function(B){for(var A in B){this.registerView(A,B[A])}},getViewClass:function(A){return this.views[A]},renderMethod:"renderNow",addTo:null,model:null,scaffoldViewName:function(A){return ExtMVC.view.scaffold[A.titleize()]},renderView:function(F,D,C){var C=C||{};var D=D||{};Ext.applyIf(C,{renderTo:Ext.getBody(),renderNow:true,renderOnce:true});var B;if(typeof((this.getViewClass(F)))=="function"){B=new (this.getViewClass(F))(D)}else{if(this.model){try{B=new (this.scaffoldViewName(F))(this.model)}catch(E){}}}if(!B||typeof(B)=="undefined"){return}var A=this.getRunningView(B.id);if(A){if(C.renderOnce){B.destroy();return A}else{throw new Error("The view ID "+B.id+" has already been taken.  Each view instance must have a unique ID")}}else{return this.launchView(B)}},launchView:function(B,A){var A=A||{};Ext.applyIf(A,{renderNow:true,renderTo:Ext.getBody()});B.on("close",function(){this.destroyView(B.id)},this);B.on("destroy",function(C){delete this.runningViews[C.id]},this);this.runningViews[B.id]=B;if(this.renderMethod=="renderNow"&&A.renderNow){B.render(A.renderTo,A.renderPosition);return B}else{if(this.addTo&&A.renderNow){this.addTo.add(B).show();this.addTo.doLayout();return B}return B}},getRunningView:function(A){return this.runningViews[A]},getRunningViews:function(B){if(!B.test){return[]}var C=[];for(var A in this.runningViews){if(B.test(A)){C.push(this.runningViews[A])}}return C},destroyView:function(A){var B=this.getRunningView(A);if(B){B.destroy();delete this.runningViews[A]}},destroyViews:function(B){if(!B.test){return[]}for(var A in this.runningViews){if(B.test(A)){this.destroyView(A)}}},registerAction:function(B,A,C){var C=C||{};Ext.applyIf(C,{before_filter:true,after_filter:true,overwrite:true});if(C.before_filter){this.addEvents("before_"+B)}if(C.after_filter){this.addEvents("after_"+B)}if(!this.getAction(B)||C.overwrite==true){this.actions[B]=A}},getAction:function(A){return this.actions[A]},fireAction:function(B,E,D){var E=E||this;var D=D||[];var A=this.getAction(B);if(A){if(this.fireEvent("before_"+B)){A.apply(E,D);this.fireEvent("after_"+B)}}else{if(this.fireEvent("beforedefaultaction",B,E,D)){var C;if(C=this.renderView(B,D[0])){C.show()}}}},handleEvent:function(D,B,A,C){var C=C||this;D.on(B,function(){this.fireAction(A,C,arguments)},this)}});Ext.reg("controller",ExtMVC.Controller);Ext.ns("ExtMVC.plugin.CrudController");(function(){var A=ExtMVC.plugin.CrudController;A.registerActions=function(B,C){Ext.apply(this,C,A.defaultFunctions);this.addEvents("findsuccess","findfailure");this.model=B;if(!this.model){throw new Error("You must provide a model to this.actsAsCrudController().  Pass it as the first argument to actsAsCrudController or set 'this.model = YourModel' before calling actsAsCrudController.")}this.registerAction("new",function(){this.form=this.renderView("new")},{overwrite:false});this.registerAction("edit",function(){this.form=this.renderView("edit");this.form.el.mask("Loading...","x-mask-loading");this.loadForm(this.form)},{overwrite:false});this.registerAction("create",function(D){D.el.mask("Saving...","x-mask-loading");this.onCreate(D)},{overwrite:false});this.registerAction("update",function(D){D.el.mask("Saving...","x-mask-loading");this.onUpdate(D)},{overwrite:false});this.registerAction("destroy",function(F,D){var F=F||this.os.params.id;if(F){var E=new this.model({id:F});E.destroy({scope:this,success:this.onDestroySuccess.createDelegate(this,[D]),failure:this.onDestroyFailure})}},{overwrite:false})};A.defaultFunctions={modelObj:null,loadUrl:null,saveUrl:null,loadForm:function(B){this.model.findById(this.os.params.id,{scope:this,url:this.loadUrl,success:this.onFindSuccess,failure:this.onFindFailure,callback:B.el.unmask.createDelegate(B.el)})},onFindSuccess:function(B){this.editModelObj=B;this.form.getForm().loadRecord(B);this.fireEvent("findsuccess",B)},onFindFailure:function(){this.fireEvent("findfailure");Ext.Msg.show({title:"Load Failed",msg:"The item could not be loaded",buttons:{yes:"Try again",no:"Back"},scope:this,fn:function(B){B=="yes"?this.loadForm():Ext.History.back()}})},onCreate:function(B){this.newModelObj=new this.model({});this.onSave(B,this.newModelObj,{success:this.onCreateSuccess,failure:this.onCreateFailure})},onUpdate:function(B){this.onSave(B,this.editModelObj,{success:this.onUpdateSuccess,failure:this.onUpdateFailure})},onSave:function(D,C,B){D.el.mask("Saving...","x-mask-loading");C.update(D.getValues(),Ext.apply({},B,{scope:this,url:this.saveUrl,callback:function(){D.el.unmask()}}))},onSaveSuccess:function(B){this.os.router.redirectTo(Ext.apply({},{action:"index"},this.os.params))},onCreateSuccess:function(){this.onSaveSuccess()},onUpdateSuccess:function(){this.onSaveSuccess()},onCreateFailure:function(C,B){this.addErrorMessages(C,B)},onUpdateFailure:function(C,B){this.addErrorMessages(C,B)},addErrorMessages:function(C,B){this.form.getForm().clearInvalid();this.form.getForm().markInvalid(C.errors.forForm())},onDestroySuccess:function(B){if(B){B.reload()}},onDestroyFailure:function(B){Ext.Msg.alert("Delete Failed","Sorry, something went wrong when trying to delete that item.  Please try again")}};ExtMVC.Controller.prototype.actsAsCrudController=A.registerActions})();ExtMVC.OS=function(A){ExtMVC.OS.superclass.constructor.call(this,A);this.addEvents("beforelaunch","launch");this.initialiseNamespaces();var B=this;ExtMVC.OS.getOS=function(){return B}};Ext.extend(ExtMVC.OS,ExtMVC.Controller,{registerController:function(A,B){this.controllers[A]=B},getController:function(A){var B=this.controllers[A];if(B){if(typeof B==="function"){this.controllers[A]=new this.controllers[A]()}return this.controllers[A]}else{return null}},controllers:{},launch:function(){if(this.fireEvent("beforelaunch",this)){this.initializeRouter();this.initializeViewport();if(this.usesHistory){this.initialiseHistory()}this.onLaunch();this.fireEvent("launch",this)}},usesHistory:false,dispatchHistoryOnLoad:true,viewportBuilder:"leftmenu",viewportBuilderConfig:{},initializeViewport:function(){var A=ExtMVC.ViewportBuilderManager.find(this.viewportBuilder);if(A){A.build(this)}},params:{},dispatch:function(B,C,A){var B=B||{};Ext.applyIf(B,{action:"index"});this.params=B;var D;if(D=this.getController(B.controller)){D.fireAction(B.action,C||D,A||[])}},onLaunch:Ext.emptyFn,initializeRouter:function(){if(this.router){return}this.router=new ExtMVC.Router();ExtMVC.Router.defineRoutes(this.router)},name:undefined,initialiseNamespaces:function(A){var A=A||this.name;if(A){Ext.ns(A,A+".controllers",A+".models",A+".views")}},initialiseHistory:function(){this.historyForm=Ext.getBody().createChild({tag:"form",action:"#",cls:"x-hidden",id:"history-form",children:[{tag:"div",children:[{tag:"input",id:"x-history-field",type:"hidden"},{tag:"iframe",id:"x-history-frame"}]}]});if(this.dispatchHistoryOnLoad){Ext.History.init(function(B){var A=document.location.hash.replace("#","");var C=this.router.recognise(A);if(C){this.dispatch(C)}},this)}else{Ext.History.init()}Ext.History.on("change",this.handleHistoryChange,this)},handleHistoryChange:function(B){var A=this.router.recognise(B);if(A){this.dispatch(A,null,[{url:B}])}},setsTitle:function(A,B){var B=B||A.title||A.initialConfig?A.initialConfig.title:null;if(B){A.on("show",function(){document.title=B});A.on("activate",function(){document.title=B})}}});Ext.reg("os",ExtMVC.OS);ExtMVC.Model=function(){return{pendingCreation:{},getModelsPendingDefinitionOf:function(A){return this.pendingCreation[A]||[]},setModelPendingDefinitionOf:function(B,D,C){var A=this.pendingCreation[B]||[];A.push({name:D,config:C});this.pendingCreation[B]=A},strictMode:false,modelNamespace:window,define:function(A,B){var D=true,B=B||{};if(typeof B.extend!="undefined"){var C=this.modelNamespace[B.extend];if(typeof C=="undefined"){D=false;this.setModelPendingDefinitionOf(B.extend,A,B)}}if(D){this.create.apply(this,arguments)}},create:function(B,D){D=D||{};if(this.isAlreadyDefined(B)){if(this.strictMode){throw new Error(B+" is already defined")}return false}var E=this.modelNamespace[D.extend];var A=this.buildFields(D.fields,E);delete D.fields;var C=this.modelNamespace[B]=Ext.data.Record.create(A);var F=D.classMethods||{};delete D.classMethods;Ext.apply(C.prototype,D);if(typeof E!="undefined"){Ext.applyIf(F,E);Ext.applyIf(C.prototype,E.prototype)}C.prototype.modelName=B;this.setupNames(C);for(methodName in F){if(methodName!="prototype"){C[methodName]=F[methodName]}}this.afterCreate(B)},afterCreate:function(A){var B=this.getModelsPendingDefinitionOf(A);if(B){Ext.each(B,function(C){this.create(C.name,C.config)},this)}},isAlreadyDefined:function(A){if(typeof this.modelNamespace[A]!="undefined"){return true}var C=false;for(superclass in this.pendingCreation){var B=this.pendingCreation[superclass];Ext.each(B,function(D){if(D.name==A){C=true}},this)}return C},buildFields:function(B,C){B=B||[];var A=new Ext.util.MixedCollection(false,function(D){return D.name});A.addAll(B);if(typeof C!="undefined"){C.prototype.fields.each(function(D){if(typeof A.get(D.name)=="undefined"){A.add(D)}})}return A.items},setupNames:function(A){var C=A.prototype,B=ExtMVC.Inflector;Ext.applyIf(A.prototype,{tableName:B.pluralize(C.modelName.underscore())})}}}();ExtMVC.Model.Base=function(){};ExtMVC.Model.Base.prototype={primaryKey:"id",newRecord:function(){return typeof(this.data[this.primaryKey])=="undefined"},MVCModelId:function(){return String.format("{0}-{1}",this.tableName,this.get(this.primaryKey))},initialize:Ext.emptyFn};Ext.apply(Ext.data.Record.prototype,new ExtMVC.Model.Base());Ext.ns("ExtMVC.Model.validation");(function(){var A=ExtMVC.Model.validation;A.AbstractValidation=function(C,D,B){this.modelObject=C;this.field=D;Ext.apply(this,B)};A.AbstractValidation.prototype={getValue:function(){return this.modelObject.get(this.field)},isValid:function(){return true}};A.ValidatesPresenceOf=Ext.extend(A.AbstractValidation,{message:"must be present",isValid:function(){var C=this.modelObject.get(this.field),B=false;switch(typeof C){case"object":if(C!=null){B=true}break;case"string":if(C.length!=0){B=true}break}return B}});A.ValidatesLengthOf=Ext.extend(A.AbstractValidation,{tooShortMessage:"is too short",tooLongMessage:"is too long",message:"",isValid:function(){var B=this.getValue();if(this.minimum&&B.length<this.minimum){this.message=this.tooShortMessage;return false}if(this.maximum&B.length>this.maximum){this.message=this.tooLongMessage;return false}return true}});A.ValidatesNumericalityOf=Ext.extend(A.AbstractValidation,{message:"must be a number",isValid:function(){return"number"==typeof this.modelObject.get(this.field)}});A.ValidatesInclusionOf=Ext.extend(A.AbstractValidation,{constructor:function(B,D,C){C=C||{};Ext.applyIf(C,{allowed:[]});A.ValidatesInclusionOf.superclass.constructor.call(this,B,D,C);Ext.applyIf(this,{message:"must be one of "+this.allowed.toSentence("or")})},isValid:function(){var C=this.getValue();for(var B=0;B<this.allowed.length;B++){if(this.allowed[B]==C){return true}}return false}});A.ValidatesExclusionOf=Ext.extend(A.AbstractValidation,{constructor:function(B,D,C){C=C||{};Ext.applyIf(C,{disallowed:[]});A.ValidatesExclusionOf.superclass.constructor.call(this,B,D,C);Ext.applyIf(this,{message:"must not be "+this.disallowed.toSentence("or")})},isValid:function(){var D=this.getValue(),C=true;for(var B=0;B<this.disallowed.length;B++){if(this.disallowed[B]==D){C=false}}return C}});A.ValidatesFormatOf=Ext.extend(A.AbstractValidation,{message:"is invalid",isValid:function(){return this.regex.test(this.getValue())}})})();ExtMVC.Model.validation.Errors=function(A){this.all={}};ExtMVC.Model.validation.Errors.prototype={forForm:function(){var A={};for(key in this.all){A[key]=this.forField(key,true)}return A},multipleErrorConnector:"and",clear:function(){this.all={}},add:function(B,A){this.all[B]=this.all[B]||[];this.all[B].push(A)},forField:function(C,B){B=B||false;var A=this.all[C]||[];return B?A.toSentence(this.multipleErrorConnector):A},isValid:function(A){for(key in this.all){return false}return true},readServerErrors:function(A,C){var A=A||{};if(C!==true){this.clearErrors()}if(typeof(A)=="string"){A=Ext.decode(A)}var D=A.errors;if(D){for(var B=0;B<D.length;B++){this.all.push(D[B])}}}};ExtMVC.ViewportBuilderManager={viewportBuilders:{},register:function(A,B){this.viewportBuilders[A]=B},find:function(B,A){var C=this.viewportBuilders[B];if(C){return new C(A)}}};ExtMVC.ViewportBuilder=function(A){this.initialConfig=A};ExtMVC.ViewportBuilder.prototype={build:Ext.emptyFn};ExtMVC.view.scaffold.ScaffoldFormPanel=Ext.extend(Ext.form.FormPanel,{constructor:function(B,A){var A=A||{};this.model=B;this.os=ExtMVC.OS.getOS();this.controllerName=this.model.modelName.pluralize();this.controller=this.os.getController(this.controllerName);ExtMVC.view.scaffold.ScaffoldFormPanel.superclass.constructor.call(this,A)},initComponent:function(){Ext.applyIf(this,{autoScroll:true,items:this.buildItems(this.model),keys:[{key:Ext.EventObject.ESC,scope:this,handler:this.onCancel},{key:"s",ctrl:true,scope:this,stopEvent:true,handler:this.saveHandler}],buttons:[{text:"Save",scope:this,iconCls:"save",handler:this.saveHandler},{text:"Cancel",scope:this,iconCls:"cancel",handler:this.onCancel}]});this.os.setsTitle(this);ExtMVC.view.scaffold.ScaffoldFormPanel.superclass.initComponent.apply(this,arguments)},formItemConfig:{anchor:"-40",xtype:"textfield"},ignoreFields:["id","created_at","updated_at"],buildItems:function(model){var formFields;if(formFields=eval(String.format("{0}.views.{1}.FormFields",model.namespace.split(".")[0],model.modelName.pluralize().toLowerCase()))){return formFields}var items=[];for(var i=0;i<model.fields.length;i++){var f=model.fields[i];if(this.ignoreFields.indexOf(f.name)==-1){items.push(Ext.applyIf({name:f.name,fieldLabel:(f.name.replace(/_/g," ")).capitalize()},this.formItemConfig))}}return items},onCreate:function(){this.controller.fireAction("create",null,[this.getForm()])},onUpdate:function(){this.controller.fireAction("update",null,[this.getForm()])},onCancel:Ext.History.back});Ext.reg("scaffold_form_panel",ExtMVC.view.scaffold.ScaffoldFormPanel);ExtMVC.view.scaffold.Index=function(B,A){var A=A||{};this.model=B;this.os=ExtMVC.OS.getOS();this.controllerName=B.modelName.pluralize();this.controller=this.os.getController(this.controllerName);A.columns=A.columns||this.buildColumns(B);A.store=A.store||B.findAll();var C=this.hasTopToolbar?this.buildTopToolbar():null;var D=this.hasBottomToolbar?this.buildBottomToolbar(A.store):null;Ext.applyIf(A,{title:"Showing "+B.prototype.modelName.pluralize().capitalize(),viewConfig:{forceFit:true},id:B.prototype.modelName+"s_index",loadMask:true,tbar:C,bbar:D,listeners:{dblclick:{scope:this,fn:function(F){var E=this.getSelectionModel().getSelected();if(E){this.os.router.redirectTo({controller:this.controllerName,action:"edit",id:E.data.id})}}}},keys:[{key:"a",scope:this,handler:this.onAdd},{key:"e",scope:this,handler:this.onEdit},{key:Ext.EventObject.DELETE,scope:this,handler:this.onDelete}]});ExtMVC.view.scaffold.Index.superclass.constructor.call(this,A);ExtMVC.OS.getOS().setsTitle(this)};Ext.extend(ExtMVC.view.scaffold.Index,Ext.grid.GridPanel,{preferredColumns:["id","title","name","first_name","last_name","login","username","email","email_address","content","message","body"],ignoreColumns:["password","password_confirmation"],narrowColumns:["id"],wideColumns:["message","content","description","bio","body"],hasTopToolbar:true,hasBottomToolbar:true,buildColumns:function(C){var E=[];var A=[];for(var D=0;D<C.fields.length;D++){var G=C.fields[D];if(this.preferredColumns.indexOf(G.name)>-1){E.push(this.buildColumn(G.name))}}for(var D=C.fields.length-1;D>=0;D--){var G=C.fields[D];if(this.preferredColumns.indexOf(G.name)==-1&&this.ignoreColumns.indexOf(G.name)==-1){E.push(this.buildColumn(G.name))}if(this.wideColumns.indexOf(G.name)){A.push(G.name)}}var F=E.length+(2*A.length);for(var D=E.length-1;D>=0;D--){var B=E[D];if(this.narrowColumns.indexOf(B.id)>-1){Ext.applyIf(B,{width:30})}else{if(this.wideColumns.indexOf(B.id)>-1){Ext.applyIf(B,{width:200})}else{Ext.applyIf(B,{width:100})}}}return E},buildColumn:function(A){var A=A||{};if(typeof(A)=="string"){A={name:A}}return Ext.applyIf(A,{id:A.name,header:A.name.replace(/_/g," ").titleize(),sortable:true,dataIndex:A.name})},buildTopToolbar:function(){this.addButton=new Ext.Button({text:"New "+this.model.modelName.titleize(),scope:this,iconCls:"add",handler:this.onAdd});this.editButton=new Ext.Button({text:"Edit selected",scope:this,iconCls:"edit",disabled:true,handler:this.onEdit});this.deleteButton=new Ext.Button({text:"Delete selected",disabled:true,scope:this,iconCls:"delete",handler:this.onDelete});this.getSelectionModel().on("selectionchange",function(A){if(A.getCount()>0){this.deleteButton.enable();this.editButton.enable()}else{this.deleteButton.disable();this.editButton.disable()}},this);return[this.addButton,"-",this.editButton,"-",this.deleteButton]},buildBottomToolbar:function(A){var B=new this.model({});return new Ext.PagingToolbar({store:A,displayInfo:true,pageSize:25,emptyMsg:String.format("No {0} to display",B.humanPluralName)})},onAdd:function(){this.os.router.redirectTo({controller:this.controllerName,action:"new"})},onEdit:function(){var A=this.getSelectionModel().getSelected();if(A){this.os.router.redirectTo({controller:this.controllerName,action:"edit",id:A.data.id})}},onDelete:function(){Ext.Msg.confirm("Are you sure?",String.format("Are you sure you want to delete this {0}?  This cannot be undone.",this.model.modelName.titleize()),function(A){if(A=="yes"){var B=this.getSelectionModel().getSelected();if(B){this.controller.fireAction("destroy",null,[B.data.id,this.store])}}},this)}});Ext.reg("scaffold_index",ExtMVC.view.scaffold.Index);ExtMVC.view.scaffold.New=Ext.extend(ExtMVC.view.scaffold.ScaffoldFormPanel,{initComponent:function(){Ext.applyIf(this,{title:"New "+this.model.prototype.modelName.capitalize(),saveHandler:this.onCreate});ExtMVC.view.scaffold.New.superclass.initComponent.apply(this,arguments)}});Ext.reg("scaffold_new",ExtMVC.view.scaffold.New);ExtMVC.view.scaffold.Edit=Ext.extend(ExtMVC.view.scaffold.ScaffoldFormPanel,{initComponent:function(){Ext.applyIf(this,{title:"Edit "+this.model.prototype.modelName.capitalize(),saveHandler:this.onUpdate});ExtMVC.view.scaffold.Edit.superclass.initComponent.apply(this,arguments)}});Ext.reg("scaffold_edit",ExtMVC.view.scaffold.Edit);ExtMVC.view.HasManyEditorGridPanel=Ext.extend(Ext.grid.EditorGridPanel,{initComponent:function(){Ext.applyIf(this,{autoScroll:true,store:this.association.findAll(),viewConfig:{forceFit:true}});if(this.hasTopToolbar){this.addTopToolbar()}ExtMVC.view.HasManyEditorGridPanel.superclass.initComponent.apply(this,arguments);this.on("afteredit",function(A){A.record.save({success:function(){A.record.commit()}})},this);this.getSelectionModel().on("selectionchange",function(A,B){if(this.deleteButton){this.deleteButton.enable()}},this)},hasTopToolbar:true,hasNewButton:true,hasDeleteButton:true,addTopToolbar:function(B){var A=[];if(this.hasNewButton){this.newButton=new Ext.Toolbar.Button({iconCls:"add",text:"Add",scope:this,handler:this.onAdd});A.push(this.newButton);A.push("-")}if(this.hasDeleteButton){this.deleteButton=new Ext.Toolbar.Button({text:"Remove selected",disabled:true,iconCls:"delete",scope:this,handler:this.onDelete});A.push(this.deleteButton)}Ext.applyIf(this,{tbar:A})},windowConfig:{},onAdd:function(A){if(!this.addWindow){this.addWindow=new Ext.Window(Ext.applyIf(this.windowConfig,{title:"New",layout:"fit",modal:true,height:300,width:400,items:[this.form],closeAction:"hide",buttons:[{text:"Save",iconCls:"save",scope:this,handler:this.onSaveNew},{text:"Cancel",iconCls:"cancel",scope:this,handler:this.onCancelNew}]}))}this.addWindow.show()},onDelete:function(B){var A=this.getSelectionModel().selection.record;if(A){A.destroy({scope:this,success:function(){this.store.reload()},failure:function(){Ext.Msg.alert("Delete failed","Something went wrong while trying to delete - please try again");this.store.reload()}})}this.deleteButton.disable()},onSaveNew:function(){this.association.create(this.form.getForm().getValues(),{scope:this,success:function(B,A){this.store.reload();this.addWindow.hide()},failure:function(B,A){this.form.getForm().clearInvalid();this.form.getForm().markInvalid(B.errors.forForm())}})},onCancelNew:function(A){this.addWindow.hide()}});Ext.reg("hasmany_editorgrid",ExtMVC.view.HasManyEditorGridPanel);