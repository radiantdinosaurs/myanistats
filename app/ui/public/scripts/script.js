$(function() {
    $('#loading-overlay').hide() // Hiding the loading overlay
    $('#search-submit-btn').click(function(e) {
        e.preventDefault()
        let user = $('#search').val()
        $.ajax({
            type: 'POST',
            url: '/',
            data: {user: user},
            xhrFields: {withCredentials: false},
            headers: {},
            // beforeSend: function(){$('#loading-overlay').show();},
            complete: function() { $('#loading-overlay').hide() },
            success: function(data) {
                $('#landing-page-content').hide() // Hiding any content on the page that isn't user stats
                let source = $('#user-results').html()
                let template = Handlebars.compile(source)
                let userStats = template({
                    title: data.name,
                    mean_score: data.mean_score,
                    mean_global_score: data.mean_global_score,
                    genre_percent: data.most_watched_genre_percent,
                    most_watched_genre: data.most_watched_genre,
                    premiered_percent: data.most_watched_premiered_percent,
                    most_watched_premiered: data.most_watched_premiered,
                    most_watched_month: data.most_watched_month,
                    most_watched_month_percent: data.most_watched_month_percent
                })
                $('.hbs-container').prepend(userStats)

                // let userBasicStats = {
                //     labels: [
                //         'Completed',
                //         'Currently Watching',
                //         'Dropped',
                //         'On Hold',
                //         'Plan to Watch'],
                //     datasets: [{
                //         data: [
                //             data.completed,
                //             data.currently_watching,
                //             data.dropped,
                //             data.on_hold,
                //             data.plan_to_watch],
                //         backgroundColor: [
                //             'rgba(255, 99, 132, 0.2)',
                //             'rgba(54, 162, 235, 0.2)',
                //             'rgba(255, 206, 86, 0.2)',
                //             'rgba(75, 192, 192, 0.2)',
                //             'rgba(153, 102, 255, 0.2)'],
                //         borderColor: [
                //             'rgba(250, 250, 250, 1)',
                //             'rgba(250, 250, 250, 1)',
                //             'rgba(250, 250, 250, 1)',
                //             'rgba(250, 250, 250, 1)',
                //             'rgba(250, 250, 250, 1)'],
                //         hoverBackgroundColor: [
                //             'rgba(255, 99, 132, 0.2)',
                //             'rgba(54, 162, 235, 0.2)',
                //             'rgba(255, 206, 86, 0.2)',
                //             'rgba(75, 192, 192, 0.2)',
                //             'rgba(153, 102, 255, 0.2)'],
                //         hoverBorderColor: [
                //             'rgba(250, 250, 250, 1)',
                //             'rgba(250, 250, 250, 1)',
                //             'rgba(250, 250, 250, 1)',
                //             'rgba(250, 250, 250, 1)',
                //             'rgba(250, 250, 250, 1)'],
                //         borderWidth: 1}]
                // }
                // let ctx = document.getElementById('userBasicStatsDoughnutChart')
                // let userBasicStatsDoughnutChart = new Chart(ctx, {
                //     type: 'doughnut',
                //     data: userBasicStats,
                //     options: {
                //         legend: {
                //             position: 'top'
                //         }
                //     }
                // })
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest)
                console.log(textStatus)
                console.log(errorThrown)
            }
        })
    })
})
