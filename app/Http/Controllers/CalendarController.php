<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CalendarController extends Controller
{
    public function getCategories(){
        $categories = Category::get()->toArray();
        $data = [];
        foreach($categories as $row){
            $data[$row['id']]['id']   = $row['id'];
            $data[$row['id']]['name'] = $row['name'];
        }
        return response()->json($data);
    }
}
