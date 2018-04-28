'use strict'

function insertGenre() {
    Genre.findOrCreate({
        where: {name: 'Action'}}).spread((genre, created) => {
        Anime.findOne({where: {id: 36949}}).then(anime => {
            genre.addAnime(anime).then((result) => console.log(result))
        })
    })
}
