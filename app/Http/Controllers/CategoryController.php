<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function getCategories(Request $request){
        $data = [];
        $data["rows"] = Category::where('user_id',$request->user_id)->get()->toArray();
        $data["columns"] = [
            ["label" => "Megnevezés", "field" => "name"],
            ["label" => "Leírás", "field" => "description"],
        ];
        return response()->json($data);
        // return response()->json(["status" => 200, "success" => true, "message" => "Sikeres mentés!", "data" => $data]);
    }



    public function createCategory(Request $request){
        $validator          =       Validator::make($request->all(),
            [
                "name"          =>          "required"
            ]
        );

        if($validator->fails()) {
            return response()->json(["status" => "failed", "validation_error" => $validator->errors()->first()]);
        }


        $check_if_isset = Category::where('name',$request->name)->first();
        if($check_if_isset) {
            return response()->json(["status" => "failed", "validation_error" => "Ilyen kategória már létezik!"]);
        }
        
        $data = $request->all();
        Category::createRow($data);
        return response()->json(["status" => 200, "success" => true, "message" => "Sikeres mentés!", "data" => ""]);
    }
}
