<?php


namespace App\Http\Controllers;
use App\Custom\CustomResponse;
use App\Models\CategorieEmploi;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Stmt\TryCatch;

class CategorieEmploiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categorieEmploi = CategorieEmploi::all();
        return CustomResponse::buildSuccessResponse($categorieEmploi);
    }



    /**
     * Display a listing of the resource.
     * @author Abdou Aziz Sy NDIAYE
     * @since 27.01.22
     *
     * @return \Illuminate\Http\Response
     */
    public function paginate($itemPerPage)
    {
        $categorieEmploi = CategorieEmploi::paginate($itemPerPage);
        return CustomResponse::buildSuccessResponse($categorieEmploi);
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
            'name' => 'required|unique:categorie_emplois,name',

        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        $categorieEmploi=new CategorieEmploi($request->all());

        try {
            $categorieEmploi->save();

        } catch (\Throwable $th) {

            return CustomResponse::buildErrorResponse("Une erreur est survenue lors de la création de votre categorie d'emploi");
        }

        return CustomResponse::buildSuccessResponse($categorieEmploi);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(CategorieEmploi $categorieemploi)
    {
        return CustomResponse::buildSuccessResponse($categorieemploi);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CategorieEmploi $categorieemploi)
    {
        $validators = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        if ($validators->fails()) {
            return CustomResponse::buildValidationErrorResponse($validators->errors());
        }
        try
        {
            $categorieemploi->update($request->all());
        } catch (\Throwable $th) {

            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de la modification...");
        }
        return CustomResponse::buildSuccessResponse($categorieemploi);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param CategorieEmploi $categorie
     * @return \Illuminate\Http\Response
     */
    public function destroy(CategorieEmploi $categorieemploi)
    {
        try {
            $categorieemploi->delete();
        } catch (\Throwable $th) {
            return CustomResponse::buildErrorResponse("Une erreur inattendue s'est produite lors de la suppression...");
        }
        return CustomResponse::buildSuccessResponse($categorieemploi);
    }
}
