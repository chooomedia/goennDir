app.directive('goennPages', function() {

    return {
         restrict: 'E',
         scope: {
             content: '=',
         },
         templateUrl: 'directives/goennPages.html'
     };
 });