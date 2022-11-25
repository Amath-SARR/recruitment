<?php

namespace App\Http\Controllers;

use Throwable;
use App\Custom\CustomResponse;
use App\Models\Follower;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowerController extends Controller
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
        if (!$request->exists('entreprise_id')) {
            return CustomResponse::buildErrorResponse("L'entreprise n'est pas définie !");
        }
        $oldFollowers = Follower::whereEntrepriseId($request->entreprise_id)
            ->whereUserId(Auth::id())
            ->get();
        if (count($oldFollowers)) {
            return CustomResponse::buildErrorResponse("Vous suivez déja cette entreprise !!!");
        }
        $follower = new Follower($request->all());
        $follower->user_id = Auth::id();
        try {
            $follower->save();
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite pendant l'enregistrement...");
        }
        return CustomResponse::buildSuccessResponse($follower);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Follower  $follower
     * @return \Illuminate\Http\Response
     */
    public function show(Follower $follower)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Follower  $follower
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Follower $follower)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Follower  $follower
     * @return \Illuminate\Http\Response
     */
    public function destroy(Follower $follower)
    {
        try {
            $follower->deleteOrFail();
        } catch (Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de suppression...");
        }
        return CustomResponse::buildSuccessResponse($follower);
    }
}
