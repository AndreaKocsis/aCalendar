<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tag;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    public function getTags(){
        $data = [];
        $data["rows"] = Tag::get()->toArray();
        $data["columns"] = [
            ["label" => "Megnevezés", "field" => "name"],
            ["label" => "Leírás", "field" => "description"],
        ];
        return response()->json($data);
        // return response()->json(["status" => 200, "success" => true, "message" => "Sikeres mentés!", "data" => $data]);
    }



    public function createTag(Request $request){
        $validator          =       Validator::make($request->all(),
            [
                "name"          =>          "required"
            ]
        );

        if($validator->fails()) {
            return response()->json(["status" => "failed", "validation_error" => $validator->errors()->first()]);
        }


        $check_if_isset = Tag::where('name',$request->name)->first();
        if($check_if_isset) {
            return response()->json(["status" => "failed", "validation_error" => "Ilyen címke már létezik!"]);
        }
        
        $data = $request->all();
        Tag::createRow($data);
        return response()->json(["status" => 200, "success" => true, "message" => "Sikeres mentés!", "data" => ""]);
    }
}
