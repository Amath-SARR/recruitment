<?php

use App\Models\Entreprise;
use App\Models\Campagne;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPosteToCandidaturesAddForeignKeyEntrepriseToCandidaturesAndUpdateAllFieldsForCandidacyToCandidatures extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('candidatures', function (Blueprint $table) {
            //fields add
            $table->string('poste')->nullable();
            $table->ForeignIdFor(Entreprise::class)->nullable();
            //fields update
            $table->ForeignIdFor(Campagne::class)->nullable()->change();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('candidatures', function (Blueprint $table) {
            $table->dropColumn('poste');

        });
    }
}
