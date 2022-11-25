<?php

use App\Models\Entreprise;
use App\Models\TypeOffre;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCampagnesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('campagnes', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Entreprise::class);
            $table->string('titre')->unique()->require();
            $table->string('photo')->require();
            $table->string('lieu')->require();
            $table->date('lancement')->require();
            $table->date('cloture')->require();
            $table->text('description')->require();
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
        Schema::dropIfExists('campagnes');
    }
}
