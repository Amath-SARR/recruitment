<?php

namespace App\Http\Controllers;

use App\Custom\CustomResponse;
use App\Mail\PasswordResetEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class PasswordResetController extends Controller
{
    /**
     * envoi un lien de reinitialisation à l'utilisateur lorsque son mail est valide.
     * @author MAMADOU LAMINE BEYE
     * @since 30.01.22
     * @lastUpdate Moussa FOFANA on 31.01.22
     * @link https://recrutore.atlassian.net/browse/RAD-33
     * @return App\Custom\CustomResponse;
     */
    public function sendLink(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'email' => 'email|required|exists:users,email',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        DB::beginTransaction();
        try {
            //code...
            $user = User::whereEmail($request->email)->first();
            $user->update(['confirmationToken' => uniqid()]);
            DB::commit();
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollback();
            return CustomResponse::buildErrorResponse("Erreur survenue lors de la génération du token");
        }

        Mail::to($user)->send(new PasswordResetEmail($user));
        return CustomResponse::buildSuccessResponse("un mail vous a été envoyé pour rénitialiser votre mot de passe");
    }

    /**
     * permet de mettre à jour le mot de passe de l'utilisateur.
     * @author MAMADOU LAMINE BEYE
     * @since 30.01.22
     * @link https://recrutore.atlassian.net/browse/RAD-33
     * @param email
     * @param password
     * @return App\Custom\CustomResponse
     */
    public function updatePassword(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'email' => 'email|required',
            'password' => 'required|min:6|confirmed',
            'confirmationToken'=>'required|exists:users,confirmationToken'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $userData = User::where('confirmationToken', $request->confirmationToken)->first();

        if ($userData == null) {
            return CustomResponse::buildErrorResponse("Vous n'avez pas de compte associé à cette adresse mail");
        }
        // update password
        $userData->update([
            'password' => Hash::make($request->password),
            'confirmationToken' => ''
        ]);
        return CustomResponse::buildSuccessResponse("Mot de passe mis à jour !");
    }
    /**
     * verifie si le token est valide
     * @author MAMADOU LAMINE BEYE
     * @since 30.01.22
     * @link https://recrutore.atlassian.net/browse/RAD-33
     * @return App\Custom\CustomResponse
     */
    public function verifyToken(Request $request)
    {
        // partie ajoutée par M. FOFANA
        // s'assurer de la validité de l'existance du token
        $validators = Validator::make($request->all(),[
            'confirmationToken'=>'required|exists:users,confirmationToken'
        ]);
        if($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $userData = User::where('confirmationToken', $request->confirmationToken)->first();

        if ($userData != null) {
            return CustomResponse::buildSuccessResponse($userData);
        }
        return CustomResponse::buildErrorResponse("Lien expiré ou token invalide");
    }
}
