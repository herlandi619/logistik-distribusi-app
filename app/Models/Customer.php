<?php

namespace App\Models;

use App\Models\StockOut;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $guarded = [];

        public function stockOuts(): HasMany
    {
        return $this->hasMany(StockOut::class);
    }
}
