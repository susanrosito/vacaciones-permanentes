app.factory('$googleImageSearch', [function() {

    var searcher = {};
    searcher.getImage = function(query, callback) {
        var imageSearch = new google.search.ImageSearch();
        imageSearch.setSearchCompleteCallback(imageSearch, function() {
            if (imageSearch.results && imageSearch.results.length > 0) {
                callback(imageSearch.results[0]);
            }
        }, []);
        imageSearch.execute(query);
    };
    return searcher;
} ]);
