<?php

namespace App\Http\Controllers;

use App\Custom\CustomResponse;
use App\Custom\FileHelper;
use App\Models\CampagneState;
use App\Models\Campagne;
use App\Models\CampagneHashtag;
use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Throwable;
use Illuminate\Support\Str;

class CampagneController extends Controller
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
     * Renvoie toutes les campagnes ratatchées aux différentes campagnes de l'utilisateur connecté
     * @author Alioune Badara FAM
     * @since 09.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-112
     * @return array
     */
    public function findCampagnesUserConnected()
    {
        return CustomResponse::buildSuccessResponse(auth()->user()->campagnes_connected_user);
    }

    /**
     * Enregistre l'invite comme user de meme le définit comme collaborateur de l'campagne concerne
     * @author El Hadji Amath SARR
     * @since 08.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-10
     * @return \Illuminate\Http\Response
     */
    public function getActiveCampagnes()
    {
        $dateDuJour = date('Y-m-d');
        $campagnes = campagne::where('dateLancement', '<=', $dateDuJour)
            ->where('dateCloture', '>=', $dateDuJour)
            ->with('entreprise')
            ->get();
        return CustomResponse::buildSuccessResponse($campagnes);
    }

    /**
     * fonction qui renvoie les campagnes actives en fonction du filtre
     * @author Mamadou Fam
     * @since 10.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-67
     * @return \Illuminate\Http\Response
     */
    public function FiltreActiveCampagnes(Request $request)
    {
        $dateDuJour = date('Y-m-d');
        $campagne_actives = Campagne::where('dateLancement', '<=', $dateDuJour)
            ->where('dateCloture', '>=', $dateDuJour);
        if ($request->type_offre_ids != null) {
            $resultat_filtres = $campagne_actives->whereHas('type_offres', function ($query) use ($request) {
                $query->whereIn('type_offre_id', $request->type_offre_ids);
            })->get();
        }
        if ($request->hashtag_ids != null) {
            if ($request->type_offre_ids != null) {
                $resultat_filtres = $campagne_actives->whereHas('hashtags', function ($query) use ($request) {
                    $query->whereIn('hashtag_id', $request->hashtag_ids);
                })->find($resultat_filtres->pluck('id'));
            } else {
                $resultat_filtres = $campagne_actives->whereHas('hashtags', function ($query) use ($request) {
                    $query->whereIn('hashtag_id', $request->hashtag_ids);
                })->get();
            }
        }
        if ($request->categorie_emploi_ids != null) {
            if ($request->type_offre_ids != null || $request->hashtag_ids != null) {
                $resultat_filtres = $campagne_actives->whereHas('categorieEmploi', function ($query) use ($request) {
                    $query->whereIn('id', $request->categorie_emploi_ids);
                })->find($resultat_filtres->pluck('id'));
            } else {
                $resultat_filtres = $campagne_actives->whereHas('categorieEmploi', function ($query) use ($request) {
                    $query->whereIn('id', $request->categorie_emploi_ids);
                })->get();
            }
        }
        return CustomResponse::buildSuccessResponse($resultat_filtres->load('entreprise'));
    }

    /**
     *  Recupere l'id de l'entreprise pour afficher ses campagnes
     * @author Fatou Diouf
     * @since 10.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-39
     * @return \Illuminate\Http\Response
     */

    public function paginateCampagneById($itemPerPage, $entrepriseId)
    {
        $campagnes = Campagne::where('entreprise_id', '=', $entrepriseId)->orderBy('titre', 'asc')->orderBy('lieu', 'asc')->paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($campagnes);
    }

    /**
     * @author Moussa FOFANA
     * @since 01.02.22
     */

    public function paginate($itemPerPage)
    {
        $campagnes = Campagne::with('entreprise')->paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($campagnes);
    }

    /**
     * Store a newly created resource in storage.SELECT DATEDIFF($this->dateLancement, $this->dateCloture)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'titre' => 'required|unique:campagnes,titre',
            'lieu' => 'required',
            'photo' => 'required',
            'dateLancement' => 'required',
            'dateCloture' => 'required',
            'description' => 'required',
            'stateIds' => 'required|array|min:3'
        ]);

        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }

        $campagne = new Campagne($request->all());
        $campagne->uid = uniqid();
        if ($request->exists('photo')) {
            $photoFile = FileHelper::getFileFromBase64($request->photo);
            $extension = $photoFile->guessExtension();
            $filename = Str::snake($request->titre) . '_' . uniqid() . '.' . $extension;
            $photoFile->storeAs('campagnes', $filename);
            $campagne->photo = $filename;
        }

        DB::beginTransaction();
        try {
            $campagne->user_id = Auth::id();
            $campagne->save();
            $campagne->type_offres()->attach($request->array_id_types_offres_selected);
            $index = 0;
            foreach ($request->stateIds as $stateId) {
                $index++;
                $campagneState = new CampagneState();
                $campagneState->state_id = $stateId;
                $campagneState->ordre = $index;
                $campagne->campagneStates()->save($campagneState);
            }
            foreach ($request->hashtagIds as $hashtagId) {
                $campagneHashtag = new CampagneHashtag();
                $campagneHashtag->hashtag_id = $hashtagId;
                $campagne->campagneHashtags()->save($campagneHashtag);
            }
            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            throw $th;
            return CustomResponse::buildErrorResponse("Une erreur est survenue pendant l'ajout de la campagne...");
        }
        return CustomResponse::buildSuccessResponse($campagne);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Campagne  $campagne
     * @return \Illuminate\Http\Response
     */
    public function show(Campagne $campagne)
    {
        return CustomResponse::buildSuccessResponse($campagne->load('user', 'entreprise', 'candidature.user', 'candidature.currentState.state', 'categorieEmploi'));
    }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Campagne  $campagne
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Campagne $campagne)
    {
        $validators = Validator::make($request->all(), [
            'titre' => 'required',
            'description' => 'required',
            'dateLancement' => 'required',
            'dateCloture' => 'required',
            'lieu' => 'required'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        DB::beginTransaction();
        try {
            $campagne->updateOrFail($request->all());
            DB::commit();
            return CustomResponse::buildSuccessResponse($campagne);
        } catch (Throwable $th) {
            throw $th;
            DB::rollback();
            return CustomResponse::buildErrorResponse("Une erreur s'est produite pendant l'enregistrement");
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Campagne  $campagne
     * @return \Illuminate\Http\Response
     */
    public function destroy(Campagne $campagne)
    {
        // verifier s'il n'ya pas de candidatures (à implémenter plus tard)
        DB::beginTransaction();
        try {
            if ($campagne->photo) {
                Storage::delete('campagnes/' . $campagne->photo);
            }
            // supprimer tous les élements rattachés / à implémenter plus tard
            $campagne->delete();
            DB::commit();
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollback();
            return CustomResponse::buildErrorResponse("Une erreur est survenue !!!");
        }

        return CustomResponse::buildSuccessResponse($campagne);
    }


    /**
     * Renvoie les campagnes similaires à la campagne dont l'id passé en paramètre selon la catégorie d'emploi puis pagine le résultat
     * Renvoie aussi la catégorie d'emploi qui les relies
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 14.02.22
     * @param int
     * @param int
     * @return array
     */
    public function paginateSimilarCampagnes(Campagne $campagne, $itemPerPage)
    {
        return CustomResponse::buildSuccessResponse(
            Campagne::whereCategorieEmploiId($campagne->categorie_emploi_id)
                ->where('id', '!=', $campagne->id)
                ->with('entreprise', 'categorieEmploi')
                ->paginate($itemPerPage)
        );
    }

    /**
     * Récupère tous les statuts de la campagne passée en paramètre en les triant en fonction de leur ordre
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 18.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-124
     * @param Campagne
     * @return array
     */
    public function getCurrentCampagneStates(Campagne $campagne)
    {
        return CustomResponse::buildSuccessResponse($campagne->states()->orderBy('ordre')->get());
    }

    /**
     * Récupère tous les statuts n'ayant pas été sélectionnés lors de la création de la campagne courante
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 18.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-124
     * @param Campagne
     * @return array
     */
    public function getNotSelectedCurrentCampagneStates(Campagne $campagne)
    {
        $states = State::whereNotIn('id', $campagne->states->pluck('id'))->get();
        return CustomResponse::buildSuccessResponse($states);
    }

    /**
     * Met à jour les statuts d'une campagne
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 18.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-124
     * @param Request
     * @param Campagne
     * @return array
     */
    public function updateCurrentCampagneState(Request $request, Campagne $campagne)
    {
        DB::beginTransaction();
        try {
            foreach ($request->stateIds as $stateId) {
                if ($campagne->campagneStates->where('state_id', $stateId)->isNotEmpty()) {
                    $campagneState = $campagne->campagneStates()->where('state_id', $stateId);
                    $campagneState->update(array("state_id" => $stateId));
                } else {
                    $campagneState = new CampagneState();
                    $campagneState->state_id = $stateId;
                    $state = State::find($stateId);
                    $campagneState->ordre = $state->ordre;
                    $campagne->campagneStates()->save($campagneState);
                }
            }

            $campagneRemoveStates =  $campagne->campagneStates->whereNotIn('state_id', $request->stateIds);
            foreach ($campagneRemoveStates as $campagneRemoveState) {
                $campagneRemoveState->delete();
            }
            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            return CustomResponse::buildErrorResponse("Une erreur est survenue lors de la modification des statuts de cette campagne...");
        }
        return CustomResponse::buildSuccessResponse("Mise à jour effectuée avec succès");
    }
}
