<?php

use App\Custom\CustomResponse;
use App\Custom\PaymentManager;
use App\Http\Controllers\AchatSmsController;
use App\Http\Controllers\CampagneController;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\SmsPackController;
use App\Http\Controllers\DomaineInterventionController;
use App\Http\Controllers\CategorieEmploiController;
use App\Http\Controllers\CollaborateurController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\FollowerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HashtagController;
use App\Http\Controllers\OauthController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\TypeOffreController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\StateController;
use App\Models\Collaborateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware(['auth:sanctum', 'entreprise.admin'])->get('campagne/states/{campagne:id}', [CampagneController::class, 'getCurrentCampagneStates']);
Route::middleware(['auth:sanctum', 'entreprise.admin'])->get('campagne/states/not-selected/{campagne:id}', [CampagneController::class, 'getNotSelectedCurrentCampagneStates']);
Route::middleware(['auth:sanctum', 'entreprise.admin'])->put('campagne/states/{campagne:id}', [CampagneController::class, 'updateCurrentCampagneState']);

/**
 * Fetch data for all campagne active
 * @author Moussa FOFANA
 * @since 08.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-10
 */

Route::middleware(['auth:sanctum'])->get('campagne/for-current-user', [CampagneController::class, 'findCampagnesUserConnected']);
Route::middleware(['optional.sanctum'])->get('campagne/active', [CampagneController::class, 'getActiveCampagnes']);

Route::post('invitation/new-user-collaborateur', [UserController::class, 'storeUserFromInvitation']);

Route::middleware(['auth:sanctum', 'admin'])->post('user/message', [UserController::class, 'sendMessage']);

Route::post('invitation/uid', [InvitationController::class, 'verifyToken']);


Route::middleware('auth:sanctum')->get('candidature/paginate/{itemsPerPage}', [CandidatureController::class, 'paginateCandidatureByUserId']);
Route::middleware('auth:sanctum')->resource('candidature', CandidatureController::class);
Route::middleware(['auth:sanctum', 'entreprise.admin'])->get('candidature/historic-states/{candidature}', [CandidatureController::class, 'getHistoricalStates']);
Route::middleware('auth:sanctum')->get('candidature/paginate/{itemsPerPage}', [CandidatureController::class, 'paginateCandidatureByUserId']);
Route::middleware(['auth:sanctum', 'entreprise.admin'])->get('candidature/campagne/{campagne}/{itemsPerPage}', [CandidatureController::class, 'getCandidaturesPerCampagne']);
Route::middleware(['auth:sanctum', 'entreprise.admin'])->post('candidature/send-confirm-reception', [CandidatureController::class, 'sendConfirmReceptionEmail']);
/**
 * Récupérer le dossier d'un candidat
 * @author El Hadji Amath SARRR
 * @since 14.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-59
 */
Route::middleware(['auth:sanctum', 'admin'])->get('candidature/{candidature:uid}', [CandidatureController::class, 'findCandidature']);

Route::middleware(['auth:sanctum'])->post('candidature/spontanee/new', [CandidatureController::class,'storeCandidatureSpontanee']);
Route::middleware(['auth:sanctum', 'admin'])->resource('candidature', CandidatureController::class,[
    'except' => ['update', 'store']]);

Route::middleware(['auth:sanctum','entreprise.admin'])->get('candidature/{candidature:uid}', [CandidatureController::class, 'show']);
Route::middleware(['auth:sanctum','admin'])->resource('candidature', CandidatureController::class,[
    'except'=>['show','update']
]);
/**
 * Intéressé ou désintéressé sur le dossier d'un candidat
 * @author El Hadji Amath SARRR
 * @since 17.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-59
 */
Route::middleware(['auth:sanctum', 'entreprise.admin'])->resource('candidature', CandidatureController::class, ['only' => ['update']]);
Route::middleware(['auth:sanctum'])->resource('candidature', CandidatureController::class, ['only' => ['store']]);

Route::middleware(['auth:sanctum'])->post('campagne/candidature/send-candidature-rapport', [CandidatureController::class, 'sendRapport']);

/**
 * Récupérer le user connecté
 * @author Moussa FOFANA
 * @since 20.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-88
 * @param $request
 * @return CustomResponse
 */
Route::middleware('auth:sanctum')->get('/current-user', function (Request $request) {
    return CustomResponse::buildSuccessResponse($request->user());
});

/**
 * Route collaborateur
 * @author El Hadji Amath SARR
 * @since 10.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-37
 */
Route::middleware(['auth:sanctum', 'entreprise.admin'])->get('collaborateur/paginate/{itemsPerPage}/{entreprise_id}', [CollaborateurController::class, 'paginate']);
/**
 * Route categorieemploi
 * @author Abdou aziz Sy NDIAYE
 * @since 26.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-66
 *
 */

Route::middleware(['auth:sanctum', 'admin'])->get('categorieemploi/paginate/{itemPerPage}', [CategorieEmploiController::class, 'paginate']);
Route::middleware(['auth:sanctum', 'admin'])->resource('categorieemploi', CategorieEmploiController::class, [
    'except' => ['index']
]);
Route::middleware(['auth:sanctum'])->resource('categorieemploi', CategorieEmploiController::class, [
    'only' => ['index']
]);

/**
 * Route categorieemploi
 * @author Moussa FOFANA
 * @copyright bamboguirassy
 * @since 31.01.22
 * @link https://recrutore.atlassian.net/browse/RAD-100
 *
 */

Route::middleware(['auth:sanctum', 'admin'])->get('typeoffre/paginate/{itemPerPage}', [TypeOffreController::class, 'paginate']);
Route::middleware(['auth:sanctum', 'admin'])->resource('typeoffre', TypeOffreController::class, [
    'execpt' => ['index']
]);
Route::middleware(['auth:sanctum'])->resource('typeoffre', TypeOffreController::class, [
    'only' => ['index']
]);


/**
 * Gére la connexion de l'utilisateur en utilisant Sanctum
 * @author Moussa FOFANA
 * @since 20.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-6
 * @param $request
 * @return CustomResponse
 */
Route::post('/login', function (Request $request) {
    $validators = Validator::make($request->all(), [
        'email' => 'email|exists:users,email',
        'password' => 'required',
        'device' => 'required'
    ]);
    if ($validators->fails()) {
        return CustomResponse::buildValidationErrorResponse($validators->errors());
    }
    if (!Auth::attempt($request->only('email', 'password'))) {
        return CustomResponse::buildErrorResponse(["Les identifiants de connexion sont invalides..."]);
    }
    $token = $request->user()->createToken($request->device);
    return CustomResponse::buildSuccessResponse(['token' => $token->plainTextToken, 'user' => $request->user()]);
});

/*
 * Modifie le mot de passe de l'utilisateur
 * @author Mamadou Fam
 * @since 31.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-32
 */
Route::put('user/change-password/{user:id}', [UserController::class, 'changePassword']);


/*
 * Modifie la photo de profile de l'utilisateur l'utilisateur
 * @author Mamadou Fam
 * @since 01.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-109
 */
Route::middleware(['auth:sanctum'])->put('user/update-photo/{user:id}', [UserController::class, 'updatePhoto']);


/* Gére la déconnexion de l'utilisateur en utilisant Sanctum
 * @author Moussa FOFANA
 * @since 20.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-6
 * @param $request
 * @return CustomResponse
 */
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return CustomResponse::buildSuccessResponse("");
});


Route::middleware(['auth:sanctum', 'admin'])->post('user/admin-create', [UserController::class, 'storeAdmin']);
Route::middleware(['auth:sanctum', 'admin'])->get('user/paginate/{itemPerPage}', [UserController::class, 'paginate']);
Route::post('user/confirm-account/{user:confirmationToken}', [UserController::class, 'confirmAccount']);
Route::post('user/change-email-on-register/{user:email}', [UserController::class, 'changeEmailOnRegister']);
Route::middleware(['auth:sanctum', 'admin'])->resource('user', UserController::class, [
    'only' => ['index', 'show', 'destroy']
]);
Route::middleware(['auth:sanctum'])->resource('user', UserController::class, [
    'only' => ['update']
]);
Route::middleware(['guest'])->resource('user', UserController::class, [
    'only' => ['store']
]);


Route::middleware(['auth:sanctum', 'admin'])->get('hashtag/paginate/{itemPerPage}', [HashtagController::class, 'paginate']);
Route::middleware(['auth:sanctum', 'admin'])->resource('hashtag', HashtagController::class, [
    'execpt' => ['index']
]);

Route::middleware(['auth:sanctum'])->resource('hashtag', HashtagController::class, [
    'only' => ['index']
]);

/*
 * Gere la verification de l'adresse mail et envoie un lien de reinitilisation
 * @author Mamadou lamine Beye
 * @since 30.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-33
 */
Route::post('send-reset-link', [PasswordResetController::class, 'sendLink']);
/*
 * Gere la verification de l'adresse mail et la reinitialisation de mot de passe
 * @author Mamadou lamine Beye
 * @since 30.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-33
 */

Route::middleware(['auth:sanctum', 'admin'])->get('domaineintervention/paginate/{itemPerPage}', [DomaineInterventionController::class, 'paginate']);
Route::middleware(['auth:sanctum', 'admin'])->resource('domaineintervention', DomaineInterventionController::class, [
    'only' => ['store', 'update', 'destroy']
]);
Route::middleware(['auth:sanctum'])->resource('domaineintervention', DomaineInterventionController::class, [
    'only' => ['index']
]);

Route::post('set-password', [PasswordResetController::class, 'sendLink']);
Route::post('change-password', [PasswordResetController::class, 'updatePassword']);
/*
 * Verifie si le token envoyé avec le lien de reinitialisation est valide
 * @author Mamadou lamine Beye
 * @since 30.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-33
 */
Route::post('verify-token', [PasswordResetController::class, 'verifyToken']);



/**
 * Gérer les routes du crud de pack sms
 * @author El Hadji Amath SARR
 * @since 25.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-95
 */
Route::middleware(['auth:sanctum', 'admin'])->resource('smspack', SmsPackController::class, ['only' => ['index', 'destroy', 'update', 'store']]);
Route::middleware(['auth:sanctum', 'admin'])->get('smspack/paginate/{itemPerPage}', [SmsPackController::class, 'paginate']);



/*
 * Modifie le mot de passe de l'utilisateur
 * @author Mamadou Fam
 * @since 31.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-32
 */
Route::put('user/change-password/{user:id}', [UserController::class, 'changePassword']);



Route::get('entreprise/actives', [EntrepriseController::class, 'getActiveEntreprises']);
Route::middleware(['auth:sanctum'])->get('entreprise/followed', [EntrepriseController::class, 'findEntreprisesFollowed']);
Route::middleware(['auth:sanctum'])->get('entreprise/for-current-user', [EntrepriseController::class, 'findEntrepriseUserConnected']);


/**
 * Gère l'affichage,la crèation,la mise à jour et la suppression des statuts
 * @author Mariama Fatou Sarr DIOP
 * @since 26.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-86
 * @return CustomResponse
 */

/**
 * @author Moussa FOFANA
 * @since 28.01.22
 * @copyright bamboguirassy
 */


Route::middleware(['auth:sanctum', 'owner'])->put('entreprise/update-logo/{entreprise:uid}', [EntrepriseController::class, 'updateLogo']);
Route::middleware(['auth:sanctum', 'admin'])->get('entreprise/paginate/{itemPerPage}', [EntrepriseController::class, 'paginate']);
Route::get('entreprise/actives', [EntrepriseController::class, 'getActiveEntreprises']);
Route::middleware(['optional.sanctum'])->get('entreprise/{entreprise:uid}', [EntrepriseController::class, 'show']);
Route::middleware(['auth:sanctum', 'owner'])->resource('entreprise', EntrepriseController::class, [
    'only' => ['destroy']
]);
Route::middleware(['auth:sanctum'])->resource('entreprise', EntrepriseController::class, [
    'only' => ['store', 'index']
]);

Route::middleware(['auth:sanctum', 'owner'])->resource('entreprise', EntrepriseController::class, [
    'only' => ['update']
]);




/**
 * Gère l'affichage,la crèation,la mise à jour et la suppression des statuts
 * @author Abdou Aziz Sy NDIAYE
 * @since 04.02.2022
 * @return CustomResponse
 */


Route::get('entreprise/{user}', [UserController::class, 'findEntrepriseUserConnected']);

/**
 * Gère l'affichage, l'enregistrement et la mise à jour du statut des candidatures
 * @author Mariama Fatou Sarr DIOP
 * @since 27.01.2022
 */

Route::middleware(['auth:sanctum', 'admin'])->get('state/paginate/{itemPerPage}', [StateController::class, 'paginate']);
Route::middleware(['auth:sanctum', 'admin'])->resource('state', StateController::class, [
    'only' => ['store', 'update', 'destroy']
]);
Route::middleware(['auth:sanctum'])->resource('state', StateController::class, [
    'only' => ['index']
]);


/**
 * Gérer les routes du crud de follower
 * @author El Hadji Amath SARR
 * @since   02.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-99
 */
Route::middleware(['auth:sanctum'])->resource('follower', FollowerController::class, ['only' => ['store', 'destroy']]);

Route::middleware(['auth:sanctum', 'entreprise.admin'])->get('campagne/paginate/{itemsPerPage}/{enrepriseId}', [CampagneController::class, 'paginateCampagneById']);

Route::get('campagne/paginateSimilarCampagne/{campagne:id}/{itemsPerPage}', [CampagneController::class, 'paginateSimilarCampagnes']);

/**
 * Gestion de l'affichage des campagnes
 * @author Mamadou Fam
 * @since   08.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-18
 */

Route::middleware(['optional.sanctum'])->get('campagne/{campagne:uid}', [CampagneController::class, 'show']);
/**
 * Suppression d'une campagne
 * @author Mamadou lamine Bèye
 * @since  09.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-80
 */

Route::middleware(['auth:sanctum', 'admin'])->delete('campagne/{campagne:uid}', [CampagneController::class, 'destroy']);

/**
 * Gestion du filtrage des campagnes
 * @author Mamadou Fam
 * @since   10.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-67
 */
Route::middleware(['auth:sanctum'])->post('campagne/active/filtre', [CampagneController::class, 'FiltreActiveCampagnes']);


/**
 * Gestion enregistrement d'une campagne
 * @copyright bamboguirassy
 * @since 08.02.22
 * @link https://recrutore.atlassian.net/browse/RAD-29
 */
Route::middleware(['auth:sanctum', 'admin'])->get('campagne/paginate/{itemPerPage}', [CampagneController::class, 'paginate']);

/**
 * Gestion enregistrement d'une campagne
 * @author Alioune Badara FAM
 * @copyright ABF
 * @since 04.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-16
 */
Route::middleware(['auth:sanctum', 'entreprise.admin'])->resource(
    'campagne',
    CampagneController::class,
    [
        'only' => ['store', 'update']
    ]
);
/**
 * @author Moussa FOFANA
 */
Route::middleware(['auth:sanctum', 'owner'])->resource(
    'campagne',
    CampagneController::class,
    [
        'only' => ['destroy']
    ]
);




/**
 * @since 03.02.22
 */
Route::middleware(['auth:sanctum', 'entreprise.admin'])->resource('invitation', InvitationController::class, [
    'only' => ['store']
]);
Route::middleware(['auth:sanctum', 'admin'])->get('state/paginate/{itemPerPage}', [StateController::class, 'paginate']);

/**
 * envoie les informations reçu du fournisseur google et recupere les infos due l'utilisateur
 * @author Mamadou lamine Beye
 * @since 01.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-107
 */
Route::post('callback', [SocialAuthController::class, 'socialLogin']);

/**
 * filtre les utilisateurs
 * @author Mamadou lamine Beye
 * @since 10.02.2022
 * @link https://recrutore.atlassian.net/browse/RAD-69
 * @param type
 */
Route::post('user-filtrer', [UserController::class, 'filterUser']);

Route::middleware(['auth:sanctum', 'entreprise.admin'])->get('achatsms/{uid}', [AchatSmsController::class, 'show']);

Route::middleware(['auth:sanctum', 'entreprise.admin'])->post('achatsms/restore/{achatPackTemp:uid}', [AchatSmsController::class, 'restore']);

Route::post('achatsms_pin', [AchatSmsController::class, 'getPaymentNotification']);

Route::middleware(['auth:sanctum', 'entreprise.admin'])->resource('achatsms', AchatSmsController::class, [
    'only' => ['store']
]);
Route::post('social-login-callback', [SocialAuthController::class, 'socialLogin']);
