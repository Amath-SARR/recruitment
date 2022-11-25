<?php

use App\Models\Campagne;
use App\Models\State;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCampagneStatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('campagne_states', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Campagne::class);
            $table->foreignIdFor(State::class);
            $table->integer('ordre');
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
        Schema::dropIfExists('campagne_states');
    }
}
