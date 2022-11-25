<?php

namespace App\Http\Controllers;

use App\Models\Hashtag;
use App\Custom\CustomResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Throwable;

class HashtagController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 25.01.22
     * @return array
     */
    public function index()
    {
        $hashtags = Hashtag::all();
        return CustomResponse::buildSuccessResponse($hashtags);
    }

    /**
     *
     * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 25.01.22
     * @param mixed $itemPerPage
     * @return array
     * @description Gère la pagination en affichant le nombre d'éléments mis en paramètre
     */
    public function paginate($itemPerPage)
    {
        $hashtags = Hashtag::paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($hashtags);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 25.01.22
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function store(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'nom' => 'required|unique:hashtags,nom'
        ]);

        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }

        $hashtag = new Hashtag($request->all());
        try {
            $hashtag->save();
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite pendant l'ajout...");
        }
        return CustomResponse::buildSuccessResponse($hashtag);
    }

    /**
     * Update the specified resource in storage.
     *
     * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 25.01.22
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Hashtag  $hashtag
     * @return array
     */
    public function update(Request $request, Hashtag $hashtag)
    {
        $validators = Validator::make($request->all(), [
            'nom' => 'required|unique:hashtags,nom'
        ]);

        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }

        try {
            $hashtag->update($request->all());
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de l'édition...");
        }
        return CustomResponse::buildSuccessResponse($hashtag);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 25.01.22
     * @param  \App\Models\Hashtag  $hashtag
     * @return array
     */
    public function destroy(Hashtag $hashtag)
    {
        try {
            $hashtag->delete();
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de la suppresion...");
        }
        return CustomResponse::buildSuccessResponse($hashtag);
    }
}
