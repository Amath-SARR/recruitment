<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Candidature extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $appends = ['cv_path'];

    public function getCvPathAttribute()
    {
        return request()->getSchemeAndHttpHost() . '/uploads/candidatures/' . $this->cv;
    }

    /**
     * Get all of the stateCandidatures for the Candidature
     * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-19
     * @since 11.02.22
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function stateCandidatures(): HasMany
    {
        return $this->hasMany(StateCandidature::class);
    }

    /**
     * Get the campagne that owns the Candidature
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function campagne(): BelongsTo
    {
        return $this->belongsTo(Campagne::class);
    }

    /**
     * Get the user that owns the Candidature
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the state associated with the Candidature
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function currentState(): HasOne
    {
        return $this->hasOne(StateCandidature::class)->orderBy('created_at','desc');
    }
}
