<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    public function getEvents(Request $request){
        $data = $request->all();
        $events = Event::where('user_id',$data['user_id'])->get();
        return $events;
    }

    public function saveEvent(Request $request){
        $data = $request->all();
        $event = Event::find($data['id']);
        $ret = [];
        $ret['status'] = 200;
        $ret['msg'] = 'Sikeres mentés!';
        $ret = $this->eventValidation($ret, $data);

        if($ret['status'] == 200){
            $data['start'] = date('y-m-d h:i:s', strtotime( $data['start'].' +1 Hour')); //valami időzóna zavar van itt, vagy nem tom..db-be egy órával kevesebbel menti
            $data['end'] = date('y-m-d h:i:s', strtotime( $data['end'].'+1 Hour'));
    
            //update
            if($event){
                Event::updateRow($data['id'],$data);
    
            //create
            }else{
                Event::createRow($data);
            }
        }
          
        return $ret;
    }

    public function deleteEvent(Request $request){
        $data = $request->all();
        $event = Event::find($data['id']);
        $ret = [];
        $ret['status'] = 200;
        $ret['msg'] = 'Sikeres törlés!';

        if($event){
            Event::deleteRow($data['id']);
        } 
        return $ret;
    }

    public function eventValidation($ret, $data){
        if(!isset($data['title']) || empty($data['title']) ||  !isset($data['start']) || empty($data['start'])  || !isset($data['end']) || empty($data['end'])){
            $ret['status'] = 'failed';
            $ret['msg'] = 'Kötelezően kitöltendő a Cím, Start és a Vége mezők!';
        }

        if(isset($data['start']) && !empty($data['start'])  && isset($data['end']) && !empty($data['end']) && $data['end'] < $data['start']){
            $ret['status'] = 'failed';
            $ret['msg'] = 'A Start mezőben nem lehet későbbi dátum, mint a Vége mezőben!';
        }
        return $ret;
    }
}
