<?php

namespace App\Models;

use App\Models\StockIn;
use App\Models\StockOut;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $guarded = [];

    public function stockIns() { return $this->hasMany(StockIn::class); }
    public function stockOuts() { return $this->hasMany(StockOut::class); }

}
