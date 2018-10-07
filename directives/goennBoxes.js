app.directive('goennBox', function() {
    return {
        restrict: 'E',
        scope: {
            info: '=',
        },
        templateUrl: 'directives/goennBoxes.html',
    }
});
