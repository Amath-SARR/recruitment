<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Invitation;
use App\Custom\CustomResponse;
use App\Mail\CollaborateurInvitationEmail;
use App\Models\Collaborateur;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvitationController extends Controller
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
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'email' => 'email|required',
            'prenoms' => 'required',
            'nom' => 'required',
            'entreprise_id' => 'required|exists:entreprises,id'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }

        $invite = Invitation::where('email', $request->email)
            ->where('entreprise_id', $request->entreprise_id)
            ->first();
        if ($invite) {
            return CustomResponse::buildErrorResponse("Désolé, cet utilisateur est dèja invité.");
        }
        $invitation = new Invitation($request->all());
        $invitation->user_id = Auth::id();
        $invitation->uid = uniqid();
        DB::beginTransaction();
        try {
            $invitation->save();
            Mail::to($invitation->email)->send(new CollaborateurInvitationEmail($invitation));
            DB::commit();
        } catch (\Throwable $th) {
            throw $th;
            return CustomResponse::buildErrorResponse("Une erreur est survenue lors de la création de votre invitation.");
        }

        return CustomResponse::buildSuccessResponse($invitation);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Invitation  $invitation
     * @return \Illuminate\Http\Response
     */
    public function show(Invitation $invitation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Invitation  $invitation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Invitation $invitation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Invitation  $invitation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Invitation $invitation)
    {
        //
    }

    /**
     * @description cette methode vérifie si le token d'invitation est valide
     * @author Cheikh Tidiane GUEYE
     * @since 03.02.22
     * @link https://recrutore.atlassian.net/browse/RAD-14
     * @param  \Illuminate\Http\Request  $request
     * @return Object
     */
    public function verifyToken(Request $request)
    {
        $validators = Validator::make($request->only('uid'), [
            'uid' => 'required|exists:invitations,uid'
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $invitation = Invitation::whereUid($request->uid)->with(['entreprise'])->first();
        DB::beginTransaction();
        try {
            $userToInvite = User::whereEmail($invitation->email)->first();
            if ($userToInvite) {
                $collaborateur = new Collaborateur();
                $collaborateur->user_id = $userToInvite->id;
                $collaborateur->entreprise_id = $invitation->entreprise_id;
                $collaborateur->save();
                $invitation->delete();
                DB::commit();
                return CustomResponse::buildSuccessResponse(["collaborated" => true, "invitation" => $invitation]);
            } else {
                return CustomResponse::buildSuccessResponse(["collaborated" => false, "invitation" => $invitation]);
            }
        } catch (\Throwable $th) {
            DB::rollback();
            return CustomResponse::buildErrorResponse("Erreur survenue...");
        }
    }
}
