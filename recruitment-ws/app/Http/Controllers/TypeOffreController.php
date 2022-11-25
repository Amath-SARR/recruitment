<?php

namespace App\Http\Controllers;

use App\Models\TypeOffre;
use Illuminate\Http\Request;
use App\Custom\CustomResponse;
use Illuminate\Support\Facades\Validator;
use Throwable;




/**
 * @author Fatou Diouf, M. FOFANA
 * @since last update 31.01.22
 */
class TypeOffreController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @author Fatou Diouf
     * @since 26.01.22
     * @link https://recrutore.atlassian.net/browse/RAD-100
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $typeOffres = TypeOffre::all();
        return CustomResponse::buildSuccessResponse($typeOffres);
    }

    /**
     *
     * Display a listing of the resource.
     * @author Fatou DIOUF
     * @since 26.01.22
     *
     * @return \Illuminate\Http\Response

     */

    public function paginate($itemPerPage)
    {
        $typeOffres = TypeOffre::paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($typeOffres);
    }

    /**
     * Store a newly created resource in storage.
     *
     *
     * @author Fatou Diouf
     * @since 26.01.22
     * @link https://recrutore.atlassian.net/browse/RAD-100
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $validators = Validator::make($request->all(), [
            'name' => 'required|unique:type_offres,name',
            'type' => 'required',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $typeoffre = new TypeOffre($request->all());

        try {
            $typeoffre->save();
        } catch (Throwable $th) {

            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite pendant l'ajout...");
        }

        return CustomResponse::buildSuccessResponse($typeoffre);
    }

    /**
     * Display the specified resource.
     *
     * @author Fatou Diouf
     * @since 26.01.22
     *
     * @param  \App\Models\TypeOffre  $typeoffre
     * @return \Illuminate\Http\Response
     */
    public function show(TypeOffre $typeoffre)
    {
        return CustomResponse::buildSuccessResponse($typeoffre);
    }

    /**
     * Update the specified resource in storage.
     *
     * @author Fatou Diouf
     * @since 26.01.22
     * @link https://recrutore.atlassian.net/browse/RAD-100
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TypeOffre  $typeoffre
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TypeOffre $typeoffre)
    {
        $validators = Validator::make($request->all(), [
            'name' => 'required|unique:type_offres,name,'.$typeoffre->id,
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }

        try {

            $typeoffre->update($request->all());
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de l'édition...");
        }
        return CustomResponse::buildSuccessResponse($typeoffre);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @author Fatou Diouf
     * @since 26.01.22
     * @link https://recrutore.atlassian.net/browse/RAD-100
     *
     * @param  \App\Models\TypeOffre  $typeoffre
     * @return \Illuminate\Http\Response
     */
    public function destroy(TypeOffre $typeoffre)
    {
        try {

            $typeoffre->delete();
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite pendant la suppression du type d'offre");
        }
        return CustomResponse::buildSuccessResponse($typeoffre);
    }
}
