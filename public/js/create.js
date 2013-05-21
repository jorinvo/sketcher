$(function () {

    // VARIABLES

    var pos, mousedown;
    var $create = $('#create');
    var $sketch = $('#sketch');
    var ctx = $sketch[0].getContext('2d');


    // SETUP

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.translate(0.5,0.5);

    var res = window.innerHeight - 62;
    $sketch.attr({
        width: window.innerWidth,
        height: res
    });


    // EVENTS

    $create.on('click', createSketch);

    // touch
    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {

        $sketch.on({
            'touchstart': touchStartLine,
            'touchmove': touchDrawLine,
            'touchend': touchEndLine
        });

    // desktop
    } else {

        $sketch.on({
            'mousedown': startLine,
            'mousemove': drawLine,
            'mouseup': endLine
        });


    }

    // HANDLER

    function createSketch (e) {
        e.preventDefault();
        var dataString = $sketch[0].toDataURL().replace(/^data:image\/png;base64,/,"");
        $.post('/sketches/create', { data: dataString }, function (url) {
            window.location = url;
        });
    }

    function touchStartLine (e) {
        pos = $sketch.position();

        var touch =  event.touches[0];
        ctx.moveTo(touch.pageX - pos.left, touch.pageY - pos.top);
        mousedown = true;
    }

    function touchDrawLine (e) {
        e.preventDefault();
        if (!mousedown) return;
        var touch =  e.originalEvent.touches[0];
        ctx.lineTo(touch.pageX - pos.left, touch.pageY - pos.top);
        ctx.stroke();
    }

    function touchEndLine (e) {
        mousedown = false;
    }


    function startLine (e) {
        pos = $sketch.position();

        ctx.moveTo(e.pageX - pos.left, e.pageY - pos.top);
        mousedown = true;
    }

    function drawLine (e) {
        if (!mousedown) return;
        ctx.lineTo(e.pageX - pos.left, e.pageY - pos.top);
        ctx.stroke();
    }

    function endLine (e) {
        mousedown = false;
    }


});
