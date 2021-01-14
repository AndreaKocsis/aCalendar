<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = [ 'name', 'description', 'user_id'];
    
    public static function updateRow($id, $data)
    {
        $db = self::findOrFail($id);
        $editable = $db->getFillable();
        foreach($data as $key => $d){
            if(is_null($d)){
                $data[$key] = '';
            }
        }
        foreach ($editable as $edit) {
            if ( isset( $data[$edit] ) ) {
                if($data[$key] == '') $data[$key] = null;
                $db->{$edit} = $data[$edit];
            }
        }
        if (!$db->save()) {
            return app()->abort(500);
        }
        return self::find($id);
    }
    public static function createRow($data)
    {
        $db = new self();
        $editable = $db->getFillable();
        foreach ($editable as $edit) {
            if (isset($data[$edit])) {
                $cels[$edit] = $data[$edit];
            }
        }
        return self::create($cels);
    }
    public static function deleteRow($id)
    {
        self::findOrFail($id)->delete();
    }
    public static function deleteRowsBy($cells = [], $vals = [])
    {
        foreach($cells as $id => $cell){
            if($id == 0){
                $delete = self::where($cell, $vals[$id]);
            }else{
                $delete->where($cell, $vals[$id]);
            }
        }
        $delete->delete();
    }
    public static function selectRowsBy($cells = [], $request = 'get')
    {
        $return = new self();

        foreach($cells as $cell => $val){
            $return = $return->where($cell, $val);
        }

        if($request == 'first') return $return->first();
        if($request == 'count') return $return->count();
        if($request == 'toSql') return $return->toSql();
        
        // default
        return $return->get();
    }
}
