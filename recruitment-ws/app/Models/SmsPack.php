<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsPack extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom',
        'nombreSms',
        'montant',
    ];

    public function achatPackTemp()
    {
        return $this->hasMany(AchatPackTemp::class);
    }

    public function achatSms()
    {
        return $this->hasMany(AchatSms::class);
    }
}
