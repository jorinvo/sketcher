$(function () {

    // VARIABLES

    var pos, mousedown;
    var $navbar = $('.navbar');
    var $create = $('#create');
    var $sketch = $('#sketch');
    var ctx = $sketch[0].getContext('2d');


    // SETUP

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    var res = window.innerHeight - $navbar.outerHeight() - 10;
    $sketch.attr({
        width: window.innerWidth,
        height: res
    });


    // EVENTS

    $create.on('click', createSketch);
    $sketch.on({
        'touchstart': startLine,
        'touchmove': drawLine,
        'touchend': endLine
    });


    // HANDLER

    function createSketch (e) {
        e.preventDefault();
        var dataString = $sketch[0].toDataURL().replace(/^data:image\/png;base64,/,"");
        $.post('/sketches/create', { data: dataString }, function (url) {
            window.location = url;
        });
    }

    function startLine (e) {
        pos = $sketch.position();
        var touch =  event.touches[0];
        ctx.moveTo(touch.pageX - pos.left, touch.pageY - pos.top);
        mousedown = true;
    }

    function drawLine (e) {
        if (!mousedown) return;
        var touch =  e.originalEvent.touches[0];
        ctx.lineTo(touch.pageX - pos.left, touch.pageY - pos.top);
        ctx.stroke();
    }

    function endLine (e) {
        mousedown = false;
    }

});
