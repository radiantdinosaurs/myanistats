'use strict'

const sequelize = require('./connection')

function associations() {
    const Anime = require('../anime/anime')
    const User = require('../user/user')
    const Genre = require('../associations/genre')
    const UserAnime = require('../associations/user-anime')
    const AnimeGenre = require('../associations/anime-genre')
    const AnimeLicensor = require('../associations/anime-licensor')
    const AnimeStudio = require('../associations/anime-studio')
    const AnimeProducer = require('../associations/anime-producer')
    const Producer = require('../associations/producer')
    const Studio = require('../associations/studio')
    const Licensor = require('../associations/licensor')
    AnimeGenre.removeAttribute('id')
    AnimeLicensor.removeAttribute('id')
    AnimeStudio.removeAttribute('id')
    AnimeProducer.removeAttribute('id')

    Anime.belongsToMany(User, {through: {model: UserAnime, unique: false}, foreignKey: 'fk_anime_id_user_anime'})
    Anime.belongsToMany(Genre, {through: {model: AnimeGenre, unique: false}, foreignKey: 'fk_anime_id_anime_genre'})
    Anime.belongsToMany(Producer, {through: {model: AnimeProducer, unique: false}, foreignKey: 'fk_anime_id_anime_producer'})
    Anime.belongsToMany(Licensor, {through: {model: AnimeLicensor, unique: false}, foreignKey: 'fk_anime_id_anime_licensor'})
    Anime.belongsToMany(Studio, {through: {model: AnimeStudio, unique: false}, foreignKey: 'fk_anime_id_anime_studio'})
    User.belongsToMany(Anime, {through: {model: UserAnime, unique: false}, foreignKey: 'fk_user_id_user_anime'})
    Genre.belongsToMany(Anime, {through: {model: AnimeGenre, unique: false}, foreignKey: 'fk_genre_id'})
    Producer.belongsToMany(Anime, {through: {model: AnimeProducer, unique: false}, foreignKey: 'fk_producer_id'})
    Licensor.belongsToMany(Anime, {through: {model: AnimeLicensor, unique: false}, foreignKey: 'fk_licensor_id'})
    Studio.belongsToMany(Anime, {through: {model: AnimeStudio, unique: false}, foreignKey: 'fk_studio_id'})

    sequelize.sync()
}

module.exports = {
    tableRelationships: associations
}
