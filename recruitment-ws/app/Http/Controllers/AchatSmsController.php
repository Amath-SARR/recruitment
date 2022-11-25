<?php

namespace App\Http\Controllers;

use App\Custom\CustomResponse;
use App\Custom\PaymentManager;
use App\Custom\PayTech;
use App\Models\AchatPackTemp;
use App\Models\AchatSms;
use App\Models\Entreprise;
use App\Models\SmsPack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AchatSmsController extends Controller
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
     * Store a newly created resource in storage.
     * @author Mariama Fatou Sarr DIOP
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'entreprise_id' => 'required|exists:entreprises,id',
            'sms_pack_id' => 'required|exists:sms_packs,id',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $achatPackTmp = new AchatPackTemp($request->all());
        $achatPackTmp->user_id = Auth::id();
        $achatPackTmp->uid = uniqid();
        DB::beginTransaction();
        try {
            $achatPackTmp->save();
            // generer le lien de paiement avec PayTech
            $paymentUrl =  PaymentManager::initPayment($achatPackTmp);
            DB::commit();
            return CustomResponse::buildSuccessResponse($paymentUrl);
        } catch (\Throwable $th) {
            DB::rollBack();
            return CustomResponse::buildErrorResponse("Une erreur est survenue...");
        }
    }

    /**
     * Display the specified resource.
     * @author Mariama Fatou Sarr DIOP
     * @param  \App\Models\achatSms  $achatSms
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        return CustomResponse::buildSuccessResponse(AchatSms::with('entreprise')->first());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\achatSms  $achatSms
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AchatSms $achatSms)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\achatSms  $achatSms
     * @return \Illuminate\Http\Response
     */
    public function destroy(AchatSms $achatSms)
    {
        //
    }

    /**
     * Permet de recevoir les notifications de payement générées par l'API de paiement
     * @author Mariama Fatou Sarr DIOP
     * @since 11/02/2022
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getPaymentNotification(Request $request)
    {
        $request->validate([
            'ref_command' => 'exists:achat_pack_temps,uid',
            'type_event' => 'required'
        ]);
        if ($request->input('type_event') == "sale_complete") {
            $achatSms = new AchatSms();
            $achatSmsTemp = AchatPackTemp::where('uid', $request->ref_command)->first();
            $achatSms->entreprise_id = $achatSmsTemp->entreprise_id;
            $achatSms->sms_pack_id = $achatSmsTemp->sms_pack_id;
            $achatSms->user_id = $achatSmsTemp->user_id;
            $achatSms->uid = uniqid();
            $achatSms->montant = $request->input('item_price');
            $achatSms->payment_method = $request->input('payment_method');
            $achatSms->ref_command = $request->input('ref_command'); //ref_command = uid achatpacktemp
            $achatSms->currency = $request->input('currency');
            $achatSms->type_event = $request->input('type_event');
            $achatSms->env = $request->input('env');
            $achatSms->client_phone = $request->input('client_phone');
            $achatSms->nombre_sms = $achatSmsTemp->smsPack->nombreSms;
            DB::beginTransaction();
            try {
                $achatSmsTemp->deleteOrFail();
                $achatSms->save();
                $achatSms->entreprise->solde_sms = $achatSms->entreprise->solde_sms + $achatSms->nombre_sms;
                $achatSms->entreprise->update();
                DB::commit();
                return CustomResponse::buildSuccessResponse($achatSms);
            } catch (\Throwable $th) {
                DB::rollBack();
                return CustomResponse::buildErrorResponse("Une erreur est survenue...");
            }
        }
    }

    /**
     * Génére un nouveau achatSmsTemp si l'ancien avait échoué
     * @author Mariama Fatou Sarr DIOP
     * @since 11/02/2022
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function restore(AchatPackTemp $achatPackTemp)
    {
        $achatSmsTemp = new AchatPackTemp();
        $achatSmsTemp->sms_pack_id = $achatPackTemp->sms_pack_id;
        $achatSmsTemp->entreprise_id = $achatPackTemp->entreprise_id;
        $achatSmsTemp->user_id = $achatPackTemp->user_id;
        $achatSmsTemp->uid = uniqid();
        DB::beginTransaction();
        try {
            $achatPackTemp->deleteOrFail();
            $achatSmsTemp->save();
            // generer le lien de paiement avec PayTech
            $paymentUrl =  PaymentManager::initPayment($achatSmsTemp);
            DB::commit();
            return CustomResponse::buildSuccessResponse($paymentUrl);
        } catch (\Throwable $th) {
            DB::rollBack();
            return CustomResponse::buildErrorResponse("Une erreur est survenue...");
        }
    }

}
