app.directive('appPage', function() {

    return {
         restrict: 'E',
         scope: {
             content: '=',
         },
         templateUrl: 'directives/goennPages.html'
     };
 });