angular.module('volunteerApp.controllers', [])
    .controller('WelcomeController', ['$scope', 'SEOService', '$location', 'UserService', 'User', '$window', function ($scope, SEOService, $location, UserService, User, $window) {
        UserService.me()
            .then(function (success) {
                $scope.user = success;
            });

        $scope.login = function () {
            UserService.login($scope.email, $scope.password)
                .then(function () {
                    $location.path('/animals');
                    $window.location.reload();
                }, function (err) {
                    console.log(err);
                });
        }

        SEOService.setSEO({
            title: 'Welcome',
            url: $location.url(),
            description: 'McKamey Animal Shelter Volunteer Portal'
        })

        $scope.animals = function () {
            $location.path('/animal_list');
        }
    }])
    .controller('AcctController', ['$scope', 'UserService', function ($scope, UserService) {
        UserService.me()
            .then(function (success) {
                $scope.user = success;
            });
        $scope.IsAdmin = function () {
            return $scope.user == "admin";
        }
        $scope.IsUser = function () {
            return $scope.user == "user";
        }
    }])
    // .controller('NavController', ['$scope', function ($scope) {
    //     $('.navbar li').on('click', function () {
    //         $('.nav li').removeClass("active");
    //         $(this).addClass('active');
    //     })
    // }])
    .controller('AnimalsController', ['$scope', 'Animal', 'UserService', 'SEOService', '$location', '$http', function ($scope, Animal, UserService, SEOService, $location, $http) {
        $scope.editProfile = function () {
            UserService.me()
                .then(function (currentUser) {
                    console.log(currentUser);
                    $location.path('/users/' + currentUser.id + '/update');
                });
        }
        $scope.getAnimals = function (callback) {
            callback($scope.animals);
        };
        $scope.animalSelected = function (animal) {
            $scope.animalInfo = animal.name + " (" + animal.shelterid + ")";
        };
        $scope.animals = Animal.query();
        UserService.me()
            .then(function (success) {

                $scope.user = success;
            });

        SEOService.setSEO({
            title: 'Adoptions List',
            url: $location.url(),
            description: 'McKamey Animal Shelter Volunteer Portal'
        })
    }])
    .controller('SingleAnimalController', ['$scope', 'Animal', 'UserService', 'SEOService', '$location', '$routeParams', 'Comments', function ($scope, Animal, UserService, SEOService, $location, $routeParams, Comments) {
        $scope.animal = Animal.get({ id: $routeParams.id });
        $scope.comment = Comments.queryForAnimal({ id: $routeParams.id });

        UserService.me()
            .then(function (success) {
                $scope.user = success;
            });

        $scope.deleteAnimal = function () {
            if (confirm('Are you sure you want to delete ' + $scope.animal.name + '?')) {
                $scope.animal.$delete(function (success) {
                    $location.replace().path('/animals');
                }, function (err) {
                    console.log(err);
                });
            }
        };


        $scope.flagComment = function (comment) {
            if (confirm('Are you sure you want to report this comment?')) {
                comment.$update(function (success) {
                    alert("Your comment report has been submitted");
                }, function (err) {
                    console.log(err);
                });
            }
        };


        $scope.deleteComment = function (comment) {
            if (confirm('Are you sure you want to delete your comment?')) {
                comment.$delete(function (success) {
                    $scope.comment = Comments.queryForAnimal({ id: $routeParams.id });
                }, function (err) {
                    console.log(err);
                });
            }
        };

        $scope.addComment = function () {
            var payload = {
                animalid: $scope.animal.id,
                userid: $scope.user.id,
                comment: $scope.commentToAdd,
            };
            var c = new Comments(payload);
            c.$save(function (success) {
                $scope.commentToAdd = '';
                $scope.comment = Comments.queryForAnimal({ id: $routeParams.id });
            }, function (err) {
                console.log(err);
            });
        }
       
        SEOService.setSEO({
            title: 'Animal Bio',
            url: $location.url(),
            description: 'Single Animal bio page on McKamey Animal Shelter Volunteer Portal'
        })
    }])
    .controller('AnimalUpdateController', ['$scope', 'Animal', 'UserService', 'SEOService', '$location', '$routeParams', function ($scope, Animal, UserService, SEOService, $location, $routeParams) {
        $scope.animal = Animal.get({ id: $routeParams.id });
        $scope.updateAnimal = function () {
            $scope.animal.$update(function (success) {
                $location.path('/animals/' + $routeParams.id);
            }, function (err) {
                console.log(err);
            });
        };
        $scope.deleteAnimal = function () {
            if (confirm('Are you sure you want to delete ' + $scope.animal.name + '?')) {
                $scope.animal.$delete(function (success) {
                    $location.replace().path('/animals');
                }, function (err) {
                    console.log(err);
                });
            }
        };

        SEOService.setSEO({
            title: 'Edit Animal',
            url: $location.url(),
            description: 'Edit Animal on McKamey Animal Shelter Animal List'
        })
    }])
    .controller('AddAnimalController', ['$scope', 'Animal', 'SEOService', '$location', function ($scope, Animal, SEOService, $location) {
        $scope.animals = Animal.query();
        $scope.saveAnimal = function () {
            var payload = {
                name: $scope.name,
                age: $scope.age,
                gender: $scope.gender,
                species: $scope.species,
                breed: $scope.breed,
                size: $scope.size,
                shelterid: $scope.shelterid,
                bio: $scope.bio
            };
            var a = new Animal(payload);
            a.$save(function (success) {
                $location.path('/animals');
            }, function (err) {
                console.log(err);
            });
        }

        SEOService.setSEO({
            title: 'Add A New Animal',
            url: $location.url(),
            description: 'Admin add a new animal to McKamey Animal Shelter Animal List'
        })
    }])
    .controller('UserListController', ['$scope', 'User', 'UserService', 'SEOService', '$location', function ($scope, User, UserService, SEOService, $location) {
        $scope.users = User.query();

        UserService.me()
            .then(function (success) {
                $scope.user = success;
            });

        $scope.saveUser = function () {
            var payload = {
                email: $scope.email,
                password: $scope.password,
                firstname: $scope.firstname,
                lastname: $scope.lastname
            };

            var u = new User(payload);

            u.$save(function (success) {
                $scope.email = '';
                $scope.password = '';
                $scope.firstname = '';
                $scope.lastname = '';
                $scope.users = User.query();
            }, function (err) {
                console.log(err);
            });
        }

        SEOService.setSEO({
            title: 'Manage Users',
            url: $location.url(),
            description: 'McKamey Animal Shelter Volunteer User List'
        })
    }])
    .controller('SingleUserController', ['$scope', 'User', 'UserService', 'SEOService', '$location', '$routeParams', function ($scope, User, UserService, SEOService, $location, $routeParams) {
        UserService.me()
            .then(function (success) {
                $scope.user = success;
            });

        $scope.clickuser = User.get({ id: $routeParams.id });
        $scope.deleteUser = function () {
            if (confirm('Are you sure you want to delete ' + $scope.user.firstname + ' ' + $scope.user.lastname + '?')) {
                $scope.user.$delete(function (success) {
                    $location.replace().path('/users');
                }, function (err) {
                    console.log(err);
                });
            }
        };

        SEOService.setSEO({
            title: 'View User',
            url: $location.url(),
            description: 'View McKamey Animal Shelter Volunteer'
        })
    }])
    .controller('UserUpdateController', ['$scope', 'User', 'UserService', 'SEOService', '$location', '$routeParams', '$window', function ($scope, User, UserService, SEOService, $location, $routeParams, $window) {
        $scope.user = User.get({ id: $routeParams.id });

        //should put req to /users/id
        $scope.updateUser = function () {
            $scope.user.$update(function () {
                $location.path('/users/' + $routeParams.id);
                $window.location.reload();
            });
        }
        //use http and update to create multiform submission. (google angjs submit image multer, maybe directives)
        
        $scope.deleteUser = function () {
            if (confirm('Are you sure you want to delete ' + $scope.user.firstname + ' ' + $scope.user.lastname + '?')) {
                $scope.user.$delete(function (success) {
                    $location.replace().path('/users');
                }, function (err) {
                    console.log(err);
                });
            }
        };

        SEOService.setSEO({
            title: 'Edit User',
            url: $location.url(),
            description: 'Edit McKamey Animal Shelter Volunteer User'
        })
    }])
    .controller('DonationController', ['$scope', 'SEOService', 'Donation', '$location', function ($scope, SEOService, Donation, $location) {
        var elements = stripe.elements();
        var card = elements.create('card');
        card.mount('#card-field');

        $scope.errorMessage = '';

        $scope.processDonation = function () {
            stripe.createToken(card, {
                name: $scope.fullname,
                address_line1: $scope.line1,
                address_line2: $scope.line2,
                address_city: $scope.city,
                address_state: $scope.state,
                email: $scope.email
            }).then(function (result) {
                if (result.error) {
                    $scope.errorMessage = result.error.message;
                } else {
                    var d = new Donation({
                        token: result.token.id,
                        amount: $scope.amount,
                        email: $scope.email
                    });
                    d.$save(function () {
                        $location.path('/');
                        alert('Thank you for your donation!');
                    }, function (err) {
                        console.log(err);
                    });
                }
            });
        }
        SEOService.setSEO({
            title: 'Donate',
            url: $location.url(),
            description: 'Help Out The McKamey Animal Shelter'
        })
    }])
    .controller('LogoutController', ['$scope', 'UserService', 'SEOService', '$location', '$window', function ($scope, UserService, SEOService, $location, $window) {
        UserService.logout()
            .then(function (success) {
                $location.path('/');
                $window.location.reload();
            });

        SEOService.setSEO({
            title: 'Logging Out',
            url: $location.url(),
            description: 'Leaving the McKamey Animal Shelter Volunteer Portal'
        })
    }])
    .controller('AdminController', ['$scope', 'SEOService', '$location', 'User', 'Comments', 'UserService', 'Animal', function ($scope, SEOService, $location, User, Comments, UserService, Animal) {
        SEOService.setSEO({
            title: 'Admin Dashboard',
            url: $location.url(),
            description: 'McKamey Admin Dashboard'
        })

        $scope.getAnimals = function (callback) {
            callback($scope.animals);
        };
        $scope.animalSelected = function (animal) {
            $scope.animalInfo = animal.name + " (" + animal.shelterid + ")";
        };
        $scope.animals = Animal.query();

        $scope.getUsers = function (callback) {
            callback($scope.users);
        };
        $scope.userSelected = function (user) {
            $scope.userInfo = user.name;
        };
        $scope.users = User.query();

        //flagged comment logic
        $scope.comment = Comments.queryForFlag();

        $scope.flagComment = function (comment) {
            comment.$update(function (success) {
                $scope.comment = Comments.queryForFlag();
            }, function (err) {
                console.log(err);
            });
        };


        $scope.deleteComment = function (comment) {
            if (confirm('Are you sure you want to delete this comment?')) {
                comment.$delete(function (success) {
                    $scope.comment = Comments.queryForFlag();
                }, function (err) {
                    console.log(err);
                });
            }
        };

    }])

// .controller('NavController', ['$scope', '$location', function($scope, $location) {
//     if(localStorage.items === undefined) 
//         localStorage.items = angular.toJson([]);
//     $scope.cartTotal = angular.fromJson(localStorage.items).length;
//     $scope.$on("cartChanged", function() {
//         $scope.cartTotal = angular.fromJson(localStorage.items).length;
//     })
//     $scope.$on("purchase", function() {
//         $scope.cartTotal = 0;
//     })
//     .controller('StaticController', ['$scope',])
//         SEOService.setSEO({
//             title: 'Bulletin Board',
//             url: $location.url(),
//             description: 'McKamey Volunteer Bulletin Board'
// })



