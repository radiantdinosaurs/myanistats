var Sequelize = require('sequelize');
var sequelize = require('../data/sequelizeDatabase');
var Producer = require('../models/producer');
var Studio = require('../models/studio');
var Genre = require('../models/genre');
var Licensor = require('../models/licensor');
var Anime = require('../models/anime');
var User = require('../models/user');
var animeGenre = require('../models/animeGenre');
var async = require('async');
var client = require('node-rest-client').Client;
var client = new client();


exports.post_user = function(request, response, next) {
    let userName = request.body.search;
    var args = { path: { 'id': userName }};
    client.get('http://myanimelist.net/malappinfo.php?u=${id}&status=all&type=anime', args, function(data, res) {
        async.series([
            function(callback) {
                User.findOrCreate({
                    where: {
                        id: data.myanimelist.myinfo.user_id
                    },
                    defaults: {
                        id: data.myanimelist.myinfo.user_id,
                        name: data.myanimelist.myinfo.user_name,
                        watching: data.myanimelist.myinfo.user_watching,
                        completed: data.myanimelist.myinfo.user_completed,
                        on_hold: data.myanimelist.myinfo.user_onhold,
                        dropped: data.myanimelist.myinfo.user_dropped,
                        plan_to_watch: data.myanimelist.myinfo.user_plantowatch,
                        days_spent_watching: data.myanimelist.myinfo.user_days_spent_watching
                        }
                }).spread((user, created) => {
                    callback(created);
                })
            },
            function(callback) {
                let processAnime = function(i) {
                    if(i < data.myanimelist.anime.length) {
                        let animeId = data.myanimelist.anime[i].series_animedb_id;
                        client.get('http://jikan.me/api/anime/' + animeId, args, function(jikanData, res) {
                            Anime.findOrCreate({
                                where: {
                                    id: animeId,
                                },
                                defaults: {
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
                                }
                            });
                            processAnime(i+1);
                        }).on('error', function (err) {
                            console.log('Something went wrong on the request', err.request.options);
                        });
                        client.on('error', function (err) {
                            console.error('Something went wrong on the client', err);
                        });
                    }
                };
                processAnime(0);
                callback();
            }
        ], function(err) {
            if(err) return next(err);
            response.render('user-stats', {
                picture: null,
                name: data.myanimelist.myinfo.user_name,
                days_spent_watching: data.myanimelist.myinfo.user_days_spent_watching,
                watching: data.myanimelist.myinfo.user_watching,
                completed: data.myanimelist.myinfo.user_completed,
                onhold: data.myanimelist.myinfo.user_onhold,
                dropped: data.myanimelist.myinfo.user_dropped,
                plan_to_watch: data.myanimelist.myinfo.user_plantowatch
            })
        })
    });
};

//     //Average score
//     var scoreTotal = 0;
//     var totalAnimeScored = 0;
//     for(var i = 0; i < user.myanimelist.anime.length; i++) {
//       if(user.myanimelist.anime[i].my_score != 0) {
//         totalAnimeScored += 1;
//       }
//       scoreTotal += parseFloat(user.myanimelist.anime[i].my_score);
//     }
//     //End average score
//     averageScore = scoreTotal/totalAnimeScored;