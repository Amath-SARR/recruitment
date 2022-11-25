<?php

namespace App\Http\Controllers;

use App\Custom\CustomResponse;
use App\Models\Collaborateur;
use App\Models\Entreprise;
use Illuminate\Http\Request;
use SebastianBergmann\Environment\Console;

class CollaborateurController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Collaborateur  $collaborateur
     * @return \Illuminate\Http\Response
     */
    public function show(Collaborateur $collaborateur)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Collaborateur  $collaborateur
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Collaborateur $collaborateur)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Collaborateur  $collaborateur
     * @return \Illuminate\Http\Response
     */
    public function destroy(Collaborateur $collaborateur)
    {
        //
    }

    /**
     *
     * @author El Hadji Amath SARR
     * @link https://recrutore.atlassian.net/browse/RAD-37
     * @since 11.02.22
     * @param mixed $itemPerPage
     * @param $entreprise_id
     * @return array
     * @description Gère la pagination en affichant le nombre d'éléments mis en paramètre
     */
    public function paginate($itemsPerPage, $entreprise_id)
    {
        $collaborateurs = Collaborateur::where('entreprise_id', $entreprise_id)
            ->with('user')
            ->paginate($itemsPerPage);
        return CustomResponse::buildSuccessResponse($collaborateurs);
    }
}
