logger.info(__('Creating trip routes...'));

var Trip = mongoose.model('Trip'),
    Destination = mongoose.model('Destination'),
    POI = mongoose.model('POI');

var router = module.exports = express.Router();

router.param('trip', function (req, res, next, id) {
    if (ObjectId.isInvalid(id)) {
        return res.error(HTTPStatus.LENGTH_REQUIRED, 'Should be 24 characters long');
    }
    Trip.findById(id).exec(function (err, trip) {
        if (err) {
            return next(err);
        }
        if (!trip) {
            return res.error(HTTPStatus.NOT_FOUND, 'Can\'t find trip ' + id);
        }
        req.trip = trip;
        return next();
    });
});
router.param('destination', function (req, res, next, id) {
    if (ObjectId.isInvalid(id)) {
        return res.error(HTTPStatus.LENGTH_REQUIRED, 'Should be 24 characters long');
    }
    Destination.findById(id).exec(function (err, destination) {
        if (err) {
            return next(err);
        }
        if (!destination) {
            return res.error(HTTPStatus.NOT_FOUND, 'Can\'t find destination ' + id);
        }
        req.destination = destination;
        return next();
    });
});

router.all('/:trip*', auth, function (req, res, next) {
    if (req.trip.belongsTo(req.user)) {
        next();
    }
    else {
        next(new StatusError(HTTPStatus.UNAUTHORIZED, 'Unauthorized'));
    }
});

router.get('/', auth, function (req, res, next) {
    Trip.find({'user': req.user}, function (err, trips) {
        if (err) {
            return next(err);
        }
        _.each(trips, function(trip){delete trip.destinations;});
        res.json(trips);
    });
});

router.post('/', auth, function (req, res, next) {
    delete req.body._id;
    var trip = new Trip(req.body);
    trip.user = req.user;
    trip.save(function (err, trip) {
        if (err) {
            return next(err);
        }
        res.json(trip);
    });
});

router.get('/:trip', auth, function (req, res, next) {
    req.trip.populate('destinations', function (err, trip) {
        if (err) {
            return next(err);
        }
        res.json(trip);
    });
});

router.get('/:trip/destination/:destination', auth, function (req, res, next) {
    req.destination.populate('pois', function (err, destination) {
        if (err) {
            return next(err);
        }
        res.json(destination);
    });
});

router.delete('/:trip', auth, function (req, res, next) {
    req.trip.remove(function (err) {
        if (err) {
            return next(err);
        }
        res.json(req.trip);
    });
});

router.put('/:trip', auth, function (req, res, next) {
    var destinations = req.trip.getFilteredDestinations(req.body.destinations);
    delete req.body.destinations;

    _.each(destinations.toRemove, function (destination) {
        Destination.findById(destination, function (err, dest) {
            dest.remove();
        });
    });
    _.each(destinations.toAdd, function (destination) {
        delete destination.pois;
        delete destination._id;
        destination.trip = req.trip._id;
        var dest = new Destination(destination);
        dest.save();
    });

    req.trip.update(req.body, function (err) {
        if (err) { return next(err); }
        res.json(req.trip);
    });

    //var isValidAllDates = _.all(destinations.toAdd, function (destination) {
    //    return req.trip.hasValidDateBetweenDestinations(destination);
    //});
    //if (!isValidAllDates) {
    //    return res.error(HTTPStatus.BAD_REQUEST, 'Please check the fields start date and end date are valid of destinations.');
    //}
});

router.put('/:trip/destination/:destination', auth, function (req, res, next) {
    var pois = req.destination.getFilteredPOIs(req.body.pois);
    req.body.hotel = req.body.newHotel;
    delete req.body.newHotel;
    delete req.body.pois;

    _.each(pois.toRemove, function (poi) {
        POI.findById(poi, function (err, poi) {
            poi.remove();
        });
    });
    _.each(pois.toAdd, function (poi) {
        delete poi._id;
        poi.destination = req.destination;
        var poi = new POI(poi);
        poi.save();
    });

    req.destination.update(req.body, function (err) {
        if (err) {return next(err);}
        res.json(req.destination);
    });
});
/*
 _id=556b1267057c06b111e6aa10, city=Wilde, Buenos Aires, Argentina,
 startDate=2015-05-31T03:00:00.000Z, endDate=2015-06-05T13:53:32.046Z,
 latitude=-34.7040787, longitude=-58.32059859999998,
  pois=[_id=556ca0ec41131a171a6219e4, name=Estadio Alberto J. Armando,
  icon=http://maps.gstatic.com/mapfiles/place_api/icons/stadium-71.png,
   address=Brandsen 805, 1161 Buenos Aires, Argentina, description=Information of POI:
 Estadio Alberto J. Armando
 Brandsen 805, 1161 Buenos Aires, Argentina, ranking=9, latitude=-34.635611,
 longitude=-58.364756, destination=556b1267057c06b111e6aa10, __v=0,
 _id=556ca0ec41131a171a6219e5, name=Ferrocarril Oeste,
  icon=http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png,
   address=Buenos Aires, Buenos Aires, Argentina, description=Information of POI:
 Ferrocarril Oeste
 Buenos Aires, Buenos Aires, Argentina, ranking=9, latitude=-34.619391,
 longitude=-58.44822799999997, destination=556b1267057c06b111e6aa10, __v=0],
 name=Hola, isEditing=false

*/