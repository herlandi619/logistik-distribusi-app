<?php

namespace App\Models;

use App\Models\StockIn;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $guarded = [];

    public function stockIns(): HasMany
    {
        return $this->hasMany(StockIn::class);
    }
}
