'use strict'

const requestController = require('../request/index')
const logger = require('../logging/index')
const returnError = require('../errors/index')
const format = require('../format/index')
const animeController = require('../anime/index')
const validate = require('../security/validator')
const validationResult = require('express-validator/check').validationResult

async function handleGettingAnime(username) {
    let malUser
    try {
        malUser = await requestController.requestMalUser(username)
        const animeSet = format.listToSet(malUser.myanimelist.anime)
        const animeFoundInDb = await animeController.findAnimeById(Array.from(animeSet))
        format.removeFromList(animeSet, animeFoundInDb)
        let jikanRequestResult = await requestController.handleMakingBulkJikanRequests(animeSet)
        let formattedList = format.formatAnimeListForBulkInsert(jikanRequestResult)
        let createdAnime = await animeController.bulkInsertAnime(formattedList)
        // let genreList = await format.formatGenreListForBulkInsert(jikanRequestResult)
        // formatLicensorListForBulkInsert(jikanRequestResult)
        // formatProducerListForBulkInsert(jikanRequestResult)
        // formatStudioListForBulkInsert(jikanRequestResult)
        // animeClient.bulkInsertGenre(genreList)
        // animeClient.insertGenre1()
        // animeClient.findall()
        // handle inserting all relationships
    } catch (exception) {
        logger.log('error', exception)
        return Promise.reject(returnError.unexpectedError())
    }
}

const handlePostSearch = [
    validate.validateSearchForm,
    function postUsernameSearch(request, response, next) {
        const username = request.body.user
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            response.status(200).render('index', {errors: errors.array()}) // TODO: Front-end error rendering
        } else {
            handleGettingAnime(username).then((result) => {
                console.log('done')
            }).catch((error) => {
                logger.log('error', error)
            })
            // userController.getUser(username)
            //     .then((user) => {
            //         if (!user.updatedOrCreated) {
            //             // Here's where we get the users info from the database and send it
            //         } else if (user.updatedOrCreated) {
            //             // Here's where we have to make Jikan requests and all
            //             animeController.handleGettingUserAnime(username)
            //         } else next(returnError.unexpectedError())
            //     })
            //     .catch((error) => {
            //         logger.log('error', error)
            //     })
        }
    }
]

module.exports = {
    handleGettingAnime: handleGettingAnime,
    handlePostSearch: handlePostSearch
}

//                             let myStartDate = malAnimeData[completedRequests].my_start_date === '0000-00-00'
//                                 ? null : malAnimeData[completedRequests].my_start_date;
//                             let myFinishDate = malAnimeData[completedRequests].my_finish_date === '0000-00-00'
//                                 ? null : malAnimeData[completedRequests].my_finish_date;
//                             let myRewatching = malAnimeData[completedRequests].my_rewatching === '' ? 0 : 0;
//                             // Storing all the information we'll need in this single object
//                             let animeData = {
//                                 id: animeId,
//                                 link_canonical: jikanData['link-canonical'],
//                                 synopsis: jikanData.synopsis,
//                                 title: jikanData.title,
//                                 image: jikanData.image,
//                                 synonyms: jikanData.synonyms,
//                                 type: jikanData.type,
//                                 episodes: jikanData.episodes,
//                                 status: jikanData.status,
//                                 aired: jikanData.aired,
//                                 premiered: jikanData.premiered,
//                                 source: jikanData.source,
//                                 duration: jikanData.duration,
//                                 rating: jikanData.rating,
//                                 score: jikanData.score[0],
//                                 number_of_votes: jikanData.score[1],
//                                 ranked: jikanData.ranked,
//                                 popularity: jikanData.popularity,
//                                 members: jikanData.members,
//                                 favorites: jikanData.favorites,
//                                 genre: jikanData.genre,
//                                 producer: jikanData.producer,
//                                 licensor: jikanData.licensor,
//                                 studio: jikanData.studio,
//                                 my_watched_episodes: malAnimeData[completedRequests].my_watched_episodes,
//                                 my_start_date: myStartDate,
//                                 my_finish_date: myFinishDate,
//                                 my_score: malAnimeData[completedRequests].my_score,
//                                 my_status: malAnimeData[completedRequests].my_status,
//                                 my_rewatching: myRewatching,
//                                 my_rewatching_episodes: malAnimeData[completedRequests].my_rewatching_ep
//                             };
//                             jikanAnime.push(animeData);
//                             getAnime(completedRequests+1);
//                         }
//                     Anime.findOne({
//                         attributes: ['id', 'link_canonical', 'synopsis', 'title', 'image', 'synonyms', 'type',
//                             'episodes', 'status', 'aired', 'premiered', 'source', 'duration', 'rating', 'score',
//                             'number_of_votes', 'ranked', 'popularity', 'members', 'favorites'],
//                         where: {id: animeId}
//                     }).then(anime => {
//                         if(anime !== null) {
//                             user.addAnime(anime, {through: {
//                                 my_watched_episodes: malAnimeData[completedRequests].my_watched_episodes,
//                                 my_start_date: myStartDate,
//                                 my_finish_date: myFinishDate,
//                                 my_score: malAnimeData[completedRequests].my_score,
//                                 my_status: malAnimeData[completedRequests].my_status,
//                                 my_rewatching: myRewatching,
//                                 my_rewatching_episodes: malAnimeData[completedRequests].my_rewatching_ep,
//                             }}).then(() => {
//                                 console.log('We have the anime/user relationship defined!');
//                                 malAnimeData.splice(completedRequests, 1); // Removing the found anime from the MAL array
//                                 getAnime(completedRequests); // No increment, there's a new value at the current index to query
//                             })
//                         }
//     /**
//      * Inserts anime into the database
//      * @param user Model instance from Sequelize
//      * @param jikanAnime Array list of anime objects
//      * @param callback Called on success
//      */
//     function insertAnime(user, jikanAnime, callback) {
//         // If the user was not created or updated or if there's no anime in the list, we can continue on
//         if(jikanAnime === undefined || jikanAnime === null) {
//             console.log('Still moving down the waterfall...');
//             callback(null, user, null);
//         }
//         else {
//             let insertAnimeIntoDatabase = function(completedRequests) {
//                 if(completedRequests < jikanAnime.length) {
//                     Anime.findOrCreate({
//                         where: {
//                             id: jikanAnime[completedRequests].id
//                         },
//                         defaults: {
//                             id: jikanAnime[completedRequests].id,
//                             link_canonical: jikanAnime[completedRequests].link_canonical,
//                             synopsis: jikanAnime[completedRequests].synopsis,
//                             title: jikanAnime[completedRequests].title,
//                             image: jikanAnime[completedRequests].image,
//                             synonyms: jikanAnime[completedRequests].synonyms,
//                             type: jikanAnime[completedRequests].type,
//                             episodes: jikanAnime[completedRequests].episodes,
//                             status: jikanAnime[completedRequests].status,
//                             aired: jikanAnime[completedRequests].aired,
//                             premiered: jikanAnime[completedRequests].premiered,
//                             source: jikanAnime[completedRequests].source,
//                             duration: jikanAnime[completedRequests].duration,
//                             rating: jikanAnime[completedRequests].rating,
//                             score: jikanAnime[completedRequests].score,
//                             number_of_votes: jikanAnime[completedRequests].number_of_votes,
//                             ranked: jikanAnime[completedRequests].ranked,
//                             popularity: jikanAnime[completedRequests].popularity,
//                             members: jikanAnime[completedRequests].members,
//                             favorites: jikanAnime[completedRequests].favorites
//                         },
//                     }).spread( function(anime, created) {
//                         console.log('Inserted an anime!');
//                         let myStartDate = jikanAnime[completedRequests].my_start_date === '0000-00-00'
//                             ? null : jikanAnime[completedRequests].my_start_date;
//                         let myFinishDate = jikanAnime[completedRequests].my_finish_date === '0000-00-00'
//                             ? null : jikanAnime[completedRequests].my_finish_date;
//                         let myRewatching = jikanAnime[completedRequests].my_rewatching === '' ? 0 : 0;
//                         user.addAnime(anime, {through: {
//                             my_watched_episodes: jikanAnime[completedRequests].my_watched_episodes,
//                             my_start_date: myStartDate,
//                             my_finish_date: myFinishDate,
//                             my_score: jikanAnime[completedRequests].my_score,
//                             my_status: jikanAnime[completedRequests].my_status,
//                             my_rewatching: myRewatching,
//                             my_rewatching_episodes: jikanAnime[completedRequests].my_rewatching_ep,
//                         }}).then(function() {
//                             console.log('Inserted anime/user relationship!');
//                             insertAnimeIntoDatabase(completedRequests+1)
//                         })
//                     })
//                 }
//                 else {
//                     console.log('Done inserting all anime!');
//                     callback(null, user, jikanAnime)
//                 }
//             };
//             insertAnimeIntoDatabase(0);
//         }
//     }
//
//     /**
//      * Inserts genre into the database and any relationship between anime/genre
//      * @param user Model instance from Sequelize
//      * @param jikanAnime Array list of anime objects
//      * @param callback Called on success
//      */
//     function insertGenre(user, jikanAnime, callback) {
//         // If the user was not created or updated, we already have all their anime in the database
//         if(jikanAnime === undefined || jikanAnime === null) {
//             console.log("Still moving down the waterfall...");
//             callback(null, user, null)
//         }
//         else {
//             let relationshipGenre = [];
//             let genreList = [];
//             let makeGenreList = function(completedRequests) {
//                 if(completedRequests < jikanAnime.length) {
//                     console.log("Making genre lists...");
//                     console.log(jikanAnime[completedRequests].genre)
//                     uniqueListCreator(genreList, jikanAnime[completedRequests].genre);
//
//                     console.log("Initial Array: ");
//                     console.log(relationshipGenre);
//                     console.log("Id: " + jikanAnime[completedRequests].id);
//                     console.log("data: ");
//                     console.log(jikanAnime[completedRequests].genre)
//
//
//                     relationshipTableListCreator(relationshipGenre, jikanAnime[completedRequests].id,
//                         jikanAnime[completedRequests].genre, 'fk_anime_id_anime_genre', 'fk_genre_id');
//                     makeGenreList(completedRequests+1);
//                 }
//                 else {
//                     console.log("Inserting genre into table...");
//                     let insertAnimeGenreRelationship = function(completedRequests) {
//                         if(completedRequests < relationshipGenre.length) {
//                             console.log("Inserting anime/genre relationship into table...");
//                             Genre.findOrCreate({
//                                 where: {name: relationshipGenre[completedRequests].fk_genre_id }
//                             }).spread((genre,created) => {
//                                 Anime.findOne({
//                                     where: {id: relationshipGenre[completedRequests].fk_anime_id_anime_genre}
//                                 }).then(anime => {
//                                     genre.addAnime(anime).then(insertAnimeGenreRelationship(completedRequests+1))
//                                 })
//                             })
//                         }
//                         else {
//                             console.log("Done inserting all genre!")
//                             callback(null, user, jikanAnime);
//                         }
//                     };
//                     Genre.bulkCreate(genreList, { ignoreDuplicates: true }).then(insertAnimeGenreRelationship(0));
//                 }
//             };
//             makeGenreList(0);
//         }
//     }
//
//     /**
//      * Inserts producer(s) into the database and any relationship between anime/producer
//      * @param user Model instance from Sequelize
//      * @param jikanAnime Array list of anime objects
//      * @param callback Called on success
//      */
//     /**
//      * Queries the database for all information needed, which is currently anime, genre, and related
//      * relationship tables
//      * @param user Model instance from Sequelize
//      * @param callback Called on success
//      */
//     function getInformationFromDatabase(user, callback) {
//         let genre = [];
//         Anime.findAll({
//             include: [{
//                 model: User,
//                 where: {id: user.dataValues.id}
//             }]
//         }).then(anime => {
//             let getGenre = function(completedRequests) {
//                 if(completedRequests < anime.length) {
//                     Genre.findAll({
//                         include: [{
//                             model: Anime,
//                             where: {id: anime[completedRequests].dataValues.id}
//                         }]
//                     }).then(result => {
//                         genre.push(result);
//                         getGenre(completedRequests+1)
//                     })
//                 }
//                 else {
//                     callback(null, user, anime, genre)
//                 }
//             };
//             getGenre(0);
//         })
//     }
//
//     /**
//      * Turns data into meangingful information (e.g. total days spent watching anime, most watched genre, etc.)
//      * @param user Model instance from Sequelize
//      * @param anime List of model instances from Sequelize
//      * @param genre List of model instances from Sequelize
//      * @param callback Called on success
//      */
//     function processInformation(user, anime, genre, callback) {
//         let userData ={}; // JSON object to hold all user's data for response
//         var genreII = {}; // Holds all genre on user's anime list
//         var premiered = {}; // Holds all premiered dates on user's anime list
//         var monthII = {}; // Holds all months user watched anime on their list
//         var totalPremiered; // Total of all premiered instances summed
//         var totalGenre; // Total of all genre instances summed
//         var totalMonth; // Total of all month instances summed
//
//         // Setting some values in the user object
//         userData['name'] = user.dataValues.name;
//         userData['currently_watching'] = user.dataValues.watching;
//         userData['completed'] = user.dataValues.completed;
//         userData['on_hold'] = user.dataValues.on_hold;
//         userData['dropped'] = user.dataValues.dropped;
//         userData['plan_to_watch'] = user.dataValues.plan_to_watch;
//         userData['days_spent_watching'] = user.dataValues.days_spent_watching;
//         userData['total_anime'] = anime.length;
//
//         // Setting these values to 0 initially
//         var totalRatedAnime = 0;
//         var totalWatchedEpisodes = 0;
//         var meanScore = 0;
//         var meanGlobalScore = 0;
//
//         // Name of all months
//         let monthNames = ["January", "February", "March", "April", "May", "June",
//             "July", "August", "September", "October", "November", "December"];
//
//         // Iterates through the anime list, adding up total watched episodes and mean global/user scores
//         let getTotalWatchedEpisodesAndMeanScores = function(completedRequests) {
//             if(completedRequests < anime.length) {
//                 if(anime[completedRequests].dataValues.users[0].user_anime.my_score !== 0) {
//                     totalRatedAnime++;
//                     meanGlobalScore += anime[completedRequests].dataValues.score;
//                     meanScore += anime[completedRequests].dataValues.users[0].user_anime.my_score;
//                 }
//                 totalWatchedEpisodes += anime[completedRequests].dataValues.users[0].user_anime.my_watched_episodes;
//                 getTotalWatchedEpisodesAndMeanScores(completedRequests+1);
//             }
//             else {
//                 meanScore = meanScore/totalRatedAnime;
//                 meanGlobalScore = meanGlobalScore/totalRatedAnime;
//             }
//         };
//         getTotalWatchedEpisodesAndMeanScores(0);
//         userData['mean_score'] = meanScore.toFixed(2);
//         userData['mean_global_score'] = meanGlobalScore.toFixed(2);
//
//         // Makes a list of genre with no duplicate keys and a value of each key occurrence in the original list
//         for(let i = 0; i < genre.length; i++) {
//             for(let j = 0; j < genre[i].length; j++) {
//                 genreII[genre[i][j].dataValues.name] = (genreII[genre[i][j].dataValues.name] || 0) + 1;
//             }
//         }
//         genreII = sortProperties(genreII, true);
//         totalGenre = sumProperties(genreII);
//         let mostWatchedPercent = genreII[0][1]/totalGenre * 100;
//         userData['most_watched_genre'] = genreII[0][0];
//         userData['most_watched_genre_percent'] = mostWatchedPercent.toFixed(0);
//
//         // Makes a list of premiered with no duplicate kets abd a value of each key occurrence in the original list
//         for(let i = 0; i < anime.length; i++) {
//             if(anime[i].premiered !== null) {
//                 premiered[anime[i].premiered] = (premiered[anime[i].premiered] || 0) + 1;
//             }
//             else {
//                 i++;
//             }
//         }
//         premiered = sortProperties(premiered, true);
//         totalPremiered = sumProperties(premiered);
//         let mostWatchedPremiered = premiered[0][1]/totalPremiered * 100;
//         userData['most_watched_premiered'] = premiered[0][0];
//         userData['most_watched_premiered_percent'] = mostWatchedPremiered.toFixed(0);
//
//         for(let i = 0; i < anime.length; i++) {
//             if(anime[i].dataValues.users[0].user_anime.my_start_date !== null) {
//                 var date = new Date(anime[i].dataValues.users[0].user_anime.my_start_date);
//                 var month = monthNames[date.getMonth()];
//                 monthII[month] = (monthII[month] || 0) + 1;
//             }
//             else {
//                 i++;
//             }
//         }
//         monthII = sortProperties(monthII, true);
//         if(monthII.length !== 0) {
//             totalMonth = sumProperties(monthII);
//             let mostWatchedMonth = monthII[0][1]/totalMonth * 100;
//             userData['most_watched_month'] = monthII[0][0];
//             userData['most_watched_month_percent'] = mostWatchedMonth.toFixed(0);
//         }
//         console.log("Done!");
//         callback(null, userData);
//     }
//
// };
//
// /**
//  * Creates a list in the format of relationship tables (e.g. {key: 'value', other_key: 'value'})
//  * @param array Array that we will hold all formatted values
//  * @param animeId Key for objects
//  * @param data Data that needs to be formatted for array
//  * @param animeIdFk Foreign key for anime id, unique to particular table/list
//  * @param fk Foreign key, unique to particular table/list
//  */
// function relationshipTableListCreator(array, animeId, data, animeIdFk, fk) {
//     // If the data has more than one element
//     if(data[0].length === 2) {
//         for(var i in data) {
//             let element = data[i] + '';
//             let elementArray = element.split(','); // Splitting the element at the ',', making it into an array
//             let elementName = elementArray[1]; // We only need index one of the array, which has the name
//             let obj = {};
//             obj[animeIdFk] = animeId;
//             obj[fk] = elementName.replace('</a>  </div>','');
//             array.push(obj);
//         }
//     }
//     // If the data only has one element
//     else {
//         let element = data + '';
//         let elementArray = element.split(','); // Splitting the element at the ',', making it into an array
//         let elementName = elementArray[1]; // We only need index one of the array, which has the name
//         let obj = {};
//         obj[animeIdFk] = animeId;
//         obj[fk] = elementName.replace('</a>  </div>','');
//         array.push(obj);
//     }
// }
//
// /**
//  * Returns a list with no duplicate values
//  * @param array Array that will hold all values
//  * @param data Elements to add to the array
//  */
// function uniqueListCreator(array, data) {
//     // TODO: Add in logic to remove duplicate values
//     // If the data has more than one element
//     if(data[0].length === 2) {
//         for(var i in data) {
//             let element = data[i] + '';
//             let elementArray = element.split(',');
//             let elementName = elementArray[1];
//             let elementJikanId = elementArray[0];
//             let obj = {};
//             obj['name'] = elementName.replace('</a>  </div>','');
//             obj['jikan_id'] = elementJikanId;
//             array.push(obj);
//         }
//     }
//     // If the data only has one element
//     else {
//         let element = data + '';
//         let elementArray = element.split(',');
//         let elementName = elementArray[1];
//         let elementJikanId = elementArray[0];
//         let obj = {};
//         obj['name'] = elementName.replace('</a>  </div>', '');
//         obj['jikan_id'] = elementJikanId;
//         array.push(obj);
//     }
// }
//
// /**
//  * Returns a list in descending values, sorted by values
//  * @param object List to be sorted
//  * @param isNumericSort Boolean true if objects are sorted numerically
//  * @returns {Array}
//  */
// function sortProperties(object, isNumericSort) {
//     isNumericSort = isNumericSort || false;
//     var sortable = [];
//     for(var key in object)
//         if(object.hasOwnProperty(key))
//             sortable.push([key, object[key]]);
//     if(isNumericSort)
//         sortable.sort(function(a, b) {
//             return b[1]-a[1];
//         });
//     else
//         sortable.sort(function(a, b)
//         {
//             var x = a[1].toLowerCase(),
//                 y = b[1].toLowerCase();
//             return x < y ? -1 : x > y ? 1 : 0;
//         });
//     return sortable;
// }
//
// /**
//  * Returns a sum of values in an array
//  * @param array Array to be summed
//  * @returns {number}
//  */
// function sumProperties(array) {
//     var sum = 0;
//     for(var i = 0; i < array.length; i++){
//         sum += array[i][1];
//     }
//     return sum;
// }
