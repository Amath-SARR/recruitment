<?php

use App\Models\DomaineIntervention;
use App\Models\Entreprise;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntrepriseDomaineInterventionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entreprise_domaine_interventions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Entreprise::class);
            $table->foreignIdFor(DomaineIntervention::class);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('entreprise_domaine_interventions');
    }
}
