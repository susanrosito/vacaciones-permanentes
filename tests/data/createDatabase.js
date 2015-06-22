var config = require('../../config');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(config.mongo.connectionString(), function (err, db) {
    if (err) { process.exit(1); }
    db.collection('users').insert({
        '_id': ObjectId('55876b3fc663bf3e40fb1050'),
        'hash': '8bde18d76b31d5f5d178a176eef340fa14b6760dd7cc497a8f13138b052c7dd04e641d0823bee22581b05a73e4d0f97b9da57d443c02677a7c954e3db37a5af3',
        'salt': '37e68a9876da02454e3bd81a374d297c',
        'email': 'someone@company.com',
        'name': 'Someone',
        'language': 'es'
    });
    db.collection('trips').insert({
        '_id': ObjectId('55876b57c663bf3e40fb1051'),
        'user': ObjectId('55876b3fc663bf3e40fb1050'),
        'title': 'America',
        'startDate': new Date('2015-06-21T00:00:00.000-0300'),
        'endDate': new Date('$2015-07-06T23:04:01.845-0300'),
        'destinations': [
            ObjectId('55876d37c663bf3e40fb105d'),
            ObjectId('55876d37c663bf3e40fb105e')
        ]
    });
    db.collection('trips').insert({
        '_id': ObjectId('55876b7dc663bf3e40fb1052'),
        'user': ObjectId('55876b3fc663bf3e40fb1050'),
        'title': 'Europa',
        'startDate': new Date('2015-06-21T00:00:00.000-0300'),
        'endDate': new Date('2015-07-06T23:03:03.124-0300'),
        'destinations': [
            ObjectId('55876bbfc663bf3e40fb1054'),
            ObjectId('55876bbfc663bf3e40fb1055'),
            ObjectId('55876bbfc663bf3e40fb1053')
        ]
    });
    db.collection('destinations').insert({
        '_id': ObjectId('55876bbfc663bf3e40fb1053'),
        'city': 'París, Francia',
        'image': 'http://www.fondos7.net/wallpaper-original/wallpapers/paris-francia-2011-4027.jpg',
        'startDate': new Date('2015-06-21T00:00:00.000-0300'),
        'endDate': new Date('2015-06-26T22:57:24.269-0300'),
        'latitude': 48.856614,
        'longitude': 2.352221900000018,
        'trip': ObjectId('55876b7dc663bf3e40fb1052'),
        'pois': [
            ObjectId('55876cd5c663bf3e40fb105a')
        ],
        'hotel': {
            'name': 'Hôtel Saint-Merry',
            'icon': 'http://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png',
            'address': '78 Rue de la Verrerie, Paris',
            'ranking': 9,
            'latitude': 48.859038,
            'longitude': 2.350383999999963
        }
    });
    db.collection('destinations').insert({
        '_id': ObjectId('55876bbfc663bf3e40fb1054'),
        'city': 'Londres, Reino Unido',
        'image': 'http://blogs.elpais.com/.a/6a00d8341bfb1653ef016304b4566f970d-pi',
        'startDate': new Date('2015-06-21T00:00:00.000-0300'),
        'endDate': new Date('2015-06-26T22:57:36.492-0300'),
        'latitude': 51.5073509,
        'longitude': -0.1277582999999822,
        'trip': ObjectId('55876b7dc663bf3e40fb1052'),
        'pois': [
            ObjectId('55876c29c663bf3e40fb1056'),
            ObjectId('55876c29c663bf3e40fb1057')
        ],
        'hotel': {
            'name': 'Radisson Blu Edwardian, Hampshire',
            'icon': 'http://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png',
            'address': '31-36 Leicester Square, London',
            'ranking': 8,
            'latitude': 51.509886,
            'longitude': -0.1297590000000355
        }
    });
    db.collection('destinations').insert({
        '_id': ObjectId('55876bbfc663bf3e40fb1055'),
        'city': 'Berlín, Alemania',
        'image': 'http://www.fondosparapantalla.com/albums/fondos-viajes/Catedral-de-Berlin-Alemania-001.jpg',
        'startDate': new Date('2015-06-21T00:00:00.000-0300'),
        'endDate': new Date('2015-06-26T22:57:45.975-0300'),
        'latitude': 52.52000659999999,
        'longitude': 13.40495399999998,
        'trip': ObjectId('55876b7dc663bf3e40fb1052'),
        'pois': [
            ObjectId('55876c66c663bf3e40fb1058'),
            ObjectId('55876c66c663bf3e40fb1059')
        ],
        'hotel': {
            'name': 'Hotel Eurostars Berlin',
            'icon': 'http://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png',
            'address': 'Friedrichstraße 99, Berlin',
            'ranking': 9,
            'latitude': 52.5205,
            'longitude': 13.38949000000002
        }
    });
    db.collection('destinations').insert({
        '_id': ObjectId('55876d37c663bf3e40fb105d'),
        'city': 'Montevideo, Departamento de Montevideo, Uruguay',
        'image': 'http://images.fanpop.com/images/image_uploads/Montevideo-Uruguay-south-america-travel-410032_702_552.jpg',
        'startDate': new Date('2015-06-21T00:00:00.000-0300'),
        'endDate': new Date('2015-06-26T23:04:10.964-0300'),
        'latitude': -34.9011127,
        'longitude': -56.16453139999999,
        'trip': ObjectId('55876b57c663bf3e40fb1051'),
        'pois': [],
        'hotel': {
            'name': 'Che Lagarto Hostel Montevideo',
            'icon': 'http://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png',
            'address': 'Colonia 2063, Montevideo',
            'ranking': 7,
            'latitude': -34.898869,
            'longitude': -56.17150200000003
        }
    });
    db.collection('destinations').insert({
        '_id': ObjectId('55876d37c663bf3e40fb105e'),
        'city': 'Rio de Janeiro',
        'image': 'http://blog.guesttoguest.com/wp-content/uploads/2013/11/2.-christ-the-reedemer.jpg',
        'startDate': new Date('2015-06-21T00:00:00.000-0300'),
        'endDate': new Date('2015-06-26T23:04:25.398-0300'),
        'latitude': -22.9068467,
        'longitude': -43.17289649999998,
        'trip': ObjectId('55876b57c663bf3e40fb1051'),
        'pois': []
    });
    db.collection('pois').insert({
        '_id': ObjectId('55876c29c663bf3e40fb1056'),
        'name': 'Locksmith London',
        'icon': 'http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png',
        'address': 'London Pavilion, 1 Piccadilly Circus, London W1J 0TR, Reino Unido',
        'ranking': 0,
        'latitude': 51.510153,
        'longitude': -0.1340959999999995,
        'destination': ObjectId('55876bbfc663bf3e40fb1054')
    });
    db.collection('pois').insert({
        '_id': ObjectId('55876c29c663bf3e40fb1057'),
        'name': 'London River Yacht Club',
        'icon': 'http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png',
        'address': 'Portsmouth Road, Surbiton, Surrey KT6 4HL, Reino Unido',
        'ranking': 0,
        'latitude': 51.398364,
        'longitude': -0.310406999999941,
        'destination': ObjectId('55876bbfc663bf3e40fb1054')
    });
    db.collection('pois').insert({
        '_id': ObjectId('55876c66c663bf3e40fb1058'),
        'name': 'FC Stahl Brandenburg',
        'icon': 'http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png',
        'address': 'Thüringer Straße 251, 14770 Brandenburg an der Havel, Alemania',
        'ranking': 0,
        'latitude': 52.41196,
        'longitude': 12.50360999999998,
        'destination': ObjectId('55876bbfc663bf3e40fb1055')
    });
    db.collection('pois').insert({
        '_id': ObjectId('55876c66c663bf3e40fb1059'),
        'name': 'Konzerthaus Berlin',
        'icon': 'http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png',
        'address': 'Gendarmenmarkt, 10117 Berlin, Alemania',
        'ranking': 8,
        'latitude': 52.513644,
        'longitude': 13.39179000000001,
        'destination': ObjectId('55876bbfc663bf3e40fb1055')
    });
    db.collection('pois').insert({
        '_id': ObjectId('55876cd5c663bf3e40fb105a'),
        'name': 'Lourve Design Associates',
        'icon': 'http://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
        'address': '925 Yishun Central 1, Singapur 760925',
        'ranking': 0,
        'latitude': 1.427567,
        'longitude': 103.8375599999999,
        'destination': ObjectId('55876bbfc663bf3e40fb1053')
    });
    setTimeout(function() { process.exit(0); }, 1000);
});