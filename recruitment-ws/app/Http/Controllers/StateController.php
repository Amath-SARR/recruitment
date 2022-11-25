<?php

namespace App\Http\Controllers;

use App\Custom\CustomResponse;
use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StateController extends Controller
{
    /**
     * Display a listing of the resource.
     * @author : Mariama Fatou Sarr DIOP
     * @since : 24/01/2021
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $states = State::orderBy('ordre','asc')->get();
        return CustomResponse::buildSuccessResponse($states);
    }

    /**
     * Display a listing of the resource.
     * @author : Mariama Fatou Sarr DIOP
     * @since : 29/01/2021
     *
     * @return \Illuminate\Http\Response
     */
    public function paginate($itemPerPage)
    {
        $states = State::orderBy('ordre','asc')->paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($states);
    }


    /**
     * Store a newly created resource in storage.
     * @author : Mariama Fatou Sarr DIOP
     * @since : 27/01/2021
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validators = Validator::make($request->all(), [
            'nom' => 'required|unique:states',
            'type' => 'required',
            'description' => 'required',
            'code'=>'required',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $state = new State($request->all());
        if($state->type=="initial"){
            $state->ordre=1;
        }
        elseif($state->type=="intermediaire"){
            $state->ordre=2;
        }
        else{
            $state->ordre=3;
        }
        if($state->type=="initial" && State::where('type','initial')->first()){
            return CustomResponse::buildErrorResponse("Un état initial existe déjà");
        }
        if($state->type=="final" && (State::where('type','final')->count())==2){
            return CustomResponse::buildErrorResponse("Plus de deux états finaux ne peuvent pas exister");
        }
        $state->code = strtoupper($request->code);
        DB::beginTransaction();
        try {
            $state->save();
            DB::commit();
            return CustomResponse::buildSuccessResponse($state);
        } catch (\Throwable $th) {
            DB::rollBack();
            return CustomResponse::buildErrorResponse("Une erreur est survenue...");
        }
    }


    /**
     * Update the specified resource in storage.
     * @author : Mariama Fatou Sarr DIOP
     * @since : 28/01/2021
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\State  $state
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, State $state)
    {
        $validators = Validator::make($request->all(),[
            'nom'=>'required|unique:states,nom,'.$state->id,
            'type'=>'required',
            'description'=>'required',
            'code'=>'required',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $state->code = strtoupper($request->code);
        DB::beginTransaction();
        try {
            $state->update($request->all());
            DB::commit();
            return CustomResponse::buildSuccessResponse($state);
        } catch (\Throwable $th) {
            DB::rollBack();
            return CustomResponse::buildErrorResponse("Une erreur est survenue...");
        }
    }

    /**
     * Remove the specified resource from storage.
     * @author : Mariama Fatou Sarr DIOP
     * @since : 28/01/2021
     * @param  \App\Models\State  $state
     * @return \Illuminate\Http\Response
     */
    public function destroy(State $state)
    {
        DB::beginTransaction();
        try {
            $state->delete();
            DB::commit();
            return CustomResponse::buildSuccessResponse($state);
        } catch (\Throwable $th) {
            DB::rollBack();
            return CustomResponse::buildErrorResponse("Une erreur est survenue...");
        }
    }
}
