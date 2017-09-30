$(document).ready(function(){
    $('#loading-overlay').hide();
    $('#search-submit-btn').click(function(e) {
        e.preventDefault();
        let user = $('#search').val();
        $.ajax({
            type: 'POST',
            url: '/',
            data: {user: user},
            xhrFields: {withCredentials: false},
            headers: {},
            beforeSend: function(){$('#loading-overlay').show();},
            complete: function(){$('#loading-overlay').hide();},
            success: function(data) {
                $('#default-content').hide();
                console.log(data);
                var source = $('#user-results').html();
                var template = Handlebars.compile(source);
                var html = template({
                    title: data.name,
                    days_spent_watching: data.days_spent_watching,
                });
                $('.hbs-container').prepend(html);


                userBasicStats = {
                    labels: [
                        'Completed',
                        'Currently Watching',
                        'Dropped',
                        'On Hold',
                        'Plan to Watch'
                    ],
                    datasets: [{
                        data: [data.completed, data.currently_watching, data.dropped, data.on_hold,
                        data.plan_to_watch],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(250, 250, 250, 1)',
                            'rgba(250, 250, 250, 1)',
                            'rgba(250, 250, 250, 1)',
                            'rgba(250, 250, 250, 1)',
                            'rgba(250, 250, 250, 1)'
                        ],
                        borderWidth: 1
                    }]
                };
                var ctx = document.getElementById("myChart");
                var myDoughnutChart = new Chart(ctx, {
                    type: 'pie',
                    data: userBasicStats
                });

                genreStarts = {
                    labels: [
                        'Completed',
                        'Currently Watching',
                        'Dropped',
                        'On Hold',
                        'Plan to Watch'
                    ],
                    datasets: [{
                        data: [data.completed, data.currently_watching, data.dropped, data.on_hold,
                            data.plan_to_watch],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(250, 250, 250, 1)',
                            'rgba(250, 250, 250, 1)',
                            'rgba(250, 250, 250, 1)',
                            'rgba(250, 250, 250, 1)',
                            'rgba(250, 250, 250, 1)'
                        ],
                        borderWidth: 1
                    }]
                };
                var ctx = document.getElementById("myChart2");
                var myDoughnutChart2 = new Chart(ctx, {
                    type: 'pie',
                    data: genreStarts
                });



            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }});
    });
});