$(document).ready(function() {

    $('.voting-item').each(function(){
        $(this).magnificPopup({
            delegate: '.voting-item-photo a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function(item) {
                    return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
                }
            }
        });
    });

    $('.voting-item-photos').slick({
        dots: false,
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 2,
        adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 1,
                    variableWidth: true,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('body').on('click', '.voting-item-ctrl', function() {
        var curItem = $(this);
        if (curItem.hasClass('checked')) {
            curItem.removeClass('checked');
            var curId = curItem.data('id');
            var curResult = $('.voting-result').eq(0);
            $('.voting-result').each(function() {
                var thisResult = $(this);
                if (thisResult.find('.voting-result-input input').val() == curId) {
                    curResult = thisResult;
                }
            });
            curResult.removeClass('checked');
            curResult.find('.voting-result-number').html('');
            curResult.find('.voting-result-input input').val('');
            curResult.find('.voting-result-preview-inner').html('');
        } else {
            if (!curItem.hasClass('disabled')) {
                curItem.addClass('checked');
                var newResult = $('.voting-result:not(.checked)').eq(0)
                newResult.addClass('checked');
                newResult.find('.voting-result-number').html(curItem.data('title'));
                newResult.find('.voting-result-input input').val(curItem.data('id'));
                newResult.find('.voting-result-preview-inner').html('<img src="' + curItem.data('preview') + '" alt="" />');
            }
        }
        checkVotingCount();
    });

    $('body').on('click', '.voting-result-remove', function(e) {
        $('.voting-result.gallery-active').removeClass('gallery-active');
        $('.voting-result.mobile-active').removeClass('mobile-active');
        $('html').removeClass('gallery-open');

        var curResult = $(this).parents().filter('.voting-result');
        var curId = curResult.find('.voting-result-input input').val();
        var curItem = $('.voting-item-ctrl[data-id="' + curId + '"]');
        curItem.removeClass('checked');

        curResult.removeClass('checked');
        curResult.find('.voting-result-number').html('');
        curResult.find('.voting-result-input input').val('');
        curResult.find('.voting-result-preview-inner').html('');

        checkVotingCount();

        e.preventDefault();
    });

    $('body').on('click', '.voting-result-scroll', function(e) {
        $('.voting-result.gallery-active').removeClass('gallery-active');
        $('html').removeClass('gallery-open');

        var curResult = $(this).parents().filter('.voting-result');
        var curId = curResult.find('.voting-result-input input').val();
        var curItem = $('.voting-item-ctrl[data-id="' + curId + '"]').parents().filter('.voting-item');
        $('html, body').animate({scrollTop: curItem.offset().top - 50});

        e.preventDefault();
    });

    $('body').on('click', '.voting-gallery-close a', function(e) {
        $('.voting-result.gallery-active').removeClass('gallery-active');
        $('html').removeClass('gallery-open');

        e.preventDefault();
    });

    $('body').on('click', '.voting-result-gallery', function(e) {
        var curLink = $(this);
        var curResult = curLink.parents().filter('.voting-result');
        var curId = curResult.find('.voting-result-input input').val();
        var curItem = $('.voting-item-ctrl[data-id="' + curId + '"]').parents().filter('.voting-item');
        if (curResult.hasClass('gallery-active')) {
            curResult.removeClass('gallery-active');
            $('html').removeClass('gallery-open');
        } else {
            $('.voting-result.gallery-active').removeClass('gallery-active');
            curResult.addClass('gallery-active');
            $('html').addClass('gallery-open');
            var curTop = $('header').outerHeight() - $(window).scrollTop();
            if ($('.mega-menu').hasClass('desktopTopFixed')) {
                curTop = $('.menu-list-items').outerHeight();
            }
            if (curTop < 0) {
                curTop = 0;
            }
            $('.voting-gallery').css({'top': curTop});
            $('.voting-gallery-title').html(curItem.find('.voting-item-title').html());
            var maxHeight = $('.voting-gallery').outerHeight() - $('.voting-gallery-header').outerHeight() - 95;
            var newList = '';
            curItem.find('.voting-item-photo').each(function() {
                newList += '<div class="voting-gallery-item"><div class="voting-gallery-item-inner" style="max-height:' + maxHeight + 'px"><img src="' + $(this).data('big') + '" alt="" /></div></div>';
            });
            if ($('.voting-gallery-list').hasClass('slick-slider')) {
                $('.voting-gallery-list').slick('unslick');
            }
            $('.voting-gallery-list').html(newList);
            $('.voting-gallery-list').slick({
                dots: false,
                infinite: false,
                slidesToShow: 3,
                slidesToScroll: 3,
                adaptiveHeight: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>',
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 1,
                            centerMode: true,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        }

        e.preventDefault();
    });

    function checkVotingCount() {
        if ($('.voting-item-ctrl.checked').length == 5) {
            $('.voting-item-ctrl:not(.checked)').addClass('disabled');
            $('.voting-submit input').prop('disabled', false);
        } else {
            $('.voting-item-ctrl:not(.checked)').removeClass('disabled');
            $('.voting-submit input').prop('disabled', true);
        }
    }

    $(window).on('load resize scroll', function() {
        if ($('.voting-results').length > 0) {
            var curBlock = $('.voting-results');
            var curScroll = $(window).scrollTop();
            var curHeight = $(window).height();
            var curFooterTop = $('footer').offset().top - curScroll - curHeight;
            if (curFooterTop < 0) {
                curBlock.css({'bottom': -curFooterTop});
            } else {
                curBlock.css({'bottom': 0});
            }
        }

        $('.voting-result.gallery-active').removeClass('gallery-active');
        $('html').removeClass('gallery-open');
    });

    $('body').on('click', '.voting-results-open-mobile-link', function() {
        $('.voting-results').toggleClass('open-mobile');
    });

    $('body').on('click', '.voting-result-preview-inner', function() {
        var curResult = $(this).parents().filter('.voting-result');
        if (curResult.hasClass('mobile-active')) {
            curResult.removeClass('mobile-active');
        } else {
            $('.voting-result.mobile-active').removeClass('mobile-active');
            curResult.addClass('mobile-active');
        }
    });

});