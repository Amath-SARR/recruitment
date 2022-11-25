<?php

namespace App\Http\Controllers;

use App\Custom\CustomResponse;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;


class SocialAuthController extends Controller
{
    /**
     * Gere la connexion via le reseau social de l'utilisateur
     * @author Mamadou lamine Beye
     * @since 01.02.2022
     * @link https://recrutore.atlassian.net/browse/RAD-107
     * @return \Illuminate\Http\Response
     */
    public function socialLogin(Request $request)
    {
        $provider = $request->provider;

        if ($provider == null) {
            return CustomResponse::buildErrorResponse("Provider is missing");
        }

        $account = SocialAccount::where("provider_user_id", $request->id)
            ->where("provider", $provider)
            ->with('user')->first();

        if ($account) {
            $user = User::whereEmail($request->email)->first();
            $token =  $user->createToken('socialLogin')->plainTextToken;
            return CustomResponse::buildSuccessResponse(['token' => $token, 'user' => $user]);
        } else {
            // creer new user and social login if user with social id not found.
            $user = User::whereEmail($request->email)->first();
            if (!$user) {
                // creer un nouvel utilisateur si le user n'existe pas.
                $user = new User;
                switch ($provider) {
                    case SocialAccount::SERVICE_FACEBOOK:
                        $user->name = $request['name'];
                        break;
                    case SocialAccount::SERVICE_GOOGLE:
                        $user->name = $request['name'];
                        break;
                    default:
                }
                $user->email = $request->email;
                $user->social = true;
                $user->email_verified_at = now();
                $user->save();
            }
            $social_account = new SocialAccount();
            $social_account->provider = $provider;
            $social_account->provider_user_id = $request->id;
            $user->social_accounts()->save($social_account);
            $token =  $user->createToken('socialLogin')->plainTextToken;

            return CustomResponse::buildSuccessResponse(['token' => $token, 'user' => $user]);
        }
    }

}
