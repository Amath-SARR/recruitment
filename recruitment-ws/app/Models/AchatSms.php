<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AchatSms extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function smsPack()
    {
        return $this->belongsTo(SmsPack::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
