
angular.module("LibraryApp", []).controller("LibraryCtrl", function ($scope, $http) {

    $scope.libraryUrl = "http://localhost:8080/books";

    $scope.currentPage = 0;

    $scope.repository = {};

    $scope.totalElements = 0;

    $scope.mode = "table";

    $scope.currentbook = {};

    $scope.bookBackup = {};

    $scope.pagination = {};

    $scope.refresh = function () {
        $http({
            method: "GET",
            url: ($scope.libraryUrl + "?size=10&page=" + $scope.currentPage)
        }).then(function successCallback(response) {
            $scope.model = response.data._embedded.books;
            $scope.pagination = response.data.page;
            $scope.totalElements = $scope.pagination.totalElements;
            $scope.getAllBooks($scope.pagination.totalElements);
        });
    };

    $scope.refresh();

    $scope.saveNewBook = function (book) {

        if (!$scope.findBook(book.isbn)) {

            if (angular.isDefined(book)) {
                book.readed = false;
                $http({
                    method: "POST",
                    url: $scope.libraryUrl,
                    data: book
                }).then(function successCallback(response) {
                    alert("New book added");
                    $scope.refresh();
                });
            }

        } else {
            alert("Book with this ISBN is exist! Try again.");
        }
    };

    $scope.switchView = function () {
        if ($scope.mode === "table") {
            $scope.mode = "editor";
        } else if ($scope.mode === "editor") {
            $scope.mode = "table";
        }
    };

    $scope.editBook = function (book) {
        Object.assign($scope.bookBackup, book);
        $scope.currentBook = book;
        $scope.switchView();
    };

    $scope.returnToTable = function () {
        Object.assign($scope.currentBook, $scope.bookBackup);
        $scope.switchView();
    };

    $scope.saveCurrentBook = function () {
        if (($scope.currentBook.title === $scope.bookBackup.title) && ($scope.currentBook.description === $scope.bookBackup.description)
            && ($scope.currentBook.printed === $scope.bookBackup.printed) && ($scope.currentBook.isbn === $scope.bookBackup.isbn)) {
            alert("No changes!")

        } else {

            for (var i = 0; i < $scope.repository.length; i++) {

                if (($scope.currentBook.isbn === $scope.repository[i].isbn) &&
                    ($scope.currentBook._links.self.href !== $scope.repository[i]._links.self.href)) {
                    alert("Book with this ISBN is exist! Try again.");
                    return;
                }
            }

            $scope.currentBook.readed = false;
            $http({
                method: "PUT",
                url: $scope.currentBook._links.self.href,
                data: $scope.currentBook
            }).then(function successCallback(response) {
                $scope.refresh();
                $scope.switchView();
            });
        }
    };

    $scope.markAsRead = function () {

        Object.assign($scope.currentBook, $scope.bookBackup);
        $scope.currentBook.readed = true;

        $http({
            method: "PUT",
            url: $scope.currentBook._links.self.href,
            data: $scope.currentBook
        }).then(function successCallback(response) {
            $scope.refresh();
            $scope.switchView();
        });
    };

    $scope.deleteBook = function (book) {

        if (confirm("Are you sure?")) {
            $http({
                method: "DELETE",
                url: book._links.self.href
            }).then(function successCallback(response) {
                $scope.refresh();
                alert("Book deleted.");
            })

        }
    };

    $scope.findBook = function (isbn) {

        for (var i = 0; i < $scope.repository.length; i++) {

            if (isbn === $scope.repository[i].isbn) {
                return true;
            }
        }
        return false;
    };

    $scope.findBookByTitle = function (title) {

        for (var i = 0; i < $scope.repository.length; i++) {
            if (title === $scope.repository[i].title) {
                if (confirm("Some book found : author is : " + $scope.repository[i].author + ", year of publication is : "
                        + $scope.repository[i].printed + ", isbn is : " + $scope.repository[i].isbn + ". Edit?")) {
                    $scope.editBook($scope.repository[i]);
                    return;
                }
            }
        }
        alert("Another books not found!");
    };

    $scope.getAllBooks = function (totalElements) {

        $http({
            method: "GET",
            url: ($scope.libraryUrl + "?size=" + totalElements)
        }).then(function successCallback(response) {
            $scope.repository = response.data._embedded.books;
        });
    };

    $scope.toPage = function (pageNumber) {
        if (pageNumber < $scope.pagination.totalPages) {
            $http({
                    method: "GET",
                    url: $scope.libraryUrl + "?page=" + pageNumber + "&size=10"
                }
            ).then(function successCallback(response) {
                $scope.currentPage = pageNumber;
                $scope.model = response.data._embedded.books;
                $scope.pagination = response.data.page;
            })
        }
    };
});
