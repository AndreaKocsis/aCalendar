<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    public function getEvents(){
        $events = Event::get();
        return $events;
    }
}
