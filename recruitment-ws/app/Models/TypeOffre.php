<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TypeOffre extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type'
    ];


    public function campagnes(): BelongsToMany
    {
        return $this->belongsToMany(Campagne::class, 'campagne_type_offre', 'type_offre_id', 'campagne_id');
    }
}
