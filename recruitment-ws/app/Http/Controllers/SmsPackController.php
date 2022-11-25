<?php

namespace App\Http\Controllers;

use App\Models\SmsPack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Throwable;
use App\Custom\CustomResponse;
class SmsPackController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $smsPacks = SmsPack::all();
        return CustomResponse::buildSuccessResponse($smsPacks);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
            'nom' => 'required|unique:sms_packs,nom',
            'nombreSms' => 'required|numeric|gt:0|unique:sms_packs,nombreSms',
            'montant' => 'required|numeric|gt:0|unique:sms_packs,montant',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $smsPack = new SmsPack($request->all());
        try {
            $smsPack->save();
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite pendant l'enregistrement...");
        }
        return CustomResponse::buildSuccessResponse($smsPack);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SmsPack  $smsPack
     * @return \Illuminate\Http\Response
     */
    public function show(SmsPack $smsPack)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SmsPack  $smsPack
     * @return \Illuminate\Http\Response
     */
    public function edit(SmsPack $smsPack)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SmsPack  $smspack
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SmsPack $smspack)
    {
        $validators = Validator::make($request->all(), [
            'nom' => Rule::unique('sms_packs')->ignore($smspack),
            'nombreSms' => Rule::unique('sms_packs')->ignore($smspack),
            'montant' => Rule::unique('sms_packs')->ignore($smspack),
            'nombreSms' => 'numeric|gt:0',
            'montant' => 'numeric|gt:0'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        try {
            $smspack->update($request->all());
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de la modification...");
        }
        return CustomResponse::buildSuccessResponse($smspack);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SmsPack  $smspack
     * @return \Illuminate\Http\Response
     */
    public function destroy(SmsPack $smspack)
    {
        try {
            $smspack->delete();
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de suppression...");
        }
        return CustomResponse::buildSuccessResponse($smspack);
    }

    /**
     *
     * @author El Hadji Amath SARR
     * @link https://recrutore.atlassian.net/browse/RAD-95
     * @since 29.01.22
     * @param mixed $itemPerPage
     * @return array
     * @description Gère la pagination en affichant le nombre d'éléments mis en paramètre
     */
    public function paginate($itemPerPage)
    {
        $smsPacks = SmsPack::paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($smsPacks);
    }
}
