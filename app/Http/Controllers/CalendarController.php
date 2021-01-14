<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CalendarController extends Controller
{
    public function getCategories(Request $request){
        $categories = Category::where('user_id',$request->user_id)->get()->toArray();
        $data = [];
        foreach($categories as $row){
            $data[$row['id']]['id']   = $row['id'];
            $data[$row['id']]['name'] = $row['name'];
        }
        return response()->json($data);
    }
}
