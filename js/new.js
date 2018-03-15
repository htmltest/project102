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

    $('body').on('click', '.voting-gallery-close a, .voting-gallery-preview-close', function(e) {
        $('.voting-result.gallery-active').removeClass('gallery-active');
        $('html').removeClass('gallery-open');

        e.preventDefault();
    });

    $('body').on('click', '.voting-gallery-preview-item', function(e) {
        var curItem = $(this);
        var curList = curItem.parent();
        var curIndex = curList.find('.voting-gallery-preview-item').index(curItem);
        $('.voting-gallery-list').slick('slickGoTo', curIndex);
    });

    $('body').on('mousewheel', '.voting-gallery-item-inner', function(event) {
        var curItem = $(this);
        var curSize = Number(curItem.attr('data-curSize'));
        if (event.deltaY < 0) {
            curSize -= .1;
            if (curSize < 1) {
                curSize = 1;
            }
        } else {
            curSize += .1;
            if (curSize > 2) {
                curSize = 2;
            }
        }
        curItem.attr('data-curSize', curSize);
        var curImg = curItem.find('img');
        curImg.css({'width': 1000 * curSize});
        var curTop = Number(curImg.css('top').replace(/px/, ''));
        if (curTop > 0) {
            curTop = 0;
        }
        var curHeight = curImg.outerHeight();
        var maxHeight = curItem.height();
        var maxTop = curHeight - maxHeight;
        if (curTop < -maxTop) {
            curTop = -maxTop;
        }
        curImg.css({'top': curTop});
    });

    var timerMove = null;

    $('body').on('mouseover', '.voting-gallery-item-bottom', function() {
        var curItem = $(this).parent();
        var curImg = curItem.find('img');
        timerMove = window.setInterval(function() {
            var curTop = Number(curImg.css('top').replace(/px/, ''));
            var curHeight = curImg.outerHeight();
            var curSize = Number(curItem.attr('data-curSize'));
            var maxHeight = curItem.height();

            curTop -= 100 * curSize;
            if (curTop > 0) {
                curTop = 0;
            }
            var maxTop = curHeight - maxHeight;
            if (curTop < -maxTop) {
                curTop = -maxTop;
            }
            curImg.animate({'top': curTop}, 100, 'linear');
        }, 100);
    });

    $('body').on('mouseout', '.voting-gallery-item-bottom', function() {
        window.clearInterval(timerMove);
        timerMove = null;
    });

    $('body').on('mouseover', '.voting-gallery-item-top', function() {
        var curItem = $(this).parent();
        var curImg = curItem.find('img');
        timerMove = window.setInterval(function() {
            var curTop = Number(curImg.css('top').replace(/px/, ''));
            var curHeight = curImg.outerHeight();
            var curSize = Number(curItem.attr('data-curSize'));
            var maxHeight = curItem.height();

            curTop += 100 * curSize;
            if (curTop > 0) {
                curTop = 0;
            }
            curImg.animate({'top': curTop}, 100, 'linear');
        }, 100);
    });

    $('body').on('mouseout', '.voting-gallery-item-top', function() {
        window.clearInterval(timerMove);
        timerMove = null;
    });

    var startY = 0;

    $('body').on('mousedown', '.voting-gallery-item img', function(event) {
        $('html').addClass('voting-gallery-mousedown');
        startY = event.pageY;
    });

    $('body').on('mouseup', '.voting-gallery-item img', function() {
        $('html').removeClass('voting-gallery-mousedown');
    });

    $('body').on('mousemove', '.voting-gallery-item img', function(event) {
        if ($('html').hasClass('voting-gallery-mousedown')) {
            var moveY = event.pageY - startY;
            startY = event.pageY;
            var curItem = $(this).parent().parent();
            var curImg = curItem.find('img');
            var curTop = Number(curImg.css('top').replace(/px/, ''));
            var curHeight = curImg.outerHeight();
            var curSize = Number(curItem.attr('data-curSize'));
            var maxHeight = curItem.height();

            curTop += moveY;
            if (curTop > 0) {
                curTop = 0;
            }
            var maxTop = curHeight - maxHeight;
            if (curTop < -maxTop) {
                curTop = -maxTop;
            }
            curImg.css({'top': curTop});
        }
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
            var maxHeight = $('.voting-gallery').outerHeight() - 1;
            var newList = '';
            var newListPreview = '';
            curItem.find('.voting-item-photo').each(function() {
                newList += '<div class="voting-gallery-item"><div class="voting-gallery-item-inner" data-curSize="1" style="max-height:' + maxHeight + 'px"><img src="' + $(this).data('big') + '" alt="" style="top:0px" /><div class="voting-gallery-item-top"></div><div class="voting-gallery-item-bottom"></div></div></div>';
                newListPreview += '<div class="voting-gallery-preview-item"><img src="' + $(this).data('big') + '" alt="" /></div>';
            });

            $('.voting-gallery-preview-list').html(newListPreview);
            $('.voting-gallery-preview-list .voting-gallery-preview-item').eq(0).addClass('active');

            if ($('.voting-gallery-list').hasClass('slick-slider')) {
                $('.voting-gallery-list').slick('unslick');
            }
            $('.voting-gallery-list').html(newList);
            $('.voting-gallery-list').slick({
                dots: false,
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                draggable: false,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>',
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: {
                            draggable: true
                        }
                    }
                ]
            }).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                $('.voting-gallery-preview-item.active').removeClass('active');
                $('.voting-gallery-preview-list').each(function() {
                    $(this).find('.voting-gallery-preview-item').eq(nextSlide).addClass('active');
                });
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
            var curWidth = $(window).width();
            var curDiff = 1;
            if (curWidth < 480) {
                curDiff = 480 / curWidth;
            }
            var curHeight = $(window).height() * curDiff;
            var curFooterTop = $('footer').offset().top - curScroll - curHeight;
            if (curFooterTop < 0) {
                curBlock.css({'bottom': -curFooterTop});
            } else {
                curBlock.css({'bottom': 0});
            }
        }

        $('.voting-result.gallery-active').removeClass('gallery-active');
        $('html').removeClass('gallery-open');

        $('.voting-item').each(function() {
            var curItem = $(this);
            var curHeight = curItem.find('.voting-item-photos').height();
            curItem.find('.voting-item-ctrl').css({'height': curHeight});
        });
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