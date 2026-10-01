<?php

namespace App\Models;

use App\Models\Customer;
use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class StockOut extends Model
{
    protected $guarded = [];

    public function item() { return $this->belongsTo(Item::class); }
    public function customer() { return $this->belongsTo(Customer::class); }
    public function user() { return $this->belongsTo(User::class); }
}
