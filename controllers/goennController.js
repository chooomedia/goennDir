app.controller('goennController', [
    '$scope',
    '$filter',
    '$http',
    '$window',
    '$anchorScroll',
    '$location',
    'pawService', function (
        $scope,
        $filter,
        $http,
        $window,
        $anchorScroll,
        $location,
        pawService) {

        $scope.searchField = "";


        wishAuthService =  function() {
            $http.post('https://merchant.wish.com/api/v2/auth_test?access_token=d4c7fbfd7ee448dd82a744a09029bacd')
                .then(function (data) {
                    console.log(data);
                });
        }

        $scope.getData = function (searchField) {
            let _KEY = 'd4c7fbfd7ee448dd82a744a09029bacd';
            
            $http.get('https://merchant.wish.com/api/v2/product/multi-get', {
                    start: '20',
                    limit: '2',
                    since: '2014-10-15',
                    upto:  '2018-09-01T01:00:00',
                    access_token: _KEY
            })
                .then(function (data) {
                    console.log(data);
                });
        };

        wishAuthService();

        $scope.clearInput = function () {
            $scope.searchField = "";
        }

        $scope.logo =
            {
                url: 'goenndir-logo-2018-web.png',
                title: 'gönndir.online 2018',
                alt: 'Logo 2018'
            };

        $scope.links = [
            {
                "title": "Home",
                "pathTo": "/"
            },
            {
                "title": "Bio",
                "step": "Über uns",
                "pathTo": "/"
            },
            {
                "title": "Album",
                "step": "Impressionen",
                "pathTo": "/"
            },
            {
                "title": "Karte",
                "step": "Wie sie uns finden",
                "pathTo": "/"
            }
        ];

        /* get View in Menu */

        /* get the Main Content */
        $http({
            method: 'GET',
            url: 'data/pawPages.json'
        }).then(function (response, $anchorScroll) {
            $scope.pages = response.data;
        }, function (error) {
            console.log(error);
        }, 3000);


        /* get extended Content */
        $http({
            method: 'GET',
            url: 'data/pawContent.json'
        }).then(function (response) {
            $scope.boxes = response.data;
        }, function (error) {
            console.log(error);
        }, 2000);

        $scope.main = [
            {title: 'Welcome to Paw AngularJS App'},
            {content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'}
        ];

    }
])

    .factory('pawService', function () {
        return function (data) {
            if (data.length >= 3) {
                return data;
            } else {
                console.log('Dein Eintrag ist zu kurz');
            }
        }
    })

    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);