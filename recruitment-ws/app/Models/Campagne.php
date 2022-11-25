<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;

class Campagne extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];
    protected $appends = ['photo_path', 'active'];

    public function type_offres(): BelongsToMany
    {
        return $this->belongsToMany(TypeOffre::class, 'campagne_type_offre', 'campagne_id', 'type_offre_id');
    }

    /**
     * The states that belong to the Campagne
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function states(): BelongsToMany
    {
        return $this->belongsToMany(State::class, 'campagne_states');
    }
    /**
     * Get all of the campagneStates for the Campagne
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function campagneStates(): HasMany
    {
        return $this->hasMany(CampagneState::class);
    }

    /**
     * Get the user that owns the Campagne
     * @author Moussa Fofana
     * @since 08.02.22
     * @copyright bamboguirassy
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the entreprise that owns the Campagne
     * @author El Hadji Amath SARR
     * @since 08.02.22
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function entreprise(): BelongsTo
    {
        return $this->belongsTo(Entreprise::class);
    }

    /**
     * @author El Hadji Amath SARR
     * @since 08.02.22
     * @return link picture campagne
     */
    public function getPhotoPathAttribute()
    {
        return request()->getSchemeAndHttpHost() . '/uploads/campagnes/' . $this->photo;
    }

    public function getActiveAttribute()
    {
        return $this->dateLancement <= today() && $this->dateCloture >= today();
    }

    /**
     * Get the categorieEmploi that owns the Campagne
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 16.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-118
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function categorieEmploi(): BelongsTo
    {
        return $this->belongsTo(CategorieEmploi::class);
    }

    /**
     * Get all of the hashtags for the Campagne
     * @copyright ABF
     * @since 10.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-118
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function hashtags(): BelongsToMany
    {
        return $this->belongsToMany(Hashtag::class, 'campagne_hashtags', 'campagne_id', 'hashtag_id');
    }

    /**
     * Get all of the campagneHashtags for the Campagne
     * @copyright ABF
     * @since 10.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-118
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function campagneHashtags(): HasMany
    {
        return $this->hasMany(CampagneHashtag::class);
    }

    /**
     * récupère la candidature de l'utilisateur connecté si existant
     */
    /*public function getCandidatureAttribute()
    {
        if (Auth::check()) {
            $candidatures = Candidature::whereCampagneId($this->id)
                ->whereUserId(Auth::id())
                ->get();
            if (count($candidatures) > 0) {
                return $candidatures[0];
            }
        }
        return null;
    }*/
    /**
     * Get the candidature associated with the Campagne
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function candidature(): HasOne
    {
        return $this->hasOne(Candidature::class)->whereUserId(Auth::id());
    }
}
