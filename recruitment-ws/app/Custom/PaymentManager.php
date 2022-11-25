<?php

namespace App\Custom;

use App\Models\AchatPackTemp;
use App\Models\AchatSms;
use App\Models\AchatSmsTmp;
use App\Models\ProfilConcerne;
use App\Models\SouscriptionTemp;
use Error;

class PaymentManager
{

   public static function initPayment(AchatPackTemp $achatPackTemp)
    {
        $jsonResponse = (new PayTech(config('paytech.api.key'), config('paytech.api.secret')))->setQuery([
            'item_name' => $achatPackTemp->smsPack->nom,
            'item_price' => $achatPackTemp->smsPack->montant,
            'command_name' => "Paiement {$achatPackTemp->smsPack->nom}",
        ])->setCustomeField([
            'time_command' => time(),
            'ip_user' => $_SERVER['REMOTE_ADDR'],
            'lang' => $_SERVER['HTTP_ACCEPT_LANGUAGE']
        ])
            ->setTestMode(config('paytech.mode'))
            ->setCurrency('xof')
            ->setRefCommand($achatPackTemp->uid)
            ->setNotificationUrl([
                'ipn_url' => config('app.url') . '/api/achatsms_pin', //only https
                'success_url' => config('app.fronturl') . "/achatsms/{$achatPackTemp->uid}/confirmation",
                'cancel_url' => config('app.fronturl') . "/achatsms/{$achatPackTemp->uid}/error"
            ])->send();
            //return $jsonResponse;
        if ($jsonResponse['success'] == 1) {
            return $jsonResponse['redirect_url'];
        }
        throw new Error("Une erreur est survenue lors de la connexion avec la plateforme de paiement...");
    }

   /* public static function initSmsPayment(AchatSmsTmp $achatSmsTmp)
    {
        $jsonResponse = (new PayTech(config('paytech.api.key'), config('paytech.api.secret')))->setQuery([
            'item_name' => "Achat Pack SMS - ".$achatSmsTmp->packSms->nom,
            'item_price' => $achatSmsTmp->montant,
            'command_name' => "Achat Pack SMS - {$achatSmsTmp->packSms->nom}",
        ])->setCustomeField([
            'time_command' => time(),
            'ip_user' => $_SERVER['REMOTE_ADDR'],
            'lang' => $_SERVER['HTTP_ACCEPT_LANGUAGE']
        ])
            ->setTestMode(config('paytech.mode'))
            ->setCurrency('xof')
            ->setRefCommand($achatSmsTmp->uid)
            ->setNotificationUrl([
                'ipn_url' => config('paytech.base.url') . '/achat_sms_pin', //only https
                'success_url' => config('paytech.base.url') . '/paymentconfirmation?state=success&id=' . $achatSmsTmp->id,
                'cancel_url' => config('paytech.base.url') . '/paymentconfirmation?state=cancel&id=' . $achatSmsTmp->id
            ])->send();
        if ($jsonResponse['success'] == 1) {
            return $jsonResponse['redirect_url'];
        }
        throw new Error("Une erreur est survenue lors de la connexion avec la plateforme de paiement...");
    } */
}
