<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post("user-signup", "UserController@userSignUp");
Route::post("user-login", "UserController@userLogin");
Route::get("user/{email}", "UserController@userDetail");

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

//calendar events
Route::post('/events', 'EventController@getEvents');
Route::post('/save-event', 'EventController@saveEvent');
Route::post('/delete-event', 'EventController@deleteEvent');

//categories
Route::post('/get-categories-to-calendar', 'CalendarController@getCategories');
Route::post('/get-categories', 'CategoryController@getCategories');
Route::post('/create-category', 'CategoryController@createCategory');

//tags
Route::post('/get-tags', 'TagController@getTags');
Route::post('/create-tag', 'TagController@createTag');