<?php

namespace App\Http\Controllers;

use App\Custom\CustomResponse;
use App\Custom\FileHelper;
use App\Mail\AccountConfirmEmail;
use App\Mail\SendUsersMail;
use App\Models\Collaborateur;
use App\Models\Entreprise;
use App\Models\Invitation;
use App\Models\User;
use Spatie\QueryBuilder\AllowedFilter;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Throwable;

class UserController extends Controller
{
    /**
     * Envoi de mail composé d'objet et de description à un type d'utilisateur spécifique ou à tous les utilisateurs.
     * @author Cheikh Tidiane GUEYE
     * @since 02.02.22
     * @param  Request  $request
     * @return App\Custom\CustomResponse;
     */
    public function sendMessage(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'objet' => 'required',
            'typeUser' => 'required',
            'description' => 'required',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        try {
            if ($request->typeUser == "all") {
                $usersMessage = User::get('email');
            } else if ($request->typeUser == "admin") {
                $usersMessage = User::whereType('admin')->get('email');
            } else if ($request->typeUser == "candidat") {
                $usersMessage = User::whereType('candidat')->get('email');
            } else if ($request->typeUser == "selection") {
                for ($i = 0; $i < count($request->selectedEmails); $i++) {
                    Mail::to($request->selectedEmails[$i])->send(new SendUsersMail($request));
                }
                return CustomResponse::buildSuccessResponse("Message envoyé avec succès!");
            }
            for ($i = 0; $i < count($usersMessage); $i++) {
                Mail::to($usersMessage[$i]->email)->send(new SendUsersMail($request));
            }
        } catch (\Throwable $th) {
            return CustomResponse::buildErrorResponse("Erreur survenue lors de l'envoi du message");
        }
        return CustomResponse::buildSuccessResponse("Message envoyé avec succès!");
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        return CustomResponse::buildSuccessResponse($users);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function paginate($itemPerPage)
    {
        $users = User::paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($users);
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
            'name' => 'required',
            'email' => 'email|required|unique:users,email',
            'telephone' => 'starts_with:+|min:8|required',
            'profession' => 'required',
            'password' => 'required|min:6|confirmed'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $user = new User($request->all());
        $user->password = Hash::make($request->password);
        $user->confirmationToken = uniqid();
        DB::beginTransaction();
        try {
            $user->save();
            if (!Auth::attempt($request->only('email', 'password'))) {
                return CustomResponse::buildErrorResponse(["Une erreur est survenue pendant la création du compte"]);
            }
            $token = $request->user()->createToken($request->name);
            DB::commit();
            Mail::to($user)->send(new AccountConfirmEmail($user));
            return CustomResponse::buildSuccessResponse(['token' => $token->plainTextToken, 'user' => $user]);
        } catch (Throwable $th) {
            DB::rollBack();
            return CustomResponse::buildErrorResponse("Une erreur est survenue pendant votre inscription, merci de contacter l'administrateur...");
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeAdmin(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'name' => 'required|min:2',
            'profession' => 'required',
            'telephone' => 'required|starts_with:+|min:8',
            'email' => 'email|unique:users,email'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $user = new User($request->all());
        $user->password = Hash::make(random_bytes(8));
        $user->type = 'admin';
        DB::beginTransaction();
        try {
            // vérifier si l'utilisateur a une photo
            if ($request->exists('photo')) {
                // convertir la photo en base64
                $photoFile = FileHelper::getFileFromBase64($request->photo);
                $extension = $photoFile->guessExtension();
                $filename = $request->email . '.' . $extension;
                $photoFile->storeAs('users', $filename);
                $user->photo = $filename;
            }
            $user->save();
            DB::commit();
        } catch (Throwable $th) {
            DB::rollback();
            throw $th;
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite pendant l'enregistrement...");
        }
        return CustomResponse::buildSuccessResponse($user);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return CustomResponse::buildSuccessResponse($user);
    }

    /**
     * Mettre a jour le nom, la profession, le telephone,l'email de l'utilisateur
     * @author : Mamadou Fam
     * @since : 26/01/2021
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $validators = Validator::make($request->all(), [
            'name' => 'required|min:2',
            'profession' => 'required',
            'telephone' => 'required|starts_with:+',
            'presentation' => 'required'
        ]);

        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        DB::beginTransaction();
        try {
            $user->update($request->all());
            DB::commit();
        } catch (Throwable $th) {
            DB::rollback();
            throw $th;
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite pendant l'enregistrement...");
        }
        return CustomResponse::buildSuccessResponse($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @author Alioune Badara FAM
     * @copyright ABF
     * @since 27.01.22
     * @param  \App\Models\User  $user
     * @return array
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de la suppresion...");
        }
        return CustomResponse::buildSuccessResponse($user);
    }

    public function confirmAccount(User $user)
    {
        $user->enabled = true;
        $user->confirmationToken = null;
        $user->email_verified_at = today();
        DB::beginTransaction();
        try {
            $user->update();
            DB::commit();
            return CustomResponse::buildSuccessResponse($user);
        } catch (Exception $e) {
            DB::rollback();
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite...");
        }
    }

    public function changeEmailOnRegister(Request $request, User $user)
    {
        $validators = Validator::make($request->all(), [
            'email' => 'email|unique:users,email|required'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        if ($user->enabled) {
            return CustomResponse::buildErrorResponse("Ce compte est déja activé, le mail ne peut pas être changé à cette étape...");
        }
        DB::beginTransaction();
        try {
            $user->update($request->only('email'));
            Mail::to($user)->send(new AccountConfirmEmail($user));
            DB::commit();
            return CustomResponse::buildSuccessResponse($user);
        } catch (\Throwable $th) {
            DB::rollback();
            return CustomResponse::buildErrorResponse("une erreur est survenue pendant le changement de l'email");
        }
    }

    /**
     * Mettre a jour le mot de passe de l'utilisateur
     * @author : Mamadou Fam
     * @since : 27/01/2021
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */

    public function changePassword(Request $request, User $user)
    {
        $validators = Validator::make($request->all(), [
            'currentPassword' => 'required|min:6',
            'password' => 'confirmed'
        ]);

        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        if (Hash::check($request->get('currentPassword'), $user->password)) {
            $user->password = Hash::make($request->password);
            $user->update();
        } else {
            return CustomResponse::buildErrorResponse("Le mot de passe actuel est incorrect");
        }
        return CustomResponse::buildSuccessResponse($user);
    }

    public function updatePhoto(Request $request, User $user)
    {
        $validators = Validator::make($request->all(), [
            'photo' => 'required'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        DB::beginTransaction();
        try {
            //supprimer l'ancienne photo
            if ($user->photo) {
                Storage::delete('users/' . $user->photo);
            }
            // convertir la photo en base64
            $photoFile = FileHelper::getFileFromBase64($request->photo);
            $extension = $photoFile->guessExtension();
            $filename = $request->email . '_' . uniqid() . '.' . $extension;
            $photoFile->storeAs('users', $filename);
            $user->photo = $filename;
            $user->update();
            DB::commit();
            return CustomResponse::buildSuccessResponse($user);
        } catch (Throwable $th) {
            DB::rollback();
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite pendant l'enregistrement...");
        }
    }


    /**
     * Enregistre l'invite comme user de meme le définit comme collaborateur de l'entreprise concerne
     * @author Cheikh Tidiane GUEYE
     * @since 03.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-14
     * @param  \Illuminate\Http\Request  $request
     * @return Object
     */
    public function storeUserFromInvitation(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'email|required|unique:users,email',
            'telephone' => 'starts_with:+|min:12|required',
            'profession' => 'required',
            'password' => 'required|min:6|confirmed',
            'uid' => 'required|exists:invitations,uid'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $user = new User($request->all());
        $user->password = Hash::make($request->password);
        $user->confirmationToken = uniqid();
        DB::beginTransaction();
        try {
            $user->save();
            if (!Auth::attempt($request->only('email', 'password'))) {
                return CustomResponse::buildErrorResponse(["Une erreur est survenue pendant la création du compte !"]);
            }
            $token = $request->user()->createToken($request->name);
            $invitation = Invitation::whereUid($request->uid)->first();
            $collaborateur = new Collaborateur();
            $collaborateur->entreprise_id = $invitation->entreprise_id;
            $user->collaborateurs()->save($collaborateur);
            $uidEntreprise = Entreprise::whereId($invitation->entreprise_id)->first('uid');
            $invitation = Invitation::whereUid($request->uid)->delete();
            Mail::to($user)->send(new AccountConfirmEmail($user));
            DB::commit();
            return CustomResponse::buildSuccessResponse(['token' => $token->plainTextToken, 'user' => $user, 'uidEntreprise' => $uidEntreprise->uid]);
        } catch (Throwable $th) {
            DB::rollBack();
            return CustomResponse::buildErrorResponse("Une erreur est survenue pendant votre inscription, merci de contacter l'administrateur...");
        }
    }

    /**
     * permet de filtrer les utilisateurs
     * @author Mamadou lamine BEYE
     * @since 12.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-69
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function filterUser(Request $request)
    {
        $data = User::query();

        if (request()->has('type')) {
            $data = $data->where('type', request('type'));
        }

        if ($request->input('type') == "collaborateur") {
            $data = $data->has('collaborateurs');
        }

        if (request()->has('enabled')) {
            $data = $data->where('enabled', request('enabled'));
        }

        if (request()->has('firstDate') &&  request()->has('secondDate')) {
            $data = $data->whereBetween('created_at', [request('firstDate'), request('secondDate')]);
        }

        if (request()->has('enabled')) {
            $data = $data->where('enabled', request('enabled'));
        }

        $data = $data->get();

        return CustomResponse::buildSuccessResponse($data);
    }
}
