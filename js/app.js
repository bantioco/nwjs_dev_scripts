$(document).ready(function(){

    load_data_details();
    load_data_list();

    // BT add data
    $('body').on('click', '.bt-add-data', function(e){

        e.stopPropagation();
        load_add_data();

        $(this).css({
            '-webkit-transform':'rotate(45deg)',
            '-ms-transform':'rotate(45deg)',
            'transform':'rotate(45deg)',
            'color':'#c0392b',
            '-webkit-transition':'transform 0.5s, color 1s',
            'transition':'transform 0.5s, color 1s'
        }).addClass('bt-add-data-close').removeClass('bt-add-data');

        $('body').on('click', '.bt-add-data-close', function(e){
            $('#add_data_bloc').remove();
            $(this).css({
                '-webkit-transform':'rotate(0deg)',
                '-ms-transform':'rotate(0deg)',
                'transform':'rotate(0deg)',
                'color':'#2c3e50',
                '-webkit-transition':'transform 0.5s, color 1s',
                'transition':'transform 0.5s, color 1s'
            }).removeClass('bt-add-data-close').addClass('bt-add-data');

            load_data_details()

        });
    });

    // Load data list
    function load_data_list(){
        $.post('./load/load_data_list.html', function( datalist ){ $('.js-load-data-list').html( datalist ); });
    }

    // Load data page
    function load_data_details(){
        $.post('./load/load_data.html', function( datadetail ){ $('.js-load-page').html( datadetail ); });
    }

    // Load add_data page
    function load_add_data(){
        $.post('./load/load_add_data.html', function( dataadd ){ $('.js-load-page').html( dataadd ); });
    }


    $('#data_search').on('keyup', function(){
        var data_search = $(this).val();
        if( data_search.length >= 3 ){
            //console.log(data_search);
            $.post('./load/load_search_result.html', function( dataresult ){ $('.js-load-data-list').html( dataresult ); });

            $.getJSON( 'data/data_scripts.json',function( getdata ){
                $.each( getdata.data, function( key, val ) {
                    var valtext = val.text;
                    //console.log( valtext.indexOf( data_search ) )
                    if (valtext.indexOf( data_search ) >= 0 ){
                        console.log( val.title );
                        var bloc_list =
                            "<div id='bloclist_" + key + "' class='bloc-list'>"+
                                "<div class='bloc-list-icon'><i class='devicon-" +val.category+ "-plain colored'></i></div>"+
                                "<div class='bloc-list-text'>"+
                                    "<div class='bloc-list-title'>" + val.title + "</div>"+
                                    "<div class='bloc-list-category'>" + val.category + "</div>"+
                                "</div>"+
                            "</div>";
                        $('.append-data').prepend( bloc_list );
                    }
                });
            });

            setTimeout(function(){
                $('.bloc-list').on('click', function( e ){
                    $('.bloc-list').removeClass('selected-list');
                    $('.selected-list-view').remove();
                    $(this).addClass('selected-list');
                    $(this).append('<div class="selected-list-view"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></div>')
                    $.post('./load/load_data.html', function( datadetail ){ $('.js-load-page').html( datadetail ); });
                })
            },1000);

        }
        else if( data_search.length <= 2 ){
          load_data_list();
        }
    })



});
