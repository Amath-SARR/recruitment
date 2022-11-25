<?php

namespace App\Http\Controllers;

use App\Custom\CustomResponse;
use App\Custom\FileHelper;
use App\Mail\NotifyConfirmeReceptionToCandidatEmail;
use App\Mail\NotifyNewCandidatureToAdminEmail;
use App\Mail\NotifyNewCandidatureToCandidatEmail;
use App\Mail\SendCandidatureRapport;
use App\Models\Campagne;
use App\Models\Candidature;
use App\Models\Entreprise;
use App\Models\State;
use App\Models\StateCandidature;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Throwable;

class CandidatureController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Gère l'affichage des candidatures d'une campagne
     * @author Mariama Fatou Sarr DIOP
     * @since 14/02/2022
     * @param $id, $itemsPerPage
     * @return \Illuminate\Http\Response
     */
    public function getCandidaturesPerCampagne(Campagne $campagne, $itemsPerPage)
    {
        $candidatures = Candidature::where('campagne_id', '=', $campagne->id)->with('user', 'currentState')->paginate($itemsPerPage);
        return CustomResponse::buildSuccessResponse($candidatures);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'source' => 'required',
            'cv' => 'required',
            'motivation' => 'required',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        // vérifier si le candidat n'a pas déja soumis son dossier
        $candidatures = Candidature::whereCampagneId($request->campagne_id)
            ->whereUserId(Auth::id())
            ->get();
        if (count($candidatures)) {
            return CustomResponse::buildErrorResponse("Vous avez déja postulé pour cette campagne...");
        }
        $candidature = new Candidature($request->all());
        $campagne = Campagne::find($candidature->campagne_id);
        $user = User::find(Auth::id());
        $candidature->user_id = $user->id;
        if ($request->exists('cv')) {
            $cvFile = FileHelper::getFileFromBase64($request->cv);
            $extensionCV = $cvFile->guessExtension();
            $fileName = $request->campagne_uid . '' . $user->email . '' . uniqid() . '.' . $extensionCV;
            $cvFile->storeAs('candidatures', $fileName);
            $candidature->cv = $fileName;
        }
        DB::beginTransaction();
        try {
            $state = new State();
            $state = $campagne->states->where('type', '=', 'initial')->first();
            $stateCandidature = new StateCandidature();
            $candidature->uid = uniqid();
            $candidature->save();
            $stateCandidature->state_id = $state->id;
            $stateCandidature->nomState = $state->nom;
            $stateCandidature->typeState = $state->type;
            $stateCandidature->user_id = $user->id;
            $candidature->stateCandidatures()->save($stateCandidature);
            Mail::to($user->email)->send(new NotifyNewCandidatureToCandidatEmail($candidature));
            $collaborateurs = $candidature->campagne->entreprise->collaborateurs;
            foreach ($collaborateurs as $collaborateur) {
                Mail::to($collaborateur->user->email)->send(new NotifyNewCandidatureToAdminEmail($collaborateur, $candidature));
            }
            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            return CustomResponse::buildErrorResponse("Une erreur est survenue lors de l'enregistrement...");
        }
        $candidature = Candidature::with('campagne')->find($candidature->id);
        return CustomResponse::buildSuccessResponse($candidature);
    }

    /**
     *
     */

     public function storeCandidatureSpontanee (Candidature $candidatureSpontanee, $request) {

        $validators = Validator::make($request->all(),[
            'poste' => 'required',
            'source' => 'required',
            'cv' => 'required',
            'motivation' => 'required',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $candidaturesSpontanee = Candidature::wherePoste($request->poste)
            ->whereUserId(Auth::id())
            ->get();
        if (count($candidaturesSpontanee)) {
            return CustomResponse::buildErrorResponse("Vous avez déja postulé pour ce poste...");
        }
        $candidatureSpontanee = new Candidature($request->all());
        $entreprise = Entreprise::whereUid($request->entreprise_uid)->first();
        $user = User::find(Auth::id());
        $candidatureSpontanee->user_id = $user->id;
        $candidatureSpontanee->entreprise_id = $entreprise->id;
        if ($request->exists('cv')) {
            $cvFile = FileHelper::getFileFromBase64($request->cv);
            $extensionCV = $cvFile->guessExtension();
            $fileName = $request->entreprise_id. $user->email . '_' . uniqid() . '.' . $extensionCV;
            $cvFile->storeAs('candidatures/spontanee', $fileName);
            $candidatureSpontanee->cv = $fileName;
        }
        DB::beginTransaction();
        try {
            $candidatureSpontanee->uid = uniqid();
            $candidatureSpontanee->save();
            DB::commit();
     } catch (Throwable $th) {
         throw $th;
         DB::rollback();
         return CustomResponse::buildErrorResponse("erreur");
     }
     return CustomResponse::buildSuccessResponse($entreprise);
    }


    /**
     * Display the specified resource.
     * Description Affiche la liste des candidatures d'un candidat
     *
     * @author Fatou DIOUF
     * @since 14.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-21
     *
     * @param  \App\Models\Candidature  $candidature
     * @return \Illuminate\Http\Response
     */
    public function show(Candidature $candidature)
    {
        return CustomResponse::buildSuccessResponse($candidature->load('user', 'stateCandidatures','currentState.state', 'campagne.entreprise'));
    }

    public function paginateCandidatureByUserId($itemPerPage)
    {
        $candidatures = Candidature::where('user_id', Auth::id())->with('campagne.entreprise')->paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($candidatures);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Candidature  $candidature
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Candidature $candidature)
    {
        try {
            $candidature->updateOrFail($request->all());
        } catch (Throwable $th) {
            throw $th;
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de la modification...");
        }
        return CustomResponse::buildSuccessResponse($candidature);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Candidature  $candidature
     * @return \Illuminate\Http\Response
     */
    public function destroy(Candidature $candidature)
    {
        //
    }

    /**
     * Permet l'envoi de rapport de dossier d'une candidature à un candidat spécifique.
     * @author Cheikh Tidiane GUEYE
     * @since 16.02.2022
     * @link https://recrutore.atlassian.net/browse/RAD-24
     * @param  \Illuminate\Http\Request  $request
     */
    public function sendRapport(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'id' => 'required|exists:candidatures,id',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $candidature = Candidature::find($request->id);
        try {
            Mail::to($candidature->user->email)->send(new SendCandidatureRapport($candidature));
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur est survenue lors de l'envoi...");
        }
        return CustomResponse::buildSuccessResponse("Rapport envoyé avec succès!");
    }

    /**
     * Permet l'envoi d'un email pour confirmer la réception d'une candidature à une camapgne
     * @author Cheikh Tidiane GUEYE
     * @since 17.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-51
     * @param \Illuminate\Http\Request  $request
     * @return App\Custom\CustomResponse;
     */
    public function sendConfirmReceptionEmail(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'id' => 'required|exists:candidatures,id',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        DB::beginTransaction();
        try {
            $candidature = Candidature::find($request->id);
            $user = User::find(Auth::id());
            $state = $candidature->currentState->state->whereCode("RCONF")->first();
            if ($state == null) {
                return CustomResponse::buildErrorResponse("Aucun state de campagne ayant comme code RCONF");
            }
            $stateCandidature = new StateCandidature();
            $stateCandidature->state_id = $state->id;
            $stateCandidature->nomState = $state->nom;
            $stateCandidature->typeState = $state->type;
            $stateCandidature->user_id = $user->id;
            $candidature->stateCandidatures()->save($stateCandidature);
            Mail::to($candidature->user->email)->send(new NotifyConfirmeReceptionToCandidatEmail($candidature));
            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            return CustomResponse::buildErrorResponse("Une erreur est survenue lors de l'envoi...");
        }
        return CustomResponse::buildSuccessResponse("Email de confirmation de la réception du dossier envoyé avec succès!");
    }

    public function getHistoricalStates(Candidature $candidature)
    {
        $statuts = StateCandidature::where('candidature_id', '=', $candidature->id)->get();
        return CustomResponse::buildSuccessResponse($statuts);
    }
}
