/*! ulakbus-ui  2015-11-23 */
"use strict";var app=angular.module("ulakbus",["ui.bootstrap","angular-loading-bar","ngRoute","ngSanitize","ngCookies","formService","ulakbus.dashboard","ulakbus.auth","ulakbus.error_pages","ulakbus.crud","ulakbus.debug","ulakbus.devSettings","ulakbus.version","gettext","templates-prod"]).constant("RESTURL",function(){var backendurl=location.href.indexOf("nightly")?"//nightly.api.ulakbus.net/":"//api.ulakbus.net/";if(document.cookie.indexOf("backendurl")>-1){var cookiearray=document.cookie.split(";");angular.forEach(cookiearray,function(item){item.indexOf("backendurl")>-1&&(backendurl=item.split("=")[1])})}if(location.href.indexOf("backendurl")>-1){var urlfromqstr=location.href.split("?")[1].split("=")[1];backendurl=decodeURIComponent(urlfromqstr.replace(/\+/g," ")),document.cookie="backendurl="+backendurl,window.location.href=window.location.href.split("?")[0]}return{url:backendurl}}()).constant("USER_ROLES",{all:"*",admin:"admin",student:"student",staff:"staff",dean:"dean"}).constant("AUTH_EVENTS",{loginSuccess:"auth-login-success",loginFailed:"auth-login-failed",logoutSuccess:"auth-logout-success",sessionTimeout:"auth-session-timeout",notAuthenticated:"auth-not-authenticated",notAuthorized:"auth-not-authorized"});app.config(["$routeProvider",function($routeProvider,$route){$routeProvider.when("/login",{templateUrl:"components/auth/login.html",controller:"LoginCtrl"}).when("/dashboard",{templateUrl:"components/dashboard/dashboard.html",controller:"DashCtrl"}).when("/dev/settings",{templateUrl:"components/devSettings/devSettings.html",controller:"DevSettingsCtrl"}).when("/debug/list",{templateUrl:"components/debug/debug.html",controller:"DebugCtrl"}).when("/:wf/",{templateUrl:"components/crud/templates/crud.html",controller:"CRUDCtrl"}).when("/:wf/do/:cmd",{templateUrl:"components/crud/templates/crud.html",controller:"CRUDListFormCtrl"}).when("/:wf/do/:cmd/:key",{templateUrl:"components/crud/templates/crud.html",controller:"CRUDListFormCtrl"}).when("/:wf/:model",{templateUrl:"components/crud/templates/crud.html",controller:"CRUDCtrl"}).when("/:wf/:model/do/:cmd",{templateUrl:"components/crud/templates/crud.html",controller:"CRUDListFormCtrl"}).when("/:wf/:model/do/:cmd/:key",{templateUrl:"components/crud/templates/crud.html",controller:"CRUDListFormCtrl"}).otherwise({redirectTo:"/dashboard"})}]).run(function($rootScope){$rootScope.loggedInUser=!0,$rootScope.$on("$routeChangeStart",function(event,next,current){})}).config(["$httpProvider",function($httpProvider){$httpProvider.defaults.withCredentials=!0}]).run(function(gettextCatalog){gettextCatalog.setCurrentLanguage("tr"),gettextCatalog.debug=!0}).config(["cfpLoadingBarProvider",function(cfpLoadingBarProvider){cfpLoadingBarProvider.includeBar=!1,cfpLoadingBarProvider.parentSelector="loaderdiv",cfpLoadingBarProvider.spinnerTemplate='<div class="loader">Loading...</div>'}]),app.config(["$httpProvider",function($httpProvider){$httpProvider.interceptors.push(function($q,$rootScope,$location,$timeout){return{request:function(config){return"POST"===config.method&&(config.headers["Content-Type"]="text/plain"),config},response:function(response){return response.data._debug_queries&&response.data._debug_queries.length>0&&($rootScope.debug_queries=$rootScope.debug_queries||[],$rootScope.debug_queries.push({url:response.config.url,queries:response.data._debug_queries})),response.data.is_login===!1&&($rootScope.loggedInUser=response.data.is_login,$location.path("/login")),response.data.is_login===!0&&($rootScope.loggedInUser=!0,"/login"===$location.path()&&$location.path("/dashboard")),response},responseError:function(rejection){var errorModal=function(){var codefield="";rejection.data.error&&(codefield="<p><pre>"+rejection.data.error+"</pre></p>"),$('<div class="modal"><div class="modal-dialog" style="width:1024px;" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="exampleModalLabel">'+rejection.status+rejection.data.title+'</h4></div><div class="modal-body"><div class="alert alert-danger"><strong>'+rejection.data.description+"</strong>"+codefield+'</div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>').modal()};return-1===rejection.status&&(rejection.data={title:"error",description:"connection failed"},errorModal()),400===rejection.status&&$location.reload(),401===rejection.status&&($location.path("/login"),"/login"===$location.path()&&console.log("show errors on login form")),403===rejection.status&&(rejection.data.is_login===!0&&($rootScope.loggedInUser=!0,"/login"===$location.path()&&$location.path("/dashboard")),errorModal()),$rootScope.$broadcast("show_notifications",rejection.data),404===rejection.status&&errorModal(),500===rejection.status&&errorModal(),$q.reject(rejection)}}})}]),app.directive("logout",function($http,$location,RESTURL){return{link:function($scope,$element,$rootScope){$element.on("click",function(){$http.post(RESTURL.url+"logout",{}).then(function(){$rootScope.loggedInUser=!1,$location.path("/login")})})}}}).directive("headerNotification",function($http,$rootScope,$cookies,$interval,RESTURL){return{templateUrl:"shared/templates/directives/header-notification.html",restrict:"E",replace:!0,link:function($scope){$scope.groupNotifications=function(notifications){$scope.notifications={1:[],2:[],3:[],4:[]},angular.forEach(notifications,function(value,key){$scope.notifications[value.type].push(value)})},$scope.getNotifications=function(){$http.get(RESTURL.url+"notify",{ignoreLoadingBar:!0}).success(function(data){$scope.groupNotifications(data.notifications),$rootScope.$broadcast("notifications",$scope.notifications)})},$scope.getNotifications(),$interval(function(){"on"==$cookies.get("notificate")&&$scope.getNotifications()},5e3),$scope.markAsRead=function(items){$http.post(RESTURL.url+"notify",{ignoreLoadingBar:!0,read:[items]}).success(function(data){$scope.groupNotifications(data.notifications),$rootScope.$broadcast("notifications",$scope.notifications)})},$scope.$on("markasread",function(event,data){$scope.markAsRead(data)})}}}).directive("searchDirective",function(Generator,$log){return{templateUrl:"shared/templates/directives/search.html",restrict:"E",replace:!0,link:function($scope){$scope.searchForm=[{key:"searchbox",htmlClass:"pull-left"},{type:"submit",title:"Ara",htmlClass:"pull-left"}],$scope.searchSchema={type:"object",properties:{searchbox:{type:"string",minLength:2,title:"Ara","x-schema-form":{placeholder:"Arama kriteri giriniz..."}}},required:["searchbox"]},$scope.searchModel={searchbox:""},$scope.searchSubmit=function(form){if($scope.$broadcast("schemaFormValidate"),form.$valid){var searchparams={url:$scope.wf,token:$scope.$parent.token,object_id:$scope.$parent.object_id,form_params:{model:$scope.$parent.form_params.model,cmd:$scope.$parent.reload_cmd,flow:$scope.$parent.form_params.flow,param:"query",id:$scope.searchModel.searchbox}};Generator.submit(searchparams)}}}}}).directive("collapseMenu",function($timeout,$window){return{templateUrl:"shared/templates/directives/menuCollapse.html",restrict:"E",replace:!0,scope:{},controller:function($scope,$rootScope){$rootScope.collapsed=!1,$rootScope.sidebarPinned=!1,$scope.collapseToggle=function(){$window.innerWidth>"768"&&($rootScope.collapsed===!1?(jQuery(".sidebar").css("width","62px"),jQuery(".manager-view").css("width","calc(100% - 62px)"),$rootScope.collapsed=!0,$rootScope.sidebarPinned=!1):(jQuery("span.menu-text, span.arrow, .sidebar footer").fadeIn(400),jQuery(".sidebar").css("width","250px"),jQuery(".manager-view").css("width","calc(100% - 250px)"),$rootScope.collapsed=!1,$rootScope.sidebarPinned=!0))},$timeout(function(){$scope.collapseToggle()})}}}).directive("headerSubMenu",function($location){return{templateUrl:"shared/templates/directives/header-sub-menu.html",restrict:"E",replace:!0,link:function($scope){$scope.$on("$routeChangeStart",function(){$scope.style="/dashboard"===$location.path()?"width:calc(100% - 300px);":"width:%100 !important;"})}}}).directive("headerBreadcrumb",function(){return{templateUrl:"shared/templates/directives/header-breadcrumb.html",restrict:"E",replace:!0}}).directive("selectedUser",function(){return{templateUrl:"shared/templates/directives/selected-user.html",restrict:"E",replace:!1,link:function($scope,$rootScope){$scope.selectedUser=$rootScope.selectedUser}}}).directive("sidebar",["$location",function(){return{templateUrl:"shared/templates/directives/sidebar.html",restrict:"E",replace:!0,scope:{},controller:function($scope,$rootScope,$cookies,$route,$http,RESTURL,$location,$window,$timeout){$scope.prepareMenu=function(menuItems){var newMenuItems={};return angular.forEach(menuItems,function(value,key){angular.forEach(value,function(v,k){newMenuItems[k]=v})}),newMenuItems};var sidebarmenu=$("#side-menu");sidebarmenu.metisMenu(),$http.get(RESTURL.url+"menu/").success(function(data){function reGroupMenuItems(items,baseCategory){var newItems={};return angular.forEach(items,function(value,key){newItems[value.kategori]=newItems[value.kategori]||[],value.baseCategory=baseCategory,newItems[value.kategori].push(value)}),newItems}$scope.allMenuItems=angular.copy(data),angular.forEach($scope.allMenuItems,function(value,key){$scope.allMenuItems[key]=reGroupMenuItems(value,key)}),$rootScope.$broadcast("authz",data),$scope.menuItems=$scope.prepareMenu({other:$scope.allMenuItems.other}),$timeout(function(){sidebarmenu.metisMenu()})}),$scope.$on("menuitems",function(event,data){var menu={other:$scope.allMenuItems.other};menu[data]=$scope.allMenuItems[data],$scope.menuItems=$scope.prepareMenu(menu),$timeout(function(){sidebarmenu.metisMenu()})}),$scope.openSidebar=function(){$window.innerWidth>"768"&&$rootScope.sidebarPinned===!1&&(jQuery("span.menu-text, span.arrow, .sidebar footer, #side-menu").fadeIn(400),jQuery(".sidebar").css("width","250px"),jQuery(".manager-view").css("width","calc(100% - 250px)"),$rootScope.collapsed=!1)},$scope.closeSidebar=function(){$window.innerWidth>"768"&&$rootScope.sidebarPinned===!1&&(jQuery(".sidebar").css("width","62px"),jQuery(".manager-view").css("width","calc(100% - 62px)"),$rootScope.collapsed=!0)},$rootScope.$watch(function($rootScope){return $rootScope.section},function(newindex,oldindex){newindex>-1&&($scope.menuItems=[$scope.allMenuItems[newindex]],$scope.collapseVar=1)}),$scope.selectedMenu=$location.path(),$scope.collapseVar=0,$scope.multiCollapseVar=0,$scope.check=function(x){x===$scope.collapseVar?$scope.collapseVar=0:$scope.collapseVar=x},$scope.breadcrumb=function(itemlist,$event){$rootScope.breadcrumblinks=itemlist,$rootScope.showSaveButton=!1},$scope.multiCheck=function(y){y===$scope.multiCollapseVar?$scope.multiCollapseVar=0:$scope.multiCollapseVar=y}}}}]).directive("stats",function(){return{templateUrl:"shared/templates/directives/stats.html",restrict:"E",replace:!0,scope:{model:"=",comments:"@",number:"@",name:"@",colour:"@",details:"@",type:"@","goto":"@"}}}).directive("notifications",function(){return{templateUrl:"shared/templates/directives/notifications.html",restrict:"E",replace:!0}}).directive("msgbox",function(){return{templateUrl:"shared/templates/directives/msgbox.html",restrict:"E",replace:!1}}).directive("sidebarSearch",function(){return{templateUrl:"shared/templates/directives/sidebar-search.html",restrict:"E",replace:!0,scope:{},controller:function($scope){$scope.selectedMenu="home"}}});var auth=angular.module("ulakbus.auth",["ngRoute","schemaForm","ngCookies"]);auth.controller("LoginCtrl",function($scope,$q,$timeout,$routeParams,Generator,LoginService){$scope.url="login",$scope.form_params={},$scope.form_params.clear_wf=1,Generator.get_form($scope).then(function(data){$scope.form=[{key:"username",type:"string",title:"Kullanıcı Adı"},{key:"password",type:"password",title:"Şifre"},{type:"submit",title:"Giriş Yap"}]}),$scope.onSubmit=function(form){$scope.$broadcast("schemaFormValidate"),form.$valid?LoginService.login($scope.url,$scope.model).error(function(data){$scope.message=data.title}):console.log("not valid")}}),auth.factory("LoginService",function($http,$rootScope,$location,$log,Session,RESTURL){var loginService={};return loginService.login=function(url,credentials){return credentials.cmd="do",$http.post(RESTURL.url+url,credentials).success(function(data,status,headers,config){$rootScope.loggedInUser=!0}).error(function(data,status,headers,config){return data})},loginService.logout=function(){return $log.info("logout"),$http.post(RESTURL.url+"logout",{}).success(function(data){$rootScope.loggedInUser=!1,$log.info("loggedout"),$location.path("/login")})},loginService.isAuthenticated=function(){return!!Session.userId},loginService.isAuthorized=function(authorizedRoles){return angular.isArray(authorizedRoles)||(authorizedRoles=[authorizedRoles]),loginService.isAuthenticated()&&-1!==loginService.indexOf(Session.userRole)},loginService.isValidEmail=function(email){var re=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;return re.test(email)},loginService}),auth.service("Session",function(){this.create=function(sessionId,userId,userRole){this.id=sessionId,this.userId=userId,this.userRole=userRole},this.destroy=function(){this.id=null,this.userId=null,this.userRole=null}}),angular.module("ulakbus.dashboard",["ngRoute"]).controller("DashCtrl",function($scope,$rootScope,$timeout,$http,$cookies,RESTURL){$scope.section=function(section_index){$rootScope.section=section_index},$scope.$on("authz",function(event,data){$scope.menuitems=data}),$scope.student_kw="",$scope.staff_kw="",$scope.students=[],$scope.staffs=[],$scope.search=function(where){$timeout(function(){"personel"===where&&$scope.staff_kw.length>2&&$scope.getItems(where,$scope.staff_kw).success(function(data){$scope.staffs=data.results}),"ogrenci"===where&&$scope.student_kw.length>2&&$scope.getItems(where,$scope.student_kw).success(function(data){$scope.students=data.results})})},$scope.getItems=function(where,what){return $http.get(RESTURL.url+"ara/"+where+"/"+what)},$scope.select=function(who,type){$rootScope.selectedUser={name:who[0],tcno:who[1],key:who[2]},$rootScope.$broadcast("menuitems",type)},$scope.$on("notifications",function(event,data){$scope.notifications=data}),$scope.markAsRead=function(items){$rootScope.$broadcast("markasread",items)}}).directive("sidebarNotifications",function(){return{templateUrl:"shared/templates/directives/sidebar-notification.html",restrict:"E",replace:!0,link:function($scope){}}}),angular.module("ulakbus.crud",["ui.bootstrap","schemaForm","formService"]).service("CrudUtility",function($log){return{generateParam:function(scope,routeParams,cmd){return scope.url=routeParams.wf,angular.forEach(routeParams,function(value,key){key.indexOf("_id")>-1&&"param_id"!==key&&(scope.param=key,scope.param_id=value)}),scope.form_params={cmd:cmd,model:routeParams.model,param:scope.param||routeParams.param,id:scope.param_id||routeParams.param_id,wf:routeParams.wf,object_id:routeParams.key},scope.model=scope.form_params.model,scope.wf=scope.form_params.wf,scope.param=scope.form_params.param,scope.param_id=scope.form_params.id,scope},listPageItems:function(scope,pageData){angular.forEach(pageData,function(value,key){scope[key]=value}),angular.forEach(scope.objects,function(value,key){if("-1"!==value){var linkIndexes=[];angular.forEach(value.actions,function(v,k){"link"===v.show_as&&(linkIndexes=v.fields)}),angular.forEach(value.fields,function(v,k){scope.objects[key].fields[k]={type:linkIndexes.indexOf(k)>-1?"link":"str",content:v}})}}),$log.debug(scope.objects)}}}).controller("CRUDCtrl",function($scope,$routeParams,Generator,CrudUtility){CrudUtility.generateParam($scope,$routeParams),Generator.get_wf($scope)}).controller("CRUDListFormCtrl",function($scope,$rootScope,$location,$http,$log,$modal,$timeout,Generator,$routeParams,CrudUtility){if("show"===$routeParams.cmd){CrudUtility.generateParam($scope,$routeParams,$routeParams.cmd);var createListObjects=function(){angular.forEach($scope.object,function(value,key){"object"==typeof value&&($scope.listobjects[key]=value,delete $scope.object[key])})};$scope.listobjects={};var pageData=Generator.getPageData();pageData.pageData===!0?($scope.object=pageData.object,Generator.setPageData({pageData:!1})):Generator.get_single_item($scope).then(function(res){$scope.object=res.data.object,$scope.model=$routeParams.model}),createListObjects()}if("form"===$routeParams.cmd||"list"===$routeParams.cmd){var setpageobjects=function(data){CrudUtility.listPageItems($scope,data),Generator.generate($scope,data),Generator.setPageData({pageData:!1})},pageData=Generator.getPageData();pageData.pageData===!0&&($log.debug("pagedata",pageData.pageData),CrudUtility.generateParam($scope,pageData,$routeParams.cmd),setpageobjects(pageData,pageData)),(void 0===pageData.pageData||pageData.pageData===!1)&&(CrudUtility.generateParam($scope,$routeParams,$routeParams.cmd),Generator.get_wf($scope)),$scope.$on("formLocator",function(event){$scope.formgenerated=event.targetScope.formgenerated}),$scope.onSubmit=function(form){$scope.$broadcast("schemaFormValidate"),form.$valid&&Generator.submit($scope)},$scope.do_action=function(key,action){Generator.doItemAction($scope,key,action)}}}).directive("crudListDirective",function(){return{templateUrl:"components/crud/templates/list.html",restrict:"E",replace:!0}}).directive("crudFormDirective",function(){return{templateUrl:"components/crud/templates/form.html",restrict:"E",replace:!0}}).directive("crudShowDirective",function(){return{templateUrl:"components/crud/templates/show.html",restrict:"E",replace:!0}}).directive("formLocator",function(){return{link:function(scope){scope.$emit("formLocator")}}}),angular.module("ulakbus.debug",["ngRoute"]).controller("DebugCtrl",function($scope,$rootScope,$location){$scope.debug_queries=$rootScope.debug_queries}),angular.module("ulakbus.devSettings",["ngRoute"]).controller("DevSettingsCtrl",function($scope,$cookies,$rootScope,RESTURL){$scope.backendurl=$cookies.get("backendurl"),$scope.notificate=$cookies.get("notificate")||"on",$scope.changeSettings=function(what,set){document.cookie=what+"="+set,$scope[what]=set,$rootScope.$broadcast(what,set)},$scope.switchOnOff=function(pinn){return"on"==pinn?"off":"on"},$scope.setbackendurl=function(){$scope.changeSettings("backendurl",$scope.backendurl),RESTURL.url=$scope.backendurl},$scope.setnotification=function(){$scope.changeSettings("notificate",$scope.switchOnOff($scope.notificate))}}),app.config(["$routeProvider",function($routeProvider){$routeProvider.when("/error/500",{templateUrl:"components/error_pages/500.html",controller:"500Ctrl"}).when("/error/404",{templateUrl:"components/error_pages/404.html",controller:"404Ctrl"})}]),angular.module("ulakbus.error_pages",["ngRoute"]).controller("500Ctrl",function($scope,$rootScope,$location){}).controller("404Ctrl",function($scope,$rootScope,$location){}),angular.module("ulakbus.version",["ulakbus.version.interpolate-filter","ulakbus.version.version-directive"]).value("version","0.4.1"),angular.module("ulakbus.version.interpolate-filter",[]).filter("interpolate",["version",function(version){return function(text){return String(text).replace(/\%VERSION\%/gm,version)}}]),angular.module("ulakbus.version.version-directive",[]).directive("appVersion",["version",function(version){return function(scope,elm,attrs){elm.text(version)}}]);