<?php

namespace App\Http\Controllers;

use App\Custom\CustomResponse;
use App\Models\DomaineIntervention;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Throwable;

class DomaineInterventionController extends Controller
{
    /**
     * Display a listing of the resource.
     * @author Cheikh Tidiane GUEYE
     * @since 25.01.22
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $domaineInterventions = DomaineIntervention::all();
        return CustomResponse::buildSuccessResponse($domaineInterventions);
    }

    /**
     * Display a listing of the resource.
     * @author Cheikh Tidiane GUEYE
     * @since 25.01.22
     *
     * @return \Illuminate\Http\Response
     */
    public function paginate($itemPerPage)
    {
        $domaineInterventions = DomaineIntervention::paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($domaineInterventions);
    }

    /**
     * Store a newly created resource in storage.
     * @author Cheikh Tidiane GUEYE
     * @since 25.01.22
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'nom' => 'required|unique:domaine_interventions,nom',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $domaineIntervention = new DomaineIntervention($request->all());
        try {
            $domaineIntervention->save();
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite pendant l'enregistrement...");
        }
        return CustomResponse::buildSuccessResponse($domaineIntervention);
    }

    /**
     * Update the specified resource in storage.
     * @author Cheikh Tidiane GUEYE
     * @since 25.01.22
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\DomaineIntervention  $domaineIntervention
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, DomaineIntervention $domaineintervention)
    {
        $validators = Validator::make($request->all(), [
            'nom' => 'required'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        try {
            $domaineintervention->update($request->all());
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur s'est produite pendant l'enregistrement");
        }
        return CustomResponse::buildSuccessResponse($domaineintervention);
    }

    /**
     * Remove the specified resource from storage.
     * @author Cheikh Tidiane GUEYE
     * @since 25.01.22
     *
     * @param   DomaineIntervention  $domaineIntervention
     * @return \Illuminate\Http\Response
     */
    public function destroy(DomaineIntervention $domaineintervention)
    {
        try {
            $domaineintervention->delete();
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de la suppression");
        }
        return CustomResponse::buildSuccessResponse("Domaine d'intervention supprimé avec succès");
    }
}
