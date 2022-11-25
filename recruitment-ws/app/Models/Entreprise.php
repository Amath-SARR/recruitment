<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\Auth;

class Entreprise extends Model
{
    use HasFactory;
    protected $fillable = [
        'uid',
        'name',
        'telephone',
        'email',
        'logo',
        'siteWeb',
        'adresse',
        'candidatureSpontanee',
        'presentation',
        'user_id',
        'enabled',
        'solde_sms'
    ];

    protected $guarded = ['id'];
    protected $appends = ['logo_path', 'follower', 'followed', 'is_owner', 'is_collaborateur'];


    public function getLogoPathAttribute()
    {
        return request()->getSchemeAndHttpHost() . '/uploads/entreprises/' . $this->logo;
    }

    public function getFollowerAttribute()
    {
        // verifier si user connecté
        if (request()->user()) {
            // recuperer le Follower
            $followers = Follower::where('entreprise_id', $this->id)
                ->where('user_id', request()->user()->id)
                ->get();
            if (count($followers) > 0) {
                // si défini, retourner le follower
                return $followers[0];
            }
        }
        // sinon retourner null
        return null;
    }

    public function getFollowedAttribute()
    {
        return $this->getFollowerAttribute() != null;
    }
    /**
     * Get the user that owns the Entreprise
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all of the collaborateurs for the Entreprise
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function collaborateurs(): HasMany
    {
        return $this->hasMany(Collaborateur::class);
    }

    public function achatPackTemp()
    {
        return $this->hasMany(AchatPackTemp::class);
    }

    public function achatSms()
    {
        return $this->hasMany(AchatSms::class);
    }

    /**
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 08.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-113
     * @description Vérifie si l'utilisateur connecté est propriétaire de l'entreprise ou pas
     * un admin est automatiquement owner de l'entreprise
     * @return bool
     */
    public function getIsOwnerAttribute()
    {
        return Auth::check() && (Auth::id() == $this->user_id || Auth::user()->type == 'admin');
    }

    /**
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 08.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-113
     * @description Vérifie si l'utilisateur connecté est collaborateur de l'entreprise ou pas
     * un admin comme un admin-entreprise est automatiquement collaborateur de cet entreprise
     * @return bool
     */
    public function getIsCollaborateurAttribute()
    {
        if (Auth::check()) {
            if (Auth::user()->type == 'admin') {
                return true;
            }
            return Collaborateur::where('entreprise_id', $this->id)
                ->where('user_id', Auth::id())
                ->count() > 0;
        }
        return false;
    }

    /**
     * Get all of the domaine intervention for the Entreprise
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
    public function domaineInterventions(): HasManyThrough
    {
        return $this->hasManyThrough(DomaineIntervention::class, EntrepriseDomaineIntervention::class);
    }

    /**
     * Get all of the entrepriseDomaineInterventions for the Entreprise
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function entrepriseDomaineInterventions(): HasMany
    {
        return $this->hasMany(EntrepriseDomaineIntervention::class);
    }

    /**
     * Get all of the campagne for the Entreprise
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function campagne(): HasMany
    {
        return $this->hasMany(Campagne::class);
    }

    public function follower(): HasMany
    {
        return $this->hasMany(Follower::class);
    }
}
