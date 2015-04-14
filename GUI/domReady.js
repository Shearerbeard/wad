app.init.dom = function(app){
    
    $(document).ready(function(){

        // $metronome = $('#metronome')
        var beatBoxes = [
            $('.b1'),
            $('.b2'),
            $('.b3'),
            $('.b4'),
            $('.b5'),
            $('.b6'),
            $('.b7'),
            $('.b8'),
            $('.b9'),
            $('.b10'),
            $('.b11'),
            $('.b12'),
            $('.b13'),
            $('.b14'),
            $('.b15'),
            $('.b16'),
        ]
        app.$loopTracks = $('.mixer-track')

        var start;
        var animateFrame = function(){
            var now = performance.now()
            var progressInBeat = ( ( ( now - start ) % app.beatLen ) / app.beatLen )
            var progressInLoop = ( ( ( now - start ) % ( app.beatLen * 16 ) ) / ( app.beatLen * 16 ) )
            // console.log(Math.floor(progressInLoop / 0.0625) + 1)
            app.prevBeat = app.curBeat
            app.curBeat = Math.floor(progressInLoop / 0.0625) + 1
            if ( app.curBeat < app.prevBeat ) {
                console.log('fire!')
            }
            if      ( Math.floor(progressInLoop / 0.0625) > 0 ) {
                beatBoxes[ Math.floor(progressInLoop / 0.0625) ].addClass('on')
                beatBoxes[ Math.floor(progressInLoop / 0.0625) - 1 ].removeClass('on')
            }
            else if ( Math.floor(progressInLoop / 0.0625) === 0 ) {
                beatBoxes[0].addClass('on')
                beatBoxes[15].removeClass('on')
            }

            // $metronome.css('transform', 'rotate(' + (( progressInBeat * 360 ) - 90 ) + 'deg)')

            requestAnimationFrame(animateFrame)
        }

        var $micInfo = $('#micInfo')
        var logPitch = function(){
            if ( mt.noteName && mt.pitch ) {
                $micInfo.text(mt.noteName + ' : ' + mt.pitch + ' hz')
            }
            app.pitchDetectRaf = requestAnimationFrame(logPitch)
        }

        $('#start').on('click', function(){
            $('.beatBox').removeClass('on')
            $(this).text('Restart')
            start = performance.now() -16000
            animateFrame()
        })


        $('#micOn').on('click', function(){
            if ( $(this).hasClass('micOn') ) {
                $(this).removeClass('micOn')
                $(this).text('Mic On')
                voice.stop()
            }
            else {
                $(this).addClass('micOn')
                $(this).text('Mic Off')
                voice.play()
            }
        })

        $('#detectPitch').on('click', function(){
            if ( $(this).hasClass('detecting') ) {
                $(this).removeClass('detecting')
                $(this).text('Detect Pitch')
                mt.stopUpdatingPitch()
                cancelAnimationFrame(app.pitchDetectRaf)
                $micInfo.text('')
            }
            else {
                $(this).addClass('detecting')
                $(this).text('Stop Detecting')
                mt.updatePitch()
                logPitch()
            }
        })


        var looping = false
        $(document).on('keydown', function(e){

            if ( e.which >= 49 && e.which <= 56 ) { //for multi-track mixer
                console.log(e.which - 49)
                app.trackActions.recordToTrack(e.which - 49)

            //     var $selectedTrack = $('.mixer-track:nth-child(' + (event.which - 48) + ')')
            //     if ( $selectedTrack.hasClass('selected') ) {
            //         $selectedTrack.removeClass('selected')
            //     }
            //     else {
            //         $('.mixer-track').removeClass('selected')
            //         $selectedTrack.addClass('selected')
            //     }
            }
        })

        // $('#reset').on('click', function(){
        //     console.log('reset')
        //     app.reset()
        // })

        $('.note').on('mousedown', function(){
            app.instruments.alpha.play({ pitch : $(this).text() })
        })
        $('.note').on('mouseup', function(){
            app.instruments.alpha.stop()
            // console.log(mt.noteEstimate)
        })
        // $('.mixer-track').on('click', function(){
        //     $('.mixer-track').removeClass('selected')
        //     $(this).addClass('selected')
        // })



    })
}