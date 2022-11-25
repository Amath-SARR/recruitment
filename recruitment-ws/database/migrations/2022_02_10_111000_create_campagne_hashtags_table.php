<?php

use App\Models\Campagne;
use App\Models\Hashtag;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCampagneHashtagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('campagne_hashtags', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Campagne::class);
            $table->foreignIdFor(Hashtag::class);
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
        Schema::dropIfExists('campagne_hashtags');
    }
}
