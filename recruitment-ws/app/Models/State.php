<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class State extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'type',
        'description',
        'ordre'
    ];

    protected $appends = ['candidatures_count_by_campagne'];

    /**
     * Compte le nombre de candidatures par campagne pour chaque statut
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 21.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-124
     */
    public function getCandidaturesCountByCampagneAttribute()
    {
        return Candidature::whereHas('stateCandidatures', function ($query) {
            $query->where('state_id', $this->id);
        })->get()->countBy('campagne_id');
    }
}
