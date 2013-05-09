$(function () {

    var pos, mousedown;
    var $sketch = $('#sketch');
    var $url = $('#url');
    var $result = $('#result');
    var ctx = $sketch[0].getContext('2d');

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';


    // EVENTS

    $('#create').on('click', createSketch);
    $sketch.on({
        'touchstart': startLine,
        'touchmove': drawLine,
        'touchend': endLine
    });


    // HANDLER

    function createSketch (e) {
        e.preventDefault();
        // post request
        var dataString = $sketch[0].toDataURL().replace(/^data:image\/png;base64,/,"");

        $.post('/sketches/create', { data: dataString }, function (res) {
            // res
            $result.show();
            $url.val(res).select();
        });
        // show popup
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
