app.controller('goennController', [
    '$scope',
    '$filter',
    '$http',
    '$timeout',
    '$window',
    '$mdSidenav',
    '$location',
    'goennService', function (
        $scope,
        $filter,
        $http,
        $timeout,
        $window,
        $mdSidenav,
        $location,
        goennService) {

            $scope.toggleLeft = buildDelayedToggler('left');
            $scope.toggleRight = buildToggler('right');
            $scope.isOpenRight = function(){
              return $mdSidenav('right').isOpen();
            };
        
            /**
             * Supplies a function that will continue to operate until the
             * time is up.
             */
            function debounce(func, wait, context) {
              var timer;
        
              return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                  timer = undefined;
                  func.apply(context, args);
                }, wait || 10);
              };
            }
        
            /**
             * Build handler to open/close a SideNav; when animation finishes
             * report completion in console
             */
            function buildDelayedToggler(navID) {
              return debounce(function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                  .toggle()
                  .then(function () {
                    $log.debug("toggle " + navID + " is done");
                  });
              }, 200);
            }
        
            function buildToggler(navID) {
              return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                  .toggle()
                  .then(function () {
                    $log.debug("toggle " + navID + " is done");
                  });
              };
            }

        $scope.searchField = "Suche z.B. nach Festival";

        wishAuthService =  function() {
            $http.post('https://merchant.wish.com/api/v2/auth_test?access_token=d4c7fbfd7ee448dd82a744a09029bacd')
                .then(function(data) {
                    console.log(data.data.data);
                    $scope.shopName = data.data.data.merchant_username;
                });
        }
        wishAuthService();

        /**
         * This function waits until the Wish Api will send the 'FINISHED' Staus inside 200
         * @param {*} _KEY Access Token
         * @param {*} jobID The job ID
         * @param {*} finishedContinuation The Function which is called when the finished status was reached
         */
        $scope.waitServerStatus = (_KEY, jobID, finishedContinuation) => {
            $scope.isLoading = 'active';
            $http.post('https://merchant.wish.com/api/v2/product/get-download-job-status?access_token='+ _KEY + '&job_id=' + jobID)
            .then((response) => {
                $scope.serverStatus = serverStati = response.data.data;

                if (serverStati.status == 'FINISHED' || serverStati.status == 'FERTIG') {
                    $scope.contentLoadedGo = false;
                    finishedContinuation(serverStati);
                } else {
                    $timeout(() => {
                        $scope.waitServerStatus(_KEY, jobID, finishedContinuation);
                        $scope.contentLoadedGo = true;
                    }, 5000);
                }
            })
            .catch((e) => console.log(e));
        }

        $scope.downloadProductFile = (serverStati) => {
            $scope.isLoading = '';
            console.log(serverStati.download_link);
            if (serverStati.download_link) {

                $scope.contentLoading = true;
                $http.get(serverStati.download_link)
                    .then(function(data) {
                        console.log(data);
                        $scope.loadedProducts = data;
                    });
            }
        }

        $scope.getData = function (serverStatus) {
            $scope.searchField = 'Produkte werden geladen ... ' + serverStatus;
            var _KEY = 'd4c7fbfd7ee448dd82a744a09029bacd';
            $http.post('https://merchant.wish.com/api/v2/product/create-download-job?access_token='+ _KEY +'&format=json')
                .then(function(data) {
                    return $scope.jobID = data.data.data.job_id;
                })
                .then(function(data) {
                    $scope.waitServerStatus(_KEY, $scope.jobID, $scope.downloadProductFile);
                })
        };

        $scope.clearInput = function () {
            $scope.contentLoadedGo = false;
            $scope.clearInputclicked = true;
            $scope.searchField = '';
            $scope.newVal = 'Suche z.B. nach E-Bike preiswert';
        }

        $scope.$on(
            "$destroy",
            function(clearInput) {
                $timeout.cancel(this);
            }
        );

        $scope.cancelBuilderServer = function() {
            $scope.contentLoadedGo = false;
            $http.post('https://merchant.wish.com/api/v2/product/cancel-download-job?access_token=d4c7fbfd7ee448dd82a744a09029bacd&job_id=' + $scope.jobID)
            .then(function(response) {
                console.log('Prozess vorzeitig beendet!');
            });
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
            url: 'data/goennPages.json'
        }).then(function (response, $anchorScroll) {
            $scope.pages = response.data;
        }, function (error) {
            console.log(error);
        }, 3000);


        /* get extended Content */
        $http({
            method: 'GET',
            url: 'data/goennContent.json'
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
    .factory('goennService', function () {
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
    }])
    .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
          // Component lookup should always be available since we are not using `ng-if`
          $mdSidenav('left').close()
            .then(function () {
              $log.debug("close LEFT is done");
            });
    
        };
      })
      .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
          // Component lookup should always be available since we are not using `ng-if`
          $mdSidenav('right').close()
            .then(function () {
              $log.debug("close RIGHT is done");
            });
        };
      });