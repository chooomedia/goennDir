app.directive('goennProducts', function() {

    return {
         restrict: 'E',
         scope: {
             content: '=',
         },
         templateUrl: 'directives/goennPages.html'
     };
 });