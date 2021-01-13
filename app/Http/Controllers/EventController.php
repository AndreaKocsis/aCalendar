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

    public function saveEvent(Request $request){
        $data = $request->all();
        $events = Event::where('title',$data['title'])->first();
        $ret = [];
        
        $data['start'] = date('y-m-d h:i:s', strtotime( $data['start'].' +1 Hour'));
        $data['end'] = date('y-m-d h:i:s', strtotime( $data['end'].'+1 Hour'));

        if($events){
            $ret['msg'] = 'Ilyen nevű esemény már létezik!';
            $ret['status'] = 404;
        }else{
            Event::createRow($data);
            $ret['msg'] = 'Sikeres mentés!';
            $ret['status'] = 200;
        }
        
        return $ret;
    }
}
