<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCampagneTypeOffreTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('campagne_type_offre', function (Blueprint $table) {
            $table->foreignId('campagne_id')->constrained('campagnes')->onDelete('cascade');
            $table->foreignId('type_offre_id')->constrained('type_offres')->onDelete('cascade');
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
        Schema::dropIfExists('campagne_type_offre');
    }
}
