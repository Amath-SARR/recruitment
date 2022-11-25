<?php

namespace App\Http\Controllers;

use App\Custom\CustomResponse;
use App\Custom\FileHelper;
use App\Models\AchatSms;
use App\Models\Collaborateur;
use App\Models\Entreprise;
use App\Models\EntrepriseDomaineIntervention;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Throwable;

class EntrepriseController extends Controller
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
     * @author Fatou DIOUF
     * @since 01.02.22
     */

    public function paginate($itemPerPage)
    {
        $entrepriseAdminLists = Entreprise::paginate($itemPerPage);
        $entrepriseUserLists = Entreprise::paginate($itemPerPage);
        $entrepriseAdminLists = Entreprise::with(['user'])->paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($entrepriseAdminLists);
        return CustomResponse::buildSuccessResponse($entrepriseUserLists);
        $entreprises = Entreprise::with(['user'])->paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($entreprises);
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
            'name' => 'required|unique:entreprises,name',
            'telephone' => 'required|starts_with:+|min:8',
            'email' => 'email|required',
            'logo' => 'required',
            'siteWeb' => 'required',
            'adresse' => 'required',
            'presentation' => 'required'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $entreprise = new Entreprise($request->all());
        $entreprise->user_id = Auth::id();
        $entreprise->enabled = true;
        $entreprise->uid = uniqid();
        DB::beginTransaction();
        try {
            if ($request->exists('logo')) {
                $photoFile = FileHelper::getFileFromBase64($request->logo);
                $extension = $photoFile->guessExtension();
                $filename = $request->email . '_' . uniqid() . '.' . $extension;
                $photoFile->storeAs('entreprises', $filename);
                $entreprise->logo = $filename;
            }
            $entreprise->save();
            foreach ($request->domaineInterventionIds as $domaineInterventionId) {
                $entrepriseDomaineIntervention = new EntrepriseDomaineIntervention();
                $entrepriseDomaineIntervention->domaine_intervention_id = $domaineInterventionId;
                $entreprise->entrepriseDomaineInterventions()->save($entrepriseDomaineIntervention);
            }
            // ajouter l'utilisateur comme collaborateur
            $collaborateur = new Collaborateur(['user_id' => Auth::id(), 'type' => 'owner']);
            $entreprise->collaborateurs()->save($collaborateur);
            DB::commit();
        } catch (Throwable $th) {
            DB::rollback();
            return CustomResponse::buildErrorResponse("Une erreur est survenue lors de l'ajout...");
        }
        return CustomResponse::buildSuccessResponse($entreprise);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Illuminate\Http\Response
     */
    public function show(Entreprise $entreprise)
    {
        return CustomResponse::buildSuccessResponse($entreprise);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Entreprise $entreprise)
    {
        $validators = Validator::make($request->all(), [
            'name' => 'required|unique:entreprises,name,' . $entreprise->id,
            'domaine_entreprise_id' => 'exists:domaine_entreprises,id',
            'telephone' => 'required|starts_with:+|min:12',
            'email' => 'email|required',
            'siteWeb' => 'required',
            'adresse' => 'required',
            'presentation' => 'required'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        DB::beginTransaction();
        try {
            $entreprise->update($request->all());
            DB::commit();
            return CustomResponse::buildSuccessResponse($entreprise);
        } catch (Exception $e) {
            DB::rollback();
            return CustomResponse::buildValidationErrorResponse("Une erreur est survenue...");
        }
    }

    /**
     * Permet de faire la mise à jour du logo d'une entreprise
     * @author Mariama Fatou Sarr DIOP
     * @since 03.02.22
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Illuminate\Http\Response
     */
    public function updateLogo(Request $request, Entreprise $entreprise)
    {
        DB::beginTransaction();
        try {
            if ($request->exists('logo')) {
                if ($entreprise->logo) {
                    Storage::delete('entreprises/' . $entreprise->logo);
                }
                $photoFile = FileHelper::getFileFromBase64($request->logo);
                $extension = $photoFile->guessExtension();
                $filename = $request->email . '_' . uniqid() . '.' . $extension;
                $photoFile->storeAs('entreprises', $filename);
                $entreprise->logo = $filename;
                $entreprise->update();
                DB::commit();
                return CustomResponse::buildSuccessResponse($entreprise);
            }
        } catch (Exception $e) {
            DB::rollback();
            return CustomResponse::buildValidationErrorResponse("Une erreur est survenue...");
        }
    }



    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Illuminate\Http\Response
     */
    public function destroy(Entreprise $entreprise)
    {
        DB::beginTransaction();
        try {
            if ($entreprise->logo) {
                Storage::delete('entreprises/' . $entreprise->logo);
            }
            $entreprise->entrepriseDomaineInterventions()->delete();
            $entreprise->collaborateurs()->delete();
            $entreprise->delete();
            DB::commit();
            return CustomResponse::buildSuccessResponse($entreprise);
        } catch (Throwable $th) {
            DB::rollback();
            return CustomResponse::buildErrorResponse("Une erreur s'est produite lors de la suppresion...");
        }
    }

    /**
     * Gère l'affichage des entreprises actives au niveau de l'acceuil
     * @author Mariama Fatou Sarr DIOP
     * @since 01/02/2022
     * @link https://recrutore.atlassian.net/browse/RAD-11
     * @return @return \Illuminate\Http\Response
     */
    public function getActiveEntreprises()
    {
        $entreprises = Entreprise::where('enabled', true)->get();
        return CustomResponse::buildSuccessResponse($entreprises);
    }

    /**
     * Mettre a jour le mot de passe de l'utilisateur
     * @author : Abdou Aziz Sy NDIAYE
     * @since : 04/02/2022
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function findEntrepriseUserConnected()
    {
        return CustomResponse::buildSuccessResponse(auth()->user()->entreprises);
    }
    /**
     * @author ALioune Badara FAM
     * @copyright ABF
     * @since 09.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-96
     * @description Recupère les entreprises suivies par l'utilisateur connecté
     * @returns void
     */
    public function findEntreprisesFollowed()
    {
        return CustomResponse::buildSuccessResponse(auth()->user()->followed_entreprises);
    }
}
