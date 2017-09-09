var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');
var async = require('async');
var client = require('node-rest-client').Client;
var client = new client();
require('events').EventEmitter.prototype._maxListeners = 100;

// Tables
var Anime = require('../models/anime');
var User = require('../models/user');
var Genre = require('../models/genre');
var UserAnime = require('../models/userAnime');
var AnimeGenre = require('../models/animeGenre');
var Producer = require('../models/producer');
var Studio = require('../models/studio');
var Licensor = require('../models/licensor');

// Relationships
User.belongsToMany(Anime, {through: { model: UserAnime, unique: false}, foreignKey: 'fk_user_id_user_anime'});
Anime.belongsToMany(User, {through: { model: UserAnime, unique: false}, foreignKey: 'fk_anime_id_user_anime'});
Genre.belongsToMany(Anime, {through: { model: AnimeGenre, unique: false}, foreignKey: 'fk_genre_id_anime_genre'});
Anime.belongsToMany(Genre, {through: { model: AnimeGenre, unique: false}, foreignKey: 'fk_anime_id_anime_genre'});

// Syncing database
sequelize.sync();

exports.post_user = function(request, response, next) {
    async.waterfall([
        findUserInDatabase,
        createOrUpdateUserInDatabase,
        findAnimeInDatabase,
        getAnimeFromJikanApi,
        insertAnimeIntoDatabase,
        ], function(err) {
        if(err) return next(err);
        response.render('user-stats', {
            // TODO: Set-up rendering and loading page
        })
    });

    /**
     * Queries the database for the user's posted search term
     * @param callback Called on success
     */
    function findUserInDatabase(callback) {
        let userName = request.body.search;
        User.findOne({
            where: {name : userName},
            attributes: ['id', 'name', 'watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch',
                'days_spent_watching', 'updated_at'],
        }).then(user => {
            callback(null, user);
        })
    }

    /**
     * This function will do one of three things, depending on the query result from findUserInDatabase:
     * 1. Creates the user in the database by making a request to MAL api and then inserting that response
     * 2. Updates the user in database if their record is older than 5 days
     * 3. Moves onto the next step, because the user did not need to be created or updated
     * @param user Query result from database
     * @param callback Called on success
     * list as the third parameter
     */
    function createOrUpdateUserInDatabase(user, callback) {
        // If user was not found in the database query, we make a request to MAL api and create it in the database
        // from that response.
        if(user === null) {
            let userName = request.body.search;
            let args = {path: {'id': userName}};
            client.get('http://myanimelist.net/malappinfo.php?u=${id}&status=all&type=anime', args, function(req, res) {
                let malUserData = req.myanimelist.myinfo;
                let malUserAnimeData = req.myanimelist.anime;
                User.findOrCreate({
                    where: {
                        id: malUserData.user_id
                    },
                    defaults: {
                        id: malUserData.user_id,
                        name: malUserData.user_name,
                        watching: malUserData.user_watching,
                        completed: malUserData.user_completed,
                        on_hold: malUserData.user_onhold,
                        dropped: malUserData.user_dropped,
                        plan_to_watch: malUserData.user_plantowatch,
                        days_spent_watching: malUserData.user_days_spent_watching
                    },
                }).spread((user, created) => {
                    callback(null, user, malUserAnimeData);
                });
            }).on('error', function (err) {
                console.log('Something went wrong on the request', err.malUserData.options);
            });
            client.on('error', function (err) {
                console.log('Something went wrong on the client', err);
            });
        }
        // If user was found in the database query, we need to make sure they've been updated recently
        else {
            let currentDate = new Date();
            let userLastUpdated = user.dataValues.updated_at;
            let timeDifference = Math.abs(currentDate.getTime() - userLastUpdated.getTime());
            let daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
            if(daysDifference > 5) {
                // TODO: If user was not created and did not need to be updated, we already have all their anime in the database
                callback(null, user, null)
            }
            // If user's record was older than 5 days, we make a request to MAL api and update it in the database from
            // that response
            else {
                let userName = request.body.search;
                let args = {path: {'id': userName}};
                client.get('http://myanimelist.net/malappinfo.php?u=${id}&status=all&type=anime', args, function(req, res) {
                    let malUserData = req.myanimelist.myinfo;
                    let malUserAnimeData = req.myanimelist.anime;
                    User.update(
                        { id: malUserData.user_id, name: malUserData.user_name, watching: malUserData.user_watching, completed: malUserData.user_completed,
                            on_hold: malUserData.user_onhold, dropped: malUserData.user_dropped, plan_to_watch: malUserData.user_plantowatch,
                            days_spent_watching: malUserData.user_days_spent_watching },
                        { where: { id: malUserData.user_id }}
                    ).then(user => {
                        User.findById(malUserData.user_id).then(user => {
                            callback(null, user, malUserAnimeData);
                        })
                    })
                }).on('error', function (err) {
                    console.log('Something went wrong on the request', err.malUserData.options);
                });
                client.on('error', function (err) {
                    console.log('Something went wrong on the client', err);
                });
            }
        }
    }

    /**
     * Queries the database for anime from the user's anime list.
     * @param user Query result from database
     * @param malAnimeData List of user's anime from MAL api
     * @param callback Called on success
     */
    function findAnimeInDatabase(user, malAnimeData, callback) {
        // TODO: Make sure there is an association between user/anime before moving on
        let animeList = [];
        let getAnime = function(completedRequests) {
            if(completedRequests < malAnimeData.length) {
                let animeId = malAnimeData[completedRequests].series_animedb_id;
                Anime.findOne({
                    attributes: ['id', 'link_canonical', 'synopsis', 'title', 'image', 'synonyms', 'type', 'episodes',
                        'status', 'aired', 'premiered', 'source', 'duration', 'rating', 'score', 'number_of_votes', 'ranked',
                        'popularity', 'members', 'favorites'],
                    where: { id: animeId }
                    // TODO: You took out the 'raw: true' here, so you need to change values down the road.
                }).then(anime => {
                    if(anime !== null) {
                        //If we found the anime, we should make sure we have the relationship table between the user and anime
                        // updated/created for that anime before removing it from malAnimeData
                        let myStartDate = malAnimeData[completedRequests].my_start_date === '0000-00-00' ? null : malAnimeData[completedRequests].my_start_date;
                        let myFinishDate = malAnimeData[completedRequests].my_finish_date === '0000-00-00' ? null : malAnimeData[completedRequests].my_finish_date;
                        user.addAnime(anime, { through: {
                            my_watched_episodes: malAnimeData[completedRequests].my_watched_episodes,
                            my_start_date: myStartDate,
                            my_finish_date: myFinishDate,
                            my_score: malAnimeData[completedRequests].my_score,
                            my_status: malAnimeData[completedRequests].my_status,
                            my_rewatching: malAnimeData[completedRequests].my_rewatching,
                            my_rewatching_episodes: malAnimeData[completedRequests].my_rewatching_ep,
                        }});
                        data = anime; // The raw result from the database
                        animeList.push(data.dataValues); // Pushing the data onto the anime list
                        malAnimeData.splice(completedRequests, 1); // Removing the anime that we found from the MAL array
                        getAnime(completedRequests); // No incrementing here, because there's a new value at the current index to query
                    } else {
                        getAnime(completedRequests+1); // Didn't find the anime in the database, so look for the next one
                    }
                })
            }
            else if(completedRequests === malAnimeData.length) {
                callback(null, malAnimeData, user, animeList);
            }
        };
        getAnime(0);
    }

    /**
     * Sends requests to Jikan API for anime we need in the database
     * @param malAnimeData User's list of anime with the remaining anime we need to get from Jikan
     * @param user Query result from database
     * @param animeList Query result from database
     * @param callback Called on success
     */
    function getAnimeFromJikanApi(malAnimeData, user, animeList, callback) {
        let newAnimeList = [];
        let getAnime = function(completedRequests) {
            if(completedRequests < malAnimeData.length) {
                let animeId = malAnimeData[completedRequests].series_animedb_id;
                let args = {path: {'id': animeId}};
                client.get('http://jikan.me/api/anime/${id}', args, function(jikanData, res) {
                    var data = {
                        id: animeId,
                        link_canonical: jikanData['link-canonical'],
                        synopsis: jikanData.synopsis,
                        title: jikanData.title,
                        image: jikanData.image,
                        synonyms: jikanData.synonyms,
                        type: jikanData.type,
                        episodes: jikanData.episodes,
                        status: jikanData.status,
                        aired: jikanData.aired,
                        premiered: jikanData.premiered,
                        source: jikanData.source,
                        duration: jikanData.duration,
                        rating: jikanData.rating,
                        score: jikanData.score[0],
                        number_of_votes: jikanData.score[1],
                        ranked: jikanData.ranked,
                        popularity: jikanData.popularity,
                        members: jikanData.members,
                        favorites: jikanData.favorites
                    };
                    newAnimeList.push(data);
                    getAnime(completedRequests+1);


                }).on('error', function (err) {
                    console.log('Something went wrong on the request', err.req.options);
                });
                client.on('error', function (err) {
                    console.log('Something went wrong on the client', err);
                });
            }
            else if(completedRequests === malAnimeData.length) {
                callback(null, user, animeList, newAnimeList);
            }
        };
        getAnime(0);
    }

    /**
     * Inserts remaining anime into the database
     * @param user Query result from database
     * @param animeList List of user's anime
     * @param newAnimeList List of anime needed to insert into database
     * @param callback Called on success
     */
    function insertAnimeIntoDatabase(user, animeList, newAnimeList, callback) {
        Anime.bulkCreate(newAnimeList);
    }
};