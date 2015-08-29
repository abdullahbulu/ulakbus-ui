/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

app.directive('headerNotification',function(){
    return {
        templateUrl:'shared/templates/directives/header-notification.html',
        restrict: 'E',
        replace: true,
    }
});

app.directive('sidebar',['$location',function() {
    return {
        templateUrl:'shared/templates/directives/sidebar.html',
        restrict: 'E',
        replace: true,
        scope: {
        },
        controller:function($scope){
            $scope.selectedMenu = 'dashboard';
            $scope.collapseVar = 0;
            $scope.multiCollapseVar = 0;

            $scope.check = function(x){

                if(x==$scope.collapseVar)
                    $scope.collapseVar = 0;
                else
                    $scope.collapseVar = x;
            };

            $scope.multiCheck = function(y){

                if(y==$scope.multiCollapseVar)
                    $scope.multiCollapseVar = 0;
                else
                    $scope.multiCollapseVar = y;
            };
        }
    }
}]);

app.directive('stats',function() {
    return {
        templateUrl:'shared/templates/directives/stats.html',
        restrict:'E',
        replace:true,
        scope: {
            'model': '=',
            'comments': '@',
            'number': '@',
            'name': '@',
            'colour': '@',
            'details':'@',
            'type':'@',
            'goto':'@'
        }

    }
});

app.directive('notifications',function(){
    return {
        templateUrl:'shared/templates/directives/notifications.html',
        restrict: 'E',
        replace: true,
    }
});

app.directive('sidebarSearch',function() {
    return {
        templateUrl:'shared/templates/directives/sidebar-search.html',
        restrict: 'E',
        replace: true,
        scope: {
        },
        controller:function($scope){
            $scope.selectedMenu = 'home';
        }
    }
});

app.directive('timeline',function() {
    return {
        templateUrl:'shared/templates/directives/timeline.html',
        restrict: 'E',
        replace: true,
    }
});

app.directive('chat',function(){
    return {
        templateUrl:'shared/templates/directives/chat.html',
        restrict: 'E',
        replace: true,
    }
});