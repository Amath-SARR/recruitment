<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'telephone',
        'profession',
        'presentation',
        'enabled',
        'type',
        'photo',
        'confirmationToken',
        'social',
    ];
    protected $appends = ['photo_path', 'entreprises_count', 'followed_entreprises_count',];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'enabled' => 'string',
    ];

    /**
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 09.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-112
     * @description Récupère la liste de toutes les campagnes ratatchées aux différentes entreprises de l'utilisateur connecté
     * @return array
     */
    public function getCampagnesConnectedUserAttribute()
    {
        $entrepriseIds = [];
        $entreprises = Entreprise::whereRelation('collaborateurs', 'user_id', '=', $this->id)->select('id')->get();
        foreach ($entreprises as $k => $v) {
            $entrepriseIds[$k] = $v['id'];
        }
        return Campagne::whereIn('entreprise_id', $entrepriseIds)->with('entreprise')->get();
    }

    /**
     * Get all of the social_accounts for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function social_accounts()
    {
        return $this->hasMany(SocialAccount::class);
    }

    public function getPhotoPathAttribute()
    {
        return request()->getSchemeAndHttpHost() . '/uploads/users/' . $this->photo;
    }

    public function getEntreprisesAttribute()
    {
        return Entreprise::whereRelation('collaborateurs', 'user_id', '=', $this->id)->get();
    }

    public function getEntreprisesCountAttribute()
    {
        return Entreprise::whereRelation('collaborateurs', 'user_id', '=', $this->id)->count();
    }


    /**
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 09.02.22
     * @description Vérifie si l'utilisateur connecté suit au moins une entreprise
     * @return bool
     */
    public function getFollowedEntreprisesAttribute()
    {
        return Entreprise::whereRelation('follower', 'user_id', '=', $this->id)->get();
    }

    public function getFollowedEntreprisesCountAttribute()
    {
        return Entreprise::whereRelation('follower', 'user_id', '=', $this->id)->count();
    }

    /**
     * Get all of the collaborateurs for the User
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
}
