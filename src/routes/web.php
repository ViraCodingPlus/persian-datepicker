<?php

use Illuminate\Support\Facades\Route;
use PDatepicker\Http\Controllers\PDatepickerController;

Route::group(['prefix' => 'pdatepicker', 'middleware' => ['web']], function () {
    Route::get('/convert-date', [PDatepickerController::class, 'convertDate'])->name('pdatepicker.convert-date');
}); 