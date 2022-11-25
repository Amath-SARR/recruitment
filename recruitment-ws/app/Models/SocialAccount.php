<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialAccount extends Model
{
    use HasFactory;

    protected $guarded = [];

    const SERVICE_FACEBOOK = 'FACEBOOK';
    const SERVICE_GOOGLE = 'GOOGLE';

    public function user() {
        return $this->belongsTo(User::class);
    }
    
}
