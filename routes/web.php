<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

Route::get('/test-mail', function () {

    Mail::raw(
        'Tes email TriCa Catering',
        function ($message) {

            $message->to(
                'tricacatering@gmail.com'
            );

            $message->subject(
                'Test Email'
            );
        }
    );

    return 'Email terkirim';
});

Route::get('/{any}', function () {

    return view('app');

})->where('any', '^(?!api).*$');